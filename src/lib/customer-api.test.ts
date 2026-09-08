import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bookingDepartments } from '../data/booking-departments.ts';
import { formServiceCatalog, OTHER_FORM_SERVICE } from '../data/form-landing.ts';
import {
  assertCustomerRequestAllowed,
  createMemoryRateLimiter,
  enforceCustomerRateLimit,
  parseCustomerLeadBody,
  parseCustomerLeadFromFormData,
  parseCustomerLeadFromUrlEncoded,
} from './customer-api.ts';

describe('parseCustomerLeadBody', () => {
  it('accepts a valid lead with a known booking department', () => {
    const result = parseCustomerLeadBody({
      name: 'عبدالله محمد',
      phone: '0551234567',
      department: 'قسم الأسنان',
      service: 'ignored',
      locale: 'en',
      consent: true,
    }, { page: '/en/book', departments: bookingDepartments });

    assert.equal(result.ok, true);
    if (!result.ok || result.kind !== 'lead') throw new Error('expected lead');
    assert.equal(result.lead.department, 'قسم الأسنان');
    assert.equal(result.lead.service, 'قسم الأسنان');
    assert.equal(result.lead.locale, 'en');
    assert.equal(result.lead.page, '/en/book');
  });

  it('accepts a specialty with a matching service', () => {
    const result = parseCustomerLeadBody({
      name: 'عبدالله محمد',
      phone: '0551234567',
      department: 'أسنان',
      service: 'زراعة الأسنان',
      locale: 'ar',
      consent: true,
    }, { page: '/form', departments: ['أسنان', 'جلدية'], services: formServiceCatalog });

    assert.equal(result.ok, true);
    if (!result.ok || result.kind !== 'lead') throw new Error('expected lead');
    assert.equal(result.lead.department, 'أسنان');
    assert.equal(result.lead.service, 'زراعة الأسنان');
  });

  it('accepts other services for dentistry and dermatology', () => {
    for (const department of ['أسنان', 'جلدية'] as const) {
      const result = parseCustomerLeadBody({
        name: 'عبدالله محمد',
        phone: '0551234567',
        department,
        service: OTHER_FORM_SERVICE,
        locale: 'ar',
        consent: true,
      }, { page: '/form', departments: ['أسنان', 'جلدية'], services: formServiceCatalog });

      assert.equal(result.ok, true);
      if (!result.ok || result.kind !== 'lead') throw new Error('expected lead');
      assert.equal(result.lead.department, department);
      assert.equal(result.lead.service, OTHER_FORM_SERVICE);
    }
  });

  it('rejects a service that does not belong to the specialty', () => {
    const result = parseCustomerLeadBody({
      name: 'عبدالله محمد',
      phone: '0551234567',
      department: 'أسنان',
      service: 'الليزر',
      locale: 'ar',
      consent: true,
    }, { departments: ['أسنان', 'جلدية'], services: formServiceCatalog });

    assert.deepEqual(result, { ok: false, status: 422 });
  });

  it('rejects unknown departments', () => {
    const result = parseCustomerLeadBody({
      name: 'Abdullah',
      phone: '0551234567',
      department: 'أسنان',
      locale: 'ar',
      consent: true,
    }, { departments: bookingDepartments });

    assert.deepEqual(result, { ok: false, status: 422 });
  });

  it('accepts a native form POST with consent=true', () => {
    const params = new URLSearchParams({
      name: 'test222',
      phone: '0500000000',
      department: 'قسم الأسنان',
      locale: 'ar',
      consent: 'true',
    });

    const result = parseCustomerLeadFromUrlEncoded(params, { departments: bookingDepartments });
    assert.equal(result.ok, true);
    if (!result.ok || result.kind !== 'lead') throw new Error('expected lead');
    assert.equal(result.lead.name, 'test222');
    assert.equal(result.lead.phone, '0500000000');
    assert.equal(result.lead.department, 'قسم الأسنان');
  });

  it('accepts a multipart FormData POST from ClientRouter', () => {
    const formData = new FormData();
    formData.set('name', 'test222');
    formData.set('phone', '0500000000');
    formData.set('department', 'أسنان');
      formData.set('service', 'زراعة الأسنان');
      formData.set('locale', 'ar');
      formData.set('consent', 'true');

    const result = parseCustomerLeadFromFormData(formData, {
      departments: ['أسنان', 'جلدية'],
      services: formServiceCatalog,
    });
    assert.equal(result.ok, true);
    if (!result.ok || result.kind !== 'lead') throw new Error('expected lead');
    assert.equal(result.lead.department, 'أسنان');
    assert.equal(result.lead.service, 'زراعة الأسنان');
  });

  it('rejects a native form POST without consent', () => {
    const params = new URLSearchParams({
      name: 'test222',
      phone: '0500000000',
      department: 'قسم الأسنان',
    });

    assert.deepEqual(
      parseCustomerLeadFromUrlEncoded(params, { departments: bookingDepartments }),
      { ok: false, status: 422 },
    );
  });

  it('treats honeypot submissions as successful no-ops', () => {
    const result = parseCustomerLeadBody({
      name: 'bot',
      phone: '0551234567',
      department: 'قسم الليزر',
      consent: true,
      website: 'https://spam.example',
    }, { departments: bookingDepartments });

    assert.deepEqual(result, { ok: true, kind: 'honeypot' });
  });
});

describe('assertCustomerRequestAllowed', () => {
  it('requires exact Origin and blocks cross-site Fetch Metadata', () => {
    const url = new URL('https://falclinic.com/api/customers');
    const ok = new Request(url, {
      headers: {
        Origin: 'https://falclinic.com',
        'Sec-Fetch-Site': 'same-origin',
      },
    });
    assert.equal(assertCustomerRequestAllowed(ok, url), true);

    const cross = new Request(url, {
      headers: {
        Origin: 'https://falclinic.com',
        'Sec-Fetch-Site': 'cross-site',
      },
    });
    assert.equal(assertCustomerRequestAllowed(cross, url), false);

    const missing = new Request(url, {
      headers: { 'Sec-Fetch-Site': 'same-origin' },
    });
    assert.equal(assertCustomerRequestAllowed(missing, url), false);
  });
});

describe('enforceCustomerRateLimit', () => {
  it('fails closed when the binding is missing in production mode', async () => {
    assert.equal(
      await enforceCustomerRateLimit(null, 'customers:1', { failClosed: true }),
      'unavailable',
    );
  });

  it('honors Cloudflare-style limiter results', async () => {
    const limiter = {
      async limit() {
        return { success: false };
      },
    };
    assert.equal(
      await enforceCustomerRateLimit(limiter, 'customers:1', { failClosed: true }),
      'limited',
    );
  });

  it('fails closed when the limiter throws in production mode', async () => {
    const limiter = {
      async limit() {
        throw new Error('binding unavailable');
      },
    };
    assert.equal(
      await enforceCustomerRateLimit(limiter, 'customers:1', { failClosed: true }),
      'unavailable',
    );
  });
});

describe('createMemoryRateLimiter', () => {
  it('allows traffic under the limit and blocks once exceeded', () => {
    const limiter = createMemoryRateLimiter(2, 60_000);
    assert.equal(limiter.allow('ip-a', 1_000), true);
    assert.equal(limiter.allow('ip-a', 1_100), true);
    assert.equal(limiter.allow('ip-a', 1_200), false);
    assert.equal(limiter.allow('ip-b', 1_200), true);
  });

  it('resets after the window elapses', () => {
    const limiter = createMemoryRateLimiter(1, 1_000);
    assert.equal(limiter.allow('ip-a', 1_000), true);
    assert.equal(limiter.allow('ip-a', 1_500), false);
    assert.equal(limiter.allow('ip-a', 2_001), true);
  });
});

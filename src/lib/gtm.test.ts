import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GtmEvents, isValidGtmId, resolveContactEvent, resolveGtmId, sanitizeGtmPayload } from './gtm.ts';

describe('resolveGtmId', () => {
  it('accepts a real container id', () => {
    assert.equal(resolveGtmId('GTM-ABC1234'), 'GTM-ABC1234');
  });

  it('rejects placeholders and empty values', () => {
    assert.equal(resolveGtmId('GTM-XXXXXXX'), '');
    assert.equal(resolveGtmId(''), '');
    assert.equal(resolveGtmId(undefined), '');
    assert.equal(isValidGtmId('GTM-XXXXXXX'), false);
  });
});

describe('sanitizeGtmPayload', () => {
  it('strips department, service, and personal fields', () => {
    assert.deepEqual(
      sanitizeGtmPayload({
        form_id: 'booking',
        method: 'whatsapp',
        department: 'قسم الليزر',
        service: 'قسم الليزر',
        name: 'Ali',
        phone: '0551234567',
      }),
      {
        form_id: 'booking',
        method: 'whatsapp',
      },
    );
  });
});

describe('resolveContactEvent', () => {
  it('maps tel: links to call events', () => {
    assert.equal(resolveContactEvent('tel:+966551234567'), GtmEvents.contactCall);
  });

  it('maps mailto: links to email events', () => {
    assert.equal(resolveContactEvent('mailto:info@falclinic.com'), GtmEvents.contactEmail);
  });

  it('maps WhatsApp links to whatsapp events', () => {
    assert.equal(resolveContactEvent('https://wa.me/966551234567'), GtmEvents.contactWhatsapp);
    assert.equal(resolveContactEvent('https://api.whatsapp.com/send?phone=966551234567'), GtmEvents.contactWhatsapp);
  });

  it('returns null for non-contact links', () => {
    assert.equal(resolveContactEvent('https://falclinic.com/services'), null);
    assert.equal(resolveContactEvent('/book'), null);
  });
});

// NOTE: The astro:after-swap page_view listener inside Gtm.astro runs in the
// browser only and cannot be unit-tested here. The key invariant is:
//   • astro:after-swap fires ONLY on SPA navigations (View Transitions), never
//     on initial page load, so the GTM container's own gtm.js page_view on
//     first load is not duplicated.
// This behaviour is covered by E2E smoke tests via the built Cloudflare app.

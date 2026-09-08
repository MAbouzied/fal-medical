import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildPhoneUrl,
  buildWhatsAppUrl,
  clinicLineFromDepartment,
  clinicLines,
  clinicSocialLinks,
  getClinicLine,
} from './contact.ts';

describe('clinic social links', () => {
  it('exposes Instagram, TikTok, and Snapchat profiles', () => {
    assert.deepEqual(
      clinicSocialLinks.map((link) => link.id),
      ['instagram', 'tiktok', 'snapchat'],
    );
  });

  it('uses https profile URLs with accessible bilingual labels', () => {
    for (const link of clinicSocialLinks) {
      assert.match(link.href, /^https:\/\//);
      assert.ok(link.labelAr.trim().length > 0);
      assert.ok(link.labelEn.trim().length > 0);
      assert.ok(link.icon.startsWith('/assets/'));
    }
  });
});

describe('clinic contact lines', () => {
  it('exposes dental and dermatology numbers', () => {
    assert.equal(clinicLines.length, 2);
    assert.equal(getClinicLine('dental').number, '966557034280');
    assert.equal(getClinicLine('dermatology').number, '966557034280');
    assert.equal(getClinicLine('dental').phoneDisplay, '055 703 4280');
  });

  it('keeps display text aligned with dialable numbers', () => {
    for (const line of clinicLines) {
      assert.equal(buildPhoneUrl(line.id), `tel:+${line.number}`);
      assert.equal(buildWhatsAppUrl(undefined, line.id), `https://wa.me/${line.number}`);
      assert.match(line.phoneDisplay, /^(05\d \d{3} \d{4}|9200 \d{5})$/);
    }
  });

  it('builds tel links for each clinic line', () => {
    assert.equal(buildPhoneUrl('dental'), 'tel:+966557034280');
    assert.equal(buildPhoneUrl('dermatology'), 'tel:+966557034280');
  });

  it('builds WhatsApp links for each clinic line', () => {
    assert.equal(buildWhatsAppUrl(undefined, 'dental'), 'https://wa.me/966557034280');
    assert.equal(
      buildWhatsAppUrl('Hello', 'dermatology'),
      `https://wa.me/966557034280?text=${encodeURIComponent('Hello')}`,
    );
  });

  it('maps departments to clinic lines', () => {
    assert.equal(clinicLineFromDepartment('أسنان'), 'dental');
    assert.equal(clinicLineFromDepartment('Dentistry'), 'dental');
    assert.equal(clinicLineFromDepartment('جلدية'), 'dermatology');
    assert.equal(clinicLineFromDepartment('Dermatology'), 'dermatology');
    assert.equal(clinicLineFromDepartment('قسم الجلدية'), 'dermatology');
    assert.equal(clinicLineFromDepartment('قسم الليزر'), 'dermatology');
    assert.equal(clinicLineFromDepartment('زراعة الأسنان'), 'dental');
    assert.equal(clinicLineFromDepartment('الليزر'), 'dermatology');
    assert.equal(clinicLineFromDepartment('الفيلر والبوتوكس'), 'dermatology');
    assert.equal(clinicLineFromDepartment(''), 'dermatology');
  });
});

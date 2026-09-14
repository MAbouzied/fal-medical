import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { clinicLicenses } from './licenses.ts';

const root = fileURLToPath(new URL('../..', import.meta.url));

describe('clinicLicenses', () => {
  it('uses Fal commercial registration numbers from the Ministry of Commerce certificate', () => {
    assert.equal(clinicLicenses.companyNameAr, 'مجمع فال الخليج الطبي');
    assert.equal(clinicLicenses.entityTypeAr, 'مؤسسة فردية');
    assert.equal(clinicLicenses.unifiedNationalNumber, '70423834890');
    assert.equal(clinicLicenses.commercialRegistrationNumber, '2511147226');
    assert.equal(clinicLicenses.municipalLicenseNumber, '');
    assert.equal(clinicLicenses.crIssueDate, '1446/06/04');
    assert.match(clinicLicenses.licensedActivityAr, /الأسنان والجلدية/);
    assert.doesNotMatch(clinicLicenses.licensedActivityAr, /تغذية|نساء|علاج طبيعي/);
    assert.doesNotMatch(clinicLicenses.licensedActivityEn, /nutrition|obstetrics|physiotherapy/i);
  });

  it('links the footer certificate to the Fal commercial registration PDF', async () => {
    assert.equal(
      clinicLicenses.commercialRegistrationCertificate,
      '/assets/licenses/commercial-registration.pdf',
    );
    const pdf = `${root}/public/assets/licenses/commercial-registration.pdf`;
    assert.equal(existsSync(pdf), true);
    const header = readFileSync(pdf).subarray(0, 5).toString('ascii');
    assert.equal(header, '%PDF-');

    const footer = readFileSync(new URL('../components/site/SiteFooter.astro', import.meta.url), 'utf8');
    assert.match(footer, /commercialRegistrationCertificate/);
    assert.match(footer, /type="application\/pdf"/);
  });

  it('replaces the Beauty Corner commercial registration image', () => {
    const png = readFileSync(`${root}/public/assets/licenses/commercial-registration.png`);
    assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG');
    assert.ok(png.length > 20_000);
  });
});

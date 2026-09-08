import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { clinicFacts } from './clinic-facts.ts';
import { clinicGeo, clinicMapUrl } from './seo.ts';

describe('clinic map facts', () => {
  it('points to a Hafar Al Batin search listing until the official Maps pin is set', () => {
    assert.match(clinicMapUrl, /^https:\/\/www\.google\.com\/maps\/search\//);
    assert.ok(decodeURIComponent(clinicMapUrl).includes(clinicFacts.cityAr));
    assert.equal(clinicGeo.latitude, 28.4089);
    assert.equal(clinicGeo.longitude, 45.9658);
    assert.equal(clinicFacts.cityEn, 'Hafar Al Batin');
  });

  it('uses a location button on the home booking band instead of an embed', async () => {
    const sections = await readFile(
      new URL('../components/landing/LandingSections.astro', import.meta.url),
      'utf8',
    );
    const consult = await readFile(
      new URL('../components/services/ServicesConsultBand.astro', import.meta.url),
      'utf8',
    );

    assert.doesNotMatch(sections, /<iframe/);
    assert.doesNotMatch(sections, /output=embed/);
    assert.match(sections, /ServicesConsultBand/);
    assert.match(consult, /clinicMapUrl/);
    assert.match(consult, /location\.svg/);
  });
});

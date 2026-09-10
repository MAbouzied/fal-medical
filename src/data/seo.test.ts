import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { clinicFacts } from './clinic-facts.ts';
import { clinicGeo, clinicMapEmbedUrl, clinicMapUrl } from './seo.ts';

describe('clinic map facts', () => {
  it('points to a Hafar Al Batin search listing until the official Maps pin is set', () => {
    assert.match(clinicMapUrl, /^https:\/\/www\.google\.com\/maps\/search\//);
    assert.ok(decodeURIComponent(clinicMapUrl).includes(clinicFacts.cityAr));
    assert.equal(clinicGeo.latitude, 28.4089);
    assert.equal(clinicGeo.longitude, 45.9658);
    assert.equal(clinicFacts.cityEn, 'Hafar Al Batin');
  });

  it('embeds Google Maps from www.google.com with clinic coordinates (CSP-safe)', () => {
    assert.match(clinicMapEmbedUrl('ar'), /^https:\/\/www\.google\.com\/maps\?/);
    assert.match(clinicMapEmbedUrl('ar'), /28\.4089,45\.9658/);
    assert.match(clinicMapEmbedUrl('ar'), /output=embed/);
    assert.match(clinicMapEmbedUrl('ar'), /hl=ar/);
    assert.match(clinicMapEmbedUrl('en'), /hl=en/);
    assert.doesNotMatch(clinicMapEmbedUrl('ar'), /maps\.google\.com/);
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

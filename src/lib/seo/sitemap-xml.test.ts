import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildSitemapXml,
  escapeXml,
  isSitemapHostIndexable,
  sitemapNotIndexableResponse,
  sitemapUnavailableResponse,
} from './sitemap-xml.ts';

describe('sitemap XML helpers', () => {
  it('escapes XML special characters', () => {
    assert.equal(escapeXml(`a&b<"'>`), 'a&amp;b&lt;&quot;&apos;&gt;');
  });

  it('builds bilingual entries with hreflang alternates', () => {
    const xml = buildSitemapXml(new URL('https://fal-ksa.com'), [
      {
        id: 'home',
        ar: '/',
        en: '/en',
        indexable: true,
        inSitemap: true,
        changefreq: 'weekly',
        priority: 1,
      },
    ]);
    assert.match(xml, /<loc>https:\/\/fal-ksa\.com\/<\/loc>/);
    assert.match(xml, /hreflang="en"/);
    assert.match(xml, /hreflang="x-default"/);
  });

  it('returns a noindex 503 payload on failure', () => {
    const response = sitemapUnavailableResponse(90);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Retry-After'), '90');
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  });

  it('hides the sitemap on non-indexable hosts', () => {
    assert.equal(
      isSitemapHostIndexable({ indexable: true, host: 'fal-ksa.com' }),
      true,
    );
    assert.equal(
      isSitemapHostIndexable({ indexable: true, host: 'www.fal-ksa.com' }),
      true,
    );
    assert.equal(
      isSitemapHostIndexable({ indexable: false, host: 'fal-ksa.com' }),
      false,
    );
    assert.equal(
      isSitemapHostIndexable({ indexable: true, host: 'staging.example.com' }),
      false,
    );
    assert.equal(sitemapNotIndexableResponse().status, 404);
  });
});

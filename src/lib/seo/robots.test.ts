import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildRobotsTxt } from './robots.ts';

describe('buildRobotsTxt', () => {
  it('allows crawling only when indexable on production host', () => {
    const body = buildRobotsTxt({
      indexable: true,
      host: 'fal-ksa.com',
      sitemapUrl: 'https://fal-ksa.com/sitemap.xml',
    });
    assert.match(body, /Allow: \//);
    assert.match(body, /Sitemap: https:\/\/fal-ksa\.com\/sitemap\.xml/);
    assert.doesNotMatch(body, /Disallow: \/$/m);
  });

  it('disallows all crawlers when not indexable', () => {
    const body = buildRobotsTxt({
      indexable: false,
      host: 'fal-ksa.com',
      sitemapUrl: 'https://fal-ksa.com/sitemap.xml',
    });
    assert.match(body, /Disallow: \//);
    assert.equal(body.includes('Sitemap:'), false);
  });
});


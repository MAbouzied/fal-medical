import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildRobotsTxt } from './robots.ts';

describe('buildRobotsTxt', () => {
  it('allows crawling only when indexable on production host', () => {
    const body = buildRobotsTxt({
      indexable: true,
      host: 'falclinic.com',
      sitemapUrl: 'https://falclinic.com/sitemap.xml',
    });
    assert.match(body, /Allow: \//);
    assert.match(body, /Sitemap: https:\/\/falclinic\.com\/sitemap\.xml/);
    assert.doesNotMatch(body, /Disallow: \/$/m);
  });

  it('disallows all crawlers when not indexable', () => {
    const body = buildRobotsTxt({
      indexable: false,
      host: 'falclinic.com',
      sitemapUrl: 'https://falclinic.com/sitemap.xml',
    });
    assert.match(body, /Disallow: \//);
    assert.equal(body.includes('Sitemap:'), false);
  });
});


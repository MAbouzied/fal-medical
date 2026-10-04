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
    assert.match(body, /Disallow: \/api\//);
    assert.match(body, /Disallow: \/admin/);
    assert.match(body, /Disallow: \/login/);
    assert.match(body, /Disallow: \/form/);
    assert.match(body, /Sitemap: https:\/\/falclinic\.com\/sitemap\.xml/);
    assert.match(body, /Host: https:\/\/falclinic\.com/);
    assert.doesNotMatch(body, /Disallow: \/$/m);
  });

  it('blocks crawlers on non-indexable hosts but allows link previews', () => {
    const body = buildRobotsTxt({
      indexable: false,
      host: 'falclinic.com',
      sitemapUrl: 'https://falclinic.com/sitemap.xml',
    });
    assert.match(body, /User-agent: WhatsApp/);
    assert.match(body, /Disallow: \//);
    assert.equal(body.includes('Sitemap:'), false);
  });
});


import { test, expect } from '@playwright/test';
import { createFakeRateLimiter, createFakeSheetsBinding } from '../fixtures/fake-bindings';
import { getPublishedMockPosts } from '../fixtures/mock-blog';
import { buildRobotsTxt } from '../../src/lib/seo/robots';
import { buildSitemapXml, sitemapUnavailableResponse } from '../../src/lib/seo/sitemap-xml';

/**
 * SEO / route contract stubs.
 * Live preview coverage can later hit a built Worker; these assert Phase 3 helpers.
 */
test.describe('SEO route contracts', () => {
  test('fake Sheets binding accepts a booking row', async () => {
    const sheets = createFakeSheetsBinding();
    const result = await sheets.append({
      name: 'Test',
      phone: '0500000000',
      source: 'book',
    });
    expect(result.ok).toBe(true);
    expect(result.rowCount).toBe(1);
    expect(sheets.rows).toHaveLength(1);
  });

  test('fake rate limiter fails closed after the quota', async () => {
    const limiter = createFakeRateLimiter(2);
    expect((await limiter.limit()).success).toBe(true);
    expect((await limiter.limit()).success).toBe(true);
    expect((await limiter.limit()).success).toBe(false);
  });

  test('published mock posts are ready for sitemap/listing stubs', () => {
    const posts = getPublishedMockPosts();
    expect(posts.map((post) => post.slug)).toEqual(['mock-published-post']);
  });

  test('robots.txt allows production only when indexable', () => {
    const allowed = buildRobotsTxt({
      indexable: true,
      host: 'falclinic.com',
      sitemapUrl: 'https://falclinic.com/sitemap.xml',
    });
    expect(allowed).toContain('Allow: /');
    expect(allowed).toContain('Sitemap:');

    const blocked = buildRobotsTxt({
      indexable: false,
      host: 'falclinic.com',
      sitemapUrl: 'https://falclinic.com/sitemap.xml',
    });
    expect(blocked).toContain('Disallow: /');
    expect(blocked).not.toContain('Sitemap:');
  });

  test('sitemap unavailable response is plain-text 503 with noindex', async () => {
    const response = sitemapUnavailableResponse(120);
    expect(response.status).toBe(503);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(await response.text()).toMatch(/unavailable/i);
  });

  test('sitemap XML excludes private paths by construction', () => {
    const xml = buildSitemapXml(new URL('https://falclinic.com'), [
      {
        id: 'home',
        ar: '/',
        en: '/en',
        indexable: true,
        inSitemap: true,
        priority: 1,
      },
    ]);
    expect(xml).toContain('https://falclinic.com/');
    expect(xml).not.toContain('/admin');
    expect(xml).not.toContain('/login');
  });
});

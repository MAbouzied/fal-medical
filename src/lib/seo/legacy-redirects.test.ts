import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  buildCloudflareRedirectsFile,
  buildLegacyRedirectLocation,
  normalizeLegacyPathname,
  resolveLegacyRedirect,
  resolveTrailingSlashRedirect,
  shouldApplyLegacyRedirect,
} from './legacy-redirects.ts';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');

describe('normalizeLegacyPathname', () => {
  it('strips trailing slash except root', () => {
    assert.equal(normalizeLegacyPathname('/home/'), '/home');
    assert.equal(normalizeLegacyPathname('/'), '/');
  });

  it('decodes percent-encoded Arabic segments', () => {
    assert.equal(
      normalizeLegacyPathname('/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/'),
      '/خدمات',
    );
  });

  it('lowercases ASCII path segments only', () => {
    assert.equal(normalizeLegacyPathname('/Home'), '/home');
    assert.equal(normalizeLegacyPathname('/Product/VIP'), '/product/vip');
  });
});

describe('resolveLegacyRedirect', () => {
  it('maps exact Arabic and English legacy pages 1:1', () => {
    assert.equal(resolveLegacyRedirect('/home'), '/');
    assert.equal(resolveLegacyRedirect('/home/'), '/');
    assert.equal(resolveLegacyRedirect('/حجز-موعد'), '/book');
    assert.equal(resolveLegacyRedirect('/خدمات'), '/services');
    assert.equal(resolveLegacyRedirect('/اتصل'), '/contact');
    assert.equal(resolveLegacyRedirect('/مدونة'), '/blogs');
    assert.equal(resolveLegacyRedirect('/حول'), '/');
    assert.equal(resolveLegacyRedirect('/blog'), '/blogs');
    assert.equal(resolveLegacyRedirect('/contact-us'), '/contact');
    assert.equal(resolveLegacyRedirect('/about'), '/');
    assert.equal(resolveLegacyRedirect('/about-us'), '/');
  });

  it('maps encoded Arabic legacy pages', () => {
    assert.equal(
      resolveLegacyRedirect('/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/'),
      '/services',
    );
    assert.equal(resolveLegacyRedirect('/%D8%A7%D8%AA%D8%B5%D9%84'), '/contact');
    assert.equal(resolveLegacyRedirect('/%D9%85%D8%AF%D9%88%D9%86%D8%A9'), '/blogs');
    assert.equal(resolveLegacyRedirect('/%D8%AD%D9%88%D9%84/'), '/');
  });

  it('sends product taxonomy and ecommerce leftovers to home', () => {
    assert.equal(resolveLegacyRedirect('/product'), '/');
    assert.equal(resolveLegacyRedirect('/product/any-slug'), '/');
    assert.equal(resolveLegacyRedirect('/product-category/spa'), '/');
    assert.equal(resolveLegacyRedirect('/tag/test'), '/');
    assert.equal(resolveLegacyRedirect('/author/test'), '/');
    assert.equal(resolveLegacyRedirect('/category/news'), '/');
    assert.equal(resolveLegacyRedirect('/shop'), '/');
    assert.equal(resolveLegacyRedirect('/cart'), '/');
    assert.equal(resolveLegacyRedirect('/checkout'), '/');
    assert.equal(resolveLegacyRedirect('/wishlist'), '/');
    assert.equal(resolveLegacyRedirect('/my-account'), '/');
    assert.equal(resolveLegacyRedirect('/products-compare'), '/');
    assert.equal(resolveLegacyRedirect('/السلة'), '/');
  });

  it('sends common WordPress junk paths to home', () => {
    assert.equal(resolveLegacyRedirect('/hello-world'), '/');
    assert.equal(resolveLegacyRedirect('/wp-login.php'), '/');
    assert.equal(resolveLegacyRedirect('/wp-admin'), '/');
    assert.equal(resolveLegacyRedirect('/wp-admin/options'), '/');
    assert.equal(resolveLegacyRedirect('/wp-content/uploads/x.jpg'), '/');
    assert.equal(resolveLegacyRedirect('/wp-json/wp/v2/posts'), '/');
    assert.equal(resolveLegacyRedirect('/feed'), '/');
    assert.equal(resolveLegacyRedirect('/comments/feed'), '/');
    assert.equal(resolveLegacyRedirect('/footer-about-widget'), '/');
    assert.equal(resolveLegacyRedirect('/footer-subscription'), '/');
  });

  it('sends leftover WordPress content slugs without equivalents to home', () => {
    assert.equal(resolveLegacyRedirect('/الخدمات-البدنية'), '/');
    assert.equal(resolveLegacyRedirect('/كيف-نزيد-عدد-الزيارات؟'), '/');
    assert.equal(resolveLegacyRedirect('/sample-page'), '/');
  });

  it('does not match prefix false positives like /production', () => {
    assert.equal(resolveLegacyRedirect('/production'), null);
    assert.equal(resolveLegacyRedirect('/products'), null);
  });

  it('does not redirect current app routes, APIs, auth, or assets', () => {
    const keep = [
      '/',
      '/services',
      '/doctors',
      '/doctors/hanan-helal',
      '/devices',
      '/contact',
      '/book',
      '/form',
      '/privacy',
      '/blogs',
      '/blogs/some-post',
      '/en',
      '/en/services',
      '/en/book',
      '/en/form',
      '/api/customers',
      '/api/auth/signin',
      '/admin',
      '/admin/create',
      '/login',
      '/_astro/client.js',
      '/assets/logo.png',
      '/sitemap.xml',
      '/robots.txt',
    ];
    for (const path of keep) {
      assert.equal(resolveLegacyRedirect(path), null, `should keep ${path}`);
    }
  });

  it('maps Beauty Corner doctor urls to Fal placeholder profiles', () => {
    assert.equal(resolveLegacyRedirect('/doctors/dentistry-fatima'), '/doctors/mohamed-tahhan');
    assert.equal(resolveLegacyRedirect('/doctors/dentistry-wissam'), '/doctors/nibraj');
    assert.equal(resolveLegacyRedirect('/doctors/dermatology-hala'), '/doctors/hanan-helal');
    assert.equal(resolveLegacyRedirect('/en/doctors/dentistry-fatima'), '/en/doctors/mohamed-tahhan');
  });

  it('keeps Beauty Corner service urls as live Fal catalog pages', () => {
    assert.equal(resolveLegacyRedirect('/services/hydrafacial'), null);
    assert.equal(resolveLegacyRedirect('/services/filler-botox'), null);
    assert.equal(resolveLegacyRedirect('/services/body-contouring'), null);
    assert.equal(resolveLegacyRedirect('/services/dental-implants'), null);
    assert.equal(resolveLegacyRedirect('/services/teeth-whitening'), null);
    assert.equal(resolveLegacyRedirect('/en/services/hydrafacial'), null);
    assert.equal(resolveLegacyRedirect('/en/services/dental-veneers'), null);
    assert.equal(resolveLegacyRedirect('/services/nutrition'), '/services');
    assert.equal(resolveLegacyRedirect('/en/services/physiotherapy'), '/en/services');
    assert.equal(resolveLegacyRedirect('/services'), null);
    assert.equal(resolveLegacyRedirect('/en/services'), null);
  });

  it('does not create loops when already on the target path', () => {
    assert.equal(resolveLegacyRedirect('/'), null);
    assert.equal(resolveLegacyRedirect('/services'), null);
    assert.equal(resolveLegacyRedirect('/contact'), null);
    assert.equal(resolveLegacyRedirect('/blogs'), null);
  });
});

describe('buildLegacyRedirectLocation', () => {
  it('preserves the query string on the redirect target', () => {
    assert.equal(buildLegacyRedirectLocation('/', '?utm=1'), '/?utm=1');
    assert.equal(buildLegacyRedirectLocation('/services', '?ref=wp'), '/services?ref=wp');
    assert.equal(buildLegacyRedirectLocation('/contact', ''), '/contact');
  });
});

describe('buildCloudflareRedirectsFile', () => {
  it('emits 301 rules for exact and prefix legacy paths', () => {
    const body = buildCloudflareRedirectsFile();
    assert.match(body, /^\/home \/ 301$/m);
    assert.match(body, /^\/home\/ \/ 301$/m);
    assert.match(body, /^\/blog \/blogs 301$/m);
    assert.match(body, /^\/product\/\* \/ 301$/m);
    assert.match(body, /^\/خدمات \/services 301$/m);
    assert.match(body, /^\/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA \/services 301$/m);
    assert.match(body, /^\/wp-content\/\* \/ 301$/m);
  });

  it('keeps public/_redirects synchronized with the builder', () => {
    const disk = readFileSync(join(repoRoot, 'public/_redirects'), 'utf8');
    assert.equal(disk, buildCloudflareRedirectsFile());
  });
});

describe('shouldApplyLegacyRedirect', () => {
  it('applies only to GET and HEAD', () => {
    assert.equal(shouldApplyLegacyRedirect('GET'), true);
    assert.equal(shouldApplyLegacyRedirect('HEAD'), true);
    assert.equal(shouldApplyLegacyRedirect('POST'), false);
    assert.equal(shouldApplyLegacyRedirect('PUT'), false);
  });
});

describe('resolveTrailingSlashRedirect', () => {
  it('returns canonical slashless path for current app routes with trailing slash', () => {
    assert.equal(resolveTrailingSlashRedirect('/services/'), '/services');
    assert.equal(resolveTrailingSlashRedirect('/services/dental-implants/'), '/services/dental-implants');
    assert.equal(resolveTrailingSlashRedirect('/doctors/'), '/doctors');
    assert.equal(resolveTrailingSlashRedirect('/en/services/'), '/en/services');
    assert.equal(resolveTrailingSlashRedirect('/contact/'), '/contact');
    assert.equal(resolveTrailingSlashRedirect('/book/'), '/book');
  });

  it('returns null for root path so root is never redirected', () => {
    assert.equal(resolveTrailingSlashRedirect('/'), null);
  });

  it('returns null when no trailing slash is present', () => {
    assert.equal(resolveTrailingSlashRedirect('/services'), null);
    assert.equal(resolveTrailingSlashRedirect('/doctors'), null);
    assert.equal(resolveTrailingSlashRedirect('/contact'), null);
  });

  it('preserves multi-segment paths correctly', () => {
    assert.equal(
      resolveTrailingSlashRedirect('/services/teeth-whitening/'),
      '/services/teeth-whitening',
    );
  });

  it('legacy /home/ still resolves in one hop via resolveLegacyRedirect, not trailing-slash', () => {
    // resolveLegacyRedirect handles /home/ → / directly (one hop)
    assert.equal(resolveLegacyRedirect('/home/'), '/');
    // resolveTrailingSlashRedirect would naively strip to /home, but middleware
    // never reaches it for legacy paths since resolveLegacyRedirect fires first.
    assert.equal(resolveTrailingSlashRedirect('/home/'), '/home');
  });

  it('encoded Arabic /خدمات/ resolves in one hop via resolveLegacyRedirect', () => {
    assert.equal(resolveLegacyRedirect('/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/'), '/services');
  });
});

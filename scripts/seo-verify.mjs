import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST_ROOT = join(ROOT, 'dist');
const DIST = existsSync(join(DIST_ROOT, 'client')) ? join(DIST_ROOT, 'client') : DIST_ROOT;

function walkHtmlFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    if (entry === '_astro' || entry === 'assets') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkHtmlFiles(full, files);
    else if (extname(full) === '.html') files.push(full);
  }
  return files;
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
}

/**
 * Detects Astro's trailing-slash redirect stubs (e.g. /book/ → /book).
 * These files have <meta http-equiv="refresh"> but no real content.
 * Exported for unit testing.
 */
export function isRedirectStub(html) {
  return /<meta[^>]+http-equiv=["']refresh["']/i.test(html);
}

function extract(html, regex) {
  const matches = [];
  let match;
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
  while ((match = re.exec(html)) !== null) matches.push(match[1]?.trim() ?? match[0]);
  return matches;
}

function fileToRoute(file) {
  const rel = file.slice(DIST.length).replaceAll('\\', '/');
  if (rel === '/404.html' || rel.endsWith('/404.html')) return null;
  if (rel === '/index.html') return '/';
  if (rel.endsWith('/index.html')) return rel.slice(0, -'/index.html'.length) || '/';
  return rel.replace(/\.html$/, '');
}

function hasEnKey(contentEn, id) {
  return (
    contentEn.includes(`'${id}':`) ||
    contentEn.includes(`"${id}":`) ||
    new RegExp(`(?:^|\\n)\\s*${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*\\{`).test(contentEn)
  );
}

function main() {
  const errors = [];
  const warnings = [];

  if (!existsSync(DIST)) {
    console.error('dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const servicesSrc = readFileSync(join(ROOT, 'src/data/services.ts'), 'utf8');
  const doctorsSrc = readFileSync(join(ROOT, 'src/data/doctors.ts'), 'utf8');
  const contentEn = readFileSync(join(ROOT, 'src/lib/i18n/content-en.ts'), 'utf8');
  const serviceIds = [...servicesSrc.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
  const doctorIds = [...doctorsSrc.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
  for (const id of serviceIds) {
    if (!hasEnKey(contentEn, id)) errors.push(`Missing EN translation for service: ${id}`);
  }
  for (const id of doctorIds) {
    if (!hasEnKey(contentEn, id)) errors.push(`Missing EN translation for doctor: ${id}`);
  }

  const htmlFiles = walkHtmlFiles(DIST);
  const titles = new Map();
  const descriptions = new Map();
  const routes = [];

  for (const file of htmlFiles) {
    const route = fileToRoute(file);
    if (route === null) continue;
    const html = readFileSync(file, 'utf8');
    // Skip trailing-slash redirect stubs that Astro emits (e.g. /book/ → /book).
    // These have <meta http-equiv="refresh"> but no real SEO content.
    if (isRedirectStub(html)) continue;
    routes.push(route);
    const body = stripTags(html);

    const title = extract(html, /<title>([^<]*)<\/title>/i)[0];
    const description =
      extract(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)[0] ||
      extract(html, /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i)[0];
    const canonical =
      extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i)[0] ||
      extract(html, /<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i)[0];
    const robots = extract(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)[0] || '';
    const h1s = extract(body, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i).map((h) =>
      h.replace(/<[^>]+>/g, '').trim(),
    );
    const hreflangs = extract(html, /hreflang=["']([^"']+)["']/i);
    const jsonLdBlocks = extract(
      html,
      /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
    );

    if (!title) errors.push(`${route}: missing <title>`);
    if (!description) errors.push(`${route}: missing meta description`);
    if (title) {
      const list = titles.get(title) ?? [];
      list.push(route);
      titles.set(title, list);
    }
    if (description) {
      const list = descriptions.get(description) ?? [];
      list.push(route);
      descriptions.set(description, list);
      if (description.length < 70 || description.length > 180) {
        warnings.push(`${route}: description length ${description.length} (aim 70–180)`);
      }
    }

    const isNoindex = /noindex/i.test(robots);
    if (!isNoindex && !canonical) errors.push(`${route}: missing canonical`);
    if (canonical && !canonical.startsWith('https://falclinic.com')) {
      errors.push(`${route}: canonical not on production host: ${canonical}`);
    }
    if (canonical) {
      try {
        const url = new URL(canonical);
        const canonicalPath = url.pathname.replace(/\/$/, '') || '/';
        const routePath = route.replace(/\/$/, '') || '/';
        if (canonicalPath !== routePath) {
          errors.push(`${route}: canonical path ${url.pathname} differs from file route`);
        }
      } catch {
        errors.push(`${route}: invalid canonical URL`);
      }
    }

    if (h1s.length === 0) errors.push(`${route}: missing H1`);
    if (h1s.length > 1) errors.push(`${route}: multiple H1 (${h1s.length})`);

    if (!isNoindex) {
      const isArabicOnly = route === '/blogs' || route.startsWith('/blogs/');
      if (isArabicOnly) {
        if (!hreflangs.includes('ar') || !hreflangs.includes('x-default')) {
          errors.push(`${route}: Arabic-only page missing ar/x-default hreflang`);
        }
        if (hreflangs.includes('en')) {
          errors.push(`${route}: Arabic-only page must not emit English hreflang`);
        }
        if (html.includes('og:locale:alternate')) {
          errors.push(`${route}: Arabic-only page must not emit og:locale:alternate`);
        }
        if (html.includes('/en/blogs')) {
          errors.push(`${route}: references nonexistent /en/blogs`);
        }
      } else if (
        !hreflangs.includes('ar') ||
        !hreflangs.includes('en') ||
        !hreflangs.includes('x-default')
      ) {
        errors.push(`${route}: missing reciprocal hreflang set (ar/en/x-default)`);
      }
      if (html.includes('/en/404')) errors.push(`${route}: hreflang references /en/404`);
    }

    for (const block of jsonLdBlocks) {
      try {
        const data = JSON.parse(block);
        const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
        const types = graph.map((node) => node['@type']).filter(Boolean);
        if (!types.includes('MedicalClinic')) warnings.push(`${route}: JSON-LD missing MedicalClinic`);
        if (!types.includes('WebSite')) warnings.push(`${route}: JSON-LD missing WebSite`);
      } catch {
        errors.push(`${route}: invalid JSON-LD`);
      }
    }
  }

  for (const [title, list] of titles) {
    if (list.length > 1) errors.push(`Duplicate title "${title}" on: ${list.join(', ')}`);
  }
  for (const [desc, list] of descriptions) {
    if (list.length > 1) errors.push(`Duplicate description "${desc.slice(0, 48)}…" on: ${list.join(', ')}`);
  }

  // Sitemap and robots are SSR routes (prerender = false).
  // Re-run sitemap XML unit tests here so structural generation bugs fail seo:verify.
  const sitemapTest = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--test',
      'src/lib/seo/sitemap-xml.test.ts',
      'src/lib/seo/robots.test.ts',
    ],
    { cwd: ROOT, encoding: 'utf8' },
  );
  if (sitemapTest.status !== 0) {
    errors.push('sitemap/robots unit coverage failed during seo:verify');
    if (sitemapTest.stdout) console.error(sitemapTest.stdout);
    if (sitemapTest.stderr) console.error(sitemapTest.stderr);
  }

  const sitemapRoutePath = join(ROOT, 'src/pages/sitemap.xml.ts');
  if (!existsSync(sitemapRoutePath)) {
    errors.push('src/pages/sitemap.xml.ts missing (SSR sitemap route)');
  } else {
    const sitemapRoute = readFileSync(sitemapRoutePath, 'utf8');
    if (!sitemapRoute.includes('prerender = false')) {
      errors.push('sitemap.xml.ts must set prerender = false');
    }
    if (!sitemapRoute.includes('buildSitemapXml')) {
      errors.push('sitemap.xml.ts must build XML via buildSitemapXml');
    }
    if (!sitemapRoute.includes('sitemapUnavailableResponse')) {
      errors.push('sitemap.xml.ts must return sitemapUnavailableResponse on failure');
    }
    if (!sitemapRoute.includes('isSitemapHostIndexable') || !sitemapRoute.includes('SEO_INDEXABLE')) {
      errors.push('sitemap.xml.ts must gate output with SEO_INDEXABLE / isSitemapHostIndexable');
    }
  }
  if (existsSync(join(DIST, 'sitemap.xml'))) {
    warnings.push('dist/sitemap.xml present; prefer SSR-only sitemap.xml.ts');
  }

  const robotsRoutePath = join(ROOT, 'src/pages/robots.txt.ts');
  const robotsHelperPath = join(ROOT, 'src/lib/seo/robots.ts');
  if (!existsSync(robotsRoutePath)) {
    errors.push('src/pages/robots.txt.ts missing (SSR robots route)');
  } else {
    const robotsRoute = readFileSync(robotsRoutePath, 'utf8');
    if (!robotsRoute.includes('prerender = false')) {
      errors.push('robots.txt.ts must set prerender = false');
    }
    if (!robotsRoute.includes('buildRobotsTxt')) {
      errors.push('robots.txt.ts must use buildRobotsTxt');
    }
    if (!robotsRoute.includes('/sitemap.xml')) {
      errors.push('robots.txt.ts missing sitemap URL wiring');
    }
  }
  if (!existsSync(robotsHelperPath)) {
    errors.push('src/lib/seo/robots.ts missing');
  } else {
    const robotsHelper = readFileSync(robotsHelperPath, 'utf8');
    if (!robotsHelper.includes('Sitemap: ${options.sitemapUrl}')) {
      errors.push('robots.ts must emit Sitemap line from sitemapUrl when indexable');
    }
  }
  if (existsSync(join(ROOT, 'public/robots.txt'))) {
    errors.push('public/robots.txt must not exist; robots is served by src/pages/robots.txt.ts');
  }

  const landing = readFileSync(join(ROOT, 'src/data/landing.ts'), 'utf8');
  if (landing.includes('[الافتتاح]') || landing.includes('[تاريخ')) {
    errors.push('landing.ts still contains visible placeholders');
  }
  const landingSections = readFileSync(
    join(ROOT, 'src/components/landing/LandingSections.astro'),
    'utf8',
  );
  if (landingSections.includes('اقرأ المقال') || landingSections.includes('مساحة مخصصة لخريطة')) {
    errors.push('LandingSections still contains placeholder/dead article UI');
  }

  // 404 page checks — must be real HTML so the Worker can serve Astro 404s.
  const notFoundPath = join(DIST, '404.html');
  if (!existsSync(notFoundPath)) {
    errors.push('404.html missing from build output');
  } else {
    const html = readFileSync(notFoundPath, 'utf8');
    if (isRedirectStub(html)) {
      errors.push('404.html is a trailing-slash redirect stub; emit a real 404 page');
    }
    if (!/noindex/i.test(html)) errors.push('404.html missing noindex');
    if (!/data-404-page/i.test(html)) errors.push('404.html missing data-404-page marker');
    if (/nofollow/i.test(html) && !/noindex,\s*follow/i.test(html)) {
      warnings.push('404.html uses nofollow; prefer noindex, follow');
    }
    if (html.includes('hreflang') && html.includes('/en/404')) {
      errors.push('404.html references /en/404 in hreflang');
    }
  }

  // Critical public pages must exist as real HTML (not refresh stubs).
  // With trailingSlash:never + build.format:file these are *.html files.
  const requiredHtmlFiles = [
    'services.html',
    'doctors.html',
    'contact.html',
    'book.html',
    'privacy.html',
    'en.html',
    'en/services.html',
    'en/doctors.html',
    'en/contact.html',
    'en/book.html',
    'en/privacy.html',
  ];
  for (const rel of requiredHtmlFiles) {
    const full = join(DIST, rel);
    if (!existsSync(full)) {
      errors.push(`missing built page: ${rel}`);
      continue;
    }
    const html = readFileSync(full, 'utf8');
    if (isRedirectStub(html)) {
      errors.push(`${rel} is a redirect stub instead of real page HTML`);
    }
  }

  const wranglerPath = join(ROOT, 'wrangler.jsonc');
  if (!existsSync(wranglerPath)) {
    errors.push('wrangler.jsonc missing');
  } else {
    try {
      const wranglerRaw = readFileSync(wranglerPath, 'utf8')
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/,\s*([}\]])/g, '$1');
      const wrangler = JSON.parse(wranglerRaw);
      const assets = wrangler?.assets ?? {};
      if (assets.not_found_handling !== 'none') {
        errors.push('wrangler.jsonc must set assets.not_found_handling to none so Worker handles misses');
      }
      if (assets.run_worker_first !== false) {
        errors.push('wrangler.jsonc must set assets.run_worker_first to false so _redirects apply before Worker');
      }
      if (assets.html_handling !== 'drop-trailing-slash') {
        errors.push('wrangler.jsonc must set assets.html_handling to drop-trailing-slash');
      }
    } catch {
      errors.push('wrangler.jsonc could not be parsed for assets checks');
    }
  }

  const redirectsPath = join(DIST, '_redirects');
  if (!existsSync(redirectsPath)) {
    errors.push('dist _redirects missing; public/_redirects must ship with assets');
  } else {
    const redirects = readFileSync(redirectsPath, 'utf8');
    for (const rule of ['/home / 301', '/blog /blogs 301', '/product/* / 301']) {
      if (!redirects.includes(rule)) {
        errors.push(`_redirects missing required rule: ${rule}`);
      }
    }
  }

  console.log(`SEO verify scanned ${routes.length} HTML routes from ${DIST}`);
  for (const warning of warnings) console.warn(`WARN: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    console.error(`\nSEO verify failed with ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`SEO verify passed with ${warnings.length} warning(s).`);
}

// Only run the CLI when this file is executed directly (not when unit tests import helpers).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

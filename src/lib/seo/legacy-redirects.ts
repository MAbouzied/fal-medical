/**
 * Beauty Corner doctor slugs that must not stay on Fal URLs.
 * Checked before SKIP_PREFIXES because `/doctors` and `/en` are current-app prefixes.
 */
const IDENTITY_REDIRECTS: Readonly<Record<string, string>> = {
  '/doctors/dentistry-fatima': '/doctors/mohamed-tahhan',
  '/doctors/dentistry-wissam': '/doctors/nibraj',
  '/doctors/dermatology-hala': '/doctors/hanan-helal',
  '/doctors/dentistry': '/doctors/mohamed-tahhan',
  '/doctors/oral-surgery': '/doctors/nibraj',
  '/doctors/dermatology': '/doctors/hanan-helal',
  '/en/doctors/dentistry-fatima': '/en/doctors/mohamed-tahhan',
  '/en/doctors/dentistry-wissam': '/en/doctors/nibraj',
  '/en/doctors/dermatology-hala': '/en/doctors/hanan-helal',
  '/en/doctors/dentistry': '/en/doctors/mohamed-tahhan',
  '/en/doctors/oral-surgery': '/en/doctors/nibraj',
  '/en/doctors/dermatology': '/en/doctors/hanan-helal',
};

const SERVICE_REDIRECTS: Readonly<Record<string, string>> = {
  '/services/nutrition': '/services',
  '/services/obstetrics-gynecology': '/services',
  '/services/physiotherapy': '/services',
  '/en/services/nutrition': '/en/services',
  '/en/services/obstetrics-gynecology': '/en/services',
  '/en/services/physiotherapy': '/en/services',
};

/** Exact WordPress / legacy paths → new Fal Clinic routes. */
const EXACT_LEGACY_REDIRECTS: Readonly<Record<string, string | undefined>> = {
  '/home': '/',
  '/حول': '/',
  '/about': '/',
  '/about-us': '/',
  '/حجز-موعد': '/book',
  '/خدمات': '/services',
  '/اتصل': '/contact',
  '/contact-us': '/contact',
  '/مدونة': '/blogs',
  '/blog': '/blogs',
  '/السلة': '/',
  '/shop': '/',
  '/cart': '/',
  '/checkout': '/',
  '/wishlist': '/',
  '/my-account': '/',
  '/products-compare': '/',
  '/hello-world': '/',
  '/sample-page': '/',
  '/wp-login.php': '/',
  '/feed': '/',
  '/comments/feed': '/',
  '/footer-about-widget': '/',
  '/footer-subscription': '/',
  // Archived WP posts/pages with no Astro equivalent → home.
  '/الخدمات-البدنية': '/',
  '/آخر-الأخبار-المهمة-في-التكنولوجيا': '/',
  '/أنواع-البطاقات-الذكية-والرقمية': '/',
  '/الترجمة-والكتابة-بالحديث': '/',
  '/تصاميم-حديثة-وإبداعية': '/',
  '/كيف-نزيد-عدد-الزيارات؟': '/',
  '/وظائف-المستقبل-مع-الذكاء-الاصطناعي': '/',
};

/**
 * Prefixes that always redirect to home. Matched on segment boundaries so
 * `/product` and `/product/x` match but `/production` does not.
 */
const HOME_PREFIXES: readonly string[] = [
  '/product',
  '/product-category',
  '/tag',
  '/author',
  '/category',
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/wp-json',
];

/** Paths that belong to the new app / platform and must never be rewritten. */
const SKIP_PREFIXES: readonly string[] = [
  '/api',
  '/admin',
  '/login',
  '/_astro',
  '/assets',
  '/en',
  '/services',
  '/doctors',
  '/devices',
  '/contact',
  '/book',
  '/form',
  '/privacy',
  '/blogs',
];

const SKIP_EXACT: ReadonlySet<string> = new Set([
  '/',
  '/sitemap.xml',
  '/robots.txt',
  '/favicon.ico',
  '/404',
]);

function decodePathnameSafely(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function lowercaseAsciiSegments(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname
    .split('/')
    .map((segment) => {
      if (!segment) return segment;
      // Only transform pure ASCII segments (slug, file, english words).
      if (/^[\x00-\x7F]+$/.test(segment)) return segment.toLowerCase();
      return segment;
    })
    .join('/');
}

export function normalizeLegacyPathname(pathname: string): string {
  const raw = pathname.split(/[?#]/)[0] || '/';
  const decoded = decodePathnameSafely(raw);
  const withoutTrailing =
    decoded.length > 1 && decoded.endsWith('/') ? decoded.slice(0, -1) : decoded || '/';
  return lowercaseAsciiSegments(withoutTrailing || '/');
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function shouldSkipPath(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true;
  return SKIP_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

/**
 * Returns the redirect target pathname for a legacy WordPress URL, or null
 * when the request should continue to the current app unchanged.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = normalizeLegacyPathname(pathname);
  const identityTarget = IDENTITY_REDIRECTS[normalized];
  if (identityTarget) return identityTarget;

  const serviceTarget = SERVICE_REDIRECTS[normalized];
  if (serviceTarget) return serviceTarget;

  if (shouldSkipPath(normalized)) return null;

  const exact = EXACT_LEGACY_REDIRECTS[normalized];
  if (exact) {
    return exact === normalized ? null : exact;
  }

  for (const prefix of HOME_PREFIXES) {
    if (matchesPrefix(normalized, prefix)) return '/';
  }

  return null;
}

export function buildLegacyRedirectLocation(targetPath: string, search: string): string {
  const query = search.startsWith('?') ? search : search ? `?${search}` : '';
  return `${targetPath}${query}`;
}

export function shouldApplyLegacyRedirect(method: string): boolean {
  const upper = method.toUpperCase();
  return upper === 'GET' || upper === 'HEAD';
}

function encodeRedirectPath(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join('/');
}

function pushExactRedirectRule(lines: string[], from: string, to: string): void {
  lines.push(`${from} ${to} 301`);
  if (!from.endsWith('/')) lines.push(`${from}/ ${to} 301`);
}

/**
 * Cloudflare Workers `_redirects` rules mirroring middleware mappings.
 * Kept as a static-asset safety net when a request is served before the Worker.
 * Non-ASCII paths also emit percent-encoded aliases for crawler request forms.
 */
export function buildCloudflareRedirectsFile(): string {
  const lines = [
    '# Generated from src/lib/seo/legacy-redirects.ts — do not hand-edit.',
    '# Beauty Corner identity aliases → Fal placeholders',
  ];

  for (const [from, to] of Object.entries(IDENTITY_REDIRECTS)) {
    pushExactRedirectRule(lines, from, to);
  }

  lines.push('# Unused Fal specialty urls → services listing');
  for (const [from, to] of Object.entries(SERVICE_REDIRECTS)) {
    pushExactRedirectRule(lines, from, to);
  }

  lines.push('# Exact legacy paths');

  for (const [from, to] of Object.entries(EXACT_LEGACY_REDIRECTS)) {
    if (!to || to === from) continue;
    pushExactRedirectRule(lines, from, to);
    const encoded = encodeRedirectPath(from);
    if (encoded !== from) pushExactRedirectRule(lines, encoded, to);
  }

  lines.push('# Prefix buckets with no Astro equivalent → home');
  // Non-splat rules first (Cloudflare performance recommendation).
  for (const prefix of HOME_PREFIXES) {
    lines.push(`${prefix} / 301`);
    lines.push(`${prefix}/ / 301`);
  }
  for (const prefix of HOME_PREFIXES) {
    lines.push(`${prefix}/* / 301`);
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Returns the canonical slashless path when the request pathname has a
 * trailing slash (any path except root). Preserves the raw pathname so the
 * caller can append the original query string via buildLegacyRedirectLocation.
 *
 * Run AFTER resolveLegacyRedirect in middleware so that legacy paths like
 * `/home/` are handled in a single hop (legacy redirect: `/home/` → `/`)
 * rather than two hops (`/home/` → `/home` → `/`).
 */
export function resolveTrailingSlashRedirect(pathname: string): string | null {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return null;
}

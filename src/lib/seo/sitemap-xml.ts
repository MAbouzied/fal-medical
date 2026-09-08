import { isProductionHost } from '../../data/site.ts';
import type { RoutePair } from '../i18n/routes.ts';

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function buildSitemapXml(site: URL, pairs: readonly RoutePair[]): string {
  const urls = pairs.flatMap((pair) => {
    const arabicLoc = new URL(pair.ar, site).href;
    const englishLoc = pair.en ? new URL(pair.en, site).href : null;
    const lastmod = pair.lastmod;

    const arabicEntry = {
      loc: arabicLoc,
      changefreq: pair.changefreq ?? 'monthly',
      priority: pair.priority,
      lastmod,
      alternates: {
        ar: arabicLoc,
        en: englishLoc,
      },
    };

    if (!englishLoc) return [arabicEntry];

    return [
      arabicEntry,
      {
        loc: englishLoc,
        changefreq: pair.changefreq ?? 'monthly',
        priority: pair.priority,
        lastmod,
        alternates: {
          ar: arabicLoc,
          en: englishLoc,
        },
      },
    ];
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((entry) => {
    const priority =
      entry.priority !== undefined ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : '';
    const lastmod = entry.lastmod
      ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
      : '';
    const alternateLinks = entry.alternates.en
      ? `
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(entry.alternates.ar)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(entry.alternates.en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.alternates.ar)}" />`
      : `
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(entry.alternates.ar)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.alternates.ar)}" />`;

    return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <changefreq>${entry.changefreq}</changefreq>${priority}${lastmod}${alternateLinks}
  </url>`;
  })
  .join('\n')}
</urlset>
`;
}

export function sitemapUnavailableResponse(retryAfterSeconds = 120): Response {
  return new Response('Sitemap temporarily unavailable', {
    status: 503,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Retry-After': String(retryAfterSeconds),
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}

/** Non-indexable hosts must not expose a crawlable URL inventory. */
export function sitemapNotIndexableResponse(): Response {
  return new Response('Sitemap unavailable on non-indexable hosts.', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}

export function isSitemapHostIndexable(options: {
  indexable: boolean;
  host: string;
}): boolean {
  return options.indexable === true && isProductionHost(options.host);
}

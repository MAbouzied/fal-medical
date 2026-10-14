import type { APIRoute } from 'astro';
import { SEO_INDEXABLE } from 'astro:env/server';
import { isProductionHost } from '../data/site';
import { buildRobotsTxt } from '../lib/seo/robots';

export const prerender = false;

export const GET: APIRoute = async ({ site, url }) => {
  if (!site) {
    return new Response('Astro site URL must be configured.', { status: 500 });
  }

  const body = buildRobotsTxt({
    indexable: SEO_INDEXABLE === true,
    host: url.hostname,
    sitemapUrl: new URL(
      '/sitemap.xml',
      isProductionHost(url.hostname) ? new URL(`${url.protocol}//${url.host}`) : site,
    ).href,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

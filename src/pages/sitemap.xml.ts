import type { APIRoute } from 'astro';
import { SEO_INDEXABLE } from 'astro:env/server';
import {
  BLOG_CACHE_MAX_AGE_SECONDS,
  BLOG_CACHE_SWR_SECONDS,
  blogListingCacheTags,
} from '../modules/blog/cache';
import { getSitemapRoutePairs } from '../lib/i18n/routes';
import {
  buildSitemapXml,
  isSitemapHostIndexable,
  sitemapNotIndexableResponse,
  sitemapUnavailableResponse,
} from '../lib/seo/sitemap-xml';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const site = context.site;
  if (!site) {
    return new Response('Astro site URL must be configured.', { status: 500 });
  }

  if (
    !isSitemapHostIndexable({
      indexable: SEO_INDEXABLE === true,
      host: context.url.hostname,
    })
  ) {
    return sitemapNotIndexableResponse();
  }

  try {
    const pairs = await getSitemapRoutePairs();
    if (context.cache?.enabled) {
      context.cache.set({
        maxAge: BLOG_CACHE_MAX_AGE_SECONDS,
        swr: BLOG_CACHE_SWR_SECONDS,
        tags: blogListingCacheTags(),
      });
    }

    const body = buildSitemapXml(site, pairs);
    return new Response(body, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `public, max-age=${BLOG_CACHE_MAX_AGE_SECONDS}`,
      },
    });
  } catch (error) {
    console.error('[sitemap] Failed to build sitemap.', error);
    return sitemapUnavailableResponse();
  }
};

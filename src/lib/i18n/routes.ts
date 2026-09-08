import { doctors } from '../../data/doctors';
import { clinicServices } from '../../data/services';
import {
  BLOG_PAGE_SIZE,
  lastmodForPost,
  listingPathForPage,
  paginatePosts,
  selectListing,
} from '../../modules/blog';
import { blogPath } from '../../modules/blog/lib/slug.ts';
import type { BlogPost } from '../../modules/blog';
import { doctorsEn, servicesEn } from './content-en';

export type Locale = 'ar' | 'en';

export interface RoutePair {
  /** Stable id e.g. 'home', 'services', 'service:dental-implants', 'doctor:dentistry', 'contact', 'book', 'privacy', 'not-found' */
  id: string;
  ar: string;
  /** English counterpart. Omit for Arabic-only routes such as blog. */
  en?: string;
  /** Whether search engines should index this route */
  indexable: boolean;
  /** Include in sitemap.xml */
  inSitemap: boolean;
  changefreq?: 'weekly' | 'monthly';
  /** Same priority for both locales — no language-based priority difference */
  priority?: number;
  /** ISO date (YYYY-MM-DD) for sitemap lastmod when content-dated. */
  lastmod?: string;
}

export const BOOK_INDEXING_DECISION = {
  indexBookSeparately: true,
  reason:
    'Index /book as appointment-conversion intent; /contact as location/NAP/contact intent. Distinct titles/descriptions required.',
} as const;

function normalizePathname(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || '/';
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

/** Blog launch is Arabic-only for every provider (mock or Sanity). */
export function isBlogPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return path === '/blogs' || path.startsWith('/blogs/');
}

const staticRoutePairs: readonly RoutePair[] = [
  {
    id: 'home',
    ar: '/',
    en: '/en',
    indexable: true,
    inSitemap: true,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    id: 'services',
    ar: '/services',
    en: '/en/services',
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    id: 'doctors',
    ar: '/doctors',
    en: '/en/doctors',
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    id: 'devices',
    ar: '/devices',
    en: '/en/devices',
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    id: 'contact',
    ar: '/contact',
    en: '/en/contact',
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    id: 'book',
    ar: '/book',
    en: '/en/book',
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    id: 'form',
    ar: '/form',
    en: '/en/form',
    indexable: false,
    inSitemap: false,
  },
  {
    id: 'privacy',
    ar: '/privacy',
    en: '/en/privacy',
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    id: 'blogs',
    ar: '/blogs',
    indexable: true,
    inSitemap: true,
    changefreq: 'weekly',
    priority: 0.7,
  },
  // Conceptual only — 404 content is localized from the requested path.
  // Do not emit hreflang to a nonexistent /en/404 page.
  {
    id: 'not-found',
    ar: '/404',
    en: '/404',
    indexable: false,
    inSitemap: false,
  },
];

function buildServiceRoutePairs(): RoutePair[] {
  return clinicServices.map((service) => ({
    id: `service:${service.id}`,
    ar: `/services/${service.id}`,
    en: `/en/services/${service.id}`,
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.7,
  }));
}

function buildDoctorRoutePairs(): RoutePair[] {
  return doctors.map((doctor) => ({
    id: `doctor:${doctor.id}`,
    ar: `/doctors/${doctor.id}`,
    en: `/en/doctors/${doctor.id}`,
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly',
    priority: 0.7,
  }));
}

/** Article + pagination pairs from the active blog repository (not mock-coupled). */
export function buildBlogSitemapRoutePairs(posts: readonly BlogPost[]): RoutePair[] {
  const listing = selectListing(posts);
  const pairs: RoutePair[] = listing.allPublished.map((post) => ({
    id: `blog:${post.slug}`,
    ar: blogPath(post.slug),
    indexable: true,
    inSitemap: true,
    changefreq: 'monthly' as const,
    priority: 0.6,
    lastmod: lastmodForPost(post.publishedAt, post.updatedAt),
  }));

  const firstPage = paginatePosts(listing.recent, 1, BLOG_PAGE_SIZE);
  const totalPages = firstPage?.totalPages ?? 1;
  for (let page = 2; page <= totalPages; page += 1) {
    pairs.push({
      id: `blogs:page:${page}`,
      ar: listingPathForPage(page),
      indexable: true,
      inSitemap: true,
      changefreq: 'weekly',
      priority: 0.5,
    });
  }

  return pairs;
}

let allRoutePairsCache: RoutePair[] | undefined;

function getCachedRoutePairs(): RoutePair[] {
  if (!allRoutePairsCache) {
    allRoutePairsCache = [
      ...staticRoutePairs,
      ...buildServiceRoutePairs(),
      ...buildDoctorRoutePairs(),
    ];
  }
  return allRoutePairsCache;
}

export function getAllRoutePairs(): RoutePair[] {
  return [...getCachedRoutePairs()];
}

export function getIndexableRoutePairs(): RoutePair[] {
  return getCachedRoutePairs().filter((pair) => pair.indexable && pair.inSitemap);
}

export async function getSitemapRoutePairs(): Promise<RoutePair[]> {
  const { getBlogRepository } = await import('../../modules/blog/repository/get-blog-repository.ts');
  const posts = await getBlogRepository().getPublishedPosts();
  return [
    ...getIndexableRoutePairs(),
    ...buildBlogSitemapRoutePairs(posts),
  ];
}

export function findRoutePair(pathname: string): RoutePair | undefined {
  const normalized = normalizePathname(pathname);
  if (isBlogPath(normalized)) {
    if (normalized === '/blogs') {
      return getCachedRoutePairs().find((pair) => pair.id === 'blogs');
    }
    // Dynamic blog URLs are Arabic-only and indexable even when not pre-registered.
    return {
      id: `blog-path:${normalized}`,
      ar: normalized,
      indexable: true,
      inSitemap: true,
      changefreq: 'monthly',
      priority: 0.6,
    };
  }
  return getCachedRoutePairs().find(
    (pair) => pair.ar === normalized || (pair.en !== undefined && pair.en === normalized),
  );
}

export function getAlternateLocalePath(
  pathname: string,
  targetLocale: Locale,
): string | undefined {
  const pair = findRoutePair(pathname);
  if (!pair) return undefined;
  if (targetLocale === 'ar') return pair.ar;
  return pair.en;
}

export function hasLocaleCounterpart(pathname: string, locale: Locale): boolean {
  const pair = findRoutePair(pathname);
  if (!pair || !pair.indexable) return false;
  return locale === 'ar' ? pair.ar.length > 0 : Boolean(pair.en);
}

export function isArabicOnlyRoute(pathname: string): boolean {
  if (isBlogPath(pathname)) return true;
  const pair = findRoutePair(pathname);
  return Boolean(pair && pair.ar && !pair.en);
}

export function assertTranslationCompleteness(): void {
  const missingServices = clinicServices
    .filter((service) => !servicesEn[service.id])
    .map((service) => service.id);

  const missingDoctors = doctors
    .filter((doctor) => !doctorsEn[doctor.id])
    .map((doctor) => doctor.id);

  const errors: string[] = [];

  if (missingServices.length > 0) {
    errors.push(
      `Missing English translations for services: ${missingServices.join(', ')}. Add entries to servicesEn in content-en.ts.`,
    );
  }

  if (missingDoctors.length > 0) {
    errors.push(
      `Missing English translations for doctors: ${missingDoctors.join(', ')}. Add entries to doctorsEn in content-en.ts.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

if (import.meta.env.PROD) {
  assertTranslationCompleteness();
}

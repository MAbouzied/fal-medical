import {
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from 'astro:env/server';
import type { BlogRepository } from './blog-repository.ts';
import { createSanityBlogRepository } from './sanity-blog-repository.ts';

let cachedRepository: BlogRepository | undefined;

/** Server composition root — uses Astro env and caches the Sanity repository per process. */
export function getBlogRepository(): BlogRepository {
  if (!cachedRepository) {
    cachedRepository = createSanityBlogRepository({
      projectId: SANITY_PROJECT_ID || 'ilyfhm76',
      dataset: SANITY_DATASET || 'production',
      apiVersion: SANITY_API_VERSION || '2026-08-03',
      token: SANITY_API_TOKEN,
    });
  }
  return cachedRepository;
}

/** Test helper. */
export function resetBlogRepositoryCache(): void {
  cachedRepository = undefined;
}

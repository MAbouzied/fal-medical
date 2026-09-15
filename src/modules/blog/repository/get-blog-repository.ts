import {
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
      // Public production is readable without a token. Do not attach
      // SANITY_API_TOKEN here: admin uses SANITY_WRITE_TOKEN / SANITY_AUTH_TOKEN
      // instead, and a Viewer token without production access 403s /blogs.
    });
  }
  return cachedRepository;
}

/** Test helper. */
export function resetBlogRepositoryCache(): void {
  cachedRepository = undefined;
}

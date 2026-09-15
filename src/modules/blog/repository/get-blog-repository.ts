import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from 'astro:env/server';
import type { BlogRepository } from './blog-repository.ts';
import { createSanityBlogRepository } from './sanity-blog-repository.ts';

let cachedRepository: BlogRepository | undefined;

/** Public published reads — no token. Viewer tokens belong on private datasets only. */
export function getBlogRepository(): BlogRepository {
  if (!cachedRepository) {
    cachedRepository = createSanityBlogRepository({
      projectId: SANITY_PROJECT_ID || 'nzy22u9z',
      dataset: SANITY_DATASET || 'production',
      apiVersion: SANITY_API_VERSION || '2026-08-03',
    });
  }
  return cachedRepository;
}

/** Test helper. */
export function resetBlogRepositoryCache(): void {
  cachedRepository = undefined;
}

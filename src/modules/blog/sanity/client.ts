import { createClient, type SanityClient } from '@sanity/client';
import type { SanityBlogConfig } from '../repository/sanity-blog-repository.ts';

export function assertSanityConfig(
  config: SanityBlogConfig,
): asserts config is Required<Pick<SanityBlogConfig, 'projectId' | 'dataset' | 'apiVersion'>> &
  SanityBlogConfig {
  const missing = [
    !config.projectId ? 'SANITY_PROJECT_ID' : null,
    !config.dataset ? 'SANITY_DATASET' : null,
    !config.apiVersion ? 'SANITY_API_VERSION' : null,
  ].filter((value): value is string => value !== null);

  if (missing.length > 0) {
    throw new Error(
      [
        'Sanity is the blog source, but it is not fully configured.',
        `Missing: ${missing.join(', ')}.`,
        'Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_VERSION.',
      ].join(' '),
    );
  }
}

export function createSanityClient(config: SanityBlogConfig): SanityClient {
  assertSanityConfig(config);

  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: true,
    perspective: 'published',
    ...(config.token ? { token: config.token } : {}),
  });
}

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

export function isUnauthorizedSanityError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const statusCode =
    'statusCode' in error ? Number((error as { statusCode?: unknown }).statusCode) : Number.NaN;
  if (statusCode === 401 || statusCode === 403) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /unauthorized|forbidden|session not found/i.test(message);
}

export function withAnonymousReadFallback(
  authenticatedClient: SanityClient,
  publicClient: SanityClient,
): SanityClient {
  const authenticatedFetch = authenticatedClient.fetch.bind(authenticatedClient);
  authenticatedClient.fetch = (async (...args: Parameters<SanityClient['fetch']>) => {
    try {
      return await authenticatedFetch(...args);
    } catch (error) {
      if (!isUnauthorizedSanityError(error)) throw error;
      // A Worker token that cannot read this dataset (wrong project, or
      // staff-auth-only) 401/403s. Fal production is public, so retry anonymously.
      return publicClient.fetch(...args);
    }
  }) as SanityClient['fetch'];
  return authenticatedClient;
}

export function createSanityClient(config: SanityBlogConfig): SanityClient {
  assertSanityConfig(config);

  const publicConfig = {
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: true as const,
    perspective: 'published' as const,
  };

  const publicClient = createClient(publicConfig);
  if (!config.token) return publicClient;

  return withAnonymousReadFallback(
    createClient({
      ...publicConfig,
      token: config.token,
    }),
    publicClient,
  );
}

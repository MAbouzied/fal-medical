import assert from 'node:assert/strict';
import test from 'node:test';
import { assertSanityConfig, createSanityClient } from './client.ts';

test('public Sanity reads keep the API CDN enabled when a read token is configured', () => {
  const client = createSanityClient({
    projectId: 'test-project',
    dataset: 'production',
    apiVersion: '2026-08-03',
    token: 'read-token',
  });

  assert.equal(client.config().useCdn, true);
  assert.equal(client.config().perspective, 'published');
});

test('missing Sanity config fails closed instead of falling back to mock content', () => {
  assert.throws(
    () => assertSanityConfig({}),
    /Sanity is the blog source[\s\S]*Missing: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION/,
  );
});

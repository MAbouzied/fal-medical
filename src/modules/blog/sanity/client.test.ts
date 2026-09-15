import assert from 'node:assert/strict';
import test from 'node:test';
import { assertSanityConfig, createSanityClient, isUnauthorizedSanityError, withAnonymousReadFallback } from './client.ts';

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

test('unauthorized Sanity errors include 401, 403, and session-not-found messages', () => {
  assert.equal(isUnauthorizedSanityError({ statusCode: 401 }), true);
  assert.equal(isUnauthorizedSanityError({ statusCode: 403 }), true);
  assert.equal(isUnauthorizedSanityError(new Error('Unauthorized - Session not found')), true);
  assert.equal(isUnauthorizedSanityError(new Error('Forbidden')), true);
  assert.equal(isUnauthorizedSanityError({ statusCode: 500 }), false);
  assert.equal(isUnauthorizedSanityError(new Error('GROQ syntax error')), false);
});

test('published reads fall back to the anonymous client after a 403', async () => {
  const authenticated = {
    fetch: async () => {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
    },
  };
  const anonymous = {
    fetch: async () => [{ _id: 'post-1' }],
  };
  const client = withAnonymousReadFallback(
    authenticated as unknown as ReturnType<typeof createSanityClient>,
    anonymous as unknown as ReturnType<typeof createSanityClient>,
  );

  assert.deepEqual(await client.fetch('*[_type=="blogPost"]'), [{ _id: 'post-1' }]);
});

test('published reads fall back to the anonymous client after a 401', async () => {
  const authenticated = {
    fetch: async () => {
      throw Object.assign(new Error('Unauthorized - Session not found'), { statusCode: 401 });
    },
  };
  const anonymous = {
    fetch: async () => [{ _id: 'post-1' }],
  };
  const client = withAnonymousReadFallback(
    authenticated as unknown as ReturnType<typeof createSanityClient>,
    anonymous as unknown as ReturnType<typeof createSanityClient>,
  );

  assert.deepEqual(await client.fetch('*[_type=="blogPost"]'), [{ _id: 'post-1' }]);
});

test('published reads do not swallow non-auth Sanity failures', async () => {
  const authenticated = {
    fetch: async () => {
      throw Object.assign(new Error('GROQ syntax error'), { statusCode: 400 });
    },
  };
  const anonymous = {
    fetch: async () => {
      throw new Error('anonymous client should not run');
    },
  };
  const client = withAnonymousReadFallback(
    authenticated as unknown as ReturnType<typeof createSanityClient>,
    anonymous as unknown as ReturnType<typeof createSanityClient>,
  );

  await assert.rejects(() => client.fetch('*[_type=="blogPost"]'), /GROQ syntax error/);
});

test('missing Sanity config fails closed instead of falling back to mock content', () => {
  assert.throws(
    () => assertSanityConfig({}),
    /Sanity is the blog source[\s\S]*Missing: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION/,
  );
});

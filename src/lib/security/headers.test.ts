import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  mergeContentSecurityPolicy,
  withPrivateSecurityHeaders,
  withSecurityHeaders,
} from './headers.ts';

describe('mergeContentSecurityPolicy', () => {
  it('uses frame-ancestors alone when no CSP exists', () => {
    assert.equal(mergeContentSecurityPolicy(null), "frame-ancestors 'none'");
  });

  it('appends frame-ancestors when missing from an Astro CSP', () => {
    const existing = "default-src 'self'; script-src 'self' 'sha256-abc'";
    assert.equal(
      mergeContentSecurityPolicy(existing),
      "default-src 'self'; script-src 'self' 'sha256-abc'; frame-ancestors 'none'",
    );
  });

  it('preserves an existing frame-ancestors directive', () => {
    const existing = "default-src 'self'; frame-ancestors 'none'; img-src 'self'";
    assert.equal(mergeContentSecurityPolicy(existing), existing);
  });
});

describe('withSecurityHeaders', () => {
  it('sets baseline security headers on success responses', async () => {
    const response = withSecurityHeaders(new Response('ok', { status: 200 }));
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
    assert.equal(
      response.headers.get('Permissions-Policy'),
      'camera=(), microphone=(), geolocation=(), payment=()',
    );
    assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin-allow-popups');
    assert.equal(response.headers.get('Content-Security-Policy'), "frame-ancestors 'none'");
    assert.equal(await response.text(), 'ok');
  });

  it('does not wipe an existing Astro CSP header', () => {
    const response = withSecurityHeaders(
      new Response('ok', {
        headers: {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'sha256-abc'",
        },
      }),
    );
    assert.equal(
      response.headers.get('Content-Security-Policy'),
      "default-src 'self'; script-src 'self' 'sha256-abc'; frame-ancestors 'none'",
    );
  });

  it('preserves status on error responses', () => {
    const response = withSecurityHeaders(new Response('denied', { status: 403 }));
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
  });
});

describe('withPrivateSecurityHeaders', () => {
  it('adds private cache and noindex on auth surfaces', () => {
    const response = withPrivateSecurityHeaders(new Response('x', { status: 401 }));
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  });
});

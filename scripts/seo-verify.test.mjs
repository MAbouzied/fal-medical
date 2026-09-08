/**
 * Regression tests for seo-verify.mjs helpers.
 *
 * Covers the fix for false-positive "missing meta description / H1" errors
 * caused by Astro's trailing-slash redirect stubs being treated as real pages.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isRedirectStub } from './seo-verify.mjs';

const REDIRECT_STUB_DOUBLE_QUOTE = `<!doctype html><title>Redirecting to: /book</title><meta http-equiv="refresh" content="0;url=/book"><meta name="robots" content="noindex"><link rel="canonical" href="https://falclinic.com/book"><body><a href="/book">Redirecting from <code>/book/</code> to <code>/book</code></a></body>`;

const REDIRECT_STUB_SINGLE_QUOTE = `<!doctype html><title>Redirecting to: /contact</title><meta http-equiv='refresh' content='0;url=/contact'><body></body>`;

const REAL_CONTENT_PAGE = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>حجز موعد | فال</title><meta name="description" content="احجز موعدك الآن في فال لأفضل خدمات الأسنان والجلدية."><meta name="robots" content="index, follow"><link rel="canonical" href="https://falclinic.com/book"></head><body><h1>احجز موعدك</h1></body></html>`;

const PAGE_404 = `<!DOCTYPE html><html><head><title>الصفحة غير موجودة</title><meta name="robots" content="noindex"></head><body><h1>404</h1></body></html>`;

describe('isRedirectStub', () => {
  it('returns true for Astro trailing-slash redirect stubs (double-quote attr)', () => {
    assert.equal(isRedirectStub(REDIRECT_STUB_DOUBLE_QUOTE), true);
  });

  it('returns true for redirect stubs with single-quote attributes', () => {
    assert.equal(isRedirectStub(REDIRECT_STUB_SINGLE_QUOTE), true);
  });

  it('returns false for real content pages', () => {
    assert.equal(isRedirectStub(REAL_CONTENT_PAGE), false);
  });

  it('returns false for 404 pages (noindex, no refresh)', () => {
    assert.equal(isRedirectStub(PAGE_404), false);
  });

  it('returns false for empty string', () => {
    assert.equal(isRedirectStub(''), false);
  });
});

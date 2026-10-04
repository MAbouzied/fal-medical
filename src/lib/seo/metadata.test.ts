import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  resolveCanonicalPath,
  safeCanonicalUrl,
  truncateMetaDescription,
  truncateMetaTitle,
} from './metadata.ts';

describe('public metadata helpers', () => {
  it('truncates long titles and descriptions without changing short copy', () => {
    assert.equal(truncateMetaTitle('فال'), 'فال');
    assert.equal(truncateMetaTitle('أ'.repeat(61)).length, 60);
    assert.equal(truncateMetaDescription('وصف قصير'), 'وصف قصير');
    assert.equal(truncateMetaDescription('ب'.repeat(160)).length, 155);
  });

  it('accepts only https URLs on the clinic host', () => {
    assert.equal(
      safeCanonicalUrl('https://falclinic.com/blogs/post'),
      'https://falclinic.com/blogs/post',
    );
    assert.equal(safeCanonicalUrl('http://falclinic.com/blogs/post'), null);
    assert.equal(safeCanonicalUrl('https://evil.example/blogs/post'), null);
    assert.equal(safeCanonicalUrl('https://user:pass@falclinic.com/blogs/post'), null);
  });

  it('keeps the article path when the CMS canonical is unsafe', () => {
    assert.equal(
      resolveCanonicalPath('https://falclinic.com/blogs/safe-post', '/blogs/slug'),
      '/blogs/safe-post',
    );
    assert.equal(
      resolveCanonicalPath('https://example.com/blogs/other', '/blogs/slug'),
      '/blogs/slug',
    );
  });
});

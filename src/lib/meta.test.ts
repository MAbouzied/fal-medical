import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_META_PIXEL_ID, metaNoscriptSrc, resolveMetaPixelId } from './meta.ts';

describe('resolveMetaPixelId', () => {
  it('accepts the Fal Clinic pixel id', () => {
    assert.equal(resolveMetaPixelId(DEFAULT_META_PIXEL_ID), DEFAULT_META_PIXEL_ID);
  });

  it('rejects empty and non-numeric values', () => {
    assert.equal(resolveMetaPixelId(''), '');
    assert.equal(resolveMetaPixelId('not-a-pixel'), '');
    assert.equal(resolveMetaPixelId('1603479088224230<script>'), '');
    assert.equal(resolveMetaPixelId(undefined), '');
  });
});

describe('metaNoscriptSrc', () => {
  it('builds the PageView image URL for a valid id', () => {
    assert.equal(
      metaNoscriptSrc(DEFAULT_META_PIXEL_ID),
      `https://www.facebook.com/tr?id=${DEFAULT_META_PIXEL_ID}&ev=PageView&noscript=1`,
    );
  });

  it('returns an empty URL for an invalid id', () => {
    assert.equal(metaNoscriptSrc('abc'), '');
  });
});

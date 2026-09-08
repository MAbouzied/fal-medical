import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  SANITY_CARD_WIDTHS,
  buildSanitySrcSet,
  isExactSanityCdnUrl,
  sanitySrcForWidth,
} from './sanity-srcset.ts';

describe('Sanity srcset helpers', () => {
  it('accepts only exact cdn.sanity.io https hosts', () => {
    assert.equal(isExactSanityCdnUrl('https://cdn.sanity.io/images/demo/a.jpg'), true);
    assert.equal(isExactSanityCdnUrl('https://cdn.sanity.io.evil.com/x.jpg'), false);
    assert.equal(isExactSanityCdnUrl('http://cdn.sanity.io/images/demo/a.jpg'), false);
    assert.equal(isExactSanityCdnUrl('/assets/landing-hero.jpg'), false);
  });

  it('builds width srcset for Sanity CDN URLs only', () => {
    const src = 'https://cdn.sanity.io/images/demo/production/cover.jpg?rect=0,0,100,100';
    const srcset = buildSanitySrcSet(src, SANITY_CARD_WIDTHS);
    assert.ok(srcset);
    for (const width of SANITY_CARD_WIDTHS) {
      assert.match(srcset!, new RegExp(`w=${width}`));
      assert.match(srcset!, new RegExp(`${width}w`));
    }
    assert.equal(buildSanitySrcSet('/assets/landing-hero.jpg'), undefined);
  });

  it('rewrites a single width for Sanity CDN URLs', () => {
    const src = 'https://cdn.sanity.io/images/demo/production/cover.jpg';
    assert.match(sanitySrcForWidth(src, 640), /w=640/);
    assert.equal(sanitySrcForWidth('/assets/x.jpg', 640), '/assets/x.jpg');
  });
});

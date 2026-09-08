import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { clinicGallerySlides } from './clinic-gallery.ts';

const imagesRoot = fileURLToPath(new URL('../assets/images', import.meta.url));

function srcToImagePath(src: string): string {
  return join(imagesRoot, src.replace('/assets/', ''));
}

describe('clinic gallery slides', () => {
  it('keeps unique ids and existing interior photos', () => {
    const ids = clinicGallerySlides.map((slide) => slide.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(clinicGallerySlides.length >= 3);

    for (const slide of clinicGallerySlides) {
      assert.ok(existsSync(srcToImagePath(slide.src)), `missing gallery image: ${slide.src}`);
      assert.ok(slide.altAr.trim().length > 0);
      assert.ok(slide.altEn.trim().length > 0);
      assert.ok(slide.department === 'أسنان' || slide.department === 'جلدية');
    }
  });
});

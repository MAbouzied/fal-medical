import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_SNAP_PIXEL_ID,
  encodeSnapViewContent,
  parseSnapViewMeta,
  resolveSnapPixelId,
  sanitizeSnapPayload,
  sanitizeSnapViewContent,
} from './snap.ts';

describe('resolveSnapPixelId', () => {
  it('accepts the Fal Clinic pixel id', () => {
    assert.equal(resolveSnapPixelId(DEFAULT_SNAP_PIXEL_ID), DEFAULT_SNAP_PIXEL_ID);
  });

  it('rejects empty and non-uuid values', () => {
    assert.equal(resolveSnapPixelId(''), '');
    assert.equal(resolveSnapPixelId('not-a-pixel'), '');
    assert.equal(resolveSnapPixelId(undefined), '');
  });
});

describe('sanitizeSnapPayload', () => {
  it('strips email, phone, and form details', () => {
    assert.deepEqual(
      sanitizeSnapPayload({
        item_category: 'booking',
        user_email: 'visitor@example.com',
        user_phone_number: '0551234567',
        user_hashed_email: 'abc',
        email: 'visitor@example.com',
        phone: '0551234567',
        name: 'Ali',
        department: 'الأسنان',
        service: 'تنظيف',
      }),
      { item_category: 'booking' },
    );
  });
});

describe('sanitizeSnapViewContent', () => {
  it('keeps a public service slug', () => {
    assert.deepEqual(
      sanitizeSnapViewContent({
        itemIds: ['dental-implants'],
        itemCategory: 'service',
      }),
      {
        item_ids: ['dental-implants'],
        item_category: 'service',
        number_items: 1,
      },
    );
  });

  it('keeps an Arabic blog slug', () => {
    const encoded = encodeSnapViewContent({
      itemIds: ['زراعة-الأسنان'],
      itemCategory: 'article',
    });
    assert.deepEqual(parseSnapViewMeta(encoded), {
      item_ids: ['زراعة-الأسنان'],
      item_category: 'article',
      number_items: 1,
    });
  });

  it('drops emails, prices, and unknown categories', () => {
    assert.equal(
      sanitizeSnapViewContent({
        itemIds: ['visitor@example.com', ''],
        itemCategory: 'service',
      }),
      null,
    );
    assert.equal(
      sanitizeSnapViewContent({
        itemIds: ['dental-implants'],
        itemCategory: 'purchase',
      }),
      null,
    );
    assert.equal(parseSnapViewMeta('not-json'), null);
    assert.equal(encodeSnapViewContent({ itemIds: ['bad id'], itemCategory: 'doctor' }), '');
  });
});

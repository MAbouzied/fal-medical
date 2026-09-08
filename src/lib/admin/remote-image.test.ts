import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  assertImageMimeMatches,
  assertSafeRemoteImageUrl,
  detectImageMime,
  parseAdminImageImportHosts,
  readLimitedArrayBuffer,
} from './remote-image.ts';

describe('assertSafeRemoteImageUrl', () => {
  const hosts = parseAdminImageImportHosts('cdn.sanity.io');

  it('allows https hosts on the allowlist', () => {
    const url = assertSafeRemoteImageUrl('https://cdn.sanity.io/images/demo.jpg', hosts);
    assert.equal(url.hostname, 'cdn.sanity.io');
    assert.equal(url.hash, '');
  });

  it('rejects credentials, custom ports, and non-allowlisted hosts', () => {
    assert.throws(() => assertSafeRemoteImageUrl('http://cdn.sanity.io/x.jpg', hosts));
    assert.throws(() => assertSafeRemoteImageUrl('https://user:pass@cdn.sanity.io/x.jpg', hosts));
    assert.throws(() => assertSafeRemoteImageUrl('https://cdn.sanity.io:8443/x.jpg', hosts));
    assert.throws(() => assertSafeRemoteImageUrl('https://evil.example/x.jpg', hosts));
    assert.throws(() => assertSafeRemoteImageUrl('https://127.0.0.1/x.jpg', hosts));
    assert.throws(() => assertSafeRemoteImageUrl('https://[::1]/x.jpg', hosts));
  });
});

describe('image MIME magic', () => {
  it('detects JPEG/PNG/GIF/WebP signatures', () => {
    assert.equal(detectImageMime(Uint8Array.of(0xff, 0xd8, 0xff, 0xe0)), 'image/jpeg');
    assert.equal(
      detectImageMime(Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)),
      'image/png',
    );
    assert.equal(
      detectImageMime(Uint8Array.from(Buffer.from('GIF89a'))),
      'image/gif',
    );
    const webp = new Uint8Array(12);
    webp.set(Buffer.from('RIFF'), 0);
    webp.set(Buffer.from('WEBP'), 8);
    assert.equal(detectImageMime(webp), 'image/webp');
  });

  it('rejects MIME mismatches', () => {
    const jpeg = Uint8Array.of(0xff, 0xd8, 0xff, 0xe0);
    assert.equal(assertImageMimeMatches('image/jpeg', jpeg), 'image/jpeg');
    assert.throws(() => assertImageMimeMatches('image/png', jpeg));
  });
});

describe('readLimitedArrayBuffer', () => {
  it('rejects oversized streamed bodies', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(6));
        controller.enqueue(new Uint8Array(6));
        controller.close();
      },
    });
    const response = new Response(stream);
    await assert.rejects(() => readLimitedArrayBuffer(response, 10));
  });
});

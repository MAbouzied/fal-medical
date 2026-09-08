import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readLimitedRequestBody, RequestBodyTooLargeError } from './request-body.ts';

function streamRequest(chunks: Uint8Array[], headers?: HeadersInit): Request {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
  return new Request('https://falclinic.com/api/customers', {
    method: 'POST',
    headers,
    body: stream,
    // @ts-expect-error undici duplex required for streamed bodies
    duplex: 'half',
  });
}

describe('readLimitedRequestBody', () => {
  it('reads bodies under the limit', async () => {
    const request = new Request('https://falclinic.com/api/customers', {
      method: 'POST',
      body: '{"ok":true}',
    });
    assert.equal(await readLimitedRequestBody(request, 100), '{"ok":true}');
  });

  it('rejects oversized Content-Length before reading', async () => {
    const request = streamRequest([new TextEncoder().encode('a')], {
      'Content-Length': '9000',
    });
    await assert.rejects(
      () => readLimitedRequestBody(request, 100),
      RequestBodyTooLargeError,
    );
  });

  it('cancels the stream once the byte limit is exceeded', async () => {
    const request = streamRequest([
      new TextEncoder().encode('12345'),
      new TextEncoder().encode('67890'),
    ]);
    await assert.rejects(
      () => readLimitedRequestBody(request, 8),
      RequestBodyTooLargeError,
    );
  });
});

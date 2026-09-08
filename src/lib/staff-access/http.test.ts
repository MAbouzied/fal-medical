import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { adminApiError, hasSameOrigin } from './http.ts';

describe('staff access HTTP helpers', () => {
  it('requires an exact Origin on mutations', () => {
    assert.equal(hasSameOrigin(new Request('https://falclinic.com/api/admin/users', {
      method: 'POST', headers: { Origin: 'https://falclinic.com' },
    })), true);
    assert.equal(hasSameOrigin(new Request('https://falclinic.com/api/admin/users', {
      method: 'POST', headers: { Origin: 'https://evil.example' },
    })), false);
    assert.equal(hasSameOrigin(new Request('https://falclinic.com/api/admin/users', { method: 'POST' })), false);
  });

  it('returns structured, private error responses', async () => {
    const response = adminApiError('DUPLICATE_EMAIL');
    assert.equal(response.status, 409);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    assert.deepEqual(await response.json(), {
      error: {
        code: 'DUPLICATE_EMAIL',
        message: 'This email already has staff access.',
      },
    });
  });
});

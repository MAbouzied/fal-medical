import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isAllowedCustomerOrigin } from './origin.ts';

describe('isAllowedCustomerOrigin', () => {
  const origin = 'https://falclinic.com';

  it('accepts exact same-origin requests', () => {
    assert.equal(isAllowedCustomerOrigin(origin, origin, 'same-origin'), true);
    assert.equal(isAllowedCustomerOrigin(origin, origin, 'same-site'), true);
    assert.equal(isAllowedCustomerOrigin(origin, origin, null), true);
  });

  it('rejects missing or mismatched Origin', () => {
    assert.equal(isAllowedCustomerOrigin(null, origin, 'same-origin'), false);
    assert.equal(isAllowedCustomerOrigin('https://evil.example', origin, 'same-origin'), false);
  });

  it('rejects Sec-Fetch-Site cross-site even with matching Origin', () => {
    assert.equal(isAllowedCustomerOrigin(origin, origin, 'cross-site'), false);
  });
});

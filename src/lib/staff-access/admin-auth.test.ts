import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveAdminAuthBypass } from './admin-auth-bypass.ts';

describe('resolveAdminAuthBypass', () => {
  it('enables bypass only when requested in development', () => {
    assert.equal(resolveAdminAuthBypass(true, true), true);
  });

  it('ignores bypass requests outside development', () => {
    assert.equal(resolveAdminAuthBypass(true, false), false);
  });

  it('stays disabled when not requested', () => {
    assert.equal(resolveAdminAuthBypass(false, true), false);
    assert.equal(resolveAdminAuthBypass(false, false), false);
  });
});

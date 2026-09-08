import { test, expect } from '@playwright/test';
import { createFakeRateLimiter, createFakeSheetsBinding } from '../fixtures/fake-bindings';

test.describe('Worker binding stubs (Phase 1 scaffolding)', () => {
  test('Sheets and rate-limit fakes can be composed for booking smoke', async () => {
    const sheets = createFakeSheetsBinding();
    const limiter = createFakeRateLimiter(1);

    const allowed = await limiter.limit();
    expect(allowed.success).toBe(true);

    if (allowed.success) {
      await sheets.append({ phone: '0500000000' });
    }

    const blocked = await limiter.limit();
    expect(blocked.success).toBe(false);
    expect(sheets.rows).toHaveLength(1);
  });
});

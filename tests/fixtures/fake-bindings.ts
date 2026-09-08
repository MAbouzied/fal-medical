/**
 * Fake Cloudflare / Google Sheets bindings for route smoke stubs.
 * Phase 2+ will swap these for integration-level fakes in the Worker harness.
 */

export interface FakeSheetsAppendResult {
  ok: boolean;
  rowCount: number;
}

export interface FakeRateLimitResult {
  success: boolean;
  remaining: number;
}

export function createFakeSheetsBinding() {
  const rows: Record<string, unknown>[] = [];
  return {
    rows,
    async append(row: Record<string, unknown>): Promise<FakeSheetsAppendResult> {
      rows.push({ ...row });
      return { ok: true, rowCount: rows.length };
    },
  };
}

export function createFakeRateLimiter(limit = 5) {
  let hits = 0;
  return {
    async limit(_options?: { key: string }): Promise<FakeRateLimitResult> {
      hits += 1;
      const remaining = Math.max(0, limit - hits);
      return {
        success: hits <= limit,
        remaining,
      };
    },
    getHits(): number {
      return hits;
    },
  };
}

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ANALYTICS_CONSENT_KEY,
  isAnalyticsAllowed,
  parseAnalyticsConsent,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from './consent.ts';

describe('analytics consent store', () => {
  it('defaults to denied/unset', () => {
    assert.equal(parseAnalyticsConsent(null), null);
    assert.equal(isAnalyticsAllowed(null), false);
    assert.equal(isAnalyticsAllowed('denied'), false);
    assert.equal(isAnalyticsAllowed('granted'), true);
  });

  it('persists only the consent choice', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };

    writeAnalyticsConsent('granted', storage);
    assert.equal(store.get(ANALYTICS_CONSENT_KEY), 'granted');
    assert.equal(readAnalyticsConsent(storage), 'granted');

    writeAnalyticsConsent('denied', storage);
    assert.equal(readAnalyticsConsent(storage), 'denied');
  });
});

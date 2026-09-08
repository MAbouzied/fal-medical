export type AnalyticsConsent = 'granted' | 'denied';

export const ANALYTICS_CONSENT_KEY = 'bc:analytics-consent:v1';
export const ANALYTICS_CONSENT_GRANTED_EVENT = 'analytics:consent-granted';

export function parseAnalyticsConsent(value: unknown): AnalyticsConsent | null {
  if (value === 'granted' || value === 'denied') return value;
  return null;
}

export function readAnalyticsConsent(
  storage: Pick<Storage, 'getItem'> | null | undefined = typeof localStorage === 'undefined'
    ? null
    : localStorage,
): AnalyticsConsent | null {
  if (!storage) return null;
  try {
    return parseAnalyticsConsent(storage.getItem(ANALYTICS_CONSENT_KEY));
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(
  value: AnalyticsConsent,
  storage: Pick<Storage, 'setItem'> | null | undefined = typeof localStorage === 'undefined'
    ? null
    : localStorage,
): void {
  if (!storage) return;
  storage.setItem(ANALYTICS_CONSENT_KEY, value);
}

/** Default denied until the visitor explicitly grants analytics. */
export function isAnalyticsAllowed(consent: AnalyticsConsent | null): boolean {
  return consent === 'granted';
}

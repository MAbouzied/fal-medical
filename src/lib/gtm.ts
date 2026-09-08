import { isAnalyticsAllowed, readAnalyticsConsent } from './analytics/consent.ts';

/** Returns a valid GTM container ID, or empty string when unset/placeholder. */
export function resolveGtmId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!/^GTM-[A-Z0-9]+$/i.test(trimmed)) return '';
  if (/^GTM-X+$/i.test(trimmed)) return '';
  return trimmed;
}

export function isValidGtmId(value: unknown): boolean {
  return resolveGtmId(value).length > 0;
}

const envGtmId =
  typeof import.meta.env?.PUBLIC_GTM_ID === 'string' ? import.meta.env.PUBLIC_GTM_ID : '';

/** GTM container ID used by the loader/init script. Set PUBLIC_GTM_ID to enable. */
export const GTM_ID = resolveGtmId(envGtmId);
export const isGtmConfigured = GTM_ID.length > 0;

/** True only when a valid container is configured and consent is granted. */
export function isGtmEnabled(): boolean {
  return isGtmConfigured && isAnalyticsAllowed(readAnalyticsConsent());
}

export const GtmEvents = {
  contactWhatsapp: 'contact_whatsapp_click',
  contactCall: 'contact_call_click',
  contactEmail: 'contact_email_click',
  formSubmit: 'generate_lead',
  formError: 'form_error',
} as const;

export type GtmEventName = (typeof GtmEvents)[keyof typeof GtmEvents];

export type GtmPayload = Record<string, string | number | boolean | undefined>;

const FORBIDDEN_ANALYTICS_KEYS = new Set([
  'name',
  'phone',
  'department',
  'service',
  'consent',
  'website',
  'message',
  'email',
]);

export function sanitizeGtmPayload(payload: GtmPayload = {}): GtmPayload {
  const clean: GtmPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_ANALYTICS_KEYS.has(key)) continue;
    clean[key] = value;
  }
  return clean;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushGtmEvent(event: string, payload: GtmPayload = {}): void {
  if (typeof window === 'undefined' || !isGtmEnabled()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    locale: document.documentElement.lang || 'ar',
    ...sanitizeGtmPayload(payload),
  });
}

export function resolveContactEvent(href: string): GtmEventName | null {
  const value = href.trim().toLowerCase();
  if (value.startsWith('tel:')) return GtmEvents.contactCall;
  if (value.startsWith('mailto:')) return GtmEvents.contactEmail;
  if (value.includes('wa.me/') || value.includes('api.whatsapp.com') || value.includes('whatsapp.com/send')) {
    return GtmEvents.contactWhatsapp;
  }
  return null;
}

export function resolveCtaLocation(element: Element): string {
  const explicit = element.closest<HTMLElement>('[data-gtm-location]')?.dataset.gtmLocation;
  if (explicit) return explicit;

  const section = element.closest('section[id], footer[id], header');
  if (section instanceof HTMLElement) {
    if (section.tagName === 'HEADER') return 'header';
    if (section.id) return section.id;
  }

  if (element.closest('footer')) return 'footer';
  return 'page';
}

export function loadGtmContainer(containerId: string): void {
  if (typeof document === 'undefined') return;
  const id = resolveGtmId(containerId);
  if (!id) return;
  if (document.documentElement.dataset.gtmLoaded === 'true') return;
  document.documentElement.dataset.gtmLoaded = 'true';

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
    gtm_container_id: id,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

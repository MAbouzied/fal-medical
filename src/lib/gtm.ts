/** Fal Clinic GA4 measurement ID (gtag.js). Override with PUBLIC_GTM_ID. */
export const DEFAULT_GA_MEASUREMENT_ID = 'G-28Q8393TES';

const GTM_CONTAINER_RE = /^GTM-[A-Z0-9]+$/i;
const GA4_MEASUREMENT_RE = /^G-[A-Z0-9]+$/i;
const PLACEHOLDER_RE = /^(?:GTM|G)-X+$/i;

/** Returns a valid GTM container or GA4 measurement ID, or empty string. */
export function resolveGtmId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (PLACEHOLDER_RE.test(trimmed)) return '';
  if (GTM_CONTAINER_RE.test(trimmed) || GA4_MEASUREMENT_RE.test(trimmed)) return trimmed;
  return '';
}

export function isValidGtmId(value: unknown): boolean {
  return resolveGtmId(value).length > 0;
}

export function isGa4MeasurementId(value: unknown): boolean {
  const id = resolveGtmId(value);
  return id.length > 0 && GA4_MEASUREMENT_RE.test(id);
}

const envGtmId =
  typeof import.meta.env?.PUBLIC_GTM_ID === 'string' ? import.meta.env.PUBLIC_GTM_ID : '';

/** Analytics ID used by the loader. Defaults to Fal Clinic GA4. Set PUBLIC_GTM_ID to override. */
export const GTM_ID = resolveGtmId(envGtmId) || DEFAULT_GA_MEASUREMENT_ID;
export const isGtmConfigured = GTM_ID.length > 0;

/** True when a valid analytics ID is configured. */
export function isGtmEnabled(): boolean {
  return isGtmConfigured;
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
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function pushGtmEvent(event: string, payload: GtmPayload = {}): void {
  if (typeof window === 'undefined' || !isGtmEnabled()) return;

  const params = {
    page_path: window.location.pathname,
    locale: document.documentElement.lang || 'ar',
    ...sanitizeGtmPayload(payload),
  };

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
    return;
  }

  window.dataLayer.push({
    event,
    ...params,
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

function loadGtag(measurementId: string): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      // Same queue format as Google's snippet: dataLayer.push(arguments)
      window.dataLayer.push(arguments);
    };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function loadGtmContainer(containerId: string): void {
  if (typeof document === 'undefined') return;
  const id = resolveGtmId(containerId);
  if (!id) return;
  if (document.documentElement.dataset.gtmLoaded === 'true') return;
  document.documentElement.dataset.gtmLoaded = 'true';

  if (isGa4MeasurementId(id)) {
    loadGtag(id);
    return;
  }

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

/** Fal Clinic Meta Pixel. Override with PUBLIC_META_PIXEL_ID. */
export const DEFAULT_META_PIXEL_ID = '1603479088224230';

const META_PIXEL_ID_RE = /^\d{15,16}$/;

const META_SCRIPT_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqFn;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

/** Returns a Meta Pixel id, or empty string when unset/invalid. */
export function resolveMetaPixelId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!META_PIXEL_ID_RE.test(trimmed)) return '';
  return trimmed;
}

const envPixelId =
  typeof import.meta.env?.PUBLIC_META_PIXEL_ID === 'string'
    ? import.meta.env.PUBLIC_META_PIXEL_ID
    : '';

/** Pixel ID used by the loader. Defaults to the Fal Clinic pixel. */
export const META_PIXEL_ID = resolveMetaPixelId(envPixelId) || DEFAULT_META_PIXEL_ID;
export const isMetaConfigured = META_PIXEL_ID.length > 0;

export function metaNoscriptSrc(pixelId: string): string {
  const id = resolveMetaPixelId(pixelId);
  if (!id) return '';
  return `https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`;
}

/**
 * Installs the base Meta Pixel and sends PageView.
 * Name, phone, and email are never attached.
 */
export function installMetaPixel(pixelId: string): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const id = resolveMetaPixelId(pixelId);
  if (!id) return;
  if (window.fbq) return;
  if (document.documentElement.dataset.metaLoaded === 'true') return;
  document.documentElement.dataset.metaLoaded = 'true';

  const fbq = function fbq(this: FbqFn, ...args: unknown[]) {
    if (typeof fbq.callMethod === 'function') fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  } as FbqFn;
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = META_SCRIPT_SRC;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) first.parentNode.insertBefore(script, first);
  else document.head.appendChild(script);

  fbq('init', id);
  fbq('track', 'PageView');
}

export function trackMetaPageView(): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', 'PageView');
}

/** Fal Clinic Snapchat Pixel. Override with PUBLIC_SNAP_PIXEL_ID. */
export const DEFAULT_SNAP_PIXEL_ID = 'a2740512-1e69-4f48-8c46-f15320b6fd7d';

const SNAP_PIXEL_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Public content ids only: Latin or Arabic slugs, no emails or free text. */
const ITEM_ID_RE = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

const SNAP_SCRIPT_SRC = 'https://sc-static.net/scevent.min.js';

export type SnapItemCategory = 'service' | 'doctor' | 'article';

export type SnapViewContent = {
  item_ids: string[];
  item_category: SnapItemCategory;
  number_items: number;
};

const FORBIDDEN_SNAP_KEYS = new Set([
  'user_email',
  'user_phone_number',
  'user_hashed_email',
  'user_hashed_phone_number',
  'uuid_c1',
  'email',
  'phone',
  'name',
  'department',
  'service',
  'message',
  'consent',
  'website',
]);

type SnapFn = ((...args: unknown[]) => void) & {
  handleRequest?: (...args: unknown[]) => void;
  queue: unknown[][];
};

export type SnapPayload = Record<string, string | number | string[]>;

declare global {
  interface Window {
    snaptr?: SnapFn;
  }
}

/** Returns a Snap Pixel UUID, or empty string when unset/invalid. */
export function resolveSnapPixelId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!SNAP_PIXEL_ID_RE.test(trimmed)) return '';
  return trimmed.toLowerCase();
}

const envPixelId =
  typeof import.meta.env?.PUBLIC_SNAP_PIXEL_ID === 'string'
    ? import.meta.env.PUBLIC_SNAP_PIXEL_ID
    : '';

/** Pixel ID used by the loader. Defaults to the Fal Clinic pixel. */
export const SNAP_PIXEL_ID = resolveSnapPixelId(envPixelId) || DEFAULT_SNAP_PIXEL_ID;
export const isSnapConfigured = SNAP_PIXEL_ID.length > 0;

export function sanitizeSnapPayload(payload: SnapPayload = {}): SnapPayload {
  const clean: SnapPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_SNAP_KEYS.has(key)) continue;
    clean[key] = value;
  }
  return clean;
}

export function sanitizeSnapViewContent(input: {
  itemIds?: readonly unknown[];
  itemCategory?: unknown;
}): SnapViewContent | null {
  if (
    input.itemCategory !== 'service' &&
    input.itemCategory !== 'doctor' &&
    input.itemCategory !== 'article'
  ) {
    return null;
  }
  if (!Array.isArray(input.itemIds)) return null;

  const item_ids = input.itemIds
    .filter((id): id is string => typeof id === 'string' && isPublicItemId(id))
    .slice(0, 10);
  if (item_ids.length === 0) return null;

  return {
    item_ids,
    item_category: input.itemCategory,
    number_items: item_ids.length,
  };
}

export function encodeSnapViewContent(input: {
  itemIds: readonly string[];
  itemCategory: SnapItemCategory;
}): string {
  const clean = sanitizeSnapViewContent(input);
  if (!clean) return '';
  return JSON.stringify({
    item_ids: clean.item_ids,
    item_category: clean.item_category,
  });
}

export function parseSnapViewMeta(raw: string | null | undefined): SnapViewContent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { item_ids?: unknown; item_category?: unknown };
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.item_ids)) return null;
    return sanitizeSnapViewContent({
      itemIds: parsed.item_ids,
      itemCategory: parsed.item_category,
    });
  } catch {
    return null;
  }
}

function isPublicItemId(value: string): boolean {
  return ITEM_ID_RE.test(value) && Array.from(value).length <= 96;
}

function track(event: 'PAGE_VIEW' | 'VIEW_CONTENT' | 'SIGN_UP', payload?: SnapPayload): void {
  if (typeof window === 'undefined' || typeof window.snaptr !== 'function') return;
  if (!payload) {
    window.snaptr('track', event);
    return;
  }
  window.snaptr('track', event, sanitizeSnapPayload(payload));
}

/**
 * Installs the base Snap Pixel and sends PAGE_VIEW.
 * Name, phone, and email are never attached. The clinic has no cart, so
 * ADD_CART and PURCHASE are not sent.
 */
export function installSnapPixel(pixelId: string): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const id = resolveSnapPixelId(pixelId);
  if (!id) return;
  if (document.documentElement.dataset.snapLoaded === 'true') return;
  document.documentElement.dataset.snapLoaded = 'true';

  const snaptr = function snaptr(this: SnapFn, ...args: unknown[]) {
    if (typeof snaptr.handleRequest === 'function') snaptr.handleRequest.apply(snaptr, args);
    else snaptr.queue.push(args);
  } as SnapFn;
  snaptr.queue = [];
  window.snaptr = snaptr;

  const script = document.createElement('script');
  script.async = true;
  script.src = SNAP_SCRIPT_SRC;
  const first = document.getElementsByTagName('script')[0];
  if (first?.parentNode) first.parentNode.insertBefore(script, first);
  else document.head.appendChild(script);

  snaptr('init', id);
  snaptr('track', 'PAGE_VIEW');
}

export function trackSnapPageView(): void {
  track('PAGE_VIEW');
}

export function trackSnapViewContent(content: SnapViewContent): void {
  track('VIEW_CONTENT', {
    item_ids: content.item_ids,
    item_category: content.item_category,
    number_items: content.number_items,
  });
}

/** Lead conversion. Same moment as the analytics generate_lead event. */
export function trackSnapLead(): void {
  track('SIGN_UP', { item_category: 'booking' });
}

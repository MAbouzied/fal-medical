const SANITY_CDN_HOST = 'cdn.sanity.io';

export const SANITY_CARD_WIDTHS = [320, 480, 640, 900] as const;
export const SANITY_ARTICLE_WIDTHS = [480, 768, 960, 1200] as const;

export function isExactSanityCdnUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && url.hostname === SANITY_CDN_HOST;
  } catch {
    return false;
  }
}

/** Build a responsive srcset for exact `cdn.sanity.io` image URLs only. */
export function buildSanitySrcSet(
  src: string,
  widths: readonly number[] = SANITY_CARD_WIDTHS,
): string | undefined {
  if (!isExactSanityCdnUrl(src)) return undefined;

  try {
    const entries = widths.map((width) => {
      const url = new URL(src);
      url.searchParams.set('w', String(width));
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'max');
      return `${url.href} ${width}w`;
    });
    return entries.join(', ');
  } catch {
    return undefined;
  }
}

export function sanitySrcForWidth(src: string, width: number): string {
  if (!isExactSanityCdnUrl(src)) return src;
  try {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'max');
    return url.href;
  } catch {
    return src;
  }
}

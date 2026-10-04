import { productionHost, siteOrigin } from '../../data/site.ts';

const META_DESCRIPTION_MAX = 155;
const META_TITLE_MAX = 60;

export function truncateMetaDescription(
  text: string,
  maxLen: number = META_DESCRIPTION_MAX,
): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen - 1)}…`;
}

export function truncateMetaTitle(title: string, maxLen: number = META_TITLE_MAX): string {
  const plain = title.trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen - 1)}…`;
}

/**
 * Accepts only an https URL on the clinic origin.
 * A CMS value cannot point metadata, JSON-LD, or hreflang at another host.
 */
export function safeCanonicalUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;
    if (parsed.hostname.toLowerCase() !== productionHost) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Path to use as the page canonical. Falls back when the CMS URL is unsafe. */
export function resolveCanonicalPath(
  cmsCanonicalUrl: string | undefined | null,
  fallbackPath: string,
): string {
  const safe = safeCanonicalUrl(cmsCanonicalUrl);
  if (!safe) return fallbackPath;
  const parsed = new URL(safe);
  if (parsed.origin !== siteOrigin) return fallbackPath;
  const path = parsed.pathname.replace(/\/$/, '') || '/';
  return path;
}

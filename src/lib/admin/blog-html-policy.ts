import type { IOptions } from 'sanitize-html';

export const BLOG_HTML_MAX_BYTES = 256 * 1024;
export const BLOG_LEXICAL_JSON_MAX_BYTES = 512 * 1024;

const SAFE_BLOG_HREF =
  /^(https:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

const ALLOWED_EMBED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
]);

export function isAllowedBlogMediaUrl(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:') return false;
    if (url.username || url.password) return false;
    return ALLOWED_EMBED_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function validateBlogLink(href: unknown): string | undefined {
  if (typeof href !== 'string') return undefined;
  const trimmed = href.trim();
  if (!trimmed || /^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return undefined;
  if (!SAFE_BLOG_HREF.test(trimmed)) return undefined;
  if (/^https:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (url.username || url.password) return undefined;
      return url.toString();
    } catch {
      return undefined;
    }
  }
  return trimmed;
}

/** Frozen sanitize-html policy for blog HTML at save and render time. */
export const BLOG_HTML_POLICY: IOptions = Object.freeze({
  allowedTags: [
    'p',
    'h2',
    'h3',
    'h4',
    'strong',
    'em',
    'u',
    's',
    'ul',
    'ol',
    'li',
    'blockquote',
    'cite',
    'a',
    'br',
    'figure',
    'figcaption',
    'img',
    'video',
    'source',
    'iframe',
    'code',
    'pre',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
    video: ['src', 'poster', 'controls', 'class'],
    source: ['src', 'type'],
    iframe: ['src', 'title', 'width', 'height', 'loading', 'allowfullscreen', 'class'],
    figure: ['class'],
    figcaption: ['class'],
  },
  allowedSchemes: ['https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['https'],
    source: ['https'],
    video: ['https'],
    iframe: ['https'],
  },
  allowedIframeHostnames: [
    'youtube.com',
    'www.youtube.com',
    'www.youtube-nocookie.com',
    'player.vimeo.com',
  ],
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName: string, attribs: Record<string, string>) => {
      const href = validateBlogLink(attribs.href);
      if (!href) {
        return { tagName: 'span', attribs: {} };
      }
      const blank = attribs.target === '_blank';
      return {
        tagName: 'a',
        attribs: {
          href,
          ...(blank
            ? {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {}),
        },
      };
    },
    video: (_tagName: string, attribs: Record<string, string>) => {
      if (!isAllowedBlogMediaUrl(attribs.src)) {
        return { tagName: 'span', attribs: {} };
      }
      return {
        tagName: 'video',
        attribs: {
          src: attribs.src,
          ...(attribs.poster && isAllowedBlogMediaUrl(attribs.poster)
            ? { poster: attribs.poster }
            : {}),
          ...(attribs.controls !== undefined ? { controls: attribs.controls } : {}),
          ...(attribs.class ? { class: attribs.class } : {}),
        },
      };
    },
    source: (_tagName: string, attribs: Record<string, string>) => {
      if (!isAllowedBlogMediaUrl(attribs.src)) {
        return { tagName: 'span', attribs: {} };
      }
      return {
        tagName: 'source',
        attribs: {
          src: attribs.src,
          ...(attribs.type ? { type: attribs.type } : {}),
        },
      };
    },
  },
});

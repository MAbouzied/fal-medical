import sanitizeHtml from 'sanitize-html';
import {
  BLOG_HTML_MAX_BYTES,
  BLOG_HTML_POLICY,
  validateBlogLink,
} from './blog-html-policy.ts';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function safeUrl(value: string): string | null {
  return validateBlogLink(value) ?? null;
}

/** Allowlist sanitizer for editor output before it is stored or rendered. */
export function sanitizeBlogHtml(input: string): string {
  if (typeof input !== 'string') return '';
  if (new TextEncoder().encode(input).byteLength > BLOG_HTML_MAX_BYTES) {
    return '';
  }
  return sanitizeHtml(input, BLOG_HTML_POLICY);
}

export function htmlToPlainText(input: string): string {
  return input
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface LexicalTextNode {
  type: 'text';
  text: string;
  format?: number;
}

export interface LexicalNode {
  type: string;
  [key: string]: unknown;
}

export interface LexicalDocument {
  root: { type: 'root'; children: LexicalNode[] };
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function lexicalUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return safeUrl(value);
}

function imageDisplayClass(node: LexicalNode, baseClass: string): string {
  const width = node.width === 25 || node.width === 50 || node.width === 75 ? node.width : 100;
  const align = node.align === 'left' || node.align === 'right' ? node.align : 'center';
  return ` class="${baseClass} ${baseClass}--w${width} ${baseClass}--${align}"`;
}

function textNodeToHtml(node: LexicalTextNode): string {
  let html = escapeHtml(node.text || '');
  const format = Number(node.format ?? 0);
  if (format & 1) html = `<strong>${html}</strong>`;
  if (format & 2) html = `<em>${html}</em>`;
  if (format & 4) html = `<s>${html}</s>`;
  if (format & 8) html = `<u>${html}</u>`;
  if (format & 16) html = `<code>${html}</code>`;
  return html;
}

function lexicalChildren(node: LexicalNode): string {
  return Array.isArray(node.children)
    ? node.children.map((child) => lexicalNodeToHtml(child as LexicalNode)).join('')
    : '';
}

function lexicalNodeToHtml(node: LexicalNode): string {
  if (!node || typeof node !== 'object') return '';
  if (node.type === 'text') return textNodeToHtml(node as unknown as LexicalTextNode);
  if (node.type === 'linebreak') return '<br />';
  if (node.type === 'paragraph') return `<p>${lexicalChildren(node)}</p>`;
  if (node.type === 'heading') {
    const tag = node.tag === 'h3' ? 'h3' : 'h2';
    return `<${tag}>${lexicalChildren(node)}</${tag}>`;
  }
  if (node.type === 'quote') return `<blockquote>${lexicalChildren(node)}</blockquote>`;
  if (node.type === 'list') {
    const tag = node.listType === 'number' ? 'ol' : 'ul';
    return `<${tag}>${lexicalChildren(node)}</${tag}>`;
  }
  if (node.type === 'listitem') return `<li>${lexicalChildren(node)}</li>`;
  if (node.type === 'link') {
    const href = lexicalUrl(node.url);
    return href ? `<a href="${escapeAttribute(href)}" rel="noopener noreferrer">${lexicalChildren(node)}</a>` : lexicalChildren(node);
  }
  if (node.type === 'blog-image' || node.type === 'image') {
    const src = lexicalUrl(node.src);
    if (!src) return '';
    const alt = typeof node.alt === 'string' ? node.alt : '';
    const caption = typeof node.caption === 'string' ? node.caption.trim() : '';
    return `<figure${imageDisplayClass(node, 'blog-body__image')}><img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}</figure>`;
  }
  if (node.type === 'blog-video' || node.type === 'video') {
    const src = lexicalUrl(node.src);
    if (!src || !/^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i.test(src)) return '';
    return `<figure${imageDisplayClass(node, 'blog-body__embed')}><iframe src="${escapeAttribute(src)}" title="فيديو المقال" loading="lazy" allowfullscreen></iframe></figure>`;
  }
  return lexicalChildren(node);
}

export function normalizeLexicalJson(value: unknown): string {
  const document = typeof value === 'string' ? JSON.parse(value) : value;
  if (!document || typeof document !== 'object') throw new Error('محتوى المقال غير صالح.');
  const root = (document as { root?: unknown }).root;
  if (!root || typeof root !== 'object' || !Array.isArray((root as { children?: unknown }).children)) {
    throw new Error('محتوى المقال غير صالح.');
  }
  function cleanChildren(value: unknown): LexicalNode[] {
    if (!Array.isArray(value)) return [];
    return value.flatMap((child) => {
      const cleaned = cleanNode(child);
      if (Array.isArray(cleaned)) return cleaned;
      return cleaned ? [cleaned] : [];
    });
  }

  function cleanNode(node: unknown): LexicalNode | LexicalNode[] | null {
    if (!node || typeof node !== 'object') return null;
    const raw = node as Record<string, unknown>;
    const type = typeof raw.type === 'string' ? raw.type : '';
    if (type === 'text') return { type: 'text', text: typeof raw.text === 'string' ? raw.text : '', format: Number(raw.format ?? 0) & 31 };
    if (type === 'linebreak') return { type: 'linebreak' };
    const allowed = new Set(['paragraph', 'heading', 'quote', 'list', 'listitem', 'link', 'blog-image', 'image', 'blog-video', 'video', 'root']);
    if (!allowed.has(type)) return null;
    const result: LexicalNode = { type };
    if (type === 'heading') result.tag = raw.tag === 'h3' ? 'h3' : 'h2';
    if (type === 'list') result.listType = raw.listType === 'number' ? 'number' : 'bullet';
    if (type === 'link') {
      const url = lexicalUrl(raw.url);
      // Keep the selected content if the link URL is invalid; only remove the
      // unsafe link wrapper instead of silently deleting the user's text.
      if (!url) return cleanChildren(raw.children);
      result.url = url;
    }
    if (type === 'blog-image' || type === 'image') {
      const src = lexicalUrl(raw.src);
      const alt = typeof raw.alt === 'string' ? raw.alt.trim() : '';
      if (!src || !alt || /^blob:|^data:/i.test(src) || (!src.startsWith('/') && !/^https:\/\/cdn\.sanity\.io\//i.test(src))) return null;
      result.type = 'blog-image'; result.src = src; result.alt = alt;
      if (typeof raw.caption === 'string' && raw.caption.trim()) result.caption = raw.caption.trim().slice(0, 300);
      if (typeof raw.assetId === 'string' && raw.assetId.trim()) result.assetId = raw.assetId.trim();
      if (raw.align === 'left' || raw.align === 'right') result.align = raw.align;
      if (raw.width === 25 || raw.width === 50 || raw.width === 75) result.width = raw.width;
      return result;
    }
    if (type === 'blog-video' || type === 'video') {
      const src = lexicalUrl(raw.src);
      if (!src || !/^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i.test(src)) return null;
      result.type = 'blog-video'; result.src = src;
      if (raw.align === 'left' || raw.align === 'right') result.align = raw.align;
      if (raw.width === 25 || raw.width === 50 || raw.width === 75) result.width = raw.width;
      return result;
    }
    result.children = cleanChildren(raw.children);
    return result;
  };
  const children = cleanChildren((root as { children: unknown[] }).children);
  return JSON.stringify({ root: { type: 'root', children } });
}

export function lexicalJsonToHtml(value: string): string {
  const document = JSON.parse(normalizeLexicalJson(value)) as LexicalDocument;
  return document.root.children.map(lexicalNodeToHtml).join('');
}

export function lexicalJsonToPlainText(value: string): string {
  return htmlToPlainText(lexicalJsonToHtml(value));
}

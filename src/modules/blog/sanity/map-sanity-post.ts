import { validateBlogPost } from '../model/blog-schema.ts';
import type { BlogPost } from '../model/blog-types.ts';
import { mapSanityImage, type SanityImageUrlConfig } from './image.ts';
import type { SanityBlogPostDoc } from './types.ts';
import { normalizeLexicalJson, sanitizeBlogHtml } from '../../../lib/admin/blog-content.ts';

/** A malformed published document is a content problem, not a repository outage. */
export class SanityBlogPostMappingError extends Error {
  readonly documentId: string;

  constructor(documentId: string, reason: string) {
    const prefix = `Sanity document ${documentId}:`;
    super(reason.startsWith(prefix) ? reason : `${prefix} ${reason}`);
    this.name = 'SanityBlogPostMappingError';
    this.documentId = documentId;
  }
}

export type SanityPostMappingIssueLogger = (error: SanityBlogPostMappingError) => void;

function logSkippedSanityDocument(error: SanityBlogPostMappingError): void {
  console.error(
    `[blog] Skipping malformed published Sanity document ${error.documentId}. It will not block valid blog posts.`,
    error,
  );
}

function requireString(
  value: string | null | undefined,
  documentId: string,
  field: string,
): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Sanity document ${documentId}: missing ${field}`);
  }
  return trimmed;
}

export function mapSanityPostToBlogPost(
  doc: SanityBlogPostDoc,
  imageConfig: SanityImageUrlConfig,
  options: { summary?: boolean } = {},
): BlogPost {
  const documentId = doc._id;
  const summary = options.summary === true;

  try {
    const slug = requireString(doc.slug, documentId, 'slug');
    const title = requireString(doc.title, documentId, 'title');
    const excerpt = requireString(doc.excerpt, documentId, 'excerpt');
    const publishedAt = requireString(doc.publishedAt, documentId, 'publishedAt');
    const locale = doc.locale === 'ar' ? 'ar' : null;
    if (!locale) {
      throw new Error(`Sanity document ${documentId}: locale must be "ar"`);
    }

    const lexicalPost = doc.bodyFormat === 'lexical' && Boolean(doc.bodyJson?.trim());
    const lexicalJson = lexicalPost ? normalizeLexicalJson(doc.bodyJson!.trim()) : '';
    const adminHtmlPost = Boolean(doc.bodyHtml?.trim()) || lexicalPost || summary;
    const categoryId = adminHtmlPost ? (doc.category?.categoryId?.trim() || 'general') : requireString(doc.category?.categoryId, documentId, 'category.categoryId');
    const categoryLabel = adminHtmlPost ? (doc.category?.label?.trim() || 'عام') : requireString(doc.category?.label, documentId, 'category.label');
    const authorName = adminHtmlPost ? (doc.author?.name?.trim() || 'فريق فال') : requireString(doc.author?.name, documentId, 'author.name');

    if (
      !summary &&
      (!Array.isArray(doc.body) || doc.body.length === 0) &&
      !doc.bodyHtml?.trim() &&
      !doc.bodyJson?.trim()
    ) {
      throw new Error(`Sanity document ${documentId}: body is empty`);
    }

    const cover = doc.cover
      ? mapSanityImage(imageConfig, doc.cover, title, documentId, 'cover')
      : adminHtmlPost
      ? { src: doc.coverUrl?.trim() || '/assets/devices/dental-treatment-unit.jpg', alt: doc.coverUrlAlt?.trim() || title, width: 1600, height: 1067 }
        : mapSanityImage(imageConfig, doc.cover, title, documentId, 'cover');

    const authorImage = doc.author?.image?.asset
      ? mapSanityImage(imageConfig, doc.author.image, authorName, documentId, 'author.image')
      : undefined;

    const relatedSlugs = (doc.relatedPosts ?? [])
      .map((item) => item.slug?.trim())
      .filter((slugValue): slugValue is string => Boolean(slugValue));

    const candidate = {
      id: documentId,
      slug,
      locale: 'ar' as const,
      title,
      excerpt,
      category: { id: categoryId, label: categoryLabel },
      author: {
        name: authorName,
        ...(doc.author?.role?.trim() ? { role: doc.author.role.trim() } : {}),
        ...(authorImage ? { image: authorImage } : {}),
      },
      cover,
      publishedAt,
      ...(doc.updatedAt?.trim() ? { updatedAt: doc.updatedAt.trim() } : {}),
      featured: doc.featured === true,
      draft: false,
      seo: {
        ...(doc.seo?.title?.trim() ? { title: doc.seo.title.trim() } : {}),
        ...(doc.seo?.description?.trim()
          ? { description: doc.seo.description.trim() }
          : {}),
        ...(doc.seo?.focusKeyword?.trim() ? { focusKeyword: doc.seo.focusKeyword.trim() } : {}),
        ...(doc.seo?.canonicalUrl?.trim() ? { canonicalUrl: doc.seo.canonicalUrl.trim() } : {}),
      },
      body: summary
        ? { format: 'html' as const, html: '<p>·</p>' }
        : lexicalPost
        ? { format: 'lexical' as const, version: 1, json: lexicalJson }
        : doc.bodyHtml?.trim()
        ? { format: 'html' as const, html: sanitizeBlogHtml(doc.bodyHtml) }
        : { format: 'portableText' as const, value: doc.body ?? [] },
      ...(doc.relatedServiceId?.trim() ? { relatedServiceId: doc.relatedServiceId.trim() } : {}),
      ...(relatedSlugs.length > 0 ? { relatedSlugs } : {}),
      ...(typeof doc.readingTimeMinutes === 'number'
        ? { readingTimeMinutes: doc.readingTimeMinutes }
        : {}),
    };

    const { post, issues } = validateBlogPost(candidate);
    if (!post) {
      const messages = issues.map((issue) => issue.message).join('; ');
      throw new Error(`Sanity document ${documentId}: validation failed — ${messages}`);
    }
    return post;
  } catch (error) {
    if (error instanceof SanityBlogPostMappingError) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new SanityBlogPostMappingError(documentId, message);
  }
}

export function mapSanityPosts(
  docs: readonly SanityBlogPostDoc[],
  imageConfig: SanityImageUrlConfig,
  onInvalidDocument: SanityPostMappingIssueLogger = logSkippedSanityDocument,
  options: { summary?: boolean } = {},
): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const doc of docs) {
    try {
      posts.push(mapSanityPostToBlogPost(doc, imageConfig, options));
    } catch (error) {
      const mappingError = error instanceof SanityBlogPostMappingError
        ? error
        : new SanityBlogPostMappingError(
          doc._id,
          error instanceof Error ? error.message : String(error),
        );
      onInvalidDocument(mappingError);
    }
  }

  return posts;
}

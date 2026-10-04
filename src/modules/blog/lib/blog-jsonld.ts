import { stripSchemaText } from '../../../lib/seo/schema-text.ts';
import type { BlogPost } from '../model/blog-types.ts';
import { blogPath } from './slug.ts';

type JsonLd = Record<string, unknown>;

const absoluteUrl = (site: URL, path = '/'): string => new URL(path, site).href;

function imageObject(site: URL, src: string): JsonLd {
  return {
    '@type': 'ImageObject',
    url: absoluteUrl(site, src),
  };
}

export function organizationId(site: URL): string {
  return `${site.origin}/#organization`;
}

export function websiteId(site: URL): string {
  return `${site.origin}/#website`;
}

/** Escape literal `<` so CMS text cannot terminate a JSON-LD script element. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function buildBlogPostingSchema(options: {
  site: URL;
  post: BlogPost;
  path: string;
  readingTimeMinutes?: number;
}): JsonLd {
  const url = absoluteUrl(options.site, options.path);
  const { post } = options;
  const keywords = [
    post.seo.focusKeyword,
    ...(post.tags ?? []).map((tag) => tag.label),
  ]
    .map((keyword) => keyword?.trim() ?? '')
    .filter(Boolean);

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    headline: stripSchemaText(post.title, 110),
    description: stripSchemaText(post.seo.description?.trim() || post.excerpt.trim(), 500),
    image: imageObject(options.site, post.cover.src),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: 'ar',
    articleSection: post.category.label,
    ...(keywords.length > 0 ? { keywords } : {}),
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.role ? { jobTitle: post.author.role } : {}),
    },
    publisher: { '@id': organizationId(options.site) },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
    },
    ...(typeof options.readingTimeMinutes === 'number'
      ? { timeRequired: `PT${Math.max(1, Math.round(options.readingTimeMinutes))}M` }
      : {}),
  };
}

export function buildCollectionPageSchema(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  mainEntityId?: string;
}): JsonLd {
  const url = absoluteUrl(options.site, options.path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: options.name,
    description: stripSchemaText(options.description, 500),
    inLanguage: 'ar',
    isPartOf: { '@id': websiteId(options.site) },
    about: { '@id': organizationId(options.site) },
    publisher: { '@id': organizationId(options.site) },
    ...(options.mainEntityId ? { mainEntity: { '@id': options.mainEntityId } } : {}),
  };
}

/** Blog node matching the LMS listing graph. Arabic-only, so no English alternate. */
export function buildBlogSchema(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  posts: readonly BlogPost[];
}): JsonLd {
  const url = absoluteUrl(options.site, options.path);
  const visiblePosts = options.posts.slice(0, 10);
  return {
    '@type': 'Blog',
    '@id': `${url}#blog`,
    name: options.name,
    description: stripSchemaText(options.description, 300),
    url,
    inLanguage: 'ar',
    publisher: { '@id': organizationId(options.site) },
    ...(visiblePosts.length > 0
      ? {
          blogPost: visiblePosts.map((post) => ({
            '@type': 'BlogPosting',
            headline: stripSchemaText(post.title, 110),
            url: absoluteUrl(options.site, blogPath(post.slug)),
            datePublished: post.publishedAt,
          })),
          mainEntity: { '@id': `${url}#itemlist` },
        }
      : {}),
  };
}

export function buildBlogItemListSchema(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  posts: readonly BlogPost[];
  startPosition?: number;
}): JsonLd {
  const url = absoluteUrl(options.site, options.path);
  const start = options.startPosition ?? 1;
  return {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    name: options.name,
    description: stripSchemaText(options.description, 300),
    inLanguage: 'ar',
    numberOfItems: options.posts.length,
    itemListElement: options.posts.map((post, index) => ({
      '@type': 'ListItem',
      position: start + index,
      name: stripSchemaText(post.title, 110),
      url: absoluteUrl(options.site, blogPath(post.slug)),
      item: {
        '@type': 'BlogPosting',
        headline: stripSchemaText(post.title, 110),
        description: stripSchemaText(post.excerpt, 500),
        url: absoluteUrl(options.site, blogPath(post.slug)),
        image: imageObject(options.site, post.cover.src),
        datePublished: post.publishedAt,
      },
    })),
  };
}

export function buildBlogBreadcrumbSchema(site: URL): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: absoluteUrl(site, '/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المدونة',
        item: absoluteUrl(site, '/blogs'),
      },
    ],
  };
}

export function buildBlogCollectionSchemas(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  posts: readonly BlogPost[];
  startPosition?: number;
}): JsonLd[] {
  const listId = `${absoluteUrl(options.site, options.path)}#itemlist`;
  return [
    buildCollectionPageSchema({ ...options, mainEntityId: listId }),
    buildBlogSchema(options),
    buildBlogBreadcrumbSchema(options.site),
    buildBlogItemListSchema(options),
  ];
}

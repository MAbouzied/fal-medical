import { createSanityClient } from '../sanity/client.ts';
import { mapSanityPostToBlogPost, mapSanityPosts } from '../sanity/map-sanity-post.ts';
import {
  featuredPublishedPostQuery,
  listingPostsPageQuery,
  newestPublishedPostQuery,
  publishedPostBySlugQuery,
  publishedPostsCountQuery,
  publishedPostsQuery,
  relatedPostsQuery,
} from '../sanity/queries.ts';
import type { SanityBlogPostDoc } from '../sanity/types.ts';
import { isValidBlogSlug, normalizeBlogSlug } from '../lib/slug.ts';
import type { BlogPost } from '../model/blog-types.ts';
import { BLOG_PAGE_SIZE } from '../model/blog-types.ts';
import type { BlogListingPage, BlogRepository } from './blog-repository.ts';

export interface SanityBlogConfig {
  projectId?: string;
  dataset?: string;
  apiVersion?: string;
  token?: string;
}

export function createSanityBlogRepository(config: SanityBlogConfig = {}): BlogRepository {
  const client = createSanityClient(config);
  const imageConfig = {
    projectId: config.projectId!,
    dataset: config.dataset!,
  };

  return {
    async getPublishedPosts() {
      const docs = await client.fetch<SanityBlogPostDoc[]>(publishedPostsQuery);
      return mapSanityPosts(docs ?? [], imageConfig, undefined, { summary: true });
    },
    async getListingPage(page: number, pageSize = BLOG_PAGE_SIZE): Promise<BlogListingPage | null> {
      if (!Number.isInteger(page) || page < 1 || pageSize < 1) return null;

      const totalPublished = await client.fetch<number>(publishedPostsCountQuery);
      if (!Number.isFinite(totalPublished) || totalPublished < 0) {
        throw new Error('Invalid published post count from Sanity.');
      }

      let featuredDoc =
        (await client.fetch<SanityBlogPostDoc | null>(featuredPublishedPostQuery)) ?? null;
      if (!featuredDoc && totalPublished > 0) {
        featuredDoc =
          (await client.fetch<SanityBlogPostDoc | null>(newestPublishedPostQuery)) ?? null;
      }

      const featured = featuredDoc
        ? mapSanityPostToBlogPost(featuredDoc, imageConfig, { summary: true })
        : null;
      const excludeSlug = featured?.slug ?? '';
      const recentTotal = Math.max(0, totalPublished - (featured ? 1 : 0));
      const totalPages = Math.max(1, Math.ceil(recentTotal / pageSize) || 1);

      if (page > totalPages) return null;

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const docs = await client.fetch<SanityBlogPostDoc[]>(listingPostsPageQuery, {
        excludeSlug,
        start,
        end,
      });
      const items = mapSanityPosts(docs ?? [], imageConfig, undefined, { summary: true });

      return {
        featured: page === 1 ? featured : null,
        items,
        totalPublished,
        totalPages,
        page,
      };
    },
    async getPostBySlug(slug: string) {
      const canonicalSlug = normalizeBlogSlug(slug);
      if (!isValidBlogSlug(canonicalSlug)) return null;
      const doc = await client.fetch<SanityBlogPostDoc | null>(publishedPostBySlugQuery, {
        slug: canonicalSlug,
      });
      if (!doc) return null;
      return mapSanityPostToBlogPost(doc, imageConfig);
    },
    async getRelatedPosts(post: BlogPost, limit = 3) {
      const docs = await client.fetch<SanityBlogPostDoc[]>(relatedPostsQuery, {
        slug: post.slug,
        categoryId: post.category.id,
        limit,
      });
      return mapSanityPosts(docs ?? [], imageConfig, undefined, { summary: true });
    },
  };
}

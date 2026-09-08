import { filterPublishedPosts, paginatePosts, selectListing, selectRelatedPosts } from '../lib/blog-selectors.ts';
import { isValidBlogSlug, normalizeBlogSlug } from '../lib/slug.ts';
import type { BlogPost } from '../model/blog-types.ts';
import { BLOG_PAGE_SIZE } from '../model/blog-types.ts';
import type { BlogListingPage, BlogRepository } from './blog-repository.ts';
import { getMockAdminPublishedPostsSync } from '../../../lib/admin/blog-admin.ts';

/** Synchronous access for route registration / sitemap during build. */
export function getMockPublishedPostsSync(now = new Date()): BlogPost[] {
  return filterPublishedPosts(getMockAdminPublishedPostsSync(), now);
}

function listingPageFromPosts(
  posts: readonly BlogPost[],
  page: number,
  pageSize: number,
  now = new Date(),
): BlogListingPage | null {
  const listing = selectListing(posts, now);
  const recentPage = paginatePosts(listing.recent, page, pageSize);
  if (!recentPage) return null;
  return {
    featured: page === 1 ? listing.featured : null,
    items: recentPage.items,
    totalPublished: listing.allPublished.length,
    totalPages: recentPage.totalPages,
    page,
  };
}

export function createMockBlogRepository(): BlogRepository {
  return {
    async getPublishedPosts() {
      return getMockPublishedPostsSync();
    },
    async getListingPage(page: number, pageSize = BLOG_PAGE_SIZE) {
      return listingPageFromPosts(getMockPublishedPostsSync(), page, pageSize);
    },
    async getPostBySlug(slug: string) {
      const canonicalSlug = normalizeBlogSlug(slug);
      if (!isValidBlogSlug(canonicalSlug)) return null;
      const published = getMockPublishedPostsSync();
      return published.find((post) => post.slug === canonicalSlug) ?? null;
    },
    async getRelatedPosts(post, limit = 3) {
      return selectRelatedPosts(getMockPublishedPostsSync(), post, limit);
    },
  };
}

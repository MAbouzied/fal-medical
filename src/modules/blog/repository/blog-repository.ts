import type { BlogPost } from '../model/blog-types.ts';

export interface BlogListingPage {
  featured: BlogPost | null;
  items: BlogPost[];
  totalPublished: number;
  totalPages: number;
  page: number;
}

export interface BlogRepository {
  /** Lightweight summaries for sitemap / admin tooling. */
  getPublishedPosts(): Promise<BlogPost[]>;
  /** Sanity-side (or equivalent) paginated listing without full bodies. */
  getListingPage(page: number, pageSize?: number): Promise<BlogListingPage | null>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  getRelatedPosts(post: BlogPost, limit?: number): Promise<BlogPost[]>;
}

export type BlogProvider = 'mock' | 'sanity';

import type { BlogPost } from '../model/blog-types.ts';
import { BLOG_PAGE_SIZE } from '../model/blog-types.ts';
import type { BlogListingPage, BlogRepository } from '../repository/blog-repository.ts';

export type PublicBlogSuccess<T> = { ok: true; data: T };
export type PublicBlogFailure = { ok: false; kind: 'unavailable' | 'not_found' };
export type PublicBlogResult<T> = PublicBlogSuccess<T> | PublicBlogFailure;

async function resolveRepository(repository?: BlogRepository): Promise<BlogRepository> {
  if (repository) return repository;
  const { getBlogRepository } = await import('../repository/get-blog-repository.ts');
  return getBlogRepository();
}

/** @deprecated Prefer loadPublicBlogListingPage for UI listings. */
export async function loadPublicBlogList(
  repository?: BlogRepository,
): Promise<PublicBlogResult<BlogPost[]>> {
  try {
    const data = await (await resolveRepository(repository)).getPublishedPosts();
    return { ok: true, data };
  } catch (error) {
    console.error('[blog] Failed to load published posts.', error);
    return { ok: false, kind: 'unavailable' };
  }
}

export async function loadPublicBlogListingPage(
  page: number,
  pageSize = BLOG_PAGE_SIZE,
  repository?: BlogRepository,
): Promise<PublicBlogResult<BlogListingPage>> {
  try {
    const data = await (await resolveRepository(repository)).getListingPage(page, pageSize);
    if (!data) return { ok: false, kind: 'not_found' };
    return { ok: true, data };
  } catch (error) {
    console.error(`[blog] Failed to load listing page ${page}.`, error);
    return { ok: false, kind: 'unavailable' };
  }
}

export async function loadPublicBlogPost(
  slug: string,
  repository?: BlogRepository,
): Promise<PublicBlogResult<BlogPost>> {
  try {
    const data = await (await resolveRepository(repository)).getPostBySlug(slug);
    if (!data) return { ok: false, kind: 'not_found' };
    return { ok: true, data };
  } catch (error) {
    console.error(`[blog] Failed to load article "${slug}".`, error);
    return { ok: false, kind: 'unavailable' };
  }
}

export async function loadPublicRelatedPosts(
  post: BlogPost,
  limit = 3,
  repository?: BlogRepository,
): Promise<BlogPost[]> {
  try {
    return await (await resolveRepository(repository)).getRelatedPosts(post, limit);
  } catch (error) {
    console.error(`[blog] Failed to load related posts for "${post.slug}".`, error);
    return [];
  }
}

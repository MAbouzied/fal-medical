import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { BlogPost } from '../model/blog-types.ts';
import type { BlogListingPage, BlogRepository } from '../repository/blog-repository.ts';
import {
  loadPublicBlogList,
  loadPublicBlogListingPage,
  loadPublicBlogPost,
  loadPublicRelatedPosts,
} from './load-public-blog.ts';

function stubPost(slug: string): BlogPost {
  return {
    id: `id-${slug}`,
    slug,
    locale: 'ar',
    title: 'عنوان',
    excerpt: 'مقدمة كافية لاختبار التحميل العام للمقالات.',
    category: { id: 'general', label: 'عام' },
    author: { name: 'فريق فال' },
    cover: { src: '/assets/landing-hero.jpg', alt: 'غلاف', width: 1200, height: 630 },
    publishedAt: '2026-01-01T00:00:00.000Z',
    featured: false,
    draft: false,
    seo: {},
    body: { format: 'html', html: '<p>نص</p>' },
  };
}

function stubListing(page = 1): BlogListingPage {
  return {
    featured: stubPost('featured'),
    items: [stubPost('a')],
    totalPublished: 2,
    totalPages: 1,
    page,
  };
}

function stubRepository(overrides: Partial<BlogRepository> = {}): BlogRepository {
  return {
    async getPublishedPosts() {
      return [];
    },
    async getListingPage() {
      return stubListing();
    },
    async getPostBySlug() {
      return null;
    },
    async getRelatedPosts() {
      return [];
    },
    ...overrides,
  };
}

describe('loadPublicBlogList', () => {
  it('returns published posts on success', async () => {
    const repository = stubRepository({
      async getPublishedPosts() {
        return [stubPost('a')];
      },
    });
    const result = await loadPublicBlogList(repository);
    assert.equal(result.ok, true);
    if (!result.ok) throw new Error('expected success');
    assert.equal(result.data[0]?.slug, 'a');
  });

  it('maps repository failures to unavailable', async () => {
    const repository = stubRepository({
      async getPublishedPosts() {
        throw new Error('sanity down');
      },
    });
    assert.deepEqual(await loadPublicBlogList(repository), { ok: false, kind: 'unavailable' });
  });
});

describe('loadPublicBlogListingPage', () => {
  it('returns a paginated listing page', async () => {
    const result = await loadPublicBlogListingPage(1, 9, stubRepository());
    assert.equal(result.ok, true);
    if (!result.ok) throw new Error('expected success');
    assert.equal(result.data.featured?.slug, 'featured');
    assert.equal(result.data.items[0]?.slug, 'a');
  });

  it('maps missing pages to not_found', async () => {
    const repository = stubRepository({
      async getListingPage() {
        return null;
      },
    });
    assert.deepEqual(await loadPublicBlogListingPage(9, 9, repository), {
      ok: false,
      kind: 'not_found',
    });
  });

  it('maps repository failures to unavailable', async () => {
    const repository = stubRepository({
      async getListingPage() {
        throw new Error('sanity down');
      },
    });
    assert.deepEqual(await loadPublicBlogListingPage(1, 9, repository), {
      ok: false,
      kind: 'unavailable',
    });
  });
});

describe('loadPublicBlogPost', () => {
  it('returns not_found for missing posts', async () => {
    assert.deepEqual(await loadPublicBlogPost('missing', stubRepository()), {
      ok: false,
      kind: 'not_found',
    });
  });

  it('maps hard mapping failures to unavailable', async () => {
    const repository = stubRepository({
      async getPostBySlug() {
        throw new Error('bad document');
      },
    });
    assert.deepEqual(await loadPublicBlogPost('broken', repository), {
      ok: false,
      kind: 'unavailable',
    });
  });
});

describe('loadPublicRelatedPosts', () => {
  it('returns related posts on success', async () => {
    const current = stubPost('current');
    const repository = stubRepository({
      async getRelatedPosts() {
        return [stubPost('related')];
      },
    });
    const related = await loadPublicRelatedPosts(current, 3, repository);
    assert.equal(related[0]?.slug, 'related');
  });

  it('returns an empty list when related lookup fails', async () => {
    const repository = stubRepository({
      async getRelatedPosts() {
        throw new Error('related down');
      },
    });
    assert.deepEqual(await loadPublicRelatedPosts(stubPost('current'), 3, repository), []);
  });
});

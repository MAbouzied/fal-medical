import { test, expect } from '@playwright/test';
import { createMockBlogListing, getPublishedMockPosts } from '../fixtures/mock-blog';

test.describe('SEO mock fixtures (Phase 1 scaffolding)', () => {
  test('mock listing exposes slug and publish fields for later SEO asserts', () => {
    const posts = createMockBlogListing();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.slug.length).toBeGreaterThan(0);
      expect(['draft', 'published']).toContain(post.status);
    }
  });

  test('published-only helper excludes drafts', () => {
    const published = getPublishedMockPosts();
    expect(published.every((post) => post.status === 'published')).toBe(true);
    expect(published.some((post) => post.slug === 'mock-draft-post')).toBe(false);
  });
});

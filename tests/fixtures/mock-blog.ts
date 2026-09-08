/** Stub blog data for Playwright SEO / smoke harness (no live Sanity). */

export interface MockBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  featured: boolean;
}

export function createMockBlogListing(): MockBlogPost[] {
  return [
    {
      id: 'mock-post-1',
      slug: 'mock-published-post',
      title: 'مقال تجريبي منشور',
      excerpt: 'مقتطف وهمي لاختبارات SEO.',
      status: 'published',
      publishedAt: '2026-01-15T10:00:00.000Z',
      featured: true,
    },
    {
      id: 'mock-post-2',
      slug: 'mock-draft-post',
      title: 'مسودة تجريبية',
      excerpt: 'لا يجب فهرستها.',
      status: 'draft',
      publishedAt: null,
      featured: false,
    },
  ];
}

export function getPublishedMockPosts(): MockBlogPost[] {
  return createMockBlogListing().filter((post) => post.status === 'published');
}

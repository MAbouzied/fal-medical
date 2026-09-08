import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildBlogPostingSchema,
  serializeJsonLd,
} from '../modules/blog/lib/blog-jsonld.ts';
import type { BlogPost } from '../modules/blog/model/blog-types.ts';

const post: BlogPost = {
  id: 'test',
  slug: 'test-post',
  locale: 'ar',
  title: 'عنوان يحتوي <script>',
  excerpt: 'وصف <img>',
  category: { id: 'dentistry', label: 'طب الأسنان' },
  author: { name: 'مؤلف' },
  cover: {
    src: '/assets/devices/dental-treatment-unit.jpg',
    alt: 'غلاف',
    width: 1600,
    height: 1067,
  },
  publishedAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-02T00:00:00.000Z',
  featured: false,
  draft: false,
  seo: { description: 'وصف SEO' },
  body: { format: 'blocks', blocks: [{ type: 'paragraph', text: 'نص' }] },
};

describe('blog JSON-LD', () => {
  it('builds BlogPosting schema with required fields', () => {
    const site = new URL('https://falclinic.com');
    const schema = buildBlogPostingSchema({
      site,
      post,
      path: '/blogs/test-post',
      readingTimeMinutes: 3,
    });

    assert.equal(schema['@type'], 'BlogPosting');
    assert.equal(schema.headline, post.title);
    assert.equal(schema.inLanguage, 'ar-SA');
    assert.equal(schema.datePublished, post.publishedAt);
    assert.equal(schema.dateModified, post.updatedAt);
    assert.equal(schema.articleSection, 'طب الأسنان');
    assert.deepEqual(schema.publisher, { '@id': 'https://falclinic.com/#organization' });
    assert.equal(schema.timeRequired, 'PT3M');
  });

  it('escapes literal < characters for script-safe JSON-LD', () => {
    const serialized = serializeJsonLd({ text: 'قبل <script> بعد' });
    assert.equal(serialized.includes('<'), false);
    assert.equal(serialized.includes('\\u003c'), true);
  });
});

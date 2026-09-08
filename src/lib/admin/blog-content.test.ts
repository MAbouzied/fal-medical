import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  lexicalJsonToHtml,
  lexicalJsonToPlainText,
  normalizeLexicalJson,
  sanitizeBlogHtml,
} from './blog-content.ts';

describe('sanitizeBlogHtml', () => {
  it('canonicalizes anchor rel and drops scripts', () => {
    const html = sanitizeBlogHtml(
      '<a href="https://example.com" target="_blank" rel="opener">Link</a><script>alert(1)</script>',
    );
    assert.match(html, /rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /rel="opener"/);
    assert.doesNotMatch(html, /script|alert/);
  });

  it('is idempotent for safe markup', () => {
    const once = sanitizeBlogHtml('<p>مرحبا <strong>بك</strong></p>');
    assert.equal(sanitizeBlogHtml(once), once);
  });

  it('rejects javascript URLs and keeps text when links are unsafe', () => {
    const html = sanitizeBlogHtml('<a href="javascript:alert(1)">خطر</a>');
    assert.doesNotMatch(html, /javascript|href=/);
    assert.match(html, /خطر/);
  });

  it('allows non-www YouTube iframes and blocks arbitrary video hosts', () => {
    const html = sanitizeBlogHtml(
      [
        '<iframe src="https://youtube.com/embed/abc" title="yt"></iframe>',
        '<video src="https://evil.example/video.mp4" controls></video>',
      ].join(''),
    );
    assert.match(html, /youtube\.com\/embed\/abc/);
    assert.doesNotMatch(html, /evil\.example|video\.mp4/);
  });
});

describe('Lexical blog content', () => {
  it('normalizes supported formatting and serializes safe HTML', () => {
    const json = JSON.stringify({ root: { type: 'root', children: [
      { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'العنوان', format: 1 }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'نص مهم', format: 2 }] },
      { type: 'blog-image', src: 'https://cdn.sanity.io/image.jpg', alt: 'صورة', caption: 'تعليق' },
    ] } });
    const normalized = normalizeLexicalJson(json);
    const html = lexicalJsonToHtml(normalized);
    assert.match(html, /<h2><strong>العنوان<\/strong><\/h2>/);
    assert.match(html, /<em>نص مهم<\/em>/);
    assert.match(html, /<img[^>]+alt="صورة"/);
    assert.equal(lexicalJsonToPlainText(normalized), 'العنوان نص مهم تعليق');
  });

  it('drops unsafe links and temporary image URLs', () => {
    const json = JSON.stringify({ root: { type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'link', url: 'javascript:alert(1)', children: [{ type: 'text', text: 'خطر' }] }] },
      { type: 'blog-image', src: 'blob:temporary', alt: 'مؤقت' },
    ] } });
    const html = lexicalJsonToHtml(json);
    assert.doesNotMatch(html, /javascript|blob:/);
    assert.match(html, /خطر/);
  });

  it('preserves text when an invalid link URL is removed', () => {
    const json = JSON.stringify({ root: { type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'link', url: 'not-a-url', children: [{ type: 'text', text: 'يبقى النص' }] }] },
    ] } });
    const html = lexicalJsonToHtml(normalizeLexicalJson(json));
    assert.equal(html, '<p>يبقى النص</p>');
  });

  it('keeps supported inline image alignment and width controls', () => {
    const json = JSON.stringify({ root: { type: 'root', children: [
      { type: 'blog-image', src: 'https://cdn.sanity.io/image.jpg', alt: 'صورة', align: 'left', width: 50 },
    ] } });
    const normalized = normalizeLexicalJson(json);
    assert.match(normalized, /"align":"left"/);
    assert.match(normalized, /"width":50/);
    assert.match(
      lexicalJsonToHtml(normalized),
      /class="blog-body__image blog-body__image--w50 blog-body__image--left"/,
    );
  });

  it('keeps supported video alignment and width controls', () => {
    const json = JSON.stringify({ root: { type: 'root', children: [
      { type: 'blog-video', src: 'https://www.youtube-nocookie.com/embed/demo', align: 'right', width: 75 },
    ] } });
    const normalized = normalizeLexicalJson(json);
    assert.match(normalized, /"align":"right"/);
    assert.match(normalized, /"width":75/);
    assert.match(
      lexicalJsonToHtml(normalized),
      /class="blog-body__embed blog-body__embed--w75 blog-body__embed--right"/,
    );
  });
});

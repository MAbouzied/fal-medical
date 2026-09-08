# Blog Implementation Plan

## Confirmed Decisions

- Launch Arabic blogs only.
- Use `/blogs` for the listing and `/blogs/[slug]` for article details.
- "Latest" means one editorially featured article. "Recent" means all remaining published articles ordered newest first, excluding the featured article.
- Build the feature as an extractable Astro module using CSS-variable theming.
- Use mock content until Sanity is configured.
- Keep the current Tajawal typography, teal primary color, mint surfaces, existing radii, shadows, and spacing rhythm.

## Impeccable Direction

This is a **Read-mode** surface: comprehension, trust, comfortable reading, and wayfinding take priority over decorative complexity.

The Impeccable concept-seed workflow identified that the project has no `PRODUCT.md`, so implementation should begin with a small product-context and surface-brief step before visual code is written.

### Listing Page

The first viewport should be an editorial composition rather than a generic marketing hero:

- Breadcrumb and compact page introduction.
- A single featured article occupying the visual focus.
- Large 16:9 or 4:3 cover image paired with category, publication date, reading time, title, excerpt, and clear "قراءة المقال" action.
- Asymmetric desktop layout that reverses correctly in RTL.
- An "أحدث المقالات" section containing the remaining posts in a responsive card grid.
- Booking CTA after the articles, using the existing `BookingSection`.

### Article Page

- Breadcrumbs: الرئيسية > المدونة > عنوان المقال.
- Category, publication date, optional updated date, and reading time.
- One strong H1 followed by the cover image.
- A reading column restricted to approximately `65-75ch`.
- Explicit typography for headings, paragraphs, lists, quotes, links, captions, tables, and inline media.
- Optional table of contents when an article has enough second-level headings.
- Related articles, prioritizing the same category.
- Booking CTA as the final conversion point.

The blog should feel like an extension of Fal Clinic, not a separate magazine identity.

## Module Architecture

The routes should remain thin. Content retrieval, sorting, rendering, and UI should live inside an extractable module:

```text
src/
  modules/
    blog/
      model/
        blog-types.ts
        blog-schema.ts
      repository/
        blog-repository.ts
        mock-blog-repository.ts
        sanity-blog-repository.ts
        create-blog-repository.ts
      content/
        mock-posts.ts
        content-renderers.ts
      lib/
        blog-selectors.ts
        reading-time.ts
        date-format.ts
        slug.ts
      components/
        BlogListing.astro
        FeaturedBlog.astro
        BlogGrid.astro
        BlogCard.astro
        BlogArticle.astro
        BlogBody.astro
        BlogMeta.astro
        BlogImage.astro
        BlogEmptyState.astro
        BlogPagination.astro
      styles/
        blog.css
      index.ts

  pages/
    blogs.astro
    blogs/
      [slug].astro
      page/
        [page].astro
```

`/blogs/page/[page]` would reuse the listing design and only be generated once the number of articles exceeds the configured page size. This keeps two page types: listing and detail.

## Content Contract

Define one normalized model that both mock data and Sanity must return:

```ts
interface BlogPost {
  id: string;
  slug: string;
  locale: "ar";
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: BlogAuthor;
  cover: BlogImage;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  draft: boolean;
  seo: BlogSeo;
  body: BlogBody;
}
```

The model should also include:

- Cover image URL, alt text, width, height, optional focal point, and caption.
- Stable category ID and Arabic label.
- Author name and optional role/image.
- SEO title and description overrides.
- Content format and version.
- Optional related article slugs.
- Optional estimated reading time override.

### Body Format

Avoid coupling the blog module directly to Sanity Portable Text or Lexical.

Use a discriminated body type:

```ts
type BlogBody =
  | { format: "blocks"; blocks: BlogContentBlock[] }
  | { format: "lexical"; version: number; json: string };
```

Mock posts should initially use typed blocks. A Lexical renderer can later be registered when the editor package is integrated.

Supported mock blocks should include:

- Paragraph
- H2 and H3
- Ordered and unordered lists
- Quote with optional attribution
- Image with caption
- Safe internal and external links
- Two-column content that collapses on mobile
- Optional video/embed placeholder for future support

Never render raw CMS HTML directly. Lexical JSON must be validated and transformed through an allowlisted renderer. The editor's existing `sanitizeBlogEditorHtml()` is structural cleanup, not security sanitization.

## Implementation Phases

### 1. Establish Impeccable Context

1. Run Impeccable `init` to capture product truth in `PRODUCT.md`.
2. Record that the current implementation is the visual authority; this is an extension, not a redesign.
3. Create a blog surface brief in Read mode covering audience, purpose, reading flow, Arabic-only delivery, and conversion.
4. Run the Impeccable surface concept step after product context exists.
5. Load the Impeccable craft floor immediately before UI implementation.
6. Finish with Impeccable `adapt`, `audit`, and `polish` passes against real desktop and mobile renders.

### 2. Build the Repository Boundary

Create an asynchronous `BlogRepository` interface even though mock content is local:

```ts
interface BlogRepository {
  getPublishedPosts(): Promise<BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
}
```

Use an explicit provider setting such as `BLOG_PROVIDER=mock|sanity`.

Behavior:

- `mock` reads typed fixtures.
- `sanity` fails clearly when required configuration is missing.
- Do not silently fall back to mock data when `sanity` is selected.
- Page components should not know which provider is active.

### 3. Add Mock Data

Create approximately six realistic Arabic articles covering existing dental, dermatology, laser, and preventive-care topics.

The fixtures should exercise:

- One featured post.
- Several categories.
- A long title.
- A post with an updated date.
- Quotes, lists, links, images, and headings.
- Mixed Arabic and English medical terminology.
- One post without optional author imagery.
- At least one same-category pair for related-post selection.

Use existing local images temporarily where appropriate, but give each use accurate alt text and dimensions. Medical statements should be conservative and marked for clinical review before production publication.

### 4. Implement Selectors

Keep listing logic outside the page:

- Remove drafts.
- Remove future-dated posts.
- Sort by `publishedAt` descending.
- Use the newest `featured: true` post as the lead.
- Fall back to the newest post if none is featured.
- Exclude the featured post from recent results.
- Use the slug as a deterministic tie-breaker when dates match.
- Prefer related posts from the same category.
- Exclude the current post from related results.
- Calculate Arabic reading time from extractable text, with a minimum of one minute.

Multiple featured posts should not break rendering. Select deterministically and make content validation report the conflict.

### 5. Build the Listing Page

`BlogListing.astro` should accept normalized data and labels as props rather than importing application content.

Composition:

- Arabic page title and introductory copy.
- Featured article block.
- Recent article grid.
- Accessible article count.
- Pagination when required.
- Empty-state panel when no posts exist.
- Existing booking section through a slot or route-level composition.

`BlogCard.astro` should:

- Use a semantic `<article>`.
- Contain one primary article link.
- Avoid nested interactive links.
- Clamp visual excerpts without removing full accessible content.
- Preserve image aspect ratio and dimensions.
- Use logical RTL spacing properties.
- Handle long categories and titles without card-height breakage.

### 6. Build the Article Page

`BlogArticle.astro` should receive the post, related posts, breadcrumbs, and optional CTA slots.

Responsibilities:

- Render exactly one H1.
- Render valid `<time datetime>` elements.
- Display "آخر تحديث" only when it differs meaningfully from publication time.
- Generate stable heading IDs.
- Generate a table of contents only when at least four H2 headings exist.
- Render rich content through the registered body renderer.
- Render related posts without duplicating the current article.
- Preserve readable line length on wide displays.
- Remove nonessential sidebars on mobile.
- Add print-friendly styles that hide navigation, booking UI, and related cards.

Unknown content nodes should be skipped safely and reported during development rather than crashing the complete article.

### 7. Make Styling Portable

The blog module should not directly depend on all Fal Clinic token names.

Define a small semantic contract in `blog.css`:

```css
--blog-surface
--blog-surface-soft
--blog-text
--blog-muted
--blog-accent
--blog-border
--blog-radius-card
--blog-shadow-card
--blog-reading-width
```

The application wrapper maps these to existing tokens such as:

- `--color-surface`
- `--color-surface-soft`
- `--color-ink`
- `--color-muted`
- `--color-primary`
- `--color-border`
- `--radius-card`
- `--shadow-card`

Provide sensible fallbacks so the module can be copied into another Astro application. Keep all selectors scoped under a blog root class to prevent typography styles from leaking into the rest of the site.

### 8. Handle Arabic-Only SEO

The current SEO system assumes every route has Arabic and English counterparts. That assumption must be relaxed.

Change the route model so `en` can be absent, or replace fixed locale fields with partial locale paths.

Required behavior:

- `/blogs` and `/blogs/[slug]` remain indexable.
- No `/en/blogs` routes are generated.
- Blog pages emit canonical URLs.
- Blog pages do not emit an English hreflang pointing to a nonexistent page.
- `og:locale:alternate` is omitted when no alternate exists.
- The language switch can return visitors to `/en`, but must not pretend that an equivalent article exists.
- English header and footer navigation should not show a Blog link yet.
- Arabic header and footer receive a Blog link.
- Sitemap generation includes Arabic blog URLs individually.
- Sitemap `lastmod` uses `updatedAt` or `publishedAt`.
- Existing bilingual service and doctor behavior remains unchanged.
- SEO verification must validate alternates according to actual locale availability instead of requiring three hreflangs on every page.

### 9. Add Article SEO

Extend `Layout.astro` with optional article metadata:

- Published time
- Modified time
- Author
- Section/category
- Tags

Add `BlogPosting` schema support containing:

- `headline`
- `description`
- `image`
- `datePublished`
- `dateModified`
- `author`
- `publisher`
- `mainEntityOfPage`
- `articleSection`
- `inLanguage: ar-SA`

The listing should use `CollectionPage` and `ItemList` schemas.

JSON-LD serialization should escape literal `<` characters before insertion so CMS content cannot terminate the script element.

### 10. Prepare Sanity Integration

The later Sanity adapter should require:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- Optional server-only read token for drafts or private datasets

The Sanity document should mirror the normalized model: title, slug, excerpt, category, author, cover asset, alt text, featured state, dates, SEO fields, body format, and body payload.

Use build-time queries for public articles and trigger rebuilds through a Sanity webhook to GitHub Actions or Cloudflare deployment.

Additional rules:

- Query only published, non-draft documents.
- Require unique slugs.
- Configure `cdn.sanity.io` as an authorized image source.
- Request image dimensions and hotspot metadata.
- Fail the build on malformed published documents.
- Do not replace Sanity failures with mock content in production.
- Use Sanity asset IDs as media keys; no S3 credentials are required.
- Keep preview and draft routes separate and `noindex` if added later.

## Edge Cases

| Scenario | Expected behavior |
| --- | --- |
| No posts | Show a useful Arabic empty state and booking CTA; do not render empty grids |
| One post | Promote it as featured and hide the recent section |
| No featured post | Use the newest published post |
| Multiple featured posts | Pick the newest deterministically and fail/report content validation |
| Future publication date | Exclude from listing, detail routes, related posts, and sitemap |
| Draft post | Exclude everywhere in production |
| Duplicate slug | Fail validation/build |
| Unknown slug | Return a real 404 instead of redirecting to `/blogs` |
| Missing cover image | Reject a published post or use an intentional branded fallback |
| Missing image alt | Fail published-content validation |
| Invalid date | Fail validation rather than sorting unpredictably |
| Equal dates | Sort deterministically by slug |
| Very long title | Wrap naturally without overlapping metadata or controls |
| Empty article body | Exclude or mark `noindex`; never publish an empty article shell |
| Unknown Lexical node | Skip safely, log during development, and preserve the rest of the article |
| Broken remote image | Preserve dimensions and show a neutral background without layout shift |
| External links | Validate protocols and add `rel="noopener noreferrer"` where appropriate |
| Pagination page 1 | Canonicalize to `/blogs`; do not generate `/blogs/page/1` |
| Empty pagination page | Return 404 |
| Current post in related set | Always exclude it |
| Fewer than three related posts | Fill from recent posts without duplicates |
| Sanity unavailable during build | Fail with an actionable error when Sanity is selected |
| JavaScript disabled | All article reading, pagination, and navigation continue to work |
| Reduced motion | No required information depends on animation |
| Narrow viewport | Featured layout stacks, media stays contained, and columns collapse |
| Mixed Arabic/English text | Preserve correct bidi behavior and avoid hardcoded left/right spacing |

## Verification

Run:

```text
npm run check
npm test
npm run build
npm run seo:verify
```

Add tests for:

- Featured and recent selection.
- Future and draft filtering.
- Stable date sorting.
- Reading-time extraction.
- Slug validation.
- Related-post selection.
- Content schema validation.
- Arabic-only sitemap and alternate metadata.
- `BlogPosting` JSON-LD.

Complete browser review at approximately:

- 320px mobile
- 390px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

Acceptance requires:

- No horizontal overflow.
- One H1 per page.
- Complete keyboard navigation.
- Correct focus visibility.
- Correct RTL behavior.
- No layout shift from article images.
- Readable line lengths.
- Valid canonical and sitemap entries.
- No English alternate pointing to missing content.
- No client-side JavaScript required for the core blog experience.
- Mock-to-Sanity switching without changing route or component code.

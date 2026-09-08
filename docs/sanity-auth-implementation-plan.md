# Sanity and Staff Authentication Implementation Plan

## Key Findings

- The Sanity `production` dataset is public and currently contains no documents.
- `SANITY_API_VERSION` is selected and pinned by the developer. Use `2026-08-03`.
- The Sanity organization ID is not required by the application.
- The exposed Sanity token must be revoked. Public published-content reads currently require no token.
- The existing Sanity repository always throws and is not wired to the environment variables.
- The implementation will include a Sanity Studio, a staff-only admin area, and Better Auth rather than direct Auth.js Core.

## Environment Contract

| Variable | Purpose | Required |
| --- | --- | --- |
| `BLOG_PROVIDER=sanity` | Activates Sanity | Yes |
| `SANITY_PROJECT_ID=nzy22u9z` | Sanity project | Yes |
| `SANITY_DATASET=production` | Dataset | Yes |
| `SANITY_API_VERSION=2026-08-03` | Fixed Content Lake API behavior | Yes |
| `SANITY_API_TOKEN` | Private dataset read token | No, omit currently |
| `PUBLIC_SANITY_STUDIO_URL` | Link from `/admin` to hosted Studio | After Studio deployment |
| `BETTER_AUTH_SECRET` | Encrypts and signs sessions | Yes, generated locally |
| `BETTER_AUTH_URL` | Application origin | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth web client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `SANITY_AUTH_DATASET` | Private `staff-auth` dataset containing approved staff records | Yes |
| `SANITY_AUTH_TOKEN` | Server-only token for the private staff dataset | Yes |

Local `BETTER_AUTH_URL`:

```env
BETTER_AUTH_URL=http://localhost:4321
```

Production value:

```env
BETTER_AUTH_URL=https://falclinic.com
```

## Implementation Plan

### 1. Secure the credentials

Revoke the exposed Sanity token and do not place its replacement in source control. Published content will use unauthenticated access while the dataset remains public. If it becomes private, create a Viewer-only token. Use a separate short-lived Editor token only for imports.

### 2. Install dependencies

Add `@sanity/client`, `@sanity/image-url`, `astro-portabletext`, and `better-auth`. Add the Sanity Studio dependencies separately, including `sanity`, `react`, `react-dom`, and `styled-components`. Keep the Studio standalone rather than embedding React into the public Astro application.

### 3. Create the Sanity Studio

Add `sanity.config.ts`, `sanity.cli.ts`, Studio scripts, and schema modules. Deploy the Studio through Sanity hosting and link it from the application admin dashboard.

The schema will contain:

| Type | Important fields |
| --- | --- |
| `blogPost` | Title, slug, locale, excerpt, cover, author, category, publication dates, featured status, SEO, body, and related posts |
| `blogAuthor` | Name, role, and portrait |
| `blogCategory` | Stable identifier and Arabic label |
| `blogImage` | Image asset, alternative text, caption, and hotspot |
| `blogSeo` | Title and description |
| Portable Text objects | Inline image, links, two-column content, and embed placeholder |

Validation will enforce required Arabic content, ASCII kebab-case slugs, accessible image alternative text, publication dates, excerpt and SEO limits, and valid references.

### 4. Implement the Sanity queries

Add typed GROQ queries and keep them behind the existing `BlogRepository` interface.

`getPublishedPosts()` will:

- Select `_type == "blogPost"`.
- Use the published perspective.
- Exclude drafts and future `publishedAt` values.
- Require a valid slug and Arabic locale.
- Dereference authors, categories, related articles, and image assets.
- Project image dimensions, crop, hotspot, captions, and URLs.
- Preserve Portable Text marks and custom blocks.
- Sort featured content first and then by newest publication date.

`getPostBySlug(slug)` will:

- Parameterize the slug rather than interpolate it.
- Apply the same publication and locale restrictions.
- Return `null` when no published article exists.
- Use the same projection as the collection query.

### 5. Build a strict mapping layer

Convert raw Sanity results into `BlogPost`, validate them using the existing blog schema, normalize dates and slugs, and produce contextual errors containing the document ID. Sanity failures will never silently fall back to mock content.

### 6. Create one server composition root

Add a server-only repository factory that imports Astro environment values and creates the selected repository. Cache the published-post promise during each build so the listing, static paths, pagination, and sitemap do not repeat identical Sanity requests.

### 7. Wire every blog route

Update:

- `src/pages/blogs.astro`
- `src/pages/blogs/[slug].astro`
- `src/pages/blogs/page/[page].astro`

Static generation remains enabled. The article route will generate paths from Sanity posts, listing pagination will use the fetched collection, and an empty dataset will render the existing empty state without breaking the build.

### 8. Render Portable Text and Sanity images

Keep mock block rendering operational and add a Portable Text renderer for Sanity. Support headings, paragraphs, emphasis, strong text, lists, quotes, safe links, images, two-column blocks, and placeholders. Generate responsive Sanity CDN URLs with automatic formats and apply hotspot positioning.

### 9. Fix sitemap, locale, and SEO coupling

Remove direct mock-post imports from the route manifest. Treat every `/blogs/**` URL as Arabic-only regardless of its source. Generate sitemap article and pagination URLs from the active repository. Update SEO verification so it does not assume six mock articles. Add `cdn.sanity.io` to the image and security policies.

### 10. Add content publication updates

Keep public blog pages static for performance. Configure a Sanity webhook to invoke the deployment or build hook whenever a post, author, or category is published or changed. Without this webhook, newly published content will not appear until the next build.

### 11. Configure Better Auth

Use Better Auth's Astro-supported stateless mode without D1 for this staff-only scope. Sessions will use encrypted cookies, an approximately eight-hour lifetime, secure cookies over HTTPS, and no Google refresh or offline scopes.

Authentication will request only:

```text
openid email profile
```

A custom Google user-info check will reject users unless:

- Google reports the email as verified.
- The normalized email has a published `staffAccess` record in the private `staff-auth` dataset.
- The OAuth flow came through the expected Google callback.

Direct Google ID-token sign-in will be disabled so it cannot bypass the private-directory lookup. Middleware will recheck that directory on every protected request.

### 12. Add authentication routes

Add:

- `src/pages/api/auth/[...all].ts`
- `src/pages/login.astro`
- `src/pages/admin/index.astro`
- `src/middleware.ts`
- `src/lib/auth/server.ts`
- `src/lib/auth/client.ts`
- `src/lib/auth/authorization.ts`
- `src/env.d.ts`

`/login`, `/admin`, and the auth API will use `export const prerender = false`. Public pages will remain static.

### 13. Protect the admin area

Unauthenticated users visiting `/admin` will be redirected to `/login`. Authenticated but unapproved users will receive an access-denied response and no admin content. The dashboard will show the staff identity, a sign-out action, links to the public blog, and a link to Sanity Studio.

Auth and admin responses will include:

```text
Cache-Control: private, no-store
X-Robots-Tag: noindex, nofollow
```

GTM and public structured data will be disabled on these pages.

### 14. Keep Studio authorization separate

Better Auth protects the application's `/admin` dashboard. Sanity Studio still requires the user to be a member of the Sanity project because a browser must never receive a shared Sanity write token. A single Google login directly granting Studio editing would require a custom content editor or Sanity enterprise SSO and is outside this implementation.

### 15. Update privacy and documentation

Document Google profile fields, session cookies, retention, sign-out, environment placement, Sanity Studio deployment, webhook configuration, and Cloudflare setup. Update both privacy pages because Google identity data is newly processed.

## Google Setup Required

Create a Google OAuth client of type **Web application** and provide:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SANITY_AUTH_DATASET=staff-auth
SANITY_AUTH_TOKEN=
```

Configure these exact redirect URIs:

```text
http://localhost:4321/api/auth/callback/google
https://falclinic.com/api/auth/callback/google
```

Configure these origins:

```text
http://localhost:4321
https://falclinic.com
```

The Google consent screen needs an app name, support email, and the approved staff accounts as test users while the OAuth app remains in testing mode.

## Environment Placement

- Keep local runtime secrets in `.dev.vars`.
- Keep examples without real values in `.dev.vars.example` and `.env.example`.
- Configure Better Auth and Google credentials as Cloudflare Worker runtime secrets.
- Configure Sanity values in the Cloudflare build environment because static blog pages query Sanity during `astro build`.
- Never prefix API tokens, Google secrets, or authentication secrets with `PUBLIC_`.
- `PUBLIC_SANITY_STUDIO_URL` is safe to expose because it is only a navigation URL.

## Verification

1. Unit-test GROQ result mapping, malformed documents, image projection, future and draft filtering, and missing configuration.
2. Unit-test email normalization, verified-email enforcement, private-directory rejection, and safe return URLs.
3. Run `npm run check`, `npm run test`, `npm run build`, and `npm run seo:verify`.
4. Start development with `astro dev --background`.
5. Confirm the empty Sanity dataset renders the blog empty state.
6. Publish a complete test article through Studio and confirm it renders after rebuilding.
7. Confirm unapproved Google accounts cannot establish authorized access.
8. Confirm an approved account can open `/admin`, sign out, and lose access.
9. Validate the Worker build locally to ensure Web Crypto, cookies, redirects, and dynamic auth routes work on Cloudflare.

## Acceptance Criteria

- `BLOG_PROVIDER=sanity` uses Content Lake and never silently falls back to mock content.
- Missing or malformed Sanity configuration produces a clear error.
- Empty datasets build successfully and display the existing empty state.
- Published Sanity articles generate listing, article, pagination, sitemap, canonical, and Arabic-only locale behavior correctly.
- Sanity images preserve dimensions, alternative text, crop, hotspot, and responsive CDN delivery.
- The Studio can create and publish documents matching the application contract.
- `/admin` and authentication routes are rendered on demand while public pages remain static.
- Only verified, explicitly allowed Google accounts can access `/admin`.
- Authentication and admin responses cannot be publicly cached or indexed.
- No Sanity write token or Google secret is exposed to browser code or committed to Git.
- The full project verification suite passes.

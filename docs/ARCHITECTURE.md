# Fal Medical — System Architecture

Living architecture document. Agents **read this at session start** and **update the Recent changes section at session end** when work affects structure, routes, integrations, or env vars.

See also: [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md), [PRODUCT.md](../PRODUCT.md), [README.md](../README.md).

---

## Overview

Fal Clinic (مجمع عيادات فال الطبية) is a bilingual clinic marketing site built with **Astro 7**, deployed on **Cloudflare Workers**, with optional **Sanity CMS** for blog and staff auth.

| Layer | Technology |
|-------|------------|
| Framework | Astro 7 + React islands |
| Styling | Tailwind CSS 4 |
| Deploy | `@astrojs/cloudflare` + Wrangler |
| Auth | Better Auth + Sanity staff-auth dataset |
| Blog | Sanity CMS |
| Analytics | Google Analytics 4 (gtag.js, `G-28Q8393TES`) |
| Leads | WhatsApp + optional Google Sheets |

---

## Locale & Routing

- **Default locale:** Arabic (`/`)
- **English:** `/en/*` for core clinic routes
- **Blog:** Arabic-only at `/blogs` — no English alternates
- **Trailing slash:** `never` (Astro `trailingSlash: 'never'`)
- **Route pairs:** `src/lib/i18n/routes.ts` drives sitemap, hreflang, and SEO matrix

### Key public routes

| Route (ar) | Route (en) | Notes |
|------------|------------|-------|
| `/` | `/en` | Home |
| `/services`, `/services/[id]` | `/en/services`, `/en/services/[id]` | Service catalog |
| `/doctors`, `/doctors/[id]` | `/en/doctors`, `/en/doctors/[id]` | Doctor directory |
| `/contact` | `/en/contact` | Contact + inquiry |
| `/book` | `/en/book` | Booking form |
| `/blogs`, `/blogs/[slug]` | — | Arabic-only |
| `/admin/*` | — | Staff blog admin |

---

## Request Flow

```
Browser
  → Cloudflare Worker (Astro SSR)
  → middleware.ts
      ├── Legacy/trailing-slash redirects
      ├── Security headers (CSP)
      ├── Staff auth gate (/admin, /api/admin)
      └── Better Auth session check
  → Page (Astro) or API route
```

---

## Module Boundaries

### Site (`fal-site-developer`)

- Pages: `src/pages/*.astro`, `src/pages/en/`
- Components: `src/components/` (except `admin/`)
- Data: `src/data/` (doctors, services, contact, clinic-facts)
- SEO: `src/lib/seo/`, `src/lib/i18n/routes.ts`, `src/lib/schema.ts`

### API (`fal-api-developer`)

- Routes: `src/pages/api/`
  - `/api/auth/*` — Better Auth
  - `/api/admin/users/*` — Staff user management
  - `/api/admin/blog/*` — Blog admin proxy
  - `/api/customers` — Customer leads
  - `/api/blog/revalidate` — Cache revalidation webhook
- Auth: `src/lib/auth/`, `src/lib/staff-access/`
- Middleware: `src/middleware.ts`

### Blog (`fal-blog-developer`)

- Module: `src/modules/blog/`
  - Repository: `sanity-blog-repository.ts` (Sanity is the only provider)
- Admin: `src/pages/admin/`, `src/components/admin/BlogEditorApp.tsx`
- Public: `src/pages/blogs/`

---

## Integrations

| Integration | Config | Used by |
|-------------|--------|---------|
| Sanity (blog) | `SANITY_PROJECT_ID` (`ilyfhm76`), `SANITY_DATASET`, tokens | Blog module |
| Sanity (staff) | `SANITY_AUTH_DATASET`, `SANITY_AUTH_TOKEN` | Staff access |
| Better Auth | Auth secrets in env | Login, sessions |
| Google Sheets | `GOOGLE_*` service account | Bookings, customers |
| GTM / GA4 | `PUBLIC_GTM_ID` (defaults to `G-28Q8393TES`); loads automatically on public pages | Analytics |
| WhatsApp | `PUBLIC_CLINIC_PHONE` | Booking/contact CTAs |

---

## SEO System

- `SEO_INDEXABLE` gates robots and sitemap emission
- `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts`
- Route matrix: `docs/seo-route-matrix.md`
- Post-build checks: `npm run seo:verify`
- Legacy WordPress redirects: `public/_redirects` + `src/lib/seo/legacy-redirects.ts`

---

## Testing

| Layer | Location | Command |
|-------|----------|---------|
| Unit | `src/**/*.test.ts` | `npm run test` |
| E2E | `tests/` | `npm run test:e2e` |
| SEO E2E | `tests/seo/` | `npm run seo:test:e2e` |
| A11y | Playwright + axe | `npm run test:a11y` |
| Perf | Lighthouse CI | `npm run test:perf` |

---

## Deployment

- Build: `npm run build` → `./dist`
- Deploy: `npm run deploy` (Wrangler)
- Config: `wrangler.jsonc`, `astro.config.mjs`
- Production host: `https://falclinic.com`

---

## Launch Constraints (from PRODUCT.md)

- Do not invent testimonials or unverified medical claims
- English blog routes out of scope
- `SEO_INDEXABLE` stays false until licenses, maps, doctors confirmed
- Brand: teal `#12a394`, navy `#10182d` — not Beauty Corner assets

---

## Recent changes

| Date | Change | Paths | Agent |
|------|--------|-------|-------|
| 2026-09-15 | Public `/blogs` reads Fal `production` without `SANITY_API_TOKEN` (admin tokens are separate; a token without production Viewer access 403s the listing) | `src/modules/blog/repository/get-blog-repository.ts`, `src/modules/blog/sanity/client.ts` | blog |
| 2026-09-15 | Sanity project default switched from leftover `nzy22u9z` to Fal project `ilyfhm76` | `astro.config.mjs`, `wrangler.jsonc`, `src/modules/blog/repository/get-blog-repository.ts`, `.env.example`, `docs/sanity-and-staff-auth.md` | blog |
| 2026-09-15 | Fixed blog editor image dialog showing on load; public `/blogs` no longer 503s when Sanity cover alt is missing | `src/components/admin/AdminShell.astro`, `src/components/admin/BlogEditorApp.tsx`, `src/modules/blog/sanity/image.ts`, `src/modules/blog/repository/sanity-blog-repository.ts` | blog |
| 2026-09-15 | Analytics consent banner removed; GTM/GA4 loads automatically on public pages | `src/layouts/Layout.astro`, `src/components/analytics/Gtm.astro`, `src/lib/gtm.ts`, `src/pages/privacy.astro`, `src/pages/en/privacy.astro` | site |
| 2026-09-15 | Removed mock blog provider; public blog and admin editor always use Sanity (`nzy22u9z` / `production`) | `src/modules/blog/repository/`, `src/lib/admin/blog-admin.ts`, `astro.config.mjs` | blog |
| 2026-09-14 | Booking specialties limited to dentistry and dermatology; official TikTok `@falclinichfr`; Fal commercial registration PDF and numbers replace Beauty Corner certificate | `src/data/booking-departments.ts`, `src/data/licenses.ts`, `src/data/contact.ts`, `public/assets/licenses/commercial-registration.pdf`, `src/components/site/SiteFooter.astro` | site |
| 2026-09-08 | Initial architecture doc and agent rules copied from ON-DM fullstack pattern | `.cursor/`, `PROJECT-STRUCTURE.md`, `docs/ARCHITECTURE.md`, `AGENTS.md` | setup |

_Add new rows at the top when sessions change architecture._

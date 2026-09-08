# Fal Medical Project Structure

This document defines the folder structure and ownership for the Fal Clinic website (مجمع عيادات فال الطبية).

---

## Repository Layout

```
fal-medical/
├── src/
│   ├── pages/           ← Site + API routes
│   ├── components/      ← UI components
│   ├── data/            ← Static clinic data
│   ├── layouts/         ← Page layouts
│   ├── lib/             ← Shared utilities
│   ├── modules/blog/    ← Blog module
│   ├── styles/          ← Global CSS
│   └── middleware.ts    ← Auth, redirects, security
├── public/              ← Static assets
├── docs/                ← Architecture and surface docs
├── tests/               ← Playwright E2E
├── scripts/             ← Build and SEO scripts
├── .cursor/             ← Agent rules and subagents
├── PROJECT-STRUCTURE.md
└── docs/ARCHITECTURE.md
```

---

## Site Developer

**Paths:** `src/pages/` (`.astro` only), `src/components/` (except `admin/`), `src/data/`, `src/layouts/`, `src/styles/`, `src/lib/i18n/`, `src/lib/seo/`, `public/`  
**Owner:** Site Developer (`fal-site-developer`)

### Responsibilities

- Public marketing pages (home, services, doctors, contact, book, devices)
- Bilingual routing: Arabic `/`, English `/en`
- Static data: doctors, services, clinic facts, contact
- SEO: route pairs, sitemap, JSON-LD, hreflang
- Booking and contact form UI
- Tailwind styling and landing sections

### Run

```bash
npm install
astro dev --background
```

---

## API Developer

**Paths:** `src/pages/api/`, `src/lib/auth/`, `src/lib/staff-access/`, `src/middleware.ts`, `src/lib/security/`, `src/lib/customer-*.ts`, `src/lib/google-sheets.ts`  
**Owner:** API Developer (`fal-api-developer`)

### Responsibilities

- Better Auth (`/api/auth/*`)
- Admin API (`/api/admin/*`)
- Customer leads API
- Staff authorization (Sanity staff-auth dataset)
- Middleware: admin gates, legacy redirects, CSP headers
- Google Sheets for bookings/customers

---

## Blog Developer

**Paths:** `src/modules/blog/`, `src/components/admin/`, `src/pages/admin/`, `src/pages/blogs/`, `src/pages/api/admin/blog/`, `src/pages/api/blog/`  
**Owner:** Blog Developer (`fal-blog-developer`)

### Responsibilities

- Blog module (mock + Sanity providers)
- Arabic-only blog at `/blogs`
- Lexical admin editor
- Sanity CMS integration
- Blog cache and revalidation

---

## QA Engineer

**Path:** Entire repository  
**Owner:** QA Engineer (`fal-qa-engineer`)

### Responsibilities

- Unit tests, type check, build
- Playwright E2E and SEO tests
- Accessibility and Lighthouse
- Full `npm run verify` pipeline

### Test commands

| Command | Action |
|---------|--------|
| `npm run test` | Unit tests |
| `npm run test:e2e` | Playwright |
| `npm run seo:verify` | Post-build SEO checks |
| `npm run verify` | Full pipeline |

---

## Root Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `astro dev --background` | Dev server (background) |
| `astro dev stop` | Stop background dev server |
| `npm run build` | Production build |
| `npm run deploy` | Build + deploy to Cloudflare Workers |
| `npm run verify` | Check + test + build + SEO + E2E |

---

## Environment Variables

See [`.env.example`](./.env.example) and [`.dev.vars.example`](./.dev.vars.example).

Key groups:

- **SEO:** `SEO_INDEXABLE`, site URL
- **Analytics:** GTM
- **Blog:** `BLOG_PROVIDER`, Sanity tokens
- **Auth:** Better Auth secrets, `SANITY_AUTH_*`
- **Sheets:** Google service account for leads/bookings
- **Clinic:** `PUBLIC_CLINIC_PHONE`, department phones

---

## Path Summary

| Role | Primary Paths |
|------|---------------|
| **Site Developer** | `src/pages/*.astro`, `src/components/`, `src/data/`, `src/lib/i18n/`, `src/lib/seo/` |
| **API Developer** | `src/pages/api/`, `src/lib/auth/`, `src/lib/staff-access/`, `src/middleware.ts` |
| **Blog Developer** | `src/modules/blog/`, `src/pages/blogs/`, `src/pages/admin/`, `src/components/admin/` |
| **QA Engineer** | Full repo |
| **Architect** | Read-only; `docs/ARCHITECTURE.md`, `PRODUCT.md` |

---

## Cursor Agents

Each role has a dedicated subagent. Use `/agent-name` to invoke explicitly.

| Agent | Scope | Invoke |
|-------|-------|--------|
| **fal-site-developer** | Site pages, components, data, SEO | `/fal-site-developer` |
| **fal-api-developer** | API, auth, middleware | `/fal-api-developer` |
| **fal-blog-developer** | Blog module, admin editor | `/fal-blog-developer` |
| **fal-qa-engineer** | Full repo testing | `/fal-qa-engineer` |
| **fal-architect-orchestrator** | Read-only strategy | `/fal-architect-orchestrator` |

**Architecture lifecycle:** All agents read `PROJECT-STRUCTURE.md` and `docs/ARCHITECTURE.md` at session start, and update `docs/ARCHITECTURE.md` at session end when structure or integrations change. See `.cursor/rules/architecture-lifecycle.mdc`.

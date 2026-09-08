# Fal Clinic

Astro website for مجمع عيادات فال الطبية — a Hafar Al Batin medical complex (dentistry, dermatology, aesthetics, nutrition, obstetrics & gynecology, physiotherapy) with bilingual SEO, WhatsApp booking, and Cloudflare deploy.

This repo copies the **structure and SEO system** from Beauty Corner. Visual design, brand, location, and clinic records are Fal’s.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local Astro dev server |
| `npm run build` | Production build to `./dist` |
| `npm run preview` | Preview the Astro build locally |
| `npm run preview:cf` | Preview the Workers build with Wrangler |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run test` | Unit tests (data, SEO, i18n, booking) |
| `npm run seo:verify` | Post-build SEO checks |
| `npm run verify` | Type-check + tests + production build |

## What was reused from Beauty Corner

- Astro 7 + Cloudflare Workers + Tailwind 4
- Arabic default `/`, English `/en`, `trailingSlash: "never"`
- Layout SEO API: canonical, hreflang, robots, Open Graph, JSON-LD
- Route pairs in `src/lib/i18n/routes.ts` driving sitemap + alternates
- `/sitemap.xml` and `/robots.txt` gated by `SEO_INDEXABLE` + `falclinic.com`
- Booking/contact forms → WhatsApp + optional Google Sheets
- Arabic-only blog module (`/blogs`) with mock provider
- Staff `/admin` + Better Auth (optional; needs Fal credentials)

## Fill in before launch

- Official Google Maps pin (`src/data/seo.ts`)
- Commercial registration / Balady numbers (`src/data/licenses.ts`)
- Real doctor names, photos, and hours (`src/data/doctors.ts`, `clinic-facts.ts`)
- Social URLs (`src/data/contact.ts`)
- Photos and `logo.png` / `social-card.png`
- GTM, Sheets, Sanity, and auth secrets in `.dev.vars`

Production host: **https://falclinic.com** (also allows `www.falclinic.com`).

Default phone: `055 703 4280` (`PUBLIC_CLINIC_PHONE`). Override department lines with `PUBLIC_DENTAL_PHONE` / `PUBLIC_DERMATOLOGY_PHONE`.

See [`.env.example`](./.env.example) and [`docs/seo-route-matrix.md`](./docs/seo-route-matrix.md).

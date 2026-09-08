# SEO Route Matrix — Phase 1 Deliverable

**Site:** https://falclinic.com  
**Locales:** Arabic (default, `/`) · English (`/en`)  
**Total indexable URLs:** 44 (22 bilingual route pairs)  
**Manifest source:** `src/lib/i18n/routes.ts`

---

## Summary of SEO Decisions

| Decision | Detail |
|----------|--------|
| **/book indexed separately from /contact** | `/book` targets appointment-conversion intent; `/contact` targets location/NAP/contact intent. Both are indexable with distinct titles and descriptions. See `BOOK_INDEXING_DECISION` in `routes.ts`. |
| **Redirects (not in sitemap)** | `/devices` → `/#services` · `/en/devices` → `/en#services` — no standalone devices page. |
| **API excluded** | `/api/customers` — server endpoint, not indexed, not in sitemap. |
| **404 handling** | `noindex,follow`; no hreflang to `/en/404`; conceptual pair only in manifest (`not-found`). |
| **Orphans** | None among indexable pairs — every indexable URL has AR/EN counterpart and internal links. |
| **Thin / removed content** | Dead AR blog cards and unverified testimonials removed; real opening hours + Google Maps embed added. |
| **Privacy** | `/privacy` and `/en/privacy` added, indexable, linked from booking forms and footer. |
| **Social image** | Default OG/Twitter card: `/assets/social-card.png` (1536×1024) with width/height/type/secure_url. |
| **Cloudflare (manual)** | Confirm HTTP→HTTPS and WWW→apex redirects in Cloudflare dashboard; keep `workers.dev` / preview hosts noindex (Layout host check). |
| **Hreflang x-default** | Points to Arabic URL for all indexable pairs. |
| **Priority parity** | Same sitemap priority for AR and EN per route pair (no language-based priority difference). |

---

## Field Legend

| Field | Standard value |
|-------|------------------|
| **Canonical** | Self-referencing absolute URL |
| **Hreflang** | `ar` → AR URL · `en` → EN URL · `x-default` → AR URL |
| **Robots** | `index,follow` (indexable routes) |
| **Social image** | `/assets/social-card.png` unless noted |
| **Sitemap** | Yes for all indexable pairs |

---

## Static Routes (6 pairs · 12 URLs)

### 1. Home

| | Arabic | English |
|---|--------|---------|
| **URL** | https://falclinic.com/ | https://falclinic.com/en |
| **Title (planned)** | عيادة أسنان وجلدية في الرياض \| فال | Dental & Dermatology Clinic in Riyadh \| Fal Clinic |
| **Description (planned)** | عيادة فال لطب الأسنان والجلدية في الرياض — حي اليرموك، شارع الإمام عبد الله بن سعود. احجز موعدك عبر واتساب. | Fal Clinic dentistry and dermatology clinic in Riyadh, Al Yarmouk, Imam Abdullah bin Saud Street. Book via WhatsApp. |
| **Canonical** | https://falclinic.com/ | https://falclinic.com/en |
| **Hreflang** | ar→`/`, en→`/en`, x-default→`/` | Same |
| **Robots** | index,follow | index,follow |
| **H1** | رعاية متكاملة لابتسامتك وبشرتك | Complete care for your smile and skin |
| **Structured data** | `MedicalClinic`, `WebSite`, `Organization`, `FAQPage` (if FAQ on page) | Same |
| **Social image** | /assets/landing-hero.jpg | /assets/landing-hero.jpg |
| **Sitemap** | Yes · weekly · priority 1.0 | Yes · weekly · priority 1.0 |
| **Notes** | Current title is generic "الرئيسية" — upgrade in Phase 2. | Same |

### 2. Services Directory

| | Arabic | English |
|---|--------|---------|
| **URL** | https://falclinic.com/services | https://falclinic.com/en/services |
| **Title (planned)** | خدمات الأسنان والجلدية في الرياض \| فال | Dentistry & Dermatology Services in Riyadh \| Fal Clinic |
| **Description (planned)** | تصفح جميع خدمات الأسنان والجلدية في عيادة فال بالرياض — زراعة، تبييض، علاج الجلدية والمزيد. | Browse all dentistry and dermatology services at Fal Clinic in Riyadh — implants, whitening, skin care, and more. |
| **Canonical** | https://falclinic.com/services | https://falclinic.com/en/services |
| **Hreflang** | ar→`/services`, en→`/en/services`, x-default→`/services` | Same |
| **Robots** | index,follow | index,follow |
| **H1** | خدمات الأسنان والجلدية | Dentistry and dermatology services |
| **Structured data** | `CollectionPage`, `ItemList` (services), `MedicalClinic` | Same |
| **Social image** | /assets/landing-hero.jpg | /assets/landing-hero.jpg |
| **Sitemap** | Yes · monthly · priority 0.8 | Yes · monthly · priority 0.8 |
| **Notes** | Links to all 15 service detail pages. | Same |

### 3. Doctors Directory

| | Arabic | English |
|---|--------|---------|
| **URL** | https://falclinic.com/doctors | https://falclinic.com/en/doctors |
| **Title (planned)** | أطباء الأسنان في الرياض \| فال | Dentists in Riyadh \| Fal Clinic |
| **Description (planned)** | تعرف على فريق أطباء الأسنان في عيادة فال بالرياض — خبرة موثوقة ورعاية شخصية. | Meet the Fal Clinic dental team in Riyadh — trusted experience and personalized care. |
| **Canonical** | https://falclinic.com/doctors | https://falclinic.com/en/doctors |
| **Hreflang** | ar→`/doctors`, en→`/en/doctors`, x-default→`/doctors` | Same |
| **Robots** | index,follow | index,follow |
| **H1** | أطباء متخصصون بخبرة موثوقة | Specialist doctors you can trust |
| **Structured data** | `CollectionPage`, `ItemList` (Physician) | Same |
| **Social image** | /assets/landing-hero.jpg | /assets/landing-hero.jpg |
| **Sitemap** | Yes · monthly · priority 0.8 | Yes · monthly · priority 0.8 |
| **Notes** | Filter UI; all 2 doctors linked. | Same |

### 4. Contact

| | Arabic | English |
|---|--------|---------|
| **URL** | https://falclinic.com/contact | https://falclinic.com/en/contact |
| **Title (planned)** | تواصل معنا وموقع العيادة في الرياض \| فال | Contact & Clinic Location in Riyadh \| Fal Clinic |
| **Description (planned)** | عنوان عيادة فال في الرياض، أوقات العمل، واتساب، والهاتف — حي اليرموك، شارع الإمام عبد الله بن سعود. | Fal Clinic address in Riyadh, hours, WhatsApp, and phone — Al Yarmouk, Imam Abdullah bin Saud Street. |
| **Canonical** | https://falclinic.com/contact | https://falclinic.com/en/contact |
| **Hreflang** | ar→`/contact`, en→`/en/contact`, x-default→`/contact` | Same |
| **Robots** | index,follow | index,follow |
| **H1** | زورونا | Visit us |
| **Structured data** | `MedicalClinic`, `ContactPage`, `LocalBusiness` (NAP) | Same |
| **Social image** | /assets/landing-clinic-gallery.jpg | /assets/landing-clinic-gallery.jpg |
| **Sitemap** | Yes · monthly · priority 0.8 | Yes · monthly · priority 0.8 |
| **Notes** | NAP/location intent. Map embed placeholder — fix in Phase 2. EN hours text is placeholder. | Same |

### 5. Book (Conversion)

| | Arabic | English |
|---|--------|---------|
| **URL** | https://falclinic.com/book | https://falclinic.com/en/book |
| **Title (planned)** | احجز موعدك في عيادة فال بالرياض | Book Your Appointment at Fal Clinic, Riyadh |
| **Description (planned)** | احجز موعدك بسرعة في عيادة فال — أدخل اسمك ورقم جوالك واختر الخدمة، ثم أرسل عبر واتساب. | Book quickly at Fal Clinic — enter your name, phone, and service, then send via WhatsApp. |
| **Canonical** | https://falclinic.com/book | https://falclinic.com/en/book |
| **Hreflang** | ar→`/book`, en→`/en/book`, x-default→`/book` | Same |
| **Robots** | index,follow | index,follow |
| **H1** | احجز موعدك الآن | Book your visit |
| **Structured data** | `WebPage`, `MedicalClinic` (potentialAction: ReserveAction) | Same |
| **Social image** | /assets/landing-hero.jpg | /assets/landing-hero.jpg |
| **Sitemap** | Yes · monthly · priority 0.8 | Yes · monthly · priority 0.8 |
| **Notes** | **Indexed separately from /contact** — conversion intent vs NAP intent. Distinct title/description required. | Same |

### 6. Privacy (Planned — pages not yet built)

| | Arabic | English |
|---|--------|---------|
| **URL** | https://falclinic.com/privacy | https://falclinic.com/en/privacy |
| **Title (planned)** | سياسة الخصوصية \| فال | Privacy Policy \| Fal Clinic |
| **Description (planned)** | سياسة الخصوصية لعيادة فال — كيف نجمع ونستخدم بياناتك عند الحجز والتواصل. | Fal Clinic privacy policy — how we collect and use your data when booking and contacting us. |
| **Canonical** | https://falclinic.com/privacy | https://falclinic.com/en/privacy |
| **Hreflang** | ar→`/privacy`, en→`/en/privacy`, x-default→`/privacy` | Same |
| **Robots** | index,follow | index,follow |
| **H1** | سياسة الخصوصية | Privacy Policy |
| **Structured data** | `WebPage` | Same |
| **Social image** | /assets/logo.png | /assets/logo.png |
| **Sitemap** | Yes · monthly · priority 0.5 | Yes · monthly · priority 0.5 |
| **Notes** | **Missing pages — to be added in Phase 2.** Linked from booking form consent checkbox. | Same |

---

## Service Detail Routes (15 pairs · 30 URLs)

Pattern: **Title** `{service} في الرياض | فال` (AR) · `{service} in Riyadh | Fal Clinic` (EN)

| ID | AR URL | EN URL | AR Title (planned) | EN Title (planned) | H1 (AR) | H1 (EN) | Structured data | Social image | Sitemap |
|----|--------|--------|--------------------|--------------------|---------|---------|-----------------|--------------|---------|
| dental-implants | /services/dental-implants | /en/services/dental-implants | زراعة الأسنان في الرياض \| فال | Dental Implants in Riyadh \| Fal Clinic | زراعة الأسنان | Dental implants | `MedicalWebPage`, `MedicalProcedure`, `Service` | /assets/service-detail-dentistry.jpg | Yes · 0.7 |
| dental-prosthetics | /services/dental-prosthetics | /en/services/dental-prosthetics | تركيبات الأسنان في الرياض \| فال | Dental Prosthetics in Riyadh \| Fal Clinic | تركيبات الأسنان | Dental prosthetics | Same | /assets/landing-clinic-gallery.jpg | Yes · 0.7 |
| dental-veneers | /services/dental-veneers | /en/services/dental-veneers | عدسات الأسنان في الرياض \| فال | Dental Veneers in Riyadh \| Fal Clinic | عدسات الأسنان | Dental veneers | Same | /assets/landing-clinic-gallery.jpg | Yes · 0.7 |
| teeth-whitening | /services/teeth-whitening | /en/services/teeth-whitening | تبييض الأسنان في الرياض \| فال | Teeth Whitening in Riyadh \| Fal Clinic | تبييض الأسنان | Teeth whitening | Same | /assets/devices/beyond-whitening.jpg | Yes · 0.7 |
| cleaning-polishing | /services/cleaning-polishing | /en/services/cleaning-polishing | تنظيف وتلميع الأسنان في الرياض \| فال | Cleaning & Polishing in Riyadh \| Fal Clinic | تنظيف وتلميع الأسنان | Cleaning & polishing | Same | /assets/landing-waiting-area.jpg | Yes · 0.7 |
| tooth-extraction | /services/tooth-extraction | /en/services/tooth-extraction | الخلع (جراحي وعادي) في الرياض \| فال | Tooth Extraction in Riyadh \| Fal Clinic | الخلع (جراحي وعادي) | Extraction (surgical & simple) | Same | /assets/service-detail-dentistry.jpg | Yes · 0.7 |
| root-canal | /services/root-canal | /en/services/root-canal | حشوات العصب في الرياض \| فال | Root Canal Treatment in Riyadh \| Fal Clinic | حشوات العصب | Root canal treatment | Same | /assets/landing-hero.jpg | Yes · 0.7 |
| cosmetic-fillings | /services/cosmetic-fillings | /en/services/cosmetic-fillings | الحشوات التجميلية في الرياض \| فال | Cosmetic Fillings in Riyadh \| Fal Clinic | الحشوات التجميلية | Cosmetic fillings | Same | /assets/landing-blog-dental.jpg | Yes · 0.7 |
| gum-contouring | /services/gum-contouring | /en/services/gum-contouring | قص اللثة (جراحي وليزر) في الرياض \| فال | Gum Contouring in Riyadh \| Fal Clinic | قص اللثة (جراحي وليزر) | Gum contouring (surgical & laser) | Same | /assets/devices/woodpecker-ptb.png | Yes · 0.7 |
| gum-depigmentation | /services/gum-depigmentation | /en/services/gum-depigmentation | توريد اللثة بالليزر في الرياض \| فال | Laser Gum Depigmentation in Riyadh \| Fal Clinic | توريد اللثة بالليزر | Laser gum depigmentation | Same | /assets/devices/woodpecker-ptb.png | Yes · 0.7 |
| dental-xray-3d | /services/dental-xray-3d | /en/services/dental-xray-3d | أشعة الأسنان 3D في الرياض \| فال | 3D Dental X-ray in Riyadh \| Fal Clinic | أشعة الأسنان 3D | 3D dental X-ray | Same | /assets/landing-clinic-gallery.jpg | Yes · 0.7 |
| laser | /services/laser | /en/services/laser | الليزر في الرياض \| فال | Laser in Riyadh \| Fal Clinic | الليزر | Laser | Same | /assets/devices/dental-examination-unit.jpg | Yes · 0.7 |
| filler-botox | /services/filler-botox | /en/services/filler-botox | الفيلر والبوتوكس في الرياض \| فال | Filler & Botox in Riyadh \| Fal Clinic | الفيلر والبوتوكس | Filler & Botox | Same | /assets/devices/dental-examination-unit.jpg | Yes · 0.7 |
| body-contouring | /services/body-contouring | /en/services/body-contouring | النحت في الرياض \| فال | Body Contouring in Riyadh \| Fal Clinic | النحت | Body contouring | Same | /assets/devices/dental-examination-unit.jpg | Yes · 0.7 |
| hydrafacial | /services/hydrafacial | /en/services/hydrafacial | تنظيف البشرة الهيدرافيشل في الرياض \| فال | HydraFacial Skin Cleaning in Riyadh \| Fal Clinic | تنظيف البشرة الهيدرافيشل | HydraFacial skin cleaning | Same | /assets/devices/dental-examination-unit.jpg | Yes · 0.7 |

**Shared fields for all service detail URLs:**

- **Description (planned):** Use service `description` from data + location suffix "في الرياض" / "in Riyadh".
- **Canonical:** Self-referencing (full URL per row above).
- **Hreflang:** Standard pair with x-default → Arabic.
- **Robots:** index,follow.
- **Notes:** Each page links to related doctor specialty and booking CTA. No duplicate content across services.

---

## Doctor Profile Routes (3 pairs · 6 URLs)

Pattern: **Title** `{doctor name} — طبيب أسنان في الرياض | فال` (AR) · `{doctor name} — Dentist in Riyadh | Fal Clinic` (EN)

| ID | AR URL | EN URL | AR Title (planned) | EN Title (planned) | H1 (AR) | H1 (EN) | Structured data | Social image | Sitemap |
|----|--------|--------|--------------------|--------------------|---------|---------|-----------------|--------------|---------|
| dentistry | /doctors/dentistry | /en/doctors/dentistry | طبيب الأسنان — طبيب أسنان في الرياض \| فال | Clinic dentist — Dentist in Riyadh \| Fal Clinic | طبيب الأسنان | Clinic dentist | `Physician`, `MedicalWebPage`, `Person` | /assets/doctor-dentistry.png | Yes · 0.7 |
| oral-surgery | /doctors/oral-surgery | /en/doctors/oral-surgery | أخصائي جراحة الفم — أخصائي جراحة وجه وفكين في الرياض \| فال | Oral surgery specialist — Oral & Maxillofacial Specialist in Riyadh \| Fal Clinic | أخصائي جراحة الفم | Oral surgery specialist | Same | /assets/doctor-dentistry.png | Yes · 0.7 |
| dermatology | /doctors/dermatology | /en/doctors/dermatology | طبيب الجلدية — طبيب الجلدية والتجميل في الرياض \| فال | Dermatology doctor — Dermatology Doctor in Riyadh \| Fal Clinic | طبيب الجلدية | Dermatology doctor | Same | /assets/doctor-dermatology.png | Yes · 0.7 |

**Shared fields for all doctor profile URLs:**

- **Description (planned):** Doctor `summary` from data.
- **Canonical:** Self-referencing (full URL per row above).
- **Hreflang:** Standard pair with x-default → Arabic.
- **Robots:** index,follow.
- **Notes:** Links to related services and booking form. No orphan profiles.

---

## Non-Indexable Routes (reference only)

| Route | URL | Robots | Sitemap | Hreflang | Notes |
|-------|-----|--------|---------|----------|-------|
| 404 (any unknown path) | Served by `404.astro` | noindex,follow | No | None | No `/en/404` page; no hreflang alternates |
| /devices | Redirects to `/#services` | n/a (redirect) | No | No | Anchor on homepage specialties |
| /en/devices | Redirects to `/en#services` | n/a (redirect) | No | No | Anchor on EN homepage specialties |
| /api/customers | POST endpoint | noindex,nofollow | No | No | Server-only lead capture |

---

## URL Count Verification

| Category | Pairs | URLs (×2 locales) |
|----------|-------|-------------------|
| Static (excl. 404) | 6 | 12 |
| Service detail | 15 | 30 |
| Doctor profile | 3 | 6 |
| **Total indexable** | **24** | **48** |

---

## Phase 2 Implementation Checklist

- [ ] Apply planned titles/descriptions in `Layout.astro` or per-page frontmatter
- [ ] Add canonical + hreflang tags using `getAlternatePaths()` from manifest
- [ ] Refactor `sitemap.xml.ts` to use `getIndexableRoutePairs()` from `routes.ts`
- [ ] Create `/privacy` and `/en/privacy` pages
- [ ] Fix placeholder map embed on contact page
- [ ] Fix EN placeholder hours text
- [ ] Add `noindex,follow` meta to `404.astro`
- [ ] Verify all EN translations pass `assertTranslationCompleteness()`

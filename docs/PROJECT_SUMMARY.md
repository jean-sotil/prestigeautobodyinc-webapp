# Prestige Auto Body — Project Summary

**Repo:** `prestigeautobodyinc-webapp` · **Started:** 2026-04-03 · **Latest:** 2026-05-07 · **Commits:** 200

A bilingual (EN/ES) marketing + lead-generation site for Prestige Auto Body, Inc. (Silver Spring, MD). Built on Next.js 16 with Payload CMS for content, GA4 for analytics, and an n8n pipeline for blog content automation. Ships fully WCAG 2.1 AA compliant.

---

## Stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript 5
- **Styling:** Tailwind CSS v4 + CSS variable tokens (light/dark)
- **CMS:** Payload CMS 3.0 (blog posts, media, hero variants)
- **i18n:** `next-intl` with `localePrefix: 'always'`; locales `en`/`es`; per-post localized slugs
- **Data:** TanStack Query for client-side fetches; Payload Local API for build-time
- **Forms:** Multi-step QuoteForm (6 steps) with `useReducer`, multipart upload to `/api/quote`, Resend email out
- **Analytics:** GA4 + 5-event quote-form funnel + consent banner + Web Vitals stream
- **Automation:** n8n → Next.js API → Payload CMS draft for blog content
- **Package manager:** Bun (migrated from npm 2026-04-10)
- **Quality gates:** `tsc --noEmit`, ESLint flat config, `eslint-plugin-jsx-a11y`, axe-core (Playwright), token-level WCAG contrast checker

---

## Major capabilities (what's live)

### Marketing site

- **Home** — hero carousel (7 responsive variants), services grid, why-choose section, 24/7 towing block, warranty section, live Google Reviews carousel via Places API, stats counters, I-CAR Gold Class watermark.
- **Service pages** — 6 service routes via `ServicePageTemplate` with full EN/ES content.
- **About / Contact / Locations / Certifications / Our Team / Gallery** — all bilingual.
- **Blog** — Payload-backed, JSON-LD `Article` schema, related posts, featured card, OG image, sitemap entries.
- **Legal** — privacy policy + terms of service, locale-aware.
- **404** — localized catch-all not-found page.
- **Persistent sticky nav** — utility bar + header travel as one block; compact "alive" state on scroll; backdrop-blur, accent-line lift, logo step-down.

### Quote-to-lead funnel

- `/get-a-quote` dedicated page (also embeddable as sidebar layout).
- 6-step form: Service → Vehicle → Damage → Contact → Schedule → Confirmation.
- Inline photo upload (drag-drop) → Payload media collection.
- Optional VIN field with helper UX.
- Shake-on-error feedback per step.
- Server route at `/api/quote` handles multipart, validates, fires GA4 events, sends notification emails via Resend.
- Rate limiter (fails open if it errors — never blocks a customer lead).

### SEO

- `metadataBase` + canonical + OG/Twitter images per page.
- Hreflang for `/en` ↔ `/es` (with `x-default`).
- JSON-LD: `LocalBusinessJsonLd` (`AutoBodyShop` + `aggregateRating` + `openingHoursSpecification` + geo + sameAs), `Article`, `WebSite`.
- `sitemap.xml` and `robots.txt` generation; non-production deployments noindexed.
- E.164 country codes on all `tel:` links.
- NAP (name/address/phone) centralized in `lib/business.ts`.

### Accessibility — WCAG 2.1 AA ✅

Shipped 2026-04-28 (PR #7). **0 critical / 0 serious / 0 moderate / 0 minor** axe violations across 34 URLs (17 routes × 2 locales). Token-level contrast checker passes both themes. See [`accessibility/wcag-aa.md`](./accessibility/wcag-aa.md) for the full spec, plan, audit results, and reproduction steps.

### Performance

- Image pipeline via `next/image` with capped `deviceSizes` and per-context `sizes`.
- Hero LCP tuned: `quality=75`, sizes set per breakpoint.
- Google Reviews carousel streamed via `<Suspense>`.
- Dynamic imports for QuoteForm, YouTube/Maps embeds.
- Targeting evergreen browsers (browserslist).
- Reviewer avatars + warranty-section steel texture lazy-loaded.

### Content + automation

- n8n blog pipeline: scheduled trigger → AI agent (system prompt in [`automation/n8n/prompt-blog.md`](./automation/n8n/prompt-blog.md)) → POST `/api/blog/import` → Payload draft → manual review.
- Schema doc + AI prompt are 1:1 aligned with `src/payload/collections/BlogPosts.ts`.
- See [`automation/n8n/README.md`](./automation/n8n/README.md) for the pipeline overview.

---

## Timeline (high-level)

| Period              | What landed                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Apr 03–04, 2026** | Project scaffolding: Next.js 15, i18n routing (EN/ES), atomic UI (Button/Icon/Badge/Typography), header + footer, hero carousel, 6-step QuoteForm orchestrator.                                                                                  |
| **Apr 09–10**       | Image-optimization pipeline, responsive hero images, Header/Footer redesigns, design tokens migration, `ServicePageTemplate`, switched npm → Bun.                                                                                                |
| **Apr 11–13**       | Home/About full i18n rewrites, live Google Reviews via Places API, `/get-a-quote` page, contact page SEO.                                                                                                                                        |
| **Apr 15**          | Next.js 16 upgrade. **Payload CMS 3.0 installed.** Quote-form API with multipart uploads + Resend emails.                                                                                                                                        |
| **Apr 18–19**       | n8n blog automation pipeline, hero banners wired to Payload media (with static fallback), Slice B design upgrade (tokens, ServiceCard, SectionHeading).                                                                                          |
| **Apr 20**          | Full blog frontend with JSON-LD `Article`. Site-wide structured data (LocalBusiness, WebSite). TanStack Query data layer.                                                                                                                        |
| **Apr 22–23**       | Quote-form revamp (shake-on-error, VIN field), Footer social links, design upgrades v2 doc.                                                                                                                                                      |
| **Apr 24–25**       | Blog audit phases A/B: locale-switcher 404, hreflang, JSON-LD, masthead, related posts, featured card, sitemap. Payload bulk-edit + breadcrumb fixes.                                                                                            |
| **Apr 27**          | SEO metadata + hreflang + sitemap (PR #4). Open Graph image. WCAG 2.1 AA tooling scaffolded.                                                                                                                                                     |
| **Apr 28**          | **WCAG 2.1 AA shipped (PR #7)** — 0 axe violations across 34 URLs. **GA4 + consent banner + Web Vitals.** WhatsApp widget. Google Reviews carousel replaces static testimonials.                                                                 |
| **Apr 29**          | Gallery (shop tour), header redesign with flag language toggle + services menu icons, contact page redesign with hours/map/quick actions, 404 page.                                                                                              |
| **Apr 30**          | Image preview in quote requests. Locale prop-drilling refactor. Quote-API rate limiter fails open.                                                                                                                                               |
| **May 01**          | **Audit remediation: 17 commits.** All 3 critical + 7 high + 7/8 medium + 5/5 low fixes from third-party audit PDF. Plus persistent-sticky-nav UX upgrade. See [`archive/2026-04-audit/remediation.md`](./archive/2026-04-audit/remediation.md). |
| **May 02–04**       | I-CAR Gold Class watermark across all hero variants. Content updates (experience claim 20 → 30 → 40 years, then back to 30). Language switcher cursor fix.                                                                                       |
| **May 06**          | Sitemap link uses plain anchor; WhatsApp widget z-index lifted above footer.                                                                                                                                                                     |
| **May 07**          | **`docs/` reorganization** by topic + lifecycle. Active maintenance burden cut from 11 files → 6. Generated audit JSONs gitignored. Completed work archived.                                                                                     |

---

## Notable decisions (non-obvious context)

- **Sticky-nav stack** — UtilityBar + header are wrapped in a single `sticky top-0 z-50` container so they travel together; `data-scrolled` on the wrapper drives the compact "alive" treatment on both.
- **Slug localization** — `BlogPosts.ts` stores per-locale slugs; the locale switcher resolves the sibling locale's slug on blog detail pages (no 404 on language toggle).
- **`tel:` E.164** — centralized `SHOP_PHONE_TEL` / `SHOP_PHONE_DISPLAY` in `lib/business.ts`; the audit PDF flagged international/roaming failures from missing country codes.
- **Quote-API rate limiter fails open** — losing a customer lead because of a transient rate-limit error is worse than a brief abuse window.
- **NAP discipline** — single source of truth in `lib/business.ts` feeds the LocalBusiness JSON-LD that Google reads, so footer email + Privacy/Terms boilerplate had to be reconciled.
- **No PPR yet** — Next 16's `cacheComponents` track has moved beyond Next 14's `experimental_ppr`; the streaming win was captured via `<Suspense>` on the home page reviews block instead.
- **Reduced motion is global** — `globals.css:176-185` kill-switch plus per-keyframe overrides; no allowlist needed because no motion is load-bearing.

---

## Where things live

| Looking for…                                         | Path                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Design system spec (tokens, components, breakpoints) | [`design/DESIGN.md`](./design/DESIGN.md)                                                                 |
| WCAG 2.1 AA spec + plan + audit results              | [`accessibility/wcag-aa.md`](./accessibility/wcag-aa.md)                                                 |
| Generated audit reports (regenerate locally)         | [`accessibility/reports/`](./accessibility/reports/)                                                     |
| n8n blog automation pipeline                         | [`automation/n8n/`](./automation/n8n/)                                                                   |
| Active in-flight work (RFC-Lite plans)               | [`plans/`](./plans/)                                                                                     |
| Audit PDF + audit-branch remediation summary         | [`archive/2026-04-audit/`](./archive/2026-04-audit/)                                                     |
| Slice B design upgrade history                       | [`archive/2026-04-audit/design-upgrades-slice-b.md`](./archive/2026-04-audit/design-upgrades-slice-b.md) |
| GA4 rollout plan (shipped)                           | [`archive/2026-04-audit/analytics-ga4-plan.md`](./archive/2026-04-audit/analytics-ga4-plan.md)           |
| Day-by-day record of every change                    | `git log` (200 commits, kept clean)                                                                      |

---

## Active work / in-flight

- [`plans/blog-ux.md`](./plans/blog-ux.md) — 22-issue blog UX + SEO + i18n audit. Status of fixes per item not yet recorded; needs a sweep to mark what shipped vs. what's still open.

Everything else is shipped or archived.

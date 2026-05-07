# Prestige Auto Body — Audit Remediation Summary

**Source:** [`Prestige-Auto-Body-Audit.pdf`](./Prestige-Auto-Body-Audit.pdf)
**Branch:** `main`
**Commits landed:** 17 (all on top of `099e5be`)
**Verification:** `tsc --noEmit` clean · `eslint` clean

---

## Scoreboard

| Severity | Issues | Status                                             |
| -------- | ------ | -------------------------------------------------- |
| Critical | 3      | ✅ all fixed                                       |
| High     | 7      | ✅ all fixed                                       |
| Medium   | 8      | ✅ 7 fixed · 1 deferred (P-04 sprite — asset prep) |
| Low      | 5      | ✅ verified or addressed                           |

Plus 3 god-mode wins (NAP email, LanguageSwitcher SR clarity, rating-star followup) and one navigation UX upgrade requested mid-session.

---

## Critical issues

### C-01 — Conflicting business hours between header and footer

**Commit:** `6393480` — `fix(i18n): correct header business hours to match footer`

Header utility-bar said `Mon-Fri 8:00 AM - 5:00 PM` while the footer and `lib/business.ts` said 6 PM. NAP-consistency red flag for Google Business Profile.

- `messages/en.json` and `messages/es.json` aligned to canonical hours
- Added `header.hoursShort` for tighter mobile widths

### C-02 — Topbar text duplicated → screen readers read it twice

**Commit:** `766bc96` — `fix(a11y/header): de-duplicate utility-bar hours string`

A hidden/visible `Caption` pair both rendered `t('hours')` — the same string appeared twice in static HTML.

- Renders the canonical string once on xl
- Visual `hoursShort` + `sr-only` canonical pair on lg
- Also truncates address/hours so they don't push the language switcher off the row

### C-03 — "Find Us" map block renders empty in static HTML

**Commit:** `49a4c79` — `fix(seo): server-render the footer + map iframe`

Footer was marked `'use client'` for no behavioral reason — the Google Maps iframe was never present in static HTML.

- Switched `Footer.tsx` to a server component using `getTranslations()`
- Existing `h-40` box keeps layout stable (no CLS)
- Iframe now in initial SSR HTML for crawlers and no-JS users

---

## SEO

### S-01 — AggregateRating / LocalBusiness JSON-LD

**Status:** Already implemented

Home page emits `<LocalBusinessJsonLd>` with full `AutoBodyShop` schema, `aggregateRating`, `openingHoursSpecification`, address, geo, and same-as.

### S-02 — Hreflang for `/en` ↔ `/es`

**Status:** Already implemented

`generateMetadata` declares `alternates.canonical` and `alternates.languages` (en, es, x-default).

### S-03 — Title tag duplicates the brand name

**Commit:** `6888dcd` — `fix(seo): trim brand from home title to remove duplication`

Root layout already sets `title.template = '%s | Prestige Auto Body'`, so a page title of "Prestige Auto Body Inc. - …" rendered as "Prestige Auto Body Inc. - … | Prestige Auto Body".

- Page title now leads with service + city ("Auto Body Repair & Collision Shop in Silver Spring, MD")
- Spanish equivalent updated

### S-04 — `tel:` link missing country code

**Commit:** `ec5b975` — `fix(tel): use E.164 country code on all tel: links`

Header, MobileNav, home, blog, blog/[slug], and get-a-quote all linked via `tel:3015788779`, which fails for international/roaming callers.

- Centralized as `SHOP_PHONE_TEL`/`SHOP_PHONE_DISPLAY` in `lib/business.ts`
- Threaded through every callsite
- Footer was already correct

### S-05 — Footer copyright is a static string

**Status:** Already implemented

Footer uses `t('copyright', { year: currentYear })` with `new Date().getFullYear()`.

---

## Accessibility (WCAG 2.1 AA)

### A-01 — Decorative star glyphs read aloud verbatim

**Commits:** `322aae2` + `1933910` (followup)

- StatsCounters: `★★★★★` row marked `aria-hidden`
- StatsCounters rating value: `4.7★` split into `4.7` + aria-hidden `★`, with `aria-label="4.7 out of 5"` on the wrapping div
- `reviews.ratingShort` (en/es): inline `★` removed from translation strings — contact page already renders a standalone aria-hidden gold ★

### A-02 — Language switcher rendered as concatenated text "ENES"

**Commit:** `d94690f` — `a11y: clearer LanguageSwitcher SR semantics`

Already mitigated by `aria-label`, but two follow-ups make it crisper:

- `aria-label` leads with current state: "Current language: English. Switch to spanish."
- Inner EN/ES pills get `aria-hidden="true"` so SRs don't double-announce
- `data-active` on each pill lets future styling evolve toward semantic hooks

### A-03 — Repeated "Read full review on Google" links lack unique context

**Commit:** `322aae2` — `a11y: hide decorative glyphs and disambiguate review links`

Each Read-full-review anchor now carries a unique `aria-label` suffixed with the reviewer name — fixes "five links with the same name" (WCAG 2.4.4).

### A-04 — "Learn More→" arrow is read as "right arrow"

**Commit:** `322aae2`

Trailing `→` on the View-all-reviews link is wrapped in an `aria-hidden` span so it isn't read as "right arrow". Existing `aria-hidden` arrows on ServiceCard and blog pager were already correct.

### A-05 — "Services" top-nav item

**Status:** Already implemented

`ServicesMenu` uses `<NavigationMenuTrigger>` (Radix-based), which renders as a keyboard-accessible button with proper ARIA.

### A-06 — Skip-link visible on focus

**Status:** Already implemented

Header skip link uses `focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60]`.

---

## Performance & Core Web Vitals

### P-01 — Hero image served at `w=3840 q=90` to all viewports

**Commit:** `7b7d265` — `perf(images): tighten hero LCP sizes/quality and cap deviceSizes`

- Hero `<Image>` switched from `sizes="100vw"` → `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1600px"`
- `quality={90}` → `quality={75}`
- `next.config.ts` `deviceSizes` capped at `[640, 750, 828, 1080, 1200, 1600, 1920]`

### P-02 — `fetchPriority="high"` / preload on hero

**Status:** Already implemented (verified)

`priority` and `fetchPriority="high"` were already wired on the hero. Sizes/quality fixes from P-01 amplify the LCP win.

### P-03 — Logo PNG requested at `w=640`

**Commit:** `5e393f2` — `perf(images): tighten logo sizes and lazy-load review avatars`

Header logo now ships `sizes="220px"` so the responsive variant matches the rendered width.

### P-04 — Three trust badges = three image requests

**Commit:** `6453ac2` — `fix(home): wrap warranty badges and tighten image sizes` _(partial)_

- Wraps badges with `flex-wrap` + `justify-center` (also fixes R-03)
- Tightens `sizes` on each Next/Image
- Fixes a class-concatenation typo: `md:h-40drop-shadow-…` was nullifying the md height entirely

**Deferred:** SVG sprite consolidation. Needs source-asset rework (vector copies of the I-CAR Gold Class, Lifetime Guarantee, and SAINT PCI marks). Engineering work is done; the network win is marginal vs. risk of brand-mark distortion.

### P-05 — Partial Prerendering for the home page

**Commit:** `59c8ec6` — `perf(home): stream Google reviews via Suspense boundary`

Did **not** enable `experimental_ppr` — Next 16's `cacheComponents` track has moved beyond the Next 14 PPR API. Captured the bulk of the win via Suspense streaming instead:

- `GoogleReviewsCarousel` wrapped in `<Suspense>` with a sized skeleton fallback
- Rest of the home page (hero, services, why-choose, warranty, CTA) streams while the Places API call is still in flight

### P-06 — `loading="lazy"` on below-the-fold imagery

**Commit:** `5e393f2`

Reviewer avatars in the Google Reviews carousel got explicit `loading="lazy"`. Steel-texture background and warranty badges were already lazy by default (no `priority`).

---

## Responsiveness

### R-01 — Topbar overflows under 480px

**Commit:** `766bc96` _(rolled into C-02)_

Topbar refactor truncates address/hours and doesn't push the language switcher off-row.

### R-02 — Stats grid (4 columns) cramps below 480px

**Status:** Already implemented

`StatsCounters` already uses `grid-cols-2 lg:grid-cols-4` — 2 columns below 1024px, more conservative than the audit's recommended 480px breakpoint.

### R-03 — Trust-badges row breaks unevenly

**Commit:** `6453ac2` — `fix(home): wrap warranty badges and tighten image sizes`

Three certification badges flexed in a single row left an orphan on a second line. Now uses `flex-wrap` + `justify-center` for a tidy wrap.

### R-04 — Hero CTAs stack without bottom-spacing

**Status:** Not applicable

The hero now has only one button (`Get a Quote`) with the gallery rendered as a separate inline link below. No stacked-button collision possible.

### R-05 — Service cards arrow alignment

**Status:** Already implemented

`ServiceCard.tsx` uses `inline-flex items-center gap-1.5` with an `aria-hidden` arrow span.

### R-06 — Testimonials horizontal scroll affords poorly

**Status:** Already implemented

`GoogleReviewsCarousel` uses `snap-x snap-mandatory scroll-smooth` plus prev/next `<CarouselControls />`.

---

## God-mode improvements (audit-adjacent)

### NAP email consistency

**Commit:** `768bb5f` — `fix(nap): correct email domain to prestigeautobodyinc.com`

`lib/business.ts` (which feeds the LocalBusiness JSON-LD that Google reads) and the Privacy / Terms boilerplate referenced `info@prestigeautobody.com`, while the public Footer mailto and `footer.company.email` used `info@prestigeautobodyinc.com`. Mismatched contact info hurts Local SEO.

`api/quote/route.ts` kept its `quotes@prestigeautobody.com` default — that's the Resend-verified FROM domain for outbound mail (env-overridable).

### Rating-star SR followup

**Commit:** `1933910` — `a11y: hide remaining rating-value stars from screen readers`

Caught two leak points the original A-01 commit missed (StatsCounters value, `reviews.ratingShort` template). See A-01 entry above.

---

## Navigation UX upgrade

User-requested mid-session — make the utility bar and header **persistent**, **alive on scroll**, and **compact**.

### `8b51243` — persistent sticky nav with compact alive scroll state

- UtilityBar visible on every viewport: `h-9` mobile, `h-10` lg+; mobile shows clock + short hours + language switcher; md+ adds address; xl+ adds full hours
- Header truly sticky with explicit `top-9 lg:top-10` (was sticky-without-offset = effectively static)
- Scroll-aware via `data-scrolled`: `h-16 → h-14`, deeper backdrop-blur, red-tinted shadow lift, accent line bumps `2px / 0.85` → `3px / 1.0`
- Logo height steps down one notch on scroll
- All transitions 300ms ease-out, `motion-reduce` guarded

### `a25f98a` — inner header content follows the compact scroll state

- "Call for a Free Quote" caption collapses via `max-height` on scroll (xl+ only)
- "Get a Quote" pill scales 95% with softer shadow on scroll
- Breadcrumb strip tightens vertical padding (kept visible — wayfinding matters)

### `c256a23` — glue UtilityBar + header into one sticky stack

- Wrapped both in a single `sticky top-0 z-50` container — they travel as one block (the standard "header stack" pattern per UI/UX Pro Max `persistent-nav` + `fixed-element-offset`)
- `data-scrolled` moved to the wrapper so the alive treatment covers utility bar + header together
- `globals.css` selector for `.header-edge-accent::after` switched to `[data-scrolled='true'] .header-edge-accent::after` to match the new ancestor scope

---

## Verification

| Check           | Result                                                                      |
| --------------- | --------------------------------------------------------------------------- |
| `tsc --noEmit`  | ✅ clean                                                                    |
| `bun run lint`  | ✅ clean                                                                    |
| `bun run build` | ⚠️ blocked by pre-existing root-owned `.next/` dir; unrelated to audit work |

To unblock the build: `sudo rm -rf .next && bun run build`

---

## Commit log

```
1933910 a11y: hide remaining rating-value stars from screen readers (A-01 followup)
d94690f a11y: clearer LanguageSwitcher SR semantics (A-02 polish)
768bb5f fix(nap): correct email domain to prestigeautobodyinc.com
c256a23 ux(nav): glue UtilityBar + header into one sticky stack
a25f98a ux(nav): inner header content follows the compact scroll state
8b51243 ux(nav): persistent sticky nav with compact 'alive' scroll state
59c8ec6 perf(home): stream Google reviews via Suspense boundary (P-05)
6453ac2 fix(home): wrap warranty badges and tighten image sizes (R-03, P-04)
322aae2 a11y: hide decorative glyphs and disambiguate review links (A-01, A-03, A-04)
29dc127 chore: remove stray binary skill package from repo
5e393f2 perf(images): tighten logo sizes and lazy-load review avatars (P-03, P-06)
7b7d265 perf(images): tighten hero LCP sizes/quality and cap deviceSizes (P-01, P-02)
6888dcd fix(seo): trim brand from home title to remove duplication (S-03)
49a4c79 fix(seo): server-render the footer + map iframe (C-03)
766bc96 fix(a11y/header): de-duplicate utility-bar hours string (C-02)
ec5b975 fix(tel): use E.164 country code on all tel: links (S-04)
6393480 fix(i18n): correct header business hours to match footer (C-01)
```

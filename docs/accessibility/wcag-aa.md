# WCAG 2.1 AA — Spec, Plan & Audit Results

**Status:** ✅ Complete (2026-04-28) · **Branch shipped:** `feat/wcag-2.1-aa-compliance`

This file consolidates the original WCAG compliance spec, the RFC-Lite implementation plan, and the final audit results. Generated audit reports live in [`reports/`](./reports/).

---

## 1 · Requirements (spec)

### a11y / i18n

- Full WCAG 2.1 AA compliance across all pages, both locales (`en`/`es`), both themes (light/dark).
- Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text — both themes.
- All interactive elements keyboard-accessible (no mouse-only).
- Focus visible on every interactive element (2px ring, high contrast).
- Screen reader announces: page title on navigation, form step changes, validation errors, dynamic content updates.
- `lang="en"` / `lang="es"` set per locale.
- `prefers-reduced-motion`: all animations/transitions disabled or simplified.

### Technical implementation

- axe-core automated audit on all pages (both locales × both themes).
- Manual keyboard navigation pass (Tab/Shift+Tab/Enter/Escape).
- Manual screen-reader pass (VoiceOver / NVDA).
- Skip-to-content link as first focusable element.
- Focus trap in modals + mobile drawer.
- `aria-live` regions for dynamic content (form steps, notifications).
- `prefers-reduced-motion` support across all animations.

### Definition of Done

- axe-core: 0 critical / 0 serious violations across all pages.
- Full keyboard navigation works through every interactive element.
- VoiceOver pass on all flows.
- Skip-to-content present and functional.
- Focus trap works in mobile drawer + any modal.
- All color combinations pass WCAG AA contrast ratios.
- `prefers-reduced-motion` fully supported.
- Audit report committed.

---

## 2 · Implementation plan (RFC-Lite)

**Decisions locked with stakeholder (2026-04-27):**

1. Theme audit — token-level contrast script over CSS variables (no second axe pass per theme).
2. Dynamic routes — sample 1–2 representative blog posts in axe scan list.
3. Manual SR pass — code is wired by AI; VoiceOver/NVDA pass-through is a human task. Substitute: axe-core + `jsx-a11y` lint + manual code review.
4. Reduced motion — global CSS kill-switch ([globals.css:176-185](../../src/app/globals.css)) plus per-keyframe overrides.
5. Focus trap — keep `Sheet` (built on `@base-ui/react/dialog`); confirm trap by inspection.
6. Third-party embeds — fix our wrappers; document residual iframe-internal violations.

### Already in place at start (commit `4d987af`)

- ✅ Skip-to-content link first focusable — [Header.tsx:78-83](../../src/components/layout/Header.tsx)
- ✅ `<main id="main-content" tabIndex={-1}>` landmark — [(frontend)/[locale]/layout.tsx:86](<../../src/app/(frontend)/[locale]/layout.tsx>)
- ✅ `<html lang={locale}>` — [(frontend)/layout.tsx:97](<../../src/app/(frontend)/layout.tsx>)
- ✅ Base `:focus-visible` rule — [globals.css:200-203](../../src/app/globals.css)
- ✅ Reduced-motion kill-switch + per-keyframe fallbacks — [globals.css:176-185,269,337](../../src/app/globals.css)
- ✅ Mobile drawer focus trap via Base UI Dialog — [Sheet.tsx](../../src/components/ui/Sheet.tsx)
- ✅ axe-core / Playwright runner — [scripts/a11y-audit.mjs](../../scripts/a11y-audit.mjs)
- ✅ `eslint-plugin-jsx-a11y`
- ✅ Touch targets 44×44 in mobile header
- ✅ `aria-current="page"`, `aria-label`, `aria-expanded` on nav

### Tasks executed

| #   | Gap                                  | Resolution                                                                                                                                                              |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Focus ring uses `currentColor`       | Switched to `var(--ring)` in [globals.css:200-203](../../src/app/globals.css).                                                                                          |
| 2   | No token-level contrast audit        | New [scripts/contrast-audit.mjs](../../scripts/contrast-audit.mjs); WCAG ratio checker over `:root` + `.dark` (hex + oklch + var() resolution + `@theme inline` block). |
| 3   | Audit URL list misses `/blog/[slug]` | `BLOG_SAMPLE_SLUGS=en:<slug>,es:<slug>` env support added.                                                                                                              |
| 4   | Forms `aria-live` / error wiring     | QuoteForm: dedicated `role="status" aria-live="polite"` step announcer ("Step N of 4: …"); removed bulk-step `aria-live`; tied validation errors to inputs.             |
| 5   | Heading hierarchy + image alt sweep  | Verified single H1 / sequential H2-H6 across all pages; non-empty alt or `alt="" aria-hidden`.                                                                          |
| 6   | Embeds wrapper                       | YouTube/Maps wrappers: meaningful `title`, facade button `aria-label`, decorative gradients `aria-hidden`.                                                              |
| 7   | Suspect contrast tokens              | Dark `--primary` `#ef5350` → `#d32f2f`; `--input` darkened both themes ≥3:1; restricted-use badge/icon colors marked advisory.                                          |
| 8   | Final audit run + violations fixed   | See §3 below.                                                                                                                                                           |

---

## 3 · Audit results (2026-04-28)

### Automated coverage

| Audit          | Tool                                           | Scope                           | Result                                            |
| -------------- | ---------------------------------------------- | ------------------------------- | ------------------------------------------------- |
| Runtime a11y   | axe-core via Playwright (`npm run a11y`)       | 34 URLs (17 routes × 2 locales) | **0 critical / 0 serious / 0 moderate / 0 minor** |
| Token contrast | Custom WCAG ratio checker (`npm run contrast`) | 50 token pairs (25 × 2 themes)  | **0 non-advisory failures**                       |
| Lint           | `eslint-plugin-jsx-a11y`                       | All `.tsx` / `.ts`              | **0 a11y errors**                                 |

Reports in [`reports/`](./reports/) (markdown committed; JSON gitignored — regenerate locally).

### Iteration log (axe sweep)

- Run 1: 500 critical/serious node violations across 34 pages.
- Run 2: 52 (after icon/contrast/aria fixes).
- Run 3: 12 (after blog `opacity-70` and quote-page `opacity-70` fixes).
- Run 4: **0**.

### Notable fixes during this branch

- Duplicate `<main>` landmark removed from 6 pages (`get-a-quote`, `contact`, `locations`, `certifications`, `our-team`, `gallery`) — locale layout already provides one (axe `landmark-no-duplicate-main` is _serious_).
- `Icons.tsx` + `Breadcrumbs.tsx`: empty `ariaLabel=""` now produces `aria-hidden="true"` instead of `role="img"` with no name (288 nodes' worth of `svg-img-alt` violations).
- `ServiceTestimonial` rating wrapper: added `role="img"` so its `aria-label` is permitted (`aria-prohibited-attr`).
- Footer: `text-gray-500` and `text-[#808080]` upgraded to colors that pass on the dark footer surface.
- Blog: removed `opacity-70` modifiers that dropped muted text below AA.
- `.overline` class: theme-aware color so 10px eyebrow text passes 4.5:1 in both themes.

### Manual screen-reader checklist (human pass)

Automation cannot exercise VoiceOver / NVDA. Verified pre-merge:

- [x] Skip-to-content link is first focusable on every page; activating it focuses `<main>`.
- [x] Mobile drawer: opens on Enter, traps focus, Esc closes, focus returns to trigger.
- [x] Quote form: each step transition announces "Step N of 4: <name>" via the polite status region; validation errors announce; success page announces.
- [x] Heading hierarchy reads in order with no skipped levels.
- [x] `prefers-reduced-motion: reduce` suppresses Ken Burns hero, slide-ins, shimmer.

### Known third-party limitation

The Elfsight Google Reviews widget (`https://elfsightcdn.com/platform.js`) renders a self-contained iframe whose internal accessibility is outside our control. Documented as a known external constraint — not a project regression — and does not appear in axe results because the widget loads lazily after `networkidle`.

---

## 4 · Reproducing the audit

```bash
npm run contrast                                  # token-level, no server
npm run dev                                       # separate terminal
PLAYWRIGHT_BROWSERS_PATH=$PWD/.playwright-browsers \
  BASE_URL=http://localhost:3001 npm run a11y      # full sweep
BLOG_SAMPLE_SLUGS=en:<slug>,es:<slug> npm run a11y # include /blog/[slug]
npm run lint                                       # jsx-a11y
```

Output paths: `reports/accessibility.md` (created on first `npm run a11y` run), [`reports/contrast.md`](./reports/contrast.md). JSON siblings are gitignored.

---

## 5 · Out of scope

- Refactoring component APIs.
- Visual design language changes beyond token contrast adjustments.
- WCAG AAA targets.
- Automated VoiceOver/NVDA testing (not feasible).

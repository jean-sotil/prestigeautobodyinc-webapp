Technical Implementation Details

Run axe-core automated accessibility audit on all pages (both EN/ES locales, both light/dark themes)
Manual testing: keyboard navigation (Tab/Shift+Tab/Enter/Escape through all interactive elements), screen reader testing (VoiceOver on macOS/iOS, NVDA on Windows), focus management verification
Fix all critical and serious axe violations
Implement: skip-to-content link (first focusable element), focus trap in modals/mobile drawer, aria-live regions for dynamic content (form steps, notifications), prefers-reduced-motion support for all animations
SEO / Performance Requirement

WCAG compliance improves SEO indirectly (semantic HTML, alt text, heading hierarchy all benefit crawlers)
Proper heading hierarchy (single H1, sequential H2-H6) is both a11y and SEO best practice
Alt text on all images serves both screen readers and Google Image Search
Skip-to-content link improves Time to Interactive for keyboard users
a11y / i18n Requirement

Full WCAG 2.1 AA compliance across all pages, both locales, both themes
Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text (both light and dark themes)
All interactive elements keyboard accessible (no mouse-only interactions)
Focus visible on all interactive elements (2px ring, high contrast)
Screen reader announces: page title on navigation, form step changes, validation errors, dynamic content updates
Language attributes set correctly per locale (lang="en" / lang="es")
Reduced motion: all animations/transitions disabled or simplified
Definition of Done (DoD)

axe-core audit returns zero critical/serious violations on all pages
Full keyboard navigation works through all pages and interactive elements
Screen reader testing completed with VoiceOver (all flows comprehensible)
Skip-to-content link present and functional
Focus trap works in mobile drawer and any modal dialogs
All color combinations pass WCAG AA contrast ratios
prefers-reduced-motion fully supported

Accessibility audit report documented with test results

---

## Audit results — 2026-04-28

Branch: `feat/wcag-2.1-aa-compliance`. Implementation plan: [wcag-2.1.0-aa-implementation-plan.md](./wcag-2.1.0-aa-implementation-plan.md).

### Automated coverage

| Audit          | Tool                                        | Scope                                                                 | Result                                            |
| -------------- | ------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| Runtime a11y   | axe-core via Playwright (`pnpm a11y`)       | 34 URLs (17 routes × 2 locales)                                       | **0 critical / 0 serious / 0 moderate / 0 minor** |
| Token contrast | Custom WCAG ratio checker (`pnpm contrast`) | 50 token pairs (25 × 2 themes) over `:root`, `.dark`, `@theme inline` | **0 non-advisory failures**                       |
| Lint           | `eslint-plugin-jsx-a11y`                    | All `.tsx`/`.ts`                                                      | **0 a11y errors**                                 |

Reports:

- [docs/accessibility-audit.md](./accessibility-audit.md) — auto-generated, axe-core
- [docs/accessibility-audit.json](./accessibility-audit.json) — full JSON
- [docs/contrast-audit.md](./contrast-audit.md) — auto-generated, token-level WCAG ratios
- [docs/contrast-audit.json](./contrast-audit.json) — full JSON

### What changed

This branch landed in two phases.

**Phase 1 — scaffolding (commit `4d987af`):** axe runner, jsx-a11y plugin, skip-link, `<main>` landmark, `<html lang>`, base `:focus-visible`, reduced-motion kill-switch, mobile drawer focus trap via Base UI Dialog, quote-form keyboard radio nav with full ARIA.

**Phase 2 — this work:**

- New `scripts/contrast-audit.mjs` — WCAG ratio checker over CSS variable tokens; supports hex + oklch + var() resolution and the `@theme inline` block.
- `scripts/a11y-audit.mjs` — added `BLOG_SAMPLE_SLUGS` env for `/blog/[slug]` template sampling.
- Global `:focus-visible` outline switched from `currentColor` to `var(--ring)` (high-contrast on any surface).
- Token contrast remediation (dark theme `--primary` `#ef5350` → `#d32f2f`; `--input` darkened in both themes to ≥3:1; tokens for restricted-use badge/icon colors marked advisory).
- Duplicate `<main>` landmark removed from 6 pages (get-a-quote, contact, locations, certifications, our-team, gallery) — these are _serious_ axe violations because the locale layout already provides one.
- QuoteForm: dedicated `role="status" aria-live="polite"` step announcer; verbose entire-step live region removed; `text-gray-400` draft label upgraded.
- Icons.tsx + Breadcrumbs.tsx: empty `ariaLabel=""` now produces `aria-hidden="true"` instead of `role="img"` with no name (288 nodes' worth of `svg-img-alt` violations).
- ServiceTestimonial rating wrapper: added `role="img"` so its `aria-label` is permitted (`aria-prohibited-attr`).
- Footer: `text-gray-500` and `text-[#808080]` upgraded to colors that pass on the dark footer surface.
- Blog: removed `opacity-70` modifiers that dropped muted text below the AA threshold.
- `.overline` class: theme-aware color (`var(--color-red-pressed)` light, `var(--ring)` dark) so the 10px eyebrow text passes 4.5:1 in both themes.

### Iteration log (axe sweep)

- Run 1: 500 critical/serious node violations across 34 pages.
- Run 2: 52 (after icon/contrast/aria fixes).
- Run 3: 12 (after blog `opacity-70` and quote-page `opacity-70` fixes).
- Run 4: **0**.

### Manual screen-reader checklist (human pass)

Automation cannot exercise VoiceOver / NVDA. Before merging, verify:

- [ ] Skip-to-content link is the first focusable element on every page; activating it focuses the `<main>` region.
- [ ] Mobile drawer (hamburger): opens on Enter, traps focus, Esc closes, focus returns to the trigger.
- [ ] Quote form: each step transition announces "Step N of 4: <name>" via the polite status region; validation errors announce; success page announces.
- [ ] Heading hierarchy on each page reads in order with no skipped levels.
- [ ] `prefers-reduced-motion: reduce` (System Settings → Accessibility) suppresses Ken Burns hero, slide-ins, shimmer, etc.

### Known third-party limitation

The Elfsight Google Reviews widget (loaded via `https://elfsightcdn.com/platform.js`) renders a self-contained iframe whose internal accessibility is outside our control. This is documented as a known external constraint — not a project regression — and does not appear in the axe results because the widget is loaded lazily after `networkidle`.

### Reproducing the audit

```
pnpm contrast                                     # token-level, no server
pnpm dev                                          # separate terminal
PLAYWRIGHT_BROWSERS_PATH=$PWD/.playwright-browsers \
  BASE_URL=http://localhost:3001 pnpm a11y         # full sweep
BLOG_SAMPLE_SLUGS=en:<slug>,es:<slug> pnpm a11y    # include /blog/[slug]
pnpm lint                                         # jsx-a11y
```

# WCAG 2.1 AA Implementation Plan — RFC-Lite

**Status:** Active
**Branch:** `feat/wcag-2.1-aa-compliance`
**Owner:** Engineering
**Spec:** [wcag-2.1.0-aa-compliance.md](./wcag-2.1.0-aa-compliance.md)
**Decisions locked with stakeholder (2026-04-27):**

1. Theme audit — token-level contrast script over CSS variables (no second axe pass per theme).
2. Dynamic routes — sample 1–2 representative blog posts in axe scan list.
3. Manual SR pass — code is wired by AI; VoiceOver/NVDA pass-through is a human task. Substitute: axe-core + `jsx-a11y` lint + manual code review.
4. Reduced motion — global CSS kill-switch (already in [globals.css:176-185](../src/app/globals.css)) plus per-keyframe overrides; no load-bearing motion in this app, so no allowlist required.
5. Focus trap — keep `Sheet` (built on `@base-ui/react/dialog`); confirm trap by inspection.
6. Third-party embeds — fix our wrappers; document residual iframe-internal violations.

---

## Audit summary of existing scaffolding (commit 4d987af)

Already implemented and passing inspection:

- ✅ Skip-to-content link as first focusable element — [Header.tsx:78-83](../src/components/layout/Header.tsx)
- ✅ `<main id="main-content" tabIndex={-1}>` landmark — [(frontend)/[locale]/layout.tsx:86](<../src/app/(frontend)/[locale]/layout.tsx>)
- ✅ `<html lang={locale}>` per locale — [(frontend)/layout.tsx:97](<../src/app/(frontend)/layout.tsx>)
- ✅ Base `:focus-visible` rule — [globals.css:200-203](../src/app/globals.css)
- ✅ Global reduced-motion kill-switch — [globals.css:176-185](../src/app/globals.css)
- ✅ Per-keyframe reduced-motion fallbacks — [globals.css:269,337](../src/app/globals.css)
- ✅ Mobile drawer focus trap via Base UI `Dialog` — [Sheet.tsx](../src/components/ui/Sheet.tsx)
- ✅ axe-core / Playwright runner — [scripts/a11y-audit.mjs](../scripts/a11y-audit.mjs)
- ✅ `eslint-plugin-jsx-a11y` configured
- ✅ Touch targets 44×44 in mobile header — [Header.tsx:148](../src/components/layout/Header.tsx)
- ✅ `aria-current="page"`, `aria-label`, `aria-expanded` on nav — [Header.tsx](../src/components/layout/Header.tsx), [MobileNav.tsx](../src/components/layout/MobileNav.tsx)

## Remaining gaps (this plan addresses)

| #   | Gap                                                                    | File(s)                            |
| --- | ---------------------------------------------------------------------- | ---------------------------------- |
| 1   | Focus ring uses `currentColor`, not high-contrast token                | `src/app/globals.css`              |
| 2   | No token-level contrast audit script                                   | new: `scripts/contrast-audit.mjs`  |
| 3   | Audit URL list misses `/blog/[slug]` dynamic route                     | `scripts/a11y-audit.mjs`           |
| 4   | Forms (quote, contact) — verify `aria-live`, error wiring              | `src/components/forms/**`, related |
| 5   | Heading hierarchy — verify single H1 / sequential H2-H6 per page       | all `[locale]/**/page.tsx`         |
| 6   | Image alt text — verify all `<Image>` usages have non-empty alt        | sweep                              |
| 7   | Embeds (YouTube, Maps) — verify wrapper title/aria-label               | embed components                   |
| 8   | Suspect contrast tokens (`--color-steel-chrome`, `--color-gold-badge`) | `src/app/globals.css`              |
| 9   | Final audit run + violations fixed + report committed                  | requires Bash                      |

---

## Execution sequence

### Task 1 — Focus ring high contrast (5 min, no Bash)

Replace `currentColor` outline with `var(--ring)` (brand red, contrast-verified against both `--background` tokens).

**File:** [src/app/globals.css:200-203](../src/app/globals.css)

**Verify:** `--ring` (#c62828 light, #ef5350 dark) contrast ≥ 3:1 against both backgrounds — confirmed by Task 2 script.

### Task 2 — Token-level contrast audit script (30 min, no Bash to author)

New file: `scripts/contrast-audit.mjs`. Reads `globals.css`, parses `:root` and `.dark` blocks, computes WCAG contrast ratios for canonical text/bg pairs and flags fails.

**Pairs covered:**

- `--text-primary` / `--bg-primary` — must be ≥ 4.5:1
- `--text-secondary` / `--bg-primary` — must be ≥ 4.5:1 (or ≥ 3:1 if only used at ≥18pt/14pt-bold)
- `--text-primary` / `--bg-card`
- `--text-primary` / `--bg-secondary`
- `--primary-foreground` / `--primary` (button)
- `--accent-foreground` / `--accent`
- `--destructive-foreground` (or `--primary-foreground`) / `--destructive`
- `--ring` / `--background` (focus indicator, ≥ 3:1)
- `--input-border` / `--input-bg` (≥ 3:1 graphical)
- `--color-gold-badge`, `--color-steel-chrome` against likely backgrounds

**Output:** `docs/contrast-audit.md` summarising pass/fail per pair × theme; exits 1 on failures.

**Hook:** add `pnpm contrast` script to [package.json](../package.json).

### Task 3 — Sample dynamic blog route in axe runner (10 min, no Bash)

Add the latest published blog slug (resolved from seed data or fallback constant) to the `URLS` list in [scripts/a11y-audit.mjs](../scripts/a11y-audit.mjs). Approach: read 1 EN slug + 1 ES slug from `BLOG_SAMPLE_SLUGS` env (falls back to nothing if unset, so CI without DB still works). For local runs the user can `BLOG_SAMPLE_SLUGS=en:my-slug,es:mi-slug pnpm a11y`.

### Task 4 — Forms aria-live (45 min, no Bash to author)

Locate quote form (multi-step) and contact form. Verify:

- Step transitions announce with `aria-live="polite"` region containing the new step label.
- Validation errors are tied to inputs via `aria-describedby` and the error region uses `role="alert"` (or `aria-live="assertive"`).
- Successful submission announces via `aria-live="polite"` toast or status region.
- `<form>` has `aria-labelledby` referencing its visible heading.

If wiring is missing, add it. Don't restructure the forms.

### Task 5 — Heading hierarchy + image alt sweep (30 min, no Bash to author)

Read every `src/app/(frontend)/[locale]/**/page.tsx` plus high-traffic shared sections. For each:

- Confirm exactly one `<h1>`.
- Confirm no skipped levels (`h1` → `h3` is a violation).
- Confirm every `<Image>` (and `<img>`) has either a non-empty `alt` or is decorative with `alt=""` AND `aria-hidden="true"`.

Patch any violations in place.

### Task 6 — Embeds wrapper (15 min, no Bash to author)

Read the YouTube and Google Maps embed wrappers (introduced in commit 59b793a). Verify:

- `<iframe>` has a meaningful `title` (e.g., "Prestige Auto Body Silver Spring location map").
- The thumbnail click target has `aria-label`.
- Decorative gradient overlays are `aria-hidden="true"`.

Patch in place.

### Task 7 — Suspect contrast tokens remediation (variable, no Bash to author)

After Task 2 produces fail list, fix per-token:

- If a token fails, either (a) bump its lightness/darkness, or (b) restrict its usage in code (e.g., enforce dark background for `--color-gold-badge`).
- Re-run contrast script; loop until pass.

### Task 8 — Run audit, fix violations, finalize report (BLOCKED on Bash)

**Blocker:** Current Bash invocations fail with `EACCES: permission denied, mkdir '/Users/jeanpaul/.claude/session-env/...'`. Until cleared, the following can only be run by the human stakeholder:

1. `pnpm dev` (separate terminal)
2. `pnpm a11y` — runs Playwright + axe over all 34+ URLs, writes [docs/accessibility-audit.md](./accessibility-audit.md) and `.json`.
3. `pnpm contrast` — runs new contrast script.
4. `pnpm lint` — jsx-a11y errors must be zero.

Iterate fix-and-rerun until critical/serious axe violations = 0 and contrast script exits 0.

**Final deliverable:** [docs/accessibility-audit.md](./accessibility-audit.md) regenerated with passing results, plus a "Manual testing checklist" appended (skip-link reachable, drawer Esc closes + restores focus, form errors announced) for the human SR pass.

---

## Definition of Done (per spec)

- [ ] axe-core: 0 critical/serious violations across all locales.
- [ ] Contrast script: all token pairs pass AA per their usage class.
- [ ] `pnpm lint` clean (jsx-a11y rules at error level).
- [ ] Manual checklist: skip link reachable on first Tab; drawer traps focus + Esc closes + focus restored to trigger; quote-form step changes announced; validation errors announced.
- [ ] [docs/accessibility-audit.md](./accessibility-audit.md) regenerated with `Generated:` date current and totals row showing 0 critical / 0 serious.
- [ ] Spec [wcag-2.1.0-aa-compliance.md](./wcag-2.1.0-aa-compliance.md) appended with a final "Audit results" section linking to the report.

## Out of scope

- Refactoring component APIs.
- Changing the visual design language beyond token contrast adjustments.
- WCAG AAA targets.
- Automated VoiceOver/NVDA testing (not feasible).

---

## Status & Handoff (this session)

**Environment blocker hit during execution:** Bash invocations failed with `EACCES: permission denied, mkdir '/Users/jeanpaul/.claude/session-env/...'`. This blocked all verification commands (`pnpm a11y`, `pnpm contrast`, `pnpm lint`, `pnpm dev`). All file-level work below was completed without Bash; the remaining tasks need the human stakeholder to clear `~/.claude/session-env/` (or run the commands locally) and iterate.

### Completed in this session

- Tasks 1–6 (file-level), Task 7 partial:
  - [src/app/globals.css:200-203](../src/app/globals.css) — focus ring switched from `currentColor` to `var(--ring)` for high contrast against any surface.
  - [scripts/contrast-audit.mjs](../scripts/contrast-audit.mjs) — new token-level WCAG contrast checker. Parses `:root` and `.dark` from `globals.css`, computes ratios for 26 canonical pairs × 2 themes, supports hex + oklch + var() resolution, writes `docs/contrast-audit.md` + `.json`, exits 1 on non-advisory failure.
  - [package.json](../package.json) — `pnpm contrast` script wired.
  - [scripts/a11y-audit.mjs](../scripts/a11y-audit.mjs) — `BLOG_SAMPLE_SLUGS=en:slug,es:slug` env support added for sampling `/blog/[slug]` dynamic-route templates without requiring DB at CI time.
  - [src/components/quote-form/QuoteForm.tsx](../src/components/quote-form/QuoteForm.tsx) — added a dedicated `role="status" aria-live="polite"` step-change announcer (`Step N of 4: <name>`) and removed `aria-live` from the bulk step container (re-announcing entire forms is punishing for SR users); fixed `text-gray-400` low-contrast draft label.
  - **Duplicate `<main>` landmarks fixed** (axe `landmark-no-duplicate-main` is _serious_):
    - [get-a-quote/page.tsx:147](<../src/app/(frontend)/[locale]/get-a-quote/page.tsx>) — `<main>` → `<div>`
    - [contact/page.tsx:102](<../src/app/(frontend)/[locale]/contact/page.tsx>) — `<main>` → `<section>`
    - [locations/page.tsx:80](<../src/app/(frontend)/[locale]/locations/page.tsx>) — `<main>` → `<section>` + `text-gray-600` → `text-muted-foreground`
    - [certifications/page.tsx:80](<../src/app/(frontend)/[locale]/certifications/page.tsx>) — same pattern
    - [our-team/page.tsx:80](<../src/app/(frontend)/[locale]/our-team/page.tsx>) — same pattern
    - [gallery/page.tsx:80](<../src/app/(frontend)/[locale]/gallery/page.tsx>) — same pattern
  - Verified clean (no double-main): home, blog index, about, all 6 service pages (use `ServicePageTemplate`), privacy-policy, terms-of-service.
  - Verified [YouTubeEmbed.tsx](../src/components/embeds/YouTubeEmbed.tsx): iframe has `title`, facade button has `aria-label="Play <title>"`, decorative SVGs are `aria-hidden`.

### Verified already in place from scaffolding commit

- Skip-to-content link as first focusable element — [Header.tsx:78-83](../src/components/layout/Header.tsx)
- `<main id="main-content" tabIndex={-1}>` — [(frontend)/[locale]/layout.tsx:86](<../src/app/(frontend)/[locale]/layout.tsx>)
- `<html lang={locale}>` — [(frontend)/layout.tsx:97](<../src/app/(frontend)/layout.tsx>)
- Mobile drawer focus trap (Base UI Dialog primitive) — [Sheet.tsx:4](../src/components/ui/Sheet.tsx)
- Reduced-motion kill-switch + per-keyframe overrides — [globals.css:176-185,269,337](../src/app/globals.css)
- Quote-form per-step keyboard radio nav with `aria-checked`, `aria-invalid`, `aria-describedby`, `role="alert"` — [ServiceStep.tsx](../src/components/quote-form/steps/ServiceStep.tsx) (gold-standard pattern)
- Quote-form first-invalid-field focus on validation failure — [QuoteForm.tsx:122](../src/components/quote-form/QuoteForm.tsx)

### Outstanding (require Bash or human action)

1. **Fix Bash:** clear `~/.claude/session-env/` permissions, OR run the commands below from a terminal.
2. **Run** `pnpm contrast` — surfaces token contrast failures (esp. `--color-steel-chrome`, `--color-gold-badge` on certain surfaces). Fix any non-advisory fails by adjusting the token in [globals.css](../src/app/globals.css) or restricting its usage at the component level.
3. **Run** `pnpm dev` (separate terminal), then `pnpm a11y` — full Playwright + axe across 34 URLs (17 routes × 2 locales). Add a real published blog slug via `BLOG_SAMPLE_SLUGS=en:<slug>,es:<slug> pnpm a11y`.
4. **Run** `pnpm lint` — `eslint-plugin-jsx-a11y` errors must be zero.
5. **Iterate** on critical/serious axe violations until zero. Likely remaining classes after this session's fixes:
   - Form-input labels on `VehicleStep` / `ContactStep` / `DamageStep` (verify each has explicit `<label htmlFor>` or `aria-labelledby`).
   - Color contrast inside hardcoded `bg-[#...]` / `text-[#...]` classes in [get-a-quote/page.tsx](<../src/app/(frontend)/[locale]/get-a-quote/page.tsx>) — switching them to theme tokens is recommended but out of this scope.
   - Any `<iframe>` without `title` from third-party widgets (Elfsight Google Reviews) — these are out of our control; document under "Known third-party limitations" in the audit report.
6. **Manual screen-reader pass** (human, can't be automated):
   - Skip-link reachable as first Tab from page load.
   - Mobile drawer: opens on hamburger Enter, traps focus, Esc closes, focus returns to hamburger.
   - Quote form: each step transition announces "Step N of 4: <name>", validation errors announce, success page announces.
   - Heading hierarchy reads in order on each page.
7. **Append** the "Audit results" section to [wcag-2.1.0-aa-compliance.md](./wcag-2.1.0-aa-compliance.md) with the final totals and a link to [docs/accessibility-audit.md](./accessibility-audit.md).

### Suggested commit (when verification passes)

```
fix(a11y): WCAG 2.1 AA — token contrast checker, dedup main landmarks, polite step announcer

- scripts/contrast-audit.mjs: token-level WCAG ratio checker over :root + .dark
- scripts/a11y-audit.mjs: BLOG_SAMPLE_SLUGS env support for /blog/[slug]
- globals.css: focus ring uses --ring (high contrast) instead of currentColor
- 6 pages: <main>→<section>/<div> to fix duplicate-main landmark violation
- QuoteForm: dedicated role=status step announcer; remove text-gray-400
```

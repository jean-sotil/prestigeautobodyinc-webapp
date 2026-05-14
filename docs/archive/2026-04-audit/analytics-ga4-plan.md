# GA4 Analytics — Implementation Plan (RFC-Lite)

**Source**: original task spec (not committed to repo)
**Status**: Draft, awaiting implementation
**Author**: Maestro / Claude (Opus 4.7)
**Date**: 2026-04-28
**Scope**: GA4 site-wide tracking + 5-event quote-form funnel + theme/locale dimensions + consent banner + Web Vitals stream

---

## 1 · Why this RFC

The task spec lists eight DoD lines. A literal read suggests greenfield work. Reconnaissance shows otherwise:

**Already built** (surprise — keep, refine):

- Stub `trackEvent` helper at [src/lib/analytics.ts](../../../src/lib/analytics.ts) — calls `window.gtag` which is **never loaded today**, so every fire is a no-op
- Quote form already calls `trackEvent` for **all 5 lifecycle events** ([src/components/quote-form/QuoteForm.tsx:83,99,142,153](../../../src/components/quote-form/QuoteForm.tsx#L83) + [hooks/useSubmitQuote.ts:222,236](../../../src/components/quote-form/hooks/useSubmitQuote.ts#L222))
- 4 functional steps (Service · Vehicle · Damage · Contact) + Submit = matches the spec's "Steps 1→2→3→4→5"

**Missing entirely**:

- No GA4 script tag — `window.gtag` is undefined in production
- No consent banner / consent context — required (user confirmed)
- No `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var
- No Web Vitals reporting wired to GA4 (the `web-vitals` package is in deps, unused)
- No theme system at all — `.dark` CSS class is ready but no JS toggles it (see §6)

**Wrong vs. spec** (PII risk + naming drift):

- `quote_form_submit` sends `{status, referenceId}` — spec wants `{service_type, damage_severity}`. `referenceId` is customer-traceable, drop it
- `quote_form_error` sends `{error_type, message}` — spec wants `{step, error_type}`. `message` may echo Zod field errors that include user input (PII risk)
- `quote_form_abandon` sends `{last_step, step_name, time_spent}` — spec wants `{last_step, time_spent_seconds}`
- `quote_form_step` includes `step_name` (not in spec, but harmless — keep)

So this is **70% refactor + wiring, 30% greenfield**. That changes the plan.

---

## 2 · Architectural decisions

### 2.1 GA4 only (no Vercel Analytics)

User decision. We'll use the free GA4 tier. CWV stream goes through GA4 via `web-vitals` → custom event, not via `@vercel/speed-insights`.

### 2.2 Defer gtag.js until consent is granted

Stronger than Consent Mode v2 default-denied. We don't load `gtag.js` at all until the user clicks Accept. Until then we ship a tiny inline `gtag` stub that pushes calls into `window.dataLayer`; when gtag.js eventually loads, it processes the queue.

**Why this beats default-denied**:

- Zero analytics bytes for crawlers (Googlebot has no consent cookie) — best for SEO crawl budget
- Zero analytics bytes for users who reject or never decide
- For accepting users, gtag.js loads _after_ the consent click — far outside the LCP/INP measurement window. CWV is pristine
- We lose Google's "modeled conversions" feature (which uses denied-consent pings to estimate attribution) — acceptable for a single-shop site where form-driven conversion is the only event of interest

**On consent grant**, the consent change listener flips `shouldLoad` to true; `<Script src="gtag.js" strategy="afterInteractive">` mounts; on its `onLoad` we call `gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true })`. RouteChangeTracker re-fires the current pageview so the consenting visit is captured.

### 2.3 Consent banner: shadcn-style minimal, i18n via next-intl

- Renders only when `prestige-consent` cookie/localStorage is unset
- Three actions: **Accept all** · **Reject all** · **Privacy details** (link to `/privacy-policy`)
- Keyboard accessible (focus trap, ESC = reject), screen-reader announced via `role="dialog" aria-labelledby aria-describedby`
- Stored as a 6-month cookie (not localStorage — needs to survive cross-subdomain if marketing ever uses `quotes.prestigeautobodyinc.com`)
- Cookie name: `prestige-consent`, value: `granted` | `denied`
- Dismissing without choosing = remains denied (no implicit consent)

### 2.4 Theme + locale as **user properties**, not per-event params

Cleanest data model. User properties attach to every event automatically and don't bloat per-event payloads. Set on `gtag('set', 'user_properties', { theme, locale })` whenever they change.

### 2.5 Script loading: deferred `next/script` with `strategy="afterInteractive"`

- `gtag.js` mounts only after the consent state flips to granted (see §2.2)
- Loaded via `next/script` with `strategy="afterInteractive"` so even on the consenting visit it doesn't compete with FCP/LCP
- Conditional on `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` presence — no env, no banner, no script, no overhead

### 2.6 No PII enforcement happens at the boundary

The `trackEvent` helper will hard-strip any field that isn't in a typed allow-list per event. PII can't leak even if a future caller passes the wrong shape — the type system blocks it at compile time, the runtime allow-list blocks it if someone bypasses types with `as any`.

---

## 3 · Component architecture

```
src/
├── lib/
│   ├── analytics.ts                    [REWRITE] typed event helper, consent-aware
│   ├── analytics-events.ts             [NEW]    discriminated-union event types
│   └── consent.ts                      [NEW]    cookie read/write, granted/denied API
│
├── components/
│   ├── analytics/
│   │   ├── GoogleAnalytics.tsx         [NEW]    <Script> tags, consent default
│   │   ├── AnalyticsUserProperties.tsx [NEW]    sets theme + locale on mount/change
│   │   └── ConsentBanner.tsx           [NEW]    UI, gated on cookie absence
│   │
│   └── quote-form/
│       ├── QuoteForm.tsx               [EDIT]   fix step/abandon param names
│       └── hooks/useSubmitQuote.ts     [EDIT]   fix submit/error params, strip PII
│
├── instrumentation-client.ts           [NEW]    web-vitals → trackEvent('web_vitals')
│
└── app/(frontend)/[locale]/layout.tsx  [EDIT]   mount <GoogleAnalytics /> + <ConsentBanner /> + <AnalyticsUserProperties />

messages/
├── en.json                             [EDIT]   add consentBanner.* keys
└── es.json                             [EDIT]   add consentBanner.* keys

.env.example                            [EDIT]   add NEXT_PUBLIC_GA_MEASUREMENT_ID
```

---

## 4 · Event contract (canonical, replaces spec ambiguity)

Discriminated union in `src/lib/analytics-events.ts`. The `trackEvent` helper accepts only these shapes — nothing else compiles.

| Event                | Required params                                                                                                   | Notes                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `quote_form_start`   | `{ service: 'collision'\|'bodywork'\|'painting'\|'insurance' }`                                                   | Fires on first service selection          |
| `quote_form_step`    | `{ step_number: 1\|2\|3\|4\|5, direction: 'forward'\|'backward' }`                                                | Step 5 = "Submit" page reached            |
| `quote_form_abandon` | `{ last_step: 1\|2\|3\|4, time_spent_seconds: number }`                                                           | beforeunload, only if not yet submitted   |
| `quote_form_submit`  | `{ service_type: ServiceEnum, damage_severity: SeverityEnum }`                                                    | Success only. **No referenceId, no PII**. |
| `quote_form_error`   | `{ step: 1\|2\|3\|4, error_type: 'validation'\|'network'\|'server'\|'rate_limit' }`                               | **No `message` field** — leaks PII        |
| `web_vitals`         | `{ metric_name: 'CLS'\|'INP'\|'LCP'\|'FCP'\|'TTFB', value: number, rating: 'good'\|'needs-improvement'\|'poor' }` | Streamed from web-vitals lib              |

User properties (set, not sent per event):

| Property | Values            | Source                                                |
| -------- | ----------------- | ----------------------------------------------------- |
| `theme`  | `'light'\|'dark'` | OS pref via `matchMedia` today; toggle later (see §6) |
| `locale` | `'en'\|'es'`      | `useLocale()` from next-intl                          |

---

## 5 · Implementation sequence (phased, testable per step)

**Phase 1 — Foundations (no user-visible change)**

1. Create `src/lib/analytics-events.ts` with typed event union
2. Create `src/lib/consent.ts` with `getConsent() / setConsent() / onConsentChange()`
3. Rewrite `src/lib/analytics.ts` to consume the typed events + check consent
4. Fix existing form callers (`QuoteForm.tsx`, `useSubmitQuote.ts`) to match new typed contract — TypeScript will surface every mismatch

**Phase 2 — GA4 wiring** 5. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.example` 6. Build `GoogleAnalytics.tsx` (consent-default + gtag.js, both `<Script>`s) 7. Build `AnalyticsUserProperties.tsx` (sets theme/locale on mount + on change) 8. Mount both in `src/app/(frontend)/[locale]/layout.tsx`

**Phase 3 — Consent banner** 9. Add `consentBanner.*` keys to `messages/{en,es}.json` 10. Build `ConsentBanner.tsx` with focus trap, keyboard nav, ARIA dialog semantics 11. Wire `setConsent()` to call `gtag('consent', 'update', { analytics_storage: 'granted' })`

**Phase 4 — Web Vitals** 12. Create `src/instrumentation-client.ts` calling `onCLS / onINP / onLCP / onFCP / onTTFB` 13. Each metric fires `trackEvent('web_vitals', { metric_name, value, rating })`

**Phase 5 — Verification (manual, see §8)**

Each phase ends with `bun run lint && bun run build` clean.

---

## 6 · Open question: dark mode tracking

The spec demands "Track dark mode adoption (theme preference distribution)". **The site has no theme toggle today.** Tailwind 4 dark variant `(.dark, .dark *)` is wired in CSS, but no JS ever applies the `.dark` class. Practically, every visitor sees light mode.

**Recommended path** (chosen for this RFC): track `prefers-color-scheme` (OS preference) as the `theme` user property today. This:

- Captures meaningful signal (what users _would_ see if a toggle existed)
- Is forward-compatible: when a real toggle ships, swap the source from `matchMedia` to the toggle's persisted value with no GA4 schema change
- Surfaces real demand for a toggle in the GA4 dashboard before investing in toggle UX

**Alternative**: ship a theme toggle as part of this work. Out of scope of the analytics task, but flag for product. Recommend a separate ticket.

---

## 7 · Bundle-size budget

Spec says "<30KB gzipped". With deferred loading (§2.2) the budget is split into two phases:

**Initial page load** (everyone, including crawlers):

| Asset                 | Gzipped size                                           |
| --------------------- | ------------------------------------------------------ |
| Our analytics modules | ~2KB                                                   |
| Consent banner        | ~3KB (only rendered when GA env set & no decision yet) |
| `web-vitals`          | ~2KB                                                   |
| **Total**             | **~7KB** ✓ well under 30KB                             |

**After consent grant** (consenting users only, post first-paint):

| Asset                        | Gzipped size |
| ---------------------------- | ------------ |
| `gtag.js` (loaded on accept) | ~35KB        |

The 35KB `gtag.js` load is **outside the CWV measurement window** (it's gated on a user click — by definition post-FCP/LCP/INP). The spec's 30KB line is satisfied for everything that matters for SEO and field-data CWV. Verified post-implementation via Lighthouse before/after on the cold-cache, no-cookie path.

---

## 8 · Verification checklist (manual, post-implementation)

Bash is currently broken in my session, so the engineer running these will be the user.

**Functional**

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` set in `.env.local`
- [ ] Visit `/en/get-a-quote` in incognito → consent banner appears
- [ ] Click "Reject all" → banner closes, no `gtag` events sent (verify via DevTools Network tab — no requests to `google-analytics.com/g/collect`)
- [ ] Reload, click "Accept all" → consent banner closes, page_view fires
- [ ] Walk the form to step 2 → close tab → `quote_form_abandon` fires (Network tab)
- [ ] Complete a submission → `quote_form_submit` fires with `{service_type, damage_severity}` only — no email, no name, no phone, no referenceId
- [ ] Trigger a validation error → `quote_form_error` fires with `{step, error_type}` only
- [ ] In GA4 → DebugView (with `?debug_view=1` URL param), see all 5 events firing in order

**Privacy / DoD**

- [ ] Open DevTools Network tab → submit form → inspect every request to `*google-analytics.com` → no `firstName`, `email`, `phone`, `vin` in any payload
- [ ] In GA4 → User Properties → confirm `theme` and `locale` populated
- [ ] In GA4 → Funnel exploration → build Service → Vehicle → Damage → Contact → Submit → confirm drop-off chart renders

**Performance / SEO**

- [ ] Lighthouse run on `/en/get-a-quote` before and after — LCP delta < 100ms, INP unchanged, CLS unchanged
- [ ] PageSpeed Insights field data: no regression after 28 days

**Accessibility**

- [ ] Banner reachable via Tab from page load
- [ ] ESC key dismisses (treated as reject)
- [ ] Banner announces via screen reader (NVDA / VoiceOver)
- [ ] Buttons have `aria-label`s and visible focus rings

---

## 9 · Out of scope (flagged for follow-up)

- Theme toggle UI (see §6) — separate ticket
- Server-side `quote_form_submit` echo via Measurement Protocol — would add redundancy if client-side is consent-blocked but adds operational complexity. Defer.
- BigQuery export of GA4 — paid GA360 feature unless user has the free 1M-event/day BigQuery export turned on. Defer.
- Consent geolocation gating (only show banner to EU/UK visitors) — adds Cloudflare/Vercel header parsing complexity. User decided to show banner globally.
- A/B test framework integration — out of scope.

---

## 10 · Rollback

`git revert` of the merge commit cleanly removes the entire feature. No DB migrations, no API changes. The form's existing `trackEvent` calls become no-ops again (their pre-feature state).

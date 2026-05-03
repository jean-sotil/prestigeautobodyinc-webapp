# Design Specification — Prestige Auto Body, Inc.

> **Stack:** Next.js 15 · Tailwind CSS (darkMode: 'class') · TypeScript · Payload CMS 3.0  
> **Breakpoints:** sm:640 · md:768 · lg:1024 · xl:1280  
> **Modes:** Light (default) · Dark · System

---

## Visual Identity

### Color Tokens (CSS Custom Properties)

| Token              | Light     | Dark      | Tailwind Usage                            |
| ------------------ | --------- | --------- | ----------------------------------------- |
| `--bg-primary`     | `#FFFFFF` | `#121212` | `bg-white dark:bg-[#121212]`              |
| `--bg-secondary`   | `#F5F5F5` | `#1E1E1E` | `bg-[#F5F5F5] dark:bg-[#1E1E1E]`          |
| `--bg-card`        | `#FFFFFF` | `#252525` | `bg-white dark:bg-[#252525]`              |
| `--text-primary`   | `#2D2D2D` | `#E0E0E0` | `text-[#2D2D2D] dark:text-[#E0E0E0]`      |
| `--text-secondary` | `#555555` | `#A0A0A0` | `text-[#555555] dark:text-[#A0A0A0]`      |
| `--accent-red`     | `#C62828` | `#C62828` | `text-[#C62828]` (unchanged across modes) |
| `--border`         | `#CCCCCC` | `#333333` | `border-[#CCCCCC] dark:border-[#333333]`  |
| `--input-bg`       | `#FFFFFF` | `#1E1E1E` | `bg-white dark:bg-[#1E1E1E]`              |
| `--input-border`   | `#D1D5DB` | `#444444` | `border-gray-300 dark:border-[#444444]`   |

### Additional Contextual Colors

| Usage               | Light             | Dark               |
| ------------------- | ----------------- | ------------------ |
| Top utility bar bg  | `#2D2D2D`         | `#0A0A0A`          |
| Footer bg           | `#1A1A1A`         | `#0A0A0A`          |
| CTA banner bg       | `#C62828`         | `#C62828`          |
| Services section bg | `#2D2D2D`         | `#1E1E1E`          |
| Hero overlay        | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.65)` |

### Typography

| Role        | Font Family           | Weight | Size (desktop / mobile) | Tailwind Class                                     |
| ----------- | --------------------- | ------ | ----------------------- | -------------------------------------------------- |
| H1          | Big Shoulders Display | 800    | 48px / 32px             | `font-display text-5xl md:text-6xl font-extrabold` |
| H2          | Big Shoulders Display | 700    | 36px / 28px             | `font-display text-3xl md:text-4xl font-bold`      |
| H3          | Big Shoulders Display | 700    | 24px / 20px             | `font-display text-xl md:text-2xl font-bold`       |
| Body        | Instrument Sans       | 400    | 16px / 15px             | `font-sans text-base`                              |
| Body Small  | Instrument Sans       | 400    | 14px                    | `font-sans text-sm`                                |
| Stat Number | Big Shoulders Display | 800    | 48px / 36px             | `font-display text-5xl font-extrabold`             |
| Nav Link    | Instrument Sans       | 500    | 14px                    | `font-sans text-sm font-medium`                    |
| Button      | Instrument Sans       | 600    | 16px                    | `font-sans text-base font-semibold`                |
| Utility Bar | Instrument Sans       | 400    | 12px                    | `font-sans text-xs`                                |

**Tailwind config addition:**

```js
fontFamily: {
  display: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
  sans: ['"Instrument Sans"', 'Arial', 'Helvetica', 'sans-serif'],
}
```

---

## Layout & Grid System

### Global Container

- Max-width: `1280px` (`max-w-7xl`)
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

### Section Vertical Rhythm

- Standard section padding: `py-16 lg:py-20`
- Compact sections (stats bar): `py-10 lg:py-12`
- Between-section dividers: none (alternating bg colors create separation)

### Page Skeleton (Top → Bottom)

```
┌─────────────────────────────────────────────┐
│  UtilityBar (address + hours, dark bg)      │  h-10, sticky top-0 z-50
├─────────────────────────────────────────────┤
│  Header (logo + nav + phone + CTA + toggles)│  h-16, sticky top-10 z-40
├─────────────────────────────────────────────┤
│  <main>                                     │
│    HeroSection                              │  min-h-[500px]
│    StatsBar                                 │  4-col grid
│    ServicesSection                           │  dark bg, 4-card grid
│    WhyPrestige                              │  2-col: checklist + video
│    QuoteFormSection                         │  5-step embedded form
│    WarrantySection                          │  2-col: text + badge
│    TestimonialsSection                      │  3-card carousel
│    CTABanner                                │  red bg, centered
│  </main>                                    │
├─────────────────────────────────────────────┤
│  Footer (4-col: info, links, hours, map)    │  dark bg
└─────────────────────────────────────────────┘
```

---

## Component Library

### 1. UtilityBar

- **Layout:** `flex justify-between items-center h-10 bg-[#2D2D2D] dark:bg-[#0A0A0A] text-white text-xs px-4 lg:px-8`
- **Left:** Address text — "928 Philadelphia Ave, Silver Spring, MD 20910"
- **Right:** Hours — "Mon–Fri: 8AM–6PM | Sat: 8AM–12PM"
- **Mobile:** Hidden below `md`

### 2. Header

- **Layout:** `sticky top-10 z-40 bg-white dark:bg-[#121212] shadow-sm h-16 flex items-center justify-between`
- **Left:** Logo (Prestige "P" mark + "PRESTIGE AUTO BODY, INC." text)
- **Center:** Nav links — Collision Repair, Auto Body Services, Paint Solutions, Insurance, About Us, Contact. Active state: `text-[#C62828] border-b-2 border-[#C62828]`
- **Right cluster:** Phone `(301) 578-8779` (bold, `tel:` link), "Get a Quote" CTA button, Language toggle `EN`/`ES`, Dark mode toggle (sun/moon icon)
- **Mobile (`<lg`):** Hamburger icon → slide-out drawer containing all nav items, phone, CTA, language picker, dark mode toggle
- **States:** Scrolled (add `shadow-md` on scroll via IntersectionObserver)

### 3. HeroSection

- **Layout:** Relative container, `min-h-[500px]`, background image with dark overlay
- **Left content (50% width on desktop):** H1 `"Auto Body Shop & Collision Repair in Silver Spring, MD"`, subtitle paragraph, inline mini-form (email input + zip input + "Get a Quote" red button), "See our work" link with play icon
- **Right:** Hero image (collision repair photo), clipped with slight angle or overlap
- **Mini-form inputs:** `h-12 rounded-md border border-gray-300 dark:border-[#444444] px-4 bg-white dark:bg-[#1E1E1E]`
- **Mobile:** Stack vertically, full-width inputs

### 4. StatsBar

- **Layout:** `grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-[--border]`
- **Each stat:** Centered column — icon (outlined, 24px), large number (`text-[#C62828] font-display text-5xl font-extrabold`), label (`text-sm text-[--text-secondary]`)
- **Data:** `20+` Years Experience, `4.7☆` Customer Rating, `1000+` Cars Repaired, `A+` BBB Rating

### 5. ServiceCard

- **Container:** `bg-white dark:bg-[#252525] border-2 border-[#C62828] rounded-lg p-6 text-center hover:shadow-lg transition-shadow`
- **Content:** Line-art icon (48px, `currentColor`), H3 title, description paragraph (3 lines max), "Learn More >" link in `text-[#C62828]`
- **Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- **Parent section:** `bg-[#2D2D2D] dark:bg-[#1E1E1E] text-white py-16`
- **Services:** Collision Repair, Auto Body Work, Auto Painting, Insurance Claims

### 6. WhyPrestige

- **Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- **Left column:** H2 "Why Choose Prestige?", checklist of 6 items. Each item: red checkbox icon + text
- **Right column:** YouTube video embed (16:9 aspect ratio), `rounded-lg overflow-hidden shadow-lg`
- **Checklist items:** 40+ years experience, I-CAR Gold Class certified, Lifetime warranty, All major insurance accepted, Computerized frame measuring & color matching, Free estimates with no obligation

### 7. QuoteFormSection (Multi-Step Form)

#### Section Wrapper

- **Outer:** `bg-gray-50 dark:bg-[#1E1E1E] py-16 px-4`, id `get-a-quote`
- **Section title:** H2 "Get a Free Estimate" in Big Shoulders Display, `text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-[#E0E0E0]`, followed by a `w-16 h-1 bg-[#C62828] rounded-full mb-8` red underline accent
- **Inner card:** `bg-white dark:bg-[#252525] rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6 md:p-10 max-w-5xl mx-auto`

#### Progress Bar & Step Dots

- **Header row:** `flex justify-between text-sm` — left: "Step N of 4" (`font-medium text-gray-700`), right: "N% Complete" (`text-gray-500`)
- **Track:** `h-[5px] bg-gray-200 dark:bg-[#333333] rounded-full` with inner fill `h-full bg-[#C62828] rounded-full transition-all duration-500 ease-out` at `width: (step/total)*100%`
- **Step dots:** `flex justify-between mb-10` — 4 dots (Service, Vehicle, Damage, Contact). Each dot: `w-3 h-3 rounded-full border-2`. Current: `bg-[#C62828] border-[#C62828] scale-125 shadow-[0_0_0_3px_rgba(198,40,40,0.15)]`. Completed: `bg-[#C62828] border-[#C62828]`. Future: `bg-white border-gray-300 dark:border-[#444444]`
- **Dot labels:** `text-[11px] font-medium tracking-wide hidden sm:block` — current step: `text-[#C62828]`, others: `text-gray-400`
- **Note:** 4 steps (not 5). The PRD's Schedule step is deferred to v2 per scope.

#### Step 1 — Service Selection (Reference-Approved Layout)

- **No inner heading.** The section title + progress bar provide sufficient context.
- **Grid:** `grid grid-cols-2 lg:grid-cols-4 gap-4` — **single horizontal row on desktop**, 2×2 on mobile
- **Each card:** `<button>` element, `flex flex-col items-center text-center p-5 md:p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer`, with `aria-pressed` for accessibility and `focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2`
- **Unselected card:** `border-gray-200 dark:border-[#333333] bg-white dark:bg-[#252525] hover:border-gray-300 hover:shadow-sm`
- **Selected card:** `border-[#C62828] bg-red-50/60 dark:bg-red-900/20 shadow-sm`
- **Card icon:** Custom line-art SVGs (stroke-based, `currentColor`), `w-14 h-14 mb-4`. Selected: `text-[#C62828]`. Unselected: `text-gray-500 group-hover:text-gray-700 dark:text-gray-400`
  - Collision Repair: crossed wrench icon
  - Auto Body Work: car front-view icon
  - Auto Painting: spray gun icon
  - Insurance Claim: document with checkmark icon
- **Card title:** `text-sm md:text-[15px] font-bold mb-1.5`. Selected: `text-[#C62828]`. Unselected: `text-gray-900 dark:text-[#E0E0E0]`
- **Card description:** `text-xs md:text-[13px] leading-relaxed text-gray-500 dark:text-[#A0A0A0]`

#### Navigation Button

- **"Next" button:** `w-full h-12 mt-8 bg-[#C62828] hover:bg-[#B71C1C] active:bg-[#8E0000] text-white font-semibold text-base rounded-lg transition-colors duration-150 shadow-sm focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2`
- **Back button (steps 2+):** appears left of Next as `text-gray-500 hover:text-gray-700 font-medium`
- **Submit (final step):** same style as Next, label changes to "Submit Request"

#### Draft Indicator

- `text-center text-xs text-gray-400 mt-4` — "Draft auto-saved"

#### Step Transitions

- CSS slide animations: `slideInRight` (forward), `slideInLeft` (backward). 250ms exit, 350ms enter, `ease-out`. Disabled when `prefers-reduced-motion: reduce`.

#### Trust Bar (Below Form Card)

- Single row of 4 badges: I-CAR Gold Class, Lifetime Warranty, 4.7★ Reviews, 24/7 Towing. Mobile wraps to 2 rows. Centered, `gap-6`, muted styling.

#### File Structure

```
components/quote-form/
├── QuoteForm.tsx              # Orchestrator (useReducer state machine)
├── FormProgress.tsx           # Progress bar + step dots
├── FormNavigation.tsx         # Back / Next / Submit buttons
├── QuoteConfirmation.tsx      # Success screen
├── steps/
│   ├── ServiceStep.tsx        # 4-col card selection grid
│   ├── VehicleStep.tsx        # Make, model, year, VIN
│   ├── DamageStep.tsx         # Severity + description
│   └── ContactStep.tsx        # Name, email, phone, zip
└── hooks/
    ├── useQuoteForm.ts        # useReducer state + localStorage persistence
    └── useSubmitQuote.ts      # TanStack Query mutation → POST /api/quote
```

### 8. WarrantySection

- **Layout:** `grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center`
- **Left:** H2 "Limited Lifetime Warranty" (italic, underlined accent), bold "100% Satisfaction Guaranteed", two lines of supporting copy
- **Right:** Cluster of 3 trust badges/seals (Carwise logo, Prestige seal, "LIFETIME GUARANTEE 100%" badge) arranged horizontally

### 9. TestimonialCard

- **Card:** `bg-white dark:bg-[#252525] rounded-lg p-6 shadow-sm border border-[--border]`
- **Content:** Large decorative `"` quotation marks (red), review text (italic), 5-star rating row (red stars), reviewer name (bold), reviewer location (small, secondary text)
- **Layout:** `grid grid-cols-1 md:grid-cols-3 gap-6` or carousel with prev/next arrows
- **Carousel controls:** Circular arrow buttons, `w-10 h-10 rounded-full border border-[--border] flex items-center justify-center`

### 10. CTABanner

- **Layout:** `bg-[#C62828] text-white text-center py-12`
- **Content:** H2 "Ready to Get Your Car Fixed?", subtitle paragraph, two buttons side-by-side:
  - "Get a Quote" — `bg-white text-[#C62828] border border-white hover:bg-gray-100 px-8 h-12 rounded-lg font-semibold`
  - "(301) 578-8779" — `border-2 border-white text-white hover:bg-white/10 px-8 h-12 rounded-lg font-semibold` (tel: link)

### 11. Footer

- **Layout:** `bg-[#1A1A1A] dark:bg-[#0A0A0A] text-gray-300 py-12`
- **Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`
  - **Col 1:** Business name (Big Shoulders, uppercase), address, phone (`tel:`), fax, email (`mailto:`)
  - **Col 2:** "Quick Links" — Collision Repair, Auto Body Services, Paint Solutions, Insurance Claims, Get a Quote, About Us. Links `text-gray-400 hover:text-white`
  - **Col 3:** "Business Hours" — Mon–Fri 8AM–6PM, Sat 8AM–12PM, Sun Closed
  - **Col 4:** "Find Us" — Embedded Google Map (`rounded-lg overflow-hidden h-40`). Dark mode: dark map tiles via Google Maps Styling API.
- **Bottom bar:** `border-t border-gray-700 mt-8 pt-6 flex justify-between text-xs text-gray-500`
  - Left: © 2026 Prestige Auto Body, Inc. All Rights Reserved.
  - Right: Privacy Policy | Terms of Service | Sitemap

### 12. Shared Button Variants

| Variant    | Classes                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Primary    | `bg-[#C62828] hover:bg-[#B71C1C] text-white px-6 h-12 rounded-lg font-semibold transition-colors`                                   |
| Secondary  | `border-2 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white px-6 h-12 rounded-lg font-semibold transition-colors` |
| Ghost/Link | `text-[#C62828] hover:underline font-medium`                                                                                        |
| Inverted   | `bg-white text-[#C62828] hover:bg-gray-100 px-6 h-12 rounded-lg font-semibold`                                                      |

### 13. Service Subpage Template (Collision Repair, Auto Body, Paint, Insurance)

Single dynamic component powered by Payload CMS slug. Shared layout:

```
Breadcrumb → Hero (H1 + description + CTA buttons + hero image)
→ "What We Offer" (2-col grid of checkmark items)
→ "Service Areas" (horizontal chip list of Montgomery County cities)
→ Testimonial (single highlighted review)
→ CTABanner
→ Footer
```

### 14. Service Area Template (`/areas/[city]`)

Same as service subpage but with city-specific H1, localized intro copy, stats bar, "Other Areas We Serve" link list, and city-specific CTA.

---

## Interaction Logic & State Management

### Dark Mode

- **Strategy:** `darkMode: 'class'` in Tailwind config
- **Persistence:** Cookie `NEXT_LOCALE_THEME` + `localStorage` fallback
- **SSR FOUC prevention:** Read cookie in Next.js middleware → inject `class="dark"` on `<html>` before hydration
- **Toggle cycle:** Light → Dark → System → Light. Tooltip shows current mode. `aria-live` region announces change.
- **Transition:** `transition-colors duration-200` on `html` element

### Language Switcher (i18n)

- **Library:** `next-intl` with App Router integration
- **Routes:** `/en/*` and `/es/*` with locale-prefixed routing
- **Switching:** Navigates to equivalent route in other locale. Preserves scroll position and form state. Uses `<a>` links (not JS-only) for crawlability.
- **Detection:** First visit reads `Accept-Language` header → sets `NEXT_LOCALE` cookie
- **Strings:** `messages/en.json`, `messages/es.json` — all user-facing text externalized

### QuoteForm State

- **State management:** `useReducer` in `hooks/useQuoteForm.ts`
- **Draft persistence:** Save to `localStorage` on each step change; hydrate on mount
- **Submission:** TanStack Query mutation in `hooks/useSubmitQuote.ts` → `POST /api/quote` with zod validation
- **Step navigation:** Forward requires validation pass. Backward always allowed. Cannot skip ahead. Clicking completed step navigates back.
- **Language switch mid-form:** Form state persisted independently of locale; UI re-renders in new language without data loss.
- **Analytics:** GA4 events: `quote_form_start`, `quote_form_step`, `quote_form_abandon`, `quote_form_submit`, `quote_form_error`

### Scroll Behaviors

- Header "Get a Quote" CTA: smooth-scroll to `#get-a-quote` section on homepage, or navigate to `/get-a-quote` on other pages
- "See our work" link in hero: smooth-scroll to services or gallery section
- Mobile click-to-call: `<a href="tel:3015788779">` triggers native phone dialer

### Responsive Behaviors

- **Navigation:** Full horizontal nav at `≥lg`. Hamburger drawer at `<lg`.
- **Stats bar:** 2×2 grid at `<lg`, 4-col at `≥lg`
- **Service cards:** 1-col at `<sm`, 2-col at `sm`, 4-col at `lg`
- **Hero mini-form:** Horizontal row at `≥md`, stacked at `<md`
- **Testimonials:** Single card with arrows at `<md`, 3-card grid at `≥md`
- **Footer:** 1-col at `<sm`, 2-col at `sm`, 4-col at `lg`
- **QuoteForm progress:** Labels visible at `≥sm`, circles-only at `<sm`

---

## Implementation Steps

### Phase 1 — Project Scaffold

1. `npx create-next-app@latest --typescript --tailwind --app`
2. Configure `tailwind.config.ts`: `darkMode: 'class'`, extend colors with token values, add `font-display` and `font-sans` families
3. Install dependencies: `next-intl`, `@tanstack/react-query`, `zod`
4. Set up `/messages/en.json` and `/messages/es.json` with all string keys
5. Configure `next-intl` middleware for `/en` and `/es` locale routing
6. Create `middleware.ts` for dark mode cookie → `<html class="dark">` injection

### Phase 2 — Global Components

7. Build `UtilityBar` component
8. Build `Header` with nav links, phone, CTA, language toggle, dark mode toggle, mobile drawer
9. Build `Footer` with 4-column grid + bottom bar
10. Build shared `Button` component with Primary / Secondary / Ghost / Inverted variants
11. Create `layout.tsx` composing UtilityBar + Header + `<main>` + Footer

### Phase 3 — Homepage Sections

12. `HeroSection` with background image, overlay, H1, mini-form, "See our work"
13. `StatsBar` with 4-stat grid
14. `ServicesSection` with dark bg + 4 `ServiceCard` instances
15. `WhyPrestige` with checklist + YouTube embed
16. `QuoteFormSection` — implement all 5 steps per form spec, progress indicator, trust bar
17. `WarrantySection` with trust badge cluster
18. `TestimonialsSection` with 3-card carousel
19. `CTABanner` with dual buttons

### Phase 4 — Subpages

20. Service subpage dynamic template (`/[locale]/[service-slug]`)
21. Service area template (`/[locale]/areas/[city]`)
22. About Us page
23. Contact page (full info + Google Map + link to quote form)
24. Get a Quote standalone page (full-page QuoteForm)
25. Blog index + `[slug]` dynamic pages

### Phase 5 — CMS & Data

26. Configure Payload CMS 3.0 collections: pages, services, testimonials, quote-requests, blog-posts, service-areas
27. Build TanStack Query hooks for data fetching
28. Implement `/api/quote` route handler with zod, rate limiting, honeypot spam protection
29. Populate CMS with migrated content (EN + ES)

### Phase 6 — Polish & Deploy

30. Structured data (JSON-LD): LocalBusiness, Service, FAQPage, BreadcrumbList per locale
31. 301 redirect map from all WordPress URLs
32. Lighthouse audit ≥ 90 in both modes
33. WCAG 2.1 AA contrast audit (≥ 4.5:1 all text in both modes)
34. Cross-browser testing: Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome
35. Screen reader testing: VoiceOver, NVDA
36. Deploy to Vercel with custom domain + sitemap submission

---

## Performance Budget

| Metric                 | Target      |
| ---------------------- | ----------- |
| TTFB                   | < 200ms     |
| Total page weight      | < 500KB     |
| LCP                    | < 2.5s      |
| FID                    | < 100ms     |
| CLS                    | < 0.1       |
| QuoteForm bundle       | < 15KB gzip |
| Lighthouse Performance | ≥ 90        |

---

## File Structure Reference

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage
│   │   ├── collision-repair/page.tsx
│   │   ├── auto-body-services/page.tsx
│   │   ├── paint-solutions/page.tsx
│   │   ├── insurance/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── get-a-quote/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── areas/
│   │       └── [city]/page.tsx
│   └── api/
│       └── quote/route.ts
├── components/
│   ├── layout/
│   │   ├── UtilityBar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileDrawer.tsx
│   │   ├── Footer.tsx
│   │   └── CTABanner.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── StatItem.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── TrustBadge.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── WhyPrestige.tsx
│   │   ├── WarrantySection.tsx
│   │   └── TestimonialsSection.tsx
│   └── quote-form/
│       ├── QuoteForm.tsx
│       ├── FormProgress.tsx
│       ├── FormNavigation.tsx
│       ├── QuoteConfirmation.tsx
│       ├── steps/
│       │   ├── ServiceStep.tsx
│       │   ├── VehicleStep.tsx
│       │   ├── DamageStep.tsx
│       │   ├── ContactStep.tsx
│       │   └── ScheduleStep.tsx
│       └── hooks/
│           ├── useQuoteForm.ts
│           └── useSubmitQuote.ts
├── lib/
│   ├── theme.ts                       # Dark mode cookie logic
│   └── analytics.ts                   # GA4 event helpers
├── messages/
│   ├── en.json
│   └── es.json
└── middleware.ts                       # Locale + dark mode SSR
```

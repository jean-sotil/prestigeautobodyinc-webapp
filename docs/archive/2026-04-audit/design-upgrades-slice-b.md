# Design Upgrade Guide — Prestige Auto Body, Inc.

### v2 — Tailwind v4 · Slice B Scope

> Companion to `DESIGN.md`.  
> **Scope of this document:** PR 1 (tokens) + PR 2 (ServiceCard) + PR 3 (SectionHeading).  
> Slice C work (hero, header scroll, diagonal clips, scroll-reveal, stat counter) is documented in the
> [Appendix](#appendix-slice-c-next-pr) — do not implement until Slice B is merged and QA'd.

---

## What Changed From v1

| v1 issue                                                                | Resolution                                                            |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Used `tailwind.config.ts` (Tailwind v3 API)                             | Replaced with `@theme` block additions in `globals.css` (Tailwind v4) |
| Added `--surface-*`, `--red-primary` etc. as a parallel token namespace | Extends existing `--background`, `--card`, `--primary` tokens instead |
| Section 6 — i18n quote form fix                                         | Already shipped in `b2860a8` — removed                                |
| Duplicate `prefers-reduced-motion` block                                | Already in `globals.css:150-159` and `:261-275` — removed             |
| Section 7 — Tailwind Config Diff                                        | Doesn't apply to v4 — removed entirely                                |
| Arbitrary values throughout                                             | See [Arbitrary Value Resolution](#arbitrary-value-resolution) below   |

---

## Arbitrary Value Resolution

Resolve these before writing any component class name.

| v1 wrote                  | Problem                    | Use instead                                                  |
| ------------------------- | -------------------------- | ------------------------------------------------------------ |
| `bg-[--red-surface]`      | CSS-var lookup = arbitrary | Define `--color-red-surface` in `@theme` → `bg-red-surface`  |
| `border-l-[3px]`          | px value                   | `border-l-4` (4px — 1px diff is imperceptible at this size)  |
| `text-[10px]`             | px value                   | `text-xs` (12px) — snap to scale                             |
| `[animation-delay:200ms]` | Property syntax            | `delay-200` (Tailwind v4 built-in)                           |
| `bg-red-primary/[0.04]`   | Precise opacity            | `bg-red-surface` token (12% α) or `bg-primary/5`             |
| `tracking-[-0.025em]`     | em value                   | Define `--tracking-display` in `@theme` → `tracking-display` |
| `clip-path: polygon(...)` | No Tailwind equivalent     | CSS utility class in `globals.css` — correct, keep as-is     |
| `min-h-[420px]`           | px value                   | `min-h-105` (Tailwind v4 spacing scale, 420px)               |

---

## PR 1 — Token Additions to `globals.css`

**Rule:** Only add tokens that are reused across ≥ 2 components. One-off values snap to the existing scale.

### 1.1 Extend the existing `@theme` block

Find the existing `@theme inline { … }` block in `globals.css` and **add the following inside it**.  
Do not create a second `@theme` block — there should only be one.

```css
/* globals.css — ADD INSIDE the existing @theme inline { } block */

/* Red tonal ramp — complements existing --primary (#C62828) */
--color-red-pressed: #b71c1c;
--color-red-hover: #e53935;
--color-red-muted: #ef9a9a;
--color-red-surface: color-mix(in srgb, #c62828 12%, transparent);
--color-red-border: color-mix(in srgb, #c62828 30%, transparent);

/* Chrome steel — secondary text, icon borders, dividers */
--color-steel-chrome: #78909c;
--color-steel-silver: #b0bec5;

/* Gold — ONLY for I-CAR Gold Class / Lifetime Warranty badge text */
--color-gold-badge: #c9a84c;

/* Letter-spacing scale */
--tracking-display: -0.025em;
--tracking-wide: 0.08em;
--tracking-wider: 0.12em;

/* Animation shorthands */
--animate-slide-up: slide-up 0.5s ease-out both;
--animate-slide-in-left: slide-in-left 0.6s ease-out both;
--animate-ken-burns: ken-burns 8s ease-in-out infinite alternate;
--animate-shimmer: shimmer 0.6s ease-out;
--animate-fade-in-up: fade-in-up 0.4s ease-out both;
```

After this addition the following Tailwind utilities become available with no arbitrary syntax:

```
bg-red-surface       text-red-hover       border-red-border
bg-red-pressed       text-red-muted       text-steel-silver
text-steel-chrome    text-gold-badge      bg-gold-badge
tracking-display     tracking-wide        tracking-wider
animate-slide-up     animate-shimmer      animate-ken-burns
animate-slide-in-left               animate-fade-in-up
```

### 1.2 Add keyframes

Find the last `@keyframes` block in `globals.css`. Append **below** it.  
Check first: if a `@media (prefers-reduced-motion: no-preference)` wrapper already exists, add the new keyframes inside it. Do not nest a second wrapper.

```css
/* globals.css — APPEND after existing @keyframes blocks */

@media (prefers-reduced-motion: no-preference) {
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes shimmer {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(250%);
    }
  }

  @keyframes ken-burns {
    from {
      transform: scale(1.05);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

### 1.3 Add utility classes

Append at the **very bottom** of `globals.css`, after all existing rules.

```css
/* ─── Design Upgrade v2 utilities ────────────────────────────── */

/* Overline — eyebrow text above section headings */
.overline {
  font-family: var(--font-sans);
  font-size: 0.625rem; /* 10px intentional — below text-xs; used only here */
  font-weight: 600;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-red-hover);
  display: block;
  margin-bottom: 0.5rem;
}

/* Nav link — slide-in underline on hover / active */
.nav-link {
  position: relative;
  transition: color 150ms ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: var(--color-red-pressed);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms ease-out;
}
.nav-link:hover::after,
.nav-link[aria-current='page']::after {
  transform: scaleX(1);
}

/* Carbon fiber texture — opt-in, used in ServicesSection + WarrantySection (Slice C) */
.carbon-texture {
  position: relative;
}
.carbon-texture::before {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      rgba(255, 255, 255, 0.022) 2px,
      rgba(255, 255, 255, 0.022) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 2px,
      rgba(255, 255, 255, 0.022) 2px,
      rgba(255, 255, 255, 0.022) 4px
    );
  z-index: 0;
}
.carbon-texture > * {
  position: relative;
  z-index: 1;
}
```

### 1.4 Existing tokens — do not create duplicates

These use cases are already covered. Use these utilities as-is everywhere in the codebase:

| Use case            | Use this utility              | Existing token                  |
| ------------------- | ----------------------------- | ------------------------------- |
| Page background     | `bg-background`               | `--background` → `#121212` dark |
| Card surface        | `bg-card`                     | `--card` → `#252525` dark       |
| Section background  | `bg-muted`                    | `--muted` → `#1E1E1E` dark      |
| Primary text        | `text-foreground`             | `--foreground` → `#E0E0E0` dark |
| Secondary text      | `text-muted-foreground`       | `--muted-foreground` dark       |
| Red CTA / accent    | `bg-primary` / `text-primary` | `--primary` → `#C62828`         |
| Borders             | `border-border`               | `--border` dark                 |
| Error / destructive | `text-destructive`            | `--destructive`                 |

---

## PR 2 — ServiceCard Refactor

**File:** `src/components/ui/ServiceCard.tsx`  
**Change:** Left border accent + subtle red bloom overlay. Replaces the current `border-2 border-[#C62828]` full-border treatment.

```tsx
// src/components/ui/ServiceCard.tsx
import Link from 'next/link';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

export function ServiceCard({
  icon,
  title,
  description,
  href,
  linkLabel,
}: ServiceCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-xl
        bg-card
        border border-border border-l-4 border-l-primary
        p-5 md:p-6
        transition-all duration-200 ease-out
        hover:border-l-red-hover
        hover:-translate-y-0.5
        hover:bg-muted
      "
    >
      {/* Red gradient bloom — decorative */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-surface to-transparent"
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="
          relative mb-4 flex h-10 w-10 items-center justify-center rounded-lg
          bg-red-surface border border-red-border
          text-red-hover
          transition-colors duration-200
          group-hover:bg-primary/20
        "
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="relative font-display text-lg font-bold tracking-display text-foreground mb-1.5">
        {title}
      </h3>

      {/* Description */}
      <p className="relative text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {description}
      </p>

      {/* Link */}
      <Link
        href={href}
        className="
          relative mt-4 inline-flex items-center gap-1.5
          text-xs font-semibold tracking-wider uppercase
          text-red-hover transition-colors hover:text-red-muted
        "
      >
        {linkLabel}
        <span
          className="transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    </div>
  );
}
```

**Token mapping — every class accounted for:**

| Class                                          | Source                                              |
| ---------------------------------------------- | --------------------------------------------------- |
| `bg-card`, `bg-muted`, `border-border`         | Existing tokens — no change                         |
| `bg-primary`, `text-primary`                   | Existing `--primary`                                |
| `border-l-primary`, `hover:border-l-red-hover` | `--primary` (existing) + `--color-red-hover` (PR 1) |
| `bg-red-surface`, `border-red-border`          | PR 1 tokens                                         |
| `text-red-hover`, `hover:text-red-muted`       | PR 1 tokens                                         |
| `tracking-display`                             | PR 1 token                                          |
| `text-foreground`, `text-muted-foreground`     | Existing tokens                                     |
| `line-clamp-3`                                 | Tailwind v4 built-in (no plugin needed)             |

---

## PR 3 — SectionHeading Component

**File:** `src/components/ui/SectionHeading.tsx` _(new file)_  
**Purpose:** Replaces the ~10 scattered `<h2> + w-16 h-1 bg-[#C62828] rounded-full mb-8` patterns across the homepage and service pages.

```tsx
// src/components/ui/SectionHeading.tsx

interface SectionHeadingProps {
  /** Small uppercase label above the heading — uses .overline CSS class */
  overline?: string;
  /** Heading content — can include <span className="text-primary"> for accent word */
  heading: React.ReactNode;
  /** Center-align — default false */
  centered?: boolean;
  /** Heading level — defaults to h2 */
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({
  overline,
  heading,
  centered = false,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {overline && (
        <span className="overline" aria-hidden="true">
          {overline}
        </span>
      )}

      <Tag className="font-display text-3xl md:text-4xl font-extrabold tracking-display text-foreground mb-4">
        {heading}
      </Tag>

      {/* Asymmetric accent bar — replaces plain w-16 h-1 */}
      <div
        className={`flex items-center gap-1.5 mb-8 ${centered ? 'justify-center' : ''}`}
        aria-hidden="true"
      >
        <span className="block h-[3px] w-10 rounded-full bg-primary" />
        <span className="block h-[3px] w-3 rounded-full bg-primary/40" />
        <span className="block h-[3px] w-1.5 rounded-full bg-primary/20" />
      </div>
    </div>
  );
}
```

> **Note on `h-[3px]`:** This is an intentional arbitrary value. Tailwind's `h-px` is 1px and `h-0.5` is 2px — neither is close to 3px. Adding a `--spacing-0.75` token for a single decorative element would be over-engineering. This is the one acceptable arbitrary value in Slice B.

### 3.1 Usage — replacing existing patterns

```tsx
// Before (in each section):
<h2 className="font-display text-4xl font-extrabold">Nuestros Servicios</h2>
<div className="w-16 h-1 bg-[#C62828] rounded-full mb-8" />

// After:
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useTranslations } from 'next-intl'

const t = useTranslations('overlines')

<SectionHeading
  overline={t('services')}
  heading={<>Nuestros <span className="text-primary">Servicios</span></>}
/>

// Centered variant (TestimonialsSection):
<SectionHeading
  overline={t('testimonials')}
  heading={t('testimonialsHeading')}
  centered
/>
```

### 3.2 Sections to update

| Component                 | Current heading                 | Overline key             |
| ------------------------- | ------------------------------- | ------------------------ |
| `ServicesSection.tsx`     | "Nuestros Servicios"            | `overlines.services`     |
| `WhyPrestige.tsx`         | "¿Por Qué Elegir Prestige?"     | `overlines.whyUs`        |
| `TestimonialsSection.tsx` | "Testimonios de Clientes"       | `overlines.testimonials` |
| `WarrantySection.tsx`     | "Garantía Limitada de Por Vida" | `overlines.warranty`     |

### 3.3 Add overline strings to message files

```json
// messages/en.json — add at root level
"overlines": {
  "services":     "What We Do",
  "whyUs":        "Our Difference",
  "testimonials": "Reviews",
  "warranty":     "Our Promise"
}

// messages/es.json — add at root level
"overlines": {
  "services":     "Lo Que Hacemos",
  "whyUs":        "Nuestra Diferencia",
  "testimonials": "Reseñas",
  "warranty":     "Nuestro Compromiso"
}
```

---

## Implementation Checklist — Slice B

### PR 1 — Tokens (no visual change)

- [ ] Locate `@theme inline { }` block in `globals.css`
- [ ] Add red ramp, steel, gold, tracking, animation tokens **inside** that block
- [ ] Locate last `@keyframes` block — append 5 new keyframes below it, inside `prefers-reduced-motion: no-preference` (check if wrapper already exists before adding one)
- [ ] Append `.overline`, `.nav-link`, `.carbon-texture` at bottom of `globals.css`
- [ ] Smoke test: confirm `bg-red-surface`, `text-steel-silver`, `tracking-display`, `animate-slide-up` resolve without errors in a test component

### PR 2 — ServiceCard

- [ ] Replace full content of `ServiceCard.tsx` with the component above
- [ ] Verify `border-l-4` visual — check against design on screen, compare to the old `border-2` full border
- [ ] Verify bloom gradient `from-red-surface` is visible in dark mode, invisible or negligible in light mode
- [ ] Mobile: card grid layout correct at all breakpoints (1-col → 2-col → 4-col)
- [ ] Keyboard: `group-hover` states don't interfere with `focus-visible` ring
- [ ] `line-clamp-3` works without any plugin (confirm with a long description string)

### PR 3 — SectionHeading

- [ ] Create `src/components/ui/SectionHeading.tsx`
- [ ] Add `overlines` key to `messages/en.json` and `messages/es.json`
- [ ] Replace heading + underline in `ServicesSection`, `WhyPrestige`, `TestimonialsSection`, `WarrantySection`
- [ ] Confirm `aria-hidden="true"` on `.overline` span and accent bar (decorative)
- [ ] Confirm heading level is `h2` in all four sections
- [ ] Visual QA: check left-aligned and centered variants side by side

---

## Appendix: Slice C — Next PR

> **Do not implement until Slice B is merged, pushed, and visually QA'd.**

### C1 — Hero gradient + Ken Burns + entrance animation

- Replace `bg-black/50` overlay with 4-stop directional gradient:
  ```css
  /* inline style on the overlay div */
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.88) 0%,
    rgba(0, 0, 0, 0.65) 45%,
    rgba(198, 40, 40, 0.12) 75%,
    transparent 100%
  );
  ```
- Add `animate-ken-burns` to the hero `<Image>` element
- Stagger hero content with `animate-slide-in-left delay-200`, `delay-[350ms]`, `delay-500`
  - The `delay-[350ms]` here is the one case where arbitrary is unavoidable — Tailwind v4 has `delay-300` and `delay-500` but no `delay-350`

### C2 — Header glassmorphism on scroll

- Add `useEffect` scroll listener in `Header.tsx` — toggle `scrolled` boolean state
- Conditionally apply `bg-background/90 backdrop-blur-md` vs `bg-background`
- Test `backdrop-blur-md` in Safari — can cause subpixel repaint issues on sticky elements

### C3 — Scroll-reveal + animated stat counter

**Hook: `src/hooks/useScrollReveal.ts`**

```ts
'use client';
import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}
```

**Hook: `src/hooks/useCountUp.ts`**

```ts
'use client';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}
```

**StatItem update** — requires splitting the current `value: string` prop into `numericValue: number` + `suffix: string`:

```tsx
<span className="font-display text-5xl font-extrabold leading-none bg-gradient-to-br from-red-hover to-primary bg-clip-text text-transparent">
  {count}
  {suffix}
</span>
```

**ServicesSection stagger** — wrap section ref + stagger cards:

```tsx
'use client'
// Stagger: each card delays 60ms per index
style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
className="opacity-0 [[data-visible=true]_&]:animate-slide-up"
```

### C4 — Diagonal section breaks

- Add `.clip-bottom` and `.clip-top` to `globals.css`
- Apply at `StatsBar` → `ServicesSection` boundary
- **iOS Safari:** always provide `-webkit-clip-path` alongside `clip-path` — use inline `style` prop:
  ```tsx
  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)', WebkitClipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)' }}
  ```
- Test on physical iOS device before merging

### C5 — Carbon fiber texture activation

- `.carbon-texture` class is already added in PR 1
- In Slice C: add `carbon-texture` className to the section wrapper in `ServicesSection.tsx` and `WarrantySection.tsx`

---

_Last updated: April 2026 — Design Upgrade v2.0 (Tailwind v4 · Slice B)_

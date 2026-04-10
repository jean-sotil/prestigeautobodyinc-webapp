# Task: Build UtilityBar + Header Components

## Context

We're building the Prestige Auto Body website with Next.js 15 (App Router), TypeScript, Tailwind CSS, and `next-intl` for EN/ES i18n. shadcn/ui is already installed. Fonts "Big Shoulders Display" (display headings) and "Instrument Sans" (body/nav) are configured in Tailwind as `font-display` and `font-sans`.

## What to Build

A two-row sticky header: a slim **UtilityBar** on top, and the main **Header** (logo + nav + actions) below it.

---

## 1. UtilityBar (`components/layout/utility-bar.tsx`)

- **Height:** `h-10`, sticky `top-0 z-50`
- **Background:** `bg-[#2D2D2D] dark:bg-[#0A0A0A]`, white text, `text-xs font-sans`
- **Left:** "928 Philadelphia Ave, Silver Spring, MD 20910"
- **Right:** "Mon–Fri: 8AM–6PM | Sat: 8AM–12PM"
- **Responsive:** Hidden below `md` breakpoint
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, flex justify-between items-center

## 2. Header (`components/layout/header.tsx`)

- **Height:** `h-16`, sticky `top-10 z-40` (sits below UtilityBar). When UtilityBar is hidden on mobile, sticky `top-0`.
- **Background:** `bg-white dark:bg-[#121212]`, add `shadow-sm`, upgrade to `shadow-md` on scroll (use `useEffect` + scroll listener or IntersectionObserver)
- **Container:** same `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, flex items-center justify-between

### Left — Logo

- Prestige "P" logo image + "PRESTIGE AUTO BODY, INC." text
- Link wraps to `/{locale}/` (homepage)
- Give it breathing room — don't cram tagline text here

### Center — Navigation Links (desktop only, `hidden lg:flex`)

- Links: `Collision Repair`, `Auto Body Services`, `Paint Solutions`, `Insurance`, `About Us`, `Contact`
- Style: `font-sans text-sm font-medium text-[#2D2D2D] dark:text-[#E0E0E0]`
- Hover: `text-[#C62828]`
- Active (current route): `text-[#C62828] border-b-2 border-[#C62828]`
- Use `usePathname()` from `next/navigation` to detect active link
- Each link points to `/{locale}/{slug}`

### Right — Actions cluster

All items in a flex row with `gap-3 items-center`:

1. **Phone number** (hidden below `lg`): `(301) 578-8779` as a `tel:` link. Bold, `font-sans text-sm font-semibold`. Below it in smaller text: "Call for free estimate"
2. **"Get a Quote" CTA button**: Use shadcn `Button` component. `bg-[#C62828] hover:bg-[#B71C1C] text-white font-sans font-semibold text-sm px-5 py-2 rounded-md`. Links to `/{locale}/get-a-quote`.
3. **Language toggle**: Compact `EN | ES` toggle. Clicking switches locale via `next-intl`'s routing (navigate to equivalent path in other locale). Use shadcn `Button` variant="ghost" or a simple styled toggle.
4. **Dark mode toggle** (optional, lower priority): Sun/moon icon cycling Light → Dark → System. Use `localStorage` + cookie for persistence.

### Mobile (`< lg`) — Hamburger Menu

- Show a hamburger icon button on the right (use `lucide-react` `Menu` / `X` icons)
- Use shadcn `Sheet` component (side="right") for the slide-out drawer
- Drawer contains: all 6 nav links (stacked), phone number as click-to-call, "Get a Quote" button (full width), language toggle, dark mode toggle
- Close on link click or outside tap

---

## Brand Tokens Reference

```
Prestige Red:     #C62828 (CTA buttons, active nav, accents — same in light & dark)
Red hover:        #B71C1C
Light bg:         #FFFFFF / Dark bg: #121212
Text primary:     #2D2D2D / #E0E0E0
Text secondary:   #555555 / #A0A0A0
Border:           #CCCCCC / #333333
Utility bar bg:   #2D2D2D / #0A0A0A
```

## shadcn Components to Use

- `Button` — for CTA and ghost buttons
- `Sheet` + `SheetTrigger` + `SheetContent` — for mobile hamburger drawer
- `Separator` — if needed between drawer sections

## File Structure

```
components/
  layout/
    utility-bar.tsx
    header.tsx
    mobile-nav.tsx       # Sheet drawer extracted for cleanliness
    nav-links.tsx        # Shared link list used by both desktop and mobile
```

## Key Requirements

- Fully responsive: horizontal nav at `≥lg`, hamburger drawer at `<lg`
- Dark mode compatible using Tailwind `dark:` variants
- i18n-ready: all visible strings should use `useTranslations()` from `next-intl`
- Semantic HTML: `<header>`, `<nav>`, proper `aria-labels`
- `tel:` link on phone number for mobile click-to-call
- No FOUC on dark mode: theme class is injected server-side via cookie (assume this middleware already exists)

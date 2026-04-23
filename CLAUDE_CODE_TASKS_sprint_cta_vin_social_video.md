# Claude Code Sprint — CTA Copy, VIN Field, Footer Socials & Hero Video

> **Project:** Prestige Auto Body — Next.js 15 / Payload CMS 3.0 / Tailwind CSS v4 / next-intl (EN + ES)
> **File:** `CLAUDE_CODE_TASKS_sprint_cta_vin_social_video.md`
> **Scope:** 4 discrete, independently shippable tasks. Complete them in order to avoid merge conflicts.

---

## Preflight — Read Before Touching Any File

- All design tokens live in `globals.css` under `@theme inline`. **Do not create or edit `tailwind.config.ts`.**
- All user-facing strings must exist in **both** `messages/en.json` and `messages/es.json`. Never hardcode copy into JSX.
- The Payload CMS schema lives in `collections/QuoteRequests.ts`. After any schema change, verify the admin panel compiles without errors (`pnpm dev` and open `/admin`).
- The `vehicle` data in the quote form is collected in `components/quote-form/steps/VehicleStep.tsx` and typed in `hooks/useQuoteForm.ts`. The API payload shape is validated by the Zod schema in `app/api/quote/route.ts`.
- Brand constants: Red `#C62828`, dark bg `#121212`, card surface `#252525`. Use CSS variables (`var(--color-primary)` etc.) where they already exist.

---

## Task 1 — Replace "Free Estimate" CTAs with "Get a Free Quote"

### Rationale

"Get a Free Quote" better aligns with the page route `/get-a-quote`, reinforces the form's conversion action, and matches higher-volume search queries in the Silver Spring collision repair market ("free quote" outperforms "free estimate" in local SEM data).

### Target string pattern

Search **project-wide** (including JSON message files, JSX/TSX, and any CMS seed data) for the following and replace with the mapping below. Use case-insensitive matching.

| Found text (case-insensitive)                  | Replace with                           |
| ---------------------------------------------- | -------------------------------------- |
| `Get a Free Estimate`                          | `Get a Free Quote`                     |
| `Free Estimate` (standalone CTA label)         | `Get a Free Quote`                     |
| `Call for free estimate` (header sub-label)    | `Call for a free quote`                |
| `Free estimates` (short badge/tagline context) | `Free quotes`                          |
| `Free estimates · All insurance accepted`      | `Free quotes · All insurance accepted` |
| `get-a-free-estimate` (any slug/key)           | `get-a-free-quote`                     |

### Files most likely affected

- `messages/en.json` — all `header.*`, `hero.*`, `ctaBanner.*`, `servicePages.*` keys
- `messages/es.json` — corresponding Spanish strings; use these Spanish equivalents:
  - `"Get a Free Quote"` → `"Obtener Cotización Gratis"`
  - `"Call for a free quote"` → `"Llama para una cotización gratis"`
  - `"Free quotes"` → `"Cotizaciones gratis"`
- `components/Header.tsx` (sub-label beneath phone number)
- `components/HeroSection.tsx` (mini-form CTA button)
- `components/CTABanner.tsx`
- All service subpage templates / Payload CMS seed content
- Any `aria-label` or `title` attributes that reference "free estimate"

### Verification

After changes, run:

```bash
grep -ri "free estimate" src/ messages/ --include="*.ts" --include="*.tsx" --include="*.json"
```

The output should be **empty**. Fix any remaining occurrences.

---

## Task 2 — Add Optional VIN Field to Quote Form + CMS Collection

### Overview

Add a **VIN (Vehicle Identification Number)** optional field to Step 2 (Vehicle step) of the multi-step quote form. Also update the Payload CMS `quote-requests` collection to store it. The field is optional — it improves quote accuracy but must never block submission.

### 2a — TypeScript form state (`hooks/useQuoteForm.ts`)

Add `vin` to the `QuoteFormData` interface inside the `vehicle` data grouping:

```typescript
// In QuoteFormData, alongside year / make / model:
vin?: string; // 17-char alphanumeric, optional
```

Add a corresponding `UPDATE_FIELD` action case if not already generic. The field should clear on `RESET`.

### 2b — VehicleStep UI (`components/quote-form/steps/VehicleStep.tsx`)

Add the VIN input **below the Year / Make / Model row**, separated by a subtle divider or extra spacing so it reads as a secondary "enhance your quote" block.

#### Input field spec

```
Label:       "VIN (optional — improves quote accuracy)"
Placeholder: "e.g. 1HGBH41JXMN109186"
Max length:  17
Pattern:     /^[A-HJ-NPR-Z0-9]{17}$/i  (standard VIN charset — no I, O, Q)
Input mode:  text, auto-capitalize: characters
```

**Validation (non-blocking):** If the user enters any value, validate format on blur. If invalid, show an inline warning in amber (not red): `"VIN should be 17 characters (letters and numbers). Leave blank to continue."` — do **not** prevent the Continue button from working. VIN is always optional.

#### VIN Helper UX ("Where do I find my VIN?")

Place a `<button type="button">` trigger link labelled **"Where do I find my VIN? →"** immediately below the input. This toggles an inline info panel (no modal) with:

1. **Three location illustrations** described as alt text (use simple SVG icons or next/image):
   - Dashboard / driver-side windshield base
   - Driver-side door jamb sticker
   - Vehicle registration / insurance card

2. **Animated GIF support:** Render an `<img>` tag pointing to `/public/images/vin-location.gif` if the file exists; otherwise fall back gracefully to the three static bullet items. Wrap in `<picture>` with a static JPEG fallback:

   ```tsx
   <picture>
     <source srcSet="/images/vin-location.gif" type="image/gif" />
     <img
       src="/images/vin-location-static.jpg"
       alt="VIN location on a vehicle — dashboard, door jamb, or registration card"
       width={480}
       height={270}
     />
   </picture>
   ```

   > **Note for the implementer:** The GIF/image assets do not exist yet. Render the `<picture>` element but also always show the three text bullet points as a fallback. The asset can be dropped in later without code changes.

3. **Panel animation:** CSS-only height transition (`max-height: 0 → 400px`, `overflow: hidden`, `transition: max-height 350ms ease-out`). No Framer Motion — keep within the QuoteForm performance budget.

4. **Accessibility:** Panel has `role="region"` and `aria-label="VIN location guide"`. Toggle button has `aria-expanded` state.

#### i18n keys to add in `messages/en.json`

```json
"quoteForm.step2.vinLabel": "VIN (optional — improves quote accuracy)",
"quoteForm.step2.vinPlaceholder": "e.g. 1HGBH41JXMN109186",
"quoteForm.step2.vinHelperTrigger": "Where do I find my VIN? →",
"quoteForm.step2.vinHelperTitle": "Your VIN is in 3 common places:",
"quoteForm.step2.vinHelperDashboard": "Driver's side dashboard (visible through windshield)",
"quoteForm.step2.vinHelperDoorJamb": "Driver's side door jamb sticker",
"quoteForm.step2.vinHelperRegistration": "Vehicle registration or insurance card",
"quoteForm.step2.vinWarning": "VIN should be 17 characters (letters and numbers). Leave blank to continue.",
"quoteForm.step2.vinImageAlt": "VIN location on a vehicle — dashboard, door jamb, or registration card"
```

Add equivalent Spanish keys in `messages/es.json`:

```json
"quoteForm.step2.vinLabel": "VIN (opcional — mejora la precisión de tu cotización)",
"quoteForm.step2.vinPlaceholder": "ej. 1HGBH41JXMN109186",
"quoteForm.step2.vinHelperTrigger": "¿Dónde encuentro mi VIN? →",
"quoteForm.step2.vinHelperTitle": "Tu VIN se encuentra en 3 lugares comunes:",
"quoteForm.step2.vinHelperDashboard": "Tablero del lado del conductor (visible a través del parabrisas)",
"quoteForm.step2.vinHelperDoorJamb": "Pegatina en el marco de la puerta del conductor",
"quoteForm.step2.vinHelperRegistration": "Tarjeta de registro o seguro del vehículo",
"quoteForm.step2.vinWarning": "El VIN debe tener 17 caracteres (letras y números). Puedes dejarlo en blanco para continuar.",
"quoteForm.step2.vinImageAlt": "Ubicación del VIN en el vehículo — tablero, marco de puerta o tarjeta de registro"
```

### 2c — API Zod schema (`app/api/quote/route.ts`)

Add `vin` as an optional field inside the `vehicle` object schema:

```typescript
vehicle: z.object({
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  make: z.string().min(1),
  model: z.string().min(1),
  vin: z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'Invalid VIN format')
    .optional()
    .or(z.literal('')), // allow empty string from form
}),
```

### 2d — Payload CMS collection (`collections/QuoteRequests.ts`)

Add `vin` inside the existing `vehicle` group field, **after** `model`:

```typescript
{ name: 'vin', type: 'text', label: 'VIN (optional)', admin: { description: '17-character Vehicle Identification Number' } },
```

### 2e — API payload mapping

In the route handler where the Payload document is created, map `vin`:

```typescript
vehicle: {
  year: Number(body.vehicle.year),
  make: body.vehicle.make,
  model: body.vehicle.model,
  vin: body.vehicle.vin || undefined, // omit if empty
},
```

### 2f — Confirmation screen / summary card

In `QuoteConfirmation.tsx`, if `vin` is present in the submitted data, display it in the vehicle summary row:

```
Vehicle: 2022 Honda Civic  ·  VIN: 1HGBH41JXMN109186
```

Only show the VIN segment when non-empty.

### Verification

- Submit the form without filling VIN → submission succeeds.
- Submit with a valid 17-char VIN → stored in Payload admin under Quote Requests → vehicle.vin.
- Submit with an invalid VIN (e.g. 5 chars) → amber inline warning appears, Continue still works.
- Confirmation card shows VIN when provided, hides when absent.

---

## Task 3 — Add Social Media Links to Main Footer

### Overview

Add a "Follow Us" social links row to the existing `Footer` component. Insert it into **Column 1** (business info column), directly below the email address and above the bottom bar, or as a standalone sub-section within Col 1 if space allows. On mobile (single column), it should appear at the bottom of the footer content, above the bottom bar.

### Social profiles

| Platform  | URL                                                      | Icon               |
| --------- | -------------------------------------------------------- | ------------------ |
| Instagram | `https://www.instagram.com/prestigeautobodyinc/`         | Instagram SVG icon |
| Facebook  | `https://www.facebook.com/prestigeautobodysilverspring/` | Facebook SVG icon  |
| YouTube   | `https://www.youtube.com/@prestigeautobodyinc649`        | YouTube SVG icon   |

### Implementation

#### Icon set

Use inline SVGs (not an icon library) so there are zero extra dependencies. Use the standard brand-accurate paths for each icon. Each icon should be `20px × 20px`, `fill="currentColor"`.

#### Link component spec

```tsx
// Social icon link — apply to all three
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={platformName} // e.g. "Follow Prestige Auto Body on Instagram"
  className="text-gray-400 hover:text-white transition-colors duration-200"
>
  <SocialIcon className="w-5 h-5" />
</a>
```

#### Layout in Col 1

```
[existing: name, address, phone, fax, email]

Follow Us        ← small uppercase label, text-xs text-gray-500 tracking-widest, mt-4 mb-2
[IG icon] [FB icon] [YT icon]   ← flex row, gap-3
```

#### i18n keys to add

```json
// messages/en.json
"footer.followUs": "Follow Us",
"footer.social.instagramAria": "Follow Prestige Auto Body on Instagram",
"footer.social.facebookAria": "Follow Prestige Auto Body on Facebook",
"footer.social.youtubeAria": "Watch Prestige Auto Body on YouTube"
```

```json
// messages/es.json
"footer.followUs": "Síguenos",
"footer.social.instagramAria": "Sigue a Prestige Auto Body en Instagram",
"footer.social.facebookAria": "Sigue a Prestige Auto Body en Facebook",
"footer.social.youtubeAria": "Mira Prestige Auto Body en YouTube"
```

#### Accessibility

- Each `<a>` must have a visible focus ring consistent with the site's focus style (outline `#C62828`).
- Icons must be `aria-hidden="true"` — all context is in the `aria-label` on the anchor.

### Verification

- All three icons render in the footer, correctly sized.
- Links open in a new tab, URLs are correct.
- `aria-label` values are present on each anchor (verify with DevTools → Accessibility panel).
- No new dependencies were added to `package.json`.

---

## Task 4 — Update Hero Section YouTube Video URL

### Overview

Replace the current YouTube embed in the `WhyPrestige` section (or wherever the homepage YouTube video is rendered) with the updated video.

### New video

```
https://www.youtube.com/watch?v=8DM-Ej56Xf8
```

YouTube embed URL: `https://www.youtube.com/embed/8DM-Ej56Xf8`

### Where to update

1. **`components/WhyPrestige.tsx`** (or equivalent component containing the YouTube `<iframe>`) — update the `src` of the `<iframe>`:

   ```tsx
   // Before (whatever the current video ID is)
   src = 'https://www.youtube.com/embed/OLD_VIDEO_ID';

   // After
   src = 'https://www.youtube.com/embed/8DM-Ej56Xf8';
   ```

   Preserve all existing iframe attributes (`allow`, `allowFullScreen`, `loading="lazy"`, `title`, etc.).

2. **`messages/en.json` / `messages/es.json`** — if the video URL or video ID is stored as a translation key or config constant, update it there instead of hardcoding in the component. Search for the old video ID string project-wide:

   ```bash
   grep -r "youtube" src/ messages/ public/ --include="*.ts" --include="*.tsx" --include="*.json" --include="*.env*"
   ```

3. **Payload CMS Site Settings** (if the video URL is managed as a CMS global field) — update the seed/fixture data or document the change so the client can update it via `/admin` if needed.

4. **Structured data / JSON-LD** — if any `VideoObject` schema references the old video URL, update it to:
   ```json
   {
     "@type": "VideoObject",
     "embedUrl": "https://www.youtube.com/embed/8DM-Ej56Xf8",
     "url": "https://www.youtube.com/watch?v=8DM-Ej56Xf8"
   }
   ```

### Privacy-enhanced embed (recommended)

Use the privacy-enhanced YouTube domain to avoid third-party cookies until the user interacts:

```
https://www.youtube-nocookie.com/embed/8DM-Ej56Xf8
```

### Verification

- Open the homepage in the browser. The `WhyPrestige` / video section loads the new video.
- Click play to confirm the correct video plays.
- Inspect the `<iframe src>` in DevTools and confirm the new video ID `8DM-Ej56Xf8`.
- No old video ID appears anywhere in the codebase (run the grep above).

---

## Final QA Checklist (run after all 4 tasks)

```bash
# 1. No "free estimate" strings remain
grep -ri "free estimate" src/ messages/ --include="*.ts" --include="*.tsx" --include="*.json"

# 2. Both locales have all new i18n keys (spot check)
node -e "
  const en = require('./messages/en.json');
  const es = require('./messages/es.json');
  const keys = ['quoteForm.step2.vinLabel','footer.followUs','footer.social.instagramAria'];
  keys.forEach(k => {
    const get = (obj, path) => path.split('.').reduce((o,p) => o?.[p], obj);
    console.log(k, '→ EN:', get(en,k), '| ES:', get(es,k));
  });
"

# 3. Old YouTube video ID is gone
grep -r "$(OLD_VIDEO_ID)" src/ messages/ public/

# 4. TypeScript compiles cleanly
pnpm tsc --noEmit

# 5. Dev server starts without errors
pnpm dev
```

Then manually verify in browser:

- [ ] Header CTA reads "Get a Free Quote" (EN) / "Obtener Cotización Gratis" (ES)
- [ ] Step 2 of the quote form shows the VIN field with helper toggle
- [ ] Footer shows Instagram, Facebook, and YouTube icons with correct links
- [ ] Homepage WhyPrestige section plays the correct new YouTube video
- [ ] Form submits successfully without VIN (optional field)
- [ ] Form submits successfully with a valid VIN (stored in Payload)

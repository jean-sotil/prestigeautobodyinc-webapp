# Claude Code — QuoteForm Implementation Instructions

## Context

You are building the multi-step lead generation form for **Prestige Auto Body, Inc.**, a collision repair shop in Silver Spring, MD. The form is the site's primary conversion mechanism. Read `DESIGN.md` (§7 — QuoteFormSection) as the visual source of truth. Read `Multi-Step_Lead_Gen_Form_Spec.md` for data schemas, validation rules, and API contracts.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS (`darkMode: 'class'`)
- TanStack Query v5 (`@tanstack/react-query`)
- `zod` for validation
- No external form library (useReducer only — the form is simple enough)

## What to Build

A 4-step multi-step quote request form with localStorage draft persistence, zod validation, TanStack Query submission, GA4 analytics hooks, and full dark mode + accessibility support.

---

## Step 0 — File Structure

Create this exact structure under `src/components/quote-form/`:

```
quote-form/
├── QuoteForm.tsx              # Orchestrator
├── FormProgress.tsx           # Progress bar + step dots
├── FormNavigation.tsx         # Back / Next / Submit
├── QuoteConfirmation.tsx      # Post-submit success screen
├── steps/
│   ├── ServiceStep.tsx        # Step 1 — service selection cards
│   ├── VehicleStep.tsx        # Step 2 — year, make, model
│   ├── DamageStep.tsx         # Step 3 — severity, description, hasPhotos
│   └── ContactStep.tsx        # Step 4 — name, phone, email, contact method
└── hooks/
    ├── useQuoteForm.ts        # useReducer + localStorage persistence
    └── useSubmitQuote.ts      # TanStack Query mutation
```

Also create:

- `src/app/api/quote/route.ts` — API handler
- `src/lib/analytics.ts` — GA4 event helper

---

## Step 1 — State Management (`hooks/useQuoteForm.ts`)

### Form Data Interface

```typescript
interface QuoteFormData {
  service: 'collision' | 'bodywork' | 'painting' | 'insurance' | '';
  year: string;
  make: string;
  model: string;
  damage: 'minor' | 'moderate' | 'major' | 'unsure' | '';
  description: string;
  hasPhotos: boolean;
  firstName: string;
  lastName: string;
  phone: string; // raw digits only
  email: string;
  contactMethod: 'phone' | 'text' | 'email';
}
```

### Reducer Actions

```typescript
type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof QuoteFormData; value: any }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; data: Partial<QuoteFormData> };
```

### Persistence Rules

- Save to `localStorage` key `prestige-quote-draft` on every field change, debounced 500ms.
- On mount, attempt to hydrate from localStorage. If data exists, dispatch `HYDRATE`.
- On successful submission, clear the localStorage key.
- Wrap hydration in try/catch — corrupted JSON should not crash the form.

### Step Tracking

Track `currentStep` (0–3) as separate `useState`. Do NOT put it in the reducer — it's UI state, not form data.

---

## Step 2 — ServiceStep (Step 1)

This is the most visually distinctive step. Match the approved reference design exactly.

### Layout

- `grid grid-cols-2 lg:grid-cols-4 gap-4` — **4 cards in a single horizontal row on desktop, 2×2 on mobile**
- No heading inside the card area (the section title "Get a Free Estimate" + progress bar above is sufficient)

### Each Card

- `<button>` element (not `<div>`) with `aria-pressed={isSelected}`
- `flex flex-col items-center text-center p-5 md:p-6 rounded-xl border-2 transition-all duration-200`
- **Unselected:** `border-gray-200 dark:border-[#333333] bg-white dark:bg-[#252525] hover:border-gray-300 hover:shadow-sm`
- **Selected:** `border-[#C62828] bg-red-50/60 dark:bg-red-900/20 shadow-sm`
- Focus: `focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2`

### Icons

- **Must be inline SVG**, stroke-based, using `currentColor`. Size: `w-14 h-14 mb-4`.
- Selected icon color: `text-[#C62828]`. Unselected: `text-gray-500 group-hover:text-gray-700`.
- Do NOT use emoji. Do NOT use an icon library. Hand-craft 4 simple SVGs:
  - **Collision Repair:** crossed wrenches
  - **Auto Body Work:** car front-view outline
  - **Auto Painting:** spray gun
  - **Insurance Claim:** document with checkmark

### Card Text

- Title: `text-sm md:text-[15px] font-bold mb-1.5`. Selected: `text-[#C62828]`. Unselected: `text-gray-900 dark:text-[#E0E0E0]`
- Description: `text-xs md:text-[13px] leading-relaxed text-gray-500 dark:text-[#A0A0A0]`

### Service Data

```typescript
const services = [
  {
    id: 'collision',
    title: 'Collision Repair',
    description:
      'Restore your vehicle to pre-accident condition with certified technicians',
  },
  {
    id: 'bodywork',
    title: 'Auto Body Work',
    description:
      'Dent removal, frame repair, panel replacement and structural restoration',
  },
  {
    id: 'painting',
    title: 'Auto Painting',
    description:
      'Professional color matching and premium paint finishes with downdraft booth',
  },
  {
    id: 'insurance',
    title: 'Insurance Claim',
    description:
      'We handle your insurance claim process and work with all major carriers',
  },
];
```

### Validation

- Must have a selection to proceed. Error: "Please select a service"

---

## Step 3 — VehicleStep (Step 2)

### Fields

- `year` — `<select>` dropdown, current year down to 1990. Required.
- `make` — `<select>` dropdown. Options: Toyota, Honda, Ford, Chevrolet, BMW, Mercedes-Benz, Hyundai, Nissan, Kia, Subaru, Mazda, Volkswagen, Audi, Lexus, Acura, Other. When "Other" selected, show a text input. Required.
- `model` — text input, optional. Max 50 chars.

### Layout

- Stacked fields, each with label above. `space-y-4`.
- Year and Make side-by-side on desktop: `grid grid-cols-1 sm:grid-cols-2 gap-4`. Model full-width below.

### Input Styling

- `h-12 rounded-lg border border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1E1E1E] px-4 text-base text-gray-900 dark:text-[#E0E0E0] focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors`
- Error state: `border-[#DC2626]` + shake animation (3-frame horizontal, CSS keyframes)
- Error message: `text-sm text-[#DC2626] mt-1`

### Info Callout

- Below the fields, display: "We service all domestic and import makes including Toyota, Honda, BMW, Mercedes-Benz, Hyundai, Mazda, Subaru, and many more."
- Style: `text-sm text-gray-500 dark:text-[#A0A0A0] bg-gray-50 dark:bg-[#1E1E1E] rounded-lg p-3 mt-4`

### Validation

- Year: required. Error: "Please select your vehicle's year"
- Make: required. Error: "Please select your vehicle's make"

---

## Step 4 — DamageStep (Step 3)

### Severity Selection

- 2×2 card grid. Each card: colored dot indicator + label + description.
- **Severity options:**
  - `minor` — "Minor" — "Small dents, scratches, scuffs" — green dot `#22C55E`
  - `moderate` — "Moderate" — "Panel damage, cracked bumper" — amber dot `#F59E0B`
  - `major` — "Major" — "Structural damage, multiple panels" — red dot `#DC2626`
  - `unsure` — "Not Sure" — "Needs professional assessment" — gray dot `#6B7280`
- Selected card: tinted background matching severity color at 10% opacity.
- **Important:** Use labels as primary indicator, color as secondary (accessibility requirement — color independence).

### Description Textarea

- Optional. Max 500 chars. Placeholder: "Describe the damage (optional)..."
- `min-h-[100px] resize-y`
- Character counter: `text-xs text-gray-400 text-right mt-1`

### Photo Toggle

- Toggle switch: "I have photos to share"
- Subtitle below: "You can send them after submitting (via text or email)."
- Default: `false`

### Validation

- Severity: required. Error: "Please select a damage level"

---

## Step 5 — ContactStep (Step 4)

### Fields

- `firstName` — required, max 50. Error: "First name is required"
- `lastName` — optional, max 50
- `phone` — required, tel input. Auto-format display as `(XXX) XXX-XXXX` while storing raw digits. ≥10 digits required. Error: "Please enter a valid phone number"
- `email` — required, standard email regex. Error: "Please enter a valid email address"
- `contactMethod` — 3-button toggle bar: Phone / Text / Email. Default: `phone`. Not required for validation.

### Layout

- firstName + lastName: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- phone + email: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- contactMethod: full-width toggle bar below

### Phone Auto-Format

```typescript
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return '';
}
```

---

## Step 6 — FormProgress.tsx

### Progress Bar

- Header row: "Step N of 4" (left), "N% Complete" (right). `text-sm`.
- Track: `h-[5px] bg-gray-200 dark:bg-[#333333] rounded-full`. Fill: `bg-[#C62828] rounded-full transition-all duration-500 ease-out`.
- Width: `((currentStep + 1) / 4) * 100%`

### Step Dots

- 4 dots below the bar, evenly spaced. Labels: Service, Vehicle, Damage, Contact.
- Dot size: `w-3 h-3 rounded-full border-2`.
- Current: `bg-[#C62828] border-[#C62828] scale-125 shadow-[0_0_0_3px_rgba(198,40,40,0.15)]`
- Completed: `bg-[#C62828] border-[#C62828]`
- Future: `bg-white dark:bg-[#252525] border-gray-300 dark:border-[#444444]`
- Labels: `text-[11px] font-medium hidden sm:block`. Current: `text-[#C62828]`. Others: `text-gray-400`.
- Clicking a completed dot navigates back to that step. Clicking future dots does nothing.

---

## Step 7 — FormNavigation.tsx

- **Step 1:** "Next" button only, full-width.
- **Steps 2–3:** "Back" text link (left) + "Continue" button (right). Use flexbox `justify-between`.
- **Step 4:** "Back" text link (left) + "Submit Request" button (right).
- **All buttons:** `h-12 rounded-lg font-semibold text-base transition-colors duration-150`
- **Primary (Next/Continue/Submit):** `bg-[#C62828] hover:bg-[#B71C1C] active:bg-[#8E0000] text-white w-full` (when alone) or `flex-1 ml-4` (when Back is present)
- **Back:** `text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-4`
- **Submit loading state:** Disable button, show spinner, text changes to "Submitting..."
- **Double-submit prevention:** Disable button immediately on click. TanStack Query's `isPending` handles this.

---

## Step 8 — Validation (`validate` function)

Validate on "Next"/"Continue"/"Submit" click, NOT on blur. Use zod schemas per step:

```typescript
const stepSchemas = {
  0: z.object({
    service: z.enum(['collision', 'bodywork', 'painting', 'insurance']),
  }),
  1: z.object({ year: z.string().min(1), make: z.string().min(1) }),
  2: z.object({ damage: z.enum(['minor', 'moderate', 'major', 'unsure']) }),
  3: z.object({
    firstName: z.string().min(1).max(50),
    phone: z.string().regex(/^\d{10,}$/),
    email: z.string().email(),
  }),
};
```

On validation failure:

1. Set error state for each failed field (red border + error message below field via `aria-describedby`)
2. Apply shake animation on the first invalid field: `@keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-4px) } 75% { transform: translateX(4px) } }`
3. Focus the first invalid field

---

## Step 9 — QuoteForm.tsx (Orchestrator)

```typescript
'use client';

export default function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { state, dispatch } = useQuoteForm();
  const { mutate, isPending, isSuccess } = useSubmitQuote();

  // Step transition animation
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  function handleNext() {
    const result = stepSchemas[currentStep].safeParse(state);
    if (!result.success) { /* set errors, shake, focus */ return; }
    setDirection('forward');
    setCurrentStep(prev => Math.min(prev + 1, 3));
    trackEvent('quote_form_step', { step_number: currentStep + 2, direction: 'forward' });
  }

  function handleBack() {
    setDirection('backward');
    setCurrentStep(prev => Math.max(prev - 1, 0));
    trackEvent('quote_form_step', { step_number: currentStep, direction: 'backward' });
  }

  function handleSubmit() {
    const result = stepSchemas[3].safeParse(state);
    if (!result.success) { /* set errors */ return; }
    mutate(buildPayload(state));
  }

  if (isSuccess) return <QuoteConfirmation data={state} />;

  const StepComponent = [ServiceStep, VehicleStep, DamageStep, ContactStep][currentStep];

  return (
    <section id="get-a-quote" className="bg-gray-50 dark:bg-[#1E1E1E] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-[#E0E0E0] mb-1">
          Get a Free Estimate
        </h2>
        <div className="w-16 h-1 bg-[#C62828] rounded-full mb-8" />

        <div className="bg-white dark:bg-[#252525] rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6 md:p-10">
          <FormProgress currentStep={currentStep} onStepClick={handleStepClick} />

          <div className={`animate-${direction === 'forward' ? 'slideInRight' : 'slideInLeft'}`}>
            <StepComponent state={state} dispatch={dispatch} errors={errors} />
          </div>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={4}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isPending={isPending}
          />

          <p className="text-center text-xs text-gray-400 mt-4">Draft auto-saved</p>
        </div>
      </div>
    </section>
  );
}
```

**Important:** Wrap step content in a div with `aria-live="polite"` so screen readers announce step changes.

---

## Step 10 — Submission (`hooks/useSubmitQuote.ts`)

```typescript
import { useMutation } from '@tanstack/react-query';

export function useSubmitQuote() {
  return useMutation({
    mutationFn: async (payload: QuotePayload) => {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      localStorage.removeItem('prestige-quote-draft');
      trackEvent('quote_form_submit', {
        /* params */
      });
    },
    onError: (error) => {
      trackEvent('quote_form_error', { error_type: error.message });
    },
  });
}
```

### Payload Builder

Build the API payload shape from form state:

```typescript
function buildPayload(state: QuoteFormData): QuotePayload {
  return {
    service: state.service,
    vehicle: {
      year: parseInt(state.year),
      make: state.make,
      model: state.model,
    },
    damage: {
      severity: state.damage,
      description: state.description,
      hasPhotos: state.hasPhotos,
    },
    contact: {
      firstName: state.firstName.trim(),
      lastName: state.lastName.trim(),
      phone: state.phone,
      email: state.email.trim().toLowerCase(),
      preferredMethod: state.contactMethod,
    },
    metadata: {
      source: 'website',
      page: window.location.pathname,
      submittedAt: new Date().toISOString(),
      locale: document.documentElement.lang || 'en',
      userAgent: navigator.userAgent,
    },
  };
}
```

---

## Step 11 — API Route (`app/api/quote/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

const quoteSchema = z.object({
  service: z.enum(['collision', 'bodywork', 'painting', 'insurance']),
  vehicle: z.object({
    year: z
      .number()
      .int()
      .min(1990)
      .max(new Date().getFullYear() + 1),
    make: z.string().min(1).max(50),
    model: z.string().max(50).optional(),
  }),
  damage: z.object({
    severity: z.enum(['minor', 'moderate', 'major', 'unsure']),
    description: z.string().max(500).optional(),
    hasPhotos: z.boolean().optional(),
  }),
  contact: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().max(50).optional(),
    phone: z.string().regex(/^\d{10,15}$/),
    email: z.string().email(),
    preferredMethod: z.enum(['phone', 'text', 'email']).optional(),
  }),
  metadata: z
    .object({
      source: z.string(),
      page: z.string(),
      submittedAt: z.string(),
      locale: z.string(),
      userAgent: z.string(),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body._honeypot) {
      return NextResponse.json({ id: 'fake-id' }, { status: 201 }); // silently reject
    }

    // Time-based check (reject < 3 seconds)
    // Implement with a hidden timestamp field set on form mount

    const parsed = quoteSchema.parse(body);

    // TODO: Store in Payload CMS `quote-requests` collection
    // TODO: Send notification email to estimator team
    // TODO: Send confirmation to customer

    return NextResponse.json(
      { id: crypto.randomUUID(), status: 'received' },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
```

---

## Step 12 — QuoteConfirmation.tsx

Show after successful submission:

1. Animated checkmark icon (red circle with white check, CSS animation)
2. Headline: "Quote Request Sent!"
3. Body: "Thank you, {firstName}. Our team will contact you within 2 business hours."
4. Summary card showing: Service → Vehicle → Damage level → Contact method
5. If `hasPhotos === true`: show instructions — "Text your photos to (301) 578-8779" and "Or email them to info@prestigeautobodyinc.com"
6. "Submit another request" link that dispatches `RESET` and sets step back to 0

---

## Step 13 — Analytics (`lib/analytics.ts`)

```typescript
export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}
```

### Events to Fire

| Event                | When                         | Params                                          |
| -------------------- | ---------------------------- | ----------------------------------------------- |
| `quote_form_start`   | User selects a service       | `service_selected`                              |
| `quote_form_step`    | Each step transition         | `step_number`, `step_name`, `direction`         |
| `quote_form_abandon` | `beforeunload` if incomplete | `last_step`, `time_spent`, `fields_completed`   |
| `quote_form_submit`  | Successful submission        | `service`, `damage_severity`, `has_appointment` |
| `quote_form_error`   | Submission fails             | `error_type`, `step_number`                     |

Register `beforeunload` listener in `QuoteForm.tsx` useEffect to fire `quote_form_abandon` if `currentStep > 0` and form not submitted.

---

## Step 14 — Animations (CSS)

Add to your global CSS or Tailwind `@layer utilities`:

```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.animate-slideInRight {
  animation: slideInRight 350ms ease-out;
}
.animate-slideInLeft {
  animation: slideInLeft 350ms ease-out;
}
.animate-shake {
  animation: shake 200ms ease-in-out 2;
}

@media (prefers-reduced-motion: reduce) {
  .animate-slideInRight,
  .animate-slideInLeft,
  .animate-shake {
    animation: none;
  }
}
```

---

## Accessibility Checklist (Non-Negotiable)

- [ ] All service cards are `<button>` with `aria-pressed`
- [ ] Step container has `aria-live="polite"`
- [ ] Progress dots have `aria-label="Step N of 4: StepName"`
- [ ] All inputs have associated `<label>` elements
- [ ] Error messages linked via `aria-describedby`
- [ ] Focus moves to first interactive element on step change
- [ ] All interactive elements have visible focus ring (`focus-visible:ring-2`)
- [ ] Minimum touch target: 44×44px
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Color-coded damage severity uses labels as primary, color as secondary

---

## Dark Mode Checklist

- [ ] Every `bg-white` has a `dark:bg-[#252525]` pair
- [ ] Every `text-gray-900` has a `dark:text-[#E0E0E0]` pair
- [ ] Every `border-gray-*` has a `dark:border-[#333333]` or `dark:border-[#444444]` pair
- [ ] Selected service card: `dark:bg-red-900/20`
- [ ] Input backgrounds: `dark:bg-[#1E1E1E]`
- [ ] All text maintains ≥ 4.5:1 contrast ratio in dark mode
- [ ] `#C62828` accent red is unchanged in both modes

---

## Testing Expectations

After implementation, verify:

1. Complete full flow → confirmation screen displays
2. Navigate backward from step 4 to step 1, all data preserved
3. Refresh mid-form → localStorage restores draft
4. Submit with empty required fields → validation errors with shake
5. Double-click submit → only one request fires
6. Resize to mobile → 2×2 grid on step 1, stacked fields on others
7. Dark mode toggle → all form elements render correctly
8. Keyboard-only navigation through entire form
9. Tab through all cards and buttons — visible focus rings
10. "Submit another request" on confirmation → form resets clean

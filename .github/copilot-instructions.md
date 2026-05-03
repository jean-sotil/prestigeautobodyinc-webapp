# Copilot Instructions — Prestige Auto Body, Inc.

## Design Context

### Users

Local car owners in Silver Spring and Montgomery County, MD — primarily English
and Spanish speakers. Most arrive after an accident or noticing damage, often
stressed and time-pressured. Two jobs dominate:

1. **Get a quote fast.** Submit the multi-step quote form (4 steps: service →
   vehicle → damage → contact) without friction, on mobile, sometimes
   one-handed in a parking lot.
2. **Verify trust before calling.** Skim credentials (40+ years, I-CAR Gold
   Class, 4.7★, BBB A+, Lifetime Warranty) and reach a phone number quickly.

Heavy mobile traffic. Click-to-call (`(301) 578-8779`) is a primary conversion,
not a secondary fallback. Bilingual UX is first-class: every user-facing string
lives in `messages/en.json` + `messages/es.json` and locale switching preserves
form state.

### Brand Personality

**Trustworthy. Professional. Reassuring.**

Voice: the voice of a seasoned shop owner explaining the next step to a nervous
customer. Direct but warm. Confident without chest-thumping. Never salesy or
urgent-aggressive — the customer is already stressed; the interface's job is to
lower that temperature, not raise it.

Emotional target when someone lands on the homepage: "Okay — these people know
what they're doing, and I can get this started in the next 60 seconds."

### Aesthetic Direction

**Fast, frictionless, confidence-building.** Dark and light modes (system-
aware, cookie-persisted). Strong red (`#C62828`) accents used sparingly against
tinted neutrals. Elevated card surfaces, generous whitespace, zero visual
clutter. Every screen should give a stressed customer one obvious next action.

Industrial / automotive undertone — chrome-steel neutrals, carbon-fiber texture
on dark sections, asymmetric 3-segment accent bars — but applied with
restraint, not maximalism. Closer to "well-organized workshop" than
"high-octane garage."

**Anti-reference:** luxury dealership aesthetics (Mercedes / Porsche-style
ultra-minimal black-and-photography layouts). This shop serves everyday car
owners and must never imply "you can't afford us." Premium cues should read as
_craftsmanship and certification_, not _exclusivity_.

Typography: Big Shoulders Display for headings (industrial, mechanical, wide),
Instrument Sans for body. Both are locked — see `.impeccable.md` for
rationale on typography and other project-specific exceptions.

### Design Principles

1. **One obvious next action per screen.** A stressed customer should never
   have to decide between three equally weighted CTAs. Get-a-Quote and Call
   are the only primary paths; everything else is secondary.

2. **Trust is visual, not rhetorical.** Certifications, years in business,
   review counts, and the Lifetime Warranty badge earn their space; marketing
   adjectives do not. Show the I-CAR Gold Class seal before writing "trusted."

3. **Red is earned, never decorative.** `#C62828` marks CTAs, active states,
   and key numeric accents. It is not a background wash, not a gradient, not a
   text fill. The 60-30-10 rule is strict here — overuse flattens the hierarchy
   and drifts the brand toward "urgent-aggressive," which we explicitly reject.

4. **Bilingual-equal.** No feature ships English-first. Spanish copy is
   equally polished, equally tested. Form state, routing, and CMS content all
   support EN/ES without friction.

5. **Mobile and thumb-first.** The quote form, click-to-call, and language
   toggle must be reachable and comfortable with one thumb. Desktop layouts
   expand from the mobile composition, not the other way around.

For full visual spec see `DESIGN.md`, for the Tailwind v4 token plan see
`DESIGN_UPGRADES.md`, and for project-specific deviations from the
`impeccable` design skill's defaults see `.impeccable.md`.

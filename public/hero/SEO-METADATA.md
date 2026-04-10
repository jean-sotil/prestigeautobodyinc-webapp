# Hero Images - SEO Metadata

## File Naming Convention

`{page-slug}-hero-{breakpoint}.{format}`

Example: `homepage-hero-desktop.webp`

## Responsive Breakpoints

| Breakpoint | Dimensions | Primary Format |
| ---------- | ---------- | -------------- |
| Desktop    | 1920×800   | WebP           |
| Tablet     | 1024×427   | WebP           |
| Mobile     | 768×320    | WebP           |

## Image SEO Metadata

### 1. Homepage Hero

- **Alt text:** "Prestige Auto Body - pristine luxury sedan in state-of-the-art auto body workshop with modern equipment and professional lighting"
- **Title:** "Prestige Auto Body Inc - Premium Auto Body Repair Shop in Silver Spring, MD"
- **File:** `homepage/desktop/homepage-hero-desktop.webp`

### 2. Collision Repair Hero

- **Alt text:** "Professional collision repair technician using computerized frame measuring equipment with laser scanners and digital displays at Prestige Auto Body"
- **Title:** "Expert Collision Repair Services - Computerized Frame Measuring & PDR"
- **File:** `collision-repair/desktop/collision-repair-hero-desktop.webp`

### 3. Auto Body Services Hero

- **Alt text:** "Comprehensive auto body services including dent repair, structural frame work, bumper repair, alloy wheel restoration, glass replacement and spray painting"
- **Title:** "Full-Service Auto Body Repair - Dent Repair, Structural Work, Paint & More"
- **File:** `auto-body-services/desktop/auto-body-services-hero-desktop.webp`

### 4. Paint Solutions Hero

- **Alt text:** "Advanced computerized paint color matching and formulation facility with downdraft paint booth and eco-friendly refinishing technology"
- **Title:** "Premium Paint Solutions - Computerized Color Matching & Eco-Friendly Refinishing"
- **File:** `paint-solutions/desktop/paint-solutions-hero-desktop.webp`

### 5. Insurance Claims Assistance Hero

- **Alt text:** "Professional insurance claims advisor reviewing documentation with satisfied customer at Prestige Auto Body consultation area"
- **Title:** "Insurance Claims Assistance - We Handle Your Paperwork"
- **File:** `insurance-claims/desktop/insurance-claims-hero-desktop.webp`

### 6. 24/7 Towing Hero

- **Alt text:** "Professional flatbed tow truck providing 24/7 emergency roadside assistance and towing services at night with amber emergency lights"
- **Title:** "24/7 Emergency Towing & Roadside Assistance in Silver Spring, MD"
- **File:** `towing-24-7/desktop/towing-24-7-hero-desktop.webp`

### 7. Limited Lifetime Warranty Hero

- **Alt text:** "Satisfied customer receiving keys to beautifully restored luxury vehicle from Prestige Auto Body service advisor with lifetime warranty"
- **Title:** "Limited Lifetime Warranty on All Repairs - Quality You Can Trust"
- **File:** `lifetime-warranty/desktop/lifetime-warranty-hero-desktop.webp`

## HTML Implementation Example

```html
<picture>
  <source
    media="(max-width: 767px)"
    srcset="/hero/{slug}/mobile/{slug}-hero-mobile.webp"
    type="image/webp"
  />
  <source
    media="(max-width: 1023px)"
    srcset="/hero/{slug}/tablet/{slug}-hero-tablet.webp"
    type="image/webp"
  />
  <source
    srcset="/hero/{slug}/desktop/{slug}-hero-desktop.webp"
    type="image/webp"
  />
  <img
    src="/hero/{slug}/desktop/{slug}-hero-desktop.jpg"
    alt="{alt text from above}"
    title="{title from above}"
    width="1920"
    height="800"
    loading="eager"
    fetchpriority="high"
  />
</picture>
```

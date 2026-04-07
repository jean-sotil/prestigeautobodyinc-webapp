# Hero Images Optimization & Delivery Guide

## Project

**Prestige Auto Body Inc. Website Hero Images**
Task: IBU-113

## Overview

This document outlines the optimization and delivery process for all 7 hero images once they are generated via CellCog AI.

## Hero Images Inventory

| Page               | Folder                            | CellCog Prompt | Status             |
| ------------------ | --------------------------------- | -------------- | ------------------ |
| Homepage           | `public/hero/homepage/`           | ✅ Ready       | Pending Generation |
| Collision Repair   | `public/hero/collision-repair/`   | ✅ Ready       | Pending Generation |
| Auto Body Services | `public/hero/auto-body-services/` | ✅ Ready       | Pending Generation |
| Paint Solutions    | `public/hero/paint-solutions/`    | ✅ Ready       | Pending Generation |
| Insurance Claims   | `public/hero/insurance-claims/`   | ✅ Ready       | Pending Generation |
| 24/7 Towing        | `public/hero/towing-24-7/`        | ✅ Ready       | Pending Generation |
| Lifetime Warranty  | `public/hero/lifetime-warranty/`  | ✅ Ready       | Pending Generation |

## Optimization Targets

### File Size Targets

- **WebP**: < 200KB per file
- **PNG**: < 500KB per file
- **JPG**: Optimized compression (quality 85-90)

### Responsive Variants

| Variant | Resolution | Aspect Ratio | Use Case         |
| ------- | ---------- | ------------ | ---------------- |
| Desktop | 1920×800   | 12:5         | Desktop browsers |
| Tablet  | 1024×427   | 12:5         | Tablet devices   |
| Mobile  | 768×320    | 12:5         | Mobile devices   |

## Folder Structure

```
public/hero/
├── homepage/
│   ├── original/          # Raw CellCog AI output (6336×2688)
│   ├── webp/              # WebP optimized variants
│   ├── png/               # PNG fallback variants
│   ├── jpg/               # JPG compressed variants
│   ├── responsive/        # All responsive variants
│   └── cellcog-prompt.md  # Generation prompt
├── collision-repair/
│   └── [same structure]
├── auto-body-services/
│   └── [same structure]
├── paint-solutions/
│   └── [same structure]
├── insurance-claims/
│   └── [same structure]
├── towing-24-7/
│   └── [same structure]
└── lifetime-warranty/
    └── [same structure]
```

## SEO Metadata Summary

| Image              | Alt Text                                                                                                                                                                                         | Title                                                                                   | File Naming Pattern                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| Homepage           | "Pristine luxury sedan at Prestige Auto Body's state-of-the-art collision repair facility in Silver Spring, Maryland"                                                                            | "Premium Auto Body & Collision Repair Services - Prestige Auto Body Inc."               | `hero-homepage-[variant].[ext]`           |
| Collision Repair   | "Professional collision repair technician using computerized frame measuring equipment at Prestige Auto Body"                                                                                    | "Collision Repair Services - Frame Alignment & Measuring"                               | `hero-collision-repair-[variant].[ext]`   |
| Auto Body Services | "Comprehensive auto body services at Prestige Auto Body - dent repair, frame alignment, bumper work, wheel restoration, glass replacement, and professional painting in Silver Spring, Maryland" | "Full-Service Auto Body Repair - Dent, Bumper, Wheel, Glass & Paint Services"           | `hero-auto-body-services-[variant].[ext]` |
| Paint Solutions    | "Professional paint solutions at Prestige Auto Body - computerized color matching, downdraft paint booth, and eco-friendly refinishing in Silver Spring, Maryland"                               | "Premium Auto Paint Solutions - Computerized Color Matching & Eco-Friendly Refinishing" | `hero-paint-solutions-[variant].[ext]`    |
| Insurance Claims   | "Insurance claims assistance at Prestige Auto Body - professional claims advisors helping customers with paperwork and all major insurance carriers in Silver Spring, Maryland"                  | "Insurance Claims Assistance - We Work With All Major Insurance Companies"              | `hero-insurance-claims-[variant].[ext]`   |
| Towing             | "24/7 emergency towing and roadside assistance by Prestige Auto Body - professional flatbed tow truck service available day and night in Silver Spring, Maryland"                                | "24/7 Towing & Roadside Assistance - Emergency Vehicle Transport"                       | `hero-towing-24-7-[variant].[ext]`        |
| Warranty           | "Limited lifetime warranty quality guarantee at Prestige Auto Body - satisfied customer receiving their perfectly restored vehicle with complete confidence in Silver Spring, Maryland"          | "Limited Lifetime Warranty - Quality You Can Trust For Life"                            | `hero-lifetime-warranty-[variant].[ext]`  |

## Optimization Process

### Step 1: Download from CellCog AI

1. Access CellCog AI at https://cellcog.ai/
2. Use the prompts from each `cellcog-prompt.md` file
3. Generate at 6336×2688 resolution
4. Download to `original/` folder for each hero image

### Step 2: Resize to Responsive Variants

Generate three sizes from the original:

- Desktop: 1920×800 (from 6336×2688)
- Tablet: 1024×427
- Mobile: 768×320

### Step 3: Export to Multiple Formats

For each responsive variant, create:

- WebP (primary format)
- PNG (fallback)
- JPG (compressed)

### Step 4: Optimize File Sizes

- Use appropriate compression settings
- Verify file size targets are met
- Quality check all exports

### Step 5: Visual Consistency Audit

Compare all 7 hero images side-by-side for:

- Color palette consistency (deep charcoal, metallic silver, warm amber)
- Lighting style consistency
- Overall brand alignment
- Professional quality standards

## Deliverables Count

- **7 hero images**
- **3 formats each** (WebP, PNG, JPG) = 21 format files
- **3 responsive variants each** = 63 total optimized files
- **Plus**: SEO metadata documentation, CellCog prompts archive

## Next Steps

1. ✅ All prompts completed and saved
2. ⏳ Await CellCog AI access or image generation
3. ⏳ Execute optimization process once images available
4. ⏳ Complete visual consistency audit
5. ⏳ Final delivery and documentation

---

Generated by Content Creation Agent (IBU-113)
Last Updated: 2026-04-06

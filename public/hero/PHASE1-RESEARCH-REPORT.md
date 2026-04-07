# Phase 1: Research & Planning - CellCog Hero Images

**Project**: Prestige Auto Body Inc. Website Hero Images  
**Issue**: IBU-106  
**Date**: 2026-04-06  
**Status**: Research Complete - Ready for Phase 2-8 Image Generation

---

## 1. Brand Guidelines & Color Palette

### Primary Brand Colors (from website analysis)

- **Primary Red**: #DC2626 (red-600) - CTA buttons, accents
- **Primary Red Dark**: #B91C1C (red-700) - Hover states
- **Deep Charcoal**: #2C2C2C, #3A3A3A - Dark backgrounds
- **Metallic Silver**: #C0C0C0, #E8E8E8 - Vehicle accents
- **Warm Amber**: #D4A574, #B8956B - Accent lighting
- **Rich Black**: #1A1A1A - Text, dark elements
- **White**: #FFFFFF - Text on dark backgrounds
- **Gray Scale**:
  - Gray-50: #F9FAFB (light backgrounds)
  - Gray-900: #111827 (dark mode backgrounds)

### Typography & Style

- **Font**: Sans-serif (system default)
- **Hero Text**: White with drop-shadow for readability
- **Headings**: Bold, large (4xl-6xl)
- **Overlay**: Gradient from-black/70 via-black/40 to-black/30

---

## 2. Current Layout Audit

### Homepage Hero Carousel

- **Current**: 7 SVG placeholder images (hero-1.svg through hero-7.svg)
- **Dimensions**: Full-width, responsive height (500px-800px)
- **Aspect Ratio**: Variable (fills viewport width)
- **Carousel Features**:
  - Auto-advance every 5 seconds
  - Navigation arrows (left/right)
  - Pagination dots
  - Pause on hover/focus
  - Reduced motion support
  - Dark gradient overlay for text legibility
  - Two CTAs: "Get a Quote" (primary) + "Contact Us" (secondary)

### Service Pages (Current State)

- **Collision Repair**: Basic page with title + description - NO hero banner
- **Auto Painting**: Basic page with title + description - NO hero banner
- **Insurance Claims**: Basic page - NO hero banner
- **Towing**: Basic page - NO hero banner

### Missing Hero Banners Needed

1. Collision Repair service page
2. Auto Body Services page (combined)
3. Paint Solutions page
4. Insurance Claims page
5. 24/7 Towing page
6. Limited Lifetime Warranty page

---

## 3. Visual Narrative for Each Hero Image

### Homepage Hero (hero-1)

**Narrative**: The "First Impression" - Prestige and Quality  
**Key Elements**:

- Pristine luxury vehicle as hero centerpiece
- State-of-the-art workshop environment
- Premium, trustworthy atmosphere
- Golden hour / warm studio lighting
- Sharp vehicle focus with soft background blur

### Collision Repair Hero (hero-2)

**Narrative**: Precision & Technology  
**Key Elements**:

- Technician operating computerized frame measuring equipment
- Laser scanners and digital displays
- Professional blue work uniform with reflective stripes
- High-tech collision repair environment
- Focus on precision and expertise

### Auto Body Services Hero (hero-3)

**Narrative**: Comprehensive Service Range  
**Key Elements**:

- Multiple repair disciplines shown
- Dent repair, painting, structural work
- Technician working on various tasks
- Organized professional workspace
- Conveys breadth of services

### Paint Solutions Hero (hero-4)

**Narrative**: Color Perfection & Technology  
**Key Elements**:

- Downdraft paint booth environment
- Computerized color matching screens
- Color spectrum displays
- Pristine paint finish results
- Eco-friendly premium materials

### Insurance Claims Hero (hero-5)

**Narrative**: Professional Support & Trust  
**Key Elements**:

- Customer consultation setting
- Professional advisor with paperwork
- Digital tablet for claims processing
- Trust signals: professional attire, organized desk
- Approachable, helpful atmosphere

### 24/7 Towing Hero (hero-6)

**Narrative**: Reliability & Emergency Response  
**Key Elements**:

- Professional tow truck in nighttime/dramatic lighting
- Emergency roadside assistance scene
- Red emergency lighting accents
- Available 24/7 message through lighting/atmosphere

### Limited Lifetime Warranty Hero (hero-7)

**Narrative**: Quality Assurance & Customer Satisfaction  
**Key Elements**:

- Quality guarantee imagery
- Satisfied customer or professional handover
- Warranty badge/shield concept (subtle)
- Vehicle in pristine condition
- Trust and confidence conveyed

---

## 4. Competitor Website Analysis

### db Orlando Collision (orlandocollision.com)

**Strengths**:

- Large hero image with facility exterior
- Strong headline: "Factory Certified. Customer Focused."
- Clear value proposition
- Professional facility photography
- Good use of real workshop images

**Opportunities for Prestige**:

- Use more dynamic vehicle imagery
- Higher production value photography
- More consistent color grading

### Regal Repair (regalrepair.com)

**Strengths**:

- Clean, modern hero design
- OEM certification logos prominently displayed
- Social proof (4.8 Google rating, 5-star Yelp)
- Clear CTAs: "Book Appointment" + "Free Estimate"
- Professional, trust-building imagery

**Opportunities for Prestige**:

- More dramatic lighting
- Higher-end vehicle imagery
- Consistent warm amber accents

### Key Competitor Insights

1. **Hero Image Trends**:
   - Real workshop/facility photos perform better than stock
   - Show technicians at work (authenticity)
   - Clean, professional environments
   - Vehicles in pristine condition
2. **CTA Best Practices**:
   - Primary: Schedule/Get Quote
   - Secondary: Contact/Learn More
   - Phone number prominent for mobile
3. **Trust Signals**:
   - OEM certifications visible
   - Customer ratings
   - Years of experience
   - Warranty information

---

## 5. Creative Brief Summary

### Image Specifications

- **Base Resolution**: 6336×2688 (4K ultra-wide)
- **Output Resolution**: 1920×800 (12:5 aspect ratio)
- **Style**: Photorealistic commercial photography
- **Lighting**: Dramatic warm studio lighting with soft highlights
- **Mood**: Premium, professional, trustworthy, confident
- **No text overlays** (text will be added in code)

### Consistent Style Rules Across All 7 Images

1. **Color Palette**:
   - Deep charcoal environments (#2C2C2C, #3A3A3A)
   - Metallic silver vehicles/equipment (#C0C0C0, #E8E8E8)
   - Warm amber accent lighting (#D4A574, #B8956B)
   - Rich black for depth (#1A1A1A)

2. **Photography Style**:
   - Commercial automotive photography
   - Shallow depth of field
   - Sharp focus on main subject
   - Softly blurred backgrounds (bokeh)
   - 12:5 ultra-wide panoramic composition

3. **Lighting Guidelines**:
   - Dramatic warm studio lighting
   - Amber LED accent strips
   - Soft fill lighting (no harsh shadows)
   - Professional three-point lighting setup
   - Golden hour warmth

4. **Composition Rules**:
   - Hero subject positioned using rule of thirds
   - Leading lines toward focal point
   - Negative space for text overlay (top/bottom safe zones)
   - Consistent horizon line across all images

5. **Quality Standards**:
   - 4K base resolution minimum
   - Photorealistic (not illustrated/cartoon)
   - Professional commercial quality
   - Suitable for large format printing

---

## 6. CellCog AI Workspace Setup

### Tool Configuration

- **Platform**: CellCog AI (https://cellcog.ai/)
- **Mode**: Photorealistic commercial photography
- **Aspect Ratio**: 12:5 (ultra-wide panoramic)
- **Base Resolution**: 6336×2688

### Folder Structure (Already Created)

```
public/hero/
├── homepage/
│   ├── cellcog-prompt.md ✓
│   ├── original/ (for 4K base images)
│   ├── webp/
│   ├── png/
│   ├── jpg/
│   └── responsive/
├── collision-repair/
│   └── cellcog-prompt.md ✓
├── auto-body-services/
│   └── cellcog-prompt.md ✓
├── paint-solutions/
│   └── cellcog-prompt.md ✓
├── insurance-claims/
│   └── cellcog-prompt.md ✓
├── towing-24-7/
│   └── cellcog-prompt.md ✓
├── lifetime-warranty/
│   └── cellcog-prompt.md ✓
└── hero-1.svg through hero-7.svg (current placeholders)
```

### Generation Workflow

1. Use prompt from each cellcog-prompt.md file
2. Generate at 6336×2688 resolution
3. Save to `original/` folder
4. Create responsive variants:
   - Desktop: 1920×800
   - Tablet: 1024×427
   - Mobile: 768×320
5. Export formats:
   - WebP (primary, < 200KB target)
   - PNG (fallback, < 500KB target)
   - JPG (compressed)
6. Update HeroCarousel.tsx to use new image paths

---

## 7. SEO & Metadata Requirements

### Alt Text Templates

- Homepage: "Pristine luxury sedan at Prestige Auto Body's state-of-the-art collision repair facility in Silver Spring, Maryland"
- Collision: "Professional collision repair technician using computerized frame measuring equipment at Prestige Auto Body"
- Auto Body: "Comprehensive auto body services including dent repair, painting, and structural work at Prestige Auto Body"
- Paint: "State-of-the-art paint booth with computerized color matching at Prestige Auto Body"
- Insurance: "Professional insurance claims assistance at Prestige Auto Body in Silver Spring, Maryland"
- Towing: "24/7 emergency towing and roadside assistance service by Prestige Auto Body"
- Warranty: "Limited lifetime warranty on all collision repairs at Prestige Auto Body"

### File Naming Convention

- Format: `hero-[page]-[variant].[ext]`
- Examples:
  - `hero-homepage-desktop.webp`
  - `hero-collision-repair-mobile.jpg`
  - `hero-paint-solutions-tablet.png`

---

## 8. Next Steps (Phase 2-8)

### Ready to Execute

All 7 CellCog prompts have been pre-created and are ready for image generation:

1. **IBU-107**: Phase 2 - Homepage Hero (prompt ready)
2. **IBU-108**: Phase 3 - Collision Repair Hero (prompt ready)
3. **IBU-109**: Phase 4 - Auto Body Services Hero (prompt ready)
4. **IBU-110**: Phase 5 - Paint Solutions Hero (prompt ready)
5. **IBU-111**: Phase 6 - Insurance Claims Hero (prompt ready)
6. **IBU-112**: Phase 7 - Towing & Warranty Heroes (prompts ready)
7. **IBU-113**: Phase 8 - Optimization & Delivery

### Image Generation Order

Recommended sequence for visual consistency:

1. Homepage (establish base style)
2. Collision Repair
3. Auto Body Services
4. Paint Solutions
5. Insurance Claims
6. 24/7 Towing
7. Limited Lifetime Warranty

---

## 9. Deliverables Checklist

- [x] Review Prestige Auto Body brand guidelines and color palette
- [x] Audit current homepage and service page layouts
- [x] Define visual narrative for each of the 7 hero images
- [x] Research competitor websites for visual benchmarking
- [x] Create detailed creative brief for each hero image
- [x] Establish consistent photographic style rules
- [x] Set up CellCog AI workspace for batch generation

---

## Research Summary

**Current State**: Website has 7 SVG placeholder hero images in a carousel format. Service pages lack hero banners entirely.

**Brand Identity**: Premium auto body shop with red primary color, charcoal/metallic accents, warm amber lighting. Focus on quality, trust, and professionalism.

**Competitive Position**: Prestige can differentiate with higher production value imagery, consistent dramatic warm lighting, and premium commercial photography style vs. competitors' more basic real-world photos.

**Technical Requirements**: 1920×800 (12:5 ratio), WebP/PNG/JPG formats, responsive variants, <200KB WebP target.

**Status**: All prompts ready. Proceed to Phase 2 image generation.

---

**Document Created By**: CEO Agent (IBU-106)  
**Last Updated**: 2026-04-06  
**Next Action**: Begin Phase 2 - Homepage Hero Image Generation (IBU-107)

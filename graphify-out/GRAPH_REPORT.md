# Graph Report - src (2026-05-07)

## Corpus Check

- 151 files · ~59,672 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 440 nodes · 488 edges · 89 communities (80 shown, 9 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Locale Landing Pages|Locale Landing Pages]]
- [[_COMMUNITY_Header & Navigation|Header & Navigation]]
- [[_COMMUNITY_Quote Form Steps|Quote Form Steps]]
- [[_COMMUNITY_Contact & Reviews Embeds|Contact & Reviews Embeds]]
- [[_COMMUNITY_Quote Submission API|Quote Submission API]]
- [[_COMMUNITY_Blog Post Rendering|Blog Post Rendering]]
- [[_COMMUNITY_Quote Form State|Quote Form State]]
- [[_COMMUNITY_Analytics & Consent|Analytics & Consent]]
- [[_COMMUNITY_Typography & Utility Bar|Typography & Utility Bar]]
- [[_COMMUNITY_Frontend Layout & Query Setup|Frontend Layout & Query Setup]]
- [[_COMMUNITY_Business JSON-LD|Business JSON-LD]]
- [[_COMMUNITY_Breadcrumb System|Breadcrumb System]]
- [[_COMMUNITY_Blog Draft API|Blog Draft API]]
- [[_COMMUNITY_Root Layout & Payload Mount|Root Layout & Payload Mount]]
- [[_COMMUNITY_Lazy-Loaded Components|Lazy-Loaded Components]]
- [[_COMMUNITY_Service Page Template|Service Page Template]]
- [[_COMMUNITY_Gallery Page|Gallery Page]]
- [[_COMMUNITY_Service Areas Queries|Service Areas Queries]]
- [[_COMMUNITY_Icon Component|Icon Component]]
- [[_COMMUNITY_Blog Posts Queries|Blog Posts Queries]]
- [[_COMMUNITY_Badge Component|Badge Component]]
- [[_COMMUNITY_Testimonials Query|Testimonials Query]]
- [[_COMMUNITY_Not Found Page|Not Found Page]]
- [[_COMMUNITY_Payload Icon Component|Payload Icon Component]]
- [[_COMMUNITY_Service Selection Step|Service Selection Step]]
- [[_COMMUNITY_Hero Watermark|Hero Watermark]]

## God Nodes (most connected - your core abstractions)

1. `getHeroMedia()` - 13 edges
2. `POST()` - 12 edges
3. `pickAlt()` - 11 edges
4. `trackEvent()` - 10 edges
5. `getPayloadClient()` - 8 edges
6. `generateShopEmailHtml()` - 7 edges
7. `generateBreadcrumbItems()` - 7 edges
8. `getConsent()` - 7 edges
9. `onConsentChange()` - 7 edges
10. `getBusinessRating()` - 7 edges

## Surprising Connections (you probably didn't know these)

- `report()` --calls--> `trackEvent()` [INFERRED]
  instrumentation-client.ts → lib/analytics.ts
- `PrivacyPolicyPage()` --calls--> `generateBreadcrumbItems()` [INFERRED]
  app/(frontend)/[locale]/privacy-policy/page.tsx → components/seo/BreadcrumbJsonLd.tsx
- `TermsOfServicePage()` --calls--> `generateBreadcrumbItems()` [INFERRED]
  app/(frontend)/[locale]/terms-of-service/page.tsx → components/seo/BreadcrumbJsonLd.tsx
- `handleBeforeUnload()` --calls--> `trackEvent()` [INFERRED]
  components/quote-form/QuoteForm.tsx → lib/analytics.ts
- `handleNext()` --calls--> `trackEvent()` [INFERRED]
  components/quote-form/QuoteForm.tsx → lib/analytics.ts

## Communities (89 total, 9 thin omitted)

### Community 0 - "Locale Landing Pages"

Cohesion: 0.06
Nodes (12): AutoBodyServicesPage(), AutoPaintingPage(), CollisionRepairPage(), InsuranceClaimsPage(), fetchMediaByFilename(), getHeroMedia(), getPayloadClient(), pickAlt() (+4 more)

### Community 1 - "Header & Navigation"

Cohesion: 0.11
Nodes (15): NavLink(), useIsActiveLink(), useIsGroupActive(), useNavStructure(), useServiceItems(), cn(), Button(), CollapsibleContent() (+7 more)

### Community 2 - "Quote Form Steps"

Cohesion: 0.09
Nodes (10): useShakeOnError(), handleMethodKey(), setMethod(), handleFiles(), handleSeverityKey(), onDrop(), onKeyDown(), openPicker() (+2 more)

### Community 3 - "Contact & Reviews Embeds"

Cohesion: 0.11
Nodes (9): MapEmbed(), CarouselControls(), fetchPlaceDetails(), getBusinessRating(), getBusinessReviews(), getReviewsPageUrl(), computeReadingTime(), countWords() (+1 more)

### Community 4 - "Quote Submission API"

Cohesion: 0.2
Nodes (19): createQuoteRequest(), dataRow(), emailShell(), errorResponse(), formatPhoneDisplay(), generateCustomerEmailHtml(), generateReferenceId(), generateShopEmailHtml() (+11 more)

### Community 5 - "Blog Post Rendering"

Cohesion: 0.15
Nodes (13): RichTextRenderer(), fetchBlogCategories(), fetchBlogContributors(), fetchBlogPostBySlug(), fetchBlogPosts(), fetchCategoryPostCounts(), fetchPostLocalizedSlugs(), fetchRelatedPosts() (+5 more)

### Community 6 - "Quote Form State"

Cohesion: 0.14
Nodes (8): useQuoteForm(), useSubmitQuote(), trackEvent(), handleBack(), handleBeforeUnload(), handleNext(), handleSubmit(), report()

### Community 7 - "Analytics & Consent"

Cohesion: 0.16
Nodes (7): subscribeConsent(), subscribeConsent(), setUserProperties(), trackPageView(), getConsent(), onConsentChange(), setConsent()

### Community 8 - "Typography & Utility Bar"

Cohesion: 0.14
Nodes (6): Caption(), getColorClasses(), getDefaultElement(), getVariantClasses(), getWeightClasses(), Typography()

### Community 9 - "Frontend Layout & Query Setup"

Cohesion: 0.19
Nodes (8): WebVitals(), QueryProvider(), BlogPagePrefetch(), DashboardPrefetch(), ServiceAreasPagePrefetch(), TestimonialsPagePrefetch(), getQueryClient(), makeQueryClient()

### Community 10 - "Business JSON-LD"

Cohesion: 0.38
Nodes (7): getAggregateRating(), getGeoCoordinates(), getOpeningHoursSpecification(), getPostalAddress(), LocalBusinessJsonLd(), ReviewsJsonLd(), ServiceJsonLd()

### Community 11 - "Breadcrumb System"

Cohesion: 0.25
Nodes (3): BreadcrumbProvider(), usePageTitle(), BreadcrumbTitleSetter()

### Community 12 - "Blog Draft API"

Cohesion: 0.46
Nodes (7): createBlogDraft(), errorResponse(), findAuthorIdBySlug(), findCategoryIdsBySlugs(), getPayload(), POST(), uploadOGImageFromURL()

### Community 15 - "Service Page Template"

Cohesion: 0.25
Nodes (3): CTABanner(), ServiceAreas(), ServiceHero()

### Community 16 - "Gallery Page"

Cohesion: 0.38
Nodes (4): buildItemAlt(), getAlbumLocale(), humanizeSlug(), resolveImageAlt()

### Community 18 - "Icon Component"

Cohesion: 0.47
Nodes (3): getSizePixels(), Icon(), IconFill()

### Community 25 - "Badge Component"

Cohesion: 0.83
Nodes (3): Badge(), getSizeClasses(), getVariantClasses()

## Knowledge Gaps

- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `getBusinessRating()` connect `Contact & Reviews Embeds` to `Locale Landing Pages`, `Blog Post Rendering`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `getHeroMedia()` connect `Locale Landing Pages` to `Gallery Page`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `pickAlt()` connect `Locale Landing Pages` to `Gallery Page`, `Contact & Reviews Embeds`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getHeroMedia()` (e.g. with `CollisionRepairPage()` and `AutoBodyServicesPage()`) actually correct?**
  _`getHeroMedia()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `trackEvent()` (e.g. with `report()` and `handleBeforeUnload()`) actually correct?**
  _`trackEvent()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `Locale Landing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Header & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._

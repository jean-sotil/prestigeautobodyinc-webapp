# Blog Pages — UX + SEO + i18n Audit & Claude Code Fix Instructions

**Prestige Auto Body × Ibudidev** | April 25, 2026  
Pages: `/en/blog` · `/es/blog` · `/en/blog/[slug]` · `/es/blog/[slug]`

Scope: visual UX (Part A/B), SEO surface (Part C), and i18n / locale correctness (Part D).
The site uses **next-intl** with `localePrefix: 'always'`, locales `['en', 'es']`, and per-post
`localizedSlugs` recently wired into `BlogPosts.ts`. All instructions below assume that setup.

---

## Summary: 22 Issues Found

| Severity       | Count | Description                                                    |
| -------------- | ----- | -------------------------------------------------------------- |
| 🔴 Critical    | 4     | Blocks UX, indexing, or cross-locale linking — fix immediately |
| 🟠 Major       | 8     | Hurts user flow, share preview, or organic discovery           |
| 🟡 Minor       | 7     | Polish items                                                   |
| 🔵 Enhancement | 3     | Makes it stunning                                              |

---

## PART A — Issues Found

### Blog Index Page `/es/blog`

---

#### 🔴 #01 — Page header has zero contrast / no hero treatment

The "NUESTRO BLOG — Notas del Taller" section sits on a flat white background with no visual
separation, no depth, no atmosphere. Every other section on the site has a distinct background
treatment. This one looks like unstyled content.

**File:** Blog index page header section / `page.tsx`

---

#### 🔴 #02 — Massive empty whitespace gap between featured post and card grid

After the "MÁS RECIENTE" featured post, there is an enormous blank space (~400px) before the
secondary card grid begins. This is a layout bug — likely an empty conditional render, a missing
content section, or a container with excessive bottom margin.

**File:** Featured post section / BlogGrid container

---

#### 🟠 #03 — Featured post lacks card treatment

The top "MÁS RECIENTE" post has no card background, border, or shadow to frame it. It blends into
the white page and loses its editorial prominence as the lead article.

**File:** `FeaturedPostCard.tsx`

---

#### 🟠 #04 — Blog cards have no hover interaction

The grid cards have no image zoom, no card lift, no shadow on hover. They feel static and
unresponsive — a missed opportunity for delight and brand quality.

**File:** `BlogCard.tsx`

---

#### 🟡 #05 — Category filter row lacks visual separator

The filter tabs ("TODOS" / "COLLISION REPAIR (4)") have no bottom border between the filter zone
and content below. Inactive tabs need clearer interactive affordance.

**File:** `BlogFilters.tsx`

---

#### 🟡 #06 — "MÁS RECIENTE" label is too subtle

The eyebrow label above the featured post is tiny red text with no visual weight. It doesn't
telegraph "featured content" clearly enough. Needs a pill badge treatment.

**File:** `FeaturedPostCard.tsx`

---

### Blog Detail Page `/es/blog/[slug]`

---

#### 🟠 #07 — "← Volver a todos los artículos" missing margin

The back-navigation button is flush against the content above it with no breathing room or
separator. Needs a `border-t` + `mt-12 pt-10` treatment.

**File:** BlogPost back button / `page.tsx`

---

#### 🟠 #08 — Related Articles section renders empty (no cards)

The "Artículos Relacionados" section shows the heading and "Ver Todos los Artículos" button but
zero article cards. The related posts query is returning empty results or the cards are not
rendering. This wastes a high-value bottom-of-article engagement section.

**File:** `RelatedPosts.tsx`

---

#### 🟡 #09 — Breadcrumb shows raw English slug on ES route

The breadcrumb displays "Signs Hidden Structural Damage" (the raw URL slug, untranslated) on the
Spanish locale page. Should show the localized post title.

**File:** `Breadcrumb.tsx`

---

#### 🟡 #10 — No separator between author block and article body

The author avatar + name + date block leads directly into article text with no visual break.

**File:** `AuthorMeta.tsx`

---

#### 🔵 #11 — Enhancement: Hero image gradient overlay

The full-width hero image on blog detail is good, but a stronger dark gradient at the bottom
would improve breadcrumb legibility and visual polish.

**File:** `BlogHero.tsx`

---

#### 🔵 #12 — Enhancement: Reading progress bar

A thin red progress bar at the top of the viewport showing reading position reinforces the brand
and improves engagement on long-form articles.

**File:** New `ReadingProgress.tsx`

---

#### 🔵 #13 — Enhancement: Stagger card grid on scroll

The card grid should stagger into view using CSS `@keyframes` + IntersectionObserver for a
premium editorial feel.

**File:** `BlogGrid.tsx`

---

### SEO Issues (apply to both `/[locale]/blog` and `/[locale]/blog/[slug]`)

---

#### 🔴 #14 — Blog detail page is missing `BlogPosting` JSON-LD

The detail page renders no `Article` / `BlogPosting` structured data, so Google cannot surface
rich results (author, headline, datePublished, image) for any post in either locale. The index
page emits `LocalBusinessJsonLd` but no `Blog` / `CollectionPage` schema.

**File:** `src/app/[locale]/blog/[slug]/page.tsx` and a new `src/components/seo/BlogPostingJsonLd.tsx`

---

#### 🔴 #15 — `metadataBase` and absolute OG URLs not wired

`generateMetadata` returns relative `canonical` paths. Without a `metadataBase` (set in the
root layout) Open Graph and canonical URLs serialize to relative URLs, which most crawlers and
social scrapers (Facebook, LinkedIn, Slack) drop. Result: no share previews.

**File:** `src/app/[locale]/layout.tsx` (root metadata) — affects both blog pages

---

#### 🟠 #16 — `hreflang` map is hard-coded and missing `x-default`

`alternates.languages` on the index is `{ en: '/en/blog', es: '/es/blog' }` — no `x-default`
entry, no absolute URLs, and on the detail page the same shape is used with the **current
locale's slug for both languages**, which sends Spanish search engines to a non-existent EN URL
and vice versa once `localizedSlugs` diverge.

**File:** `src/app/[locale]/blog/page.tsx` `generateMetadata` and detail page equivalent

---

#### 🟠 #17 — `og:image` and `twitter:card` missing

Neither page sets `openGraph.images` (post `featuredImage`) nor `twitter.card: 'summary_large_image'`.
Shared blog links render as plain text snippets across iMessage, WhatsApp, X, LinkedIn.

**File:** Both `generateMetadata` blocks

---

#### 🟠 #18 — `BreadcrumbList` JSON-LD missing on detail page

Even after the visual breadcrumb is fixed (#09), the page emits no `BreadcrumbList` schema, so
Google's breadcrumb SERP treatment will not appear for any post.

**File:** Same component that renders the visual breadcrumb / detail page

---

#### 🟠 #19 — Sitemap does not enumerate localized blog posts

`sitemap.ts` (or its absence) does not produce one URL entry per **(locale × post)** with
`<xhtml:link rel="alternate" hreflang="...">` per Google's sitemap i18n guidance. Posts only
get indexed via crawl, not via sitemap submission.

**File:** `src/app/sitemap.ts` (create or update)

---

#### 🟡 #20 — Filtered + paginated index pages have no canonical strategy

`/en/blog?category=collision-repair&page=2` currently inherits the same canonical as `/en/blog`,
collapsing every paginated/filtered URL onto the base. That is acceptable for filters but
prevents `?page=N` from being indexed independently. There is also no `robots: { index: false }`
on filter combos, so crawl budget is wasted.

**File:** `src/app/[locale]/blog/page.tsx` `generateMetadata`

---

#### 🟡 #21 — Image `alt` falls back to post title (not localized for non-text imagery)

`alt={post.featuredImage.alt || post.title}` is correct only if the CMS stores localized alt
text per locale. If `featuredImage.alt` is a single shared string, ES users get an EN alt and
WCAG 1.1.1 is violated for screen readers in Spanish.

**File:** Featured image rendering in `page.tsx` and `BlogCard.tsx` — plus the Payload media
collection schema

---

#### 🟡 #22 — No `robots.txt` mention of the localized sitemaps

Even with #19 fixed, `robots.txt` (or `app/robots.ts`) likely doesn't reference the sitemap,
so crawlers must discover it via Search Console only.

**File:** `src/app/robots.ts`

---

### i18n / Locale Issues

---

#### 🔴 #23 — Locale switcher on `/[locale]/blog/[slug]` produces 404 when slugs diverge

The header language switcher swaps `/en/...` ↔ `/es/...` while keeping the URL path constant.
Once a post has `localizedSlugs = { en: 'signs-hidden-structural-damage', es: 'senales-de-dano-estructural-oculto' }`,
toggling to ES on `/en/blog/signs-hidden-structural-damage` lands on
`/es/blog/signs-hidden-structural-damage` → **404**. This is the single highest-impact i18n bug.

**File:** Locale switcher component (likely `src/components/Header/LocaleSwitcher.tsx`) +
detail page must expose `localizedSlugs` to it

---

#### 🟠 #24 — Hard-coded Spanish strings in JSX

The audit references "Artículos Relacionados", "Volver a todos los artículos", "MÁS RECIENTE",
"Notas del Taller" as if they were copy. Any of these that are still **string literals in JSX
instead of `t('blog.…')` lookups** will display in Spanish on `/en/blog` too. Audit every
literal in `blog/page.tsx`, `blog/[slug]/page.tsx`, and child components.

**File:** All blog components — confirm against `messages/en.json` and `messages/es.json`

---

#### 🟡 #25 — Date locale string is `'es-ES'` instead of `'es-US'` / `'es-419'`

`new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', …)` formats with European Spanish
conventions for a US-Hispanic audience. Use `'es-US'` (or fall back to `'es-419'`) so number
separators and month abbreviations match the target market.

**File:** `src/app/[locale]/blog/page.tsx:88` and detail page equivalent

---

#### 🟡 #26 — `<html lang>` and `<html dir>` must reflect the active locale

Verify the root layout sets `<html lang={locale}>`. Without it, Chrome's translation banner
fires incorrectly and screen readers pick the wrong voice. (No RTL locales today, so `dir`
can stay `ltr` — but make it explicit.)

**File:** `src/app/[locale]/layout.tsx`

---

#### 🟡 #27 — `og:locale` and `og:locale:alternate` only emit one alternate

`alternateLocale: locale === 'en' ? 'es' : 'en'` emits a bare language code. Open Graph spec
requires `language_TERRITORY` (e.g. `en_US`, `es_US`). Fix the format and emit **all** other
locales as alternates, not just one.

**File:** Both `generateMetadata` blocks

---

#### 🟡 #28 — Category names depend on Payload locale fallback

`fetchBlogCategories(locale)` returns category names in the requested locale, but if a category
has no ES translation Payload silently returns the EN value. Posts then show an English category
pill on the Spanish page. Either enforce required ES translations in the CMS or render the
category slug as a fallback that's at least neutral.

**File:** `src/lib/queries/blog.server.ts` + Payload category collection

---

---

## PART B — Claude Code Instructions

Paste the following into Claude Code. Each instruction references the issue numbers above.

---

### Instruction 1 — Fix Blog Index Page Header Contrast `[#01]`

**Target:** Find the blog index page header section — the container holding "NUESTRO BLOG",
the "Notas del Taller" H1, and the subtitle paragraph.

1. Change its background to `bg-[#F5F5F5] dark:bg-[#1A1A1A]` and add a bottom separator:
   `border-b border-[#CCCCCC] dark:border-[#333333]`

2. Add a 3px red accent bar below the H1, matching the SectionHeading pattern used elsewhere
   on the site:

   ```jsx
   <div className="w-16 h-[3px] bg-[#C62828] mt-3 mb-4" />
   ```

3. Increase the section's top/bottom padding to `py-16` to give it proper visual weight.

4. Ensure the H1 uses `font-display` (Big Shoulders Display) at `text-5xl font-extrabold`
   to match the design system spec.

5. The subtitle paragraph should be `text-[#555555] dark:text-[#A0A0A0] text-lg max-w-2xl`.

---

### Instruction 2 — Fix Whitespace Gap Between Featured Post and Grid `[#02]`

**Target:** Locate the JSX between the featured post section and the card grid in the blog index page.

1. Look for empty containers, conditionally rendered sections that evaluate to `null`, or
   missing `posts` data between the two sections.

2. If there is a "secondary featured" or "editor's pick" section rendering empty, add a guard:

   ```jsx
   {
     secondaryFeatured && <SecondaryFeatured post={secondaryFeatured} />;
   }
   ```

3. Verify the featured post container does not have excessive `mb-` or `pb-` classes.
   Replace any `mb-24` or larger with `mb-12`.

4. Ensure the card grid follows the featured post with only `mt-12` between them — no extra wrappers.

---

### Instruction 3 — Elevate Featured Post Card Treatment `[#03 #06]`

**Target:** `FeaturedPostCard.tsx` (or the featured post section in the blog index page)

1. Wrap the featured post in a card container:

   ```jsx
   <article className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#CCCCCC]
     dark:border-[#333333] overflow-hidden shadow-sm">
   ```

2. Replace the plain "MÁS RECIENTE" text label with a styled pill badge:

   ```jsx
   <span
     className="inline-flex items-center gap-1.5 bg-[#C62828] text-white 
     text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm"
   >
     ★ Más Reciente
   </span>
   ```

3. Add a red accent line above the H2 title inside the card:

   ```jsx
   <div className="w-12 h-[3px] bg-[#C62828] mb-3" />
   ```

4. Make the image fill the left half at `aspect-[4/3] object-cover` on desktop,
   full-width on mobile (`md:w-1/2 w-full`).

---

### Instruction 4 — Add Hover Effects to Blog Cards `[#04]`

**Target:** `BlogCard.tsx` (or whatever component renders the secondary blog post cards in the grid)

1. Add `group` class to the outer card `<article>` or `<div>` container.

2. Add card lift on hover:

   ```
   transition-all duration-300 hover:shadow-lg hover:-translate-y-1
   ```

3. Wrap the card's image in an `overflow-hidden` div. Add scale transition to the `<Image>`:

   ```
   className="... group-hover:scale-105 transition-transform duration-500 ease-out"
   ```

4. Add a red bottom border accent that animates in on hover:

   ```
   border-b-2 border-transparent group-hover:border-[#C62828] transition-colors duration-300
   ```

5. Make the "Leer Más →" link change to red on card hover:
   ```
   className="... text-[#555555] group-hover:text-[#C62828] transition-colors duration-200"
   ```

---

### Instruction 5 — Fix "Volver" Button Margin + Add Separator `[#07]`

**Target:** The "← Volver a todos los artículos" back button in the blog detail page.

1. Wrap the button in a container that provides a visual separator:

   ```jsx
   <div className="border-t border-[#CCCCCC] dark:border-[#333333] mt-12 pt-10 pb-8">
     {/* back button here */}
   </div>
   ```

2. Style the button as an outlined red variant with hover fill:
   ```jsx
   <Link
     href={`/${locale}/blog`}
     className="inline-flex items-center gap-2 border border-[#C62828] text-[#C62828] 
       hover:bg-[#C62828] hover:text-white px-5 py-2.5 rounded-sm font-semibold 
       text-sm transition-colors duration-200 group"
   >
     <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
       ←
     </span>
     {t('blog.backToAll')}
   </Link>
   ```

---

### Instruction 6 — Fix Related Articles — Render Actual Cards `[#08]`

**Target:** `RelatedPosts.tsx` and the data query that feeds it.

1. First, verify the `relatedPosts` prop or query is returning data. Add a temporary
   `console.log('relatedPosts:', relatedPosts)` to confirm.

2. Fix the Payload CMS query to fetch related posts by same category, excluding current slug:

   ```js
   const relatedPosts = await payload.find({
     collection: 'blog-posts',
     locale,
     where: {
       and: [
         { 'category.slug': { equals: post.category.slug } },
         { slug: { not_equals: currentSlug } },
       ],
     },
     limit: 3,
   });
   ```

3. Map the results into a 3-column grid:

   ```jsx
   {
     relatedPosts.docs.length > 0 && (
       <section className="bg-[#F5F5F5] dark:bg-[#1A1A1A] py-16">
         <div className="container mx-auto px-4">
           <h2 className="font-display text-3xl font-bold text-center mb-2">
             Artículos Relacionados
           </h2>
           <div className="w-12 h-[3px] bg-[#C62828] mx-auto mb-10" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {relatedPosts.docs.map((post) => (
               <BlogCard key={post.id} post={post} />
             ))}
           </div>
         </div>
       </section>
     );
   }
   ```

4. If `relatedPosts.docs.length === 0`, render nothing — do not show the empty section.

---

### Instruction 7 — Fix Breadcrumb i18n `[#09]`

**Target:** The `Breadcrumb` component on the blog detail page.

1. Replace raw slug display with the already-fetched localized post title:

   ```jsx
   // BEFORE (wrong):
   <span>{slug}</span>

   // AFTER (correct):
   <span>{post.title.length > 40 ? post.title.slice(0, 40) + '…' : post.title}</span>
   ```

2. Ensure the middle breadcrumb uses the i18n key, not a hardcoded "Blog" string:
   ```jsx
   <Link href={`/${locale}/blog`}>{t('blog.label')}</Link>
   ```
   Add `blog.label = "Nuestro Blog"` to `es.json` and `blog.label = "Our Blog"` to `en.json`.

---

### Instruction 8 — Add Author/Article Separator `[#10]`

**Target:** `AuthorMeta.tsx` or the author block in the blog detail page.

1. After the author + date block, add a horizontal separator before the article body begins:
   ```jsx
   <div className="border-b border-[#CCCCCC] dark:border-[#333333] mt-6 mb-8" />
   ```

---

### Instruction 9 — Add Reading Progress Bar `[#12]` (Enhancement)

**Target:** Create a new file `src/components/blog/ReadingProgress.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-[#C62828] z-[60] transition-all duration-100 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
```

Import and render `<ReadingProgress />` inside the blog post layout or page — NOT in the global layout.

---

### Instruction 10 — Stagger Card Animation on Scroll `[#13]` (Enhancement)

**Target:** `BlogGrid.tsx` or the grid container in the blog index page.

1. Add a CSS keyframe to `globals.css` (inside the `@layer utilities` block):

   ```css
   @keyframes fadeInUp {
     from {
       opacity: 0;
       transform: translateY(24px);
     }
     to {
       opacity: 1;
       transform: translateY(0);
     }
   }
   .animate-fade-in-up {
     animation: fadeInUp 0.5s ease-out forwards;
     opacity: 0;
   }
   ```

2. In the blog card grid map, add a staggered animation delay:

   ```jsx
   {
     posts.map((post, index) => (
       <BlogCard
         key={post.id}
         post={post}
         className="animate-fade-in-up"
         style={{ animationDelay: `${index * 80}ms` }}
       />
     ));
   }
   ```

3. Use `IntersectionObserver` in a `useEffect` inside `BlogGrid.tsx` to only trigger
   the animation when the grid enters the viewport (add/remove an `is-visible` class
   to avoid animating on mount before scroll).

---

### Instruction 11 — Wire `metadataBase` Once for the Whole App `[#15]`

**Target:** `src/app/[locale]/layout.tsx` (the root metadata export)

1. Set the canonical site origin so all relative `canonical` and `og:image` URLs resolve to
   absolute URLs:

   ```ts
   import type { Metadata } from 'next';

   const SITE_URL =
     process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prestigeautobody.com';

   export const metadata: Metadata = {
     metadataBase: new URL(SITE_URL),
     // ...existing fields
   };
   ```

2. Add `NEXT_PUBLIC_SITE_URL` to `.env.example` and any deploy environment (Vercel project env).

3. After this change, every page-level `generateMetadata` that returns `canonical: '/en/blog'`
   will emit `https://prestigeautobody.com/en/blog` in `<link rel="canonical">` and OG tags.

---

### Instruction 12 — Add `BlogPosting` JSON-LD to Detail Page `[#14]`

**Target:** Create `src/components/seo/BlogPostingJsonLd.tsx` and render it from
`src/app/[locale]/blog/[slug]/page.tsx`.

1. New component (mirrors the existing `LocalBusinessJsonLd` pattern):

   ```tsx
   import type { BlogPost } from '@/lib/queries/types';

   interface Props {
     post: BlogPost;
     locale: string;
     siteUrl: string;
   }

   export function BlogPostingJsonLd({ post, locale, siteUrl }: Props) {
     const url = `${siteUrl}/${locale}/blog/${post.slug}`;
     const json = {
       '@context': 'https://schema.org',
       '@type': 'BlogPosting',
       headline: post.title,
       description: post.excerpt ?? undefined,
       image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
       datePublished: post.publishedAt,
       dateModified: post.updatedAt ?? post.publishedAt,
       inLanguage: locale === 'es' ? 'es-US' : 'en-US',
       mainEntityOfPage: { '@type': 'WebPage', '@id': url },
       author: post.author?.fullName
         ? { '@type': 'Person', name: post.author.fullName }
         : undefined,
       publisher: {
         '@type': 'Organization',
         name: 'Prestige Auto Body',
         logo: {
           '@type': 'ImageObject',
           url: `${siteUrl}/images/logo.png`,
         },
       },
       articleSection: post.categories?.[0]?.name,
       keywords: post.categories?.map((c) => c.name).join(', '),
     };
     return (
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
       />
     );
   }
   ```

2. Render it from the detail page near the existing JSON-LD components, after fetching `post`:

   ```tsx
   <BlogPostingJsonLd post={post} locale={locale} siteUrl={SITE_URL} />
   ```

3. Add a sibling `Blog` (or `CollectionPage`) JSON-LD in the index page if desired — optional,
   lower ROI than `BlogPosting`.

---

### Instruction 13 — Add `BreadcrumbList` JSON-LD `[#18]`

**Target:** Detail page, alongside the visual breadcrumb fix from `[#09]`.

```tsx
const breadcrumbsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: t('common.home'),
      item: `${SITE_URL}/${locale}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t('blog.label'),
      item: `${SITE_URL}/${locale}/blog`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `${SITE_URL}/${locale}/blog/${post.slug}`,
    },
  ],
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
    />
    {/* visual breadcrumb */}
  </>
);
```

---

### Instruction 14 — Add `og:image` and `twitter:card` to Both Pages `[#17]`

**Target:** `generateMetadata` in `src/app/[locale]/blog/page.tsx` and the detail page.

1. **Index page** — use a static OG fallback (or Payload "blog hero" media):

   ```ts
   openGraph: {
     // ...existing fields
     images: [{ url: '/og/blog-index.jpg', width: 1200, height: 630, alt: t('og.title') }],
   },
   twitter: {
     card: 'summary_large_image',
     title: t('og.title'),
     description: t('og.description'),
     images: ['/og/blog-index.jpg'],
   },
   ```

2. **Detail page** — derive from `post.featuredImage`:

   ```ts
   const ogImage = post.featuredImage?.url ?? '/og/blog-index.jpg';

   return {
     title: post.seoTitle ?? post.title,
     description: post.seoDescription ?? post.excerpt,
     openGraph: {
       type: 'article',
       title: post.title,
       description: post.excerpt ?? undefined,
       url: `/${locale}/blog/${post.slug}`,
       images: [
         {
           url: ogImage,
           width: 1200,
           height: 630,
           alt: post.featuredImage?.alt ?? post.title,
         },
       ],
       publishedTime: post.publishedAt,
       modifiedTime: post.updatedAt ?? post.publishedAt,
       authors: post.author?.fullName ? [post.author.fullName] : undefined,
       section: post.categories?.[0]?.name,
       tags: post.categories?.map((c) => c.name),
       locale: locale === 'es' ? 'es_US' : 'en_US',
       alternateLocale: locale === 'es' ? ['en_US'] : ['es_US'],
     },
     twitter: {
       card: 'summary_large_image',
       title: post.title,
       description: post.excerpt ?? undefined,
       images: [ogImage],
     },
   };
   ```

---

### Instruction 15 — Build a Localized `sitemap.ts` `[#19] [#22]`

**Target:** Create `src/app/sitemap.ts`.

```ts
import type { MetadataRoute } from 'next';
import { fetchAllBlogPostSlugs } from '@/lib/queries/blog.server';
import { routing } from '@/i18n/routing';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prestigeautobody.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllBlogPostSlugs(); // returns [{ id, localizedSlugs, updatedAt }]
  const entries: MetadataRoute.Sitemap = [];

  // Static blog index per locale
  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/blog`]),
        ),
      },
    });
  }

  // One entry per (locale × post)
  for (const post of posts) {
    for (const locale of routing.locales) {
      const slug = post.localizedSlugs?.[locale] ?? post.localizedSlugs?.en;
      if (!slug) continue;
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(post.updatedAt ?? Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales
              .filter((l) => post.localizedSlugs?.[l])
              .map((l) => [
                l,
                `${SITE_URL}/${l}/blog/${post.localizedSlugs[l]}`,
              ]),
          ),
        },
      });
    }
  }

  return entries;
}
```

Also add `src/app/robots.ts` referencing the sitemap:

```ts
import type { MetadataRoute } from 'next';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prestigeautobody.com';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

---

### Instruction 16 — Localized `hreflang` for the Detail Page `[#16] [#23]`

**Target:** `src/app/[locale]/blog/[slug]/page.tsx` `generateMetadata` and the locale switcher.

1. The page must already be loading the post. Read its `localizedSlugs` map and emit one
   `alternates.languages` entry per locale that exists, plus `x-default`:

   ```ts
   import { routing } from '@/i18n/routing';

   const languages: Record<string, string> = {};
   for (const l of routing.locales) {
     const s = post.localizedSlugs?.[l];
     if (s) languages[l] = `/${l}/blog/${s}`;
   }
   languages['x-default'] =
     `/${routing.defaultLocale}/blog/${post.localizedSlugs[routing.defaultLocale] ?? post.slug}`;

   return {
     // ...
     alternates: {
       canonical: `/${locale}/blog/${post.slug}`,
       languages,
     },
   };
   ```

2. Apply the same `x-default` pattern to the **index page** `generateMetadata`:

   ```ts
   alternates: {
     canonical: `/${locale}/blog`,
     languages: {
       en: '/en/blog',
       es: '/es/blog',
       'x-default': '/en/blog',
     },
   },
   ```

3. **Locale switcher fix (the 404 bug):** the switcher must consume `localizedSlugs` from the
   detail page and route to the correct localized slug, not blindly swap the locale prefix.
   Pattern:
   ```tsx
   // Detail page renders the switcher with explicit alternates
   <LocaleSwitcher
     alternates={Object.fromEntries(
       routing.locales.map((l) => [
         l,
         post.localizedSlugs?.[l]
           ? `/${l}/blog/${post.localizedSlugs[l]}`
           : `/${l}/blog`, // fall back to the index, not a 404
       ]),
     )}
   />
   ```
   Inside `LocaleSwitcher.tsx`, when `alternates` is provided, prefer it over the default
   path-substitution logic.

---

### Instruction 17 — Filter / Pagination Canonical & Robots `[#20]`

**Target:** Index page `generateMetadata`.

```ts
export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const { locale } = await params;
  const { page, category } = (await searchParams) ?? {};
  const isFiltered = Boolean(category);
  const isPaginated = Boolean(page) && page !== '1';

  return {
    // ...
    alternates: {
      canonical: `/${locale}/blog`, // collapse all filters/pages onto the base
      languages: { en: '/en/blog', es: '/es/blog', 'x-default': '/en/blog' },
    },
    robots:
      isFiltered || isPaginated
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}
```

(`generateMetadata` must accept `searchParams` — update its signature to match the page.)

---

### Instruction 18 — Audit Hard-Coded Strings & Locale Edge Cases `[#24] [#25] [#26] [#27] [#28]`

**Target:** All blog components plus `src/app/[locale]/layout.tsx`.

1. **Find every Spanish/English string literal** in JSX under `src/app/[locale]/blog/` and
   `src/components/blog/`. Replace with `t('blog.…')` lookups. Add the keys to **both**
   `messages/en.json` and `messages/es.json`. Suggested keys based on the audit:

   ```json
   {
     "blog": {
       "label": "Our Blog",
       "backToAll": "← Back to all articles",
       "featured": "Most Recent",
       "related": "Related Articles",
       "viewAll": "View All Articles",
       "shopNotes": "Shop Notes"
     }
   }
   ```

   ES equivalents in `es.json`:

   ```json
   {
     "blog": {
       "label": "Nuestro Blog",
       "backToAll": "← Volver a todos los artículos",
       "featured": "Más Reciente",
       "related": "Artículos Relacionados",
       "viewAll": "Ver Todos los Artículos",
       "shopNotes": "Notas del Taller"
     }
   }
   ```

2. **Date locale** — change `'es-ES'` to `'es-US'`:

   ```ts
   const dateFormatter = new Intl.DateTimeFormat(
     locale === 'es' ? 'es-US' : 'en-US',
     { year: 'numeric', month: 'short', day: 'numeric' },
   );
   ```

3. **`<html lang>`** — confirm the root layout sets it from the active locale:

   ```tsx
   // src/app/[locale]/layout.tsx
   export default async function LocaleLayout({ children, params }) {
     const { locale } = await params;
     return (
       <html lang={locale} dir="ltr">
         <body>{children}</body>
       </html>
     );
   }
   ```

4. **`og:locale` format** — emit `language_TERRITORY` with all alternates:

   ```ts
   openGraph: {
     locale: locale === 'es' ? 'es_US' : 'en_US',
     alternateLocale: routing.locales
       .filter((l) => l !== locale)
       .map((l) => (l === 'es' ? 'es_US' : 'en_US')),
   },
   ```

5. **Category fallback** — when a Payload category has no localized name, render the slug
   capitalized rather than the EN value bleeding into the ES page. In the query layer:

   ```ts
   name: cat.name ?? toTitleCase(cat.slug.replace(/-/g, ' ')),
   ```

   Better: enforce required ES translation in the Payload collection config.

6. **Localized image alt** — confirm the Payload `media` collection has `alt` as a
   **localized** field. If it doesn't, migrate it. Until then, render a locale-aware fallback:
   ```tsx
   const altText =
     post.featuredImage?.alt ??
     (locale === 'es'
       ? `Foto del artículo: ${post.title}`
       : `Article photo: ${post.title}`);
   ```

---

## Priority Order for Implementation

### Critical (do first — fixes 404s, missing rich results, broken share previews)

1. 🔴 `[#23]` Locale switcher 404 on diverging slugs — **highest user-facing i18n bug**
2. 🔴 `[#15]` Wire `metadataBase` in root layout (one-line, unblocks all OG tags)
3. 🔴 `[#14]` `BlogPosting` JSON-LD on detail page
4. 🔴 `[#02]` Fix the whitespace gap — most visually broken issue
5. 🔴 `[#01]` Fix page header contrast — first thing visitors see

### Major (SEO surface + user flow)

6. 🟠 `[#16]` `hreflang` per-post with `x-default` (uses post.localizedSlugs)
7. 🟠 `[#17]` `og:image` + `twitter:card` on both pages
8. 🟠 `[#19]` Localized `sitemap.ts` (one entry per locale × post)
9. 🟠 `[#18]` `BreadcrumbList` JSON-LD
10. 🟠 `[#24]` Strip hard-coded strings; route through `t()`
11. 🟠 `[#08]` Fix Related Articles — dead section wastes real estate
12. 🟠 `[#07]` Fix Volver button margin
13. 🟠 `[#03]` Elevate featured post card
14. 🟠 `[#04]` Add card hover effects

### Minor (polish + correctness)

15. 🟡 `[#09]` Fix breadcrumb i18n (visual + uses #18 schema)
16. 🟡 `[#26]` `<html lang>` reflects locale
17. 🟡 `[#27]` `og:locale` `language_TERRITORY` format
18. 🟡 `[#20]` Filter/pagination `noindex` + canonical
19. 🟡 `[#25]` Date locale `es-US` instead of `es-ES`
20. 🟡 `[#10]` Add author/article separator
21. 🟡 `[#05]` Filter row separator
22. 🟡 `[#06]` MÁS RECIENTE label
23. 🟡 `[#21]` Localized image `alt` text
24. 🟡 `[#22]` `robots.ts` references sitemap
25. 🟡 `[#28]` Category name locale fallback

### Enhancement

26. 🔵 `[#12]` Reading progress bar
27. 🔵 `[#13]` Card stagger animation
28. 🔵 `[#11]` Hero gradient overlay

---

## Verification Checklist (run after fixes)

**SEO:**

- [ ] `view-source:` on `/en/blog/[slug]` and `/es/blog/[slug]` shows absolute `<link rel="canonical">`
- [ ] Both pages emit `<link rel="alternate" hreflang="en">`, `hreflang="es"`, `hreflang="x-default"`
- [ ] Detail page contains a `<script type="application/ld+json">` with `@type: BlogPosting` and validates in Rich Results Test
- [ ] OG/Twitter previews render in [opengraph.xyz](https://www.opengraph.xyz/) for one EN and one ES post
- [ ] `https://<site>/sitemap.xml` lists every post under both `/en/blog/` and `/es/blog/` with `xhtml:link` alternates
- [ ] `?category=…` and `?page=2` URLs return `<meta name="robots" content="noindex, follow">`

**i18n:**

- [ ] Toggling the locale switcher on `/en/blog/signs-hidden-structural-damage` lands on the **Spanish slug**, not 404
- [ ] No EN string visible on `/es/blog` and no ES string visible on `/en/blog` (grep components for hard-coded strings)
- [ ] `<html lang>` matches the URL locale on every blog page
- [ ] Date format reads `25 abr 2026` (es-US) on Spanish pages
- [ ] Featured-image `alt` text reads in the active locale (or has a locale-aware fallback)

---

_Audit by Claude × Ibudidev — Blog UX + SEO + i18n Audit v2.0_

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
  fetchPostLocalizedSlugs,
  fetchRelatedPosts,
} from '@/lib/queries/blog.server';
import type { BlogPost } from '@/lib/queries/types';
import { routing } from '@/i18n/routing';
import {
  ArticleJsonLd,
  BlogBreadcrumbJsonLd,
} from '@/components/seo/ArticleJsonLd';
import { LocalBusinessJsonLd } from '@/components/seo';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { getBusinessRating } from '@/lib/google-places';
import { computeReadingTime } from '@/lib/reading-time';
import BreadcrumbTitleSetter from '@/components/BreadcrumbTitleSetter';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate static paths for all published blog posts
export async function generateStaticParams() {
  const locales = ['en', 'es'];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    try {
      const posts = await fetchBlogPosts({ locale, limit: 100 });
      for (const post of posts.docs) {
        params.push({ locale, slug: post.slug });
      }
    } catch (error) {
      console.error(`Failed to fetch posts for ${locale}:`, error);
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await fetchBlogPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.meta?.title || post.title;
  const description = post.meta?.description || post.excerpt;
  const imageUrl = post.meta?.ogImage?.url || post.featuredImage?.url;

  const localizedSlugs = await fetchPostLocalizedSlugs(post.id);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const s = localizedSlugs[l];
    if (s) languages[l] = `/${l}/blog/${s}`;
  }
  const defaultSlug = localizedSlugs[routing.defaultLocale] ?? post.slug;
  languages['x-default'] = `/${routing.defaultLocale}/blog/${defaultSlug}`;

  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const alternateOgLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => (l === 'es' ? 'es_US' : 'en_US'));

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.fullName,
      section: post.categories?.[0]?.name,
      tags: post.categories?.map((cat) => cat.name),
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.featuredImage?.alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  const [t, common, overlinesT, post, rating] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'overlines' }),
    fetchBlogPostBySlug(slug, locale),
    getBusinessRating(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = await fetchRelatedPosts({
    locale,
    excludeSlug: post.slug,
    categorySlugs: post.categories?.map((c) => c.slug) ?? [],
    limit: 3,
  });

  // Format dates
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt)
    : new Date(post.createdAt);
  const formattedDate = publishDate.toLocaleDateString(
    locale === 'es' ? 'es-US' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  return (
    <div className="min-h-screen">
      <BreadcrumbTitleSetter title={post.title} />
      {/* JSON-LD Schemas */}
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />
      <ArticleJsonLd post={post} locale={locale} />
      <BlogBreadcrumbJsonLd
        post={post}
        locale={locale}
        homeLabel={common('home')}
        blogLabel={overlinesT('blog')}
      />

      {/* Article Header */}
      <article className="bg-background">
        {/* Hero Section with Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-[40vh] min-h-[300px] max-h-[500px]">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-primary transition-colors"
                >
                  {common('home')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-primary transition-colors"
                >
                  {overlinesT('blog')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/blog?category=${cat.slug}`}
                  className="inline-flex items-center rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground transition-colors duration-150 hover:border-primary/40 hover:bg-red-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-display mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {/* Author */}
            {post.author?.fullName && (
              <div className="flex items-center gap-2">
                {post.author.photo && (
                  <Image
                    src={post.author.photo.url}
                    alt={post.author.photo.alt || post.author.fullName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <span className="font-medium text-foreground">
                    {post.author.fullName}
                  </span>
                  <p className="text-xs">{t('authorLabel')}</p>
                </div>
              </div>
            )}

            {/* Publish Date */}
            <div className="flex items-center gap-2">
              <time dateTime={post.publishedAt || post.createdAt}>
                {formattedDate}
              </time>
            </div>

            {/* Reading Time Estimate */}
            <div className="flex items-center gap-2">
              <span>
                {computeReadingTime(post.content)} {t('minRead')}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
            <RichTextRenderer content={post.content} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                {t('tagsLabel')}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tagObj, index) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full"
                  >
                    #{tagObj.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="border-t border-border pt-8 mb-12">
            <p className="overline mb-3" aria-hidden="true">
              {t('sharePost')}
            </p>
            <div className="flex gap-2">
              <ShareLink
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`,
                )}`}
                label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </ShareLink>
              <ShareLink
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`,
                )}&text=${encodeURIComponent(post.title)}`}
                label="X"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </ShareLink>
              <ShareLink
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`,
                )}&title=${encodeURIComponent(post.title)}`}
                label="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </ShareLink>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 border-t border-border pt-10 pb-4">
            <ButtonLink href={`/${locale}/blog`} variant="secondary" size="sm">
              ← {t('backToBlog')}
            </ButtonLink>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <SectionHeading
                overline={t('relatedOverline')}
                heading={t('relatedTitle')}
                centered
              />
              <p className="mt-4 text-muted-foreground">
                {t('relatedDescription')}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {relatedPosts.map((rp) => (
                <li key={rp.id}>
                  <RelatedCard post={rp} locale={locale} />
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <ButtonLink href={`/${locale}/blog`} variant="primary">
                {t('viewAllPosts')}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section
        className="bg-[#c62828] py-16 text-white"
        aria-labelledby="post-cta-heading"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="post-cta-heading"
            className="font-display text-3xl md:text-4xl font-bold tracking-display"
          >
            {t('cta.title')}
          </h2>
          <p className="max-w-2xl text-base text-[#ffe0e0]">
            {t('cta.description')}
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/get-a-quote" variant="inverted" size="lg">
              {t('cta.button')}
            </ButtonLink>
            <ButtonLink
              href="tel:3015788779"
              variant="outline-white"
              size="lg"
              aria-label={t('cta.phoneAriaLabel')}
            >
              {t('cta.phone')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

interface RelatedCardProps {
  post: BlogPost;
  locale: string;
}

function RelatedCard({ post, locale }: RelatedCardProps) {
  const primaryCategory = post.categories?.[0];
  return (
    <article className="group h-full">
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="block h-full overflow-hidden rounded-sm transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="relative mb-4 aspect-[3/2] overflow-hidden bg-secondary">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-red-surface">
              <span className="font-display text-2xl font-bold text-primary/60">
                {primaryCategory?.name ?? 'Prestige'}
              </span>
            </div>
          )}
        </div>
        {primaryCategory && (
          <span className="mb-2 inline-block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-primary">
            {primaryCategory.name}
          </span>
        )}
        <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}

interface ShareLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function ShareLink({ href, label, children }: ShareLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-150 hover:border-primary/40 hover:bg-red-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {children}
    </a>
  );
}

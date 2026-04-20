import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/queries/blog.server';
import {
  ArticleJsonLd,
  BlogBreadcrumbJsonLd,
} from '@/components/seo/ArticleJsonLd';
import { LocalBusinessJsonLd } from '@/components/seo';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { getBusinessRating } from '@/lib/google-places';

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

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        es: `/es/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name,
      section: post.categories?.[0]?.name,
      tags: post.categories?.map((cat) => cat.name),
      locale,
      alternateLocale: locale === 'en' ? 'es' : 'en',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
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

  const [t, common, post, rating] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'common' }),
    fetchBlogPostBySlug(slug, locale),
    getBusinessRating(),
  ]);

  if (!post) {
    notFound();
  }

  // Format dates
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt)
    : new Date(post.createdAt);
  const formattedDate = publishDate.toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schemas */}
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />
      <ArticleJsonLd post={post} locale={locale} />
      <BlogBreadcrumbJsonLd post={post} locale={locale} />

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
                  {t('title')}
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
                  className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {/* Author */}
            {post.author?.name && (
              <div className="flex items-center gap-2">
                {post.author.photo && (
                  <Image
                    src={post.author.photo.url}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <span className="font-medium text-foreground">
                    {post.author.name}
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
                {Math.ceil((post.excerpt?.length || 0) / 1000)} {t('minRead')}
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
            <h3 className="text-lg font-semibold mb-4">{t('sharePost')}</h3>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`,
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`,
                )}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="border-t border-border pt-8">
            <ButtonLink href={`/${locale}/blog`} variant="secondary" size="sm">
              ← {t('backToBlog')}
            </ButtonLink>
          </div>
        </div>
      </article>

      {/* Related Posts Section - Could be expanded in future */}
      <section className="bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            overline={t('relatedOverline')}
            heading={t('relatedTitle')}
            centered
          />
          <p className="text-muted-foreground mt-4">
            {t('relatedDescription')}
          </p>
          <div className="mt-8">
            <ButtonLink href={`/${locale}/blog`} variant="primary">
              {t('viewAllPosts')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

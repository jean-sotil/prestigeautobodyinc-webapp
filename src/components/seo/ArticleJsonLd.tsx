import { BUSINESS_INFO } from '@/lib/business';
import type { BlogPost } from '@/lib/queries/types';

interface ArticleJsonLdProps {
  post: BlogPost;
  locale?: string;
}

// Map next-intl locales to BCP-47 tags Google expects in inLanguage / og:locale.
function bcp47(locale: string): string {
  if (locale === 'es') return 'es-US';
  if (locale === 'en') return 'en-US';
  return locale;
}

/**
 * BlogPosting JSON-LD for blog posts. Uses the more specific schema.org
 * `BlogPosting` type (Google rich results recognise both Article and
 * BlogPosting; the latter signals the post is part of a blog).
 */
export function ArticleJsonLd({ post, locale = 'en' }: ArticleJsonLdProps) {
  const siteUrl = BUSINESS_INFO.url;
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`;
  const imageUrl = post.featuredImage?.url || BUSINESS_INFO.image;

  const datePublished = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();

  const dateModified = new Date(post.updatedAt).toISOString();

  const categoryNames = post.categories?.map((cat) => cat.name) || [];
  const tagNames = post.tags?.map((tagObj) => tagObj.tag) || [];
  const keywords = [...categoryNames, ...tagNames].join(', ');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}/#article`,
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      '@id': post.author?.id
        ? `${siteUrl}/#author-${post.author.id}`
        : undefined,
      name: post.author?.fullName || 'Prestige Auto Body',
      url: post.author?.id ? `${siteUrl}/our-team` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#business`,
      name: BUSINESS_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: BUSINESS_INFO.logo,
        width: 600,
        height: 60,
      },
    },
    datePublished,
    dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    keywords: keywords || undefined,
    inLanguage: bcp47(locale),
    articleSection: categoryNames[0] || 'Blog',
  };

  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

interface BlogBreadcrumbJsonLdProps {
  post: BlogPost;
  locale?: string;
  homeLabel?: string;
  blogLabel?: string;
}

/**
 * BreadcrumbList JSON-LD. Accepts localized labels — fall back to English
 * defaults so existing call-sites keep working.
 */
export function BlogBreadcrumbJsonLd({
  post,
  locale = 'en',
  homeLabel = 'Home',
  blogLabel = 'Blog',
}: BlogBreadcrumbJsonLdProps) {
  const siteUrl = BUSINESS_INFO.url;
  const blogUrl = `${siteUrl}/${locale}/blog`;
  const postUrl = `${blogUrl}/${post.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: `${siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: blogLabel,
        item: blogUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ArticleJsonLd;

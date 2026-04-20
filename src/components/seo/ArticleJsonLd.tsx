import { BUSINESS_INFO } from '@/lib/business';
import type { BlogPost } from '@/lib/queries/types';

interface ArticleJsonLdProps {
  post: BlogPost;
  locale?: string;
}

/**
 * Generate Article schema.org JSON-LD for blog posts
 * Includes all required fields for Google Rich Results
 */
export function ArticleJsonLd({ post, locale = 'en' }: ArticleJsonLdProps) {
  const siteUrl = BUSINESS_INFO.url;
  const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`;
  const imageUrl = post.featuredImage?.url || BUSINESS_INFO.image;

  // Convert publishedAt to ISO string if available
  const datePublished = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();

  const dateModified = new Date(post.updatedAt).toISOString();

  // Build keywords from categories and tags
  const categoryNames = post.categories?.map((cat) => cat.name) || [];
  const tagNames = post.tags?.map((tagObj) => tagObj.tag) || [];
  const keywords = [...categoryNames, ...tagNames].join(', ');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
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
      name: post.author?.name || 'Prestige Auto Body',
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
    inLanguage: locale,
    articleSection: categoryNames[0] || 'Blog',
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

/**
 * Generate BreadcrumbList schema.org JSON-LD for blog posts
 */
export function BlogBreadcrumbJsonLd({
  post,
  locale = 'en',
}: {
  post: BlogPost;
  locale?: string;
}) {
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
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
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

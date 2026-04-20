import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogPosts, fetchBlogCategories } from '@/lib/queries/blog.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { LocalBusinessJsonLd } from '@/components/seo';
import { getBusinessRating } from '@/lib/google-places';

interface BlogIndexPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        es: '/es/blog',
      },
    },
    openGraph: {
      title: t('og.title'),
      description: t('og.description'),
      type: 'website',
      locale,
      alternateLocale: locale === 'en' ? 'es' : 'en',
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: BlogIndexPageProps) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;
  const page = parseInt(pageParam || '1', 10);
  const limit = 9;

  const [t, common, rating, blogPosts, categories] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'common' }),
    getBusinessRating(),
    fetchBlogPosts({ locale, page, limit, category }),
    fetchBlogCategories(locale),
  ]);

  const posts = blogPosts.docs;
  const hasNextPage = blogPosts.hasNextPage;
  const hasPrevPage = blogPosts.hasPrevPage;

  if (posts.length === 0 && page > 1) {
    notFound();
  }

  const buildCategoryUrl = (catSlug?: string) => {
    const url = new URLSearchParams();
    if (catSlug) url.set('category', catSlug);
    if (page > 1 && !catSlug) url.set('page', page.toString());
    const queryString = url.toString();
    return queryString ? `?${queryString}` : '';
  };

  return (
    <div className="min-h-screen">
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />

      {/* Header Section */}
      <section className="bg-muted py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline={t('overline')}
            heading={t('title')}
            centered
          />
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground mr-2">
                {t('filterByCategory')}:
              </span>
              <Link
                href={`/${locale}/blog`}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !category
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {t('allCategories')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/blog${buildCategoryUrl(cat.slug)}`}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    category === cat.slug
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t('noPosts')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
                  >
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt || post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground text-sm">
                              {common('noImage')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        {/* Categories */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories.slice(0, 3).map((cat) => (
                              <span
                                key={cat.id}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {post.author?.name && (
                              <span>{post.author.name}</span>
                            )}
                          </div>
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString(
                                locale === 'es' ? 'es-ES' : 'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )}
                            </time>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {(hasPrevPage || hasNextPage) && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  {hasPrevPage && (
                    <ButtonLink
                      href={`/${locale}/blog?page=${page - 1}${
                        category ? `&category=${category}` : ''
                      }`}
                      variant="secondary"
                      size="sm"
                    >
                      {common('previous')}
                    </ButtonLink>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {t('page')} {page} {t('of')} {blogPosts.totalPages}
                  </span>
                  {hasNextPage && (
                    <ButtonLink
                      href={`/${locale}/blog?page=${page + 1}${
                        category ? `&category=${category}` : ''
                      }`}
                      variant="secondary"
                      size="sm"
                    >
                      {common('next')}
                    </ButtonLink>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

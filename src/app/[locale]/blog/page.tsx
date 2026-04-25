import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ButtonLink } from '@/components/ui/Button';
import { LocalBusinessJsonLd } from '@/components/seo';
import { getBusinessRating } from '@/lib/google-places';
import {
  fetchBlogCategories,
  fetchBlogContributors,
  fetchBlogPosts,
  fetchCategoryPostCounts,
} from '@/lib/queries/blog.server';
import type { BlogPost } from '@/lib/queries/types';
import { computeReadingTime } from '@/lib/reading-time';

const PAGE_SIZE = 12;
const GRID_COUNT = 6;

interface BlogIndexPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string; category?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale, namespace: 'blog' });

  // Filtered/paginated views collapse onto the base canonical and are
  // marked noindex so crawl budget isn't spent on permutations.
  const isFiltered = Boolean(sp.category);
  const isPaginated = Boolean(sp.page) && sp.page !== '1';

  const ogImage = '/hero/homepage/desktop/homepage-hero-desktop.webp';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        es: '/es/blog',
        'x-default': '/en/blog',
      },
    },
    robots:
      isFiltered || isPaginated
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      title: t('og.title'),
      description: t('og.description'),
      type: 'website',
      locale: ogLocale,
      alternateLocale: locale === 'en' ? 'es_US' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: t('og.title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('og.title'),
      description: t('og.description'),
      images: [ogImage],
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: BlogIndexPageProps) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);

  const [
    t,
    commonT,
    overlinesT,
    rating,
    blogPosts,
    categories,
    catCounts,
    contributors,
  ] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'overlines' }),
    getBusinessRating(),
    fetchBlogPosts({ locale, page, limit: PAGE_SIZE, category }),
    fetchBlogCategories(locale),
    fetchCategoryPostCounts(locale),
    fetchBlogContributors(locale),
  ]);

  const posts = blogPosts.docs;
  if (posts.length === 0 && page > 1) notFound();

  const [featured, ...rest] = posts;
  const gridPosts = rest.slice(0, GRID_COUNT);
  const archivePosts = rest.slice(GRID_COUNT);

  const dateFormatter = new Intl.DateTimeFormat(
    locale === 'es' ? 'es-US' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );

  const activeCategory = category
    ? categories.find((c) => c.slug === category)
    : undefined;

  const buildPageUrl = (p: number) => {
    const qs = new URLSearchParams();
    if (p > 1) qs.set('page', String(p));
    if (category) qs.set('category', category);
    const s = qs.toString();
    return `/${locale}/blog${s ? `?${s}` : ''}`;
  };

  return (
    <div className="min-h-screen">
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />

      {/* ── Masthead ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-muted dark:bg-[#1A1A1A]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <span
              className="overline motion-safe:animate-fade-in-up"
              aria-hidden="true"
            >
              {overlinesT('blog')}
            </span>

            <h1
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-display text-foreground mb-4 motion-safe:animate-fade-in-up"
              style={{ animationDelay: '80ms' }}
            >
              {t('hero.title')}
            </h1>

            <div
              className="mb-6 flex items-center gap-1.5 motion-safe:animate-fade-in-up"
              style={{ animationDelay: '120ms' }}
              aria-hidden="true"
            >
              <span className="block h-[3px] w-10 rounded-full bg-primary" />
              <span className="block h-[3px] w-3 rounded-full bg-primary/40" />
              <span className="block h-[3px] w-1.5 rounded-full bg-primary/20" />
            </div>

            <p
              className="max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground motion-safe:animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {t('hero.credential')}
            </p>

            {contributors.length > 0 && (
              <div
                className="mt-8 motion-safe:animate-fade-in-up"
                style={{ animationDelay: '280ms' }}
              >
                <p className="overline mb-3" aria-hidden="true">
                  {t('hero.authorsOverline')}
                </p>
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  {contributors.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center gap-2.5"
                      title={`${c.fullName} — ${c.position}`}
                    >
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                        {c.photoUrl ? (
                          <Image
                            src={c.photoUrl}
                            alt={c.photoAlt || c.fullName}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary text-[0.6875rem] font-semibold text-muted-foreground">
                            {getInitials(c.fullName)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {c.fullName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Category rail ────────────────────────────────────── */}
      {categories.length > 0 && (
        <nav
          aria-label={t('filter.label')}
          className="border-b border-border bg-background"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex items-center gap-2 overflow-x-auto py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="list"
            >
              <span className="shrink-0 pr-2 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t('filter.label')}
              </span>
              <Link
                role="listitem"
                href={`/${locale}/blog`}
                aria-current={!category ? 'page' : undefined}
                className={pillClass(!category)}
              >
                {t('filter.all')}
              </Link>
              {categories.map((cat) => {
                const count = catCounts[cat.slug] ?? 0;
                if (count === 0) return null;
                const active = category === cat.slug;
                return (
                  <Link
                    role="listitem"
                    key={cat.id}
                    href={`/${locale}/blog?category=${cat.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={pillClass(active)}
                  >
                    <span>{cat.name}</span>
                    <span className="tabular-nums opacity-70">({count})</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* ── Feed ─────────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-display text-foreground">
              {category
                ? t('empty.filtered', {
                    category: activeCategory?.name ?? category,
                  })
                : t('empty.none')}
            </h2>
            {category && (
              <Link
                href={`/${locale}/blog`}
                className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:underline"
              >
                <span aria-hidden="true">←</span>
                {t('empty.filteredReset')}
              </Link>
            )}
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <FeaturedPost
              post={featured}
              locale={locale}
              dateFormatter={dateFormatter}
              labels={{
                featured: t('feed.featured'),
                minRead: t('minRead'),
                by: t('meta_row.by'),
              }}
            />
          )}

          {gridPosts.length > 0 && (
            <section>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="sr-only">{t('feed.recentHeading')}</h2>
                <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
                  {gridPosts.map((post) => (
                    <li key={post.id}>
                      <GridCard
                        post={post}
                        locale={locale}
                        dateFormatter={dateFormatter}
                        byLabel={t('meta_row.by')}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {archivePosts.length > 0 && (
            <section className="border-t border-border bg-muted dark:bg-[#1E1E1E]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="overline mb-4">{t('feed.archiveHeading')}</h2>
                <ul className="divide-y divide-border">
                  {archivePosts.map((post) => (
                    <li key={post.id}>
                      <ArchiveRow
                        post={post}
                        locale={locale}
                        dateFormatter={dateFormatter}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {blogPosts.totalPages > 1 && (
            <nav aria-label="Pagination" className="border-t border-border">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <Pagination
                  page={page}
                  totalPages={blogPosts.totalPages}
                  buildUrl={buildPageUrl}
                  labels={{
                    prev: commonT('previous'),
                    next: commonT('next'),
                    page: t('pager.page'),
                    of: t('pager.of'),
                  }}
                />
              </div>
            </nav>
          )}
        </>
      )}

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section
        className="bg-[#c62828] py-16 text-white"
        aria-labelledby="blog-cta-heading"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="blog-cta-heading"
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

/* ──────────────────────────────────────────────────────────── */
/*  Local components                                             */
/* ──────────────────────────────────────────────────────────── */

function pillClass(active: boolean): string {
  const base =
    'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  return active
    ? `${base} bg-primary text-primary-foreground`
    : `${base} border border-border text-muted-foreground hover:border-primary/40 hover:bg-red-surface hover:text-foreground`;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface TypographicFallbackProps {
  label?: string;
  variant?: 'featured' | 'grid' | 'archive';
}

function TypographicFallback({
  label,
  variant = 'grid',
}: TypographicFallbackProps) {
  const size =
    variant === 'featured'
      ? 'text-2xl sm:text-3xl md:text-4xl'
      : variant === 'grid'
        ? 'text-xl md:text-2xl'
        : 'text-sm';
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-red-surface p-4"
      aria-hidden="true"
    >
      <span
        className={`font-display font-extrabold tracking-display text-primary/60 leading-none ${size}`}
      >
        {(label ?? 'Prestige').slice(0, variant === 'archive' ? 2 : undefined)}
      </span>
    </div>
  );
}

interface FeaturedPostProps {
  post: BlogPost;
  locale: string;
  dateFormatter: Intl.DateTimeFormat;
  labels: { featured: string; minRead: string; by: string };
}

function FeaturedPost({
  post,
  locale,
  dateFormatter,
  labels,
}: FeaturedPostProps) {
  const readingTime = computeReadingTime(post.content);
  const primaryCategory = post.categories?.[0];
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <span className="overline mb-6 inline-block" aria-hidden="true">
          {labels.featured}
        </span>
        <article className="overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow duration-300 hover:shadow-md">
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="group grid items-start gap-0 md:grid-cols-5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary md:col-span-2">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  priority
                />
              ) : (
                <TypographicFallback
                  label={primaryCategory?.name}
                  variant="featured"
                />
              )}
            </div>
            <div className="md:col-span-3 p-6 md:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="mb-4 h-[3px] w-12 bg-primary"
              />
              {primaryCategory && (
                <span className="mb-3 inline-block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-primary">
                  {primaryCategory.name}
                </span>
              )}
              <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-display text-foreground transition-colors duration-200 group-hover:text-primary">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-4 max-w-[62ch] text-base md:text-lg leading-relaxed text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <MetaRow
                post={post}
                dateFormatter={dateFormatter}
                readingTime={readingTime}
                minReadLabel={labels.minRead}
                byLabel={labels.by}
                size="lg"
              />
            </div>
          </Link>
        </article>
      </div>
    </section>
  );
}

interface GridCardProps {
  post: BlogPost;
  locale: string;
  dateFormatter: Intl.DateTimeFormat;
  byLabel: string;
}

function GridCard({ post, locale, dateFormatter, byLabel }: GridCardProps) {
  const primaryCategory = post.categories?.[0];
  return (
    <article className="h-full">
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group block h-full rounded-sm border-b-2 border-transparent pb-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="relative mb-5 aspect-[3/2] overflow-hidden bg-secondary">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          ) : (
            <TypographicFallback label={primaryCategory?.name} variant="grid" />
          )}
        </div>
        {primaryCategory && (
          <span className="mb-2 inline-block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-primary">
            {primaryCategory.name}
          </span>
        )}
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2.5 text-sm md:text-base leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <MetaRow
          post={post}
          dateFormatter={dateFormatter}
          byLabel={byLabel}
          size="sm"
        />
      </Link>
    </article>
  );
}

interface ArchiveRowProps {
  post: BlogPost;
  locale: string;
  dateFormatter: Intl.DateTimeFormat;
}

function ArchiveRow({ post, locale, dateFormatter }: ArchiveRowProps) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex items-start gap-5 py-5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-background">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <TypographicFallback
            label={post.categories?.[0]?.name}
            variant="archive"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base md:text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="tabular-nums">
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
          )}
          {post.categories?.[0] && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.categories[0].name}</span>
            </>
          )}
          {post.author?.fullName && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.author.fullName}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

interface MetaRowProps {
  post: BlogPost;
  dateFormatter: Intl.DateTimeFormat;
  readingTime?: number;
  minReadLabel?: string;
  byLabel: string;
  size: 'sm' | 'lg';
}

function MetaRow({
  post,
  dateFormatter,
  readingTime,
  minReadLabel,
  byLabel,
  size,
}: MetaRowProps) {
  const textClass =
    size === 'lg'
      ? 'text-xs md:text-sm tracking-[0.08em]'
      : 'text-[0.6875rem] tracking-[0.08em]';
  return (
    <div
      className={`mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 uppercase text-muted-foreground ${textClass}`}
    >
      {post.author?.fullName && (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-muted-foreground/70">{byLabel}</span>
          <span className="font-semibold text-foreground">
            {post.author.fullName}
          </span>
        </span>
      )}
      {post.publishedAt && (
        <>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt} className="tabular-nums">
            {dateFormatter.format(new Date(post.publishedAt))}
          </time>
        </>
      )}
      {readingTime && minReadLabel && (
        <>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {readingTime} {minReadLabel}
          </span>
        </>
      )}
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  buildUrl: (page: number) => string;
  labels: { prev: string; next: string; page: string; of: string };
}

function Pagination({ page, totalPages, buildUrl, labels }: PaginationProps) {
  const pages = buildPagerPages(page, totalPages);
  const atFirst = page === 1;
  const atLast = page === totalPages;

  return (
    <div className="flex items-center justify-between gap-4 md:justify-center md:gap-8">
      <PagerNav
        direction="prev"
        disabled={atFirst}
        href={buildUrl(page - 1)}
        label={labels.prev}
      />

      <ul className="hidden items-center gap-1.5 md:flex">
        {pages.map((p, i) =>
          p === 'gap' ? (
            <li
              key={`gap-${i}`}
              aria-hidden="true"
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={buildUrl(p)}
                aria-current={p === page ? 'page' : undefined}
                className={pagerNumClass(p === page)}
              >
                {String(p).padStart(2, '0')}
              </Link>
            </li>
          ),
        )}
      </ul>

      <span className="tabular-nums text-sm uppercase tracking-[0.08em] text-muted-foreground md:hidden">
        {labels.page}{' '}
        <strong className="text-foreground">
          {String(page).padStart(2, '0')}
        </strong>{' '}
        {labels.of}{' '}
        <span className="tabular-nums">
          {String(totalPages).padStart(2, '0')}
        </span>
      </span>

      <PagerNav
        direction="next"
        disabled={atLast}
        href={buildUrl(page + 1)}
        label={labels.next}
      />
    </div>
  );
}

function PagerNav({
  direction,
  disabled,
  href,
  label,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  href: string;
  label: string;
}) {
  const arrow = direction === 'prev' ? '←' : '→';
  const ordered =
    direction === 'prev' ? (
      <>
        <span aria-hidden="true">{arrow}</span>
        <span className="hidden md:inline">{label}</span>
      </>
    ) : (
      <>
        <span className="hidden md:inline">{label}</span>
        <span aria-hidden="true">{arrow}</span>
      </>
    );
  const base =
    'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 focus-visible:outline-none focus-visible:underline underline-offset-[6px]';
  if (disabled) {
    return (
      <span className={`${base} text-muted-foreground/40`} aria-hidden="true">
        {ordered}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} text-foreground hover:text-primary`}
      aria-label={label}
    >
      {ordered}
    </Link>
  );
}

function pagerNumClass(active: boolean): string {
  const base =
    'inline-flex min-w-9 items-center justify-center rounded-full px-3 py-1.5 text-sm tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  return active
    ? `${base} bg-primary text-primary-foreground font-semibold`
    : `${base} text-muted-foreground hover:bg-red-surface hover:text-foreground`;
}

function buildPagerPages(
  current: number,
  total: number,
): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const shown = new Set(
    [1, total, current - 1, current, current + 1].filter(
      (n) => n >= 1 && n <= total,
    ),
  );
  const result: Array<number | 'gap'> = [];
  let last = 0;
  for (let i = 1; i <= total; i++) {
    if (!shown.has(i)) continue;
    if (last && i - last > 1) result.push('gap');
    result.push(i);
    last = i;
  }
  return result;
}

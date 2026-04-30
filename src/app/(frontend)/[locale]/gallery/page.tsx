import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { PageHeroBanner } from '@/components/hero';
import { getHeroMedia, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import {
  GalleryGrid,
  type GalleryItem,
} from '@/components/gallery/GalleryGrid';
import { getGalleryAlbums } from '@/lib/gallery';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const EN_PATH = '/en/gallery';
const ES_PATH = '/es/galeria';
const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  const title = t('metaTitle');
  const description = t('metaDescription');
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const currentPath = locale === 'es' ? ES_PATH : EN_PATH;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${EN_PATH}`,
        es: `${BASE_URL}${ES_PATH}`,
        'x-default': `${BASE_URL}${EN_PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${currentPath}`,
      locale: ogLocale,
      alternateLocale: locale === 'en' ? 'es_US' : 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1920, height: 1080, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

interface AlbumLocale {
  title: string;
  description: string;
  /** Alt template containing the literal token `__INDEX__` (replaced per image). */
  imageAlt: string;
}

function humanizeSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getAlbumLocale(
  t: Awaited<ReturnType<typeof getTranslations>>,
  slug: string,
): AlbumLocale {
  const titleKey = `albums.${slug}.title`;
  const descKey = `albums.${slug}.description`;
  const altKey = `albums.${slug}.imageAlt`;
  const title = t.has(titleKey) ? t(titleKey) : humanizeSlug(slug);
  const description = t.has(descKey) ? t(descKey) : '';
  const imageAlt = t.has(altKey)
    ? t(altKey, { index: '__INDEX__' })
    : t('albums.fallbackImageAlt', { album: title, index: '__INDEX__' });
  return { title, description, imageAlt };
}

function buildItemAlt(template: string, index: number): string {
  return template.replace('__INDEX__', String(index));
}

function resolveImageAlt(
  t: Awaited<ReturnType<typeof getTranslations>>,
  slug: string,
  filename: string,
  index: number,
  fallbackTemplate: string,
): string {
  const stem = filename.replace(/\.[^.]+$/, '');
  const key = `albums.${slug}.alts.${stem}`;
  return t.has(key) ? t(key) : buildItemAlt(fallbackTemplate, index);
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, nav, albums, heroMedia] = await Promise.all([
    getTranslations({ locale, namespace: 'gallery' }),
    getTranslations({ locale, namespace: 'nav' }),
    getGalleryAlbums(),
    getHeroMedia('homepage'),
  ]);

  const currentPath = locale === 'es' ? ES_PATH : EN_PATH;
  const breadcrumbItems = generateBreadcrumbItems(
    nav('gallery'),
    currentPath,
    nav('home'),
    locale,
  );

  const flatItems: GalleryItem[] = albums.flatMap((album) => {
    const meta = getAlbumLocale(t, album.slug);
    return album.images.map((img, idx) => ({
      src: img.src,
      alt: resolveImageAlt(t, album.slug, img.filename, idx + 1, meta.imageAlt),
      title: meta.title,
    }));
  });

  const totalImages = flatItems.length;

  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: t('heading'),
    description: t('metaDescription'),
    inLanguage: locale,
    url: `${BASE_URL}${currentPath}`,
    numberOfItems: totalImages,
    image: flatItems.map((item) => ({
      '@type': 'ImageObject',
      contentUrl: `${BASE_URL}${item.src}`,
      url: `${BASE_URL}${item.src}`,
      name: item.title,
      description: item.alt,
      isPartOf: `${BASE_URL}${currentPath}`,
    })),
  };

  const labels = {
    openImage: t('openImage'),
    imageAriaLabel: t.raw('imageAriaLabel') as string,
    lightbox: {
      label: t('lightbox.label'),
      close: t('lightbox.close'),
      previous: t('lightbox.previous'),
      next: t('lightbox.next'),
      counter: t.raw('lightbox.counter') as string,
      instructions: t('lightbox.instructions'),
    },
  };

  return (
    <div className="font-sans min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      {totalImages > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
        />
      )}

      <PageHeroBanner
        slug="homepage"
        alt={pickAlt(heroMedia, locale, t('heroAlt'))}
        title={t('heroTitle')}
        heading={t('heading')}
        subtitle={t('subtitle')}
        media={heroMedia}
      />

      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16"
        aria-labelledby="gallery-heading"
      >
        <SectionHeading
          id="gallery-heading"
          overline={t('overline')}
          heading={t('heading')}
        />
        <p className="text-(--text-secondary) text-base leading-relaxed max-w-3xl mb-10">
          {t('intro')}
        </p>

        {totalImages === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-foreground/10 bg-secondary/40 p-10 text-center"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t('empty.heading')}
            </h2>
            <p className="text-(--text-secondary) text-sm">{t('empty.body')}</p>
          </div>
        ) : (
          albums.map((album) => {
            const meta = getAlbumLocale(t, album.slug);
            const total = album.images.length;
            const items: GalleryItem[] = album.images.map((img, idx) => ({
              src: img.src,
              alt: resolveImageAlt(
                t,
                album.slug,
                img.filename,
                idx + 1,
                meta.imageAlt,
              ),
              title: meta.title,
            }));
            const headingId = `album-${album.slug}-heading`;

            return (
              <section
                key={album.slug}
                aria-labelledby={headingId}
                className="mb-14 last:mb-0"
              >
                <header className="mb-6 flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2
                      id={headingId}
                      className="font-display text-2xl md:text-3xl font-bold tracking-display text-foreground"
                    >
                      {meta.title}
                    </h2>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
                      {t('albumPhotoCount', { count: total })}
                    </span>
                  </div>
                  {meta.description && (
                    <p className="text-(--text-secondary) text-sm leading-relaxed max-w-3xl">
                      {meta.description}
                    </p>
                  )}
                </header>

                <GalleryGrid items={items} labels={labels} />
              </section>
            );
          })
        )}
      </section>

      <section
        className="bg-[#c62828] py-16 text-white"
        aria-labelledby="gallery-cta-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
          <h2
            id="gallery-cta-heading"
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('cta.heading')}
          </h2>
          <p className="text-[#ffe0e0] text-base max-w-2xl">{t('cta.body')}</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/get-a-quote" variant="inverted" size="lg">
              {t('cta.primary')}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-white" size="lg">
              {t('cta.secondary')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

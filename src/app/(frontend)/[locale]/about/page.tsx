import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { PageHeroBanner } from '@/components/hero';
import { AboutContent } from './AboutContent';
import { getMediaByFilename, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  const title = t('metaTitle');
  const description = t('metaDescription');
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const currentPath = locale === 'es' ? '/nosotros' : '/about';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}${currentPath}`,
      languages: {
        en: `${BASE_URL}/en/about`,
        es: `${BASE_URL}/es/nosotros`,
        'x-default': `${BASE_URL}/en/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}${currentPath}`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'about' }),
    getMediaByFilename(
      'prestige-auto-body-collision-repair-team-silver-spring-maryland.jpg',
    ),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('about'),
    `/${locale}/about`,
    nav('home'),
    locale,
  );

  return (
    <div>
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <PageHeroBanner
        slug="lifetime-warranty"
        alt={pickAlt(heroMedia, locale, t('heroImageAlt'))}
        title={t('heroTitle')}
        heading={t('heading')}
        subtitle={t('subtitle')}
        media={heroMedia}
      />
      <AboutContent />
    </div>
  );
}

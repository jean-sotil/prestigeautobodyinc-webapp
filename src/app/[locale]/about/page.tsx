import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';
import { AboutContent } from './AboutContent';
import { getMediaByFilename, pickAlt } from '@/lib/heroMedia';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `https://prestigeautobodyinc.com/${locale}/about`,
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
    getTranslations('nav'),
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

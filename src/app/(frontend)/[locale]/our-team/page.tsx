import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

const PATHNAME = '/our-team' as const;

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === 'es'
      ? 'Nuestro Equipo | Prestige Auto Body Inc.'
      : 'Our Team | Prestige Auto Body Inc.';
  const description =
    locale === 'es'
      ? 'Conozca a nuestro equipo de técnicos certificados y profesionales de carrocería con décadas de experiencia combinada.'
      : 'Meet our team of certified technicians and auto body professionals with decades of combined experience in Silver Spring, MD.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const currentPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });
  const enPath = getPathname({ locale: 'en', href: PATHNAME });
  const esPath = getPathname({ locale: 'es', href: PATHNAME });

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        en: `${BASE_URL}${enPath}`,
        es: `${BASE_URL}${esPath}`,
        'x-default': `${BASE_URL}${enPath}`,
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

export default async function OurTeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });

  const localizedPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });

  const breadcrumbItems = generateBreadcrumbItems(
    t('ourTeam'),
    localizedPath,
    t('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('ourTeam')}</h1>
        <p className="text-lg text-muted-foreground">
          Meet our team of certified technicians and auto body professionals.
          With decades of combined experience, our team is dedicated to
          providing the highest quality repair services for your vehicle.
        </p>
      </section>
    </div>
  );
}

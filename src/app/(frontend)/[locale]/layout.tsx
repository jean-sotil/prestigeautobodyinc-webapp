import type { Metadata } from 'next';
import '../../globals.css';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';
import { WebsiteJsonLd } from '@/components/seo';
import { BreadcrumbProvider } from '@/components/BreadcrumbContext';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import AnalyticsUserProperties from '@/components/analytics/AnalyticsUserProperties';
import ConsentBanner from '@/components/analytics/ConsentBanner';

interface MessagesType {
  metadata?: {
    title?: string;
    description?: string;
  };
}

const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as MessagesType;

  const title = messages.metadata?.title || 'Prestige Auto Body Inc.';
  const description =
    messages.metadata?.description || 'Professional auto body repair services';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await getMessages({ locale })) as MessagesType;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <BreadcrumbProvider>
        <GoogleAnalytics />
        <AnalyticsUserProperties />
        <WebsiteJsonLd
          locale={locale}
          description={messages.metadata?.description}
        />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ConsentBanner />
      </BreadcrumbProvider>
    </NextIntlClientProvider>
  );
}

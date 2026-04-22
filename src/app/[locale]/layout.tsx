import type { Metadata } from 'next';
import '../globals.css';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';
import { WebsiteJsonLd } from '@/components/seo';

interface MessagesType {
  metadata?: {
    title?: string;
    description?: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as MessagesType;

  return {
    title: messages.metadata?.title || 'Prestige Auto Body Inc.',
    description:
      messages.metadata?.description ||
      'Professional auto body repair services',
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        es: '/es',
      },
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
      <WebsiteJsonLd
        locale={locale}
        description={messages.metadata?.description}
      />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}

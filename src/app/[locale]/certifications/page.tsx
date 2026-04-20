import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('nav');

  const breadcrumbItems = generateBreadcrumbItems(
    t('certifications'),
    `/${locale}/certifications`,
    t('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('certifications')}</h1>
        <p className="text-lg text-gray-600">
          Our technicians hold I-CAR and ASE certifications, ensuring that your
          vehicle is repaired by qualified professionals who follow industry
          best practices and safety standards.
        </p>
      </main>
    </div>
  );
}

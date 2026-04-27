import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';

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
      ? 'Asistencia de Alquiler de Autos | Prestige Auto Body Inc.'
      : 'Rental Car Assistance | Prestige Auto Body Inc.';
  const description =
    locale === 'es'
      ? 'Servicios de asistencia de alquiler para mantenerlo en la carretera mientras su vehículo está en reparación.'
      : 'Rental assistance services to keep you on the road while your vehicle is being repaired at our Silver Spring, MD facility.';
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const enPath = '/en/rental-assistance';
  const esPath = '/es/asistencia-de-alquiler';
  const currentPath = locale === 'es' ? esPath : enPath;

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

export default async function RentalAssistancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [nav, t] = await Promise.all([
    getTranslations('nav'),
    getTranslations('rental'),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('rentalAssistance'),
    `/${locale}/rental-assistance`,
    nav('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <ServiceJsonLd
        serviceName="Rental Car Assistance"
        description="Rental assistance services to keep you on the road while your vehicle is being repaired. Ask us about our rental car partnerships."
        url={`https://prestigeautobodyinc.com/${locale}/rental-assistance`}
        serviceType="Rental Assistance"
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{nav('rentalAssistance')}</h1>
        <p className="text-lg text-gray-600">
          We understand that being without your vehicle is inconvenient. We
          offer rental assistance services to keep you on the road while your
          vehicle is being repaired. Ask us about our rental car partnerships.
        </p>
      </main>
    </div>
  );
}

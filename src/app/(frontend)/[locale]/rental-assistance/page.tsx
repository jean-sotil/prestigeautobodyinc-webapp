import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';

const PATHNAME = '/rental-assistance' as const;

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
      ? 'Asistencia de Alquiler Silver Spring, MD'
      : 'Rental Car Assistance Silver Spring, MD';
  const description =
    locale === 'es'
      ? 'Asistencia de alquiler mientras reparamos su vehículo. Trabajamos con agentes de seguros. Manténgase en la carretera.'
      : 'Rental car assistance while we repair your vehicle. Coordinated with your insurance company. Stay on the road.';
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

export default async function RentalAssistancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [nav, t] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'services' }),
  ]);

  const localizedPath = getPathname({
    locale: locale as 'en' | 'es',
    href: PATHNAME,
  });

  const breadcrumbItems = generateBreadcrumbItems(
    nav('rentalAssistance'),
    localizedPath,
    nav('home'),
    locale,
  );

  const serviceAreas = t.raw('pages.rentalAssistance.serviceAreas');
  const relatedArticles = t.raw('pages.rentalAssistance.relatedArticles');

  return (
    <div className="font-sans min-h-screen">
      <ServiceJsonLd
        serviceName="Rental Car Assistance"
        description="Rental assistance services to keep you on the road while your vehicle is being repaired. Ask us about our rental car partnerships."
        url={`https://prestigeautobodyinc.com${localizedPath}`}
        serviceType="Rental Assistance"
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{nav('rentalAssistance')}</h1>
        <p className="text-lg text-gray-600 mb-12">
          We understand that being without your vehicle is inconvenient. We
          offer rental assistance services to keep you on the road while your
          vehicle is being repaired. Ask us about our rental car partnerships.
        </p>
      </main>

      {/* Service Areas by Location */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-4">{serviceAreas.heading}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          {serviceAreas.intro}
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {(
            serviceAreas.locations as Array<{
              city: string;
              description: string;
            }>
          ).map((location, idx) => (
            <div
              key={idx}
              className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-2xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
                {location.city}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {location.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Articles CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            {relatedArticles.heading}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {relatedArticles.description}
          </p>
          <a
            href={`/${locale}/blog`}
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition"
          >
            {relatedArticles.linkText} →
          </a>
        </div>
      </section>
    </div>
  );
}

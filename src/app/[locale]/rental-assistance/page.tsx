import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbJsonLd, generateBreadcrumbItems } from '@/components/seo';
import { ServiceJsonLd } from '@/components/services';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PageHeroBanner } from '@/components/hero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `https://prestigeautobodyinc.com/${locale}/contact`,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="font-sans min-h-screen">
      <PageHeroBanner
        slug="prestige-auto-body-storefront-optimized"
        alt={t('heroImageAlt')}
        title={t('heroTitle')}
        heading={t('heading')}
        subtitle={t('subtitle')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Ready to get started? Contact us today for a free estimate on your
              vehicle repair.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Phone:</strong> (301) 578-8779
              </p>
              <p>
                <strong>Email:</strong> info@prestigeautobody.com
              </p>
              <p>
                <strong>Address:</strong> 928 Philadelphia Ave, Silver Spring,
                MD 20910
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
            <div className="space-y-2">
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 8:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BASE_URL } from '@/lib/seo';
import { PageHeroBanner } from '@/components/hero';
import { getMediaByFilename, pickAlt } from '@/lib/heroMedia';
import {
  LocalBusinessJsonLd,
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
} from '@/components/seo';
import { getBusinessRating } from '@/lib/google-places';

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

  const title = t('metaTitle');
  const description = t('metaDescription');
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';
  const enPath = '/en/contact';
  const esPath = '/es/contacto';
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, heroMedia, rating, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    getMediaByFilename(
      'prestige-auto-body-icar-gold-class-certified-collision-repair-silver-spring.jpg',
    ),
    getBusinessRating(),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  const breadcrumbItems = generateBreadcrumbItems(
    nav('contact'),
    `/${locale}/contact`,
    nav('home'),
    locale,
  );

  return (
    <div className="font-sans min-h-screen">
      <LocalBusinessJsonLd
        ratingValue={rating.ratingValue}
        reviewCount={rating.reviewCount}
        locale={locale}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
      <PageHeroBanner
        slug="homepage"
        alt={pickAlt(heroMedia, locale, t('heroImageAlt'))}
        title={t('heroTitle')}
        heading={t('heading')}
        subtitle={t('subtitle')}
        media={heroMedia}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Ready to get started? Contact us today for a free quote on your
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

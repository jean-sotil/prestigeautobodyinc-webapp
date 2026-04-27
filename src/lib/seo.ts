import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const BASE_URL = 'https://www.prestigeautobodyinc.com';
export const DEFAULT_OG_IMAGE = '/hero/homepage/desktop/homepage-hero-desktop.webp';

/**
 * Build a complete Metadata object with OG, Twitter, hreflang alternates, and canonical.
 */
export function buildPageMetadata({
  title,
  description,
  locale,
  enPath,
  esPath,
  ogImage,
}: {
  title: string;
  description: string;
  locale: string;
  enPath: string;
  esPath: string;
  ogImage?: string;
}): Metadata {
  const currentPath = locale === 'es' ? esPath : enPath;
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US';
  const alternateOgLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => (l === 'es' ? 'es_US' : 'en_US'));
  const image = ogImage || DEFAULT_OG_IMAGE;

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
      siteName: 'Prestige Auto Body Inc.',
      locale: ogLocale,
      alternateLocales: alternateOgLocales,
      type: 'website',
      images: [
        {
          url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${BASE_URL}${image}`],
    },
  };
}

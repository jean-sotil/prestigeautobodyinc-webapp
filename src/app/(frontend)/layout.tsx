import type { Metadata, Viewport } from 'next';
import { BASE_URL } from '@/lib/seo';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      'Prestige Auto Body | Expert Collision Repair in Silver Spring, MD',
    template: '%s | Prestige Auto Body',
  },
  description:
    'Trusted collision repair and auto body shop in Silver Spring, MD. 24/7 towing, insurance claims assistance, and certified professionals with 30+ years experience.',
  // Served from /public at fixed URLs. An app/favicon.ico would be emitted as
  // /favicon.ico?favicon.<hash>.ico, a URL that changes between builds and
  // that Search Console reports on its own.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  keywords: [
    'auto body shop',
    'collision repair',
    'car painting',
    'Silver Spring MD',
    'towing',
  ],
  authors: [{ name: 'Prestige Auto Body, Inc.' }],
  creator: 'Prestige Auto Body, Inc.',
  publisher: 'Prestige Auto Body, Inc.',
  robots: {
    // Block crawlers only on Vercel preview deployments. Localhost can't be
    // crawled, and Lighthouse on localhost otherwise reports a noindex tag.
    index: process.env.VERCEL_ENV !== 'preview',
    follow: process.env.VERCEL_ENV !== 'preview',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Prestige Auto Body | Expert Collision Repair in Silver Spring, MD',
    description:
      'Trusted collision repair and auto body shop in Silver Spring, MD. 24/7 towing, insurance claims assistance.',
    url: '/',
    siteName: 'Prestige Auto Body',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/hero/homepage/desktop/homepage-hero-desktop.webp',
        width: 1920,
        height: 1080,
        alt: 'Prestige Auto Body - Premium Auto Body Repair Shop in Silver Spring, MD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prestige Auto Body | Expert Collision Repair',
    description:
      'Trusted collision repair in Silver Spring, MD. 24/7 towing available.',
    images: ['/hero/homepage/desktop/homepage-hero-desktop.webp'],
  },
  other: {
    'format-detection': 'telephone=no',
  },
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

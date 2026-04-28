import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { WebVitals } from '@/components/performance/WebVitals';
import { QueryProvider } from '@/providers/QueryProvider';
import { BASE_URL } from '@/lib/seo';
import '../globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

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
    'Trusted collision repair and auto body shop in Silver Spring, MD. 24/7 towing, insurance claims assistance, and certified professionals with 20+ years experience.',
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

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={cn('font-sans', inter.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//www.google.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//elfsightcdn.com" />
        <link rel="dns-prefetch" href="//static.elfsight.com" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <WebVitals />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

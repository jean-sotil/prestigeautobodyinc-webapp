import type { Metadata, Viewport } from 'next';
import { Big_Shoulders, Instrument_Sans } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { WebVitals } from '@/components/performance/WebVitals';
import './globals.css';

const bigShoulders = Big_Shoulders({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
  title: 'Prestige Auto Body | Expert Collision Repair in Silver Spring, MD',
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
  robots: 'index, follow',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prestige Auto Body | Expert Collision Repair',
    description:
      'Trusted collision repair in Silver Spring, MD. 24/7 towing available.',
  },
  other: {
    'format-detection': 'telephone=no',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect to critical origins for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for common third-party domains */}
        <link rel="dns-prefetch" href="//www.google.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </head>
      <body
        className={`${bigShoulders.variable} ${instrumentSans.variable} antialiased`}
      >
        {/* Web Vitals RUM monitoring */}
        <WebVitals />
        {children}
      </body>
    </html>
  );
}

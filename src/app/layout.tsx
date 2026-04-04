import type { Metadata, Viewport } from 'next';
import { WebVitals } from '@/components/performance/WebVitals';
import './globals.css';

/**
 * Core Web Vitals optimized layout
 *
 * Optimizations:
 * - System font stack (no FOIT/FOUT, eliminates render-blocking font requests)
 * - Preconnect to critical origins
 * - Web Vitals RUM monitoring
 * - Meta tags for performance hints
 */

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
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
      <body className="antialiased">
        {/* Web Vitals RUM monitoring */}
        <WebVitals />
        {children}
      </body>
    </html>
  );
}

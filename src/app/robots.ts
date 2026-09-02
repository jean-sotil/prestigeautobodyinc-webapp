import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BASE_URL.replace(/\/$/, ''); // Remove trailing slash if present

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/'], // CRITICAL: Allow /_next/ for render-critical CSS/JS
        disallow: ['/api/', '/admin/', '/payload/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

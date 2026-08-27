import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.prestigeautobodyinc.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/media/',
          '/_next/static/css/',
          '/_next/image/',
        ],
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

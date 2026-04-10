import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.prestigeautobodyinc.com';
  const locales = ['en', 'es'];
  const lastModified = new Date();

  // All public pages
  const pages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    {
      path: '/collision-repair',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/auto-painting',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/insurance-claims',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    { path: '/towing', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.6 },
    {
      path: '/certifications',
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    { path: '/our-team', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/locations', changeFrequency: 'monthly' as const, priority: 0.6 },
    {
      path: '/rental-assistance',
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  );
}

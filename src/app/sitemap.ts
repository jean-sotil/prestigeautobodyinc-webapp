import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://www.prestigeautobodyinc.com';

// All public marketing pages, with EN→ES localized path overrides where they
// diverge from the canonical English path.
type PageEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  // Optional locale-specific path overrides (defaults to `path` when absent).
  paths?: Partial<Record<(typeof routing.locales)[number], string>>;
};

const pages: PageEntry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  {
    path: '/collision-repair',
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    path: '/auto-painting',
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    path: '/insurance-claims',
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  { path: '/towing', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/gallery', changeFrequency: 'weekly', priority: 0.6 },
  {
    path: '/certifications',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  { path: '/our-team', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/locations', changeFrequency: 'monthly', priority: 0.6 },
  {
    path: '/rental-assistance',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  {
    path: '/get-a-quote',
    changeFrequency: 'monthly',
    priority: 0.95,
    paths: { en: '/get-a-quote', es: '/obtener-cotizacion' },
  },
];

function buildLanguageAlternates(
  pathByLocale: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(pathByLocale).map(([locale, path]) => [
      locale,
      `${BASE_URL}/${locale}${path}`,
    ]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const standardEntries: MetadataRoute.Sitemap = pages.flatMap((page) => {
    const pathByLocale: Record<string, string> = {};
    for (const locale of routing.locales) {
      pathByLocale[locale] = page.paths?.[locale] ?? page.path;
    }
    const alternates = buildLanguageAlternates(pathByLocale);

    return routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${pathByLocale[locale]}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: alternates },
    }));
  });

  // Blog posts: one entry per (locale × post) using each locale's slug.
  // Failures here must not break the sitemap, so we swallow errors and fall
  // back to the standard entries only.
  const blogEntries: MetadataRoute.Sitemap = [];
  try {
    const { getPayload } = await import('payload');
    const config = await import('@/payload/payload.config');
    const payload = await getPayload({ config: config.default });

    const result = await payload.find({
      collection: 'blog-posts',
      depth: 0,
      limit: 1000,
      pagination: false,
      // 'all' returns localized fields as { en, es, … }
      locale: 'all',
      where: { status: { equals: 'published' } },
    });

    for (const doc of result.docs as Array<{
      slug?: unknown;
      updatedAt?: string;
      publishedAt?: string;
    }>) {
      const slugMap =
        doc.slug && typeof doc.slug === 'object'
          ? (doc.slug as Record<string, string>)
          : null;
      if (!slugMap) continue;

      const lastModifiedPost = new Date(
        doc.updatedAt ?? doc.publishedAt ?? Date.now(),
      );

      // Build the alternates map (only locales that actually have a slug).
      const localesWithSlug = routing.locales.filter(
        (l) => typeof slugMap[l] === 'string' && slugMap[l].length > 0,
      );
      if (localesWithSlug.length === 0) continue;

      const alternates: Record<string, string> = {};
      for (const l of localesWithSlug) {
        alternates[l] = `${BASE_URL}/${l}/blog/${slugMap[l]}`;
      }

      for (const locale of localesWithSlug) {
        blogEntries.push({
          url: alternates[locale],
          lastModified: lastModifiedPost,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: { languages: alternates },
        });
      }
    }
  } catch (error) {
    console.error('sitemap: failed to enumerate blog posts', error);
  }

  return [...standardEntries, ...blogEntries];
}

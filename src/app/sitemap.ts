import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';
import { getPayload } from 'payload';
import config from '@/payload/payload.config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];

  // Static pages (same as before)
  const staticPages = [
    { en: '/en', es: '/es' },
    { en: '/en/collision-repair', es: '/es/reparacion-de-colisiones' },
    { en: '/en/auto-body-services', es: '/es/servicios-de-carroceria' },
    { en: '/en/auto-painting', es: '/es/pintura-de-autos' },
    { en: '/en/towing', es: '/es/remolque' },
    { en: '/en/insurance-claims', es: '/es/reclamos-de-seguro' },
    { en: '/en/rental-assistance', es: '/es/asistencia-de-alquiler' },
    { en: '/en/about', es: '/es/nosotros' },
    { en: '/en/our-team', es: '/es/nuestro-equipo' },
    { en: '/en/certifications', es: '/es/certificaciones' },
    { en: '/en/contact', es: '/es/contacto' },
    { en: '/en/locations', es: '/es/ubicaciones' },
    { en: '/en/gallery', es: '/es/galeria' },
    { en: '/en/get-a-quote', es: '/es/obtener-cotizacion' },
    { en: '/en/privacy-policy', es: '/es/politica-de-privacidad' },
    { en: '/en/terms-of-service', es: '/es/terminos-de-servicio' },
    { en: '/en/blog', es: '/es/blog' },
    { en: '/en/car-wash-detailing', es: '/es/lavado-y-detallado' },
  ];

  // Add static pages
  staticPages.forEach(({ en, es }) => {
    entries.push(
      {
        url: `${baseUrl}${en}`,
        lastModified: new Date(),
        changeFrequency: en.includes('blog') ? 'weekly' : 'monthly',
        priority: en === '/en' ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}${en}`,
            es: `${baseUrl}${es}`,
          },
        },
      },
      {
        url: `${baseUrl}${es}`,
        lastModified: new Date(),
        changeFrequency: es.includes('blog') ? 'weekly' : 'monthly',
        priority: es === '/es' ? 0.95 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}${en}`,
            es: `${baseUrl}${es}`,
          },
        },
      },
    );
  });

  // Fetch blog posts from Payload CMS
  try {
    const payload = await getPayload({ config });

    // Fetch English blog posts with all locales
    const enPosts = await payload.find({
      collection: 'blog-posts',
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: 'en',
      where: {
        publishStatus: { equals: 'published' },
      },
    });

    // For each English post, get its slug in all locales
    for (const post of enPosts.docs as Array<{
      id: string;
      slug?: string;
      updatedAt?: string;
    }>) {
      if (!post.slug) continue;

      // Fetch all locales for this post to get the Spanish slug
      const allLocales = await payload.findByID({
        collection: 'blog-posts',
        id: post.id,
        depth: 0,
        locale: 'all',
      });

      const slugs = (allLocales as { slug?: unknown }).slug;
      if (!slugs || typeof slugs !== 'object') continue;

      const enSlug = (slugs as Record<string, unknown>)['en'];
      const esSlug = (slugs as Record<string, unknown>)['es'];

      if (typeof enSlug !== 'string' || typeof esSlug !== 'string') continue;

      // Use updatedAt from the post, fallback to new Date if not available
      const lastModified = post.updatedAt
        ? new Date(post.updatedAt)
        : new Date();

      // Add English URL with hreflang
      entries.push({
        url: `${baseUrl}/en/blog/${enSlug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/blog/${enSlug}`,
            es: `${baseUrl}/es/blog/${esSlug}`,
          },
        },
      });

      // Add Spanish URL with hreflang
      entries.push({
        url: `${baseUrl}/es/blog/${esSlug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/blog/${enSlug}`,
            es: `${baseUrl}/es/blog/${esSlug}`,
          },
        },
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    // Sitemap generation continues without blog posts if there's an error
  }

  return entries;
}

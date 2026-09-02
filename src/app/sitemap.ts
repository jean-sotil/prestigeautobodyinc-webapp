import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL.replace(/\/$/, '');

  // Core pages with English paths and Spanish localized paths
  const pages = [
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

  const entries: MetadataRoute.Sitemap = [];

  // Add all page variants
  pages.forEach(({ en, es }) => {
    entries.push(
      {
        url: `${baseUrl}${en}`,
        lastModified: new Date(),
        changeFrequency: en.includes('blog') ? 'weekly' : 'monthly',
        priority: en === '/en' ? 1 : 0.8,
      },
      {
        url: `${baseUrl}${es}`,
        lastModified: new Date(),
        changeFrequency: es.includes('blog') ? 'weekly' : 'monthly',
        priority: es === '/es' ? 0.95 : 0.8,
      },
    );
  });

  return entries;
}

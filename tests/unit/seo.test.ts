import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock env vars before importing the module
beforeEach(() => {
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubEnv('VERCEL_URL', '');
  vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
});

describe('buildPageMetadata', () => {
  // Dynamic import to pick up env stubs
  async function getBuildPageMetadata() {
    // Reset module cache so env stubs take effect
    vi.resetModules();
    const mod = await import('@/lib/seo');
    return mod.buildPageMetadata;
  }

  it('should return title and description', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'Test Page',
      description: 'A test description',
      locale: 'en',
      enPath: '/en/test',
      esPath: '/es/test',
    });

    expect(meta.title).toBe('Test Page');
    expect(meta.description).toBe('A test description');
  });

  it('should set canonical URL for current locale', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'Test',
      description: 'Desc',
      locale: 'en',
      enPath: '/en/about',
      esPath: '/es/nosotros',
    });

    expect(meta.alternates?.canonical).toContain('/en/about');
  });

  it('should set ES canonical for Spanish locale', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'Prueba',
      description: 'Desc',
      locale: 'es',
      enPath: '/en/about',
      esPath: '/es/nosotros',
    });

    expect(meta.alternates?.canonical).toContain('/es/nosotros');
  });

  it('should include hreflang alternates for both locales', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'Test',
      description: 'Desc',
      locale: 'en',
      enPath: '/en/contact',
      esPath: '/es/contacto',
    });

    const languages = meta.alternates?.languages as Record<string, string>;
    expect(languages.en).toContain('/en/contact');
    expect(languages.es).toContain('/es/contacto');
    expect(languages['x-default']).toContain('/en/contact');
  });

  it('should set OpenGraph locale correctly', async () => {
    const buildPageMetadata = await getBuildPageMetadata();

    const enMeta = buildPageMetadata({
      title: 'T',
      description: 'D',
      locale: 'en',
      enPath: '/en',
      esPath: '/es',
    });
    expect(enMeta.openGraph?.locale).toBe('en_US');

    const esMeta = buildPageMetadata({
      title: 'T',
      description: 'D',
      locale: 'es',
      enPath: '/en',
      esPath: '/es',
    });
    expect(esMeta.openGraph?.locale).toBe('es_US');
  });

  it('should use custom ogImage when provided', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'T',
      description: 'D',
      locale: 'en',
      enPath: '/en',
      esPath: '/es',
      ogImage: 'https://cdn.example.com/custom.jpg',
    });

    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe('https://cdn.example.com/custom.jpg');
  });

  it('should use default OG image when none provided', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'T',
      description: 'D',
      locale: 'en',
      enPath: '/en',
      esPath: '/es',
    });

    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toContain('/og-image.jpg');
  });

  it('should set twitter card to summary_large_image', async () => {
    const buildPageMetadata = await getBuildPageMetadata();
    const meta = buildPageMetadata({
      title: 'T',
      description: 'D',
      locale: 'en',
      enPath: '/en',
      esPath: '/es',
    });

    expect(meta.twitter?.card).toBe('summary_large_image');
  });
});

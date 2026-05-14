import { test, expect } from '@playwright/test';

const LOCALES = ['en', 'es'] as const;

// Pages to test — only pages that exist and have real content
const PAGES = [
  { path: '', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/collision-repair', name: 'Collision Repair' },
  { path: '/auto-painting', name: 'Auto Painting' },
  { path: '/contact', name: 'Contact' },
  { path: '/get-a-quote', name: 'Get a Quote' },
];

test.describe('SEO — Meta Tags', () => {
  for (const locale of LOCALES) {
    for (const page of PAGES) {
      test(`${page.name} (${locale}) has required meta tags`, async ({
        page: p,
      }) => {
        await p.goto(`/${locale}${page.path}`, {
          waitUntil: 'domcontentloaded',
        });

        // Title must exist and not be empty
        const title = await p.title();
        expect(title.length).toBeGreaterThan(0);

        // Meta description
        const description = p.locator('meta[name="description"]');
        await expect(description).toHaveAttribute('content', /.+/);

        // Canonical URL
        const canonical = p.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', /https?:\/\/.+/);

        // Open Graph
        await expect(p.locator('meta[property="og:title"]')).toHaveAttribute(
          'content',
          /.+/,
        );
        await expect(
          p.locator('meta[property="og:description"]'),
        ).toHaveAttribute('content', /.+/);
        await expect(p.locator('meta[property="og:url"]')).toHaveAttribute(
          'content',
          /https?:\/\/.+/,
        );

        // Twitter card
        await expect(p.locator('meta[name="twitter:card"]')).toHaveAttribute(
          'content',
          /.+/,
        );
      });
    }
  }
});

test.describe('SEO — Hreflang Alternates', () => {
  for (const page of PAGES) {
    test(`${page.name} has EN/ES hreflang links`, async ({ page: p }) => {
      await p.goto(`/en${page.path}`, { waitUntil: 'domcontentloaded' });

      // Should have hreflang for en
      const enLink = p.locator('link[hreflang="en"]');
      await expect(enLink).toHaveAttribute('href', /\/en/);

      // Should have hreflang for es
      const esLink = p.locator('link[hreflang="es"]');
      await expect(esLink).toHaveAttribute('href', /\/es/);

      // Should have x-default
      const xDefault = p.locator('link[hreflang="x-default"]');
      await expect(xDefault).toHaveAttribute('href', /\/en/);
    });
  }
});

test.describe('SEO — Heading Structure', () => {
  for (const locale of LOCALES) {
    for (const page of PAGES) {
      test(`${page.name} (${locale}) has exactly one h1`, async ({
        page: p,
      }) => {
        await p.goto(`/${locale}${page.path}`, {
          waitUntil: 'domcontentloaded',
        });
        const h1Count = await p.locator('h1').count();
        expect(h1Count).toBe(1);
      });
    }
  }
});

test.describe('SEO — JSON-LD Structured Data', () => {
  test('Home (en) has LocalBusiness JSON-LD', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    const hasLocalBusiness = scripts.some((s) => {
      try {
        const data = JSON.parse(s);
        return (
          data['@type'] === 'LocalBusiness' ||
          data['@type'] === 'AutoBodyShop' ||
          data['@type']?.includes?.('AutoBodyShop')
        );
      } catch {
        return false;
      }
    });

    expect(hasLocalBusiness).toBe(true);
  });

  test('Home (en) has WebSite JSON-LD', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    const hasWebSite = scripts.some((s) => {
      try {
        const data = JSON.parse(s);
        return data['@type'] === 'WebSite';
      } catch {
        return false;
      }
    });

    expect(hasWebSite).toBe(true);
  });
});

test.describe('SEO — Robots & Sitemap', () => {
  test('robots.txt is accessible and blocks /admin/', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBe(200);
    const body = await res?.text();
    expect(body).toContain('Disallow: /admin/');
    expect(body).toContain('Sitemap:');
  });

  test('sitemap.xml is accessible', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBe(200);
    const body = await res?.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/en');
    expect(body).toContain('/es');
  });
});

test.describe('SEO — HTML lang attribute', () => {
  test('EN page has lang="en"', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('ES page has lang="es"', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

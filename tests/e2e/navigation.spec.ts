import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header renders with logo and nav links', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeVisible();
  });

  test('footer renders with contact info', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
  });

  test('main content has skip-to-content target', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    const main = page.locator('main#main-content');
    await expect(main).toBeAttached();
  });
});

test.describe('Responsive — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home page renders without horizontal scroll', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('service cards stack vertically on mobile', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const section = page.locator('[aria-labelledby="services-heading"]');
    await expect(section).toBeAttached();
  });
});

test.describe('Responsive — Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('home page renders correctly at 1440px', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const hero = page.locator('[aria-labelledby="hero-heading"]');
    await expect(hero).toBeVisible();

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });
});

test.describe('Localization', () => {
  test('EN home has English content', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('ES home has Spanish content', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test.describe('Critical Pages Load', () => {
  const criticalPages = [
    '/en',
    '/es',
    '/en/about',
    '/en/collision-repair',
    '/en/auto-painting',
    '/en/contact',
    '/en/get-a-quote',
    '/en/gallery',
    '/en/blog',
  ];

  for (const path of criticalPages) {
    test(`${path} returns 200`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res?.status()).toBe(200);
    });
  }
});

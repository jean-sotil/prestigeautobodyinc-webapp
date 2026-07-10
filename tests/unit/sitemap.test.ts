import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('includes an entry for /auto-body-services in both locales', async () => {
    const entries = await sitemap();

    const enEntry = entries.find(
      (e) =>
        e.url === 'https://www.prestigeautobodyinc.com/en/auto-body-services',
    );
    const esEntry = entries.find(
      (e) =>
        e.url ===
        'https://www.prestigeautobodyinc.com/es/servicios-de-carroceria',
    );

    expect(enEntry).toBeDefined();
    expect(esEntry).toBeDefined();
  });

  it('cross-links EN/ES alternates for /auto-body-services', async () => {
    const entries = await sitemap();

    const enEntry = entries.find(
      (e) =>
        e.url === 'https://www.prestigeautobodyinc.com/en/auto-body-services',
    );

    const languages = enEntry?.alternates?.languages as
      | Record<string, string>
      | undefined;

    expect(languages?.en).toBe(
      'https://www.prestigeautobodyinc.com/en/auto-body-services',
    );
    expect(languages?.es).toBe(
      'https://www.prestigeautobodyinc.com/es/servicios-de-carroceria',
    );
  });
});

import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { ButtonLink } from '@/components/ui/Button';

async function getSafeLocale(): Promise<Locale> {
  try {
    const locale = await getLocale();
    if ((routing.locales as readonly string[]).includes(locale)) {
      return locale as Locale;
    }
  } catch {
    // locale context not set (e.g. invalid-locale 404 from layout) — fall through
  }
  return routing.defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSafeLocale();
  const t = await getTranslations({ locale, namespace: 'notFound' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

const SHORTCUTS = [
  { href: '/collision-repair', navKey: 'collisionRepair' },
  { href: '/about', navKey: 'about' },
  { href: '/locations', navKey: 'locations' },
  { href: '/blog', navKey: 'blog' },
] as const;

export default async function NotFound() {
  const locale = await getSafeLocale();
  const [t, tNav, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'notFound' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'footer' }),
  ]);

  const phoneDisplay = tFooter('company.phone');
  const phoneRaw = phoneDisplay.replace(/\D/g, '');

  return (
    <main className="font-sans flex min-h-[70vh] items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-xl animate-fade-in-up">
        <div aria-hidden className="mb-8 flex items-center gap-1.5">
          <span className="block h-0.5 w-8 bg-primary" />
          <span className="block h-0.5 w-14 bg-primary" />
          <span className="block h-0.5 w-3 bg-primary" />
        </div>

        <p
          aria-hidden
          className="mb-3 text-7xl font-bold leading-none tracking-tight tabular-nums text-primary sm:text-8xl"
        >
          {t('code')}
        </p>

        <h1 className="mb-4 text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          {t('heading')}
        </h1>

        <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
          {t('description')}
        </p>

        <div className="mb-10 flex flex-wrap gap-3">
          <ButtonLink
            href="/get-a-quote"
            variant="primary"
            size="lg"
            className="rounded-full"
          >
            {t('actions.quote')}
          </ButtonLink>
          <ButtonLink
            href="/"
            variant="secondary"
            size="lg"
            className="rounded-full"
          >
            {t('actions.home')}
          </ButtonLink>
        </div>

        <div className="border-t border-border pt-6">
          <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t('shortcutsLabel')}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {SHORTCUTS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {tNav(item.navKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {t('helpLine')}{' '}
          <a
            href={`tel:${phoneRaw}`}
            className="rounded-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {phoneDisplay}
          </a>
        </p>
      </div>
    </main>
  );
}

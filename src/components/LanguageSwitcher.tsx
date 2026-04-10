'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('language');

  const otherLocale = locale === 'en' ? 'es' : 'en';

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={pathname}
        locale={otherLocale}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
        aria-label={t('switchTo', {
          locale: t(otherLocale === 'en' ? 'english' : 'spanish').toLowerCase(),
        })}
      >
        {locale === 'en' ? 'ES' : 'EN'}
      </Link>
    </div>
  );
}

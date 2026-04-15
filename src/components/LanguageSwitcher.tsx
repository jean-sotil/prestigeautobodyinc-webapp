'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('language');

  const otherLocale = locale === 'en' ? 'es' : 'en';

  return (
    <Button
      variant="outline"
      size="sm"
      render={
        <Link
          href={pathname}
          locale={otherLocale}
          aria-label={t('switchTo', {
            locale: t(
              otherLocale === 'en' ? 'english' : 'spanish',
            ).toLowerCase(),
          })}
        />
      }
    >
      {locale === 'en' ? 'ES' : 'EN'}
    </Button>
  );
}

import { getTranslations } from 'next-intl/server';
import { ClockIcon } from '@/components/ui/Icons';

const SHOP_TZ = 'America/New_York';

function getShopWeekday(): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHOP_TZ,
    weekday: 'short',
  }).formatToParts(new Date());
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
}

export async function BusinessHours({ locale }: { locale: string }) {
  const [t, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    getTranslations({ locale, namespace: 'footer' }),
  ]);

  const todayIdx = getShopWeekday();
  const rows = [
    { key: 'monday', isToday: todayIdx >= 1 && todayIdx <= 5 },
    { key: 'saturday', isToday: todayIdx === 6 },
    { key: 'sunday', isToday: todayIdx === 0 },
  ] as const;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
        <ClockIcon size={22} ariaLabel="" className="text-muted-foreground" />
        {tFooter('hours.title')}
      </h2>
      <dl className="space-y-1">
        {rows.map(({ key, isToday }) => (
          <div
            key={key}
            className={
              isToday
                ? 'flex items-baseline justify-between gap-4 rounded-md bg-secondary px-3 py-2.5 font-semibold text-foreground'
                : 'flex items-baseline justify-between gap-4 px-3 py-2.5 text-muted-foreground'
            }
          >
            <span>{tFooter(`hours.${key}`)}</span>
            {isToday && (
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary">
                {t('hoursToday')}
              </span>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

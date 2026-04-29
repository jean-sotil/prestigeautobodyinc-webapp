import { unstable_noStore as noStore } from 'next/cache';
import { getTranslations } from 'next-intl/server';

const SHOP_TZ = 'America/New_York';

type Schedule = { open: number; close: number } | null;

const WEEK: Record<number, Schedule> = {
  0: null,
  1: { open: 8, close: 18 },
  2: { open: 8, close: 18 },
  3: { open: 8, close: 18 },
  4: { open: 8, close: 18 },
  5: { open: 8, close: 18 },
  6: { open: 8, close: 12 },
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getShopNow(): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHOP_TZ,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = WEEKDAY_INDEX[get('weekday')] ?? 0;
  const hour = parseInt(get('hour'), 10);
  const minute = parseInt(get('minute'), 10);
  return { day, hour: hour + minute / 60 };
}

function nextOpening(currentDay: number): { day: number; time: number } {
  for (let i = 1; i <= 7; i += 1) {
    const d = (currentDay + i) % 7;
    const sched = WEEK[d];
    if (sched) return { day: d, time: sched.open };
  }
  return { day: 1, time: 8 };
}

function formatTime(hours24: number): string {
  const h = Math.floor(hours24);
  const m = Math.round((hours24 - h) * 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return m === 0
    ? `${h12}${ampm}`
    : `${h12}:${String(m).padStart(2, '0')}${ampm}`;
}

function formatWeekday(dayIdx: number, locale: string): string {
  // 2024-01-07 is a Sunday (UTC). Add dayIdx days to get the desired weekday.
  const ref = new Date(Date.UTC(2024, 0, 7 + dayIdx));
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(ref);
}

export async function OpenStatus({ locale }: { locale: string }) {
  noStore();
  const t = await getTranslations({ locale, namespace: 'contact' });
  const { day, hour } = getShopNow();
  const today = WEEK[day];
  const isOpen = today && hour >= today.open && hour < today.close;

  if (isOpen) {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
        <span
          aria-hidden
          className="block size-2 rounded-full bg-[#16a34a] ring-2 ring-[#16a34a]/25"
        />
        {t('status.openUntil', { time: formatTime(today.close) })}
      </span>
    );
  }

  const next = nextOpening(day);
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <span
        aria-hidden
        className="block size-2 rounded-full bg-muted-foreground/60"
      />
      {t('status.closedOpens', {
        day: formatWeekday(next.day, locale),
        time: formatTime(next.time),
      })}
    </span>
  );
}

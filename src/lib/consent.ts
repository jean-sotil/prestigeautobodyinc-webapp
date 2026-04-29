export type ConsentState = 'granted' | 'denied';

const COOKIE_NAME = 'prestige-consent';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const CHANGE_EVENT = 'prestige-consent-change';

export function getConsent(): ConsentState | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=(granted|denied)`),
  );
  return match ? (match[1] as ConsentState) : undefined;
}

export function setConsent(state: ConsentState): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${COOKIE_NAME}=${state}` +
    `; Path=/` +
    `; Max-Age=${COOKIE_MAX_AGE_SECONDS}` +
    `; SameSite=Lax` +
    secure;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: state === 'granted' ? 'granted' : 'denied',
    });
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ConsentState>(CHANGE_EVENT, { detail: state }),
    );
  }
}

export function onConsentChange(
  listener: (state: ConsentState) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) =>
    listener((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

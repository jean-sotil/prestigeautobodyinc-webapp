import type {
  EventName,
  EventParams,
  UserProperties,
} from './analytics-events';
import { getConsent } from './consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent<N extends EventName>(
  name: N,
  params: EventParams<N>,
): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (getConsent() !== 'granted') return;
  window.gtag('event', name, params);
}

export function setUserProperties(properties: UserProperties): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (getConsent() !== 'granted') return;
  window.gtag('set', 'user_properties', properties);
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (getConsent() !== 'granted') return;
  window.gtag('event', 'page_view', { page_path: path });
}

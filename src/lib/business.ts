/**
 * Business Constants for Prestige Auto Body, Inc.
 * Centralized business data for use across JSON-LD schemas and other components
 */

import { FALLBACK_RATING } from '@/lib/rating-fallback';

export const BUSINESS_INFO = {
  name: 'Prestige Auto Body, Inc.',
  alternateName: 'Prestige Auto Body',
  url: 'https://www.prestigeautobodyinc.com',
  logo: 'https://www.prestigeautobodyinc.com/logo.png',
  image: 'https://www.prestigeautobodyinc.com/og-image.jpg',
  telephone: '+1-301-578-8779',
  faxNumber: '+1-301-578-8780',
  email: 'info@prestigeautobodyinc.com',
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: ['Cash', 'Credit Card', 'Insurance', 'Check'],
  openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:00-12:00'],
  address: {
    streetAddress: '928 Philadelphia Avenue',
    addressLocality: 'Silver Spring',
    addressRegion: 'MD',
    postalCode: '20910',
    addressCountry: 'US',
  },
  geo: {
    latitude: 39.0015,
    longitude: -77.0365,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Silver Spring',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Montgomery County, MD',
      },
    },
    { '@type': 'City', name: 'Bethesda' },
    { '@type': 'City', name: 'Rockville' },
    { '@type': 'City', name: 'Takoma Park' },
    { '@type': 'City', name: 'Wheaton' },
    { '@type': 'City', name: 'College Park' },
    { '@type': 'City', name: 'Hyattsville' },
    { '@type': 'City', name: 'Columbia' },
    { '@type': 'City', name: 'Chevy Chase' },
    {
      '@type': 'AdministrativeArea',
      name: 'Washington, DC',
    },
  ],
  serviceTypes: [
    'Collision Repair',
    'Auto Body Repair',
    'Auto Painting',
    'Paintless Dent Repair',
    'Frame Straightening',
    'Insurance Claims Assistance',
    '24/7 Towing Service',
    'Rental Car Assistance',
    'Auto Accident Repair',
    'Hail Damage Repair',
    'Bumper Repair',
    'Car Wash & Detailing',
  ],
  sameAs: [
    'https://www.facebook.com/prestigeautobodyinc',
    'https://www.google.com/maps/place/Prestige+Auto+Body,+Inc.',
  ],
} as const;

/**
 * E.164-formatted phone number for `tel:` links.
 * Per RFC 3966 / E.164 the country code prefix is required for international
 * dial-out (roaming, VoIP, non-US callers).
 */
export const SHOP_PHONE_TEL = '+13015788779';

/** Display-formatted phone number, no spaces stripping needed. */
export const SHOP_PHONE_DISPLAY = '(301) 578-8779';

/**
 * Default rating/reviewCount used by JSON-LD schemas when no live value is
 * passed in (e.g. `getAggregateRating()` called with no arguments).
 *
 * `ratingValue`/`reviewCount` are sourced from `FALLBACK_RATING` in
 * `@/lib/rating-fallback` — the SAME fallback `src/lib/google-places.ts`
 * returns from `getBusinessRating()` when the homepage's live Google
 * Reviews widget can't reach the Places API — so this file never maintains
 * its own, independently-drifting hardcoded review count.
 * Callers that want the true live count (fetched from the Google Places
 * API at request time) should call `getBusinessRating()` and pass its
 * `ratingValue`/`reviewCount` into `getAggregateRating()` explicitly, the
 * way the homepage, contact, get-a-quote, and blog pages already do.
 */
export const RATING_INFO = {
  ratingValue: FALLBACK_RATING.ratingValue,
  reviewCount: FALLBACK_RATING.reviewCount,
  bestRating: 5,
  worstRating: 1,
} as const;

/**
 * Generate opening hours specification for JSON-LD
 */
export function getOpeningHoursSpecification(): Array<{
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}> {
  return [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ];
}

/**
 * Generate geo coordinates for JSON-LD
 */
export function getGeoCoordinates(): {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
} {
  return {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS_INFO.geo.latitude,
    longitude: BUSINESS_INFO.geo.longitude,
  };
}

/**
 * Generate postal address for JSON-LD
 */
export function getPostalAddress(): {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
} {
  return {
    '@type': 'PostalAddress',
    ...BUSINESS_INFO.address,
  };
}

/**
 * Generate aggregate rating for JSON-LD
 */
export function getAggregateRating(
  ratingValue?: number,
  reviewCount?: number,
): {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
} {
  return {
    '@type': 'AggregateRating',
    ratingValue: ratingValue ?? RATING_INFO.ratingValue,
    reviewCount: reviewCount ?? RATING_INFO.reviewCount,
    bestRating: RATING_INFO.bestRating,
    worstRating: RATING_INFO.worstRating,
  };
}

/**
 * Business Constants for Prestige Auto Body, Inc.
 * Centralized business data for use across JSON-LD schemas and other components
 */

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
  areaServed: {
    '@type': 'City',
    name: 'Silver Spring',
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Montgomery County, MD',
    },
  },
  serviceTypes: [
    'Collision Repair',
    'Auto Body Repair',
    'Auto Painting',
    'Paintless Dent Repair',
    'Frame Straightening',
    'Insurance Claims Assistance',
    '24/7 Towing Service',
    'Rental Car Assistance',
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

export const RATING_INFO = {
  ratingValue: 4.7,
  reviewCount: 243,
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

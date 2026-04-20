import {
  BUSINESS_INFO,
  getOpeningHoursSpecification,
  getGeoCoordinates,
  getPostalAddress,
  getAggregateRating,
} from '@/lib/business';

interface LocalBusinessJsonLdProps {
  ratingValue?: number;
  reviewCount?: number;
  locale?: string;
}

export function LocalBusinessJsonLd({
  ratingValue,
  reviewCount,
  locale = 'en',
}: LocalBusinessJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoBodyShop',
    '@id': `${BUSINESS_INFO.url}/#business`,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.alternateName,
    url: BUSINESS_INFO.url,
    logo: BUSINESS_INFO.logo,
    image: BUSINESS_INFO.image,
    telephone: BUSINESS_INFO.telephone,
    faxNumber: BUSINESS_INFO.faxNumber,
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    currenciesAccepted: BUSINESS_INFO.currenciesAccepted,
    paymentAccepted: BUSINESS_INFO.paymentAccepted,
    address: getPostalAddress(),
    geo: getGeoCoordinates(),
    openingHoursSpecification: getOpeningHoursSpecification(),
    areaServed: BUSINESS_INFO.areaServed,
    sameAs: BUSINESS_INFO.sameAs,
    aggregateRating: getAggregateRating(ratingValue, reviewCount),
    '@language': locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default LocalBusinessJsonLd;

import {
  BUSINESS_INFO,
  getPostalAddress,
  getAggregateRating,
} from '@/lib/business';

interface OfferItem {
  name: string;
  description?: string;
  minPrice: number;
  maxPrice?: number;
}

interface ServiceJsonLdProps {
  serviceName: string;
  description: string;
  url: string;
  serviceType?: string | string[];
  locale?: string;
  schemaType?: string;
  showAggregateRating?: boolean;
  offerCatalog?: OfferItem[];
}

export function ServiceJsonLd({
  serviceName,
  description,
  url,
  serviceType,
  locale = 'en',
  schemaType = 'AutoRepair',
  showAggregateRating = false,
  offerCatalog,
}: ServiceJsonLdProps) {
  const serviceTypes = serviceType
    ? Array.isArray(serviceType)
      ? serviceType
      : [serviceType]
    : [serviceName];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: serviceName,
    description,
    url,
    provider: {
      '@type': 'AutoBodyShop',
      name: BUSINESS_INFO.name,
      '@id': `${BUSINESS_INFO.url}/#business`,
      address: getPostalAddress(),
      telephone: BUSINESS_INFO.telephone,
      url: BUSINESS_INFO.url,
    },
    areaServed: BUSINESS_INFO.areaServed,
    serviceType: serviceTypes,
    priceRange: BUSINESS_INFO.priceRange,
    '@language': locale,
    ...(showAggregateRating && { aggregateRating: getAggregateRating() }),
    ...(offerCatalog?.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: serviceName,
        itemListElement: offerCatalog.map((item) => ({
          '@type': 'Offer',
          name: item.name,
          ...(item.description && { description: item.description }),
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: item.minPrice,
            ...(item.maxPrice !== undefined && { maxPrice: item.maxPrice }),
            priceCurrency: 'USD',
          },
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

export default ServiceJsonLd;

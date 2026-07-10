import {
  BUSINESS_INFO,
  getPostalAddress,
  getAggregateRating,
} from '@/lib/business';
import { getBusinessRating } from '@/lib/google-places';

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

export async function ServiceJsonLd({
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

  // Reuse the same Google Places source as the homepage's live review
  // widget (`getBusinessRating`) so every service page's AggregateRating
  // schema stays in sync with the real, current review count instead of
  // relying on a separately-hardcoded number.
  const rating = showAggregateRating ? await getBusinessRating() : null;

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
    ...(rating && {
      aggregateRating: getAggregateRating(
        rating.ratingValue,
        rating.reviewCount,
      ),
    }),
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

import { BUSINESS_INFO, getPostalAddress } from '@/lib/business';

interface ServiceJsonLdProps {
  serviceName: string;
  description: string;
  url: string;
  serviceType?: string | string[];
  locale?: string;
}

export function ServiceJsonLd({
  serviceName,
  description,
  url,
  serviceType,
  locale = 'en',
}: ServiceJsonLdProps) {
  // Build service type array - use provided value or default to service name
  const serviceTypes = serviceType
    ? Array.isArray(serviceType)
      ? serviceType
      : [serviceType]
    : [serviceName];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

export default ServiceJsonLd;

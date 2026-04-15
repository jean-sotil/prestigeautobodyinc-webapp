interface ServiceJsonLdProps {
  serviceName: string;
  description: string;
  url: string;
}

export function ServiceJsonLd({
  serviceName,
  description,
  url,
}: ServiceJsonLdProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    provider: {
      '@type': 'AutoRepair',
      name: 'Prestige Auto Body, Inc.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '928 Philadelphia Avenue',
        addressLocality: 'Silver Spring',
        addressRegion: 'MD',
        postalCode: '20910',
      },
      telephone: '+1-301-578-8779',
      url: 'https://prestigeautobodyinc.com',
    },
    areaServed: {
      '@type': 'City',
      name: 'Silver Spring',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Montgomery County, MD',
      },
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

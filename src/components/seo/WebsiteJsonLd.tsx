import { BUSINESS_INFO } from '@/lib/business';

interface WebsiteJsonLdProps {
  locale?: string;
  description?: string;
}

export function WebsiteJsonLd({
  locale = 'en',
  description,
}: WebsiteJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_INFO.url}/#website`,
    url: BUSINESS_INFO.url,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.alternateName,
    description,
    inLanguage: locale,
    publisher: {
      '@id': `${BUSINESS_INFO.url}/#business`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default WebsiteJsonLd;

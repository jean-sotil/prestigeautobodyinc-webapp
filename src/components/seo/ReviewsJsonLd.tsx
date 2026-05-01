import {
  BUSINESS_INFO,
  getPostalAddress,
  getAggregateRating,
} from '@/lib/business';

type ReviewsJsonLdProps = {
  ratingValue?: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
  locale?: string;
};

export function ReviewsJsonLd({
  ratingValue,
  reviewCount,
  locale = 'en',
}: ReviewsJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoBodyShop',
    '@id': `${BUSINESS_INFO.url}/#business`,
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.telephone,
    address: getPostalAddress(),
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

export default ReviewsJsonLd;

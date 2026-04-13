type ReviewsJsonLdProps = {
  ratingValue?: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
};

export function ReviewsJsonLd({
  ratingValue = 4.9,
  reviewCount = 150,
  bestRating = 5,
  worstRating = 1,
}: ReviewsJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoBodyShop',
    '@id': 'https://www.prestigeautobodyinc.com/#business',
    name: 'Prestige Auto Body, Inc.',
    url: 'https://www.prestigeautobodyinc.com',
    telephone: '+1-301-578-8779',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '928 Philadelphia Avenue',
      addressLocality: 'Silver Spring',
      addressRegion: 'MD',
      postalCode: '20910',
      addressCountry: 'US',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating,
      worstRating,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ReviewsJsonLd;

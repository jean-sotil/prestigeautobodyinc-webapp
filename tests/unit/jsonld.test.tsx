import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';
import { WebsiteJsonLd } from '@/components/seo/WebsiteJsonLd';
import { ReviewsJsonLd } from '@/components/seo/ReviewsJsonLd';
import { FAQJsonLd } from '@/components/seo/FAQJsonLd';
import {
  BreadcrumbJsonLd,
  generateBreadcrumbItems,
} from '@/components/seo/BreadcrumbJsonLd';

function extractJsonLd(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.textContent!);
}

describe('LocalBusinessJsonLd', () => {
  it('should render valid AutoBodyShop schema', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = extractJsonLd(container);

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('AutoBodyShop');
    expect(data.name).toBeTruthy();
    expect(data.url).toMatch(/^https:\/\//);
    expect(data.telephone).toBeTruthy();
  });

  it('should include address with PostalAddress type', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = extractJsonLd(container);
    const address = data.address as Record<string, unknown>;

    expect(address['@type']).toBe('PostalAddress');
    expect(address.streetAddress).toBeTruthy();
    expect(address.addressCountry).toBe('US');
  });

  it('should include geo coordinates', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = extractJsonLd(container);
    const geo = data.geo as Record<string, unknown>;

    expect(geo['@type']).toBe('GeoCoordinates');
    expect(typeof geo.latitude).toBe('number');
    expect(typeof geo.longitude).toBe('number');
  });

  it('should include opening hours', () => {
    const { container } = render(<LocalBusinessJsonLd />);
    const data = extractJsonLd(container);

    expect(Array.isArray(data.openingHoursSpecification)).toBe(true);
    const hours = data.openingHoursSpecification as Array<
      Record<string, unknown>
    >;
    expect(hours.length).toBeGreaterThan(0);
    expect(hours[0]['@type']).toBe('OpeningHoursSpecification');
  });

  it('should include aggregate rating with custom values', () => {
    const { container } = render(
      <LocalBusinessJsonLd ratingValue={4.9} reviewCount={300} />,
    );
    const data = extractJsonLd(container);
    const rating = data.aggregateRating as Record<string, unknown>;

    expect(rating['@type']).toBe('AggregateRating');
    expect(rating.ratingValue).toBe(4.9);
    expect(rating.reviewCount).toBe(300);
  });

  it('should set locale via @language', () => {
    const { container } = render(<LocalBusinessJsonLd locale="es" />);
    const data = extractJsonLd(container);
    expect(data['@language']).toBe('es');
  });
});

describe('WebsiteJsonLd', () => {
  it('should render valid WebSite schema', () => {
    const { container } = render(<WebsiteJsonLd description="Test site" />);
    const data = extractJsonLd(container);

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('WebSite');
    expect(data.url).toMatch(/^https:\/\//);
    expect(data.name).toBeTruthy();
    expect(data.description).toBe('Test site');
  });

  it('should reference publisher by @id', () => {
    const { container } = render(<WebsiteJsonLd />);
    const data = extractJsonLd(container);
    const publisher = data.publisher as Record<string, unknown>;

    expect(publisher['@id']).toContain('#business');
  });

  it('should set inLanguage', () => {
    const { container } = render(<WebsiteJsonLd locale="es" />);
    const data = extractJsonLd(container);
    expect(data.inLanguage).toBe('es');
  });
});

describe('ReviewsJsonLd', () => {
  it('should render AutoBodyShop with aggregateRating', () => {
    const { container } = render(
      <ReviewsJsonLd ratingValue={4.7} reviewCount={243} />,
    );
    const data = extractJsonLd(container);

    expect(data['@type']).toBe('AutoBodyShop');
    const rating = data.aggregateRating as Record<string, unknown>;
    expect(rating.ratingValue).toBe(4.7);
    expect(rating.reviewCount).toBe(243);
  });

  it('should include address', () => {
    const { container } = render(<ReviewsJsonLd />);
    const data = extractJsonLd(container);
    const address = data.address as Record<string, unknown>;
    expect(address['@type']).toBe('PostalAddress');
  });
});

describe('FAQJsonLd', () => {
  const faqs = [
    { question: 'How long does repair take?', answer: '3-5 business days' },
    {
      question: 'Do you work with insurance?',
      answer: 'Yes, all major carriers',
    },
  ];

  it('should render FAQPage schema', () => {
    const { container } = render(<FAQJsonLd faqs={faqs} />);
    const data = extractJsonLd(container);

    expect(data['@type']).toBe('FAQPage');
  });

  it('should include all FAQ items as Question/Answer pairs', () => {
    const { container } = render(<FAQJsonLd faqs={faqs} />);
    const data = extractJsonLd(container);
    const entities = data.mainEntity as Array<Record<string, unknown>>;

    expect(entities).toHaveLength(2);
    expect(entities[0]['@type']).toBe('Question');
    expect(entities[0].name).toBe('How long does repair take?');

    const answer = entities[0].acceptedAnswer as Record<string, unknown>;
    expect(answer['@type']).toBe('Answer');
    expect(answer.text).toBe('3-5 business days');
  });

  it('should handle empty FAQ array', () => {
    const { container } = render(<FAQJsonLd faqs={[]} />);
    const data = extractJsonLd(container);
    expect(data.mainEntity).toEqual([]);
  });
});

describe('BreadcrumbJsonLd', () => {
  it('should render BreadcrumbList schema', () => {
    const items = [
      { name: 'Home', item: '/en' },
      { name: 'About', item: '/en/about' },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const data = extractJsonLd(container);

    expect(data['@type']).toBe('BreadcrumbList');
    const list = data.itemListElement as Array<Record<string, unknown>>;
    expect(list).toHaveLength(2);
    expect(list[0].position).toBe(1);
    expect(list[1].position).toBe(2);
  });

  it('should prepend base URL to relative paths', () => {
    const items = [{ name: 'Home', item: '/en' }];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const data = extractJsonLd(container);
    const list = data.itemListElement as Array<Record<string, unknown>>;

    expect(list[0].item).toMatch(/^https:\/\/.+\/en$/);
  });

  it('should keep absolute URLs as-is', () => {
    const items = [{ name: 'External', item: 'https://example.com/page' }];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const data = extractJsonLd(container);
    const list = data.itemListElement as Array<Record<string, unknown>>;

    expect(list[0].item).toBe('https://example.com/page');
  });
});

describe('generateBreadcrumbItems', () => {
  it('should generate home + page breadcrumb for EN', () => {
    const items = generateBreadcrumbItems('About', '/en/about', 'Home', 'en');
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ name: 'Home', item: '/en' });
    expect(items[1]).toEqual({ name: 'About', item: '/en/about' });
  });

  it('should generate localized home path for ES', () => {
    const items = generateBreadcrumbItems(
      'Nosotros',
      '/es/nosotros',
      'Inicio',
      'es',
    );
    expect(items[0].item).toBe('/es');
    expect(items[0].name).toBe('Inicio');
  });
});

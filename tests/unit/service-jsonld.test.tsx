import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ServiceJsonLd } from '@/components/services/ServiceJsonLd';
import { FALLBACK_RATING } from '@/lib/google-places';

vi.mock('@/lib/google-places', async () => {
  const actual = await vi.importActual<typeof import('@/lib/google-places')>(
    '@/lib/google-places',
  );
  return {
    ...actual,
    getBusinessRating: vi.fn(actual.getBusinessRating),
  };
});

import { getBusinessRating } from '@/lib/google-places';

function extractJsonLd(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.textContent!);
}

afterEach(() => {
  vi.mocked(getBusinessRating).mockReset();
});

describe('ServiceJsonLd aggregateRating', () => {
  it('omits aggregateRating when showAggregateRating is false', async () => {
    const element = await ServiceJsonLd({
      serviceName: 'Test Service',
      description: 'A test service',
      url: 'https://example.com/test',
    });
    const { container } = render(element);
    const data = extractJsonLd(container);

    expect(data.aggregateRating).toBeUndefined();
    expect(getBusinessRating).not.toHaveBeenCalled();
  });

  it('pulls the live rating/reviewCount from the same Google Places source as the homepage widget', async () => {
    vi.mocked(getBusinessRating).mockResolvedValue({
      ratingValue: 4.95,
      reviewCount: 512,
    });

    const element = await ServiceJsonLd({
      serviceName: 'Test Service',
      description: 'A test service',
      url: 'https://example.com/test',
      showAggregateRating: true,
    });
    const { container } = render(element);
    const data = extractJsonLd(container);
    const rating = data.aggregateRating as Record<string, unknown>;

    expect(getBusinessRating).toHaveBeenCalledTimes(1);
    expect(rating.ratingValue).toBe(4.95);
    expect(rating.reviewCount).toBe(512);
  });

  it('falls back to FALLBACK_RATING when the live source is unavailable', async () => {
    vi.mocked(getBusinessRating).mockResolvedValue(FALLBACK_RATING);

    const element = await ServiceJsonLd({
      serviceName: 'Test Service',
      description: 'A test service',
      url: 'https://example.com/test',
      showAggregateRating: true,
    });
    const { container } = render(element);
    const data = extractJsonLd(container);
    const rating = data.aggregateRating as Record<string, unknown>;

    expect(rating.ratingValue).toBe(FALLBACK_RATING.ratingValue);
    expect(rating.reviewCount).toBe(FALLBACK_RATING.reviewCount);
  });
});

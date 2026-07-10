import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FALLBACK_RATING,
  getBusinessRating,
  getBusinessReviews,
  getReviewsPageUrl,
} from '@/lib/google-places';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('FALLBACK_RATING', () => {
  it('is exported so it can act as the single source of truth for defaults', () => {
    expect(FALLBACK_RATING.ratingValue).toBeGreaterThan(0);
    expect(FALLBACK_RATING.reviewCount).toBeGreaterThan(0);
  });
});

describe('getBusinessRating', () => {
  it('returns the fallback rating when Places credentials are missing', async () => {
    delete process.env.GOOGLE_PLACE_ID;
    delete process.env.GOOGLE_PLACES_API_KEY;

    const rating = await getBusinessRating();

    expect(rating).toEqual(FALLBACK_RATING);
  });

  it('returns live rating/reviewCount from the Places API when credentials exist', async () => {
    process.env.GOOGLE_PLACE_ID = 'test-place-id';
    process.env.GOOGLE_PLACES_API_KEY = 'test-api-key';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rating: 4.8, userRatingCount: 321, reviews: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const rating = await getBusinessRating();

    expect(rating).toEqual({ ratingValue: 4.8, reviewCount: 321 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('test-place-id'),
      expect.objectContaining({
        headers: { 'X-Goog-Api-Key': 'test-api-key' },
      }),
    );
  });

  it('falls back gracefully when the Places API request fails', async () => {
    process.env.GOOGLE_PLACE_ID = 'test-place-id';
    process.env.GOOGLE_PLACES_API_KEY = 'test-api-key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    const rating = await getBusinessRating();

    expect(rating).toEqual(FALLBACK_RATING);
  });
});

describe('getBusinessReviews', () => {
  it('returns an empty array when Places credentials are missing', async () => {
    delete process.env.GOOGLE_PLACE_ID;
    delete process.env.GOOGLE_PLACES_API_KEY;

    const reviews = await getBusinessReviews();

    expect(reviews).toEqual([]);
  });
});

describe('getReviewsPageUrl', () => {
  it('returns null when no place id is configured', () => {
    delete process.env.GOOGLE_PLACE_ID;
    expect(getReviewsPageUrl()).toBeNull();
  });

  it('builds a Google reviews URL from the place id', () => {
    process.env.GOOGLE_PLACE_ID = 'test-place-id';
    expect(getReviewsPageUrl()).toBe(
      'https://search.google.com/local/reviews?placeid=test-place-id',
    );
  });
});

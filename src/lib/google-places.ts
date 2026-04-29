import 'server-only';

type PlaceRating = {
  ratingValue: number;
  reviewCount: number;
};

export type BusinessReview = {
  id: string;
  authorName: string;
  authorUrl?: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  language: string;
  relativeTime: string;
  publishedAt: string;
  reviewUrl?: string;
};

type PlaceApiAuthor = {
  displayName?: string;
  uri?: string;
  photoUri?: string;
};

type PlaceApiReview = {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: PlaceApiAuthor;
  publishTime?: string;
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
};

type PlacesApiResponse = {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlaceApiReview[];
};

const FALLBACK_RATING: PlaceRating = {
  ratingValue: 4.9,
  reviewCount: 150,
};

async function fetchPlaceDetails(): Promise<PlacesApiResponse | null> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!placeId || !apiKey) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,reviews`,
      {
        headers: { 'X-Goog-Api-Key': apiKey },
        next: { revalidate: 86400, tags: ['google-reviews'] },
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as PlacesApiResponse;
  } catch {
    return null;
  }
}

export async function getBusinessRating(): Promise<PlaceRating> {
  const data = await fetchPlaceDetails();
  if (
    !data ||
    typeof data.rating !== 'number' ||
    typeof data.userRatingCount !== 'number'
  ) {
    return FALLBACK_RATING;
  }
  return {
    ratingValue: data.rating,
    reviewCount: data.userRatingCount,
  };
}

export async function getBusinessReviews(): Promise<BusinessReview[]> {
  const data = await fetchPlaceDetails();
  if (!data?.reviews?.length) return [];

  return data.reviews
    .filter((r) => r.name && r.text?.text && typeof r.rating === 'number')
    .map((r) => ({
      id: r.name!,
      authorName: r.authorAttribution?.displayName ?? 'Anonymous',
      authorUrl: r.authorAttribution?.uri,
      authorPhotoUrl: r.authorAttribution?.photoUri,
      rating: r.rating!,
      text: r.text!.text!,
      language: r.text?.languageCode ?? 'en',
      relativeTime: r.relativePublishTimeDescription ?? '',
      publishedAt: r.publishTime ?? '',
      reviewUrl: r.googleMapsUri,
    }));
}

export function getReviewsPageUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return null;
  return `https://search.google.com/local/reviews?placeid=${placeId}`;
}

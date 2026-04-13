import 'server-only';

type PlaceRating = {
  ratingValue: number;
  reviewCount: number;
};

type PlacesApiResponse = {
  rating?: number;
  userRatingCount?: number;
};

const FALLBACK: PlaceRating = {
  ratingValue: 4.9,
  reviewCount: 150,
};

export async function getBusinessRating(): Promise<PlaceRating> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return FALLBACK;
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount`,
      {
        headers: { 'X-Goog-Api-Key': apiKey },
        next: { revalidate: 86400, tags: ['google-reviews'] },
      },
    );

    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as PlacesApiResponse;

    if (
      typeof data.rating !== 'number' ||
      typeof data.userRatingCount !== 'number'
    ) {
      return FALLBACK;
    }

    return {
      ratingValue: data.rating,
      reviewCount: data.userRatingCount,
    };
  } catch {
    return FALLBACK;
  }
}

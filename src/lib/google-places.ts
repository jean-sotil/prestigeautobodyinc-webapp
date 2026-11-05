import 'server-only';
import { FALLBACK_RATING, type PlaceRating } from '@/lib/rating-fallback';

export { FALLBACK_RATING };

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

// Review avatars render at 40x40 CSS px. Google-hosted photo URLs
// (lh3.googleusercontent.com / *.ggpht.com) accept a trailing size directive
// such as "=s128-c". Default avatars come at 128px, which is ~10x the bytes
// actually displayed. Normalize the size token to 80px (40px at 2x DPR) so the
// image is requested at the size it is shown. Displayed dimensions and crop are
// unchanged, so layout/CLS and alt text are unaffected.
const AVATAR_RENDER_SIZE = 80;

function sizeAvatarUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const isGoogleHosted = /(?:googleusercontent\.com|ggpht\.com)\//.test(url);
  if (!isGoogleHosted) return url;

  // Replace an existing "=s<NN>" token (optionally followed by more flags like
  // "-c-rp-mo-br100"), preserving any extra flags after the size value.
  if (/=s\d+/.test(url)) {
    return url.replace(/=s\d+/, `=s${AVATAR_RENDER_SIZE}`);
  }
  // No size directive present: append a cropped-square size token.
  return `${url}${url.includes('=') ? '-' : '='}s${AVATAR_RENDER_SIZE}-c`;
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
      authorPhotoUrl: sizeAvatarUrl(r.authorAttribution?.photoUri),
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

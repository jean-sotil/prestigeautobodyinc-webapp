/**
 * Last-resort rating/reviewCount shared by:
 *  - `src/lib/google-places.ts` (server-only): returned by `getBusinessRating()`
 *    whenever the Google Places API is unreachable or unconfigured.
 *  - `src/lib/business.ts` (client + server): used as the default
 *    `RATING_INFO` for JSON-LD schemas when no live value is passed in.
 *
 * This constant intentionally lives in its own module with NO `server-only`
 * import. `business.ts` is imported by client components (e.g.
 * `src/components/layout/Header.tsx`, for `SHOP_PHONE_TEL`), so it cannot
 * depend on `google-places.ts` directly — that module imports `server-only`
 * to guard its live Places API fetch logic. Factoring the shared literal out
 * here lets both modules reuse the exact same number without crossing the
 * client/server boundary.
 */
export type PlaceRating = {
  ratingValue: number;
  reviewCount: number;
};

export const FALLBACK_RATING: PlaceRating = {
  ratingValue: 4.9,
  reviewCount: 150,
};

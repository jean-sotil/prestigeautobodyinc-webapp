import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { StarIcon } from '@/components/ui/Icons';
import {
  getBusinessReviews,
  getReviewsPageUrl,
  type BusinessReview,
} from '@/lib/google-places';
import { CarouselControls } from './GoogleReviewsCarouselControls';

const SCROLL_ID = 'google-reviews-track';
const TEXT_LIMIT = 220;

function truncate(
  text: string,
  max: number,
): { body: string; clipped: boolean } {
  if (text.length <= max) return { body: text, clipped: false };
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return {
    body:
      (lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd() +
      '…',
    clipped: true,
  };
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div
      className="flex items-center gap-0.5 text-primary"
      aria-label={label}
      role="img"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i < rating ? '' : 'opacity-25'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  readMoreLabel,
  starsLabel,
}: {
  review: BusinessReview;
  readMoreLabel: string;
  starsLabel: (n: number) => string;
}) {
  const { body, clipped } = truncate(review.text, TEXT_LIMIT);
  return (
    <article
      lang={review.language}
      className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] bg-card text-card-foreground rounded-2xl border border-border p-5 flex flex-col gap-3"
    >
      <header className="flex items-center gap-3">
        {review.authorPhotoUrl ? (
          <Image
            src={review.authorPhotoUrl}
            alt=""
            width={40}
            height={40}
            className="rounded-full object-cover"
            referrerPolicy="no-referrer"
            unoptimized
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground"
          >
            {review.authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {review.authorName}
          </p>
          <p className="text-xs text-muted-foreground">{review.relativeTime}</p>
        </div>
      </header>

      <Stars rating={review.rating} label={starsLabel(review.rating)} />

      <p className="text-sm text-foreground leading-relaxed flex-1">{body}</p>

      {(clipped || review.reviewUrl) && review.reviewUrl && (
        <a
          href={review.reviewUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm self-start"
        >
          {readMoreLabel}
        </a>
      )}
    </article>
  );
}

export async function GoogleReviewsCarousel({
  locale,
}: { locale?: string } = {}) {
  const [reviews, t] = await Promise.all([
    getBusinessReviews(),
    getTranslations({ locale: locale || 'en', namespace: 'reviews' }),
  ]);
  const allReviewsUrl = getReviewsPageUrl();

  if (reviews.length === 0) {
    if (!allReviewsUrl) return null;
    return (
      <a
        href={allReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        {t('viewAll')} →
      </a>
    );
  }

  const starsLabel = (n: number) => t('starsLabel', { count: n, total: 5 });

  return (
    <div className="w-full">
      <div className="relative">
        <CarouselControls
          scrollTargetId={SCROLL_ID}
          prevLabel={t('previous')}
          nextLabel={t('next')}
        />
        <ol
          id={SCROLL_ID}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={t('listLabel')}
        >
          {reviews.map((review) => (
            <li key={review.id} className="contents">
              <ReviewCard
                review={review}
                readMoreLabel={t('readMore')}
                starsLabel={starsLabel}
              />
            </li>
          ))}
        </ol>
      </div>

      {allReviewsUrl && (
        <div className="mt-4 text-center">
          <a
            href={allReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {t('viewAll')}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default GoogleReviewsCarousel;

'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Props = {
  scrollTargetId: string;
  prevLabel: string;
  nextLabel: string;
};

const SCROLL_THRESHOLD = 4;
const CAN_PREV = 1;
const CAN_NEXT = 2;

function getCardWidth(track: HTMLElement): number {
  const firstCard = track.querySelector<HTMLElement>('article');
  if (!firstCard) return track.clientWidth;
  const styles = window.getComputedStyle(track);
  const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function readScrollState(scrollTargetId: string): number {
  if (typeof document === 'undefined') return 0;
  const track = document.getElementById(scrollTargetId);
  if (!track) return 0;
  const max = track.scrollWidth - track.clientWidth;
  let state = 0;
  if (track.scrollLeft > SCROLL_THRESHOLD) state |= CAN_PREV;
  if (track.scrollLeft < max - SCROLL_THRESHOLD) state |= CAN_NEXT;
  return state;
}

export function CarouselControls({
  scrollTargetId,
  prevLabel,
  nextLabel,
}: Props) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const track = document.getElementById(scrollTargetId);
      if (!track) return () => {};
      track.addEventListener('scroll', cb, { passive: true });
      window.addEventListener('resize', cb);
      return () => {
        track.removeEventListener('scroll', cb);
        window.removeEventListener('resize', cb);
      };
    },
    [scrollTargetId],
  );

  const getSnapshot = useCallback(
    () => readScrollState(scrollTargetId),
    [scrollTargetId],
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  const canPrev = (state & CAN_PREV) !== 0;
  const canNext = (state & CAN_NEXT) !== 0;

  const scroll = (direction: 1 | -1) => {
    const track = document.getElementById(scrollTargetId);
    if (!track) return;
    track.scrollBy({
      left: direction * getCardWidth(track),
      behavior: 'smooth',
    });
  };

  if (!canPrev && !canNext) return null;

  return (
    <div className="hidden sm:flex absolute -top-12 right-0 gap-2 z-10">
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!canPrev}
        aria-label={prevLabel}
        className="w-9 h-9 rounded-full border border-border bg-background text-foreground flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <path
            d="M10 3L5 8l5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!canNext}
        aria-label={nextLabel}
        aria-controls={scrollTargetId}
        className="w-9 h-9 rounded-full border border-border bg-background text-foreground flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <path
            d="M6 3l5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

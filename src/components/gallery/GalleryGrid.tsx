'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

export interface GalleryItem {
  src: string;
  alt: string;
  /** Visible title used in aria-labels (e.g. album name) */
  title: string;
}

interface GalleryGridLabels {
  openImage: string;
  /** ICU template with {title}, {index}, {total} */
  imageAriaLabel: string;
  lightbox: {
    label: string;
    close: string;
    previous: string;
    next: string;
    /** ICU template with {current}, {total} */
    counter: string;
    instructions: string;
  };
}

interface GalleryGridProps {
  items: GalleryItem[];
  labels: GalleryGridLabels;
}

function formatTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}

export function GalleryGrid({ items, labels }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpenedIndexRef = useRef<number | null>(null);
  const titleId = useId();
  const instructionsId = useId();
  const counterId = useId();

  const total = items.length;
  const isOpen = activeIndex !== null;

  const open = useCallback((index: number) => {
    lastOpenedIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    setActiveIndex(null);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      lastOpenedIndexRef.current = wrapped;
      setActiveIndex(wrapped);
    },
    [total],
  );

  // Open / close native <dialog> in sync with state, and lock body scroll.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => closeButtonRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Restore focus to the originally-clicked trigger when the lightbox closes.
  // Tracked via lastOpenedIndexRef because activeIndex is null at this point.
  useEffect(() => {
    if (isOpen) return;
    const idx = lastOpenedIndexRef.current;
    if (idx === null) return;
    triggerRefs.current[idx]?.focus({ preventScroll: true });
  }, [isOpen]);

  // Keyboard navigation while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo((activeIndex ?? 0) + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo((activeIndex ?? 0) - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, activeIndex, goTo]);

  if (total === 0) return null;
  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {items.map((item, index) => {
          const ariaLabel = formatTemplate(labels.imageAriaLabel, {
            title: item.title,
            index: index + 1,
            total,
          });
          return (
            <li key={item.src}>
              <button
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                type="button"
                onClick={() => open(index)}
                aria-label={ariaLabel}
                className="group relative block w-full overflow-hidden rounded-lg bg-secondary aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  priority={index < 4}
                  loading={index < 4 ? 'eager' : 'lazy'}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="sr-only">{labels.openImage}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={`${counterId} ${instructionsId}`}
        onClose={close}
        onClick={(e) => {
          // Click on backdrop (the dialog itself, not its content) closes.
          if (e.target === dialogRef.current) close();
        }}
        className="m-0 max-h-none max-w-none h-screen w-screen bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-black/90 p-4 sm:p-8">
          <h2 id={titleId} className="sr-only">
            {labels.lightbox.label}
          </h2>
          <p id={instructionsId} className="sr-only">
            {labels.lightbox.instructions}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={labels.lightbox.close}
            className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:right-6 sm:top-6"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo((activeIndex ?? 0) - 1)}
                aria-label={labels.lightbox.previous}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:left-6 sm:h-12 sm:w-12"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => goTo((activeIndex ?? 0) + 1)}
                aria-label={labels.lightbox.next}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:right-6 sm:h-12 sm:w-12"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {active && (
            <figure className="relative flex h-full max-h-[88vh] w-full max-w-6xl flex-col items-center justify-center gap-3">
              <div className="relative w-full flex-1">
                <Image
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(min-width: 1024px) 90vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="max-w-3xl text-center text-sm text-white/85">
                {active.alt}
              </figcaption>
            </figure>
          )}

          <p
            id={counterId}
            aria-live="polite"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tabular-nums text-white sm:bottom-6 sm:text-sm"
          >
            {formatTemplate(labels.lightbox.counter, {
              current: (activeIndex ?? 0) + 1,
              total,
            })}
          </p>
        </div>
      </dialog>
    </>
  );
}

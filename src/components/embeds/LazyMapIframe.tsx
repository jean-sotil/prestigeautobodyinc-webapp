'use client';

import { useEffect, useRef, useState } from 'react';

type LazyMapIframeProps = {
  src: string;
  title: string;
  /** Container classes. Defaults to filling the parent. */
  containerClassName?: string;
  /** Classes applied to the iframe itself. */
  iframeClassName?: string;
  allowFullScreen?: boolean;
};

/**
 * Renders a Google Maps embed iframe, but only sets its `src` once the element
 * scrolls near the viewport. This keeps the heavy Maps JS (maps-api, places.js,
 * etc.) out of the initial page load, reducing unused JavaScript and TBT.
 *
 * The outer container keeps identical dimensions whether or not the iframe has
 * mounted, so layout and CLS are unaffected. The iframe keeps its original
 * `title` for accessibility.
 */
export function LazyMapIframe({
  src,
  title,
  containerClassName = 'w-full h-full',
  iframeClassName,
  allowFullScreen = false,
}: LazyMapIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // If IntersectionObserver is unavailable, load immediately so the map is
    // never missing for the user.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={containerClassName}>
      {visible ? (
        <iframe
          src={src}
          title={title}
          {...(iframeClassName
            ? { className: iframeClassName }
            : { width: '100%', height: '100%', style: { border: 0 } })}
          allowFullScreen={allowFullScreen}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div
          className={iframeClassName ?? 'w-full h-full'}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default LazyMapIframe;

import Script from 'next/script';

type GoogleReviewsProps = {
  appId?: string;
  className?: string;
};

export function GoogleReviews({
  appId = '82207e06-62d0-4598-b2ea-0a113eb4fad6',
  className,
}: GoogleReviewsProps) {
  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div
        className={`elfsight-app-${appId} w-full min-h-[480px] ${className ?? ''}`.trim()}
        data-elfsight-app-lazy
      />
    </>
  );
}

export default GoogleReviews;

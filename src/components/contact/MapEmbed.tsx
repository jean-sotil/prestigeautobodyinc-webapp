type MapEmbedProps = {
  query: string;
  title: string;
  openInMapsLabel: string;
  className?: string;
};

export function MapEmbed({
  query,
  title,
  openInMapsLabel,
  className = '',
}: MapEmbedProps) {
  const encoded = encodeURIComponent(query);
  const embedUrl = `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <section
      aria-label={title}
      className={`relative w-full bg-muted ${className}`}
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/8] w-full">
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg ring-1 ring-border transition hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {openInMapsLabel}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </section>
  );
}

import NextLink from 'next/link';

const SERVICE_AREAS = [
  { name: 'Silver Spring', slug: 'silver-spring' },
  { name: 'Bethesda', slug: 'bethesda' },
  { name: 'Rockville', slug: 'rockville' },
  { name: 'Chevy Chase', slug: 'chevy-chase' },
  { name: 'Wheaton', slug: 'wheaton' },
  { name: 'Takoma Park', slug: 'takoma-park' },
  { name: 'Adelphi', slug: 'adelphi' },
  { name: 'North Bethesda', slug: 'north-bethesda' },
];

interface ServiceAreasProps {
  heading: string;
  locale: string;
}

export function ServiceAreas({ heading, locale }: ServiceAreasProps) {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {heading}
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {SERVICE_AREAS.map((area) => (
            <NextLink
              key={area.slug}
              href={`/${locale}/areas/${area.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background text-foreground border border-border hover:border-primary hover:text-primary transition-colors"
            >
              {area.name}
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
}

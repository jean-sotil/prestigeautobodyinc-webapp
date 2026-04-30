const SERVICE_AREAS = [
  'Silver Spring',
  'Bethesda',
  'Rockville',
  'Chevy Chase',
  'Wheaton',
  'Takoma Park',
  'Adelphi',
  'North Bethesda',
];

interface ServiceAreasProps {
  heading: string;
}

export function ServiceAreas({ heading }: ServiceAreasProps) {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {heading}
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {SERVICE_AREAS.map((area) => (
            <li
              key={area}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-background text-foreground border border-border"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

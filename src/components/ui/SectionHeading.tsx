interface SectionHeadingProps {
  /** Small uppercase label above the heading — uses .overline CSS class */
  overline?: string;
  /** Heading content — can include <span className="text-primary"> for an accent word */
  heading: React.ReactNode;
  /** Center-align — default false */
  centered?: boolean;
  /** Heading level — defaults to h2 */
  as?: 'h1' | 'h2' | 'h3';
  /** id forwarded to the heading element (for aria-labelledby) */
  id?: string;
  /** Color tone — inverted is for sections with dark/image backgrounds and white text */
  tone?: 'default' | 'inverted';
}

export function SectionHeading({
  overline,
  heading,
  centered = false,
  as: Tag = 'h2',
  id,
  tone = 'default',
}: SectionHeadingProps) {
  const headingColor = tone === 'inverted' ? 'text-white' : 'text-foreground';

  return (
    <div className={centered ? 'text-center' : ''}>
      {overline && (
        <span className="overline" aria-hidden="true">
          {overline}
        </span>
      )}

      <Tag
        id={id}
        className={`font-display text-3xl md:text-4xl font-extrabold tracking-display ${headingColor} mb-4`}
      >
        {heading}
      </Tag>

      <div
        className={`flex items-center gap-1.5 mb-8 ${centered ? 'justify-center' : ''}`}
        aria-hidden="true"
      >
        <span className="block h-[3px] w-10 rounded-full bg-primary" />
        <span className="block h-[3px] w-3 rounded-full bg-primary/40" />
        <span className="block h-[3px] w-1.5 rounded-full bg-primary/20" />
      </div>
    </div>
  );
}

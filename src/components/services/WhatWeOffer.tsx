import { CheckCircleIcon } from '@/components/ui/Icons';

export interface OfferingItem {
  title: string;
  description: string;
}

interface WhatWeOfferProps {
  heading: string;
  items: OfferingItem[];
}

export function WhatWeOffer({ heading, items }: WhatWeOfferProps) {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {heading}
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="shrink-0 mt-0.5">
                <CheckCircleIcon
                  size={24}
                  className="text-primary"
                  ariaLabel=""
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

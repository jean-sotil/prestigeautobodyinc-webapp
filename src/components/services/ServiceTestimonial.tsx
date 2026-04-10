import { StarIcon } from '@/components/ui/Icons';

export interface TestimonialData {
  quote: string;
  author: string;
  location: string;
  rating: number;
}

interface ServiceTestimonialProps {
  testimonial: TestimonialData;
}

export function ServiceTestimonial({ testimonial }: ServiceTestimonialProps) {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Star rating */}
        <div
          className="flex items-center justify-center gap-1"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              size={20}
              className={
                i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }
              ariaLabel=""
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="mt-6">
          <p className="text-lg md:text-xl text-foreground leading-relaxed italic">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        {/* Author */}
        <div className="mt-4">
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.location}
          </p>
        </div>
      </div>
    </section>
  );
}

import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GoogleReviewsCarousel } from '@/components/embeds/GoogleReviewsCarousel';
import { CTABanner } from '@/components/services';
import { CarWashCalculator } from './CarWashCalculator';
import { CarWashWhatsApp } from './CarWashWhatsApp';

interface CarWashServicePageProps {
  locale: string;
}

export async function CarWashServicePage({ locale }: CarWashServicePageProps) {
  const [t, h, r] = await Promise.all([
    getTranslations({ locale, namespace: 'carWash' }),
    getTranslations({ locale, namespace: 'header' }),
    getTranslations({ locale, namespace: 'reviews' }),
  ]);

  const services = [
    {
      key: 'basicWash',
      name: t('services.basicWash.name'),
      description: t('services.basicWash.description'),
      includes: [
        t('services.basicWash.includes.item1'),
        t('services.basicWash.includes.item2'),
        t('services.basicWash.includes.item3'),
        t('services.basicWash.includes.item4'),
        t('services.basicWash.includes.item5'),
        t('services.basicWash.includes.item6'),
        t('services.basicWash.includes.item7'),
        t('services.basicWash.includes.item8'),
      ],
    },
    {
      key: 'fullDetail',
      name: t('services.fullDetail.name'),
      description: t('services.fullDetail.description'),
      includes: [
        t('services.fullDetail.includes.item1'),
        t('services.fullDetail.includes.item2'),
        t('services.fullDetail.includes.item3'),
        t('services.fullDetail.includes.item4'),
        t('services.fullDetail.includes.item5'),
        t('services.fullDetail.includes.item6'),
      ],
    },
    {
      key: 'ceramicCoat',
      name: t('services.ceramicCoat.name'),
      description: t('services.ceramicCoat.description'),
      includes: [
        t('services.ceramicCoat.includes.item1'),
        t('services.ceramicCoat.includes.item2'),
        t('services.ceramicCoat.includes.item3'),
        t('services.ceramicCoat.includes.item4'),
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-foreground relative w-full min-h-80 sm:min-h-96 lg:min-h-110 overflow-hidden flex items-center"
        aria-labelledby="carwash-hero-heading"
      >
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 40%, rgba(198,40,40,0.3) 100%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 w-full">
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-primary text-xs font-semibold uppercase tracking-wider w-fit">
              {t('hero.badge')}
            </span>
            <h1
              id="carwash-hero-heading"
              className="font-display font-extrabold text-white text-3xl md:text-5xl leading-tight tracking-display drop-shadow-lg"
            >
              {t('hero.title')}
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>
            <p className="text-white/60 text-sm italic">
              {t('hero.appointmentNote')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section
        className="py-16 bg-background"
        aria-labelledby="carwash-services-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="carwash-services-heading"
            overline={t('servicesSection.overline')}
            heading={t('servicesSection.heading')}
            centered
          />
          <p className="text-center text-(--text-secondary) text-sm mt-2 mb-10 max-w-2xl mx-auto">
            {t('servicesSection.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.key}
                className="bg-white dark:bg-[#2D2D2D] border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {service.name}
                </h3>
                <p className="text-(--text-secondary) text-sm mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.includes.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span
                        className="text-primary mt-0.5 shrink-0"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A La Carte Services */}
      <section
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby="alacarte-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="alacarte-heading"
            overline={t('alaCarte.overline')}
            heading={t('alaCarte.heading')}
            centered
          />
          <p className="text-center text-(--text-secondary) text-sm mt-2 mb-10 max-w-2xl mx-auto">
            {t('alaCarte.subtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { name: t('alaCarte.items.headlights'), price: '$49.99 each' },
              { name: t('alaCarte.items.floorMat'), price: '$25.99' },
              {
                name: t('alaCarte.items.tintRemoval'),
                price: t('alaCarte.startingAt') + ' $75.00',
              },
              { name: t('alaCarte.items.carpetShampoo'), price: '$75.00' },
              { name: t('alaCarte.items.engineDetail'), price: '$50.00' },
              { name: t('alaCarte.items.upholstery'), price: '$100.00*' },
              {
                name: t('alaCarte.items.treeSap'),
                price: t('alaCarte.askEstimate'),
              },
              { name: t('alaCarte.items.leatherRecondition'), price: '$69.00' },
              { name: t('alaCarte.items.rimDetailing'), price: '$60.00' },
              { name: t('alaCarte.items.rimFullService'), price: '$100.00' },
              { name: t('alaCarte.items.wheelRepair'), price: '$195.00' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white dark:bg-[#2D2D2D] rounded-xl px-4 py-3 border border-border"
              >
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-primary whitespace-nowrap ml-2">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-(--text-secondary) text-xs mt-4">
            * {t('alaCarte.inspectionNote')}
          </p>
        </div>
      </section>

      {/* Price Calculator */}
      <section
        className="py-16 bg-background"
        aria-labelledby="calculator-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="calculator-heading"
            overline={t('calculator.overline')}
            heading={t('calculator.heading')}
            centered
          />
          <p className="text-center text-(--text-secondary) text-sm mt-2 mb-10 max-w-2xl mx-auto">
            {t('calculator.subtitle')}
          </p>
          <CarWashCalculator locale={locale} />
        </div>
      </section>

      {/* WhatsApp Appointment Section */}
      <section
        className="py-16 bg-[#2D2D2D] dark:bg-[#1A1A1A]"
        aria-labelledby="appointment-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="appointment-heading"
            overline={t('appointment.overline')}
            heading={t('appointment.heading')}
            tone="inverted"
            centered
          />
          <p className="text-center text-white/70 text-sm mt-2 mb-10 max-w-2xl mx-auto">
            {t('appointment.subtitle')}
          </p>
          <CarWashWhatsApp locale={locale} />
        </div>
      </section>

      {/* Reviews */}
      <section
        className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        aria-labelledby="reviews-carwash"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <SectionHeading
            id="reviews-carwash"
            overline={r('sectionOverline')}
            heading={r('sectionHeading')}
            centered
          />
          <GoogleReviewsCarousel locale={locale} />
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        headline={t('cta.headline')}
        subtitle={t('cta.subtitle')}
        ctaQuoteLabel={t('cta.button')}
        ctaPhoneLabel={`Call ${h('phone')}`}
        phone="3015788779"
        phoneDisplay={h('phone')}
      />
    </div>
  );
}

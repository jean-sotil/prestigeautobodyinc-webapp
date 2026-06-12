'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type VehicleSize = 'car' | 'smallSuv' | 'largeSuv';
type ServiceType = 'basicWash' | 'fullDetail' | 'ceramicCoat';
type AlaCarteItem =
  | 'headlights'
  | 'floorMat'
  | 'tintRemoval'
  | 'carpetShampoo'
  | 'engineDetail'
  | 'upholstery'
  | 'leatherRecondition'
  | 'rimDetailing'
  | 'rimFullService'
  | 'wheelRepair';

const PRICING: Record<ServiceType, Record<VehicleSize, number>> = {
  basicWash: { car: 40, smallSuv: 60, largeSuv: 80 },
  fullDetail: { car: 175, smallSuv: 205, largeSuv: 250 },
  ceramicCoat: { car: 1400, smallSuv: 1750, largeSuv: 2200 },
};

const ALACARTE_PRICING: Record<AlaCarteItem, number> = {
  headlights: 49.99,
  floorMat: 25.99,
  tintRemoval: 75.0,
  carpetShampoo: 75.0,
  engineDetail: 50.0,
  upholstery: 100.0,
  leatherRecondition: 69.0,
  rimDetailing: 60.0,
  rimFullService: 100.0,
  wheelRepair: 195.0,
};

const WHATSAPP_PHONES = ['12404758442', '12407615729'];

interface CarWashCalculatorProps {
  locale: string;
}

export function CarWashCalculator({ locale }: CarWashCalculatorProps) {
  const t = useTranslations('carWash.calculator');

  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('car');
  const [serviceType, setServiceType] = useState<ServiceType>('basicWash');
  const [extras, setExtras] = useState<Set<AlaCarteItem>>(new Set());

  const toggleExtra = (item: AlaCarteItem) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const { basePrice, extrasTotal, total } = useMemo(() => {
    const base = PRICING[serviceType][vehicleSize];
    const extrasSum = Array.from(extras).reduce(
      (sum, item) => sum + ALACARTE_PRICING[item],
      0,
    );
    return { basePrice: base, extrasTotal: extrasSum, total: base + extrasSum };
  }, [vehicleSize, serviceType, extras]);

  const vehicleSizeLabel = t(`vehicleSizes.${vehicleSize}`);
  const serviceLabel = t(`serviceTypes.${serviceType}`);

  const whatsappMessage = useMemo(() => {
    const extrasList = Array.from(extras)
      .map((item) => t(`extras.${item}`))
      .join(', ');

    return (
      `${t('whatsappIntro')}\n\n` +
      `${t('vehicleLabel')}: ${vehicleSizeLabel}\n` +
      `${t('serviceLabel')}: ${serviceLabel}\n` +
      (extrasList ? `${t('extrasLabel')}: ${extrasList}\n` : '') +
      `${t('estimatedTotal')}: $${total.toFixed(2)}\n\n` +
      t('whatsappNote')
    );
  }, [vehicleSizeLabel, serviceLabel, extras, total, t]);

  const vehicleSizes: { key: VehicleSize; label: string }[] = [
    { key: 'car', label: t('vehicleSizes.car') },
    { key: 'smallSuv', label: t('vehicleSizes.smallSuv') },
    { key: 'largeSuv', label: t('vehicleSizes.largeSuv') },
  ];

  const serviceTypes: { key: ServiceType; label: string; price: string }[] = [
    {
      key: 'basicWash',
      label: t('serviceTypes.basicWash'),
      price: `$${PRICING.basicWash[vehicleSize]}`,
    },
    {
      key: 'fullDetail',
      label: t('serviceTypes.fullDetail'),
      price: `$${PRICING.fullDetail[vehicleSize]}`,
    },
    {
      key: 'ceramicCoat',
      label: t('serviceTypes.ceramicCoat'),
      price: `$${PRICING.ceramicCoat[vehicleSize].toLocaleString()}`,
    },
  ];

  const alaCarteItems: { key: AlaCarteItem; label: string; price: string }[] = [
    { key: 'headlights', label: t('extras.headlights'), price: '$49.99' },
    { key: 'floorMat', label: t('extras.floorMat'), price: '$25.99' },
    { key: 'tintRemoval', label: t('extras.tintRemoval'), price: '$75.00' },
    { key: 'carpetShampoo', label: t('extras.carpetShampoo'), price: '$75.00' },
    { key: 'engineDetail', label: t('extras.engineDetail'), price: '$50.00' },
    { key: 'upholstery', label: t('extras.upholstery'), price: '$100.00' },
    {
      key: 'leatherRecondition',
      label: t('extras.leatherRecondition'),
      price: '$69.00',
    },
    { key: 'rimDetailing', label: t('extras.rimDetailing'), price: '$60.00' },
    {
      key: 'rimFullService',
      label: t('extras.rimFullService'),
      price: '$100.00',
    },
    { key: 'wheelRepair', label: t('extras.wheelRepair'), price: '$195.00' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Step 1: Vehicle Size */}
        <div className="p-6 border-b border-border">
          <h3 className="font-display font-bold text-base text-foreground mb-4">
            {t('step1')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {vehicleSizes.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setVehicleSize(key)}
                className={`rounded-xl px-4 py-3 text-sm font-medium border transition-all ${
                  vehicleSize === key
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-background border-border text-foreground hover:border-primary/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Service Type */}
        <div className="p-6 border-b border-border">
          <h3 className="font-display font-bold text-base text-foreground mb-4">
            {t('step2')}
          </h3>
          <div className="space-y-3">
            {serviceTypes.map(({ key, label, price }) => (
              <button
                key={key}
                type="button"
                onClick={() => setServiceType(key)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm border transition-all ${
                  serviceType === key
                    ? 'bg-primary/5 border-primary text-foreground shadow-sm'
                    : 'bg-background border-border text-foreground hover:border-primary/50'
                }`}
              >
                <span className="font-medium">{label}</span>
                <span className="font-bold text-primary">{price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Extras */}
        <div className="p-6 border-b border-border">
          <h3 className="font-display font-bold text-base text-foreground mb-4">
            {t('step3')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alaCarteItems.map(({ key, label, price }) => (
              <label
                key={key}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 border cursor-pointer transition-all text-sm ${
                  extras.has(key)
                    ? 'bg-primary/5 border-primary'
                    : 'bg-background border-border hover:border-primary/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={extras.has(key)}
                  onChange={() => toggleExtra(key)}
                  className="accent-[#c62828] w-4 h-4 shrink-0"
                />
                <span className="flex-1 text-foreground">{label}</span>
                <span className="text-xs font-semibold text-primary whitespace-nowrap">
                  {price}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Total & CTA */}
        <div className="p-6 bg-[#F5F5F5] dark:bg-[#1A1A1A]">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between text-sm text-foreground">
              <span>{serviceLabel}</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between text-sm text-foreground">
                <span>{t('extrasLabel')}</span>
                <span>${extrasTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-foreground border-t border-border pt-2 mt-1">
              <span>{t('estimatedTotal')}</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-(--text-secondary) mb-4 italic">
            {t('disclaimer')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {WHATSAPP_PHONES.map((phone, idx) => (
              <a
                key={phone}
                href={`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('bookVia')} {idx === 0 ? '(240) 475-8442' : '(240) 761-5729'}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

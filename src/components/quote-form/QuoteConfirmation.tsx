'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SHOP_PHONE_TEL,
  SHOP_PHONE_DISPLAY,
  BUSINESS_INFO,
} from '@/lib/business';
import type { QuoteFormData } from './hooks/useQuoteForm';

interface QuoteConfirmationProps {
  data: QuoteFormData;
  referenceId?: string;
  onReset: () => void;
}

const SHOP_EMAIL = BUSINESS_INFO.email;

export function QuoteConfirmation({
  data,
  referenceId,
  onReset,
}: QuoteConfirmationProps) {
  const t = useTranslations('home.quote.confirmation');
  const tServices = useTranslations('home.quote.services');
  const tSeverity = useTranslations('home.quote.damage.severity');

  const vehicleBase = [data.year, data.make, data.model]
    .filter(Boolean)
    .join(' ');
  const vehicleStr = data.vin
    ? `${vehicleBase} · ${t('summaryVinPrefix')}${data.vin}`
    : vehicleBase;

  const serviceLabel = data.service
    ? tServices(`${data.service}.title`)
    : t('notSet');
  const damageLabel = data.damage
    ? tSeverity(`${data.damage}.label`)
    : t('notSet');
  const contactLabel = t(`contactMethod.${data.contactMethod}`);

  return (
    <div className="py-2">
      <HeroBlock
        title={t('title')}
        thankYou={t('thankYou', { name: data.firstName || '' })}
        referenceId={referenceId}
        referenceIdLabel={t('referenceIdLabel')}
        copyLabel={t('copyLabel')}
        copiedLabel={t('copiedLabel')}
      />

      <div className="mt-10 space-y-8 max-w-xl mx-auto">
        <Timeline
          title={t('timelineTitle')}
          steps={[
            {
              title: t('timeline.step1Title'),
              body: t('timeline.step1Body'),
              done: true,
            },
            {
              title: t('timeline.step2Title'),
              body: t('timeline.step2Body'),
            },
            {
              title: t('timeline.step3Title'),
              body: t('timeline.step3Body'),
            },
          ]}
        />

        <section aria-labelledby="summary-heading">
          <h4
            id="summary-heading"
            className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3"
          >
            {t('summaryTitle')}
          </h4>
          <dl className="divide-y divide-border rounded-lg border border-border bg-card/50">
            <SummaryRow label={t('summaryService')} value={serviceLabel} />
            {vehicleStr && (
              <SummaryRow label={t('summaryVehicle')} value={vehicleStr} />
            )}
            <SummaryRow label={t('summaryDamage')} value={damageLabel} />
            <SummaryRow label={t('summaryContact')} value={contactLabel} />
          </dl>
        </section>

        {data.hasPhotos && (
          <PhotosPane
            title={t('photos.title')}
            body={t('photos.body')}
            textTo={t('photos.textTo', { phone: SHOP_PHONE_DISPLAY })}
            emailTo={t('photos.emailTo', { email: SHOP_EMAIL })}
          />
        )}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-primary transition-colors px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('reset')}
        </button>
        <p className="text-xs text-muted-foreground">
          {t('callUs', { phone: '' })}{' '}
          <a
            href={`tel:${SHOP_PHONE_TEL}`}
            className="text-red-hover hover:text-primary font-medium underline underline-offset-2 tabular-nums"
          >
            {SHOP_PHONE_DISPLAY}
          </a>
        </p>
      </div>
    </div>
  );
}

function HeroBlock({
  title,
  thankYou,
  referenceId,
  referenceIdLabel,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  thankYou: string;
  referenceId?: string;
  referenceIdLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md animate-[scaleIn_400ms_ease-out]"
        aria-hidden="true"
      >
        <svg
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="mt-6 font-display text-2xl md:text-3xl font-extrabold tracking-display text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-muted-foreground">{thankYou}</p>

      {referenceId && (
        <ReferenceIdPill
          value={referenceId}
          label={referenceIdLabel}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      )}
    </div>
  );
}

function ReferenceIdPill({
  value,
  label,
  copyLabel,
  copiedLabel,
}: {
  value: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!navigator?.clipboard) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Silently ignore — user can still select and copy manually
      });
  }

  return (
    <div className="mt-5 inline-flex items-center gap-2.5 rounded-md border border-border bg-muted px-3 py-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <code className="font-mono text-sm tabular-nums text-foreground">
        {value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-muted"
      >
        {copied ? (
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3.5 8.5L6.5 11.5L12.5 5.5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="5" width="8" height="8" rx="1.25" />
            <path d="M10.5 5V3.75C10.5 3.06 9.94 2.5 9.25 2.5H4.25C3.56 2.5 3 3.06 3 3.75v7c0 .69.56 1.25 1.25 1.25H5.5" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Timeline({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; body: string; done?: boolean }[];
}) {
  return (
    <section aria-labelledby="timeline-heading">
      <h4
        id="timeline-heading"
        className="font-display text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-4"
      >
        {title}
      </h4>
      <ol className="relative space-y-5">
        <span
          aria-hidden="true"
          className="absolute left-[13px] top-3 bottom-3 w-px bg-border"
        />
        {steps.map((step, idx) => (
          <li key={idx} className="relative flex gap-4">
            <span
              aria-hidden="true"
              className={[
                'relative z-10 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums',
                step.done
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-border text-muted-foreground',
              ].join(' ')}
            >
              {step.done ? (
                <svg
                  viewBox="0 0 16 16"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8l3 3 6-6" />
                </svg>
              ) : (
                idx + 1
              )}
            </span>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {step.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground text-right">{value}</dd>
    </div>
  );
}

function PhotosPane({
  title,
  body,
  textTo,
  emailTo,
}: {
  title: string;
  body: string;
  textTo: string;
  emailTo: string;
}) {
  const [textLabel, phonePart] = splitAtPlaceholder(textTo, SHOP_PHONE_DISPLAY);
  const [emailLabel, emailPart] = splitAtPlaceholder(emailTo, SHOP_EMAIL);

  return (
    <section
      aria-labelledby="photos-pane-heading"
      className="flex items-start gap-3 rounded-lg bg-muted p-4"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-hover"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.5v3.5" />
        <path d="M8 5h.01" />
      </svg>
      <div className="flex-1 min-w-0">
        <h4
          id="photos-pane-heading"
          className="text-sm font-semibold text-foreground"
        >
          {title}
        </h4>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {body}
        </p>
        <ul className="mt-2.5 space-y-1 text-sm">
          <li>
            <span className="text-muted-foreground">{textLabel}</span>
            <a
              href={`tel:${SHOP_PHONE_TEL}`}
              className="ml-1 font-medium text-foreground underline underline-offset-2 decoration-border hover:decoration-primary tabular-nums"
            >
              {phonePart}
            </a>
          </li>
          <li>
            <span className="text-muted-foreground">{emailLabel}</span>
            <a
              href={`mailto:${SHOP_EMAIL}`}
              className="ml-1 font-medium text-foreground underline underline-offset-2 decoration-border hover:decoration-primary break-all"
            >
              {emailPart}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

function splitAtPlaceholder(
  full: string,
  placeholder: string,
): [string, string] {
  const idx = full.indexOf(placeholder);
  if (idx === -1) return [full, ''];
  return [full.slice(0, idx).trimEnd(), placeholder];
}

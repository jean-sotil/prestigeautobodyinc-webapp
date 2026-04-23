'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';
import { useShakeOnError } from '../hooks/useShakeOnError';

interface DamageStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
  addFiles: (files: File[]) => number;
  removeFile: (index: number) => void;
}

type SeverityId = 'minor' | 'moderate' | 'major' | 'unsure';
type RejectReason = 'limit' | 'type' | 'size';

const severityOrder: readonly SeverityId[] = [
  'minor',
  'moderate',
  'major',
  'unsure',
] as const;

const severityDot: Record<SeverityId, string> = {
  minor: 'bg-green-500 dark:bg-green-400',
  moderate: 'bg-amber-500 dark:bg-amber-400',
  major: 'bg-red-600 dark:bg-red-500',
  unsure: 'bg-gray-500 dark:bg-gray-400',
};

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];
const CHAR_LIMIT = 500;
const CHAR_WARN = 450;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ValidationResult {
  accepted: File[];
  rejected: { name: string; reason: RejectReason }[];
}

function validateIncoming(
  incoming: File[],
  existingCount: number,
): ValidationResult {
  const accepted: File[] = [];
  const rejected: { name: string; reason: RejectReason }[] = [];
  const slotsLeft = Math.max(0, MAX_FILES - existingCount);

  for (const file of incoming) {
    if (accepted.length >= slotsLeft) {
      rejected.push({ name: file.name, reason: 'limit' });
      continue;
    }
    const typeOk =
      ACCEPTED_MIME.includes(file.type) ||
      /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    if (!typeOk) {
      rejected.push({ name: file.name, reason: 'type' });
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      rejected.push({ name: file.name, reason: 'size' });
      continue;
    }
    accepted.push(file);
  }
  return { accepted, rejected };
}

export function DamageStep({
  state,
  dispatch,
  errors,
  addFiles,
  removeFile,
}: DamageStepProps) {
  const t = useTranslations('home.quote.damage');
  const reactId = useId();
  const descId = `${reactId}-desc`;
  const dropzoneHelpId = `${reactId}-dropzone-help`;

  const inputRef = useRef<HTMLInputElement>(null);
  const severityRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [rejected, setRejected] = useState<
    { name: string; reason: RejectReason }[]
  >([]);

  const severityShake = useShakeOnError(errors.damage);

  const previews = useMemo(
    () => state.files.map((f) => URL.createObjectURL(f)),
    [state.files],
  );

  useEffect(
    () => () => previews.forEach((u) => URL.revokeObjectURL(u)),
    [previews],
  );

  const selectedSeverity = state.damage as SeverityId | '';
  const severityActiveIdx = selectedSeverity
    ? severityOrder.indexOf(selectedSeverity as SeverityId)
    : 0;

  function selectSeverity(id: SeverityId) {
    dispatch({ type: 'UPDATE_FIELD', field: 'damage', value: id });
  }

  function handleSeverityKey(
    event: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) {
    let nextIdx = idx;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIdx = (idx + 1) % severityOrder.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIdx = (idx - 1 + severityOrder.length) % severityOrder.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = severityOrder.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = severityOrder[nextIdx];
    selectSeverity(next);
    severityRefs.current[nextIdx]?.focus();
  }

  function handleFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming);
    if (arr.length === 0) return;
    const { accepted, rejected: rej } = validateIncoming(
      arr,
      state.files.length,
    );
    if (accepted.length > 0) {
      addFiles(accepted);
    }
    setRejected(rej);
  }

  function openPicker() {
    inputRef.current?.click();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  }

  function onDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  const fileCount = state.files.length;
  const slotsLeft = MAX_FILES - fileCount;
  const atCapacity = slotsLeft <= 0;

  const charCount = state.description.length;
  const charAtLimit = charCount >= CHAR_LIMIT;
  const charNearLimit = charCount >= CHAR_WARN;
  const charClass = charAtLimit
    ? 'text-destructive'
    : charNearLimit
      ? 'text-red-hover'
      : 'text-muted-foreground';

  const dropzoneMessage = isDragging
    ? t('photos.dropzone.active')
    : atCapacity
      ? t('photos.dropzone.full')
      : t('photos.dropzone.idle');

  return (
    <div className="space-y-6">
      {/* Severity */}
      <div>
        <p
          id="severity-prompt"
          className="text-base md:text-lg font-medium text-foreground mb-4"
        >
          {t('severity.prompt')}
        </p>

        <div
          role="radiogroup"
          aria-labelledby="severity-prompt"
          aria-invalid={errors.damage ? true : undefined}
          aria-describedby={errors.damage ? 'severity-error' : undefined}
          className={`grid grid-cols-2 gap-3 md:gap-4 ${
            severityShake ? 'animate-shake' : ''
          }`}
        >
          {severityOrder.map((id, idx) => {
            const isSelected = selectedSeverity === id;
            const isTabStop = idx === severityActiveIdx;
            return (
              <button
                key={id}
                ref={(el) => {
                  severityRefs.current[idx] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isTabStop ? 0 : -1}
                onClick={() => selectSeverity(id)}
                onKeyDown={(e) => handleSeverityKey(e, idx)}
                className={[
                  'group relative overflow-hidden flex items-start gap-3 p-4 md:p-5 rounded-xl border bg-card text-left',
                  'transition-[transform,box-shadow,border-color] duration-200 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isSelected
                    ? 'border-primary shadow-md'
                    : 'border-border shadow-sm hover:-translate-y-0.5 hover:border-red-border hover:shadow-md',
                ].join(' ')}
              >
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-surface via-transparent to-transparent"
                  />
                )}

                <span
                  aria-hidden="true"
                  className={`relative mt-1 h-3 w-3 flex-shrink-0 rounded-full ${severityDot[id]}`}
                />

                <div className="relative min-w-0">
                  <span
                    className={`block font-display text-base font-bold tracking-display leading-tight mb-0.5 ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {t(`severity.${id}.label`)}
                  </span>
                  <span className="block text-xs md:text-sm leading-relaxed text-muted-foreground">
                    {t(`severity.${id}.description`)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {errors.damage && (
          <p
            id="severity-error"
            role="alert"
            className="flex items-center gap-2 mt-3 text-sm text-destructive"
          >
            <AlertIcon className="h-4 w-4 flex-shrink-0" />
            {errors.damage}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor={descId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {t('description.label')}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {t('description.optional')}
          </span>
        </label>
        <textarea
          id={descId}
          value={state.description}
          onChange={(e) => {
            if (e.target.value.length <= CHAR_LIMIT) {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'description',
                value: e.target.value,
              });
            }
          }}
          placeholder={t('description.placeholder')}
          maxLength={CHAR_LIMIT}
          className="w-full min-h-[112px] resize-y rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <p
          aria-live="polite"
          className={`mt-1 text-right text-xs tabular-nums ${charClass}`}
        >
          {charCount}/{CHAR_LIMIT}
        </p>
      </div>

      {/* Photos */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="block text-sm font-medium text-foreground">
            {t('photos.label')}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {t('photos.optional')}
            </span>
          </label>
          <span
            className={`text-xs font-medium tabular-nums ${
              atCapacity ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-live="polite"
          >
            {t('photos.counter', { count: fileCount, max: MAX_FILES })}
          </span>
        </div>

        <div
          role="button"
          tabIndex={atCapacity ? -1 : 0}
          aria-disabled={atCapacity}
          aria-describedby={dropzoneHelpId}
          aria-label={
            atCapacity
              ? t('photos.dropzone.ariaLabelFull')
              : t('photos.dropzone.ariaLabel')
          }
          onClick={atCapacity ? undefined : openPicker}
          onKeyDown={atCapacity ? undefined : onKeyDown}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={atCapacity ? undefined : onDrop}
          className={[
            'group relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            atCapacity
              ? 'border-border bg-muted cursor-not-allowed'
              : isDragging
                ? 'border-primary bg-red-surface shadow-md scale-[1.01]'
                : 'border-input bg-background hover:border-primary hover:bg-red-surface cursor-pointer',
          ].join(' ')}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 ${
              atCapacity
                ? 'bg-muted text-muted-foreground'
                : isDragging
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-red-surface text-red-hover group-hover:bg-primary group-hover:text-primary-foreground'
            }`}
          >
            <UploadIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {dropzoneMessage}
            </p>
            <p
              id={dropzoneHelpId}
              className="text-xs text-muted-foreground mt-1"
            >
              {t('photos.dropzone.help', {
                size: MAX_FILE_SIZE_MB,
                max: MAX_FILES,
              })}
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {rejected.length > 0 && (
          <ul
            className="mt-3 space-y-1 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
            role="alert"
          >
            {rejected.map((r, i) => (
              <li
                key={`${r.name}-${i}`}
                className="flex items-start gap-2 text-xs text-destructive"
              >
                <AlertIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-1">
                  <span className="font-medium">{r.name}</span> —{' '}
                  {r.reason === 'size'
                    ? t('photos.reject.size', { max: MAX_FILE_SIZE_MB })
                    : t(`photos.reject.${r.reason}`)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {fileCount > 0 && (
          <ul
            className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
            aria-label={t('photos.galleryLabel')}
          >
            {state.files.map((file, idx) => {
              const src = previews[idx];
              return (
                <li
                  key={`${file.name}-${file.lastModified}-${idx}`}
                  className="relative group/thumb aspect-square overflow-hidden rounded-lg border border-border bg-muted shadow-sm"
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={t('photos.thumbAlt', { name: file.name })}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-muted" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-2 py-1.5">
                    <span className="truncate text-[10px] font-medium text-white/90 tabular-nums">
                      {formatSize(file.size)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeFile(idx);
                      setRejected([]);
                    }}
                    aria-label={t('photos.remove', { name: file.name })}
                    className="absolute top-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5" />
      <path d="M8 11h.01" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

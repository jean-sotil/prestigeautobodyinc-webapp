'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { QuoteFormData, FormAction } from '../hooks/useQuoteForm';

// ============================================================================
// Types
// ============================================================================

interface DamageStepProps {
  state: QuoteFormData;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
  addFiles: (files: File[]) => number;
  removeFile: (index: number) => void;
}

type SeverityId = 'minor' | 'moderate' | 'major' | 'unsure';

interface SeverityOption {
  id: SeverityId;
  label: string;
  description: string;
  dotColor: string;
  bgSelected: string;
}

// ============================================================================
// Constants
// ============================================================================

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
const ACCEPTED_HELP = 'JPG · PNG · WEBP · HEIC';

// ============================================================================
// Severity Options
// ============================================================================

const severities: SeverityOption[] = [
  {
    id: 'minor',
    label: 'Minor',
    description: 'Small dents, scratches, scuffs',
    dotColor: 'bg-[#22C55E]',
    bgSelected: 'bg-green-50/60 dark:bg-green-900/10',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Panel damage, cracked bumper',
    dotColor: 'bg-[#F59E0B]',
    bgSelected: 'bg-amber-50/60 dark:bg-amber-900/10',
  },
  {
    id: 'major',
    label: 'Major',
    description: 'Structural damage, multiple panels',
    dotColor: 'bg-[#DC2626]',
    bgSelected: 'bg-red-50/60 dark:bg-red-900/10',
  },
  {
    id: 'unsure',
    label: 'Not Sure',
    description: 'Needs professional assessment',
    dotColor: 'bg-[#6B7280]',
    bgSelected: 'bg-gray-50/60 dark:bg-gray-800/20',
  },
];

// ============================================================================
// Helpers
// ============================================================================

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ValidationResult {
  accepted: File[];
  rejected: { name: string; reason: string }[];
}

function validateIncoming(
  incoming: File[],
  existingCount: number,
): ValidationResult {
  const accepted: File[] = [];
  const rejected: { name: string; reason: string }[] = [];
  const slotsLeft = Math.max(0, MAX_FILES - existingCount);

  for (const file of incoming) {
    if (accepted.length >= slotsLeft) {
      rejected.push({ name: file.name, reason: 'Photo limit reached' });
      continue;
    }
    const typeOk =
      ACCEPTED_MIME.includes(file.type) ||
      /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    if (!typeOk) {
      rejected.push({ name: file.name, reason: 'Unsupported file type' });
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      rejected.push({
        name: file.name,
        reason: `Exceeds ${MAX_FILE_SIZE_MB} MB`,
      });
      continue;
    }
    accepted.push(file);
  }
  return { accepted, rejected };
}

// ============================================================================
// Component
// ============================================================================

export function DamageStep({
  state,
  dispatch,
  errors,
  addFiles,
  removeFile,
}: DamageStepProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const dropzoneHelpId = `${id}-dropzone-help`;
  const charCount = state.description.length;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [rejected, setRejected] = useState<{ name: string; reason: string }[]>(
    [],
  );

  const previews = useMemo(
    () => state.files.map((f) => URL.createObjectURL(f)),
    [state.files],
  );

  useEffect(
    () => () => previews.forEach((u) => URL.revokeObjectURL(u)),
    [previews],
  );

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

  return (
    <div className="space-y-6">
      {/* Severity cards */}
      <div>
        <div
          className="grid grid-cols-2 gap-4"
          role="radiogroup"
          aria-label="Select damage severity"
        >
          {severities.map((sev) => {
            const isSelected = state.damage === sev.id;
            return (
              <button
                key={sev.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'damage',
                    value: sev.id,
                  })
                }
                className={`group flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 ${
                  isSelected
                    ? `border-[#C62828] ${sev.bgSelected} shadow-sm`
                    : 'border-gray-200 dark:border-[#333333] bg-white dark:bg-[#252525] hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${sev.dotColor}`}
                  aria-hidden="true"
                />
                <div>
                  <span
                    className={`text-sm font-bold block ${
                      isSelected
                        ? 'text-[#C62828]'
                        : 'text-gray-900 dark:text-[#E0E0E0]'
                    }`}
                  >
                    {sev.label}
                  </span>
                  <span className="text-xs leading-relaxed text-gray-500 dark:text-[#A0A0A0]">
                    {sev.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.damage && (
          <p className="text-sm text-[#DC2626] mt-3" role="alert">
            {errors.damage}
          </p>
        )}
      </div>

      {/* Description textarea */}
      <div>
        <label
          htmlFor={descId}
          className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0] mb-1.5"
        >
          Describe the Damage{' '}
          <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id={descId}
          value={state.description}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'description',
                value: e.target.value,
              });
            }
          }}
          placeholder="Describe the damage (optional)..."
          maxLength={500}
          className="w-full min-h-[100px] resize-y rounded-lg border border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1E1E1E] px-4 py-3 text-base text-gray-900 dark:text-[#E0E0E0] transition-colors focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{charCount}/500</p>
      </div>

      {/* Photo uploader */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
            Photos of the Damage{' '}
            <span className="text-gray-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <span
            className={`text-xs font-medium tabular-nums ${
              atCapacity
                ? 'text-[#C62828]'
                : 'text-gray-500 dark:text-[#A0A0A0]'
            }`}
            aria-live="polite"
          >
            {fileCount}/{MAX_FILES}
          </span>
        </div>

        <div
          role="button"
          tabIndex={atCapacity ? -1 : 0}
          aria-disabled={atCapacity}
          aria-describedby={dropzoneHelpId}
          aria-label={
            atCapacity
              ? 'Photo limit reached'
              : 'Upload damage photos. Click or drag files to this area.'
          }
          onClick={atCapacity ? undefined : openPicker}
          onKeyDown={atCapacity ? undefined : onKeyDown}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={atCapacity ? undefined : onDrop}
          className={`group relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 ${
            atCapacity
              ? 'border-gray-200 dark:border-[#333333] bg-gray-50/60 dark:bg-[#1E1E1E]/60 cursor-not-allowed'
              : isDragging
                ? 'border-[#C62828] bg-red-50/70 dark:bg-red-950/20 scale-[1.01] shadow-[0_10px_30px_-12px_rgba(198,40,40,0.35)]'
                : 'border-gray-300 dark:border-[#444444] bg-white dark:bg-[#1E1E1E] hover:border-[#C62828]/60 hover:bg-red-50/30 dark:hover:bg-red-950/10 cursor-pointer'
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              isDragging
                ? 'bg-[#C62828] text-white'
                : 'bg-red-50 text-[#C62828] dark:bg-red-950/40 group-hover:bg-[#C62828] group-hover:text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
              {isDragging
                ? 'Drop photos to upload'
                : atCapacity
                  ? 'Photo limit reached'
                  : 'Click to upload or drag & drop'}
            </p>
            <p
              id={dropzoneHelpId}
              className="text-xs text-gray-500 dark:text-[#A0A0A0] mt-1"
            >
              {ACCEPTED_HELP} · up to {MAX_FILE_SIZE_MB} MB each · {MAX_FILES}{' '}
              photos max
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

        {/* Rejected files feedback */}
        {rejected.length > 0 && (
          <ul
            className="mt-3 space-y-1 rounded-lg border border-[#DC2626]/30 bg-red-50/60 dark:bg-red-950/20 px-3 py-2"
            role="alert"
          >
            {rejected.map((r, i) => (
              <li
                key={`${r.name}-${i}`}
                className="text-xs text-[#C62828] flex items-start gap-2"
              >
                <span aria-hidden="true" className="mt-0.5">
                  ⚠
                </span>
                <span className="flex-1">
                  <span className="font-medium">{r.name}</span> — {r.reason}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Thumbnail grid */}
        {fileCount > 0 && (
          <ul
            className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
            aria-label="Uploaded damage photos"
          >
            {state.files.map((file, idx) => {
              const src = previews[idx];
              return (
                <li
                  key={`${file.name}-${file.lastModified}-${idx}`}
                  className="relative group/thumb aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-[#333333] bg-gray-100 dark:bg-[#1E1E1E] shadow-sm"
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={`Damage photo: ${file.name}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-[#252525]" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-2 py-1.5">
                    <span className="truncate text-[10px] font-medium text-white/90">
                      {formatSize(file.size)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeFile(idx);
                      setRejected([]);
                    }}
                    aria-label={`Remove ${file.name}`}
                    className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#C62828] text-white shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-[#C62828]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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

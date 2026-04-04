'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * Accessible loading skeleton with aria-busy and aria-label
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

/**
 * Card skeleton for content placeholders
 */
export function CardSkeleton() {
  return (
    <div
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
      aria-busy="true"
      aria-label="Loading card..."
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

/**
 * Form skeleton for QuoteForm loading state
 */
export function FormSkeleton() {
  return (
    <div
      className="space-y-4 max-w-lg"
      aria-busy="true"
      aria-label="Loading form..."
    >
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

/**
 * Embed skeleton for YouTube/Maps loading states
 */
export function EmbedSkeleton({
  aspectRatio = 'video',
}: {
  aspectRatio?: 'video' | 'square' | 'auto';
}) {
  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    auto: 'min-h-[300px]',
  }[aspectRatio];

  return (
    <div
      className={`w-full ${aspectClass} bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center`}
      aria-busy="true"
      aria-label="Loading embed..."
    >
      <div className="animate-pulse flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import React, { useState } from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

/**
 * YouTube embed with facade pattern
 * Loads heavy YouTube iframe only when clicked
 */
export function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  // Use `hqdefault.jpg`, which YouTube generates for EVERY video, instead of
  // `maxresdefault.jpg`, which only exists for videos uploaded at/above 1280px.
  // When maxres is missing the upstream returns 404 and Next's image optimizer
  // turns that into a 500 (`/_next/image … 500`). hqdefault never 404s.
  const [thumbnailUrl, setThumbnailUrl] = useState(
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  );

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
        aria-label={`Play ${title}`}
      >
        {/* Thumbnail */}
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
          loading="lazy"
          onError={() => {
            // Final fallback to the default frame thumbnail (`0.jpg`), which
            // YouTube also always generates, so the facade never shows a
            // broken image even if hqdefault is somehow unavailable.
            const fallback = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            if (thumbnailUrl !== fallback) setThumbnailUrl(fallback);
          }}
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Video title */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

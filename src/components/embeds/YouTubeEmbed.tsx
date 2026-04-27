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
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
        aria-label={`Play ${title}`}
      >
        {/* Thumbnail - Next.js Image for optimization */}
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
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
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

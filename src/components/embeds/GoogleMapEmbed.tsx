'use client';

import Image from 'next/image';
import React from 'react';

interface GoogleMapEmbedProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  title?: string;
}

/**
 * Google Maps embed component
 * Uses static image facade with link to full Google Maps
 */
export function GoogleMapEmbed({
  address = '928 Philadelphia Avenue, Silver Spring, MD 20910',
  latitude = 39.0194,
  longitude = -77.0372,
  zoom = 15,
  title = 'Our Location',
}: GoogleMapEmbedProps) {
  // Generate static map URL (facade pattern)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`;

  // Generate interactive map URL
  const interactiveMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // If no API key, show a placeholder with the address
  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <a
        href={interactiveMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group"
        aria-label={`View ${title} on Google Maps`}
      >
        {hasApiKey ? (
          <>
            <Image
              src={staticMapUrl}
              alt={`Map showing ${address}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />

            {/* Overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-full shadow-lg text-sm font-medium">
                Open in Google Maps
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {address}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Click to view on Google Maps
            </p>
          </div>
        )}
      </a>

      <p className="text-sm text-gray-500 mt-2">{address}</p>
    </div>
  );
}

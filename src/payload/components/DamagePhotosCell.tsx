'use client';

import React from 'react';
import Image from 'next/image';

interface Photo {
  photo?:
    | {
        url?: string;
        thumbnailURL?: string;
        sizes?: {
          thumbnail?: {
            url?: string;
          };
        };
        filename?: string;
      }
    | string;
}

export const DamagePhotosCell: React.FC<{
  cellData: Photo[] | null | undefined;
}> = ({ cellData }) => {
  if (!cellData || cellData.length === 0) {
    return <span style={{ color: '#999', fontSize: 12 }}>No photos</span>;
  }

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {cellData.slice(0, 3).map((item, i) => {
        const photo = typeof item.photo === 'object' ? item.photo : null;
        const url =
          photo?.sizes?.thumbnail?.url || photo?.thumbnailURL || photo?.url;

        if (!url) return null;

        return (
          <Image
            key={i}
            src={url}
            alt={photo?.filename || `Photo ${i + 1}`}
            width={36}
            height={36}
            style={{
              objectFit: 'cover',
              borderRadius: 4,
              border: '1px solid #ddd',
            }}
          />
        );
      })}
      {cellData.length > 3 && (
        <span style={{ fontSize: 11, color: '#666', marginLeft: 2 }}>
          +{cellData.length - 3}
        </span>
      )}
    </div>
  );
};

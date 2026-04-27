'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

const GoogleMapEmbed = dynamic(
  () =>
    import('@/components/embeds/GoogleMapEmbed').then((m) => ({
      default: m.GoogleMapEmbed,
    })),
  {
    ssr: false,
    loading: () => (
      <div aria-busy="true" aria-label="Loading map">
        <Skeleton className="w-full h-[400px] rounded-lg" />
      </div>
    ),
  },
);

export default function LazyGoogleMapEmbed(props: {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  title?: string;
}) {
  return <GoogleMapEmbed {...props} />;
}

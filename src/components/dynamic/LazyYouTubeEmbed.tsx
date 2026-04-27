'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

const YouTubeEmbed = dynamic(
  () =>
    import('@/components/embeds/YouTubeEmbed').then((m) => ({
      default: m.YouTubeEmbed,
    })),
  {
    ssr: false,
    loading: () => (
      <div aria-busy="true" aria-label="Loading video player">
        <Skeleton className="w-full aspect-video rounded-lg" />
      </div>
    ),
  },
);

export default function LazyYouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title?: string;
}) {
  return <YouTubeEmbed videoId={videoId} title={title} />;
}

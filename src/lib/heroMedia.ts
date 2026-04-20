import 'server-only';
import { cache } from 'react';

export interface HeroMedia {
  url: string;
  width: number | null;
  height: number | null;
  alt: { en?: string; es?: string } | null;
}

async function getPayloadClient() {
  const { getPayload } = await import('payload');
  const config = await import('@/payload/payload.config');
  return getPayload({ config: config.default });
}

async function fetchMediaByFilename(
  filename: string,
): Promise<HeroMedia | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      pagination: false,
    });

    const doc = result.docs[0];
    if (!doc?.url) {
      console.warn(
        `[heroMedia] no doc or url for "${filename}" (found ${result.docs.length} docs)`,
      );
      return null;
    }

    return {
      url: doc.url,
      width: doc.width ?? null,
      height: doc.height ?? null,
      alt: (doc as { alt?: HeroMedia['alt'] }).alt ?? null,
    };
  } catch (error) {
    console.error(`[heroMedia] failed to fetch "${filename}":`, error);
    return null;
  }
}

/** Look up a Payload media doc by its exact stored filename. */
export const getMediaByFilename = cache(fetchMediaByFilename);

/** Convenience wrapper for the `${slug}-hero.jpg` naming convention. */
export const getHeroMedia = (slug: string) =>
  getMediaByFilename(`${slug}-hero.jpg`);

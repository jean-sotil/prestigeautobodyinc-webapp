import { revalidatePath } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload';

type PublishState = { publishStatus?: string | null } | null | undefined;

/**
 * A change reaches public pages only if the post is live before or after it:
 * publishing, editing a live post, or unpublishing/archiving one. Saving a
 * draft that was never published changes nothing visitors or Google can see.
 */
export function affectsPublicPages(
  doc: PublishState,
  previousDoc?: PublishState,
): boolean {
  return (
    doc?.publishStatus === 'published' ||
    previousDoc?.publishStatus === 'published'
  );
}

/**
 * Payload runs inside the Next.js server, so the hook can revalidate
 * directly; no round-trip through /api/revalidate is needed.
 *
 * The sitemap is prerendered at build time, so without this a new post stays
 * out of sitemap.xml until the next deploy. Every post page is revalidated,
 * not just the changed one, because related posts rotate through the whole
 * archive (see `pickRelatedPosts`) and a new post changes its neighbours.
 */
function revalidateBlog(req: PayloadRequest): void {
  try {
    revalidatePath('/sitemap.xml');
    revalidatePath('/(frontend)/[locale]/blog', 'page');
    revalidatePath('/(frontend)/[locale]/blog/[slug]', 'page');
  } catch (error) {
    // Outside a Next.js request (e.g. a seed script using the Local API)
    // there is no cache to revalidate; the next build picks the change up.
    req.payload.logger.warn(
      `Blog revalidation skipped: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export const revalidateBlogAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  if (affectsPublicPages(doc, previousDoc)) revalidateBlog(req);
  return doc;
};

export const revalidateBlogAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req,
}) => {
  if (affectsPublicPages(doc)) revalidateBlog(req);
  return doc;
};

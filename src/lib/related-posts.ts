import type { BlogPost } from '@/lib/queries/types';

/**
 * The posts that come after `current` in `ordered`, wrapping around to the
 * start, excluding `current` itself.
 */
function ringAfter(ordered: BlogPost[], current: BlogPost): BlogPost[] {
  const i = ordered.findIndex((p) => p.slug === current.slug);
  if (i === -1) return ordered;
  return [...ordered.slice(i + 1), ...ordered.slice(0, i)];
}

/**
 * Pick the related posts for `current` from every published post in its
 * locale, `all`, sorted newest first.
 *
 * Picking "the newest N in the same category" sends every article's links to
 * the same few recent posts and none to older ones, which then sit orphaned.
 * Instead, each post links to the next `limit` posts of its category in
 * publish order, wrapping around: within a category of n posts, every post
 * receives exactly min(limit, n - 1) links. If the category runs short, the
 * same rotation over all posts fills the rest.
 */
export function pickRelatedPosts(
  all: BlogPost[],
  current: BlogPost,
  limit = 3,
): BlogPost[] {
  const categories = new Set(current.categories?.map((c) => c.slug) ?? []);
  const peers = all.filter(
    (p) =>
      p.slug === current.slug ||
      p.categories?.some((c) => categories.has(c.slug)),
  );

  const picked: BlogPost[] = [];
  const seen = new Set([current.slug]);
  for (const post of [
    ...ringAfter(peers, current),
    ...ringAfter(all, current),
  ]) {
    if (picked.length >= limit) break;
    if (seen.has(post.slug)) continue;
    seen.add(post.slug);
    picked.push(post);
  }
  return picked;
}

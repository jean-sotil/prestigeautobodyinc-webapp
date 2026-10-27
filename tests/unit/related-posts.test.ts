import { describe, it, expect } from 'vitest';
import { pickRelatedPosts } from '@/lib/related-posts';
import type { BlogPost } from '@/lib/queries/types';

// The 21 published EN posts as of Oct 2026 (category, publish date). With the
// old "newest 3 in the category" rule, the 7 oldest got no related links.
const ARCHIVE: Array<[string, string]> = [
  ['protect-car-paint-from-sun-damage', 'maintenance'],
  ['document-car-accident-insurance-claim', 'insurance-tips'],
  ['ev-collision-repair-specialist', 'collision-repair'],
  ['preventing-repairing-winter-car-rust', 'maintenance'],
  ['rental-car-coverage-during-repairs-guide', 'insurance-tips'],
  ['minor-collision-hidden-damage-inspection', 'collision-repair'],
  ['what-to-do-insurance-estimate-too-low', 'insurance-tips'],
  ['hail-damage-repair-guide', 'collision-repair'],
  ['car-paint-repair-myths', 'auto-painting'],
  ['body-shop-vs-mechanic-signs', 'maintenance'],
  ['adas-recalibration-windshield-replacement', 'collision-repair'],
  ['collision-vs-comprehensive-insurance-guide', 'insurance-tips'],
  ['science-of-car-paint-matching', 'auto-painting'],
  ['how-to-read-auto-body-estimate', 'insurance-tips'],
  ['aluminum-vs-steel-body-repair', 'collision-repair'],
  ['what-is-car-insurance-deductible', 'insurance-tips'],
  ['adas-recalibration-after-collision', 'collision-repair'],
  ['what-is-an-auto-body-supplement', 'insurance-tips'],
  ['what-to-do-after-car-accident', 'collision-repair'],
  ['right-to-choose-auto-body-shop', 'insurance-tips'],
  ['oem-vs-aftermarket-parts-collision-repair', 'maintenance'],
];

function post(slug: string, category: string): BlogPost {
  return {
    id: slug,
    slug,
    categories: [{ id: category, slug: category, name: category }],
  } as unknown as BlogPost;
}

const all = ARCHIVE.map(([slug, cat]) => post(slug, cat));

function inboundCounts(limit = 3): Map<string, number> {
  const counts = new Map(all.map((p) => [p.slug, 0]));
  for (const p of all) {
    for (const r of pickRelatedPosts(all, p, limit)) {
      counts.set(r.slug, counts.get(r.slug)! + 1);
    }
  }
  return counts;
}

describe('pickRelatedPosts', () => {
  it('returns `limit` posts, never the current one, never twice', () => {
    for (const p of all) {
      const picked = pickRelatedPosts(all, p, 3).map((r) => r.slug);
      expect(picked).toHaveLength(3);
      expect(picked).not.toContain(p.slug);
      expect(new Set(picked).size).toBe(3);
    }
  });

  it('prefers posts from the same category', () => {
    const current = all.find((p) => p.slug === 'hail-damage-repair-guide')!;
    const picked = pickRelatedPosts(all, current, 3);
    expect(
      picked.every((r) => r.categories[0].slug === 'collision-repair'),
    ).toBe(true);
    expect(picked.map((r) => r.slug)).toEqual([
      'adas-recalibration-windshield-replacement',
      'aluminum-vs-steel-body-repair',
      'adas-recalibration-after-collision',
    ]);
  });

  it('wraps around so the oldest post links back to the newest', () => {
    const oldest = all.find(
      (p) => p.slug === 'right-to-choose-auto-body-shop',
    )!;
    expect(pickRelatedPosts(all, oldest, 3).map((r) => r.slug)).toEqual([
      'document-car-accident-insurance-claim',
      'rental-car-coverage-during-repairs-guide',
      'what-to-do-insurance-estimate-too-low',
    ]);
  });

  it('gives every post in the archive inbound related links', () => {
    const counts = inboundCounts();
    // Every post is linked; the two auto-painting posts get one link each,
    // from each other, because their category has only two members.
    expect(Math.min(...counts.values())).toBe(1);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(4);
    expect([...counts.values()].filter((n) => n >= 3)).toHaveLength(19);
  });

  it('tops up from the whole archive when the category is too small', () => {
    const current = all.find((p) => p.slug === 'car-paint-repair-myths')!;
    const picked = pickRelatedPosts(all, current, 3).map((r) => r.slug);
    expect(picked[0]).toBe('science-of-car-paint-matching');
    expect(picked).toHaveLength(3);
  });
});

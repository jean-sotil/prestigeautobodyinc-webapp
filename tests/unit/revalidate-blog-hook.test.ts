import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PayloadRequest } from 'payload';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { revalidatePath } from 'next/cache';
import {
  affectsPublicPages,
  revalidateBlogAfterChange,
  revalidateBlogAfterDelete,
} from '@/payload/hooks/revalidateBlog';
import { BlogPosts } from '@/payload/collections/BlogPosts';

const warn = vi.fn();
const req = { payload: { logger: { warn } } } as unknown as PayloadRequest;
const published = { publishStatus: 'published' };
const draft = { publishStatus: 'draft' };
const archived = { publishStatus: 'archived' };

// The hooks only read doc/previousDoc/req; the rest of Payload's args are noise.
const afterChange = (doc: object, previousDoc?: object) =>
  revalidateBlogAfterChange({ doc, previousDoc, req } as never);
const afterDelete = (doc: object) =>
  revalidateBlogAfterDelete({ doc, req } as never);

beforeEach(() => {
  vi.mocked(revalidatePath).mockReset();
  warn.mockReset();
});

describe('affectsPublicPages', () => {
  it.each([
    ['publishing a draft', published, draft, true],
    ['editing a live post', published, published, true],
    ['archiving a live post', archived, published, true],
    ['saving a draft', draft, draft, false],
    ['creating a draft', draft, undefined, false],
  ])('%s → %s', (_label, doc, prev, expected) => {
    expect(affectsPublicPages(doc, prev)).toBe(expected);
  });
});

describe('revalidateBlogAfterChange', () => {
  it('revalidates the sitemap, the blog index and every post on publish', () => {
    afterChange(published, draft);

    expect(vi.mocked(revalidatePath).mock.calls).toEqual([
      ['/sitemap.xml'],
      ['/(frontend)/[locale]/blog', 'page'],
      ['/(frontend)/[locale]/blog/[slug]', 'page'],
    ]);
  });

  it('does nothing for a draft that was never published', () => {
    afterChange(draft, draft);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('returns the doc and only warns when called outside a Next request', () => {
    vi.mocked(revalidatePath).mockImplementation(() => {
      throw new Error('static generation store missing');
    });
    const doc = { ...published, id: 'x' };

    expect(afterChange(doc, draft)).toBe(doc);
    expect(warn).toHaveBeenCalledOnce();
  });
});

describe('revalidateBlogAfterDelete', () => {
  it('revalidates when a live post is deleted', () => {
    afterDelete(published);
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml');
  });

  it('ignores deleting a draft', () => {
    afterDelete(draft);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe('BlogPosts collection', () => {
  it('registers the revalidation hooks', () => {
    expect(BlogPosts.hooks?.afterChange).toContain(revalidateBlogAfterChange);
    expect(BlogPosts.hooks?.afterDelete).toContain(revalidateBlogAfterDelete);
  });
});

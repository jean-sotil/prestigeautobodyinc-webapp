import { describe, test, expect } from 'vitest';

// Collections
import { Users } from '@/payload/collections/Users';
import { Pages } from '@/payload/collections/Pages';
import { BlogPosts } from '@/payload/collections/BlogPosts';
import { BlogCategories } from '@/payload/collections/BlogCategories';
import { Services } from '@/payload/collections/Services';
import { Testimonials } from '@/payload/collections/Testimonials';
import { TeamMembers } from '@/payload/collections/TeamMembers';
import { ServiceAreas } from '@/payload/collections/ServiceAreas';
import { Media } from '@/payload/collections/Media';
import { QuoteRequests } from '@/payload/collections/QuoteRequests';
import { Navigation } from '@/payload/collections/Navigation';
import { SiteSettings } from '@/payload/collections/SiteSettings';

// --- Helpers ---

const mockUser = (role: string, id = 'user-1') =>
  ({ role, id }) as Record<string, unknown>;

const mockReq = (user: Record<string, unknown> | null = null) =>
  ({ req: { user } }) as never;

type AccessFn = (args: never) => boolean | Record<string, unknown>;

const getAccess = (collection: { access?: Record<string, AccessFn> }) =>
  collection.access!;

// --- Public collections (read: () => true) ---

const publicCollections = [
  { name: 'Pages', config: Pages },
  { name: 'Services', config: Services },
  { name: 'Testimonials', config: Testimonials },
  { name: 'TeamMembers', config: TeamMembers },
  { name: 'ServiceAreas', config: ServiceAreas },
  { name: 'BlogCategories', config: BlogCategories },
];

describe('Public Collections — read access', () => {
  for (const { name, config } of publicCollections) {
    test(`${name} is publicly readable`, () => {
      const { read } = getAccess(config);
      expect(read(mockReq(null))).toBe(true);
      expect(read(mockReq(mockUser('viewer')))).toBe(true);
    });
  }
});

// --- BlogPosts: public read, authenticated CUD ---

describe('BlogPosts — access control', () => {
  const access = getAccess(BlogPosts);

  test('publicly readable', () => {
    expect(access.read!(mockReq(null))).toBe(true);
  });

  test('anonymous cannot create/update/delete', () => {
    expect(access.create!(mockReq(null))).toBe(false);
    expect(access.update!(mockReq(null))).toBe(false);
    expect(access.delete!(mockReq(null))).toBe(false);
  });

  test('any authenticated user can create/update/delete', () => {
    for (const role of ['super-admin', 'content-editor', 'viewer']) {
      const req = mockReq(mockUser(role));
      expect(access.create!(req)).toBe(true);
      expect(access.update!(req)).toBe(true);
      expect(access.delete!(req)).toBe(true);
    }
  });
});

// --- Media: public read, authenticated CUD ---

describe('Media — access control', () => {
  const access = getAccess(Media);

  test('publicly readable', () => {
    expect(access.read!(mockReq(null))).toBe(true);
  });

  test('anonymous cannot create/update/delete', () => {
    expect(access.create!(mockReq(null))).toBe(false);
    expect(access.update!(mockReq(null))).toBe(false);
    expect(access.delete!(mockReq(null))).toBe(false);
  });

  test('any authenticated user can create/update/delete', () => {
    const req = mockReq(mockUser('content-editor'));
    expect(access.create!(req)).toBe(true);
    expect(access.update!(req)).toBe(true);
    expect(access.delete!(req)).toBe(true);
  });
});

// --- Users: strict RBAC ---

describe('Users — access control', () => {
  const access = getAccess(Users);

  test('anonymous has no access', () => {
    expect(access.read!(mockReq(null))).toBe(false);
    expect(access.create!(mockReq(null))).toBe(false);
    expect(access.update!(mockReq(null))).toBe(false);
    expect(access.delete!(mockReq(null))).toBe(false);
  });

  test('super-admin can read all users', () => {
    expect(access.read!(mockReq(mockUser('super-admin')))).toBe(true);
  });

  test('non-admin can only read own record', () => {
    const result = access.read!(mockReq(mockUser('viewer', 'user-42')));
    expect(result).toEqual({ id: { equals: 'user-42' } });
  });

  test('only super-admin can create users', () => {
    expect(access.create!(mockReq(mockUser('super-admin')))).toBe(true);
    expect(access.create!(mockReq(mockUser('content-editor')))).toBe(false);
    expect(access.create!(mockReq(mockUser('viewer')))).toBe(false);
  });

  test('super-admin can update any user', () => {
    expect(access.update!(mockReq(mockUser('super-admin')))).toBe(true);
  });

  test('non-admin can only update own record', () => {
    const result = access.update!(mockReq(mockUser('content-editor', 'u-7')));
    expect(result).toEqual({ id: { equals: 'u-7' } });
  });

  test('only super-admin can delete users', () => {
    expect(access.delete!(mockReq(mockUser('super-admin')))).toBe(true);
    expect(access.delete!(mockReq(mockUser('content-editor')))).toBe(false);
    expect(access.delete!(mockReq(mockUser('viewer')))).toBe(false);
  });

  test('admin panel access for super-admin and content-editor only', () => {
    expect(access.admin!(mockReq(mockUser('super-admin')))).toBe(true);
    expect(access.admin!(mockReq(mockUser('content-editor')))).toBe(true);
    expect(access.admin!(mockReq(mockUser('viewer')))).toBe(false);
    expect(access.admin!(mockReq(null))).toBe(false);
  });
});

// --- QuoteRequests: public create, role-based read/update/delete ---

describe('QuoteRequests — access control', () => {
  const access = getAccess(QuoteRequests);

  test('anyone can create (public submissions)', () => {
    expect(access.create!(mockReq(null))).toBe(true);
  });

  test('anonymous cannot read/update/delete', () => {
    expect(access.read!(mockReq(null))).toBe(false);
    expect(access.update!(mockReq(null))).toBe(false);
    expect(access.delete!(mockReq(null))).toBe(false);
  });

  test('super-admin and content-editor can read and update', () => {
    for (const role of ['super-admin', 'content-editor']) {
      const req = mockReq(mockUser(role));
      expect(access.read!(req)).toBe(true);
      expect(access.update!(req)).toBe(true);
    }
  });

  test('viewer cannot read or update', () => {
    const req = mockReq(mockUser('viewer'));
    expect(access.read!(req)).toBe(false);
    expect(access.update!(req)).toBe(false);
  });

  test('only super-admin can delete', () => {
    expect(access.delete!(mockReq(mockUser('super-admin')))).toBe(true);
    expect(access.delete!(mockReq(mockUser('content-editor')))).toBe(false);
    expect(access.delete!(mockReq(mockUser('viewer')))).toBe(false);
  });
});

// --- Navigation: role-based CRUD ---

describe('Navigation — access control', () => {
  const access = getAccess(Navigation);

  test('anonymous has no access', () => {
    expect(access.read!(mockReq(null))).toBe(false);
    expect(access.create!(mockReq(null))).toBe(false);
    expect(access.update!(mockReq(null))).toBe(false);
    expect(access.delete!(mockReq(null))).toBe(false);
  });

  test('super-admin has full access', () => {
    const req = mockReq(mockUser('super-admin'));
    expect(access.read!(req)).toBe(true);
    expect(access.create!(req)).toBe(true);
    expect(access.update!(req)).toBe(true);
    expect(access.delete!(req)).toBe(true);
  });

  test('content-editor can read and update but not create or delete', () => {
    const req = mockReq(mockUser('content-editor'));
    expect(access.read!(req)).toBe(true);
    expect(access.create!(req)).toBe(false);
    expect(access.update!(req)).toBe(true);
    expect(access.delete!(req)).toBe(false);
  });

  test('viewer has no access', () => {
    const req = mockReq(mockUser('viewer'));
    expect(access.read!(req)).toBe(false);
    expect(access.create!(req)).toBe(false);
    expect(access.update!(req)).toBe(false);
    expect(access.delete!(req)).toBe(false);
  });
});

// --- SiteSettings: same pattern as Navigation ---

describe('SiteSettings — access control', () => {
  const access = getAccess(SiteSettings);

  test('anonymous has no access', () => {
    expect(access.read!(mockReq(null))).toBe(false);
    expect(access.create!(mockReq(null))).toBe(false);
  });

  test('super-admin has full access', () => {
    const req = mockReq(mockUser('super-admin'));
    expect(access.read!(req)).toBe(true);
    expect(access.create!(req)).toBe(true);
    expect(access.update!(req)).toBe(true);
    expect(access.delete!(req)).toBe(true);
  });

  test('content-editor can read and update but not create or delete', () => {
    const req = mockReq(mockUser('content-editor'));
    expect(access.read!(req)).toBe(true);
    expect(access.create!(req)).toBe(false);
    expect(access.update!(req)).toBe(true);
    expect(access.delete!(req)).toBe(false);
  });
});

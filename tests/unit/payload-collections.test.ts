import { describe, test, expect } from 'vitest';
import type { CollectionConfig } from 'payload';

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

const allCollections: CollectionConfig[] = [
  Users,
  Pages,
  BlogPosts,
  BlogCategories,
  Services,
  Testimonials,
  TeamMembers,
  ServiceAreas,
  Media,
  QuoteRequests,
  Navigation,
  SiteSettings,
];

// Expected slugs must match payload.config.ts registration
const expectedSlugs = [
  'users',
  'pages',
  'blog-posts',
  'blog-categories',
  'services',
  'testimonials',
  'team-members',
  'service-areas',
  'media',
  'quote-requests',
  'navigation',
  'site-settings',
];

// --- Helpers ---

type PayloadField = {
  name?: string;
  type: string;
  required?: boolean;
  localized?: boolean;
  fields?: PayloadField[];
};

function flattenFields(fields: PayloadField[]): PayloadField[] {
  return fields.flatMap((f) =>
    f.type === 'group' || f.type === 'array'
      ? [f, ...flattenFields(f.fields ?? [])]
      : [f],
  );
}

// --- Tests ---

describe('Collection Registration', () => {
  test('all expected slugs are present', () => {
    const slugs = allCollections.map((c) => c.slug);
    for (const expected of expectedSlugs) {
      expect(slugs).toContain(expected);
    }
  });

  test('no duplicate slugs', () => {
    const slugs = allCollections.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('Collection Structure', () => {
  for (const collection of allCollections) {
    test(`${collection.slug} has access control defined`, () => {
      expect(collection.access).toBeDefined();
      expect(collection.access!.read).toBeDefined();
    });

    test(`${collection.slug} has at least one field`, () => {
      expect(collection.fields.length).toBeGreaterThan(0);
    });
  }
});

describe('Localized Fields', () => {
  const localizedCollections: {
    name: string;
    config: CollectionConfig;
    expectedFields: string[];
  }[] = [
    { name: 'Pages', config: Pages, expectedFields: ['title', 'content'] },
    {
      name: 'BlogPosts',
      config: BlogPosts,
      expectedFields: ['title', 'slug', 'excerpt', 'content'],
    },
    {
      name: 'Services',
      config: Services,
      expectedFields: ['title', 'shortDescription', 'fullDescription'],
    },
    {
      name: 'Testimonials',
      config: Testimonials,
      expectedFields: ['testimonial'],
    },
    { name: 'TeamMembers', config: TeamMembers, expectedFields: ['position'] },
    { name: 'ServiceAreas', config: ServiceAreas, expectedFields: ['name'] },
    {
      name: 'BlogCategories',
      config: BlogCategories,
      expectedFields: ['name'],
    },
  ];

  for (const { name, config, expectedFields } of localizedCollections) {
    test(`${name} has localized fields: ${expectedFields.join(', ')}`, () => {
      const flat = flattenFields(config.fields as PayloadField[]);
      for (const fieldName of expectedFields) {
        const field = flat.find((f) => f.name === fieldName);
        expect(
          field,
          `field "${fieldName}" not found in ${name}`,
        ).toBeDefined();
        expect(
          field!.localized,
          `field "${fieldName}" in ${name} should be localized`,
        ).toBe(true);
      }
    });
  }
});

describe('Required Fields', () => {
  test('Users requires role', () => {
    const role = (Users.fields as PayloadField[]).find(
      (f) => f.name === 'role',
    );
    expect(role?.required).toBe(true);
  });

  test('Pages requires title, slug, content', () => {
    const fields = Pages.fields as PayloadField[];
    for (const name of ['title', 'slug', 'content']) {
      expect(
        fields.find((f) => f.name === name)?.required,
        `${name} should be required`,
      ).toBe(true);
    }
  });

  test('BlogPosts requires title, slug, excerpt, content, author, categories', () => {
    const fields = BlogPosts.fields as PayloadField[];
    for (const name of [
      'title',
      'slug',
      'excerpt',
      'content',
      'author',
      'categories',
    ]) {
      expect(
        fields.find((f) => f.name === name)?.required,
        `${name} should be required`,
      ).toBe(true);
    }
  });

  test('Services requires title, slug, shortDescription, fullDescription', () => {
    const fields = Services.fields as PayloadField[];
    for (const name of [
      'title',
      'slug',
      'shortDescription',
      'fullDescription',
    ]) {
      expect(
        fields.find((f) => f.name === name)?.required,
        `${name} should be required`,
      ).toBe(true);
    }
  });

  test('QuoteRequests requires referenceId and service', () => {
    const fields = QuoteRequests.fields as PayloadField[];
    for (const name of ['referenceId', 'service']) {
      expect(
        fields.find((f) => f.name === name)?.required,
        `${name} should be required`,
      ).toBe(true);
    }
  });
});

describe('User Roles', () => {
  test('role field has exactly 3 options', () => {
    const role = (Users.fields as PayloadField[]).find(
      (f) => f.name === 'role',
    ) as {
      options: { value: string }[];
    };
    const values = role.options.map((o) => o.value);
    expect(values).toEqual(['super-admin', 'content-editor', 'viewer']);
  });

  test('default role is viewer', () => {
    const role = (Users.fields as PayloadField[]).find(
      (f) => f.name === 'role',
    ) as {
      defaultValue: string;
    };
    expect(role.defaultValue).toBe('viewer');
  });
});

describe('QuoteRequests — service options', () => {
  test('service field has expected options', () => {
    const service = (QuoteRequests.fields as PayloadField[]).find(
      (f) => f.name === 'service',
    ) as {
      options: { value: string }[];
    };
    const values = service.options.map((o) => o.value);
    expect(values).toEqual(['collision', 'bodywork', 'painting', 'insurance']);
  });

  test('status field has expected workflow states', () => {
    const status = (QuoteRequests.fields as PayloadField[]).find(
      (f) => f.name === 'status',
    ) as {
      options: { value: string }[];
      defaultValue: string;
    };
    const values = status.options.map((o) => o.value);
    expect(values).toEqual(['new', 'contacted', 'estimated', 'closed']);
    expect(status.defaultValue).toBe('new');
  });
});

describe('Media — upload config', () => {
  test('only allows image MIME types', () => {
    const upload = Media.upload as { mimeTypes: string[] };
    expect(upload.mimeTypes).toEqual(['image/*']);
  });

  test('has thumbnail, card, and tablet image sizes', () => {
    const upload = Media.upload as { imageSizes: { name: string }[] };
    const names = upload.imageSizes.map((s) => s.name);
    expect(names).toContain('thumbnail');
    expect(names).toContain('card');
    expect(names).toContain('tablet');
  });
});

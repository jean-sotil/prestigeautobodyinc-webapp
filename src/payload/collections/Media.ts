import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'group',
      label: 'Alt Text',
      admin: {
        description:
          'Describe the image for screen readers and SEO. Fill in both languages when possible — leaving blank is allowed but hurts accessibility.',
      },
      fields: [
        {
          name: 'en',
          type: 'text',
          label: 'English',
        },
        {
          name: 'es',
          type: 'text',
          label: 'Spanish',
        },
      ],
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
      localized: true,
    },
  ],
};

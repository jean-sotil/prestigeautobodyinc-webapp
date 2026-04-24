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
      fields: [
        {
          name: 'en',
          type: 'text',
          label: 'English',
          required: true,
          localized: true,
        },
        {
          name: 'es',
          type: 'text',
          label: 'Spanish',
          required: true,
          localized: true,
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

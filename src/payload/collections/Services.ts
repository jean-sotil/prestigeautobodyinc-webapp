import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'fullDescription',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Service Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'serviceAreas',
      type: 'relationship',
      relationTo: 'service-areas',
      hasMany: true,
      label: 'Available In Service Areas',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};

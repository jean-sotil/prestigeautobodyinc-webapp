import type { CollectionConfig } from 'payload';

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'state', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'state',
      type: 'text',
      required: true,
    },
    {
      name: 'zipCodes',
      type: 'array',
      label: 'Service ZIP Codes',
      fields: [
        {
          name: 'zipCode',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
      label: 'Google Maps Embed URL',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};

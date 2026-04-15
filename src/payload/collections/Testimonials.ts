import type { CollectionConfig } from 'payload';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'customerName',
    group: 'Content',
    defaultColumns: ['customerName', 'rating', 'status', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'serviceType',
      type: 'relationship',
      relationTo: 'services',
      label: 'Service Received',
    },
    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
    },
    {
      name: 'customerPhoto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'vehicleInfo',
      type: 'text',
      label: 'Vehicle Info (optional)',
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
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Testimonial',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};

import type { CollectionConfig } from 'payload';

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'serviceType', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin' || user.role === 'content-editor';
    },
    create: () => true, // Allow public submissions
    update: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin' || user.role === 'content-editor';
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin';
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'serviceType',
      type: 'relationship',
      relationTo: 'services',
      label: 'Service Needed',
    },
    {
      name: 'vehicleYear',
      type: 'text',
    },
    {
      name: 'vehicleMake',
      type: 'text',
    },
    {
      name: 'vehicleModel',
      type: 'text',
    },
    {
      name: 'damageDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'insuranceCompany',
      type: 'text',
    },
    {
      name: 'claimNumber',
      type: 'text',
    },
    {
      name: 'preferredContact',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Either', value: 'either' },
      ],
      defaultValue: 'email',
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Damage Photos',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};

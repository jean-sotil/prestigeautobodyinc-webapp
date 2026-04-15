import type { CollectionConfig } from 'payload';

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'location', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin' || user.role === 'content-editor';
    },
    create: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin';
    },
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
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Main Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Mobile Menu', value: 'mobile' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Navigation Items',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'URL', value: 'url' },
          ],
          defaultValue: 'page',
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'url',
          },
        },
        {
          name: 'children',
          type: 'array',
          label: 'Sub-items',
          localized: true,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Page', value: 'page' },
                { label: 'URL', value: 'url' },
              ],
              defaultValue: 'page',
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'url',
              },
            },
          ],
        },
      ],
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

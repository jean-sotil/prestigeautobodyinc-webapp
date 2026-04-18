import type { CollectionConfig } from 'payload';

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
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
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., collision-repair)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Category Description',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Display order in category lists',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        position: 'sidebar',
        description: 'Show this category on the site',
      },
    },
    {
      name: 'focusKeyword',
      type: 'text',
      localized: true,
      label: 'SEO Focus Keyword',
      admin: {
        description: 'Primary keyword for topical authority',
      },
    },
  ],
};

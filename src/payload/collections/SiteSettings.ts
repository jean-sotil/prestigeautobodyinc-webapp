import type { CollectionConfig } from 'payload';

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  admin: {
    useAsTitle: 'siteName',
    group: 'Admin',
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
      name: 'siteName',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: 'Google Maps URL',
        },
        {
          name: 'hoursOfOperation',
          type: 'array',
          label: 'Hours of Operation',
          localized: true,
          fields: [
            {
              name: 'day',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'hours',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'youtube',
          type: 'text',
        },
      ],
    },
    {
      name: 'seoDefaults',
      type: 'group',
      label: 'Default SEO Settings',
      fields: [
        {
          name: 'defaultMetaTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'defaultMetaDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
        },
        {
          name: 'facebookPixelId',
          type: 'text',
          label: 'Facebook Pixel ID',
        },
      ],
    },
  ],
};

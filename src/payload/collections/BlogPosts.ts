import type { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'author', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: true,
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
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team-members',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      required: true,
      localized: true,
      admin: {
        description: 'Select one or more categories for this post',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO Meta Tags',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          localized: true,
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
          localized: true,
        },
        {
          name: 'focusKeyword',
          type: 'text',
          label: 'Focus Keyword',
          localized: true,
          admin: {
            description: 'Primary keyword for SEO optimization',
          },
        },
      ],
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      localized: true,
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
      ],
      defaultValue: 'en',
      admin: {
        position: 'sidebar',
        description: 'Content language variant',
      },
    },
    {
      name: 'n8nSource',
      type: 'group',
      label: 'Automation Source',
      admin: {
        position: 'sidebar',
        description: 'n8n automation metadata',
      },
      fields: [
        {
          name: 'workflowId',
          type: 'text',
          label: 'Workflow ID',
        },
        {
          name: 'executionId',
          type: 'text',
          label: 'Execution ID',
        },
        {
          name: 'triggeredAt',
          type: 'date',
          label: 'Triggered At',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'contentSource',
          type: 'select',
          options: [
            { label: 'AI Generated', value: 'ai' },
            { label: 'Manual', value: 'manual' },
            { label: 'Import', value: 'import' },
          ],
          defaultValue: 'manual',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, previousDoc }) => {
        // Trigger ISR revalidation when a post is published
        if (doc.status === 'published' && previousDoc?.status !== 'published') {
          try {
            // Only run on server
            if (typeof window !== 'undefined') return doc;

            const { revalidateBlogPost } = await import('@/lib/revalidation');
            await revalidateBlogPost(doc.slug, doc.locale || 'en');
          } catch (error) {
            console.error('Failed to revalidate blog post:', error);
          }
        }
        return doc;
      },
    ],
  },
};

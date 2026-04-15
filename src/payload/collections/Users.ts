import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'super-admin') return true;
      return { id: { equals: user.id } };
    },
    create: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin';
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'super-admin') return true;
      return { id: { equals: user.id } };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin';
    },
    admin: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'super-admin' || user.role === 'content-editor';
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Content Editor', value: 'content-editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },
  ],
};

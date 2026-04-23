import type { CollectionConfig } from 'payload';

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'referenceId',
    group: 'Admin',
    defaultColumns: ['referenceId', 'service', 'status', 'createdAt'],
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
    // Reference ID
    {
      name: 'referenceId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    // Service Information
    {
      name: 'service',
      type: 'select',
      options: [
        { label: 'Collision Repair', value: 'collision' },
        { label: 'Bodywork', value: 'bodywork' },
        { label: 'Painting', value: 'painting' },
        { label: 'Insurance Claim', value: 'insurance' },
      ],
      required: true,
    },
    // Vehicle Information
    {
      name: 'vehicle',
      type: 'group',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          min: 1900,
          max: new Date().getFullYear() + 2,
        },
        {
          name: 'make',
          type: 'text',
          required: true,
        },
        {
          name: 'model',
          type: 'text',
        },
        {
          name: 'vin',
          type: 'text',
          label: 'VIN (optional)',
          admin: {
            description: '17-character Vehicle Identification Number',
          },
        },
      ],
    },
    // Damage Information
    {
      name: 'damage',
      type: 'group',
      fields: [
        {
          name: 'severity',
          type: 'select',
          options: [
            { label: 'Minor', value: 'minor' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Major', value: 'major' },
            { label: 'Unsure', value: 'unsure' },
          ],
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'hasPhotos',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'damagePhotos',
          type: 'relationship',
          relationTo: 'media',
          hasMany: true,
          admin: {
            condition: (data) => data?.damage?.hasPhotos === true,
          },
        },
      ],
    },
    // Contact Information
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
        },
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
          name: 'preferredMethod',
          type: 'select',
          options: [
            { label: 'Phone', value: 'phone' },
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
          ],
          defaultValue: 'phone',
        },
      ],
    },
    // Appointment
    {
      name: 'appointment',
      type: 'group',
      fields: [
        {
          name: 'date',
          type: 'text',
          admin: {
            description: 'Preferred appointment date',
          },
        },
        {
          name: 'time',
          type: 'text',
          admin: {
            description: 'Preferred appointment time',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Additional Notes',
        },
      ],
    },
    // Metadata
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'locale',
          type: 'select',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
          ],
          defaultValue: 'en',
        },
        {
          name: 'source',
          type: 'text',
          defaultValue: 'website',
        },
        {
          name: 'submittedAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'formLoadedAt',
          type: 'number',
          admin: {
            description: 'Timestamp when form was loaded (for spam detection)',
          },
        },
        {
          name: 'submissionDurationMs',
          type: 'number',
          admin: {
            description: 'Time between form load and submission',
          },
        },
        {
          name: 'userAgent',
          type: 'text',
        },
        {
          name: 'utmSource',
          type: 'text',
        },
        {
          name: 'utmMedium',
          type: 'text',
        },
        {
          name: 'utmCampaign',
          type: 'text',
        },
        {
          name: 'ipHash',
          type: 'text',
          admin: {
            description: 'SHA-256 hash of IP address',
          },
        },
      ],
    },
    // Status
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Estimated', value: 'estimated' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
    // Security
    {
      name: 'honeypotTriggered',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Bot detection triggered',
      },
    },
    // Internal Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
      },
    },
    // Legacy field migration (keep for backwards compatibility)
    {
      name: 'name',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'serviceType',
      type: 'relationship',
      relationTo: 'services',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'vehicleYear',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'vehicleMake',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'vehicleModel',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'damageDescription',
      type: 'textarea',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'insuranceCompany',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'claimNumber',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'preferredContact',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Either', value: 'either' },
      ],
      admin: {
        hidden: true,
      },
    },
    {
      name: 'photos',
      type: 'array',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
};

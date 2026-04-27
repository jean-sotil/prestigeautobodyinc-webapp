import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { en } from '@payloadcms/translations/languages/en';
import { es } from '@payloadcms/translations/languages/es';

// Collections
import { BlogCategories } from './collections/BlogCategories';
import { BlogPosts } from './collections/BlogPosts';
import { Media } from './collections/Media';
import { Navigation } from './collections/Navigation';
import { Pages } from './collections/Pages';
import { QuoteRequests } from './collections/QuoteRequests';
import { ServiceAreas } from './collections/ServiceAreas';
import { Services } from './collections/Services';
import { SiteSettings } from './collections/SiteSettings';
import { TeamMembers } from './collections/TeamMembers';
import { Testimonials } from './collections/Testimonials';

// Users (for RBAC)
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Admin configuration
  admin: {
    autoLogin: false,
    components: {
      graphics: {
        Logo: '@/payload/components/Logo#Logo',
        Icon: '@/payload/components/Icon#Icon',
      },
    },
    meta: {
      titleSuffix: '- Prestige Auto Body Inc',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // Collections
  collections: [
    Users,
    Pages,
    BlogCategories,
    BlogPosts,
    Testimonials,
    Services,
    TeamMembers,
    ServiceAreas,
    Media,
    QuoteRequests,
    Navigation,
    SiteSettings,
  ],

  // Database
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),

  // Editor
  editor: lexicalEditor(),

  // Localization
  localization: {
    locales: [
      {
        code: 'en',
        label: 'English',
        rtl: false,
      },
      {
        code: 'es',
        label: 'Español',
        rtl: false,
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // Plugins
  plugins: [
    // Vercel Blob Storage for media files
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  // Secret
  secret: process.env.PAYLOAD_SECRET || '',

  // Sharp for image processing
  sharp,

  // TypeScript
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // i18n
  i18n: {
    supportedLanguages: { en, es },
  },
});

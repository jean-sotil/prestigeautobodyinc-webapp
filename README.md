This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection string

### Environment Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update the environment variables in `.env.local`:

- `PAYLOAD_SECRET` - Generate a random string (e.g., `openssl rand -hex 32`)
- `MONGODB_URI` - Your MongoDB connection string
- `BLOB_READ_WRITE_TOKEN` - (Optional) Vercel Blob token for media storage

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Payload CMS Admin Panel

Once the dev server is running, access the Payload CMS admin panel at:

**[http://localhost:3000/admin](http://localhost:3000/admin)**

On first access, you'll be prompted to create an admin user. This creates the first Super Admin account.

**Collections configured:**

- **Pages** - CMS pages with SEO fields
- **BlogPosts** - Blog posts with author and tags
- **Services** - Auto body services
- **Testimonials** - Customer testimonials
- **TeamMembers** - Staff profiles
- **ServiceAreas** - Geographic service coverage
- **Media** - Image uploads with required alt text (EN/ES)
- **QuoteRequests** - Customer quote submissions
- **Navigation** - Dynamic navigation menus
- **SiteSettings** - Global site configuration

**Features:**

- Full EN/ES localization
- RBAC (Super Admin, Content Editor, Viewer roles)
- Custom Prestige Auto Body branding
- REST API endpoints for all collections

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

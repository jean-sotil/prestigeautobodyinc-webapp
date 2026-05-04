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
- `GOOGLE_PLACES_API_KEY` - Google Places API key for business information
- `GOOGLE_PLACE_ID` - Your Google Place ID for reviews and location

**Quote Form API (Required for quote submissions):**

- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis for rate limiting ([Get credentials](https://console.upstash.com/))
- `RESEND_API_KEY` - Resend API key for email notifications ([Get key](https://resend.com/))
- `FROM_EMAIL` - Sender email address for notifications (e.g., `quotes@prestigeautobody.com`)
- `SHOP_EMAIL` - Internal shop email to receive quote notifications
- `IP_HASH_SALT` - Secret salt for IP address hashing (`openssl rand -hex 32`)

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

### Quote Form API

The `/api/quote` endpoint handles customer quote submissions with advanced features:

**Submission Methods:**

- `multipart/form-data` - With damage photos (up to 5 files, max 5MB each)
- `application/json` - Without photos for quick submissions

**Security Controls:**

- Honeypot field to catch bots (silently drops spam submissions)
- Time-based spam detection (minimum 3 seconds between form load and submission)
- Rate limiting (3 submissions per IP per hour via Upstash Redis)
- IP address hashing (SHA-256 with salt, never stores raw IP)
- File validation using magic bytes to verify MIME types
- File bomb guard (rejects payloads > 22MB)

**Email Notifications:**

- Bilingual support (English/Spanish)
- Shop notification email with inline damage photos
- Customer confirmation email with photo gallery
- Reference ID tracking (format: `PAB-YYYYMMDD-XXXX`)

**Validation:**

- Zod schema validation with per-field error messages
- File type verification (JPEG, PNG, WebP, HEIC, HEIF)
- Size limits: 5MB per file, 20MB total upload

### Testing

The project includes unit tests (Vitest) and end-to-end tests (Playwright).

**Commands:**

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `npm test`                | Run all unit tests                               |
| `npm run test:watch`      | Run unit tests in watch mode                     |
| `npm run test:coverage`   | Run unit tests with coverage report              |
| `npm run test:e2e`        | Run E2E tests (requires dev server on port 3000) |
| `npm run test:e2e:ui`     | Open Playwright interactive UI                   |
| `npm run test:e2e:headed` | Run E2E tests with visible browser               |
| `npm run test:all`        | Run unit + E2E tests sequentially                |

**Unit Tests** (`tests/unit/`):

| Test file                     | Coverage area                                                       |
| ----------------------------- | ------------------------------------------------------------------- |
| `payload-access.test.ts`      | RBAC access control for all Payload collections                     |
| `payload-collections.test.ts` | Collection structure, required/localized fields, slugs, config      |
| `quote-schema.test.ts`        | Zod schema validation for quote submissions                         |
| `quote-form-steps.test.ts`    | Multi-step form validation per step                                 |
| `quote-form-reducer.test.ts`  | Form state reducer (add/remove files, reset, hydrate)               |
| `quote-helpers.test.ts`       | Reference ID generation, sanitization, phone formatting, IP hashing |
| `seo.test.ts`                 | Page metadata builder (canonical, hreflang, OpenGraph)              |
| `jsonld.test.tsx`             | JSON-LD structured data (LocalBusiness, WebSite, FAQ, Breadcrumb)   |
| `business.test.ts`            | Business constants (address, phone, geo, hours)                     |
| `i18n-completeness.test.ts`   | EN/ES translation key parity and completeness                       |

**E2E Tests** (`tests/e2e/`):

| Test file            | Coverage area                                                                        |
| -------------------- | ------------------------------------------------------------------------------------ |
| `navigation.spec.ts` | Header, footer, responsive layout, localization, critical page loads                 |
| `seo.spec.ts`        | Meta tags, hreflang, heading structure, JSON-LD, robots.txt, sitemap, lang attribute |

**Notes:**

- Unit tests run in jsdom via Vitest
- E2E tests run across 3 Playwright projects: `desktop-chrome`, `mobile-chrome`, `tablet`
- The dev server must be running before executing E2E tests
- E2E tests use `--timeout=60000` to account for cold compilation on first run

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

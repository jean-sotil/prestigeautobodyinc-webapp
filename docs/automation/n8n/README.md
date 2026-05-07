# n8n Blog Automation Pipeline

This document describes the n8n automation workflow for the Prestige Auto Body Inc blog content pipeline.

## Overview

The automation pipeline enables content creation workflows that feed into the Payload CMS:

```
Trigger (schedule/webhook)
  → Generate content (AI or manual)
  → POST to Next.js API
  → Validate content
  → Create draft in Payload CMS
  → Manual review in CMS admin
  → Publish
  → ISR revalidation
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Webhook security (required for production)
N8N_WEBHOOK_SECRET=your-secure-random-string

# ISR revalidation (required for cache invalidation)
REVALIDATE_SECRET=another-secure-random-string

# Site URL (for revalidation API calls)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## API Endpoints

### 1. Create Blog Draft

**Endpoint:** `POST /api/blog/draft`

**Headers:**

- `Content-Type: application/json`
- `X-n8n-Webhook-Secret: <N8N_WEBHOOK_SECRET>` (if configured)

**Request Body:**

```json
{
  "title": "How to Handle Insurance Claims After an Accident",
  "slug": "handle-insurance-claims-accident",
  "excerpt": "Learn the essential steps to navigate the insurance claims process smoothly after a collision.",
  "content": {
    /* Lexical rich text JSON */
  },
  "categories": ["insurance-tips"],
  "authorSlug": "john-doe",
  "locale": "en",
  "metaTitle": "Handle Insurance Claims After Accident | Prestige Auto Body",
  "metaDescription": "Expert guidance on navigating insurance claims after a collision. Learn what to do step-by-step.",
  "focusKeyword": "insurance claims after accident",
  "tags": ["insurance", "claims", "accident"],
  "workflowId": "workflow-123",
  "executionId": "exec-456",
  "contentSource": "ai"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Blog draft created successfully",
  "data": {
    "id": "post-id-123",
    "slug": "handle-insurance-claims-accident",
    "title": "How to Handle Insurance Claims After an Accident",
    "status": "draft",
    "locale": "en",
    "cmsUrl": "/admin/collections/blog-posts/post-id-123"
  }
}
```

### 2. Revalidate Pages (ISR)

**Endpoint:** `POST /api/revalidate`

**Request Body:**

```json
{
  "secret": "<REVALIDATE_SECRET>",
  "paths": ["/en/blog", "/en/blog/my-post"]
}
```

**Response:**

```json
{
  "success": true,
  "revalidated": true,
  "message": "Successfully revalidated 2 path(s)",
  "paths": [
    { "path": "/en/blog", "success": true },
    { "path": "/en/blog/my-post", "success": true }
  ]
}
```

## Blog Categories

The 5 required categories (seed them first):

| Slug               | English Name     | Spanish Name             |
| ------------------ | ---------------- | ------------------------ |
| `collision-repair` | Collision Repair | Reparación de Colisiones |
| `auto-painting`    | Auto Painting    | Pintura Automotriz       |
| `insurance-tips`   | Insurance Tips   | Consejos de Seguro       |
| `maintenance`      | Maintenance      | Mantenimiento            |
| `news`             | News             | Noticias                 |

**Seed script:**

```bash
pnpm ts-node src/payload/seed/blog-categories.ts
```

## n8n Workflow Example

### Webhook Configuration

1. **HTTP Request Node** (POST to your API):
   - URL: `https://your-domain.com/api/blog/draft`
   - Headers: `X-n8n-Webhook-Secret: {{$env.N8N_WEBHOOK_SECRET}}`
   - Body: JSON from your content generation

2. **Category Mapping**:
   - Map content topics to category slugs:
     - Insurance content → `insurance-tips`
     - Painting content → `auto-painting`
     - Repair content → `collision-repair`
     - Care tips → `maintenance`
     - Announcements → `news`

3. **Author Mapping**:
   - Map to existing team member slugs in Payload CMS
   - Example: `john-doe`, `jane-smith`

### Draft/Publish Flow

1. n8n creates post as **draft** (never auto-publishes)
2. Content team reviews in Payload CMS admin
3. Admin publishes when ready
4. Payload hook triggers ISR revalidation automatically

## Security Notes

- Always use `N8N_WEBHOOK_SECRET` in production
- API will reject requests without valid secret when configured
- All posts are created as drafts regardless of status in request
- Secrets should be random strings (32+ characters recommended)

## Content Localization

- Set `locale` field to `en` or `es`
- Content should be generated separately for each language
- CMS supports bilingual content management

## Troubleshooting

**Category not found error:**

- Run seed script to create categories
- Verify category slug matches exactly (case-sensitive)

**Author not found error:**

- Ensure team member exists in CMS
- Verify author slug is correct

**Revalidation failures:**

- Check `REVALIDATE_SECRET` is configured
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check server logs for errors

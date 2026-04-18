/**
 * Payload CMS Type Definitions
 * Basic types for working with Payload in API routes
 */

export interface PayloadInstance {
  create: <T = unknown>(args: {
    collection: string;
    data: Record<string, unknown>;
    file?: {
      data: Buffer;
      mimetype: string;
      name: string;
      size: number;
    };
  }) => Promise<T>;
  find: <T = unknown>(args: {
    collection: string;
    where?: Record<string, { equals?: string | number | boolean }>;
    locale?: string;
  }) => Promise<{ docs: T[] }>;
  findByID: <T = unknown>(args: {
    collection: string;
    id: string;
  }) => Promise<T | null>;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  locale: string;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
}

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
}

export interface MediaDoc {
  id: string;
  url: string;
  alt?: string;
}

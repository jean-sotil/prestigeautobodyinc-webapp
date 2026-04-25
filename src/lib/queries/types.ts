/**
 * Data types for TanStack Query hooks
 * Based on Payload CMS collections
 */

// ============================================================================
// Testimonials
// ============================================================================

export interface Testimonial {
  id: string;
  customerName: string;
  serviceType?: {
    id: string;
    name: string;
  };
  testimonial: string;
  rating: number;
  customerPhoto?: {
    id: string;
    url: string;
    alt?: string;
  };
  vehicleInfo?: string;
  order?: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialsResponse {
  docs: Testimonial[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================================================
// Blog Posts
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown; // Rich text JSON from Payload
  featuredImage?: {
    id: string;
    url: string;
    alt?: string;
  };
  author: {
    id: string;
    fullName: string;
    position?: string;
    photo?: {
      id: string;
      url: string;
      alt?: string;
    };
  };
  categories: {
    id: string;
    slug: string;
    name: string;
  }[];
  meta?: {
    title?: string;
    description?: string;
    ogImage?: {
      id: string;
      url: string;
    };
    focusKeyword?: string;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  tags?: { tag: string }[];
  locale: 'en' | 'es';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostsResponse {
  docs: BlogPost[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface BlogPostsParams {
  locale: string;
  page?: number;
  limit?: number;
  category?: string;
}

// ============================================================================
// Service Areas
// ============================================================================

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  state: string;
  zipCodes?: { zipCode: string }[];
  description?: unknown; // Rich text JSON from Payload
  googleMapsUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAreasResponse {
  docs: ServiceArea[];
  totalDocs: number;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

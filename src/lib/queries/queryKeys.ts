/**
 * Type-safe Query Keys for TanStack Query
 * Ensures consistent and deduplicated query keys across the app
 */

// ============================================================================
// Query Key Types
// ============================================================================

export const queryKeys = {
  // Testimonials
  testimonials: {
    all: ['testimonials'] as const,
    list: (locale: string, featured?: boolean) =>
      [...queryKeys.testimonials.all, 'list', { locale, featured }] as const,
    byId: (id: string) => [...queryKeys.testimonials.all, 'byId', id] as const,
  },

  // Blog Posts
  blogPosts: {
    all: ['blog-posts'] as const,
    list: (locale: string, page?: number, limit?: number) =>
      [...queryKeys.blogPosts.all, 'list', { locale, page, limit }] as const,
    bySlug: (slug: string, locale: string) =>
      [...queryKeys.blogPosts.all, 'bySlug', slug, { locale }] as const,
    byCategory: (category: string, locale: string) =>
      [...queryKeys.blogPosts.all, 'byCategory', category, { locale }] as const,
  },

  // Service Areas
  serviceAreas: {
    all: ['service-areas'] as const,
    list: (locale: string) =>
      [...queryKeys.serviceAreas.all, 'list', { locale }] as const,
    bySlug: (slug: string, locale: string) =>
      [...queryKeys.serviceAreas.all, 'bySlug', slug, { locale }] as const,
    byZip: (zipCode: string) =>
      [...queryKeys.serviceAreas.all, 'byZip', zipCode] as const,
  },

  // Quote submission (mutations don't need caching keys)
  quote: {
    submit: ['quote', 'submit'] as const,
  },
};

// ============================================================================
// Type exports for type-safe usage
// ============================================================================

export type TestimonialsListKey = ReturnType<
  typeof queryKeys.testimonials.list
>;
export type TestimonialsByIdKey = ReturnType<
  typeof queryKeys.testimonials.byId
>;
export type BlogPostsListKey = ReturnType<typeof queryKeys.blogPosts.list>;
export type BlogPostsBySlugKey = ReturnType<typeof queryKeys.blogPosts.bySlug>;
export type BlogPostsByCategoryKey = ReturnType<
  typeof queryKeys.blogPosts.byCategory
>;
export type ServiceAreasListKey = ReturnType<
  typeof queryKeys.serviceAreas.list
>;
export type ServiceAreasBySlugKey = ReturnType<
  typeof queryKeys.serviceAreas.bySlug
>;
export type ServiceAreasByZipKey = ReturnType<
  typeof queryKeys.serviceAreas.byZip
>;

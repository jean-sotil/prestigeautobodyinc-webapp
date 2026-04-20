/**
 * TanStack Query Hooks and Configuration
 * Centralized data layer for Prestige Auto Body webapp
 */

// Query Client
export {
  queryClient,
  getQueryClient,
  makeQueryClient,
  queryClientConfig,
  staleTimes,
} from './queryClient';

// Query Keys
export { queryKeys } from './queryKeys';
export type {
  TestimonialsListKey,
  TestimonialsByIdKey,
  BlogPostsListKey,
  BlogPostsBySlugKey,
  BlogPostsByCategoryKey,
  ServiceAreasListKey,
  ServiceAreasBySlugKey,
  ServiceAreasByZipKey,
} from './queryKeys';

// Types
export type {
  Testimonial,
  TestimonialsResponse,
  BlogPost,
  BlogPostsResponse,
  BlogPostsParams,
  ServiceArea,
  ServiceAreasResponse,
  ApiError,
} from './types';

// Hooks
export {
  useTestimonials,
  prefetchTestimonials,
  type UseTestimonialsOptions,
  type UseTestimonialsReturn,
} from './useTestimonials';

export {
  useBlogPosts,
  useInfiniteBlogPosts,
  useBlogPostBySlug,
  prefetchBlogPosts,
  type UseBlogPostsOptions,
  type UseBlogPostsReturn,
  type UseInfiniteBlogPostsReturn,
} from './useBlogPosts';

export {
  useServiceAreas,
  useServiceAreaBySlug,
  useServiceAreaByZip,
  prefetchServiceAreas,
  prefetchServiceAreaBySlug,
  type UseServiceAreasOptions,
  type UseServiceAreasReturn,
} from './useServiceAreas';

// Quote Submission
export {
  useSubmitQuote,
  type SubmitResult,
  type SubmitError,
} from '@/components/quote-form/hooks/useSubmitQuote';

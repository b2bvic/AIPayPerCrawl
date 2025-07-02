import { z } from 'zod';

// URL validation helpers
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Common schemas
export const emailSchema = z.string().email('Invalid email address');
export const urlSchema = z.string().refine(isValidUrl, 'Invalid URL');
export const domainSchema = z.string().regex(
  /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
  'Invalid domain format'
);

// Quote request schema
export const quoteRequestSchema = z.object({
  urls: z.array(urlSchema).min(1, 'At least one URL is required').max(1000, 'Maximum 1000 URLs allowed'),
  callbackUrl: urlSchema.optional(),
  metadata: z.record(z.any()).optional()
});

// Domain claim schema
export const domainClaimSchema = z.object({
  domain: domainSchema,
  email: emailSchema,
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().optional(),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
  requestedPrice: z.number().min(0.001).max(10).optional()
});

// API key creation schema
export const apiKeyCreateSchema = z.object({
  name: z.string().min(3, 'Key name must be at least 3 characters').max(50),
  expiresIn: z.enum(['30d', '90d', '1y', 'never']).optional()
});

// Crawl options schema
export const crawlOptionsSchema = z.object({
  includeHtml: z.boolean().optional(),
  includeText: z.boolean().optional(),
  includeMetadata: z.boolean().optional(),
  includeLinks: z.boolean().optional(),
  includeImages: z.boolean().optional(),
  timeout: z.number().min(1000).max(60000).optional(),
  userAgent: z.string().optional()
});

// Publisher registration schema
export const publisherRegisterSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().optional(),
  website: urlSchema.optional()
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.object({
    category: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().max(100).optional(),
    hasPayPerCrawl: z.boolean().optional()
  }).optional()
});

// Validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    throw new ValidationError(JSON.stringify(errors));
  }
  return result.data;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
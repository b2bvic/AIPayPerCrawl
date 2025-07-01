import { pgTable, uuid, varchar, boolean, decimal, timestamp, text, integer, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Domains table - core table for Pay Per Crawl domains
export const domains = pgTable('domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  domain: varchar('domain', { length: 255 }).notNull().unique(),
  isCloudflare: boolean('is_cloudflare').notNull().default(false),
  hasPayPerCrawl: boolean('has_pay_per_crawl').notNull().default(false),
  pricePerRequest: decimal('price_per_request', { precision: 10, scale: 6 }),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  lastChecked: timestamp('last_checked').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // active, inactive, pending
  traffic: integer('traffic'), // From Tranco/SimilarWeb
  vertical: varchar('vertical', { length: 100 }),
  cpm: decimal('cpm', { precision: 10, scale: 2 }),
  licenseNotes: text('license_notes'),
  crawlRules: text('crawl_rules'),
  claimStatus: varchar('claim_status', { length: 20 }).notNull().default('unclaimed'), // unclaimed, claimed, verified
  ownerId: uuid('owner_id').references(() => publishers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Publishers table - domain owners/publishers
export const publishers = pgTable('publishers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }).notNull().default('0'),
  totalRequests: integer('total_requests').notNull().default(0),
  stripeAccountId: varchar('stripe_account_id', { length: 255 }),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Crawl requests table - API requests for crawling
export const crawlRequests = pgTable('crawl_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  urls: jsonb('urls').notNull(), // Array of URLs to crawl
  domainId: uuid('domain_id').notNull().references(() => domains.id),
  publisherId: uuid('publisher_id').notNull().references(() => publishers.id),
  totalCost: decimal('total_cost', { precision: 10, scale: 6 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'), // pending, paid, failed
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  requestedAt: timestamp('requested_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  results: jsonb('results'), // Array of crawl results
})

// Content pages table - for SEO/learning content
export const contentPages = pgTable('content_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  cluster: varchar('cluster', { length: 100 }).notNull(), // Topical cluster
  tags: jsonb('tags'), // Array of tags
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  publishedAt: timestamp('published_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  author: varchar('author', { length: 255 }).notNull(),
  readingTime: integer('reading_time').notNull().default(0),
})

// Analytics events table - for tracking usage and revenue
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // request, payment, error, etc.
  domainId: uuid('domain_id').references(() => domains.id),
  publisherId: uuid('publisher_id').references(() => publishers.id),
  requestId: uuid('request_id').references(() => crawlRequests.id),
  metadata: jsonb('metadata'), // Flexible event data
  timestamp: timestamp('timestamp').notNull().defaultNow(),
})

// Relations
export const domainsRelations = relations(domains, ({ one, many }) => ({
  owner: one(publishers, {
    fields: [domains.ownerId],
    references: [publishers.id],
  }),
  crawlRequests: many(crawlRequests),
  analyticsEvents: many(analyticsEvents),
}))

export const publishersRelations = relations(publishers, ({ many }) => ({
  domains: many(domains),
  crawlRequests: many(crawlRequests),
  analyticsEvents: many(analyticsEvents),
}))

export const crawlRequestsRelations = relations(crawlRequests, ({ one, many }) => ({
  domain: one(domains, {
    fields: [crawlRequests.domainId],
    references: [domains.id],
  }),
  publisher: one(publishers, {
    fields: [crawlRequests.publisherId],
    references: [publishers.id],
  }),
  analyticsEvents: many(analyticsEvents),
}))

export const contentPagesRelations = relations(contentPages, ({ many }) => ({
  // Could add relations to tags, authors, etc. if needed
}))

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  domain: one(domains, {
    fields: [analyticsEvents.domainId],
    references: [domains.id],
  }),
  publisher: one(publishers, {
    fields: [analyticsEvents.publisherId],
    references: [publishers.id],
  }),
  request: one(crawlRequests, {
    fields: [analyticsEvents.requestId],
    references: [crawlRequests.id],
  }),
})) 
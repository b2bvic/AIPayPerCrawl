export interface Domain {
  id: string
  domain: string
  isCloudflare: boolean
  hasPayPerCrawl: boolean
  pricePerRequest?: number
  currency: string
  lastChecked: Date
  status: 'active' | 'inactive' | 'pending'
  traffic?: number
  vertical?: string
  cpm?: number
  licenseNotes?: string
  crawlRules?: string
  claimStatus: 'unclaimed' | 'claimed' | 'verified'
  ownerId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Publisher {
  id: string
  email: string
  name?: string
  domains: Domain[]
  totalRevenue: number
  totalRequests: number
  stripeAccountId?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CrawlRequest {
  id: string
  urls: string[]
  domainId: string
  publisherId: string
  totalCost: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  paymentStatus: 'pending' | 'paid' | 'failed'
  stripePaymentIntentId?: string
  requestedAt: Date
  completedAt?: Date
  results?: CrawlResult[]
}

export interface CrawlResult {
  url: string
  statusCode: number
  content?: string
  error?: string
  crawledAt: Date
}

export interface APIQuote {
  urls: string[]
  totalCost: number
  currency: string
  breakdown: {
    domain: string
    urls: string[]
    pricePerRequest: number
    totalCost: number
  }[]
  expiresAt: Date
}

export interface DashboardStats {
  totalDomains: number
  totalRequests: number
  totalRevenue: number
  activePublishers: number
  averageCPM: number
  topVerticals: {
    name: string
    count: number
  }[]
}

export interface SearchFilters {
  vertical?: string
  minPrice?: number
  maxPrice?: number
  minTraffic?: number
  maxTraffic?: number
  sortBy?: 'price' | 'traffic' | 'cpm' | 'domain'
  sortOrder?: 'asc' | 'desc'
}

export interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cluster: string
  tags: string[]
  metaTitle: string
  metaDescription: string
  canonicalUrl?: string
  publishedAt: Date
  updatedAt: Date
  author: string
  readingTime: number
}

export interface NavigationItem {
  title: string
  href: string
  children?: NavigationItem[]
}

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
  jsonLd?: Record<string, any>
} 
import { z } from 'zod'
import * as cheerio from 'cheerio'

// Schema for crawl request
export const CrawlRequestSchema = z.object({
  url: z.string().url(),
  options: z.object({
    includeHtml: z.boolean().default(true),
    includeText: z.boolean().default(true),
    includeMetadata: z.boolean().default(true),
    includeLinks: z.boolean().default(false),
    includeImages: z.boolean().default(false),
    maxDepth: z.number().default(0), // 0 = single page
    timeout: z.number().default(30000), // 30 seconds
    userAgent: z.string().optional(),
    headers: z.record(z.string()).optional(),
  }).optional(),
})

export type CrawlRequest = z.infer<typeof CrawlRequestSchema>

// Schema for crawl response
export const CrawlResponseSchema = z.object({
  url: z.string(),
  status: z.number(),
  contentType: z.string(),
  html: z.string().optional(),
  text: z.string().optional(),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    author: z.string().optional(),
    publishedDate: z.string().optional(),
    modifiedDate: z.string().optional(),
    language: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
  links: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  performance: z.object({
    crawlTime: z.number(),
    htmlSize: z.number(),
    resourceCount: z.number(),
  }),
  crawledAt: z.string(),
})

export type CrawlResponse = z.infer<typeof CrawlResponseSchema>

/**
 * Crawl a single URL and extract content
 */
export async function crawlUrl(request: CrawlRequest): Promise<CrawlResponse> {
  const startTime = Date.now()
  const { url } = request
  const options = request.options || {
    includeHtml: true,
    includeText: true,
    includeMetadata: true,
    includeLinks: false,
    includeImages: false,
    maxDepth: 0,
    timeout: 30000,
  }
  
  try {
    // Set up fetch options
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'User-Agent': options.userAgent || 'AIPayPerCrawl/1.0 (compatible; Node.js)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        ...options.headers,
      },
      signal: AbortSignal.timeout(options.timeout || 30000),
    }

    // Fetch the page
    const response = await fetch(url, fetchOptions)
    const html = await response.text()
    
    // Parse with Cheerio
    const $ = cheerio.load(html)
    
    // Extract metadata
    const metadata = options.includeMetadata ? {
      title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [],
      author: $('meta[name="author"]').attr('content') || '',
      publishedDate: $('meta[property="article:published_time"]').attr('content') || '',
      modifiedDate: $('meta[property="article:modified_time"]').attr('content') || '',
      language: $('html').attr('lang') || 'en',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
    } : undefined

    // Extract text content
    const text = options.includeText ? extractText($) : undefined

    // Extract links
    const links = options.includeLinks ? extractLinks($, url) : undefined

    // Extract images
    const images = options.includeImages ? extractImages($, url) : undefined

    const crawlTime = Date.now() - startTime

    return {
      url,
      status: response.status,
      contentType: response.headers.get('content-type') || 'text/html',
      html: options.includeHtml ? html : undefined,
      text,
      metadata,
      links,
      images,
      performance: {
        crawlTime,
        htmlSize: new Blob([html]).size,
        resourceCount: (links?.length || 0) + (images?.length || 0),
      },
      crawledAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Crawl failed:', error)
    throw new Error(`Failed to crawl ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract clean text content from HTML
 */
function extractText($: cheerio.CheerioAPI): string {
  // Remove script and style elements
  $('script, style, noscript').remove()
  
  // Get text content
  const text = $('body').text()
  
  // Clean up whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
}

/**
 * Extract all links from the page
 */
function extractLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const links = new Set<string>()
  
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href')
    if (href) {
      try {
        const absoluteUrl = new URL(href, baseUrl).href
        links.add(absoluteUrl)
      } catch {
        // Invalid URL, skip
      }
    }
  })
  
  return Array.from(links)
}

/**
 * Extract all images from the page
 */
function extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const images = new Set<string>()
  
  $('img[src]').each((_, element) => {
    const src = $(element).attr('src')
    if (src) {
      try {
        const absoluteUrl = new URL(src, baseUrl).href
        images.add(absoluteUrl)
      } catch {
        // Invalid URL, skip
      }
    }
  })
  
  return Array.from(images)
}

/**
 * Batch crawl multiple URLs
 */
export async function batchCrawl(
  requests: CrawlRequest[],
  concurrency: number = 5
): Promise<Array<CrawlResponse | { url: string; error: string }>> {
  const results: Array<CrawlResponse | { url: string; error: string }> = []
  
  // Process in batches to respect concurrency limit
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(
      batch.map(request => crawlUrl(request))
    )
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        results.push({
          url: batch[index].url,
          error: result.reason.message || 'Unknown error',
        })
      }
    })
  }
  
  return results
}

/**
 * Validate robots.txt compliance
 */
export async function checkRobotsTxt(url: string, userAgent: string = 'AIPayPerCrawl'): Promise<{
  allowed: boolean;
  crawlDelay?: number;
  sitemapUrl?: string;
}> {
  try {
    const urlObj = new URL(url)
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`
    
    const response = await fetch(robotsUrl)
    if (!response.ok) {
      // No robots.txt means allowed
      return { allowed: true }
    }
    
    const robotsTxt = await response.text()
    const lines = robotsTxt.split('\n')
    
    let isRelevantSection = false
    let allowed = true
    let crawlDelay: number | undefined
    let sitemapUrl: string | undefined
    
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase()
      
      if (trimmed.startsWith('user-agent:')) {
        const agent = trimmed.split(':')[1].trim()
        isRelevantSection = agent === '*' || agent === userAgent.toLowerCase()
      } else if (isRelevantSection) {
        if (trimmed.startsWith('disallow:')) {
          const path = trimmed.split(':')[1].trim()
          if (path === '/' || url.includes(path)) {
            allowed = false
          }
        } else if (trimmed.startsWith('crawl-delay:')) {
          crawlDelay = parseInt(trimmed.split(':')[1].trim())
        }
      }
      
      if (trimmed.startsWith('sitemap:')) {
        sitemapUrl = line.split(':', 2)[1].trim()
      }
    }
    
    return { allowed, crawlDelay, sitemapUrl }
  } catch (error) {
    // If we can't check robots.txt, assume allowed
    return { allowed: true }
  }
} 
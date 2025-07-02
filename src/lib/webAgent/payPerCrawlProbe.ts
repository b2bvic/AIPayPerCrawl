import { z } from 'zod'

// Schema for 402 probe response
export const ProbeResponseSchema = z.object({
  domain: z.string(),
  url: z.string(),
  status: z.number(),
  hasPayPerCrawl: z.boolean(),
  pricePerRequest: z.number().optional(),
  currency: z.string().optional(),
  headers: z.record(z.string()),
  isCloudflare: z.boolean(),
  responseTime: z.number(),
  probedAt: z.string(),
  error: z.string().optional(),
})

export type ProbeResponse = z.infer<typeof ProbeResponseSchema>

// Schema for batch probe request
export const BatchProbeRequestSchema = z.object({
  domains: z.array(z.string()),
  timeout: z.number().default(10000),
  userAgent: z.string().optional(),
  concurrency: z.number().default(10),
})

export type BatchProbeRequest = z.infer<typeof BatchProbeRequestSchema>

/**
 * Probe a single domain for Pay Per Crawl (402) responses
 */
export async function probeDomainFor402(
  domain: string, 
  timeout: number = 10000,
  userAgent: string = 'AIPayPerCrawl-Discovery/1.0'
): Promise<ProbeResponse> {
  const startTime = Date.now()
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const url = `https://${cleanDomain}`
  
  try {
    // Send HEAD request to check for 402 response
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': userAgent,
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeout),
    })

    const headers = Object.fromEntries(response.headers.entries())
    const responseTime = Date.now() - startTime

    // Check for Cloudflare indicators
    const isCloudflare = Boolean(
      headers['cf-ray'] || 
      headers['cf-cache-status'] ||
      headers['server']?.toLowerCase().includes('cloudflare')
    )

    // Check for Pay Per Crawl indicators
    const hasPayPerCrawl = response.status === 402 || Boolean(
      headers['x-pay-per-crawl'] ||
      headers['x-cloudflare-crawl-price'] ||
      headers['x-crawl-price'] ||
      headers['pay-per-crawl-price']
    )

    // Extract pricing information from headers
    let pricePerRequest: number | undefined
    let currency: string | undefined

    if (hasPayPerCrawl) {
      // Try different header formats for pricing
      const priceHeaders = [
        headers['x-cloudflare-crawl-price'],
        headers['x-crawl-price'],
        headers['pay-per-crawl-price'],
        headers['x-pay-per-crawl']
      ].filter(Boolean)

      for (const priceHeader of priceHeaders) {
        if (priceHeader) {
          // Parse price formats like "0.01 USD", "USD 0.01", "0.01", etc.
          const priceMatch = priceHeader.match(/(\d+\.?\d*)\s*(USD|EUR|GBP|usd|eur|gbp)?|([A-Z]{3})\s*(\d+\.?\d*)/i)
          if (priceMatch) {
            pricePerRequest = parseFloat(priceMatch[1] || priceMatch[4])
            currency = (priceMatch[2] || priceMatch[3] || 'USD').toUpperCase()
            break
          }
        }
      }
    }

    return {
      domain: cleanDomain,
      url,
      status: response.status,
      hasPayPerCrawl,
      pricePerRequest,
      currency,
      headers: {
        'cf-ray': headers['cf-ray'] || '',
        'server': headers['server'] || '',
        'x-pay-per-crawl': headers['x-pay-per-crawl'] || '',
        'x-cloudflare-crawl-price': headers['x-cloudflare-crawl-price'] || '',
        'x-crawl-price': headers['x-crawl-price'] || '',
        'pay-per-crawl-price': headers['pay-per-crawl-price'] || '',
      },
      isCloudflare,
      responseTime,
      probedAt: new Date().toISOString(),
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return {
      domain: cleanDomain,
      url,
      status: 0,
      hasPayPerCrawl: false,
      headers: {},
      isCloudflare: false,
      responseTime,
      probedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Batch probe multiple domains for Pay Per Crawl
 */
export async function batchProbeFor402(request: BatchProbeRequest): Promise<ProbeResponse[]> {
  const { domains, timeout, userAgent, concurrency } = request
  const results: ProbeResponse[] = []
  
  // Process domains in batches to respect concurrency limit
  for (let i = 0; i < domains.length; i += concurrency) {
    const batch = domains.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(
      batch.map(domain => probeDomainFor402(domain, timeout, userAgent))
    )
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
    })
  }
  
  return results
}

/**
 * Get top domains from various sources for probing
 */
export async function getTopDomainsForProbing(limit: number = 10000): Promise<string[]> {
  // This would typically integrate with services like:
  // - Tranco top sites list
  // - Cloudflare Radar top domains
  // - BuiltWith Cloudflare usage data
  
  // For now, return a sample of known high-traffic domains
  const sampleDomains = [
    'cnn.com',
    'bbc.com',
    'reuters.com',
    'nytimes.com',
    'wsj.com',
    'bloomberg.com',
    'techcrunch.com',
    'theverge.com',
    'arstechnica.com',
    'wired.com',
    'medium.com',
    'substack.com',
    'github.com',
    'stackoverflow.com',
    'reddit.com',
    'twitter.com',
    'linkedin.com',
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'youtube.com',
    'netflix.com',
    'spotify.com',
    'amazon.com',
    'shopify.com',
    'stripe.com',
    'paypal.com',
    'salesforce.com',
    'hubspot.com',
    'mailchimp.com',
    'zendesk.com'
  ]
  
  return sampleDomains.slice(0, Math.min(limit, sampleDomains.length))
}

/**
 * Continuous probing service to discover new Pay Per Crawl domains
 */
export class PayPerCrawlDiscoveryService {
  private isRunning = false
  private probeInterval = 60000 // 1 minute
  
  constructor(
    private onDomainDiscovered: (probe: ProbeResponse) => Promise<void>,
    private onError: (error: Error) => void = console.error
  ) {}
  
  async start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('Starting Pay Per Crawl discovery service...')
    
    while (this.isRunning) {
      try {
        await this.runProbeRound()
        await this.sleep(this.probeInterval)
      } catch (error) {
        this.onError(error instanceof Error ? error : new Error('Unknown probe error'))
        await this.sleep(this.probeInterval)
      }
    }
  }
  
  stop() {
    this.isRunning = false
    console.log('Stopping Pay Per Crawl discovery service...')
  }
  
  private async runProbeRound() {
    const domains = await getTopDomainsForProbing(100) // Probe 100 domains per round
    const probes = await batchProbeFor402({
      domains,
      timeout: 10000,
      concurrency: 10,
    })
    
    // Process results
    for (const probe of probes) {
      if (probe.hasPayPerCrawl) {
        console.log(`🎯 Found Pay Per Crawl domain: ${probe.domain} (${probe.pricePerRequest} ${probe.currency})`)
        await this.onDomainDiscovered(probe)
      }
    }
    
    console.log(`Probed ${domains.length} domains, found ${probes.filter(p => p.hasPayPerCrawl).length} with Pay Per Crawl`)
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Validate if a domain response indicates Pay Per Crawl
 */
export function isPayPerCrawlResponse(status: number, headers: Record<string, string>): boolean {
  return status === 402 || Boolean(
    headers['x-pay-per-crawl'] ||
    headers['x-cloudflare-crawl-price'] ||
    headers['x-crawl-price'] ||
    headers['pay-per-crawl-price']
  )
}

/**
 * Extract price information from Pay Per Crawl headers
 */
export function extractPriceFromHeaders(headers: Record<string, string>): {
  price?: number
  currency?: string
} {
  const priceHeaders = [
    headers['x-cloudflare-crawl-price'],
    headers['x-crawl-price'],
    headers['pay-per-crawl-price'],
    headers['x-pay-per-crawl']
  ].filter(Boolean)

  for (const priceHeader of priceHeaders) {
    if (priceHeader) {
      const priceMatch = priceHeader.match(/(\d+\.?\d*)\s*(USD|EUR|GBP|usd|eur|gbp)?|([A-Z]{3})\s*(\d+\.?\d*)/i)
      if (priceMatch) {
        return {
          price: parseFloat(priceMatch[1] || priceMatch[4]),
          currency: (priceMatch[2] || priceMatch[3] || 'USD').toUpperCase()
        }
      }
    }
  }

  return {}
} 
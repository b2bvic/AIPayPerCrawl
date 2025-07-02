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
 * Get top domains for probing using discovery engine
 */
export async function getTopDomainsForProbing(
  limit: number = 1000,
  config: {
    builtWithApiKey?: string
    sources?: ('builtwith' | 'tranco' | 'manual')[]
    filters?: {
      minTrafficRank?: number
      maxTrafficRank?: number
    }
  } = {}
): Promise<string[]> {
  try {
    // Use tech discovery to get Cloudflare domains
    const { discoverCloudflareZones } = await import('./techLookup')
    
    const domains = await discoverCloudflareZones({
      builtWithApiKey: config.builtWithApiKey,
      limit,
      sources: config.sources || ['tranco', 'manual'],
      filters: config.filters
    })
    
    console.log(`📊 Discovery engine found ${domains.length} Cloudflare domains for probing`)
    return domains
  } catch (error) {
    console.error('Error getting domains for probing:', error)
    
    // Fallback to curated list if discovery fails
    return [
      'discord.com', 'shopify.com', 'medium.com', 'zendesk.com', 'canva.com',
      'notion.so', 'figma.com', 'buffer.com', 'typeform.com', 'calendly.com',
      'intercom.com', 'mailchimp.com', 'dropbox.com', 'atlassian.com', 'hubspot.com',
      'crunchbase.com', 'producthunt.com', 'dev.to', 'hashnode.com', 'substack.com'
    ].slice(0, limit)
  }
}

/**
 * Enhanced Pay Per Crawl Discovery Service
 */
export class PayPerCrawlDiscoveryService {
  private isRunning = false
  private probeInterval = 300000 // 5 minutes default
  private discoveryConfig: {
    builtWithApiKey?: string
    sources?: ('builtwith' | 'tranco' | 'manual')[]
    domainsPerRound?: number
    filters?: {
      minTrafficRank?: number
      maxTrafficRank?: number
    }
  }
  private onDiscovery: (domains: ProbeResponse[]) => void = () => {}
  private onError: (error: Error) => void = console.error

  constructor(config: {
    builtWithApiKey?: string
    sources?: ('builtwith' | 'tranco' | 'manual')[]
    domainsPerRound?: number
    probeInterval?: number
    filters?: {
      minTrafficRank?: number
      maxTrafficRank?: number
    }
    onDiscovery?: (domains: ProbeResponse[]) => void
    onError?: (error: Error) => void
  } = {}) {
    this.discoveryConfig = {
      builtWithApiKey: config.builtWithApiKey,
      sources: config.sources || ['tranco', 'manual'],
      domainsPerRound: config.domainsPerRound || 100,
      filters: config.filters,
    }
    
    if (config.probeInterval) {
      this.probeInterval = config.probeInterval
    }
    
    if (config.onDiscovery) {
      this.onDiscovery = config.onDiscovery
    }
    
    if (config.onError) {
      this.onError = config.onError
    }
  }
  
  async start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('🚀 Starting Pay Per Crawl discovery service...')
    console.log(`📊 Configuration:`)
    console.log(`   • Sources: ${this.discoveryConfig.sources?.join(', ')}`)
    console.log(`   • Domains per round: ${this.discoveryConfig.domainsPerRound}`)
    console.log(`   • Probe interval: ${this.probeInterval / 1000}s`)
    console.log(`   • BuiltWith API: ${this.discoveryConfig.builtWithApiKey ? 'Enabled' : 'Disabled'}`)
    
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
    console.log('⏹️  Stopping Pay Per Crawl discovery service...')
  }
  
  private async runProbeRound() {
    console.log('🔍 Starting discovery round...')
    
    const domains = await getTopDomainsForProbing(
      this.discoveryConfig.domainsPerRound,
      {
        builtWithApiKey: this.discoveryConfig.builtWithApiKey,
        sources: this.discoveryConfig.sources,
        filters: this.discoveryConfig.filters
      }
    )
    
    if (domains.length === 0) {
      console.log('⚠️  No domains to probe in this round')
      return
    }
    
    console.log(`🔍 Probing ${domains.length} domains for Pay Per Crawl...`)
    
    const results = await batchProbeFor402({
      domains,
      timeout: 8000,
      concurrency: 10
    })
    
    const payPerCrawlDomains = results.filter(r => r.hasPayPerCrawl)
    const cloudflareCount = results.filter(r => r.isCloudflare).length
    const errorCount = results.filter(r => r.error).length
    
    console.log(`📊 Round complete:`)
    console.log(`   • Total probed: ${results.length}`)
    console.log(`   • Pay Per Crawl found: ${payPerCrawlDomains.length}`)
    console.log(`   • Cloudflare detected: ${cloudflareCount}`)
    console.log(`   • Errors: ${errorCount}`)
    
    if (payPerCrawlDomains.length > 0) {
      console.log('�� Discovered Pay Per Crawl domains:')
      payPerCrawlDomains.forEach(domain => {
        console.log(`   • ${domain.domain}: ${domain.pricePerRequest} ${domain.currency}`)
      })
      
      this.onDiscovery(payPerCrawlDomains)
    }
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
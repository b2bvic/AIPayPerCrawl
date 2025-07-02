import { z } from 'zod'

// Schema for tech lookup response
export const TechLookupResponseSchema = z.object({
  domain: z.string(),
  technologies: z.array(z.object({
    name: z.string(),
    category: z.string(),
    version: z.string().optional(),
    confidence: z.number(),
  })),
  isCloudflare: z.boolean(),
  cloudflareServices: z.array(z.string()).optional(),
  discoveredAt: z.string(),
})

export type TechLookupResponse = z.infer<typeof TechLookupResponseSchema>

// Schema for domain discovery request
export const DomainDiscoveryRequestSchema = z.object({
  technology: z.string().default('cloudflare'),
  limit: z.number().default(10000),
  sources: z.array(z.enum(['builtwith', 'tranco', 'cloudflare_radar', 'manual'])).default(['builtwith', 'tranco']),
  filters: z.object({
    minTrafficRank: z.number().optional(),
    maxTrafficRank: z.number().optional(),
    countries: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
  }).optional(),
})

export type DomainDiscoveryRequest = z.infer<typeof DomainDiscoveryRequestSchema>

/**
 * BuiltWith API integration for tech lookup
 */
export class BuiltWithService {
  private apiKey: string
  private baseUrl = 'https://api.builtwith.com'
  private rateLimitDelay = 100 // 100ms between requests

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Get domains using a specific technology
   */
  async getDomainsUsingTech(technology: string, limit: number = 10000): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v21/api.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          KEY: this.apiKey,
          LOOKUP: technology,
          HIDETEXT: 'yes',
          HIDEDL: 'yes',
          NOMETA: 'yes',
          NOATTR: 'yes',
          LIMIT: Math.min(limit, 50000), // BuiltWith max limit
        }),
      })

      if (!response.ok) {
        throw new Error(`BuiltWith API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.Errors && data.Errors.length > 0) {
        throw new Error(`BuiltWith API errors: ${data.Errors.join(', ')}`)
      }

      // Extract domains from response
      const domains: string[] = []
      if (data.Results && Array.isArray(data.Results)) {
        for (const result of data.Results) {
          if (result.Result && result.Result.Paths) {
            for (const path of result.Result.Paths) {
              if (path.Domain) {
                domains.push(path.Domain)
              }
            }
          }
        }
      }

      return domains.slice(0, limit)
    } catch (error) {
      console.error('BuiltWith API error:', error)
      return []
    }
  }

  /**
   * Get technology details for a specific domain
   */
  async getTechForDomain(domain: string): Promise<TechLookupResponse> {
    try {
      await this.sleep(this.rateLimitDelay) // Rate limiting

      const response = await fetch(`${this.baseUrl}/v20/api.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          KEY: this.apiKey,
          LOOKUP: domain,
          HIDETEXT: 'yes',
          HIDEDL: 'yes',
        }),
      })

      if (!response.ok) {
        throw new Error(`BuiltWith API error: ${response.status}`)
      }

      const data = await response.json()

      const technologies: TechLookupResponse['technologies'] = []
      let isCloudflare = false
      const cloudflareServices: string[] = []

      if (data.Results && data.Results[0] && data.Results[0].Result && data.Results[0].Result.Paths) {
        const paths = data.Results[0].Result.Paths
        
        for (const path of paths) {
          if (path.Technologies) {
            for (const tech of path.Technologies) {
              technologies.push({
                name: tech.Name || '',
                category: tech.Tag || '',
                version: tech.Version || undefined,
                confidence: 0.8, // BuiltWith generally has high confidence
              })

              // Check for Cloudflare technologies
              if (tech.Name && tech.Name.toLowerCase().includes('cloudflare')) {
                isCloudflare = true
                cloudflareServices.push(tech.Name)
              }
            }
          }
        }
      }

      return {
        domain,
        technologies,
        isCloudflare,
        cloudflareServices: cloudflareServices.length > 0 ? cloudflareServices : undefined,
        discoveredAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`Tech lookup error for ${domain}:`, error)
      return {
        domain,
        technologies: [],
        isCloudflare: false,
        discoveredAt: new Date().toISOString(),
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Tranco List Service for top domain discovery
 */
export class TrancoService {
  private baseUrl = 'https://tranco-list.eu'
  private cacheKey = 'tranco:list'
  private cacheTtl = 86400 // 24 hours

  /**
   * Get top domains from Tranco list
   */
  async getTopDomains(limit: number = 10000): Promise<string[]> {
    try {
      // Try to get cached list first
      const cachedList = await this.getCachedList()
      if (cachedList) {
        return cachedList.slice(0, limit)
      }

      // Fetch latest list
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`${this.baseUrl}/download_daily/${today}/1000000`, {
        headers: {
          'User-Agent': 'AIPayPerCrawl-Discovery/1.0',
        },
      })

      if (!response.ok) {
        throw new Error(`Tranco API error: ${response.status}`)
      }

      const csvData = await response.text()
      const domains = this.parseTrancoCSV(csvData)
      
      // Cache the result
      await this.cacheList(domains)
      
      return domains.slice(0, limit)
    } catch (error) {
      console.error('Tranco API error:', error)
      // Fallback to cached list if available
      const cachedList = await this.getCachedList()
      return cachedList ? cachedList.slice(0, limit) : []
    }
  }

  /**
   * Get domains with rank range
   */
  async getDomainsInRankRange(minRank: number, maxRank: number): Promise<Array<{ domain: string; rank: number }>> {
    const allDomains = await this.getTopDomains(maxRank)
    return allDomains
      .slice(minRank - 1, maxRank)
      .map((domain, index) => ({
        domain,
        rank: minRank + index,
      }))
  }

  private parseTrancoCSV(csvData: string): string[] {
    const lines = csvData.split('\n')
    const domains: string[] = []
    
    for (const line of lines) {
      if (line.trim()) {
        const [rank, domain] = line.split(',')
        if (domain && domain.trim()) {
          domains.push(domain.trim())
        }
      }
    }
    
    return domains
  }

  private async getCachedList(): Promise<string[] | null> {
    // This would integrate with your caching system (Redis, KV, etc.)
    // For now, return null to always fetch fresh data
    return null
  }

  private async cacheList(domains: string[]): Promise<void> {
    // This would cache the domains list
    // Implementation depends on your caching system
  }
}

/**
 * Main Discovery Engine that combines multiple sources
 */
export class TechDiscoveryEngine {
  private builtWith?: BuiltWithService
  private tranco: TrancoService
  private rateLimitDelay = 200 // 200ms between probes

  constructor(config: {
    builtWithApiKey?: string
  }) {
    if (config.builtWithApiKey) {
      this.builtWith = new BuiltWithService(config.builtWithApiKey)
    }
    this.tranco = new TrancoService()
  }

  /**
   * Discover domains using specific technology (e.g., Cloudflare)
   */
  async discoverDomains(request: DomainDiscoveryRequest): Promise<string[]> {
    const { technology, limit, sources, filters } = request
    const discoveredDomains = new Set<string>()

    // 1. BuiltWith discovery
    if (sources.includes('builtwith') && this.builtWith) {
      console.log(`🔍 Discovering ${technology} domains via BuiltWith...`)
      const builtWithDomains = await this.builtWith.getDomainsUsingTech(technology, Math.min(limit, 10000))
      builtWithDomains.forEach(domain => discoveredDomains.add(domain))
      console.log(`📊 BuiltWith found ${builtWithDomains.length} domains`)
    }

    // 2. Tranco top domains (then filter by tech)
    if (sources.includes('tranco')) {
      console.log(`🔍 Getting top domains from Tranco for tech filtering...`)
      const trancoLimit = Math.min(filters?.maxTrafficRank || 50000, 100000)
      const trancoDomains = await this.tranco.getTopDomains(trancoLimit)
      
      // Sample a subset for tech checking (to avoid rate limits)
      const sampleSize = Math.min(1000, trancoDomains.length)
      const sampledDomains = this.sampleArray(trancoDomains, sampleSize)
      
      console.log(`🔬 Tech-checking ${sampledDomains.length} domains from Tranco...`)
      const techFilteredDomains = await this.filterDomainsByTech(sampledDomains, technology)
      techFilteredDomains.forEach(domain => discoveredDomains.add(domain))
      console.log(`📊 Tranco filtering found ${techFilteredDomains.length} ${technology} domains`)
    }

    // 3. Manual/curated list
    if (sources.includes('manual')) {
      const manualDomains = this.getManualCloudflareList()
      manualDomains.forEach(domain => discoveredDomains.add(domain))
      console.log(`📊 Manual list added ${manualDomains.length} domains`)
    }

    // Apply additional filters
    let filteredDomains = Array.from(discoveredDomains)
    
    if (filters?.minTrafficRank || filters?.maxTrafficRank) {
      // This would require cross-referencing with traffic data
      // For now, just return the discovered domains
    }

    return filteredDomains.slice(0, limit)
  }

  /**
   * Filter domains by technology using tech lookup
   */
  private async filterDomainsByTech(domains: string[], technology: string): Promise<string[]> {
    const filtered: string[] = []
    const batchSize = 50 // Process in batches to avoid overwhelming APIs

    for (let i = 0; i < domains.length; i += batchSize) {
      const batch = domains.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(
        batch.map(domain => this.checkDomainTech(domain, technology))
      )

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          filtered.push(batch[index])
        }
      })

      // Rate limiting between batches
      if (i + batchSize < domains.length) {
        await this.sleep(this.rateLimitDelay * batchSize)
      }
    }

    return filtered
  }

  /**
   * Check if a domain uses specific technology
   */
  private async checkDomainTech(domain: string, technology: string): Promise<boolean> {
    try {
      // Use direct probe for Cloudflare (faster than API)
      if (technology.toLowerCase() === 'cloudflare') {
        return await this.isCloudflareDirectProbe(domain)
      }

      // Fallback to BuiltWith API
      if (this.builtWith) {
        const techData = await this.builtWith.getTechForDomain(domain)
        return techData.isCloudflare
      }

      return false
    } catch (error) {
      return false
    }
  }

  /**
   * Fast Cloudflare detection via HEAD request
   */
  private async isCloudflareDirectProbe(domain: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'AIPayPerCrawl-Discovery/1.0',
        },
      })

      const headers = Object.fromEntries(response.headers.entries())
      return Boolean(
        headers['cf-ray'] || 
        headers['cf-cache-status'] ||
        headers['server']?.toLowerCase().includes('cloudflare')
      )
    } catch (error) {
      return false
    }
  }

  /**
   * Curated list of known Cloudflare domains
   */
  private getManualCloudflareList(): string[] {
    return [
      'discord.com',
      'shopify.com',
      'medium.com',
      'zendesk.com',
      'canva.com',
      'notion.so',
      'figma.com',
      'buffer.com',
      'typeform.com',
      'calendly.com',
      'intercom.com',
      'mailchimp.com',
      'dropbox.com',
      'atlassian.com',
      'hubspot.com',
      'crunchbase.com',
      'producthunt.com',
      'dev.to',
      'hashnode.com',
      'substack.com',
      'gitbook.com',
      'replit.com',
      'vercel.com',
      'netlify.com',
      'railway.app',
    ]
  }

  /**
   * Sample array elements randomly
   */
  private sampleArray<T>(array: T[], size: number): T[] {
    if (size >= array.length) return array
    
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, size)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Discovery wrapper function for easy integration
 */
export async function discoverCloudflareZones(
  config: {
    builtWithApiKey?: string
    limit?: number
    sources?: ('builtwith' | 'tranco' | 'manual')[]
    filters?: {
      minTrafficRank?: number
      maxTrafficRank?: number
    }
  } = {}
): Promise<string[]> {
  const engine = new TechDiscoveryEngine({
    builtWithApiKey: config.builtWithApiKey,
  })

  return engine.discoverDomains({
    technology: 'cloudflare',
    limit: config.limit || 10000,
    sources: config.sources || ['tranco', 'manual'],
    filters: config.filters,
  })
} 
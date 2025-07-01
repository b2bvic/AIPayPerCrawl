import { z } from 'zod'

// Schema for domain verification response
export const DomainVerificationSchema = z.object({
  domain: z.string(),
  isCloudflare: z.boolean(),
  hasPayPerCrawl: z.boolean(),
  headers: z.record(z.string()).optional(),
  certificateIssuer: z.string().optional(),
  ipAddress: z.string().optional(),
  verifiedAt: z.string(),
})

export type DomainVerification = z.infer<typeof DomainVerificationSchema>

/**
 * Verify if a domain is using Cloudflare and has Pay Per Crawl enabled
 */
export async function verifyDomain(domain: string): Promise<DomainVerification> {
  try {
    // Clean the domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
    
    // Check DNS and HTTP headers
    const response = await fetch(`https://${cleanDomain}`, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    const headers = Object.fromEntries(response.headers.entries())
    
    // Check for Cloudflare indicators
    const isCloudflare = Boolean(
      headers['cf-ray'] || 
      headers['cf-cache-status'] ||
      headers['server']?.toLowerCase().includes('cloudflare')
    )

    // Check for Pay Per Crawl headers
    const hasPayPerCrawl = Boolean(
      headers['x-robots-tag']?.includes('googlebot: crawl-delay') ||
      headers['x-pay-per-crawl'] ||
      headers['x-cloudflare-crawl-price']
    )

    return {
      domain: cleanDomain,
      isCloudflare,
      hasPayPerCrawl,
      headers: {
        server: headers['server'] || '',
        'cf-ray': headers['cf-ray'] || '',
        'x-robots-tag': headers['x-robots-tag'] || '',
      },
      verifiedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Domain verification failed:', error)
    return {
      domain,
      isCloudflare: false,
      hasPayPerCrawl: false,
      verifiedAt: new Date().toISOString(),
    }
  }
}

/**
 * Batch verify multiple domains
 */
export async function verifyDomains(domains: string[]): Promise<DomainVerification[]> {
  const results = await Promise.allSettled(
    domains.map(domain => verifyDomain(domain))
  )

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    return {
      domain: domains[index],
      isCloudflare: false,
      hasPayPerCrawl: false,
      verifiedAt: new Date().toISOString(),
    }
  })
}

/**
 * Get real-time domain traffic and ranking data
 */
export async function getDomainMetrics(domain: string) {
  try {
    // In production, this would integrate with APIs like:
    // - Cloudflare Analytics API
    // - SimilarWeb API
    // - Alexa/Tranco rankings
    
    // For now, we'll structure the response format
    return {
      domain,
      metrics: {
        monthlyVisits: null,
        globalRank: null,
        countryRank: null,
        bounceRate: null,
        avgVisitDuration: null,
        category: null,
      },
      source: 'pending_integration',
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to fetch domain metrics:', error)
    return null
  }
} 
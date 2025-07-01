import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  getMarketInsightsCached, 
  getCompetitivePricing,
  MarketInsight 
} from '@/lib/webAgent'

const enhancedQuoteSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(1000),
  includeMarketAnalysis: z.boolean().optional().default(false),
  vertical: z.string().optional(),
})

// Enhanced domain pricing with market intelligence
interface EnhancedDomainPricing {
  basePrice: number
  marketInsight?: MarketInsight
  adjustedPrice: number
  confidence: 'high' | 'medium' | 'low'
  lastUpdated: Date
}

// Mock enhanced pricing data - would be replaced with database + web search
const enhancedDomainPricing: Record<string, EnhancedDomainPricing> = {
  'example.com': {
    basePrice: 0.001,
    adjustedPrice: 0.001,
    confidence: 'high',
    lastUpdated: new Date(),
  },
  'news-site.com': {
    basePrice: 0.002,
    adjustedPrice: 0.002,
    confidence: 'high',
    lastUpdated: new Date(),
  },
  'ecommerce-store.com': {
    basePrice: 0.0015,
    adjustedPrice: 0.0015,
    confidence: 'high',
    lastUpdated: new Date(),
  },
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }
}

function calculateBulkDiscount(urlCount: number): number {
  if (urlCount >= 10000) return 0.2 // 20% discount
  if (urlCount >= 1000) return 0.15 // 15% discount
  if (urlCount >= 100) return 0.1 // 10% discount
  if (urlCount >= 10) return 0.05 // 5% discount
  return 0 // No discount
}

/**
 * Apply market-based pricing adjustments
 */
function applyMarketAdjustments(
  basePrice: number, 
  marketInsight: MarketInsight
): { adjustedPrice: number; confidence: 'high' | 'medium' | 'low' } {
  let adjustedPrice = basePrice
  let confidence: 'high' | 'medium' | 'low' = 'medium'

  // Adjust based on market trend
  switch (marketInsight.marketTrend) {
    case 'rising':
      adjustedPrice = basePrice * 1.1 // 10% increase for rising markets
      confidence = 'high'
      break
    case 'declining':
      adjustedPrice = basePrice * 0.9 // 10% decrease for declining markets
      confidence = 'high'
      break
    case 'stable':
      adjustedPrice = basePrice
      confidence = 'high'
      break
  }

  // Adjust based on competitor count (more competition = lower prices)
  if (marketInsight.competitorCount > 10) {
    adjustedPrice *= 0.95 // 5% decrease for high competition
    confidence = 'high'
  } else if (marketInsight.competitorCount < 3) {
    adjustedPrice *= 1.05 // 5% increase for low competition
    confidence = 'medium'
  }

  // Ensure price stays within reasonable bounds
  adjustedPrice = Math.max(adjustedPrice, basePrice * 0.5) // No more than 50% decrease
  adjustedPrice = Math.min(adjustedPrice, basePrice * 2.0) // No more than 100% increase

  return { adjustedPrice, confidence }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, includeMarketAnalysis, vertical } = enhancedQuoteSchema.parse(body)

    // Group URLs by domain
    const urlsByDomain: Record<string, string[]> = {}
    const unsupportedDomains: string[] = []

    for (const url of urls) {
      const domain = extractDomain(url)
      
      if (!(domain in enhancedDomainPricing)) {
        if (!unsupportedDomains.includes(domain)) {
          unsupportedDomains.push(domain)
        }
        continue
      }

      if (!urlsByDomain[domain]) {
        urlsByDomain[domain] = []
      }
      urlsByDomain[domain].push(url)
    }

    // Check if we have any supported URLs
    const supportedUrls = Object.values(urlsByDomain).flat()
    if (supportedUrls.length === 0) {
      return NextResponse.json({
        error: 'No supported domains found',
        unsupportedDomains,
        supportedDomains: Object.keys(enhancedDomainPricing),
      }, { status: 400 })
    }

    // Enhance pricing with market intelligence if requested
    const enhancedPricing: Record<string, EnhancedDomainPricing> = { ...enhancedDomainPricing }
    
    if (includeMarketAnalysis) {
      console.log('[Enhanced Quote] Fetching market insights for domains...')
      
      // Fetch market insights for each domain
      const marketInsightsPromises = Object.keys(urlsByDomain).map(async (domain) => {
        try {
          const marketInsight = await getMarketInsightsCached(domain)
          const { adjustedPrice, confidence } = applyMarketAdjustments(
            enhancedPricing[domain].basePrice,
            marketInsight
          )
          
          enhancedPricing[domain] = {
            ...enhancedPricing[domain],
            marketInsight,
            adjustedPrice,
            confidence,
            lastUpdated: new Date()
          }
          
          return { domain, success: true }
        } catch (error) {
          console.error(`Failed to get market insights for ${domain}:`, error)
          return { domain, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })

      const marketResults = await Promise.allSettled(marketInsightsPromises)
      console.log('[Enhanced Quote] Market insights results:', marketResults)
    }

    // Get competitive pricing analysis for the vertical
    let competitivePricing = null
    if (includeMarketAnalysis && vertical) {
      try {
        competitivePricing = await getCompetitivePricing(vertical)
        console.log('[Enhanced Quote] Competitive pricing analysis:', competitivePricing)
      } catch (error) {
        console.error('Failed to get competitive pricing:', error)
      }
    }

    // Calculate pricing breakdown with enhanced data
    const breakdown = Object.entries(urlsByDomain).map(([domain, domainUrls]) => {
      const pricing = enhancedPricing[domain]
      const pricePerRequest = includeMarketAnalysis ? pricing.adjustedPrice : pricing.basePrice
      const baseTotal = domainUrls.length * pricePerRequest
      const discount = calculateBulkDiscount(domainUrls.length)
      const discountAmount = baseTotal * discount
      const totalCost = baseTotal - discountAmount

      return {
        domain,
        urls: domainUrls,
        urlCount: domainUrls.length,
        pricePerRequest,
        baseTotal,
        discount: discount * 100, // Convert to percentage
        discountAmount,
        totalCost,
        // Enhanced fields
        ...(includeMarketAnalysis && {
          marketData: {
            basePricePerRequest: pricing.basePrice,
            adjustedPricePerRequest: pricing.adjustedPrice,
            priceAdjustment: ((pricing.adjustedPrice - pricing.basePrice) / pricing.basePrice) * 100,
            confidence: pricing.confidence,
            marketInsight: pricing.marketInsight,
            lastUpdated: pricing.lastUpdated,
          }
        })
      }
    })

    // Calculate overall totals
    const totalUrls = supportedUrls.length
    const baseTotal = breakdown.reduce((sum, item) => sum + item.baseTotal, 0)
    const totalDiscountAmount = breakdown.reduce((sum, item) => sum + item.discountAmount, 0)
    const totalCost = breakdown.reduce((sum, item) => sum + item.totalCost, 0)
    const overallDiscount = totalUrls > 0 ? (totalDiscountAmount / baseTotal) * 100 : 0

    // Generate enhanced quote
    const quote = {
      quoteId: `enhanced_quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      urls: supportedUrls,
      totalUrls,
      baseTotal: Math.round(baseTotal * 1000000) / 1000000,
      totalDiscountAmount: Math.round(totalDiscountAmount * 1000000) / 1000000,
      totalCost: Math.round(totalCost * 1000000) / 1000000,
      overallDiscount: Math.round(overallDiscount * 100) / 100,
      currency: 'USD',
      breakdown,
      enhanced: includeMarketAnalysis,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      createdAt: new Date().toISOString(),
      
      // Enhanced quote features
      ...(includeMarketAnalysis && {
        marketAnalysis: {
          enabled: true,
          competitivePricing,
          overallConfidence: calculateOverallConfidence(breakdown),
          recommendations: generatePricingRecommendations(breakdown, competitivePricing),
        }
      }),
      
      ...(unsupportedDomains.length > 0 && {
        warnings: {
          unsupportedDomains,
          message: `${unsupportedDomains.length} domains are not supported and were excluded from the quote.`,
        },
      }),
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error generating enhanced quote:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 })
    }

    if (error instanceof Error && error.message.startsWith('Invalid URL:')) {
      return NextResponse.json({
        error: error.message,
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to generate enhanced quote with market analysis',
    }, { status: 500 })
  }
}

/**
 * Calculate overall confidence score for the quote
 */
function calculateOverallConfidence(breakdown: any[]): 'high' | 'medium' | 'low' {
  const confidenceScores = breakdown
    .filter(item => item.marketData?.confidence)
    .map(item => {
      switch (item.marketData.confidence) {
        case 'high': return 3
        case 'medium': return 2
        case 'low': return 1
        default: return 1
      }
    })

  if (confidenceScores.length === 0) return 'low'

  const averageScore = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length

  if (averageScore >= 2.5) return 'high'
  if (averageScore >= 1.5) return 'medium'
  return 'low'
}

/**
 * Generate pricing recommendations based on market analysis
 */
function generatePricingRecommendations(breakdown: any[], competitivePricing: any): string[] {
  const recommendations: string[] = []

  // Analyze price adjustments
  const adjustments = breakdown
    .filter(item => item.marketData?.priceAdjustment)
    .map(item => item.marketData.priceAdjustment)

  if (adjustments.length > 0) {
    const avgAdjustment = adjustments.reduce((sum, adj) => sum + adj, 0) / adjustments.length
    
    if (avgAdjustment > 5) {
      recommendations.push('Prices are currently above market average due to high demand. Consider bulk purchases for better rates.')
    } else if (avgAdjustment < -5) {
      recommendations.push('You\'re getting below-market pricing. This is an excellent time to increase your crawling volume.')
    } else {
      recommendations.push('Pricing is well-aligned with current market conditions.')
    }
  }

  // Competitive analysis recommendations
  if (competitivePricing) {
    switch (competitivePricing.marketPosition) {
      case 'low':
        recommendations.push('Our pricing is highly competitive compared to market alternatives.')
        break
      case 'premium':
        recommendations.push('Our pricing reflects premium service quality and reliability.')
        break
      case 'competitive':
        recommendations.push('Our pricing is competitive with similar service providers.')
        break
    }
  }

  // Volume recommendations
  const totalUrls = breakdown.reduce((sum, item) => sum + item.urlCount, 0)
  if (totalUrls < 100) {
    recommendations.push('Consider batching more URLs together to qualify for bulk discounts.')
  }

  return recommendations
}
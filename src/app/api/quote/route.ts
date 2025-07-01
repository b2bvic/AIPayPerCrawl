import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const quoteSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(1000),
})

// Mock domain pricing - will be replaced with database queries
const domainPricing = {
  'example.com': 0.001,
  'news-site.com': 0.002,
  'ecommerce-store.com': 0.0015,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = quoteSchema.parse(body)

    // Group URLs by domain
    const urlsByDomain: Record<string, string[]> = {}
    const unsupportedDomains: string[] = []

    for (const url of urls) {
      const domain = extractDomain(url)
      
      if (!(domain in domainPricing)) {
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
        supportedDomains: Object.keys(domainPricing),
      }, { status: 400 })
    }

    // Calculate pricing breakdown
    const breakdown = Object.entries(urlsByDomain).map(([domain, domainUrls]) => {
      const pricePerRequest = domainPricing[domain as keyof typeof domainPricing]
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
      }
    })

    // Calculate overall totals
    const totalUrls = supportedUrls.length
    const baseTotal = breakdown.reduce((sum, item) => sum + item.baseTotal, 0)
    const totalDiscountAmount = breakdown.reduce((sum, item) => sum + item.discountAmount, 0)
    const totalCost = breakdown.reduce((sum, item) => sum + item.totalCost, 0)
    const overallDiscount = totalUrls > 0 ? (totalDiscountAmount / baseTotal) * 100 : 0

    // Generate quote
    const quote = {
      quoteId: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      urls: supportedUrls,
      totalUrls,
      baseTotal: Math.round(baseTotal * 1000000) / 1000000, // Round to 6 decimal places
      totalDiscountAmount: Math.round(totalDiscountAmount * 1000000) / 1000000,
      totalCost: Math.round(totalCost * 1000000) / 1000000,
      overallDiscount: Math.round(overallDiscount * 100) / 100,
      currency: 'USD',
      breakdown,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      createdAt: new Date().toISOString(),
      ...(unsupportedDomains.length > 0 && {
        warnings: {
          unsupportedDomains,
          message: `${unsupportedDomains.length} domains are not supported and were excluded from the quote.`,
        },
      }),
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error generating quote:', error)
    
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
    }, { status: 500 })
  }
}

// GET endpoint to retrieve quote by ID (for future implementation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const quoteId = searchParams.get('id')

  if (!quoteId) {
    return NextResponse.json({
      error: 'Quote ID is required',
    }, { status: 400 })
  }

  // TODO: Implement quote retrieval from database/cache
  return NextResponse.json({
    error: 'Quote not found or expired',
  }, { status: 404 })
} 
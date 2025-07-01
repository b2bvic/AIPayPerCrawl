import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'

// Mock domain pricing data - in production this would come from the database
const domainPricing: Record<string, { pricePerRequest: number; currency: string }> = {
  'example.com': { pricePerRequest: 0.001, currency: 'USD' },
  'news-site.com': { pricePerRequest: 0.002, currency: 'USD' },
  'ecommerce-store.com': { pricePerRequest: 0.0015, currency: 'USD' },
}

const quoteRequestSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(1000),
  callbackUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
})

interface QuoteItem {
  url: string
  domain: string
  pricePerRequest: number
  currency: string
  available: boolean
  error?: string
}

interface QuoteResponse {
  quoteId: string
  totalCost: number
  currency: string
  items: QuoteItem[]
  expiresAt: string
  createdAt: string
  paymentUrl?: string
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }
}

function generateQuoteId(): string {
  return `quote_${crypto.randomBytes(16).toString('hex')}`
}

function generateSignedToken(url: string, quoteId: string): string {
  // In production, this would be properly signed with a secret key
  const payload = {
    url,
    quoteId,
    timestamp: Date.now(),
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, callbackUrl, metadata } = quoteRequestSchema.parse(body)

    const quoteId = generateQuoteId()
    const items: QuoteItem[] = []
    let totalCost = 0

    // Process each URL
    for (const url of urls) {
      try {
        const domain = extractDomain(url)
        const pricing = domainPricing[domain]

        if (!pricing) {
          items.push({
            url,
            domain,
            pricePerRequest: 0,
            currency: 'USD',
            available: false,
            error: 'Domain not found in Pay Per Crawl directory'
          })
          continue
        }

        items.push({
          url,
          domain,
          pricePerRequest: pricing.pricePerRequest,
          currency: pricing.currency,
          available: true,
        })

        totalCost += pricing.pricePerRequest
      } catch (error) {
        items.push({
          url,
          domain: '',
          pricePerRequest: 0,
          currency: 'USD',
          available: false,
          error: error instanceof Error ? error.message : 'Invalid URL'
        })
      }
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    const createdAt = new Date().toISOString()

    const response: QuoteResponse = {
      quoteId,
      totalCost: Number(totalCost.toFixed(6)),
      currency: 'USD',
      items,
      expiresAt,
      createdAt,
    }

    // Add payment URL if there are available items
    const availableItems = items.filter(item => item.available)
    if (availableItems.length > 0 && totalCost > 0) {
      response.paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkout?quoteId=${quoteId}`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating quote:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const quoteId = searchParams.get('quoteId')

  if (!quoteId) {
    return NextResponse.json(
      { error: 'Quote ID is required' },
      { status: 400 }
    )
  }

  // In production, retrieve from database
  // For now, return a mock response
  return NextResponse.json({
    error: 'Quote not found or expired'
  }, { status: 404 })
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 
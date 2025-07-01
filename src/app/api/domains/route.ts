import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock data for now - will be replaced with database queries
const mockDomains = [
  {
    id: '1',
    domain: 'example.com',
    isCloudflare: true,
    hasPayPerCrawl: true,
    pricePerRequest: 0.001,
    currency: 'USD',
    status: 'active',
    traffic: 1000000,
    vertical: 'Technology',
    cpm: 2.50,
    claimStatus: 'verified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    domain: 'news-site.com',
    isCloudflare: true,
    hasPayPerCrawl: true,
    pricePerRequest: 0.002,
    currency: 'USD',
    status: 'active',
    traffic: 500000,
    vertical: 'News',
    cpm: 3.25,
    claimStatus: 'claimed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    domain: 'ecommerce-store.com',
    isCloudflare: true,
    hasPayPerCrawl: true,
    pricePerRequest: 0.0015,
    currency: 'USD',
    status: 'active',
    traffic: 750000,
    vertical: 'E-commerce',
    cpm: 4.10,
    claimStatus: 'unclaimed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const searchSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional(),
  vertical: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minTraffic: z.string().optional(),
  maxTraffic: z.string().optional(),
  sortBy: z.enum(['price', 'traffic', 'cpm', 'domain']).optional().default('traffic'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const {
      page,
      limit,
      search,
      vertical,
      minPrice,
      maxPrice,
      minTraffic,
      maxTraffic,
      sortBy,
      sortOrder,
    } = searchSchema.parse(params)

    let filteredDomains = [...mockDomains]

    // Apply filters
    if (search) {
      filteredDomains = filteredDomains.filter(domain =>
        domain.domain.toLowerCase().includes(search.toLowerCase()) ||
        domain.vertical?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (vertical) {
      filteredDomains = filteredDomains.filter(domain =>
        domain.vertical?.toLowerCase() === vertical.toLowerCase()
      )
    }

    if (minPrice) {
      filteredDomains = filteredDomains.filter(domain =>
        domain.pricePerRequest >= parseFloat(minPrice)
      )
    }

    if (maxPrice) {
      filteredDomains = filteredDomains.filter(domain =>
        domain.pricePerRequest <= parseFloat(maxPrice)
      )
    }

    if (minTraffic) {
      filteredDomains = filteredDomains.filter(domain =>
        (domain.traffic || 0) >= parseInt(minTraffic)
      )
    }

    if (maxTraffic) {
      filteredDomains = filteredDomains.filter(domain =>
        (domain.traffic || 0) <= parseInt(maxTraffic)
      )
    }

    // Apply sorting
    filteredDomains.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortBy) {
        case 'price':
          aValue = a.pricePerRequest
          bValue = b.pricePerRequest
          break
        case 'traffic':
          aValue = a.traffic || 0
          bValue = b.traffic || 0
          break
        case 'cpm':
          aValue = a.cpm || 0
          bValue = b.cpm || 0
          break
        case 'domain':
          aValue = a.domain
          bValue = b.domain
          break
        default:
          aValue = a.traffic || 0
          bValue = b.traffic || 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    // Apply pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedDomains = filteredDomains.slice(startIndex, endIndex)

    const response = {
      domains: paginatedDomains,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredDomains.length,
        totalPages: Math.ceil(filteredDomains.length / limitNum),
        hasNext: endIndex < filteredDomains.length,
        hasPrev: pageNum > 1,
      },
      filters: {
        verticals: [...new Set(mockDomains.map(d => d.vertical).filter(Boolean))],
        priceRange: {
          min: Math.min(...mockDomains.map(d => d.pricePerRequest)),
          max: Math.max(...mockDomains.map(d => d.pricePerRequest)),
        },
        trafficRange: {
          min: Math.min(...mockDomains.map(d => d.traffic || 0)),
          max: Math.max(...mockDomains.map(d => d.traffic || 0)),
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
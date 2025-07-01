'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  ArrowUpDown,
  ExternalLink,
  Verified,
  Clock,
  Star,
  Users,
  Calendar,
  Activity,
  Shield,
  Zap,
  ChevronRight,
  ChevronLeft,
  Eye,
  Heart,
  Share2
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { clsx } from 'clsx'

interface Domain {
  id: string
  domain: string
  isCloudflare: boolean
  hasPayPerCrawl: boolean
  pricePerRequest: number
  currency: string
  status: string
  traffic?: number
  vertical?: string
  cpm?: number
  claimStatus: string
  createdAt: string
  updatedAt: string
  description?: string
  tags?: string[]
  rating?: number
  reviews?: number
  lastCrawled?: string
  dataQuality?: number
  responseTime?: number
  uptime?: number
}

interface DomainsResponse {
  domains: Domain[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: {
    verticals: string[]
    priceRange: { min: number; max: number }
    trafficRange: { min: number; max: number }
  }
}

function DomainCard({ domain }: { domain: Domain }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getStatusBadge = (claimStatus: string) => {
    switch (claimStatus) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
            <Verified className="h-3 w-3" />
            Verified
          </span>
        )
      case 'claimed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            <Clock className="h-3 w-3" />
            Claimed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            Unclaimed
          </span>
        )
    }
  }

  const getVerticalColor = (vertical?: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'E-commerce': 'bg-purple-100 text-purple-800',
      'Media': 'bg-orange-100 text-orange-800',
      'Education': 'bg-indigo-100 text-indigo-800',
    }
    return colors[vertical as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:shadow-md hover:ring-black/10">
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {domain.domain}
              </h3>
              {domain.isCloudflare && (
                <Shield className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(domain.claimStatus)}
              {domain.vertical && (
                <span className={clsx(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getVerticalColor(domain.vertical)
                )}>
                  {domain.vertical}
                </span>
              )}
            </div>
            {domain.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {domain.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Heart className={clsx(
              'h-4 w-4 transition-colors',
              isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            )} />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(domain.pricePerRequest, domain.currency)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Per Request</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {domain.traffic ? formatNumber(domain.traffic) : 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Monthly Traffic</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {domain.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{domain.rating}</span>
                {domain.reviews && (
                  <span>({domain.reviews})</span>
                )}
              </div>
            )}
            {domain.uptime && (
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-green-500" />
                <span>{domain.uptime}% uptime</span>
              </div>
            )}
          </div>
          {domain.responseTime && (
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>{domain.responseTime}ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {domain.tags && domain.tags.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1">
            {domain.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
              >
                {tag}
              </span>
            ))}
            {domain.tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-full">
                +{domain.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto p-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Eye className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              View Details
            </Button>
            <Button>
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedDomains({ domains }: { domains: Domain[] }) {
  const featuredDomains = domains.filter(d => d.claimStatus === 'verified').slice(0, 3)
  
  if (featuredDomains.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Domains</h2>
          <p className="text-gray-600 mt-1">Top verified domains with proven performance</p>
        </div>
        <Button variant="outline">
          View All Featured
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredDomains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  )
}

function Pagination({ pagination }: { pagination: DomainsResponse['pagination'] }) {
  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          disabled={!pagination.hasPrev}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!pagination.hasNext}
          className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              disabled={!pagination.hasPrev}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1
              const isCurrentPage = pageNum === pagination.page
              return isCurrentPage ? (
                <Button
                  key={pageNum}
                  variant="solid"
                  color="blue"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold z-10"
                >
                  {pageNum}
                </Button>
              ) : (
                <Button
                  key={pageNum}
                  variant="outline"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {pageNum}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              disabled={!pagination.hasNext}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default function DomainListingPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVertical, setSelectedVertical] = useState('')
  const [sortBy, setSortBy] = useState('traffic')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState<DomainsResponse['pagination'] | null>(null)
  const [filters, setFilters] = useState<DomainsResponse['filters'] | null>(null)

  const fetchDomains = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: searchTerm,
        vertical: selectedVertical,
        sortBy,
        sortOrder,
        limit: '12', // Show more domains per page in grid view
      })

      const response = await fetch(`/api/domains?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch domains')
      }

      const data: DomainsResponse = await response.json()
      setDomains(data.domains)
      setPagination(data.pagination)
      setFilters(data.filters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [searchTerm, selectedVertical, sortBy, sortOrder])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading domains...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchDomains}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <LogoWithText />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/directory" className="text-gray-600 hover:text-gray-900 transition-colors">
                Directory
              </Link>
              <Link href="/api-docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                API Docs
              </Link>
              <Link href="/learn" className="text-gray-600 hover:text-gray-900 transition-colors">
                Learn
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" href="/auth/signin">
                Sign In
              </Button>
              <Button href="/auth/signup">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/directory" className="hover:text-gray-700">Directory</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">Domain Listings</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Domain Listings
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse our comprehensive directory of domains with Pay Per Crawl enabled. Find the perfect data sources for your AI applications with detailed metrics and verified information.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Vertical Filter */}
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Verticals</option>
              {filters?.verticals.map((vertical) => (
                <option key={vertical} value={vertical}>
                  {vertical}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="traffic">Sort by Traffic</option>
              <option value="price">Sort by Price</option>
              <option value="cpm">Sort by CPM</option>
              <option value="domain">Sort by Domain</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {pagination?.total || 0} domains found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'px-3 py-1 text-sm font-medium transition-colors',
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'px-3 py-1 text-sm font-medium transition-colors',
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Domains */}
        <FeaturedDomains domains={domains} />

        {/* All Domains */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Domains</h2>
          {domains.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No domains found matching your criteria.</p>
            </div>
          ) : (
            <div className={clsx(
              'grid gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            )}>
              {domains.map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && <Pagination pagination={pagination} />}
      </main>
    </div>
  )
} 
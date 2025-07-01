'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  ArrowUpDown,
  ExternalLink,
  Verified,
  Clock
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

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

export default function DirectoryPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVertical, setSelectedVertical] = useState('')
  const [sortBy, setSortBy] = useState('traffic')
  const [sortOrder, setSortOrder] = useState('desc')
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

  const getStatusBadge = (claimStatus: string) => {
    switch (claimStatus) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-900/30">
            <Verified className="h-3 w-3" />
            Verified
          </span>
        )
      case 'claimed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
            <Clock className="h-3 w-3" />
            Claimed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full dark:text-gray-300 dark:bg-gray-900/30">
            Unclaimed
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <LogoWithText />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/api-docs" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                API Docs
              </Link>
              <Link href="/learn" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Learn
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Pay Per Crawl Directory
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Discover domains with Cloudflare Pay Per Crawl enabled. Filter by vertical, pricing, and traffic to find the perfect data sources for your AI applications.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Vertical Filter */}
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="traffic">Sort by Traffic</option>
              <option value="price">Sort by Price</option>
              <option value="cpm">Sort by CPM</option>
              <option value="domain">Sort by Domain</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading domains...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            <Button onClick={fetchDomains} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-300">
                Showing {domains.length} of {pagination?.total || 0} domains
              </p>
            </div>

            {/* Domain Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {domain.domain}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                    {getStatusBadge(domain.claimStatus)}
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Price per request</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {formatCurrency(domain.pricePerRequest)}
                      </span>
                    </div>
                    
                    {domain.traffic && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Monthly traffic</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatNumber(domain.traffic)}
                        </span>
                      </div>
                    )}

                    {domain.cpm && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-300">CPM</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatCurrency(domain.cpm)}
                        </span>
                      </div>
                    )}

                    {domain.vertical && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Vertical</span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
                          {domain.vertical}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" href={`/directory/${domain.id}`}>
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Get Quote
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    disabled={!pagination.hasPrev}
                    onClick={() => {/* TODO: Implement pagination */}}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-slate-600 dark:text-slate-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    disabled={!pagination.hasNext}
                    onClick={() => {/* TODO: Implement pagination */}}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
} 
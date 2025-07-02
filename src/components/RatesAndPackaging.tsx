'use client'

import React, { useState, useEffect } from 'react'
import { 
  Calculator, 
  TrendingUp, 
  Globe, 
  Filter, 
  ArrowUpDown,
  DollarSign,
  FileText,
  Archive,
  Map,
  Building2,
  Zap,
  Shield,
  Clock,
  Search,
  ExternalLink,
  Info
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { TrafficMetrics } from '@/components/TrafficMetrics'

interface Domain {
  id: string
  domain: string
  pricePerRequest: number
  currency: string
  traffic?: number
  vertical?: string
  cpm?: number
  status: string
  isCloudflare: boolean
  hasPayPerCrawl: boolean
}

interface CrawlScenario {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  estimatedPages: number
  exampleCost: number
}

interface TierTableFilters {
  vertical: string
  minCPM: number
  maxCPM: number
  minTraffic: number
  maxTraffic: number
  sortBy: 'cpm' | 'vertical' | 'traffic' | 'domain' | 'price'
  sortOrder: 'asc' | 'desc'
}

export function RatesAndPackaging() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TierTableFilters>({
    vertical: '',
    minCPM: 0,
    maxCPM: 100,
    minTraffic: 0,
    maxTraffic: 100000000,
    sortBy: 'cpm',
    sortOrder: 'asc'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScenario, setSelectedScenario] = useState<string>('homepage')

  // Crawling scenarios with estimated costs
  const crawlScenarios: CrawlScenario[] = [
    {
      name: 'Home Page Only',
      description: 'Single page crawl for quick content sampling',
      icon: FileText,
      estimatedPages: 1,
      exampleCost: 0.002
    },
    {
      name: 'Article Archives',
      description: 'Blog posts, news articles, and content archives',
      icon: Archive,
      estimatedPages: 50,
      exampleCost: 0.1
    },
    {
      name: 'Category Pages',
      description: 'Product categories, topic sections, and navigation pages',
      icon: Building2,
      estimatedPages: 25,
      exampleCost: 0.05
    },
    {
      name: 'Full Sitemap',
      description: 'Complete site crawl including all discoverable pages',
      icon: Map,
      estimatedPages: 500,
      exampleCost: 1.0
    }
  ]

  // Fetch domains data
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          search: searchTerm,
          vertical: filters.vertical,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          limit: '50'
        })

        const response = await fetch(`/api/domains?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch domains')
        }

        const data = await response.json()
        setDomains(data.domains || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDomains()
  }, [searchTerm, filters])

  // Filter and sort domains
  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         domain.vertical?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVertical = !filters.vertical || domain.vertical === filters.vertical
    const matchesCPM = !domain.cpm || (domain.cpm >= filters.minCPM && domain.cpm <= filters.maxCPM)
    const matchesTraffic = !domain.traffic || (domain.traffic >= filters.minTraffic && domain.traffic <= filters.maxTraffic)
    
    return matchesSearch && matchesVertical && matchesCPM && matchesTraffic
  })

  // Get unique verticals for filter
  const availableVerticals = [...new Set(domains.map(d => d.vertical).filter(Boolean))]

  // Calculate cost estimate for selected scenario
  const calculateScenarioCost = (domain: Domain, scenario: CrawlScenario) => {
    return domain.pricePerRequest * scenario.estimatedPages
  }

  // Get average costs by vertical
  const getVerticalStats = () => {
    const verticalStats: Record<string, { count: number; avgCPM: number; avgPrice: number; avgTraffic: number }> = {}
    
    domains.forEach(domain => {
      if (domain.vertical) {
        if (!verticalStats[domain.vertical]) {
          verticalStats[domain.vertical] = { count: 0, avgCPM: 0, avgPrice: 0, avgTraffic: 0 }
        }
        verticalStats[domain.vertical].count++
        verticalStats[domain.vertical].avgCPM += domain.cpm || 0
        verticalStats[domain.vertical].avgPrice += domain.pricePerRequest
        verticalStats[domain.vertical].avgTraffic += domain.traffic || 0
      }
    })

    // Calculate averages
    Object.keys(verticalStats).forEach(vertical => {
      const stats = verticalStats[vertical]
      stats.avgCPM = stats.avgCPM / stats.count
      stats.avgPrice = stats.avgPrice / stats.count
      stats.avgTraffic = stats.avgTraffic / stats.count
    })

    return verticalStats
  }

  const verticalStats = getVerticalStats()

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cost Calculator Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Cost Calculator
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Estimate costs for common crawling scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {crawlScenarios.map((scenario) => {
              const Icon = scenario.icon
              return (
                <div
                  key={scenario.name}
                  onClick={() => setSelectedScenario(scenario.name)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedScenario === scenario.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${
                      selectedScenario === scenario.name ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <span className="text-sm font-medium text-slate-500">
                      ~{scenario.estimatedPages} pages
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {scenario.description}
                  </p>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(scenario.exampleCost)}
                  </div>
                  <div className="text-sm text-slate-500">
                    avg. cost
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Pricing Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white">Base Rates</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Minimum per request</span>
                    <span className="font-medium">$0.0001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Average per request</span>
                    <span className="font-medium">$0.002</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Premium per request</span>
                    <span className="font-medium">$0.01</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white">Volume Discounts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">1K - 10K requests</span>
                    <span className="font-medium">0% discount</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">10K - 100K requests</span>
                    <span className="font-medium">5% discount</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">100K+ requests</span>
                    <span className="font-medium">10% discount</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white">Additional Fees</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Processing fee</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Setup fee</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">API access</span>
                    <span className="font-medium">Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tier Table Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Domain Tier Table
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Compare domains by CPM, vertical, and traffic size
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filters.vertical}
                onChange={(e) => setFilters(prev => ({ ...prev, vertical: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Verticals</option>
                {availableVerticals.map(vertical => (
                  <option key={vertical} value={vertical}>{vertical}</option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="cpm">Sort by CPM</option>
                <option value="vertical">Sort by Vertical</option>
                <option value="traffic">Sort by Traffic</option>
                <option value="domain">Sort by Domain</option>
                <option value="price">Sort by Price</option>
              </select>

              <button
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                }))}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <ArrowUpDown className="h-4 w-4" />
                {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>

            {/* Vertical Stats */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                Market Overview by Vertical
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(verticalStats).slice(0, 5).map(([vertical, stats]) => (
                  <div key={vertical} className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{vertical}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Avg CPM: {formatCurrency(stats.avgCPM)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stats.count} domains
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Loading domains...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Domain
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Vertical
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Price/Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        CPM
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Traffic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        Est. Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredDomains.slice(0, 20).map((domain) => {
                      const selectedScenarioData = crawlScenarios.find(s => s.name === selectedScenario)
                      const estimatedCost = selectedScenarioData ? calculateScenarioCost(domain, selectedScenarioData) : 0

                      return (
                        <tr key={domain.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {domain.domain}
                                </div>
                                {domain.isCloudflare && (
                                  <div className="text-xs text-orange-600 dark:text-orange-400">
                                    Cloudflare
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {domain.vertical ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
                                {domain.vertical}
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                            {formatCurrency(domain.pricePerRequest)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                            {domain.cpm ? formatCurrency(domain.cpm) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                            {domain.traffic ? formatNumber(domain.traffic) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {formatCurrency(estimatedCost)}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              for {selectedScenario}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {filteredDomains.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-slate-600 dark:text-slate-300">
                      No domains found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredDomains.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Available Domains
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(
                  filteredDomains.reduce((sum, d) => sum + d.pricePerRequest, 0) / filteredDomains.length || 0
                )}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Avg Price/Request
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(
                  filteredDomains.reduce((sum, d) => sum + (d.cpm || 0), 0) / filteredDomains.filter(d => d.cpm).length || 0
                )}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Avg CPM
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Object.keys(verticalStats).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Verticals
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 
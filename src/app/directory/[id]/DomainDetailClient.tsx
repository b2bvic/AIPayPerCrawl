'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import TrafficMetrics from '@/components/TrafficMetrics'
import { 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Clock,
  Verified,
  ExternalLink,
  BarChart3,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle,
  Copy,
  Activity,
  Target,
  Code,
  Play
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
  traffic: number
  vertical: string
  category: string
  cpm: number
  claimStatus: string
  createdAt: string
  updatedAt: string
  rank?: number
}

interface CrawlHistory {
  id: string
  timestamp: string
  status: 'success' | 'failed' | 'timeout'
  pages: number
  cost: number
  duration: number
}

interface ApiUsage {
  requests: number
  cost: number
  date: string
}

interface DomainDetailClientProps {
  id: string
}

export default function DomainDetailClient({ id }: DomainDetailClientProps) {
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'pricing' | 'history' | 'analytics'>('overview')
  const [crawlHistory, setCrawlHistory] = useState<CrawlHistory[]>([])
  const [apiUsage, setApiUsage] = useState<ApiUsage[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchDomain = async () => {
      try {
        setLoading(true)
        
        // Try to find the domain by ID first
        const response = await fetch(`https://5debb506.aipaypercrawl.pages.dev/api/domains?limit=100`)
        const result = await response.json()
        
        if (result.success && result.domains) {
          const foundDomain = result.domains.find((d: Domain) => d.id === id)
          if (foundDomain) {
            setDomain(foundDomain)
            
            // Load additional data
            await Promise.all([
              loadCrawlHistory(foundDomain.domain),
              loadApiUsage(foundDomain.domain)
            ])
          } else {
            setError('Domain not found')
          }
        } else {
          setError('Domain not found')
        }
      } catch (err) {
        console.error('Error fetching domain:', err)
        setError('Failed to load domain data')
      } finally {
        setLoading(false)
      }
    }

    fetchDomain()
  }, [id])

  const loadCrawlHistory = async (domainName: string) => {
    try {
      // Mock crawl history data - replace with real API call
      const mockHistory: CrawlHistory[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          pages: 25,
          cost: 0.025,
          duration: 45
        },
        {
          id: '2', 
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          pages: 18,
          cost: 0.018,
          duration: 32
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'failed',
          pages: 0,
          cost: 0,
          duration: 15
        }
      ]
      setCrawlHistory(mockHistory)
    } catch (err) {
      console.error('Error loading crawl history:', err)
    }
  }

  const loadApiUsage = async (domainName: string) => {
    try {
      // Mock API usage data - replace with real API call
      const mockUsage: ApiUsage[] = [
        { requests: 145, cost: 0.145, date: new Date().toISOString().split('T')[0] },
        { requests: 89, cost: 0.089, date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { requests: 203, cost: 0.203, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      ]
      setApiUsage(mockUsage)
    } catch (err) {
      console.error('Error loading API usage:', err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (claimStatus: string) => {
    switch (claimStatus) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-900/30">
            <Verified className="h-4 w-4" />
            Verified Publisher
          </span>
        )
      case 'claimed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
            <Clock className="h-4 w-4" />
            Claimed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full dark:text-gray-300 dark:bg-gray-900/30">
            Unclaimed
          </span>
        )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'timeout':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-100 dark:bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !domain) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Domain Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {error || 'The requested domain could not be found in our directory.'}
            </p>
            <Button href="/directory">
              Browse Directory
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'api', label: 'API Access', icon: Code },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'history', label: 'Crawl History', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-1 text-slate-400">/</span>
                <Link href="/directory" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  Directory
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-1 text-slate-400">/</span>
                <span className="text-slate-900 dark:text-white">{domain.domain}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Domain Header */}
        <Card className="p-8 mb-8">
          <header className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {domain.domain}
                  <a 
                    href={`https://${domain.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
                  {domain.vertical} • Rank #{domain.rank?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
            {getStatusBadge(domain.claimStatus)}
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(domain.pricePerRequest)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Price per Request
              </div>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatNumber(domain.traffic)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Monthly Visits
              </div>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(domain.cpm)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                CPM
              </div>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {domain.isCloudflare ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Cloudflare Protected
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1" href={`/api/quote?domain=${domain.domain}`}>
              <Zap className="h-4 w-4 mr-2" />
              Get Quote & Start Crawling
            </Button>
            <Button variant="outline" className="flex-1" href="/api-docs">
              <FileText className="h-4 w-4 mr-2" />
              API Documentation
            </Button>
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(`curl -X POST "https://api.aipaypercrawl.com/crawl" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '{"domain":"${domain.domain}","pages":10}'`)}
            >
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy API Call'}
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Domain Overview
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Status</span>
                        <div className="font-medium text-slate-900 dark:text-white capitalize">
                          {domain.status}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Category</span>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {domain.category}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Added</span>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {new Date(domain.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Last Updated</span>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {new Date(domain.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Traffic Analysis
                  </h2>
                  <TrafficMetrics 
                    domain={domain.domain}
                    trafficData={{
                      estimatedMonthlyVisits: domain.traffic,
                      globalRank: domain.rank,
                      confidence: 'high',
                      dataSource: 'SimilarWeb'
                    }}
                    showDetails={true}
                  />
                </Card>
              </>
            )}

            {activeTab === 'api' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  API Access Configuration
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Base URL</h3>
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg font-mono text-sm">
                      https://api.aipaypercrawl.com
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Example Request</h3>
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div>curl -X POST "https://api.aipaypercrawl.com/crawl" \</div>
                      <div>  -H "Authorization: Bearer YOUR_API_KEY" \</div>
                      <div>  -H "Content-Type: application/json" \</div>
                      <div>  -d '{`{`}</div>
                      <div>    "domain": "{domain.domain}",</div>
                      <div>    "pages": 10,</div>
                      <div>    "format": "json"</div>
                      <div>  {`}`}'</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Rate Limits</h3>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Maximum 100 requests per minute</li>
                      <li>• Maximum 1000 pages per request</li>
                      <li>• Respect robots.txt directives</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'pricing' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Pricing Calculator
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(domain.pricePerRequest * 10)}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">10 pages</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(domain.pricePerRequest * 100)}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">100 pages</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(domain.pricePerRequest * 1000)}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">1,000 pages</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Volume Discounts</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      <p>• 10% discount for 10,000+ pages per month</p>
                      <p>• 20% discount for 100,000+ pages per month</p>
                      <p>• Custom enterprise pricing for 1M+ pages</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'history' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Recent Crawl History
                </h2>
                <div className="space-y-4">
                  {crawlHistory.map((crawl) => (
                    <div key={crawl.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(crawl.status)}
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {new Date(crawl.timestamp).toLocaleString()}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            {crawl.pages} pages • {crawl.duration}s duration
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {formatCurrency(crawl.cost)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                          {crawl.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'analytics' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Usage Analytics
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-3">Daily API Usage</h3>
                    <div className="space-y-3">
                      {apiUsage.map((usage, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {new Date(usage.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                              {usage.requests} requests
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {formatCurrency(usage.cost)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {apiUsage.reduce((sum, usage) => sum + usage.requests, 0)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Total Requests</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(apiUsage.reduce((sum, usage) => sum + usage.cost, 0))}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Total Cost</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" href={`/api/crawl?domain=${domain.domain}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Crawl
                </Button>
                <Button variant="outline" className="w-full justify-start" href={`/api/quote?domain=${domain.domain}`}>
                  <Target className="h-4 w-4 mr-2" />
                  Get Quote
                </Button>
                <Button variant="outline" className="w-full justify-start" href="/api-docs">
                  <FileText className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </div>
            </Card>

            {/* Domain Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Domain Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Availability</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Avg Response</span>
                  <span className="font-medium text-slate-900 dark:text-white">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Success Rate</span>
                  <span className="font-medium text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Last Crawl</span>
                  <span className="font-medium text-slate-900 dark:text-white">2h ago</span>
                </div>
              </div>
            </Card>

            {/* Similar Domains */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Similar in {domain.vertical}
              </h3>
              <div className="space-y-3">
                <Link href="/directory/domain_news1" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="font-medium text-slate-900 dark:text-white">news-site.com</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">{formatCurrency(0.002)} per request</div>
                </Link>
                <Link href="/directory/domain_tech1" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="font-medium text-slate-900 dark:text-white">tech-blog.com</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">{formatCurrency(0.0008)} per request</div>
                </Link>
                <Link href="/directory" className="block text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
                  View all {domain.vertical} domains →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 
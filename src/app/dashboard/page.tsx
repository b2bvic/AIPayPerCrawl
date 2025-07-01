'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Download,
  Search,
  Filter,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

// Mock data - in production this would come from your database
const mockPublisher = {
  id: 'pub_123',
  name: 'John Publisher',
  email: 'john@example.com',
  totalRevenue: 1245.67,
  totalRequests: 15432,
  domainsCount: 3,
  isVerified: true,
}

const mockDomains = [
  {
    id: '1',
    domain: 'example.com',
    status: 'active',
    claimStatus: 'verified',
    pricePerRequest: 0.001,
    revenue: 856.43,
    requests: 8564,
    lastActivity: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    domain: 'myblog.com',
    status: 'active', 
    claimStatus: 'claimed',
    pricePerRequest: 0.0015,
    revenue: 245.78,
    requests: 1639,
    lastActivity: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    domain: 'newsite.com',
    status: 'pending',
    claimStatus: 'pending',
    pricePerRequest: 0.002,
    revenue: 0,
    requests: 0,
    lastActivity: null,
  }
]

export default function PublisherDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'analytics' | 'settings'>('overview')

  const getStatusBadge = (status: string, claimStatus: string) => {
    if (claimStatus === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-900/30">
          <CheckCircle className="h-3 w-3" />
          Verified
        </span>
      )
    }
    if (claimStatus === 'claimed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
          <Clock className="h-3 w-3" />
          Pending Verification
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-300 dark:bg-yellow-900/30">
        <AlertCircle className="h-3 w-3" />
        Pending Claim
      </span>
    )
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
              <Link href="/directory" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Directory
              </Link>
              <Link href="/api-docs" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                API Docs
              </Link>
              <Link href="/learn" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Learn
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Welcome, {mockPublisher.name}
              </div>
              <Button variant="outline" href="/auth/signout">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Publisher Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your domains, track revenue, and monitor crawl activity.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'domains', label: 'Domains', icon: Globe },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(mockPublisher.totalRevenue)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Total Revenue
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatNumber(mockPublisher.totalRequests)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Total Requests
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mockPublisher.domainsCount}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Active Domains
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(mockPublisher.totalRevenue / mockPublisher.totalRequests)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Avg Revenue/Request
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Domain Performance
              </h2>
              <div className="space-y-4">
                {mockDomains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Globe className="h-5 w-5 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{domain.domain}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          {formatCurrency(domain.pricePerRequest)} per request
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {formatCurrency(domain.revenue)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          {formatNumber(domain.requests)} requests
                        </div>
                      </div>
                      {getStatusBadge(domain.status, domain.claimStatus)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="space-y-6">
            {/* Domain Management Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Domain Management
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Claim domains, set pricing, and manage crawl access.
                </p>
              </div>
              <Button href="/dashboard/claim-domain">
                <Plus className="h-4 w-4 mr-2" />
                Claim Domain
              </Button>
            </div>

            {/* Domains List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search domains..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {mockDomains.map((domain) => (
                  <div key={domain.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Globe className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {domain.domain}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-300">
                            <span>Price: {formatCurrency(domain.pricePerRequest)}</span>
                            <span>•</span>
                            <span>Revenue: {formatCurrency(domain.revenue)}</span>
                            <span>•</span>
                            <span>Requests: {formatNumber(domain.requests)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(domain.status, domain.claimStatus)}
                        <Button variant="outline" href={`/dashboard/domains/${domain.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" href={`/dashboard/domains/${domain.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Analytics & Insights
              </h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  We're building comprehensive analytics including revenue trends, 
                  request patterns, and performance metrics.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Account Settings
            </h2>

            {/* Account Info */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue={mockPublisher.name}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={mockPublisher.email}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Payment Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Payment Settings
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Connect your Stripe account to receive payments from crawl requests.
              </p>
              <Button>
                Connect Stripe Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
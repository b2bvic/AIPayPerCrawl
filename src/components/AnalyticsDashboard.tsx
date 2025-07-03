'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Download,
  Calendar,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  paidRequests: number
  blockedRequests: number
  averageRequestValue: number
  dailyRevenue: Array<{
    date: string
    revenue: number
    requests: number
  }>
  topBuyers: Array<{
    email: string
    company: string
    totalSpent: number
    requestCount: number
    averageRequestValue: number
  }>
  recentActivity: Array<{
    id: string
    type: 'paid' | 'blocked'
    buyer: string
    amount?: number
    domain: string
    timestamp: string
    reason?: string
  }>
}

const mockAnalyticsData: AnalyticsData = {
  totalRevenue: 1245.67,
  paidRequests: 15432,
  blockedRequests: 3421,
  averageRequestValue: 0.00807,
  dailyRevenue: [
    { date: '2024-01-01', revenue: 45.23, requests: 523 },
    { date: '2024-01-02', revenue: 67.89, requests: 678 },
    { date: '2024-01-03', revenue: 123.45, requests: 1234 },
    { date: '2024-01-04', revenue: 89.12, requests: 891 },
    { date: '2024-01-05', revenue: 156.78, requests: 1567 },
    { date: '2024-01-06', revenue: 234.56, requests: 2345 },
    { date: '2024-01-07', revenue: 198.43, requests: 1984 },
  ],
  topBuyers: [
    {
      email: 'ai-team@openai.com',
      company: 'OpenAI',
      totalSpent: 345.67,
      requestCount: 4567,
      averageRequestValue: 0.0756,
    },
    {
      email: 'research@anthropic.com',
      company: 'Anthropic',
      totalSpent: 234.89,
      requestCount: 3234,
      averageRequestValue: 0.0726,
    },
    {
      email: 'data@google.com',
      company: 'Google',
      totalSpent: 189.45,
      requestCount: 2567,
      averageRequestValue: 0.0738,
    },
    {
      email: 'ml@meta.com',
      company: 'Meta',
      totalSpent: 167.23,
      requestCount: 2123,
      averageRequestValue: 0.0788,
    },
    {
      email: 'research@microsoft.com',
      company: 'Microsoft',
      totalSpent: 145.12,
      requestCount: 1876,
      averageRequestValue: 0.0774,
    },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'paid',
      buyer: 'ai-team@openai.com',
      amount: 12.34,
      domain: 'example.com',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'blocked',
      buyer: 'unknown@suspicious.com',
      domain: 'example.com',
      timestamp: '2024-01-15T10:25:00Z',
      reason: 'Invalid API key',
    },
    {
      id: '3',
      type: 'paid',
      buyer: 'research@anthropic.com',
      amount: 8.76,
      domain: 'myblog.com',
      timestamp: '2024-01-15T10:20:00Z',
    },
    {
      id: '4',
      type: 'blocked',
      buyer: 'bot@scraper.net',
      domain: 'example.com',
      timestamp: '2024-01-15T10:15:00Z',
      reason: 'Insufficient payment',
    },
    {
      id: '5',
      type: 'paid',
      buyer: 'data@google.com',
      amount: 15.67,
      domain: 'newsite.com',
      timestamp: '2024-01-15T10:10:00Z',
    },
  ],
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7d')
  const [data] = useState(mockAnalyticsData)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Track revenue, requests, and buyer activity across your domains.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(data.totalRevenue)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatNumber(data.paidRequests)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Paid Requests
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatNumber(data.blockedRequests)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Blocked Requests
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(data.averageRequestValue)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Avg Request Value
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Daily Revenue Trend
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <BarChart3 className="h-4 w-4" />
              Revenue per Day
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {data.dailyRevenue.map((day, index) => {
              const maxRevenue = Math.max(...data.dailyRevenue.map(d => d.revenue))
              const widthPercentage = (day.revenue / maxRevenue) * 100
              
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-slate-600 dark:text-slate-300">
                    {formatDate(day.date)}
                  </div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${widthPercentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className="w-20 text-sm text-slate-600 dark:text-slate-300 text-right">
                    {formatNumber(day.requests)} req
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Buyers */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Top Buyers
              </h3>
              <Users className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {data.topBuyers.map((buyer, index) => (
                <div key={buyer.email} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {buyer.company}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {buyer.email}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatNumber(buyer.requestCount)} requests • {formatCurrency(buyer.averageRequestValue)} avg
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(buyer.totalSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <Eye className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-3">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'paid' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {activity.type === 'paid' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {activity.type === 'paid' ? 'Paid Request' : 'Blocked Request'}
                      </span>
                      {activity.amount && (
                        <span className="text-green-600 font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {activity.buyer} • {activity.domain}
                    </div>
                    {activity.reason && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {activity.reason}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDateTime(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Blocked Requests Details */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Blocked Requests Analysis
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {formatNumber(data.blockedRequests)}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Total Blocked
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                68%
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Invalid API Keys
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                32%
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                Insufficient Payment
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-slate-900 dark:text-white">
                Protection Impact
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your protection system has blocked {formatNumber(data.blockedRequests)} unauthorized requests, 
              preventing an estimated {formatCurrency(data.blockedRequests * 0.002)} in potential revenue loss 
              from unpaid access attempts.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  CreditCard, 
  Download, 
  Plus, 
  Trash2,
  CheckCircle,
  Calendar,
  Receipt,
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

// Mock user data
const mockUser = {
  name: 'John Publisher',
  email: 'john@example.com',
  isPublisher: true,
}

// Mock billing data
const mockBillingData = {
  balance: 1245.67,
  pendingPayout: 856.43,
  nextPayoutDate: '2024-02-01',
  stripeConnected: true,
  paymentMethods: [
    {
      id: '1',
      type: 'bank_account',
      last4: '4242',
      bank: 'Chase Bank',
      isDefault: true,
    },
  ],
  invoices: [
    {
      id: 'inv_123',
      date: '2024-01-15',
      amount: 245.78,
      status: 'paid',
      description: 'Crawl revenue payout',
      downloadUrl: '#',
    },
    {
      id: 'inv_122',
      date: '2024-01-01',
      amount: 610.65,
      status: 'paid',
      description: 'Crawl revenue payout',
      downloadUrl: '#',
    },
    {
      id: 'inv_121',
      date: '2023-12-15',
      amount: 389.24,
      status: 'paid',
      description: 'Crawl revenue payout',
      downloadUrl: '#',
    },
  ],
  revenueHistory: [
    { month: 'Jan 2024', revenue: 1245.67, requests: 15432 },
    { month: 'Dec 2023', revenue: 1089.45, requests: 13567 },
    { month: 'Nov 2023', revenue: 956.78, requests: 11234 },
    { month: 'Oct 2023', revenue: 834.56, requests: 9876 },
  ],
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'invoices' | 'settings'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'settings', label: 'Settings' },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30', icon: CheckCircle },
      pending: { color: 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30', icon: Calendar },
      failed: { color: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30', icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header user={mockUser} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing & Payments</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Manage your earnings, payouts, and payment methods
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Available Balance</h3>
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(mockBillingData.balance)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Ready for payout
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Earnings</h3>
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(mockBillingData.pendingPayout)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Next payout: {new Date(mockBillingData.nextPayoutDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Lifetime</h3>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(mockBillingData.revenueHistory.reduce((sum, item) => sum + item.revenue, 0))}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  All time earnings
                </p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Revenue Overview
              </h3>
              <div className="space-y-4">
                {mockBillingData.revenueHistory.map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.month}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.revenue / 1500) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {formatNumber(item.requests)} requests
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Stripe Connected
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Your Stripe account is connected and ready to receive payouts.
              </p>
              <div className="flex gap-3">
                <Button href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                  View Stripe Dashboard
                </Button>
                <Button variant="outline">
                  Update Payout Schedule
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-6">
            {/* Payout Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Payout Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Payout Frequency</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">How often you receive payouts</p>
                  </div>
                  <select className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <option>Monthly</option>
                    <option>Bi-weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Minimum Payout</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Minimum balance required for payout</p>
                  </div>
                  <select className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <option>$10</option>
                    <option>$50</option>
                    <option>$100</option>
                    <option>$500</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recent Payouts */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Payouts</h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {mockBillingData.invoices.map((invoice) => (
                  <div key={invoice.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {invoice.description}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(invoice.amount)}
                      </span>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Invoices</h3>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {mockBillingData.invoices.map((invoice) => (
                  <div key={invoice.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Receipt className="h-8 w-8 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Invoice #{invoice.id}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {invoice.description} • {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(invoice.amount)}
                        </span>
                        {getStatusBadge(invoice.status)}
                        <Button variant="outline" className="p-2">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Payment Methods
                </h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </div>

              <div className="space-y-3">
                {mockBillingData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {method.bank} ••••{method.last4}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Bank Account
                        </p>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <Button variant="outline" className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Tax Information
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Tax forms will be automatically generated and sent to your email address at the end of each tax year.
              </p>
              <Button variant="outline">
                Update Tax Information
              </Button>
            </div>

            {/* Billing Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Billing Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Payout notifications</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Monthly revenue reports</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Tax document reminders</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
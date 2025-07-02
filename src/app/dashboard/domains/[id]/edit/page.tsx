// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Domain Settings - AI Pay Per Crawl Dashboard',
  description: 'Edit pricing, access controls, and other settings for your domain in the AI Pay Per Crawl dashboard.',
}

interface EditDomainPageProps {
  params: {
    id: string
  }
}

export default function EditDomainPage({ params }: EditDomainPageProps) {
  if (!params.id) {
    notFound()
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
              <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 font-medium">
                Dashboard
              </Link>
              <Link href="/directory" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Directory
              </Link>
              <Link href="/api-docs" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                API Docs
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" href="/auth/signout">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300">
                Dashboard
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/dashboard/domains/${params.id}`} className="hover:text-slate-700 dark:hover:text-slate-300">
                Domain {params.id}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900 dark:text-white font-medium">
              Edit Settings
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Edit Domain Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Configure pricing, access controls, and other settings for domain ID: {params.id}
          </p>
        </div>

        {/* Settings Form */}
        <Card className="p-8">
          <form className="space-y-8">
            {/* Basic Settings */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Basic Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="domain-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    id="domain-name"
                    name="domain-name"
                    value={`example-domain-${params.id}.com`}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Domain name cannot be changed after verification
                  </p>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Settings */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Pricing Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="base-price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Base Price per Request (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 dark:text-slate-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="base-price"
                      name="base-price"
                      step="0.01"
                      min="0.01"
                      defaultValue="0.05"
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="premium-price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Premium Content Price (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 dark:text-slate-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="premium-price"
                      name="premium-price"
                      step="0.01"
                      min="0.01"
                      defaultValue="0.10"
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Access Controls */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Access Controls
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="allow-openai"
                    name="allow-openai"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="allow-openai" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Allow OpenAI crawlers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="allow-anthropic"
                    name="allow-anthropic"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="allow-anthropic" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Allow Anthropic crawlers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="allow-google"
                    name="allow-google"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="allow-google" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Allow Google AI crawlers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="require-payment"
                    name="require-payment"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="require-payment" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Require payment for all crawl requests
                  </label>
                </div>
              </div>
            </div>

            {/* Rate Limiting */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Rate Limiting
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="max-requests-per-hour" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Requests per Hour
                  </label>
                  <input
                    type="number"
                    id="max-requests-per-hour"
                    name="max-requests-per-hour"
                    min="1"
                    defaultValue="100"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="max-requests-per-day" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Requests per Day
                  </label>
                  <input
                    type="number"
                    id="max-requests-per-day"
                    name="max-requests-per-day"
                    min="1"
                    defaultValue="1000"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" href={`/dashboard/domains/${params.id}`}>
                Cancel
              </Button>
              <div className="flex items-center space-x-4">
                <Button variant="outline" type="button">
                  Save as Draft
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
} 
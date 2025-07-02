// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Domain Details - AI Pay Per Crawl Dashboard',
  description: 'View detailed analytics and manage settings for your domain in the AI Pay Per Crawl dashboard.',
}

interface DomainPageProps {
  params: {
    id: string
  }
}

export default function DomainPage({ params }: DomainPageProps) {
  // In a real implementation, you would fetch domain data based on params.id
  // For now, we'll show a placeholder with the ID
  
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

      <main className="max-w-7xl mx-auto px-6 py-12">
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
              <Link href="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300">
                Domains
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900 dark:text-white font-medium">
              Domain {params.id}
            </li>
          </ol>
        </nav>

        {/* Domain Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Domain Details
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Manage settings and view analytics for domain ID: {params.id}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" href={`/dashboard/domains/${params.id}/edit`}>
                Edit Settings
              </Button>
              <Button href="/dashboard">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Domain Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Total Requests
            </h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              1,234
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              +12% from last month
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Revenue Generated
            </h3>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              $456.78
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              +8% from last month
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Active Status
            </h3>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-slate-900 dark:text-white font-medium">
                Active
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Accepting crawl requests
            </p>
          </Card>
        </div>

        {/* Domain Information */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Domain Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Domain Name
              </label>
              <p className="text-slate-900 dark:text-white">
                example-domain-{params.id}.com
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Verified
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Price
              </label>
              <p className="text-slate-900 dark:text-white">
                $0.05 per request
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date Added
              </label>
              <p className="text-slate-900 dark:text-white">
                January 15, 2024
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-slate-900 dark:text-white font-medium">
                  Crawl request from OpenAI Bot
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  2 hours ago • $0.05 earned
                </p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-medium">
                +$0.05
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-slate-900 dark:text-white font-medium">
                  Crawl request from Anthropic Bot
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  4 hours ago • $0.05 earned
                </p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-medium">
                +$0.05
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-slate-900 dark:text-white font-medium">
                  Price updated
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  1 day ago • Changed from $0.03 to $0.05
                </p>
              </div>
              <span className="text-slate-500 dark:text-slate-400">
                Updated
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
} 
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  DollarSign, 
  Globe, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Pay Per Crawl - Monetize Your Content with AI Crawlers',
  description: 'The premier marketplace for Pay Per Crawl domains. Publishers set prices for AI crawler access, AI companies discover and pay for quality content. Join the new economy of AI-driven content monetization.',
  openGraph: {
    title: 'AI Pay Per Crawl - Monetize Your Content with AI Crawlers',
    description: 'The premier marketplace for Pay Per Crawl domains. Publishers set prices for AI crawler access, AI companies discover and pay for quality content.',
    url: 'https://aipaypercrawl.com',
    images: [
      {
        url: '/og-image-home.png',
        width: 1200,
        height: 630,
        alt: 'AI Pay Per Crawl Homepage',
      },
    ],
  },
  twitter: {
    title: 'AI Pay Per Crawl - Monetize Your Content with AI Crawlers',
    description: 'The premier marketplace for Pay Per Crawl domains. Publishers set prices for AI crawler access.',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-8">
        <LogoWithText />
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
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Pay Per Crawl Marketplace for{' '}
              <span className="text-blue-600">AI Companies</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Discover and access web data at scale with Cloudflare's Pay Per Crawl solution. 
              Find domains, get instant quotes, and pay for crawl data programmatically.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button href="/directory" className="px-8 py-3 text-base">
                Browse Directory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" href="/api-docs" className="px-8 py-3 text-base">
                View API Docs
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col items-center">
                <dt className="text-base leading-7 text-slate-600 dark:text-slate-300">Active Domains</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  10,000+
                </dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="text-base leading-7 text-slate-600 dark:text-slate-300">API Requests</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  1M+
                </dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="text-base leading-7 text-slate-600 dark:text-slate-300">Publishers</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  500+
                </dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="text-base leading-7 text-slate-600 dark:text-slate-300">Avg Response Time</dt>
                                 <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                   &lt;50ms
                 </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to scale web data acquisition
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Built on Cloudflare's infrastructure for maximum performance and reliability
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <Search className="h-5 w-5 flex-none text-blue-600" />
                  Discovery Engine
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Automatically discover Cloudflare Pay Per Crawl enabled domains from Tranco's top 1M sites
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <DollarSign className="h-5 w-5 flex-none text-blue-600" />
                  Transparent Pricing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Get instant quotes with transparent per-request pricing and bulk discounts
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <Globe className="h-5 w-5 flex-none text-blue-600" />
                  Global Edge Network
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Powered by Cloudflare's global network for maximum speed and reliability
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <Zap className="h-5 w-5 flex-none text-blue-600" />
                  Instant API Access
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    RESTful API with OpenAPI docs, SDKs, and real-time webhooks
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <Shield className="h-5 w-5 flex-none text-blue-600" />
                  Publisher Dashboard
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Claim your domains, set pricing, and track revenue with detailed analytics
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <BarChart3 className="h-5 w-5 flex-none text-blue-600" />
                  Advanced Analytics
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Real-time usage metrics, cost optimization, and performance insights
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to scale your data acquisition?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-200">
                Join hundreds of AI companies already using AIPayPerCrawl to access web data at scale.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button variant="solid" color="white" href="/auth/signup" className="px-8 py-3 text-base">
                  Start Building
                </Button>
                <Button variant="outline" color="white" href="/directory" className="px-8 py-3 text-base border-white text-white hover:bg-white hover:text-blue-600">
                  Browse Directory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <LogoWithText className="text-white" />
              <p className="text-sm leading-6 text-slate-300">
                The marketplace for Pay Per Crawl domains, enabling AI companies to access web data at scale.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Platform</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link href="/directory" className="text-sm leading-6 text-slate-300 hover:text-white">
                        Directory
                      </Link>
                    </li>
                    <li>
                      <Link href="/api-docs" className="text-sm leading-6 text-slate-300 hover:text-white">
                        API Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/publishers" className="text-sm leading-6 text-slate-300 hover:text-white">
                        Publisher Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link href="/learn" className="text-sm leading-6 text-slate-300 hover:text-white">
                        Learning Center
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="text-sm leading-6 text-slate-300 hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/support" className="text-sm leading-6 text-slate-300 hover:text-white">
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-700 pt-8">
            <p className="text-xs leading-5 text-slate-400">
              &copy; 2024 AIPayPerCrawl. Built with ❤️ for the AI community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
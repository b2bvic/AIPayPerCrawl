import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
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
  Zap
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

// This would come from your database in a real implementation
async function getDomain(id: string) {
  // Mock data - replace with actual database query
  const mockDomains = [
    {
      id: '1',
      domain: 'example.com',
      isCloudflare: true,
      hasPayPerCrawl: true,
      pricePerRequest: 0.001,
      currency: 'USD',
      status: 'active',
      traffic: 1000000,
      vertical: 'Technology',
      cpm: 2.50,
      claimStatus: 'verified',
      licenseNotes: 'Attribution required for public datasets. Commercial use permitted.',
      crawlRules: 'Respect robots.txt. Maximum 10 requests per second. No bulk downloading of entire site.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Leading technology website with comprehensive coverage of AI, machine learning, and software development topics.',
      categories: ['Artificial Intelligence', 'Software Development', 'Technology News'],
      sitemap: true,
      robotsTxt: true,
      lastCrawled: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  ]
  
  return mockDomains.find(d => d.id === id)
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const domain = await getDomain(id)
  
  if (!domain) {
    return {
      title: 'Domain Not Found',
      description: 'The requested domain could not be found in our Pay Per Crawl directory.'
    }
  }

  return {
    title: `${domain.domain} - Pay Per Crawl Pricing & Access | AIPayPerCrawl`,
    description: `Access ${domain.domain} data through Cloudflare Pay Per Crawl at ${formatCurrency(domain.pricePerRequest)} per request. ${domain.vertical} vertical with ${formatNumber(domain.traffic)} monthly visits.`,
    keywords: `pay per crawl, ${domain.domain}, ${domain.vertical}, web scraping, API access, cloudflare`,
    openGraph: {
      title: `${domain.domain} - Pay Per Crawl Access`,
      description: `Access ${domain.domain} data programmatically through Cloudflare Pay Per Crawl`,
      type: 'website',
      url: `https://aipayercrawl.com/directory/${domain.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${domain.domain} - Pay Per Crawl Access`,
      description: `Access ${domain.domain} data programmatically through Cloudflare Pay Per Crawl`,
    },
    alternates: {
      canonical: `https://aipayercrawl.com/directory/${domain.id}`,
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}

export default async function DomainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const domain = await getDomain(id)

  if (!domain) {
    notFound()
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${domain.domain} Pay Per Crawl Access`,
    "description": domain.description,
    "url": `https://aipayercrawl.com/directory/${domain.id}`,
    "provider": {
      "@type": "Organization",
      "name": "AIPayPerCrawl",
      "url": "https://aipayercrawl.com"
    },
    "offers": {
      "@type": "Offer",
      "price": domain.pricePerRequest,
      "priceCurrency": domain.currency,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": domain.domain
      }
    },
    "category": domain.vertical,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Monthly Traffic",
        "value": domain.traffic
      },
      {
        "@type": "PropertyValue", 
        "name": "CPM",
        "value": domain.cpm
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
          <section className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <header className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {domain.domain}
                    <ExternalLink className="h-5 w-5 text-slate-400" />
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
                    {domain.description}
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
                  {domain.vertical}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Industry Vertical
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1" href={`/api/quote?domain=${domain.domain}`}>
                <Zap className="h-4 w-4 mr-2" />
                Get Quote
              </Button>
              <Button variant="outline" className="flex-1" href="/api-docs">
                <FileText className="h-4 w-4 mr-2" />
                API Documentation
              </Button>
            </div>
          </section>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <section className="lg:col-span-2 space-y-8">
              {/* Access Details */}
              <article className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Pay Per Crawl Access Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Crawl Rules</h3>
                    <p className="text-slate-600 dark:text-slate-300">{domain.crawlRules}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">License & Usage</h3>
                    <p className="text-slate-600 dark:text-slate-300">{domain.licenseNotes}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Sitemap Available</span>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {domain.sitemap ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Robots.txt</span>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {domain.robotsTxt ? 'Available' : 'Not Available'}
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Categories */}
              <article className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Content Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {domain.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </article>
            </section>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Quick Stats */}
              <section className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Last Crawled</span>
                    <span className="font-medium text-slate-900 dark:text-white">24h ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Added</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(domain.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </section>

              {/* Related Domains */}
              <section className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Similar Domains in {domain.vertical}
                </h3>
                <div className="space-y-3">
                  <Link href="/directory/2" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="font-medium text-slate-900 dark:text-white">news-site.com</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{formatCurrency(0.002)} per request</div>
                  </Link>
                  <Link href="/directory/3" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="font-medium text-slate-900 dark:text-white">tech-blog.com</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{formatCurrency(0.0015)} per request</div>
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </>
  )
} 
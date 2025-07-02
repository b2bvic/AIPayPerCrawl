import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Rocket, 
  Globe, 
  Code,
  CreditCard,
  Settings,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Users,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react'

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Getting Started with AIPayPerCrawl
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join the new economy of AI-driven content monetization. Whether you're a publisher looking to monetize your content or an AI company seeking quality data, we'll guide you through every step.
          </p>
        </div>

        {/* Choose Your Path */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                For Publishers
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Monetize your content when accessed by AI crawlers. Set your own prices and maintain full control over access.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Claim and verify your domains</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Set custom pricing per request</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Get paid automatically via Stripe</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Track revenue and analytics</span>
              </li>
            </ul>
            <Button href="#publishers" className="w-full">
              Start as Publisher
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                For AI Companies
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Access high-quality web data at scale with transparent pricing and easy integration.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Discover Pay Per Crawl domains</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Get instant pricing quotes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Pay only for what you crawl</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Use our API or SDKs</span>
              </li>
            </ul>
            <Button href="#ai-companies" className="w-full">
              Start as AI Company
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Publisher Steps */}
        <div id="publishers" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Publisher Quick Start Guide
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Start monetizing your content in 4 simple steps
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Create Your Publisher Account
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Sign up for a free AIPayPerCrawl account. You'll need to verify your email address and complete your publisher profile.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Required Information:</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Business name and contact details</li>
                      <li>• Website or domain you want to monetize</li>
                      <li>• Preferred payout method (bank account via Stripe)</li>
                    </ul>
                  </div>
                  <Button href="/auth/signup">
                    Create Account
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Claim and Verify Your Domain
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Prove ownership of your domain through DNS verification or file upload. This ensures only legitimate owners can set pricing.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Verification Methods:</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">DNS TXT Record:</span>
                        <code className="block mt-1 p-2 bg-slate-100 dark:bg-slate-600 rounded text-xs">
                          aipaypercrawl-verify=your-unique-token
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">HTML File:</span>
                        <code className="block mt-1 p-2 bg-slate-100 dark:bg-slate-600 rounded text-xs">
                          /aipaypercrawl-verify.html
                        </code>
                      </div>
                    </div>
                  </div>
                  <Button href="/dashboard/claim-domain">
                    Claim Domain
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Configure Cloudflare Settings
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Set up Pay Per Crawl headers on your Cloudflare account. We provide templates and step-by-step instructions.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Example Cloudflare Worker:</h4>
                    <pre className="text-xs overflow-x-auto">
                      <code className="text-slate-600 dark:text-slate-300">{`addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent')
  
  if (isAICrawler(userAgent)) {
    return new Response('Payment Required', {
      status: 402,
      headers: {
        'X-Robots-Tag': 'noindex',
        'X-Cloudflare-Crawl-Price': 'USD 0.001',
        'X-Pay-Per-Crawl': 'active'
      }
    })
  }
  
  return fetch(request)
}`}</code>
                    </pre>
                  </div>
                  <Button variant="outline" href="/learn">
                    View Setup Guide
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Set Pricing and Start Earning
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Configure your pricing strategy and watch the revenue flow in. Track performance through your dashboard.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                      <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-white">Set Prices</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Per request pricing</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                      <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-white">Control Access</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Allow/block crawlers</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                      <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-slate-900 dark:text-white">Track Revenue</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Real-time analytics</p>
                    </div>
                  </div>
                  <Button href="/dashboard">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Company Steps */}
        <div id="ai-companies" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              AI Company Quick Start Guide
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Start crawling Pay Per Crawl content in minutes
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Sign Up and Add Credits
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Create your AI company account and add crawl credits to your balance. Start with our free tier that includes $5 in credits.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Account Tiers:</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• <strong>Free:</strong> $5 credits, perfect for testing</li>
                      <li>• <strong>Starter:</strong> $29/mo, includes $50 credits</li>
                      <li>• <strong>Professional:</strong> $299/mo, includes $750 credits</li>
                      <li>• <strong>Enterprise:</strong> Custom pricing and limits</li>
                    </ul>
                  </div>
                  <Button href="/auth/signup">
                    Get Started Free
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Get Your API Key
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Generate an API key from your dashboard. This key authenticates your requests and tracks usage.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Example API Usage:</h4>
                    <pre className="text-xs overflow-x-auto">
                      <code className="text-slate-600 dark:text-slate-300">{`curl -X GET https://api.aipaypercrawl.com/v1/crawl \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/article",
    "accept_price": 0.01
  }'`}</code>
                    </pre>
                  </div>
                  <Button href="/account/api-keys">
                    Generate API Key
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Discover and Quote Domains
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Use our discovery engine to find Pay Per Crawl enabled domains or get quotes for specific URLs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Discovery API:</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        Find domains by category, price range, or content type
                      </p>
                      <code className="text-xs">GET /v1/discovery</code>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Quote API:</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        Get instant pricing for any URL
                      </p>
                      <code className="text-xs">POST /v1/quote</code>
                    </div>
                  </div>
                  <Button variant="outline" href="/api-docs">
                    View API Docs
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Start Crawling
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Make crawl requests with automatic payment processing. Monitor usage and costs in real-time.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Pro Tips:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Use bulk endpoints for better rates</li>
                      <li>• Set price limits to control costs</li>
                      <li>• Cache responses to avoid duplicate charges</li>
                      <li>• Monitor your dashboard for usage insights</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button href="/directory">
                      Browse Directory
                    </Button>
                    <Button variant="outline" href="/dashboard">
                      View Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/api-docs" className="group">
              <div className="text-center p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  API Documentation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Complete API reference with examples
                </p>
              </div>
            </Link>
            <Link href="/faq" className="group">
              <div className="text-center p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  FAQ
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Answers to common questions
                </p>
              </div>
            </Link>
            <Link href="/support" className="group">
              <div className="text-center p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Get help from our team
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
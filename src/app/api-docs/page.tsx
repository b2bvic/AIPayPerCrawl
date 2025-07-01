import React from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  Code, 
  Play, 
  Copy, 
  ExternalLink,
  FileText,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - AIPayPerCrawl',
  description: 'Complete API documentation for AIPayPerCrawl. Learn how to integrate Pay Per Crawl data access into your applications with REST API, SDKs, and live examples.',
  keywords: 'API documentation, pay per crawl API, web scraping API, REST API, SDKs',
  openGraph: {
    title: 'AIPayPerCrawl API Documentation',
    description: 'Complete API documentation for Pay Per Crawl data access',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
}

const codeExamples = {
  javascript: `// Node.js Example
const response = await fetch('https://aipayercrawl.com/api/quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    urls: [
      'https://example.com/page1',
      'https://example.com/page2'
    ]
  })
});

const quote = await response.json();
console.log('Total cost:', quote.totalCost);`,

  python: `# Python Example
import requests

url = "https://aipayercrawl.com/api/quote"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "urls": [
        "https://example.com/page1",
        "https://example.com/page2"
    ]
}

response = requests.post(url, headers=headers, json=data)
quote = response.json()
print(f"Total cost: {quote['totalCost']}")`,

  curl: `# cURL Example
curl -X POST https://aipayercrawl.com/api/quote \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "urls": [
      "https://example.com/page1",
      "https://example.com/page2"
    ]
  }'`
}

const responseExample = `{
  "quoteId": "quote_1234567890abcdef",
  "totalCost": 0.003,
  "currency": "USD",
  "items": [
    {
      "url": "https://example.com/page1",
      "domain": "example.com",
      "pricePerRequest": 0.001,
      "currency": "USD",
      "available": true
    },
    {
      "url": "https://example.com/page2",
      "domain": "example.com", 
      "pricePerRequest": 0.001,
      "currency": "USD",
      "available": true
    }
  ],
  "expiresAt": "2024-01-02T10:00:00Z",
  "createdAt": "2024-01-01T10:00:00Z",
  "paymentUrl": "https://aipayercrawl.com/api/checkout?quoteId=quote_1234567890abcdef"
}`

export default function ApiDocsPage() {
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            API Documentation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Integrate Pay Per Crawl data access into your applications with our REST API. 
            Get instant quotes, process payments, and access web data programmatically.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button href="#quickstart">
              Quick Start
            </Button>
            <Button variant="outline" href="#reference">
              API Reference
            </Button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">REST API</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">JSON-based</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">&lt;50ms</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Response Time</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Uptime SLA</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">OpenAPI</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">3.0 Spec</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Documentation</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#quickstart" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Quick Start</a></li>
                <li><a href="#authentication" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Authentication</a></li>
                <li><a href="#reference" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">API Reference</a></li>
                <li><a href="#quote" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Get Quote</a></li>
                <li><a href="#errors" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Error Handling</a></li>
                <li><a href="#sdks" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">SDKs & Libraries</a></li>
                <li><a href="#examples" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Examples</a></li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Quick Start */}
            <section id="quickstart" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Quick Start
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    1. Get Your API Key
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Sign up for an account and get your API key from the dashboard.
                  </p>
                  <Button href="/auth/signup">
                    Get API Key
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    2. Make Your First Request
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Get a quote for crawling specific URLs:
                  </p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{codeExamples.curl}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Authentication
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Authenticate your API requests by including your API key in the Authorization header:
              </p>
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <pre className="text-green-400 text-sm">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Security:</strong> Keep your API key secure and never expose it in client-side code. 
                  All API requests must be made over HTTPS.
                </p>
              </div>
            </section>

            {/* API Reference */}
            <section id="reference" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                API Reference
              </h2>
              
              <div className="space-y-8">
                {/* Base URL */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Base URL</h3>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <code className="text-green-400">https://aipayercrawl.com/api</code>
                  </div>
                </div>

                {/* Quote Endpoint */}
                <div id="quote">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    POST /quote
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Get a quote for crawling specific URLs. Returns itemized pricing and a payment URL.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request */}
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Request Body</h4>
                      <div className="bg-slate-900 rounded-lg p-4 text-sm">
                        <pre className="text-green-400">
{`{
  "urls": [
    "https://example.com/page1",
    "https://example.com/page2"
  ],
  "callbackUrl": "https://your-app.com/webhook",
  "metadata": {
    "userId": "user123"
  }
}`}
                        </pre>
                      </div>
                      
                      <div className="mt-4 space-y-2 text-sm">
                        <div><strong className="text-slate-900 dark:text-white">urls</strong> <span className="text-slate-500">(required)</span> - Array of URLs to crawl (max 1000)</div>
                        <div><strong className="text-slate-900 dark:text-white">callbackUrl</strong> <span className="text-slate-500">(optional)</span> - Webhook URL for notifications</div>
                        <div><strong className="text-slate-900 dark:text-white">metadata</strong> <span className="text-slate-500">(optional)</span> - Custom metadata object</div>
                      </div>
                    </div>

                    {/* Response */}
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Response</h4>
                      <div className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto">
                        <pre className="text-green-400">
                          <code>{responseExample}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Handling */}
            <section id="errors" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Error Handling
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                The API uses conventional HTTP response codes to indicate success or failure:
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="font-medium text-green-800 dark:text-green-200">2xx - Success</div>
                    <div className="text-sm text-green-600 dark:text-green-300">Request completed successfully</div>
                  </div>
                  <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200">4xx - Client Error</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-300">Invalid request data or authentication</div>
                  </div>
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="font-medium text-red-800 dark:text-red-200">5xx - Server Error</div>
                    <div className="text-sm text-red-600 dark:text-red-300">Internal server error</div>
                  </div>
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="font-medium text-blue-800 dark:text-blue-200">429 - Rate Limited</div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Too many requests, retry later</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Code Examples
              </h2>
              
              <div className="space-y-6">
                {Object.entries(codeExamples).map(([language, code]) => (
                  <div key={language}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white capitalize">
                        {language === 'javascript' ? 'Node.js' : language}
                      </h3>
                      <Button variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SDKs */}
            <section id="sdks" className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                SDKs & Libraries
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Official SDKs and community libraries to help you integrate faster:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-slate-900 dark:text-white">Node.js SDK</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Official Node.js/TypeScript SDK with full type support
                  </p>
                                     <Button variant="outline">
                     <ExternalLink className="h-4 w-4 mr-1" />
                     View on GitHub
                   </Button>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-slate-900 dark:text-white">Python SDK</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Official Python SDK with async support
                  </p>
                                     <Button variant="outline">
                     <ExternalLink className="h-4 w-4 mr-1" />
                     View on PyPI
                   </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

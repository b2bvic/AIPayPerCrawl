import React from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  Globe, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  FileCode,
  Webhook,
  Database,
  Search
} from 'lucide-react'

export default function LearnPage() {
  const guides = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of Pay Per Crawl and how to integrate it into your AI applications.',
      topics: ['What is Pay Per Crawl?', 'How it works', 'Key benefits', 'Use cases'],
      href: '#getting-started'
    },
    {
      icon: Code,
      title: 'API Integration',
      description: 'Step-by-step guide to integrate our API into your application.',
      topics: ['Authentication', 'Making requests', 'Handling responses', 'Error handling'],
      href: '#api-integration'
    },
    {
      icon: Database,
      title: 'Data Formats',
      description: 'Understand the data formats and schemas returned by our crawlers.',
      topics: ['JSON structure', 'HTML parsing', 'Metadata fields', 'Content extraction'],
      href: '#data-formats'
    },
    {
      icon: Webhook,
      title: 'Webhooks & Events',
      description: 'Set up real-time notifications for crawl completions and updates.',
      topics: ['Webhook setup', 'Event types', 'Payload structure', 'Retry logic'],
      href: '#webhooks'
    },
    {
      icon: Shield,
      title: 'Best Practices',
      description: 'Optimize your crawling strategy and ensure compliance.',
      topics: ['Rate limiting', 'Caching strategies', 'Cost optimization', 'Legal compliance'],
      href: '#best-practices'
    },
    {
      icon: Search,
      title: 'Advanced Topics',
      description: 'Deep dive into advanced features and optimization techniques.',
      topics: ['Bulk operations', 'Custom headers', 'JavaScript rendering', 'API limits'],
      href: '#advanced'
    }
  ]

  const faqs = [
    {
      question: 'What is Cloudflare Pay Per Crawl?',
      answer: 'Pay Per Crawl is a new standard that allows AI companies to pay publishers directly for crawling their content. It ensures fair compensation while enabling AI training on high-quality data.'
    },
    {
      question: 'How does pricing work?',
      answer: 'Publishers set their own per-request prices. You only pay for successful crawls, with transparent pricing shown upfront. Bulk discounts are available for high-volume usage.'
    },
    {
      question: 'What data formats are supported?',
      answer: 'We support JSON, HTML, and structured data extraction. All responses include metadata like timestamps, content-type, and extraction quality scores.'
    },
    {
      question: 'How fast are crawl requests?',
      answer: 'Most requests complete in under 50ms thanks to Cloudflare\'s global edge network. Complex JavaScript-rendered pages may take up to 2-3 seconds.'
    },
    {
      question: 'Can I crawl any website?',
      answer: 'Only websites that have enabled Pay Per Crawl through Cloudflare are available. Our directory shows all available domains with their pricing.'
    },
    {
      question: 'Is there an API rate limit?',
      answer: 'API limits vary by plan. Free tier allows 1,000 requests/day, while enterprise plans offer unlimited requests with custom SLAs.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
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
              <Link href="/learn" className="text-blue-600 dark:text-blue-400 font-medium">
                Learn
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>
            <Button href="/auth/signup">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Learn Pay Per Crawl
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300">
              Everything you need to know about integrating Cloudflare's Pay Per Crawl into your AI applications.
              From basic concepts to advanced optimization techniques.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button href="#getting-started">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" href="/api-docs">
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Learning Paths
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Choose your learning path based on your experience level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => {
              const Icon = guide.icon
              return (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition-all duration-200"
                >
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="mb-6">
                    <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {guide.description}
                  </p>

                  <ul className="space-y-2">
                    {guide.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="getting-started" className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Quick Start Guide
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  1. Get Your API Key
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Sign up for an account and generate your API key from the dashboard.
                </p>
                <div className="bg-slate-900 dark:bg-slate-800 rounded-md p-4 overflow-x-auto">
                  <code className="text-sm text-green-400">
                    curl -X POST https://aipaypercrawl.com/api/auth/register \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '{`{"email": "you@example.com", "password": "secure_password"}`}'
                  </code>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  2. Get a Quote
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Request a quote for the URLs you want to crawl.
                </p>
                <div className="bg-slate-900 dark:bg-slate-800 rounded-md p-4 overflow-x-auto">
                  <code className="text-sm text-green-400">
                    curl -X POST https://aipaypercrawl.com/api/quote \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '{`{"urls": ["https://example.com/page1", "https://example.com/page2"]}`}'
                  </code>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  3. Execute Crawl
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Accept the quote and execute the crawl request.
                </p>
                <div className="bg-slate-900 dark:bg-slate-800 rounded-md p-4 overflow-x-auto">
                  <code className="text-sm text-green-400">
                    curl -X POST https://aipaypercrawl.com/api/crawl \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '{`{"quoteId": "quote_abc123", "accept": true}`}'
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Still have questions?
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" href="/support">
                Contact Support
              </Button>
              <Button href="/api-docs">
                Read API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start crawling?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of AI companies using Pay Per Crawl for their data needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button color="white" href="/auth/signup">
              Start Free Trial
            </Button>
            <Button variant="outline" color="white" href="/pricing">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 
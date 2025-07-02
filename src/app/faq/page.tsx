'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  DollarSign,
  Shield,
  Code,
  Globe,
  CreditCard
} from 'lucide-react'

const faqCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: HelpCircle,
    questions: [
      {
        question: 'What is AIPayPerCrawl?',
        answer: 'AIPayPerCrawl is a marketplace that connects publishers who want to monetize their content through AI crawlers with AI companies that need access to web data. Publishers can set prices for AI crawler access using Cloudflare\'s Pay Per Crawl technology, while AI companies can discover and pay for quality content at scale.'
      },
      {
        question: 'How does Pay Per Crawl work?',
        answer: 'Pay Per Crawl uses HTTP 402 Payment Required responses to indicate that content requires payment for AI crawler access. When an AI crawler encounters a 402 response, it can check the pricing headers, make a payment decision, and gain access to the content. This creates a fair value exchange between content creators and AI companies.'
      },
      {
        question: 'Who can use AIPayPerCrawl?',
        answer: 'AIPayPerCrawl is designed for two main groups: Publishers who want to monetize their content when accessed by AI crawlers, and AI companies that need access to quality web data for training, research, or other purposes. Both individual creators and large organizations can benefit from the platform.'
      },
      {
        question: 'Is this only for Cloudflare customers?',
        answer: 'While the Pay Per Crawl technology is powered by Cloudflare\'s infrastructure, you don\'t need to be an existing Cloudflare customer to use AIPayPerCrawl. However, domains must be configured with Cloudflare to enable the Pay Per Crawl functionality.'
      }
    ]
  },
  {
    id: 'publishers',
    name: 'For Publishers',
    icon: Globe,
    questions: [
      {
        question: 'How do I claim my domain?',
        answer: 'To claim your domain: 1) Sign up for an AIPayPerCrawl account, 2) Navigate to the domain claiming page, 3) Enter your domain name, 4) Verify ownership through DNS TXT record or HTML file upload, 5) Configure your pricing and crawl rules. The verification process typically takes just a few minutes.'
      },
      {
        question: 'How do I set pricing for my content?',
        answer: 'You can set pricing at multiple levels: domain-wide default pricing, specific path pricing, and content-type based pricing. Prices are set per request and can range from $0.0001 to $10 per crawl. You can also set different prices for different AI companies or offer bulk discounts.'
      },
      {
        question: 'When and how do I get paid?',
        answer: 'Payments are processed through Stripe Connect. You can choose from weekly, bi-weekly, or monthly payout schedules. Earnings are automatically deposited to your connected bank account. There\'s a minimum payout threshold (default $10) that you can configure in your billing settings.'
      },
      {
        question: 'Can I block certain crawlers while allowing others?',
        answer: 'Yes, you have full control over crawler access. You can whitelist specific AI companies, set different prices for different crawlers, or block certain crawlers entirely. You can also set up rules based on request patterns, geographic location, or other criteria.'
      }
    ]
  },
  {
    id: 'ai-companies',
    name: 'For AI Companies',
    icon: Code,
    questions: [
      {
        question: 'How do I access Pay Per Crawl content?',
        answer: 'To access content: 1) Create an AIPayPerCrawl account and add credits, 2) Use our API to discover available domains and pricing, 3) Make crawl requests with your API key, 4) Payment is automatically deducted from your account balance. You can also use our SDKs for easier integration.'
      },
      {
        question: 'What pricing models are available?',
        answer: 'We offer several pricing models: Pay-as-you-go for individual requests, bulk packages with volume discounts, monthly subscriptions for unlimited access to specific domains, and custom enterprise agreements for large-scale operations. All pricing is transparent and shown upfront.'
      },
      {
        question: 'How can I estimate my crawling costs?',
        answer: 'Use our API\'s quote endpoint to get real-time pricing for any domain or URL. You can also use the discovery engine to find domains within your budget. Our dashboard provides cost calculators and spending projections based on your crawling patterns.'
      },
      {
        question: 'Is there an API rate limit?',
        answer: 'API rate limits depend on your account tier. Free tier: 100 requests/minute, Starter: 1,000 requests/minute, Professional: 10,000 requests/minute, Enterprise: Custom limits. Rate limits apply to API calls, not content crawls. You can monitor your usage in real-time through the dashboard.'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: Shield,
    questions: [
      {
        question: 'What are the technical requirements?',
        answer: 'For publishers: Your domain must use Cloudflare (free tier is sufficient) and you need to configure Pay Per Crawl rules. For AI companies: Any HTTP client that can send custom headers and handle 402 responses. We provide SDKs for Python, Node.js, and Go.'
      },
      {
        question: 'How do I implement Pay Per Crawl headers?',
        answer: 'Publishers using Cloudflare can configure headers through Cloudflare Workers or Page Rules. Set the X-Robots-Tag for crawler instructions and pricing headers like X-Cloudflare-Crawl-Price. Our documentation provides complete examples and templates.'
      },
      {
        question: 'What happens if a payment fails?',
        answer: 'If a payment fails, the crawler receives a 402 response with error details. Common causes include insufficient balance, invalid API key, or domain-specific restrictions. Failed requests are logged but not charged. You can configure retry policies and fallback behaviors.'
      },
      {
        question: 'Is the content cached after payment?',
        answer: 'Content caching policies are set by publishers. By default, paid content access is valid for 24 hours for the same URL. Publishers can set shorter or longer cache periods, or disable caching entirely for sensitive content. Cache headers are included in the response.'
      }
    ]
  },
  {
    id: 'billing',
    name: 'Billing & Payments',
    icon: CreditCard,
    questions: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), ACH bank transfers for US companies, and wire transfers for enterprise accounts. Publishers receive payments via Stripe Connect to their bank accounts. All payments are processed securely through Stripe.'
      },
      {
        question: 'Are there any platform fees?',
        answer: 'AIPayPerCrawl charges a 10% platform fee on successful crawl transactions. This covers payment processing, infrastructure, support, and platform development. There are no setup fees, monthly fees, or hidden charges. Publishers receive 90% of their set prices.'
      },
      {
        question: 'How are refunds handled?',
        answer: 'Refunds can be requested within 24 hours for technical issues (e.g., received different content than expected, server errors). Refund requests are reviewed individually. Publishers are not charged back for approved refunds - these are covered by our platform guarantee.'
      },
      {
        question: 'Do you provide invoices for tax purposes?',
        answer: 'Yes, detailed invoices are automatically generated for all transactions. AI companies receive monthly invoices for their crawl purchases. Publishers receive revenue statements and 1099 forms (for US publishers) for tax reporting. All documents are available in the billing dashboard.'
      }
    ]
  },
  {
    id: 'pricing',
    name: 'Pricing & Plans',
    icon: DollarSign,
    questions: [
      {
        question: 'What are the platform pricing tiers?',
        answer: 'Free tier: Perfect for testing, includes $5 in crawl credits. Starter ($29/month): For small projects, includes $50 in credits. Professional ($299/month): For growing businesses, includes $750 in credits. Enterprise: Custom pricing with volume discounts and dedicated support.'
      },
      {
        question: 'How do crawl credits work?',
        answer: 'Crawl credits are pre-paid funds used to pay for content access. 1 credit = $1 USD. Credits don\'t expire and unused monthly included credits roll over (up to 3 months). You can purchase additional credits anytime. Volume purchases receive up to 20% bonus credits.'
      },
      {
        question: 'Can I change my plan anytime?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle. No long-term contracts required - all plans are month-to-month with cancel anytime option.'
      },
      {
        question: 'Do you offer educational or nonprofit discounts?',
        answer: 'Yes! Verified educational institutions receive 50% off all plans. Registered nonprofits receive 30% off. Open source projects can apply for free credits. Contact our sales team with verification documents to activate these discounts.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const displayCategories = activeCategory 
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Find answers to common questions about AIPayPerCrawl
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {faqCategories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {displayCategories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {category.name}
                  </h2>
                </div>
                <div className="space-y-3">
                  {category.questions.map((item, index) => {
                    const questionId = `${category.id}-${index}`
                    const isExpanded = expandedQuestions.has(questionId)
                    
                    return (
                      <div
                        key={questionId}
                        className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="font-medium text-slate-900 dark:text-white pr-4">
                            {item.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
          <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Our support team is here to help you get started with AIPayPerCrawl
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Support
            </a>
            <a
              href="/learn"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
            >
              View Documentation
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
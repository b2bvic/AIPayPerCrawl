import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { RatesAndPackaging } from '@/components/RatesAndPackaging'
import { 
  Check, 
  X, 
  Zap, 
  Building2, 
  Rocket,
  Shield,
  Clock,
  HeadphonesIcon,
  Infinity,
  ChartBar,
  Code2,
  Database,
  Calculator,
  TrendingUp,
  Globe,
  Filter,
  ArrowUpDown
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing - Transparent Pay Per Crawl Rates & Packages',
  description: 'Transparent pricing for AI Pay Per Crawl. Compare rates by CPM, vertical, and traffic size. Estimate costs for home pages, article archives, or full sitemaps.',
  openGraph: {
    title: 'Pricing - Transparent Pay Per Crawl Rates & Packages',
    description: 'Compare rates by CPM, vertical, and traffic size. Estimate costs for different crawling scenarios.',
    url: 'https://aipaypercrawl.com/pricing',
  },
  twitter: {
    title: 'Pricing - Transparent Pay Per Crawl Rates & Packages',
    description: 'Compare rates by CPM, vertical, and traffic size. Estimate costs for different crawling scenarios.',
  },
}

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small projects and testing',
      price: 0,
      priceLabel: 'Free',
      color: 'slate',
      features: [
        { name: '1,000 requests/month', included: true },
        { name: 'Basic API access', included: true },
        { name: 'Standard response time', included: true },
        { name: 'Community support', included: true },
        { name: 'JSON & HTML formats', included: true },
        { name: 'Rate limit: 10 req/min', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom integrations', included: false },
        { name: 'SLA guarantee', included: false }
      ],
      cta: 'Start Free',
      href: '/auth/signup?plan=starter'
    },
    {
      name: 'Pro',
      description: 'For growing AI applications',
      price: 99,
      priceLabel: '$99/mo',
      color: 'blue',
      popular: true,
      features: [
        { name: '100,000 requests/month', included: true },
        { name: 'Full API access', included: true },
        { name: 'Fast response time (<50ms)', included: true },
        { name: 'Priority email support', included: true },
        { name: 'All data formats', included: true },
        { name: 'Rate limit: 100 req/min', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Webhook integrations', included: true },
        { name: 'Custom headers', included: false },
        { name: '99.9% SLA', included: false }
      ],
      cta: 'Start Pro Trial',
      href: '/auth/signup?plan=pro'
    },
    {
      name: 'Enterprise',
      description: 'For large-scale operations',
      price: null,
      priceLabel: 'Custom',
      color: 'purple',
      features: [
        { name: 'Unlimited requests', included: true },
        { name: 'Full API access', included: true },
        { name: 'Ultra-fast response (<25ms)', included: true },
        { name: 'Dedicated support team', included: true },
        { name: 'All data formats + custom', included: true },
        { name: 'No rate limits', included: true },
        { name: 'Custom analytics', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'White-label options', included: true },
        { name: '99.99% SLA', included: true }
      ],
      cta: 'Contact Sales',
      href: '/contact-sales'
    }
  ]

  const addons = [
    {
      icon: Database,
      name: 'Extra Requests',
      description: 'Need more requests? Add blocks of 10,000',
      price: '$10 per 10k requests'
    },
    {
      icon: Zap,
      name: 'Burst Mode',
      description: 'Temporarily increase rate limits for big jobs',
      price: '$50/day'
    },
    {
      icon: Shield,
      name: 'Premium Support',
      description: 'Get 24/7 phone and chat support',
      price: '$199/mo'
    },
    {
      icon: ChartBar,
      name: 'Advanced Analytics',
      description: 'Detailed insights and custom reports',
      price: '$49/mo'
    }
  ]

  const faqs = [
    {
      question: 'How does billing work?',
      answer: 'You pay a monthly subscription fee for your plan, which includes a set number of requests. Additional requests can be purchased as needed. Usage is tracked in real-time and you can monitor it from your dashboard.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged a prorated amount. When downgrading, you\'ll receive a credit for the unused portion.'
    },
    {
      question: 'What happens if I exceed my request limit?',
      answer: 'We\'ll notify you when you reach 80% of your limit. You can either upgrade your plan or purchase additional request blocks. Your service won\'t be interrupted.'
    },
    {
      question: 'Do you offer annual billing?',
      answer: 'Yes, we offer a 20% discount for annual billing on Pro and Enterprise plans. Contact our sales team to set up annual billing.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'The Starter plan is free forever with 1,000 requests/month. Pro plans include a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'How are crawling costs calculated?',
      answer: 'Each domain sets its own price per request. Costs vary based on traffic volume, content quality, and vertical. Use our cost calculator to estimate expenses for different crawling scenarios.'
    },
    {
      question: 'What is CPM and how does it work?',
      answer: 'CPM (Cost Per Mille) represents the cost per 1,000 requests. It helps you compare pricing across different domains and verticals. Higher traffic domains typically have higher CPMs due to increased value.'
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
              <Link href="/learn" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Learn
              </Link>
              <Link href="/pricing" className="text-blue-600 dark:text-blue-400 font-medium">
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
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Transparent rates & packages
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Compare pricing by CPM, vertical, and traffic size. Estimate costs for home pages, 
            article archives, or full sitemaps.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-500" />
              <span className="text-slate-600 dark:text-slate-300">Cost calculator</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-slate-600 dark:text-slate-300">Traffic-based pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              <span className="text-slate-600 dark:text-slate-300">Vertical insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rates and Packaging Component */}
      <RatesAndPackaging />

      {/* Pricing Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Platform plans
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Choose the plan that fits your crawling needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl border ${
                  plan.popular
                    ? 'border-blue-500 shadow-xl scale-105'
                    : 'border-slate-200 dark:border-slate-700'
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {plan.priceLabel}
                    </span>
                    {plan.price !== null && plan.price > 0 && (
                      <span className="text-slate-600 dark:text-slate-400 ml-2">
                        /month
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={plan.href}
                  variant={plan.popular ? 'solid' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Power up with add-ons
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Enhance your plan with additional features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => {
              const Icon = addon.icon
              return (
                <div
                  key={addon.name}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {addon.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {addon.description}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {addon.price}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
            <Building2 className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Need a custom solution?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get unlimited requests, custom integrations, and dedicated support
              tailored to your enterprise needs.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button color="white" href="/contact-sales">
                Talk to Sales
              </Button>
              <Button variant="outline" color="white" href="/learn">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-16">
            Frequently asked questions
          </h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Start crawling in minutes
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of AI companies using Pay Per Crawl.
            No credit card required.
          </p>
          <Button href="/auth/signup" className="px-8 py-3 text-base">
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  )
} 
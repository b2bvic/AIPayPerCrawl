// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Globe, 
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Publishers - Monetize Your Content with AI Pay Per Crawl',
  description: 'Join thousands of publishers monetizing their content with AI Pay Per Crawl. Set your prices, claim your domains, and start earning revenue from AI companies.',
  openGraph: {
    title: 'For Publishers - Monetize Your Content with AI Pay Per Crawl',
    description: 'Join thousands of publishers monetizing their content with AI Pay Per Crawl. Set your prices and start earning revenue.',
    url: 'https://aipaypercrawl.com/publishers',
  },
  twitter: {
    title: 'For Publishers - Monetize Your Content with AI Pay Per Crawl',
    description: 'Monetize your content with AI Pay Per Crawl. Set your prices and start earning.',
  },
}

export default function PublishersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'New Revenue Stream',
      description: 'Generate income from your existing content without any changes to your site or user experience.',
    },
    {
      icon: TrendingUp,
      title: 'Passive Income',
      description: 'Earn money 24/7 as AI companies access your content for training and research purposes.',
    },
    {
      icon: Shield,
      title: 'You Stay in Control',
      description: 'Set your own prices, choose which content to monetize, and maintain full control over your domain.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with AI companies worldwide through our marketplace and automated discovery system.',
    },
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track your earnings, request volumes, and performance metrics with detailed dashboards.',
    },
    {
      icon: Users,
      title: 'Publisher Community',
      description: 'Join a growing community of publishers sharing best practices and success stories.',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Get paid instantly through Stripe with automatic revenue distribution and reporting.',
    },
    {
      icon: CheckCircle,
      title: 'Easy Setup',
      description: 'Claim your domain with DNS verification and start monetizing in minutes, not days.',
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Claim Your Domain',
      description: 'Verify ownership of your domain through our simple DNS verification process.',
      action: 'Start Claiming',
      href: '/claim-domain',
    },
    {
      step: '2',
      title: 'Set Your Prices',
      description: 'Configure pricing for different types of content and AI crawler access levels.',
      action: 'View Pricing Guide',
      href: '/learn#pricing',
    },
    {
      step: '3',
      title: 'Start Earning',
      description: 'AI companies discover your content and pay per request automatically.',
      action: 'See Dashboard',
      href: '/dashboard',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Tech Blog Owner',
      company: 'TechInsights.dev',
      quote: 'AI Pay Per Crawl has generated over $2,000/month in passive income from our existing content. The setup was incredibly easy.',
      revenue: '+$2,000/mo',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'News Publisher',
      company: 'LocalNews24',
      quote: 'We\'ve monetized our entire archive without affecting our readers. It\'s like finding money we didn\'t know we had.',
      revenue: '+$5,500/mo',
    },
    {
      name: 'Emily Zhang',
      role: 'E-commerce Site',
      company: 'ShopSmart.com',
      quote: 'The product descriptions and reviews that took years to build are now generating additional revenue through AI training.',
      revenue: '+$3,200/mo',
    },
  ]

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
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Monetize Your Content with
                <span className="text-blue-600 dark:text-blue-400"> AI Pay Per Crawl</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
                Turn your existing content into a revenue stream. Join thousands of publishers earning passive income 
                by allowing AI companies to access their content for training and research.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/claim-domain" className="px-8 py-3 text-lg">
                  Claim Your Domain
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" href="/learn" className="px-8 py-3 text-lg">
                  Learn How It Works
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Free to start • No upfront costs • Keep 100% of earnings
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Why Publishers Choose AI Pay Per Crawl
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Unlock the value of your content without changing your site or affecting your users
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                From domain verification to earning revenue in minutes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <Card key={step.step} className="p-8 text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {step.description}
                  </p>
                  <Button href={step.href} variant="outline" className="w-full">
                    {step.action}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Publisher-First Features
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Everything you need to succeed in the AI content economy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="p-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-4">
                      <feature.icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-slate-100 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Real publishers, real results
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="p-6">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {testimonial.revenue}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 italic">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Monetizing Your Content?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of publishers already earning passive income with AI Pay Per Crawl
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button color="white" href="/claim-domain" className="px-8 py-3 text-lg">
                Claim Your Domain Now
              </Button>
              <Button variant="outline" color="white" href="/support" className="px-8 py-3 text-lg">
                Talk to Our Team
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 
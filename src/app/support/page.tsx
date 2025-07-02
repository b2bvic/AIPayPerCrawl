// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  HelpCircle,
  Clock,
  Users,
  Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support - Get Help with AI Pay Per Crawl',
  description: 'Get support for AI Pay Per Crawl. Find answers to common questions, contact our team, or access documentation and resources.',
  openGraph: {
    title: 'Support - Get Help with AI Pay Per Crawl',
    description: 'Get support for AI Pay Per Crawl. Find answers to common questions, contact our team, or access documentation and resources.',
    url: 'https://aipaypercrawl.com/support',
  },
  twitter: {
    title: 'Support - Get Help with AI Pay Per Crawl',
    description: 'Get support for AI Pay Per Crawl. Find answers and contact our team.',
  },
}

export default function SupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat',
      href: '#chat',
      primary: true,
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      availability: 'Response within 4 hours',
      action: 'Send Email',
      href: 'mailto:support@aipaypercrawl.com',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our technical team',
      availability: 'Mon-Fri 9AM-6PM PST',
      action: 'Call Now',
      href: 'tel:+1-555-0123',
    },
  ]

  const resources = [
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Comprehensive guides and API reference',
      href: '/api-docs',
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Answers to frequently asked questions',
      href: '/faq',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users and share knowledge',
      href: '/community',
    },
    {
      icon: Zap,
      title: 'Status Page',
      description: 'Check system status and uptime',
      href: '/status',
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get the support you need to make the most of AI Pay Per Crawl. Our team is here to help you succeed.
          </p>
        </div>

        {/* Support Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Contact Our Support Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <Card key={option.title} className={`p-6 text-center ${option.primary ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${option.primary ? 'bg-blue-100 dark:bg-blue-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <option.icon className={`h-6 w-6 ${option.primary ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  {option.description}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-4 w-4 text-slate-400 mr-1" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {option.availability}
                  </span>
                </div>
                <Button 
                  href={option.href} 
                  className="w-full"
                  variant={option.primary ? 'solid' : 'outline'}
                >
                  {option.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Self-Service Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <Card key={resource.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mr-3">
                    <resource.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {resource.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {resource.description}
                </p>
                <Link 
                  href={resource.href}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium"
                >
                  Learn more →
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="p-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
              Critical Issues or Emergencies
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">
              For urgent technical issues affecting production systems, contact our emergency support line.
            </p>
            <Button 
              href="tel:+1-555-0199" 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Emergency Support: +1 (555) 0199
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
} 
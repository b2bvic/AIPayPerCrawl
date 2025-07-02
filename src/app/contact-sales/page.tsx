// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Contact Sales - Enterprise AI Pay Per Crawl Solutions',
  description: 'Get in touch with our sales team for enterprise AI Pay Per Crawl solutions. Custom pricing, dedicated support, and white-label options available.',
  openGraph: {
    title: 'Contact Sales - Enterprise AI Pay Per Crawl Solutions',
    description: 'Get in touch with our sales team for enterprise AI Pay Per Crawl solutions.',
    url: 'https://aipaypercrawl.com/contact-sales',
  },
  twitter: {
    title: 'Contact Sales - Enterprise AI Pay Per Crawl Solutions',
    description: 'Contact our sales team for enterprise AI Pay Per Crawl solutions.',
  },
}

export default function ContactSalesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Enterprise AI Pay Per Crawl Solutions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Scale your content monetization with enterprise-grade features and dedicated support.
          </p>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Get in Touch with Our Sales Team
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Work Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tell us about your needs
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                placeholder="Describe your requirements, expected volume, timeline, etc."
              />
            </div>

            <Button type="submit" className="w-full">
              Request Enterprise Demo
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}

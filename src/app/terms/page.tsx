// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Terms of Service - AI Pay Per Crawl',
  description: 'Read the terms of service for AI Pay Per Crawl. Understand your rights and responsibilities when using our content monetization platform.',
  openGraph: {
    title: 'Terms of Service - AI Pay Per Crawl',
    description: 'Read the terms of service for AI Pay Per Crawl. Understand your rights and responsibilities when using our content monetization platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service - AI Pay Per Crawl',
    description: 'Read the terms of service for AI Pay Per Crawl. Understand your rights and responsibilities when using our content monetization platform.',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo className="h-8 w-auto" />
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="p-8 prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              By accessing and using AI Pay Per Crawl ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              AI Pay Per Crawl is a content monetization platform that enables website owners to charge for AI training data access. 
              The Service provides tools for domain verification, content protection, and payment processing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              3. User Accounts and Registration
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>To use certain features of the Service, you must register for an account. When registering, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              4. Domain Ownership and Verification
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>By claiming a domain through our Service, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You own or have legal authority to control the claimed domain</li>
                <li>You have the right to monetize content on the domain</li>
                <li>Your use of the Service complies with all applicable laws</li>
                <li>You will not use the Service for fraudulent or illegal purposes</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              5. Payment Terms
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>Payment processing is handled through Stripe. By using our payment services, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stripe's Terms of Service and Privacy Policy</li>
                <li>Our fee structure as outlined in your account dashboard</li>
                <li>Automatic processing of payments according to your settings</li>
                <li>Our dispute resolution procedures for payment issues</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Prohibited Uses
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>You may not use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Distribute malware or harmful content</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              7. Privacy and Data Protection
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Privacy Policy
              </Link>
              {' '}to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Termination
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We may terminate or suspend your account and access to the Service at our sole discretion, 
              without prior notice, for conduct that we believe violates these Terms or is harmful to other users, 
              us, or third parties, or for any other reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Contact Information
            </h2>
            <div className="text-slate-600 dark:text-slate-300">
              <p className="mb-2">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="space-y-1">
                <li>Email: <a href="mailto:legal@aipaypercrawl.com" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">legal@aipaypercrawl.com</a></li>
                <li>Support: <Link href="/support" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Visit our support center</Link></li>
              </ul>
            </div>
          </section>
        </Card>

        <div className="mt-8 text-center">
          <Button href="/auth/signup" className="px-8 py-3">
            I Accept - Create Account
          </Button>
        </div>
      </main>
    </div>
  )
} 
// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Pay Per Crawl',
  description: 'Learn how AI Pay Per Crawl protects your privacy. Read our comprehensive privacy policy covering data collection, usage, and your rights.',
  openGraph: {
    title: 'Privacy Policy - AI Pay Per Crawl',
    description: 'Learn how AI Pay Per Crawl protects your privacy. Read our comprehensive privacy policy covering data collection, usage, and your rights.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - AI Pay Per Crawl',
    description: 'Learn how AI Pay Per Crawl protects your privacy. Read our comprehensive privacy policy covering data collection, usage, and your rights.',
  },
}

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="p-8 prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Personal Information</h3>
              <p>We collect information you provide directly to us, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account registration information (name, email, password)</li>
                <li>Domain ownership verification data</li>
                <li>Payment and billing information (processed securely through Stripe)</li>
                <li>Communication preferences and support inquiries</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Automatically Collected Information</h3>
              <p>We automatically collect certain information when you use our Service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>API usage metrics and performance data</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Verify domain ownership and prevent fraud</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>We may share your information in the following circumstances:</p>
              
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Service Providers</h3>
              <p>We work with third-party service providers who perform services on our behalf:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processing (Stripe)</li>
                <li>Email delivery services</li>
                <li>Analytics and monitoring tools</li>
                <li>Cloud hosting and infrastructure</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Legal Requirements</h3>
              <p>We may disclose your information if required by law or in response to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Legal process or government requests</li>
                <li>Enforce our terms and conditions</li>
                <li>Protect the rights, property, or safety of our users</li>
                <li>Investigate fraud or security issues</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              4. Data Security
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and monitoring</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure payment processing through PCI-compliant providers</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              5. Your Rights and Choices
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>You have the following rights regarding your personal information:</p>
              
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Account Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update or correct your account information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Communication Preferences</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Opt out of marketing communications</li>
                <li>Manage notification settings</li>
                <li>Control cookie preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Data Rights (GDPR/CCPA)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Authenticate your account</li>
                <li>Analyze site usage and performance</li>
                <li>Provide personalized content and features</li>
              </ul>
              <p>You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              7. International Data Transfers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Data Retention
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We retain your personal information for as long as necessary to provide our services, 
              comply with legal obligations, resolve disputes, and enforce our agreements. 
              When you delete your account, we will delete or anonymize your personal information within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Our Service is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13. 
              If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us to have the information removed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
              and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Contact Us
            </h2>
            <div className="text-slate-600 dark:text-slate-300">
              <p className="mb-2">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="space-y-1">
                <li>Email: <a href="mailto:privacy@aipaypercrawl.com" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">privacy@aipaypercrawl.com</a></li>
                <li>Support: <Link href="/support" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Visit our support center</Link></li>
                <li>Data Protection Officer: <a href="mailto:dpo@aipaypercrawl.com" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">dpo@aipaypercrawl.com</a></li>
              </ul>
            </div>
          </section>
        </Card>

        <div className="mt-8 text-center">
          <Button href="/auth/signup" className="px-8 py-3">
            I Understand - Create Account
          </Button>
        </div>
      </main>
    </div>
  )
} 
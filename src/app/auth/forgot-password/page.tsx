// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Forgot Password - AI Pay Per Crawl',
  description: 'Reset your AI Pay Per Crawl account password. Enter your email address to receive password reset instructions.',
  openGraph: {
    title: 'Forgot Password - AI Pay Per Crawl',
    description: 'Reset your AI Pay Per Crawl account password. Enter your email address to receive password reset instructions.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Forgot Password - AI Pay Per Crawl',
    description: 'Reset your AI Pay Per Crawl account password. Enter your email address to receive password reset instructions.',
  },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="flex justify-center">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Forgot your password?
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              No worries! Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
                placeholder="Enter your email address"
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Instructions
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Remember your password?{' '}
              <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
                Need additional help?
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Contact our support team at{' '}
                  <a href="mailto:support@aipaypercrawl.com" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    support@aipaypercrawl.com
                  </a>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Or visit our{' '}
                  <Link href="/support" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    support center
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 
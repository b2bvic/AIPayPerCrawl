'use client'

import React from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home,
  Mail
} from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <Link href="/" className="inline-block mb-8">
          <LogoWithText className="h-12" />
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 md:p-12">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Something went wrong!
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            We encountered an unexpected error while processing your request. 
            Our team has been notified and is working to fix the issue.
          </p>

          {error.digest && (
            <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Error Reference: <code className="text-xs font-mono">{error.digest}</code>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => reset()}
              className="inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              href="/"
              className="inline-flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Need immediate assistance?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              If this issue persists or is blocking your work, please contact our support team.
            </p>
            <a
              href="mailto:support@aipaypercrawl.com"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              support@aipaypercrawl.com
            </a>
          </div>
        </div>

        <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>
            You can also check our{' '}
            <a 
              href="https://status.aipaypercrawl.com" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              system status page
            </a>
            {' '}for any ongoing issues.
          </p>
        </div>
      </div>
    </div>
  )
}
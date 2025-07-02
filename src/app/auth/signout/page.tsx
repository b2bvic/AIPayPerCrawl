// [AUTO-GENERATED PAGE: Please review and enrich as needed]
'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function SignOutPage() {
  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <LogoWithText />
        </Link>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          You've been signed out
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Thank you for using AI Pay Per Crawl
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Successfully signed out
          </h2>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Your session has been ended securely. You'll be redirected to the homepage in a few seconds.
          </p>

          <div className="space-y-3">
            <Button href="/" className="w-full">
              Return to Homepage
            </Button>
            
            <Button variant="outline" href="/auth/signin" className="w-full">
              Sign in again
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need help? <Link href="/support" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Contact support</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
} 
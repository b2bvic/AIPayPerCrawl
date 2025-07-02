// [AUTO-GENERATED PAGE: Please review and enrich as needed]
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardClaimDomainPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main claim domain page
    router.push('/claim-domain')
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Redirecting to Domain Claim
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Please wait while we redirect you to the domain claim page...
        </p>
      </div>
    </div>
  )
} 
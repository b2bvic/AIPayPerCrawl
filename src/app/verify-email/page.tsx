'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  ArrowRight,
  RefreshCw
} from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [publisherData, setPublisherData] = useState<any>(null)
  const [isResending, setIsResending] = useState(false)
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid verification link. Please check your email and try again.')
      return
    }

    verifyEmail()
  }, [token, email])

  const verifyEmail = async () => {
    try {
      setStatus('loading')
      
      const response = await fetch(`/api/verify-email?token=${token}&email=${encodeURIComponent(email || '')}`)
      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        setPublisherData(data)
      } else {
        if (data.expired) {
          setStatus('expired')
          setMessage('This verification link has expired. You can request a new one below.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage('An error occurred during verification. Please try again.')
    }
  }

  const resendVerification = async () => {
    if (!email) return

    try {
      setIsResending(true)
      
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('A new verification email has been sent. Please check your inbox.')
      } else {
        if (data.alreadyVerified) {
          setStatus('success')
          setMessage('Your email is already verified!')
        } else {
          setMessage(data.error || 'Failed to resend verification email.')
        }
      }
    } catch (error) {
      console.error('Resend error:', error)
      setMessage('Failed to resend verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'expired':
        return <Clock className="h-16 w-16 text-orange-500" />
      default:
        return <Mail className="h-16 w-16 text-blue-500 animate-pulse" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-700'
      case 'error':
        return 'text-red-700'
      case 'expired':
        return 'text-orange-700'
      default:
        return 'text-blue-700'
    }
  }

  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'expired':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <LogoWithText />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className={`rounded-lg border p-8 text-center ${getBackgroundColor()}`}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
              {status === 'expired' && 'Link Expired'}
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            {/* Publisher Data */}
            {status === 'success' && publisherData && (
              <div className="bg-white rounded-lg p-4 mb-6 border">
                <h3 className="font-semibold text-gray-900 mb-2">Account Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {publisherData.name && (
                    <p><span className="font-medium">Name:</span> {publisherData.name}</p>
                  )}
                  <p><span className="font-medium">Email:</span> {publisherData.email}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Verified</span></p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {status === 'success' && (
                <div className="space-y-3">
                  <Button href="/dashboard" className="w-full">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" href="/" className="w-full">
                    Back to Home
                  </Button>
                </div>
              )}

              {status === 'expired' && email && (
                <div className="space-y-3">
                  <Button 
                    onClick={resendVerification}
                    disabled={isResending}
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send New Verification Email
                      </>
                    )}
                  </Button>
                  <Button variant="outline" href="/" className="w-full">
                    Back to Home
                  </Button>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-3">
                  <Button onClick={() => window.location.reload()} className="w-full">
                    Try Again
                  </Button>
                  <Button variant="outline" href="/support" className="w-full">
                    Contact Support
                  </Button>
                  <Button variant="outline" href="/" className="w-full">
                    Back to Home
                  </Button>
                </div>
              )}

              {status === 'loading' && (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-10 bg-blue-200 rounded-lg"></div>
                  </div>
                  <Button variant="outline" href="/" className="w-full">
                    Back to Home
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? {' '}
              <Link href="/support" className="text-blue-600 hover:text-blue-500 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
} 
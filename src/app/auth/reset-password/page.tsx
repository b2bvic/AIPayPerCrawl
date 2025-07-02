'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!token) {
      setResetStatus('error')
      setErrors({ token: 'Invalid or missing reset token. Please request a new password reset.' })
    }
  }, [token])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // API call to reset password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          password: formData.password
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setResetStatus('success')
      } else {
        setResetStatus('error')
        setErrors({ submit: result.error || 'Failed to reset password. Please try again.' })
      }
    } catch (error) {
      setResetStatus('error')
      setErrors({ submit: 'Failed to reset password. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <LogoWithText className="h-12" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {resetStatus === 'success' ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Password Reset Successful
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Button href="/auth/signin" className="w-full">
                Sign In
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Reset Your Password
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Enter your new password below
              </p>

              {errors.token && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800 dark:text-red-300">{errors.token}</p>
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-sm text-red-700 dark:text-red-400 underline hover:no-underline mt-1 inline-block"
                      >
                        Request new reset link
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`block w-full pl-10 pr-10 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-slate-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                      placeholder="Enter new password"
                      disabled={!!errors.token || isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={!!errors.token || isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`block w-full pl-10 pr-10 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-slate-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                      placeholder="Confirm new password"
                      disabled={!!errors.token || isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={!!errors.token || isSubmitting}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password Requirements:
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                      • At least 8 characters long
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
                      • At least one uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
                      • At least one lowercase letter
                    </li>
                    <li className={/\d/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}>
                      • At least one number
                    </li>
                  </ul>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-800 dark:text-red-300">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!!errors.token || isSubmitting}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  href="/auth/signin" 
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
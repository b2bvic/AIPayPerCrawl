'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ClaimFormData {
  domain: string
  email: string
  contactName: string
  organization: string
  reason: string
  requestedPrice: number
  currency: string
}

interface ClaimResponse {
  success: boolean
  claimId: string
  domain: string
  status: string
  txtChallenge: {
    recordName: string
    recordValue: string
    expiresAt: string
  }
  instructions: string[]
  verificationUrl: string
  message: string
  error?: string
}

export default function ClaimDomainPage() {
  const [formData, setFormData] = useState<ClaimFormData>({
    domain: '',
    email: '',
    contactName: '',
    organization: '',
    reason: '',
    requestedPrice: 0.01,
    currency: 'USD'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [claimResponse, setClaimResponse] = useState<ClaimResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/claim-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setClaimResponse(data)
      } else {
        setError(data.error || 'Failed to create claim')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'requestedPrice' ? parseFloat(value) || 0 : value
    }))
  }

  if (claimResponse) {
    return (
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Domain Claim Created Successfully! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Your claim for <strong>{claimResponse.domain}</strong> has been submitted.
            </p>
          </div>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Next Steps: Verify Domain Ownership</h2>
            <p className="text-gray-600 mb-6">
              To complete your claim, you need to add a TXT record to your DNS to prove you own the domain.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">DNS Record Details:</h3>
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="font-semibold">Record Type:</span> TXT
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {claimResponse.txtChallenge.recordName}
                </div>
                <div>
                  <span className="font-semibold">Value:</span> 
                  <div className="bg-white border rounded p-2 mt-1 break-all">
                    {claimResponse.txtChallenge.recordValue}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Instructions for Common DNS Providers:</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">Cloudflare</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Log into your Cloudflare dashboard</li>
                    <li>Select your domain ({formData.domain})</li>
                    <li>Go to DNS → Records</li>
                    <li>Click "Add record"</li>
                    <li>Type: TXT</li>
                    <li>Name: _aipaypercrawl-verify</li>
                    <li>Content: {claimResponse.txtChallenge.recordValue}</li>
                    <li>Click "Save"</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-green-600 mb-2">GoDaddy</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Log into your GoDaddy account</li>
                    <li>Go to My Products → DNS</li>
                    <li>Click "Add" under Records</li>
                    <li>Type: TXT</li>
                    <li>Host: _aipaypercrawl-verify</li>
                    <li>TXT Value: {claimResponse.txtChallenge.recordValue}</li>
                    <li>Click "Save"</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Note:</strong> DNS propagation can take up to 24 hours, but usually completes within 1-2 hours.
                You can verify your claim once the TXT record is active.
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.open(claimResponse.verificationUrl, '_blank')}
                className="mr-4"
              >
                Verify Domain Ownership
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(claimResponse.txtChallenge.recordValue)
                  alert('TXT record value copied to clipboard!')
                }}
              >
                Copy TXT Value
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Claim ID: <code className="bg-gray-100 px-2 py-1 rounded">{claimResponse.claimId}</code></p>
              <p>Save this ID to check your claim status later.</p>
            </div>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Claim Your Domain
          </h1>
          <p className="text-xl text-gray-600">
            Join the Pay Per Crawl ecosystem and start monetizing your content
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domain Name *
              </label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your domain without http:// or www.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll send verification instructions to this email.
              </p>
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="John Smith"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organization (Optional)
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="Your Company Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="requestedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Price per Request
                </label>
                <input
                  type="number"
                  id="requestedPrice"
                  name="requestedPrice"
                  value={formData.requestedPrice}
                  onChange={handleInputChange}
                  min="0.001"
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Claiming (Optional)
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
                placeholder="Why are you claiming this domain? Any additional context..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>You'll receive a TXT record to add to your DNS</li>
                <li>We'll verify you own the domain</li>
                <li>Our team will review your claim (1-2 business days)</li>
                <li>Once approved, you can set your Pay Per Crawl pricing</li>
                <li>Start earning from AI crawlers accessing your content</li>
              </ol>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating Claim...' : 'Claim Domain'}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Already have a claim? <a href="/verify-claim" className="text-blue-600 hover:underline">Check your status</a>
          </p>
        </div>
      </div>
    </Container>
  )
} 
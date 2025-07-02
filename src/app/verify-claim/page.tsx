'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ClaimStatus {
  success: boolean
  claimId: string
  domain: string
  status: string
  email: string
  contactName: string
  organization?: string
  submittedAt: string
  verifiedAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  txtChallenge?: {
    recordName: string
    recordValue: string
    expiresAt: string
  }
  currentStep: string
  nextSteps: string[]
  canRetry: boolean
  error?: string
}

interface VerificationResult {
  success: boolean
  verified: boolean
  claimId: string
  domain: string
  status?: string
  message?: string
  error?: string
  nextSteps?: string[]
  expectedValue?: string
  actualValue?: string
}

export default function VerifyClaimPage() {
  const [claimId, setClaimId] = useState('')
  const [claimStatus, setClaimStatus] = useState<ClaimStatus | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimId.trim()) return

    setIsLoading(true)
    setError(null)
    setVerificationResult(null)

    try {
      const response = await fetch(`/api/claim-domain?claimId=${encodeURIComponent(claimId.trim())}`)
      const data = await response.json()

      if (data.success) {
        setClaimStatus(data)
      } else {
        setError(data.error || 'Failed to get claim status')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyDomain = async () => {
    if (!claimStatus) return

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      const response = await fetch(`/api/claim-domain?claimId=${claimStatus.claimId}&action=verify`)
      const data = await response.json()
      
      setVerificationResult(data)
      
      // Refresh claim status if verification was successful
      if (data.verified) {
        setTimeout(() => {
          handleCheckStatus(new Event('submit') as any)
        }, 1000)
      }
    } catch (err) {
      setVerificationResult({
        success: false,
        verified: false,
        claimId: claimStatus.claimId,
        domain: claimStatus.domain,
        error: 'Network error. Please try again.'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'verified': return 'text-blue-600 bg-blue-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Domain Claim
          </h1>
          <p className="text-xl text-gray-600">
            Check your claim status and verify domain ownership
          </p>
        </div>

        <Card className="p-8 mb-8">
          <form onSubmit={handleCheckStatus} className="space-y-4">
            <div>
              <label htmlFor="claimId" className="block text-sm font-medium text-gray-700 mb-2">
                Claim ID
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  id="claimId"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  placeholder="claim_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !claimId.trim()}
                >
                  {isLoading ? 'Checking...' : 'Check Status'}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter the claim ID you received when you submitted your domain claim.
              </p>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </Card>

        {claimStatus && (
          <Card className="p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{claimStatus.domain}</h2>
                <p className="text-gray-600">Claim submitted by {claimStatus.contactName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claimStatus.status)}`}>
                {claimStatus.status.charAt(0).toUpperCase() + claimStatus.status.slice(1)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Claim Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Email:</span> {claimStatus.email}</div>
                  <div><span className="font-medium">Contact:</span> {claimStatus.contactName}</div>
                  {claimStatus.organization && (
                    <div><span className="font-medium">Organization:</span> {claimStatus.organization}</div>
                  )}
                  <div><span className="font-medium">Submitted:</span> {formatDate(claimStatus.submittedAt)}</div>
                  {claimStatus.verifiedAt && (
                    <div><span className="font-medium">Verified:</span> {formatDate(claimStatus.verifiedAt)}</div>
                  )}
                  {claimStatus.approvedAt && (
                    <div><span className="font-medium">Approved:</span> {formatDate(claimStatus.approvedAt)}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Current Status</h3>
                <p className="text-sm text-gray-600 mb-3">{claimStatus.currentStep}</p>
                
                {claimStatus.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm">
                      <span className="font-medium">Rejection Reason:</span> {claimStatus.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {claimStatus.txtChallenge && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">DNS Verification Required</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 mb-3">
                    Add this TXT record to your DNS to verify domain ownership:
                  </p>
                  <div className="font-mono text-sm space-y-1">
                    <div><span className="font-semibold">Type:</span> TXT</div>
                    <div><span className="font-semibold">Name:</span> {claimStatus.txtChallenge.recordName}</div>
                    <div><span className="font-semibold">Value:</span></div>
                    <div className="bg-white border rounded p-2 break-all">
                      {claimStatus.txtChallenge.recordValue}
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-3">
                    <Button
                      onClick={handleVerifyDomain}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Domain'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(claimStatus.txtChallenge!.recordValue)
                        alert('TXT record value copied to clipboard!')
                      }}
                    >
                      Copy TXT Value
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {verificationResult && (
              <div className="mb-6">
                <div className={`border rounded-lg p-4 ${
                  verificationResult.verified 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    verificationResult.verified ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult.verified ? '✅ Verification Successful!' : '❌ Verification Failed'}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    verificationResult.verified ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationResult.message || verificationResult.error}
                  </p>
                  
                  {verificationResult.nextSteps && (
                    <div>
                      <p className="font-medium text-sm mb-2">Next Steps:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {verificationResult.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {verificationResult.expectedValue && verificationResult.actualValue && (
                    <div className="mt-3 text-xs font-mono">
                      <div>Expected: {verificationResult.expectedValue}</div>
                      <div>Found: {verificationResult.actualValue}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Next Steps</h3>
              <ul className="space-y-2">
                {claimStatus.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {claimStatus.status === 'approved' && (
              <div className="mt-6 text-center">
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Manage Your Domain
                </Button>
              </div>
            )}
          </Card>
        )}

        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold mb-3">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Common Issues:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• DNS changes can take up to 24 hours to propagate</li>
                <li>• Make sure the TXT record value matches exactly</li>
                <li>• Some DNS providers require the full record name</li>
                <li>• Try verifying again after a few hours</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Contact Support:</h4>
              <p className="text-gray-600">
                If you're having trouble with verification, please contact us at{' '}
                <a href="mailto:support@aipaypercrawl.com" className="text-blue-600 hover:underline">
                  support@aipaypercrawl.com
                </a>{' '}
                with your claim ID.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
} 
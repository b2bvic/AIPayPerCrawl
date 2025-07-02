import { z } from 'zod'

// Schema for domain claim request
export const DomainClaimRequestSchema = z.object({
  domain: z.string().min(1),
  email: z.string().email(),
  contactName: z.string().min(1),
  organization: z.string().optional(),
  reason: z.string().optional(),
  requestedPrice: z.number().positive().optional(),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
})

export type DomainClaimRequest = z.infer<typeof DomainClaimRequestSchema>

// Schema for TXT verification challenge
export const TXTChallengeSchema = z.object({
  domain: z.string(),
  challenge: z.string(),
  recordName: z.string(),
  recordValue: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
  verified: z.boolean(),
  verifiedAt: z.string().optional(),
})

export type TXTChallenge = z.infer<typeof TXTChallengeSchema>

// Schema for claim status
export const ClaimStatusSchema = z.object({
  claimId: z.string(),
  domain: z.string(),
  status: z.enum(['pending', 'txt_verification', 'verified', 'approved', 'rejected']),
  email: z.string(),
  contactName: z.string(),
  organization: z.string().optional(),
  txtChallenge: TXTChallengeSchema.optional(),
  submittedAt: z.string(),
  verifiedAt: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
})

export type ClaimStatus = z.infer<typeof ClaimStatusSchema>

/**
 * Generate a unique TXT verification challenge
 */
export function generateTXTChallenge(domain: string): TXTChallenge {
  const challenge = `aipaypercrawl-verify-${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`
  const recordName = `_aipaypercrawl-verify.${domain}`
  const recordValue = challenge
  const createdAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

  return {
    domain,
    challenge,
    recordName,
    recordValue,
    createdAt,
    expiresAt,
    verified: false,
  }
}

/**
 * Verify TXT record exists for domain claim
 */
export async function verifyTXTChallenge(domain: string, expectedChallenge: string): Promise<{
  verified: boolean
  actualValue?: string
  error?: string
}> {
  try {
    const recordName = `_aipaypercrawl-verify.${domain}`
    
    // Use DNS over HTTPS for TXT record lookup
    const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`, {
      headers: {
        'Accept': 'application/dns-json',
      },
    })

    if (!dnsResponse.ok) {
      return {
        verified: false,
        error: 'DNS lookup failed'
      }
    }

    const dnsData = await dnsResponse.json()
    
    if (!dnsData.Answer || dnsData.Answer.length === 0) {
      return {
        verified: false,
        error: 'No TXT record found'
      }
    }

    // Check if any TXT record matches our challenge
    for (const record of dnsData.Answer) {
      if (record.type === 16) { // TXT record type
        const txtValue = record.data.replace(/"/g, '') // Remove quotes
        if (txtValue === expectedChallenge) {
          return {
            verified: true,
            actualValue: txtValue
          }
        }
      }
    }

    return {
      verified: false,
      actualValue: dnsData.Answer[0]?.data,
      error: 'TXT record value does not match challenge'
    }
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Create a domain claim request
 */
export async function createDomainClaim(
  request: DomainClaimRequest,
  storeChallenge: (claimId: string, challenge: TXTChallenge) => Promise<void>
): Promise<{
  claimId: string
  txtChallenge: TXTChallenge
  instructions: string[]
}> {
  const claimId = `claim_${crypto.randomUUID()}`
  const txtChallenge = generateTXTChallenge(request.domain)

  // Store the challenge for later verification
  await storeChallenge(claimId, txtChallenge)

  const instructions = [
    `Add the following TXT record to your DNS:`,
    ``,
    `Record Type: TXT`,
    `Name: ${txtChallenge.recordName}`,
    `Value: ${txtChallenge.recordValue}`,
    ``,
    `Instructions for common DNS providers:`,
    ``,
    `Cloudflare:`,
    `1. Log into your Cloudflare dashboard`,
    `2. Select your domain (${request.domain})`,
    `3. Go to DNS > Records`,
    `4. Click "Add record"`,
    `5. Type: TXT`,
    `6. Name: _aipaypercrawl-verify`,
    `7. Content: ${txtChallenge.recordValue}`,
    `8. Click "Save"`,
    ``,
    `GoDaddy:`,
    `1. Log into your GoDaddy account`,
    `2. Go to My Products > DNS`,
    `3. Click "Add" under Records`,
    `4. Type: TXT`,
    `5. Host: _aipaypercrawl-verify`,
    `6. TXT Value: ${txtChallenge.recordValue}`,
    `7. Click "Save"`,
    ``,
    `Google Domains:`,
    `1. Log into Google Domains`,
    `2. Select your domain`,
    `3. Go to DNS settings`,
    `4. Scroll to Custom resource records`,
    `5. Name: _aipaypercrawl-verify`,
    `6. Type: TXT`,
    `7. Data: ${txtChallenge.recordValue}`,
    `8. Click "Add"`,
    ``,
    `Note: DNS propagation can take up to 24 hours, but usually completes within 1-2 hours.`,
    `You can verify your claim once the TXT record is active.`
  ]

  return {
    claimId,
    txtChallenge,
    instructions
  }
}

/**
 * Verify a domain claim using TXT challenge
 */
export async function verifyDomainClaim(
  claimId: string,
  getChallenge: (claimId: string) => Promise<TXTChallenge | null>,
  updateClaimStatus: (claimId: string, status: Partial<ClaimStatus>) => Promise<void>
): Promise<{
  success: boolean
  verified: boolean
  error?: string
  nextSteps?: string[]
}> {
  const challenge = await getChallenge(claimId)
  
  if (!challenge) {
    return {
      success: false,
      verified: false,
      error: 'Claim not found or expired'
    }
  }

  // Check if challenge has expired
  if (new Date() > new Date(challenge.expiresAt)) {
    return {
      success: false,
      verified: false,
      error: 'Verification challenge has expired. Please request a new claim.'
    }
  }

  // Verify the TXT record
  const verification = await verifyTXTChallenge(challenge.domain, challenge.recordValue)

  if (verification.verified) {
    // Update challenge as verified
    const verifiedChallenge = {
      ...challenge,
      verified: true,
      verifiedAt: new Date().toISOString()
    }

    await updateClaimStatus(claimId, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      txtChallenge: verifiedChallenge
    })

    return {
      success: true,
      verified: true,
      nextSteps: [
        'Domain ownership verified successfully!',
        'Your claim is now under review.',
        'You will receive an email notification when your claim is approved.',
        'Approved claims typically process within 1-2 business days.',
        'You can check your claim status anytime using your claim ID.'
      ]
    }
  } else {
    return {
      success: true,
      verified: false,
      error: verification.error,
      nextSteps: [
        'TXT record verification failed.',
        verification.error === 'No TXT record found' 
          ? 'Please ensure you have added the TXT record to your DNS.'
          : 'Please check that the TXT record value matches exactly.',
        'DNS changes can take up to 24 hours to propagate.',
        'You can retry verification once the DNS record is active.',
        `Expected value: ${challenge.recordValue}`,
        verification.actualValue ? `Found value: ${verification.actualValue}` : 'No TXT record found'
      ]
    }
  }
}

/**
 * Get claim status and next steps
 */
export function getClaimNextSteps(status: ClaimStatus): {
  currentStep: string
  nextSteps: string[]
  canRetry: boolean
} {
  switch (status.status) {
    case 'pending':
      return {
        currentStep: 'Waiting for TXT record verification',
        nextSteps: [
          'Add the TXT record to your DNS',
          'Wait for DNS propagation (1-24 hours)',
          'Click "Verify" to check your TXT record'
        ],
        canRetry: true
      }

    case 'txt_verification':
      return {
        currentStep: 'TXT record verification in progress',
        nextSteps: [
          'Ensure your TXT record is properly configured',
          'DNS propagation may still be in progress',
          'Retry verification if needed'
        ],
        canRetry: true
      }

    case 'verified':
      return {
        currentStep: 'Domain verified, claim under review',
        nextSteps: [
          'Your domain ownership has been verified',
          'Our team is reviewing your claim',
          'You will receive an email when approved',
          'Review typically takes 1-2 business days'
        ],
        canRetry: false
      }

    case 'approved':
      return {
        currentStep: 'Claim approved - domain is yours!',
        nextSteps: [
          'Congratulations! Your domain claim has been approved',
          'You can now manage your Pay Per Crawl settings',
          'Set your pricing and crawl policies',
          'Monitor your earnings in the dashboard'
        ],
        canRetry: false
      }

    case 'rejected':
      return {
        currentStep: 'Claim rejected',
        nextSteps: [
          `Rejection reason: ${status.rejectionReason || 'Not specified'}`,
          'You can submit a new claim with additional information',
          'Contact support if you believe this was an error'
        ],
        canRetry: true
      }

    default:
      return {
        currentStep: 'Unknown status',
        nextSteps: ['Contact support for assistance'],
        canRetry: false
      }
  }
}

/**
 * Generate email templates for different claim statuses
 */
export function generateClaimEmailTemplate(status: ClaimStatus, type: 'verification' | 'approved' | 'rejected'): {
  subject: string
  html: string
  text: string
} {
  const baseUrl = 'https://aipaypercrawl.com'
  
  switch (type) {
    case 'verification':
      return {
        subject: `Verify your domain claim for ${status.domain}`,
        html: `
          <h2>Verify Your Domain Claim</h2>
          <p>Hello ${status.contactName},</p>
          <p>Thank you for claiming <strong>${status.domain}</strong> on AI Pay Per Crawl.</p>
          <p>To complete your claim, please add the following TXT record to your DNS:</p>
          <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; font-family: monospace;">
            <strong>Record Type:</strong> TXT<br>
            <strong>Name:</strong> ${status.txtChallenge?.recordName}<br>
            <strong>Value:</strong> ${status.txtChallenge?.recordValue}
          </div>
          <p><a href="${baseUrl}/verify-claim/${status.claimId}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Domain</a></p>
          <p>DNS changes can take up to 24 hours to propagate. You can verify your claim once the TXT record is active.</p>
          <p>Claim ID: ${status.claimId}</p>
        `,
        text: `
Verify Your Domain Claim

Hello ${status.contactName},

Thank you for claiming ${status.domain} on AI Pay Per Crawl.

To complete your claim, please add the following TXT record to your DNS:

Record Type: TXT
Name: ${status.txtChallenge?.recordName}
Value: ${status.txtChallenge?.recordValue}

Verify your claim at: ${baseUrl}/verify-claim/${status.claimId}

DNS changes can take up to 24 hours to propagate. You can verify your claim once the TXT record is active.

Claim ID: ${status.claimId}
        `
      }

    case 'approved':
      return {
        subject: `Domain claim approved for ${status.domain}`,
        html: `
          <h2>Domain Claim Approved! 🎉</h2>
          <p>Hello ${status.contactName},</p>
          <p>Great news! Your claim for <strong>${status.domain}</strong> has been approved.</p>
          <p>You can now:</p>
          <ul>
            <li>Set your Pay Per Crawl pricing</li>
            <li>Configure crawl policies</li>
            <li>Monitor your earnings</li>
            <li>Manage access permissions</li>
          </ul>
          <p><a href="${baseUrl}/dashboard" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Manage Your Domain</a></p>
          <p>Welcome to the Pay Per Crawl ecosystem!</p>
        `,
        text: `
Domain Claim Approved!

Hello ${status.contactName},

Great news! Your claim for ${status.domain} has been approved.

You can now:
- Set your Pay Per Crawl pricing
- Configure crawl policies  
- Monitor your earnings
- Manage access permissions

Manage your domain at: ${baseUrl}/dashboard

Welcome to the Pay Per Crawl ecosystem!
        `
      }

    case 'rejected':
      return {
        subject: `Domain claim update for ${status.domain}`,
        html: `
          <h2>Domain Claim Update</h2>
          <p>Hello ${status.contactName},</p>
          <p>We've reviewed your claim for <strong>${status.domain}</strong>.</p>
          <p>Unfortunately, we cannot approve this claim at this time.</p>
          <p><strong>Reason:</strong> ${status.rejectionReason || 'Additional verification required'}</p>
          <p>You can submit a new claim with additional information or contact our support team if you believe this was an error.</p>
          <p><a href="${baseUrl}/claim-domain" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Submit New Claim</a></p>
          <p>Thank you for your interest in Pay Per Crawl.</p>
        `,
        text: `
Domain Claim Update

Hello ${status.contactName},

We've reviewed your claim for ${status.domain}.

Unfortunately, we cannot approve this claim at this time.

Reason: ${status.rejectionReason || 'Additional verification required'}

You can submit a new claim with additional information or contact our support team if you believe this was an error.

Submit a new claim at: ${baseUrl}/claim-domain

Thank you for your interest in Pay Per Crawl.
        `
      }

    default:
      throw new Error(`Unknown email type: ${type}`)
  }
} 
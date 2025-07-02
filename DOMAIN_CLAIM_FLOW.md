# Domain Claim Flow with TXT Challenge

## Overview

The domain claim flow allows publishers to claim ownership of their domains and join the Pay Per Crawl ecosystem. This secure process uses DNS TXT record verification to prove domain ownership.

## 🔄 Complete Workflow

### 1. **Claim Submission**
Publisher submits a domain claim with:
- Domain name
- Contact information
- Organization details
- Requested pricing
- Reason for claiming

### 2. **TXT Challenge Generation**
System generates a unique TXT record:
```
Record Type: TXT
Name: _aipaypercrawl-verify.example.com
Value: aipaypercrawl-verify-a1b2c3d4e5f6g7h8
```

### 3. **DNS Configuration**
Publisher adds the TXT record to their DNS:
- **Cloudflare**: DNS → Records → Add TXT record
- **GoDaddy**: My Products → DNS → Add TXT record
- **Google Domains**: DNS settings → Custom resource records

### 4. **Domain Verification**
System verifies TXT record via DNS lookup:
- Uses Cloudflare DNS over HTTPS
- Checks for exact value match
- Updates claim status to "verified"

### 5. **Admin Review**
Manual review process:
- Verify legitimacy of claim
- Check domain authority
- Approve or reject with reason

### 6. **Domain Activation**
Approved domains are added to the directory:
- Pay Per Crawl enabled
- Pricing configured
- Publisher dashboard access

## 🏗️ Technical Implementation

### Database Schema

```sql
CREATE TABLE domain_claims (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  organization TEXT,
  reason TEXT,
  requested_price REAL DEFAULT 0.01,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  txt_challenge TEXT NOT NULL,
  txt_record_name TEXT NOT NULL,
  txt_record_value TEXT NOT NULL,
  challenge_expires_at TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  verified_at TEXT,
  approved_at TEXT,
  rejected_at TEXT,
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### API Endpoints

#### POST `/api/claim-domain`
Create a new domain claim
```json
{
  "domain": "example.com",
  "email": "publisher@example.com",
  "contactName": "John Smith",
  "organization": "Example Media",
  "reason": "Want to monetize our content",
  "requestedPrice": 0.02,
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "claimId": "claim_12345678-1234-1234-1234-123456789abc",
  "domain": "example.com",
  "status": "pending",
  "txtChallenge": {
    "recordName": "_aipaypercrawl-verify.example.com",
    "recordValue": "aipaypercrawl-verify-a1b2c3d4e5f6g7h8",
    "expiresAt": "2024-01-02T12:00:00Z"
  },
  "instructions": ["Add the following TXT record...", "..."],
  "verificationUrl": "https://aipaypercrawl.com/verify-claim/claim_12345...",
  "message": "Domain claim created successfully..."
}
```

#### GET `/api/claim-domain?claimId=xxx`
Get claim status
```json
{
  "success": true,
  "claimId": "claim_12345...",
  "domain": "example.com",
  "status": "pending",
  "email": "publisher@example.com",
  "contactName": "John Smith",
  "submittedAt": "2024-01-01T12:00:00Z",
  "currentStep": "Waiting for TXT record verification",
  "nextSteps": [
    "Add the TXT record to your DNS",
    "Wait for DNS propagation (1-24 hours)",
    "Click 'Verify' to check your TXT record"
  ],
  "canRetry": true,
  "txtChallenge": {
    "recordName": "_aipaypercrawl-verify.example.com",
    "recordValue": "aipaypercrawl-verify-a1b2c3d4e5f6g7h8",
    "expiresAt": "2024-01-02T12:00:00Z"
  }
}
```

#### GET `/api/claim-domain?claimId=xxx&action=verify`
Verify domain ownership
```json
{
  "success": true,
  "verified": true,
  "claimId": "claim_12345...",
  "domain": "example.com",
  "status": "verified",
  "message": "Domain ownership verified successfully!",
  "nextSteps": [
    "Domain ownership verified successfully!",
    "Your claim is now under review.",
    "You will receive an email notification when approved.",
    "Approved claims typically process within 1-2 business days."
  ]
}
```

#### PUT `/api/claim-domain` (Admin)
Update claim status
```json
{
  "claimId": "claim_12345...",
  "status": "approved",
  "rejectionReason": null
}
```

### Core Services

#### `src/lib/webAgent/domainClaim.ts`
- `generateTXTChallenge()` - Creates unique verification challenge
- `verifyTXTChallenge()` - DNS lookup and verification
- `createDomainClaim()` - Complete claim creation flow
- `verifyDomainClaim()` - Complete verification flow
- `getClaimNextSteps()` - Status-based guidance
- `generateClaimEmailTemplate()` - Email notifications

#### DNS Verification Process
```javascript
// DNS over HTTPS lookup
const dnsResponse = await fetch(
  `https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`,
  { headers: { 'Accept': 'application/dns-json' } }
);

// Parse and verify TXT records
const dnsData = await dnsResponse.json();
for (const record of dnsData.Answer) {
  if (record.type === 16) { // TXT record
    const txtValue = record.data.replace(/"/g, '');
    if (txtValue === expectedChallenge) {
      return { verified: true };
    }
  }
}
```

## 🎨 Frontend Components

### `/claim-domain` - Claim Submission Page
- Form for domain claim details
- Real-time validation
- DNS instruction generation
- Success state with TXT record details

### `/verify-claim` - Verification Page
- Claim status lookup by ID
- TXT record verification
- Progress tracking
- Help and troubleshooting

### Key Features:
- **Real-time status updates**
- **Copy-to-clipboard TXT values**
- **Provider-specific DNS instructions**
- **Visual progress indicators**
- **Error handling and guidance**

## 📧 Email Notifications

### Verification Email
Sent when claim is created:
```html
<h2>Verify Your Domain Claim</h2>
<p>Add this TXT record to your DNS:</p>
<div style="font-family: monospace;">
  Record Type: TXT<br>
  Name: _aipaypercrawl-verify.example.com<br>
  Value: aipaypercrawl-verify-a1b2c3d4e5f6g7h8
</div>
<a href="https://aipaypercrawl.com/verify-claim/claim_123">Verify Domain</a>
```

### Approval Email
Sent when claim is approved:
```html
<h2>Domain Claim Approved! 🎉</h2>
<p>Your claim for example.com has been approved.</p>
<ul>
  <li>Set your Pay Per Crawl pricing</li>
  <li>Configure crawl policies</li>
  <li>Monitor your earnings</li>
</ul>
<a href="https://aipaypercrawl.com/dashboard">Manage Your Domain</a>
```

## 🔒 Security Features

### TXT Challenge Security
- **Unique tokens** - Cryptographically random challenges
- **Time-limited** - 24-hour expiration
- **Domain-specific** - Tied to exact domain
- **Single-use** - Cannot be reused

### DNS Verification
- **Multiple providers** - Cloudflare DNS over HTTPS
- **Exact matching** - Precise value verification
- **Error handling** - Graceful failure modes
- **Retry logic** - Handle DNS propagation delays

### Access Control
- **Claim ownership** - Only claimant can verify
- **Admin approval** - Manual review process
- **Email verification** - Contact validation
- **Audit trail** - Complete activity logging

## 🎯 Status Lifecycle

```
pending → verified → approved → active
    ↓         ↓         ↓
 rejected  rejected  rejected
```

### Status Descriptions:
- **pending** - TXT record needs to be added
- **verified** - Domain ownership confirmed, awaiting review
- **approved** - Claim approved, domain active in directory
- **rejected** - Claim denied with reason

## 🧪 Testing

### Test Script: `test-domain-claim.js`
```bash
node test-domain-claim.js
```

Tests complete workflow:
1. ✅ Domain claim creation
2. ✅ Claim status retrieval
3. ✅ TXT record verification
4. ✅ Admin approval workflow
5. ✅ Final status confirmation

### Manual Testing Checklist:
- [ ] Create claim via frontend form
- [ ] Receive email with TXT record
- [ ] Add TXT record to test domain DNS
- [ ] Verify domain ownership
- [ ] Check status updates
- [ ] Test admin approval flow

## 🚀 Deployment Checklist

### Database Migration:
```sql
-- Add domain_claims table
-- Add indexes for performance
-- Update existing domains table if needed
```

### Environment Variables:
```env
RESEND_API_KEY=re_xxx  # For email notifications
CLOUDFLARE_DNS_API=xxx # For DNS verification
```

### API Deployment:
- Deploy `/api/claim-domain` endpoint
- Test with sample domain
- Verify DNS lookup functionality
- Configure email service

### Frontend Deployment:
- Deploy claim and verification pages
- Test form submissions
- Verify TXT record display
- Test responsive design

## 📊 Analytics & Monitoring

### Key Metrics:
- **Claim submission rate**
- **Verification success rate**
- **DNS propagation time**
- **Approval/rejection ratio**
- **Time to completion**

### Events Tracked:
- `domain_claim_created`
- `domain_claim_verified`
- `domain_claim_approved`
- `domain_claim_rejected`

## 🎉 Success Criteria

✅ **Publishers can claim domains securely**
✅ **DNS-based ownership verification**
✅ **Automated verification workflow**
✅ **Admin review and approval process**
✅ **Email notifications at each step**
✅ **Complete audit trail**
✅ **Integration with Pay Per Crawl pricing**

The domain claim flow provides a secure, user-friendly way for publishers to join the Pay Per Crawl ecosystem while maintaining strong verification standards. 
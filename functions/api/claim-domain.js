// Cloudflare Worker function for /api/claim-domain
export async function onRequest(context) {
  const { request, env, params } = context;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // POST method - create new domain claim
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { domain, email, contactName, organization, reason, requestedPrice, currency } = body;

      // Validate required fields
      if (!domain || !email || !contactName) {
        return new Response(
          JSON.stringify({ error: 'Domain, email, and contact name are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if domain is already claimed
      const existingClaim = await env.DB.prepare(
        'SELECT id, status FROM domain_claims WHERE domain = ? AND status IN (?, ?, ?)'
      ).bind(domain, 'verified', 'approved', 'pending').first();

      if (existingClaim) {
        const statusMessage = existingClaim.status === 'approved' 
          ? 'This domain has already been claimed and approved.'
          : existingClaim.status === 'verified'
          ? 'This domain has a pending claim under review.'
          : 'This domain already has a pending claim.';
          
        return new Response(
          JSON.stringify({ error: statusMessage }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Import domain claim service
      const { createDomainClaim, generateTXTChallenge } = await import('../../src/lib/webAgent/domainClaim.ts');

      const claimId = `claim_${crypto.randomUUID()}`;
      const txtChallenge = generateTXTChallenge(domain);
      const now = new Date().toISOString();

      // Store claim in database
      await env.DB.prepare(`
        INSERT INTO domain_claims 
        (id, domain, email, contact_name, organization, reason, requested_price, currency, 
         status, txt_challenge, txt_record_name, txt_record_value, challenge_expires_at, 
         submitted_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        claimId,
        domain,
        email,
        contactName,
        organization || '',
        reason || '',
        requestedPrice || 0.01,
        currency || 'USD',
        'pending',
        txtChallenge.challenge,
        txtChallenge.recordName,
        txtChallenge.recordValue,
        txtChallenge.expiresAt,
        now,
        now,
        now
      ).run();

      // Generate DNS instructions
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
        `2. Select your domain (${domain})`,
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
      ];

      // Send verification email if email service is configured
      if (env.RESEND_API_KEY) {
        try {
          const emailTemplate = {
            subject: `Verify your domain claim for ${domain}`,
            html: `
              <h2>Verify Your Domain Claim</h2>
              <p>Hello ${contactName},</p>
              <p>Thank you for claiming <strong>${domain}</strong> on AI Pay Per Crawl.</p>
              <p>To complete your claim, please add the following TXT record to your DNS:</p>
              <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; font-family: monospace;">
                <strong>Record Type:</strong> TXT<br>
                <strong>Name:</strong> ${txtChallenge.recordName}<br>
                <strong>Value:</strong> ${txtChallenge.recordValue}
              </div>
              <p><a href="https://aipaypercrawl.com/verify-claim/${claimId}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Domain</a></p>
              <p>DNS changes can take up to 24 hours to propagate. You can verify your claim once the TXT record is active.</p>
              <p>Claim ID: ${claimId}</p>
            `
          };

          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'noreply@aipaypercrawl.com',
              to: email,
              subject: emailTemplate.subject,
              html: emailTemplate.html,
            }),
          });

          if (!emailResponse.ok) {
            console.error('Failed to send verification email:', await emailResponse.text());
          }
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
        }
      }

      // Log claim creation event
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        'domain_claim_created',
        JSON.stringify({
          claimId,
          domain,
          email,
          organization: organization || null
        }),
        now
      ).run();

      return new Response(JSON.stringify({
        success: true,
        claimId,
        domain,
        status: 'pending',
        txtChallenge: {
          recordName: txtChallenge.recordName,
          recordValue: txtChallenge.recordValue,
          expiresAt: txtChallenge.expiresAt
        },
        instructions,
        verificationUrl: `https://aipaypercrawl.com/verify-claim/${claimId}`,
        message: 'Domain claim created successfully. Please add the TXT record to verify ownership.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating domain claim:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET method - get claim status or verify claim
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const claimId = url.searchParams.get('claimId');
      const action = url.searchParams.get('action');

      if (!claimId) {
        return new Response(
          JSON.stringify({ error: 'Claim ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get claim from database
      const claim = await env.DB.prepare(
        'SELECT * FROM domain_claims WHERE id = ?'
      ).bind(claimId).first();

      if (!claim) {
        return new Response(
          JSON.stringify({ error: 'Claim not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'verify') {
        // Verify TXT record
        return await verifyDomainClaim(claim, env, corsHeaders);
      } else {
        // Return claim status
        return await getClaimStatus(claim, corsHeaders);
      }
    } catch (error) {
      console.error('Error processing claim request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // PUT method - update claim (admin only)
  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const { claimId, status, rejectionReason } = body;

      // TODO: Add admin authentication
      // For now, this endpoint is for internal use

      if (!claimId || !status) {
        return new Response(
          JSON.stringify({ error: 'Claim ID and status are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const validStatuses = ['pending', 'txt_verification', 'verified', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return new Response(
          JSON.stringify({ error: 'Invalid status' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const now = new Date().toISOString();
      let updateFields = 'status = ?, updated_at = ?';
      let updateValues = [status, now];

      if (status === 'approved') {
        updateFields += ', approved_at = ?';
        updateValues.push(now);
      } else if (status === 'rejected') {
        updateFields += ', rejected_at = ?, rejection_reason = ?';
        updateValues.push(now, rejectionReason || 'Not specified');
      }

      updateValues.push(claimId);

      await env.DB.prepare(`
        UPDATE domain_claims 
        SET ${updateFields}
        WHERE id = ?
      `).bind(...updateValues).run();

      // If approved, add domain to domains table
      if (status === 'approved') {
        const claim = await env.DB.prepare(
          'SELECT * FROM domain_claims WHERE id = ?'
        ).bind(claimId).first();

        if (claim) {
          // Check if domain already exists
          const existingDomain = await env.DB.prepare(
            'SELECT id FROM domains WHERE domain = ?'
          ).bind(claim.domain).first();

          if (!existingDomain) {
            await env.DB.prepare(`
              INSERT INTO domains 
              (id, domain, pay_per_crawl_enabled, price_per_request, currency, 
               owner_email, owner_name, claimed_at, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              crypto.randomUUID(),
              claim.domain,
              true,
              claim.requested_price,
              claim.currency,
              claim.email,
              claim.contact_name,
              now,
              now,
              now
            ).run();
          }
        }
      }

      // Log status update event
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        'domain_claim_updated',
        JSON.stringify({
          claimId,
          newStatus: status,
          rejectionReason: rejectionReason || null
        }),
        now
      ).run();

      return new Response(JSON.stringify({
        success: true,
        claimId,
        status,
        message: `Claim status updated to ${status}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error updating claim:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

// Helper function to verify domain claim
async function verifyDomainClaim(claim, env, corsHeaders) {
  try {
    // Check if challenge has expired
    if (new Date() > new Date(claim.challenge_expires_at)) {
      return new Response(JSON.stringify({
        success: false,
        verified: false,
        error: 'Verification challenge has expired. Please request a new claim.',
        claimId: claim.id,
        domain: claim.domain
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify TXT record using DNS over HTTPS
    const recordName = claim.txt_record_name;
    const expectedValue = claim.txt_record_value;

    const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`, {
      headers: {
        'Accept': 'application/dns-json',
      },
    });

    if (!dnsResponse.ok) {
      return new Response(JSON.stringify({
        success: true,
        verified: false,
        error: 'DNS lookup failed',
        claimId: claim.id,
        domain: claim.domain,
        nextSteps: [
          'DNS lookup temporarily failed',
          'Please try again in a few minutes',
          'Ensure your TXT record is properly configured'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dnsData = await dnsResponse.json();
    
    if (!dnsData.Answer || dnsData.Answer.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        verified: false,
        error: 'No TXT record found',
        claimId: claim.id,
        domain: claim.domain,
        expectedValue,
        nextSteps: [
          'TXT record not found',
          'Please ensure you have added the TXT record to your DNS',
          'DNS changes can take up to 24 hours to propagate',
          'Try again once the DNS record is active'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if any TXT record matches our challenge
    let verified = false;
    let actualValue = '';
    
    for (const record of dnsData.Answer) {
      if (record.type === 16) { // TXT record type
        const txtValue = record.data.replace(/"/g, ''); // Remove quotes
        actualValue = txtValue;
        if (txtValue === expectedValue) {
          verified = true;
          break;
        }
      }
    }

    if (verified) {
      // Update claim status to verified
      const now = new Date().toISOString();
      await env.DB.prepare(`
        UPDATE domain_claims 
        SET status = ?, verified_at = ?, updated_at = ?
        WHERE id = ?
      `).bind('verified', now, now, claim.id).run();

      // Log verification event
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        'domain_claim_verified',
        JSON.stringify({
          claimId: claim.id,
          domain: claim.domain,
          email: claim.email
        }),
        now
      ).run();

      return new Response(JSON.stringify({
        success: true,
        verified: true,
        claimId: claim.id,
        domain: claim.domain,
        status: 'verified',
        message: 'Domain ownership verified successfully!',
        nextSteps: [
          'Domain ownership verified successfully!',
          'Your claim is now under review.',
          'You will receive an email notification when your claim is approved.',
          'Approved claims typically process within 1-2 business days.',
          'You can check your claim status anytime using your claim ID.'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({
        success: true,
        verified: false,
        error: 'TXT record value does not match challenge',
        claimId: claim.id,
        domain: claim.domain,
        expectedValue,
        actualValue,
        nextSteps: [
          'TXT record verification failed',
          'Please check that the TXT record value matches exactly',
          'DNS changes can take up to 24 hours to propagate',
          'You can retry verification once the DNS record is active',
          `Expected: ${expectedValue}`,
          `Found: ${actualValue}`
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error verifying domain claim:', error);
    return new Response(JSON.stringify({
      success: false,
      verified: false,
      error: 'Verification failed due to technical error',
      claimId: claim.id,
      domain: claim.domain
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Helper function to get claim status
async function getClaimStatus(claim, corsHeaders) {
  const getNextSteps = (status) => {
    switch (status) {
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
            `Rejection reason: ${claim.rejection_reason || 'Not specified'}`,
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

  const statusInfo = getNextSteps(claim.status);

  return new Response(JSON.stringify({
    success: true,
    claimId: claim.id,
    domain: claim.domain,
    status: claim.status,
    email: claim.email,
    contactName: claim.contact_name,
    organization: claim.organization,
    submittedAt: claim.submitted_at,
    verifiedAt: claim.verified_at,
    approvedAt: claim.approved_at,
    rejectedAt: claim.rejected_at,
    rejectionReason: claim.rejection_reason,
    txtChallenge: claim.status === 'pending' ? {
      recordName: claim.txt_record_name,
      recordValue: claim.txt_record_value,
      expiresAt: claim.challenge_expires_at
    } : null,
    ...statusInfo
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
} 
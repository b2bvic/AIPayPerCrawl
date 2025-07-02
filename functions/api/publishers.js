// Cloudflare Worker function for /api/publishers
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

  // Register a new publisher
  if (request.method === 'POST' && request.url.endsWith('/register')) {
    try {
      const body = await request.json();
      const { email, name, domains } = body;

      // Validate input
      if (!email || !email.includes('@')) {
        return new Response(
          JSON.stringify({ error: 'Valid email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if publisher already exists
      const existing = await env.DB.prepare('SELECT id FROM publishers WHERE email = ?')
        .bind(email)
        .first();

      if (existing) {
        return new Response(
          JSON.stringify({ error: 'Publisher already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create publisher
      const publisherId = crypto.randomUUID();
      const verificationToken = crypto.randomUUID();
      
      await env.DB.prepare(
        'INSERT INTO publishers (id, email, name, is_verified) VALUES (?, ?, ?, ?)'
      ).bind(publisherId, email, name || null, false).run();

      // Store verification token in cache (expires in 24 hours)
      await env.CACHE.put(`email_verify:${verificationToken}`, JSON.stringify({
        publisherId,
        email,
        name
      }), {
        expirationTtl: 86400 // 24 hours
      });

      // Send verification email
      try {
        await fetch(`${env.NEXT_PUBLIC_APP_URL || 'https://aipaypercrawl.com'}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'publisher_verification',
            to: email,
            data: {
              name,
              email,
              verificationToken
            }
          })
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with registration even if email fails
      }

      // Claim domains if provided
      if (domains && Array.isArray(domains)) {
        for (const domain of domains) {
          await claimDomain(env.DB, publisherId, domain);
        }
      }

      return new Response(JSON.stringify({
        publisherId,
        email,
        name,
        isVerified: false,
        message: 'Publisher registered successfully. Check your email for verification.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error registering publisher:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Claim a domain
  if (request.method === 'POST' && request.url.includes('/claim')) {
    try {
      const body = await request.json();
      const { publisherId, domain, verificationMethod } = body;

      // Validate
      if (!publisherId || !domain) {
        return new Response(
          JSON.stringify({ error: 'Publisher ID and domain are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if publisher exists
      const publisher = await env.DB.prepare('SELECT * FROM publishers WHERE id = ?')
        .bind(publisherId)
        .first();

      if (!publisher) {
        return new Response(
          JSON.stringify({ error: 'Publisher not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate verification token
      const verificationToken = crypto.randomUUID();
      const verificationPath = `/.well-known/aipaypercrawl-verify-${verificationToken}.txt`;

      // Update domain claim status
      await env.DB.prepare(
        'UPDATE domains SET owner_id = ?, claim_status = ? WHERE domain = ?'
      ).bind(publisherId, 'claimed', domain).run();

      // Store verification token
      await env.CACHE.put(`verify:${domain}`, verificationToken, {
        expirationTtl: 86400, // 24 hours
      });

      return new Response(JSON.stringify({
        domain,
        claimStatus: 'claimed',
        verification: {
          method: verificationMethod || 'dns',
          token: verificationToken,
          instructions: getVerificationInstructions(verificationMethod, domain, verificationToken),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error claiming domain:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Verify domain ownership
  if (request.method === 'POST' && request.url.includes('/verify')) {
    try {
      const body = await request.json();
      const { domain } = body;

      if (!domain) {
        return new Response(
          JSON.stringify({ error: 'Domain is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get verification token from cache
      const expectedToken = await env.CACHE.get(`verify:${domain}`);
      if (!expectedToken) {
        return new Response(
          JSON.stringify({ error: 'No pending verification for this domain' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check DNS TXT record
      const verified = await verifyDomainOwnership(domain, expectedToken);

      if (verified) {
        // Update domain status
        await env.DB.prepare(
          'UPDATE domains SET claim_status = ? WHERE domain = ?'
        ).bind('verified', domain).run();

        // Delete verification token
        await env.CACHE.delete(`verify:${domain}`);

        return new Response(JSON.stringify({
          domain,
          verified: true,
          message: 'Domain ownership verified successfully',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({
          domain,
          verified: false,
          message: 'Verification failed. Please check your DNS records.',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Get publisher details
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const publisherId = url.searchParams.get('publisherId');
    const email = url.searchParams.get('email');

    if (!publisherId && !email) {
      return new Response(
        JSON.stringify({ error: 'Publisher ID or email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      let query = 'SELECT * FROM publishers WHERE ';
      const params = [];

      if (publisherId) {
        query += 'id = ?';
        params.push(publisherId);
      } else {
        query += 'email = ?';
        params.push(email);
      }

      const publisher = await env.DB.prepare(query).bind(...params).first();

      if (!publisher) {
        return new Response(
          JSON.stringify({ error: 'Publisher not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get publisher's domains
      const domains = await env.DB.prepare(
        'SELECT * FROM domains WHERE owner_id = ?'
      ).bind(publisher.id).all();

      return new Response(JSON.stringify({
        publisher: {
          id: publisher.id,
          email: publisher.email,
          name: publisher.name,
          isVerified: publisher.is_verified,
          totalRevenue: publisher.total_revenue,
          totalRequests: publisher.total_requests,
          createdAt: publisher.created_at,
        },
        domains: domains.results || [],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching publisher:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

// Helper function to claim a domain
async function claimDomain(db, publisherId, domain) {
  try {
    // Check if domain exists
    const existing = await db.prepare('SELECT id FROM domains WHERE domain = ?')
      .bind(domain)
      .first();

    if (existing) {
      // Update existing domain
      await db.prepare(
        'UPDATE domains SET owner_id = ?, claim_status = ? WHERE domain = ?'
      ).bind(publisherId, 'claimed', domain).run();
    } else {
      // Create new domain entry
      await db.prepare(
        'INSERT INTO domains (domain, owner_id, claim_status, pay_per_crawl_enabled) VALUES (?, ?, ?, ?)'
      ).bind(domain, publisherId, 'claimed', false).run();
    }
  } catch (error) {
    console.error('Error claiming domain:', error);
  }
}

// Get verification instructions based on method
function getVerificationInstructions(method, domain, token) {
  switch (method) {
    case 'dns':
      return {
        type: 'DNS TXT Record',
        steps: [
          `Add a TXT record to your domain's DNS settings`,
          `Record name: _aipaypercrawl`,
          `Record value: ${token}`,
          `Wait 5-10 minutes for DNS propagation`,
          `Click verify to complete the process`,
        ],
      };
    case 'html':
      return {
        type: 'HTML File Upload',
        steps: [
          `Create a file named: aipaypercrawl-verify-${token}.txt`,
          `File content: ${token}`,
          `Upload to: https://${domain}/.well-known/`,
          `Ensure the file is publicly accessible`,
          `Click verify to complete the process`,
        ],
      };
    default:
      return {
        type: 'Meta Tag',
        steps: [
          `Add this meta tag to your homepage <head> section:`,
          `<meta name="aipaypercrawl-verification" content="${token}">`,
          `Save and publish your changes`,
          `Click verify to complete the process`,
        ],
      };
  }
}

// Verify domain ownership
async function verifyDomainOwnership(domain, expectedToken) {
  try {
    // Method 1: Check DNS TXT record
    // In production, you would use a DNS resolver API
    // For now, we'll check for an HTML file
    
    const verifyUrl = `https://${domain}/.well-known/aipaypercrawl-verify-${expectedToken}.txt`;
    const response = await fetch(verifyUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const content = await response.text();
      return content.trim() === expectedToken;
    }

    return false;
  } catch (error) {
    console.error('Domain verification failed:', error);
    return false;
  }
} 
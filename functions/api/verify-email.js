// Cloudflare Worker function for /api/verify-email
export async function onRequest(context) {
  const { request, env, params } = context;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const token = url.searchParams.get('token');
      const email = url.searchParams.get('email');

      if (!token || !email) {
        return new Response(
          JSON.stringify({ error: 'Token and email are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get verification data from cache
      const verificationData = await env.CACHE.get(`email_verify:${token}`);
      if (!verificationData) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid or expired verification token',
            expired: true 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = JSON.parse(verificationData);

      // Verify email matches
      if (data.email !== email) {
        return new Response(
          JSON.stringify({ error: 'Email does not match verification token' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update publisher verification status
      await env.DB.prepare(
        'UPDATE publishers SET is_verified = ? WHERE id = ? AND email = ?'
      ).bind(true, data.publisherId, email).run();

      // Delete verification token
      await env.CACHE.delete(`email_verify:${token}`);

      // Track verification event
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, publisher_id, metadata, timestamp) VALUES (?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        'email_verified',
        data.publisherId,
        JSON.stringify({ 
          email,
          verification_token: token
        }),
        new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({
        success: true,
        message: 'Email verified successfully',
        publisherId: data.publisherId,
        email: data.email,
        name: data.name
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error verifying email:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // POST method for resending verification email
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { email } = body;

      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find publisher by email
      const publisher = await env.DB.prepare('SELECT * FROM publishers WHERE email = ?')
        .bind(email)
        .first();

      if (!publisher) {
        return new Response(
          JSON.stringify({ error: 'Publisher not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (publisher.is_verified) {
        return new Response(
          JSON.stringify({ 
            error: 'Email already verified',
            alreadyVerified: true 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate new verification token
      const verificationToken = crypto.randomUUID();
      
      // Store verification token in cache
      await env.CACHE.put(`email_verify:${verificationToken}`, JSON.stringify({
        publisherId: publisher.id,
        email: publisher.email,
        name: publisher.name
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
              name: publisher.name,
              email: publisher.email,
              verificationToken
            }
          })
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'Verification email sent successfully',
          email
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        return new Response(
          JSON.stringify({ error: 'Failed to send verification email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

    } catch (error) {
      console.error('Error resending verification email:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
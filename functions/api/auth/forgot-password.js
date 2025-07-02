// Cloudflare Worker function for /api/auth/forgot-password
export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { email } = body;

      // Validate input
      if (!email) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Email is required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid email format' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // TODO: Check if user exists in database
      // TODO: Generate reset token
      // TODO: Send password reset email
      
      // For now, always return success (security best practice - don't reveal if email exists)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'If an account with that email exists, you will receive a password reset link shortly.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      console.error('Forgot password error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Internal server error' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  return new Response('Method not allowed', { 
    status: 405, 
    headers: corsHeaders 
  });
} 
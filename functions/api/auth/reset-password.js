// Cloudflare Worker function for /api/auth/reset-password
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
      const { token, password, email } = body;

      if (token && password) {
        // Reset password with token
        if (!token || !password) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Token and new password are required' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Validate password strength
        if (password.length < 8) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Password must be at least 8 characters long' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // TODO: Validate token
        // TODO: Update password in database
        // For now, return success for any valid token format
        if (token.length > 10) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Password reset successfully'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid or expired reset token' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

      } else if (email) {
        // Request password reset
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

        // TODO: Check if user exists
        // TODO: Generate reset token
        // TODO: Send reset email
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'If an account with that email exists, you will receive a password reset link shortly.'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );

      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Either email (for reset request) or token and password (for reset) are required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

    } catch (error) {
      console.error('Reset password error:', error);
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
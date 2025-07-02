// Cloudflare Worker function for /api/auth/signin
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
      const { email, password } = body;

      // Validate input
      if (!email || !password) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Email and password are required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // TODO: Implement actual authentication logic
      // For now, return a mock response
      if (email === 'demo@example.com' && password === 'password123') {
        return new Response(
          JSON.stringify({
            success: true,
            user: {
              id: 'user_demo',
              email: email,
              name: 'Demo User',
              isPublisher: true,
              emailVerified: true
            },
            token: 'demo_jwt_token'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid email or password' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

    } catch (error) {
      console.error('Signin error:', error);
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
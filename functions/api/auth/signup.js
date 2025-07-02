// Cloudflare Worker function for /api/auth/signup
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
      const { email, password, name, isPublisher = false } = body;

      // Validate input
      if (!email || !password || !name) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Email, password, and name are required' 
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

      // TODO: Check if user already exists in database
      // TODO: Hash password
      // TODO: Store user in database
      // TODO: Send verification email

      // For now, return a mock response
      const userId = `user_${Date.now()}`;
      
      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: userId,
            email: email,
            name: name,
            isPublisher: isPublisher,
            emailVerified: false,
            createdAt: new Date().toISOString()
          },
          message: 'Account created successfully. Please check your email to verify your account.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      console.error('Signup error:', error);
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
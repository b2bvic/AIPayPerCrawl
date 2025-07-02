// Cloudflare Worker function for /api/account
export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Mock user data - in production, this would come from authentication
  const mockUser = {
    id: 'user_demo',
    name: 'Demo User',
    email: 'demo@example.com',
    isPublisher: true,
    createdAt: '2024-01-01T00:00:00Z',
    emailVerified: true,
    twoFactorEnabled: false,
    notifications: {
      email: true,
      crawlActivity: true,
      paymentUpdates: true,
      newsletter: false,
    },
    preferences: {
      timezone: 'UTC',
      language: 'en',
    }
  };

  if (request.method === 'GET') {
    try {
      // TODO: Get user from authentication token
      // TODO: Fetch user data from database
      
      return new Response(
        JSON.stringify({
          success: true,
          user: mockUser
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      console.error('Get account error:', error);
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

  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const { name, email, notifications, preferences } = body;

      // TODO: Validate user authentication
      // TODO: Update user data in database

      // Validate input
      if (name && name.trim().length < 2) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Name must be at least 2 characters long' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (email) {
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
      }

      // Update mock user data
      const updatedUser = {
        ...mockUser,
        name: name || mockUser.name,
        email: email || mockUser.email,
        notifications: notifications || mockUser.notifications,
        preferences: preferences || mockUser.preferences,
        updatedAt: new Date().toISOString()
      };

      return new Response(
        JSON.stringify({
          success: true,
          user: updatedUser,
          message: 'Account updated successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      console.error('Update account error:', error);
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

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { action, ...data } = body;

      switch (action) {
        case 'change-password':
          const { currentPassword, newPassword } = data;
          
          if (!currentPassword || !newPassword) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Current password and new password are required' 
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          if (newPassword.length < 8) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'New password must be at least 8 characters long' 
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          // TODO: Verify current password
          // TODO: Update password in database
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Password changed successfully'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );

        case 'enable-2fa':
          // TODO: Generate 2FA secret
          // TODO: Return QR code data
          
          return new Response(
            JSON.stringify({
              success: true,
              qrCode: 'data:image/png;base64,mock-qr-code',
              secret: 'MOCK2FASECRET',
              message: 'Scan the QR code with your authenticator app'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );

        case 'disable-2fa':
          // TODO: Disable 2FA in database
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Two-factor authentication disabled'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );

        case 'delete-account':
          // TODO: Mark account for deletion
          // TODO: Send confirmation email
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Account deletion request submitted. You will receive a confirmation email.'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );

        default:
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid action' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
      }

    } catch (error) {
      console.error('Account action error:', error);
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
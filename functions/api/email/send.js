// Cloudflare Worker function for /api/email/send
export async function onRequest(context) {
  const { request, env, params } = context;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { type, to, data } = body;

    // Validate input
    if (!type || !to || !data) {
      return new Response(
        JSON.stringify({ error: 'Type, recipient, and data are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email service is configured
    const resendApiKey = env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('Email service not configured - would send:', { type, to, data });
      return new Response(JSON.stringify({
        success: true,
        message: 'Email service not configured (development mode)',
        emailId: 'dev-' + crypto.randomUUID()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate email content based on type
    const emailContent = generateEmailContent(type, data, env.NEXT_PUBLIC_APP_URL || 'https://aipaypercrawl.com');

    if (!emailContent) {
      return new Response(
        JSON.stringify({ error: 'Invalid email type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AIPayPerCrawl <noreply@aipaypercrawl.com>',
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.json();
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await emailResponse.json();

    // Track email sent event
    await env.DB.prepare(
      'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      'email_sent',
      JSON.stringify({ 
        email_type: type,
        recipient: to,
        email_id: result.id
      }),
      new Date().toISOString()
    ).run();

    return new Response(JSON.stringify({
      success: true,
      emailId: result.id,
      message: 'Email sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

function generateEmailContent(type, data, appUrl) {
  switch (type) {
    case 'publisher_verification':
      return {
        subject: 'Verify your AIPayPerCrawl account',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your account</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to AIPayPerCrawl!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.name || 'there'},</p>
                <p>Thank you for registering as a publisher with AIPayPerCrawl. To complete your account setup, please verify your email address by clicking the button below:</p>
                <p style="text-align: center;">
                  <a href="${appUrl}/verify-email?token=${data.verificationToken}&email=${encodeURIComponent(data.email)}" class="button">
                    Verify Email Address
                  </a>
                </p>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
                  ${appUrl}/verify-email?token=${data.verificationToken}&email=${encodeURIComponent(data.email)}
                </p>
                <p>This verification link will expire in 24 hours.</p>
                <p>Once verified, you'll be able to:</p>
                <ul>
                  <li>Claim and verify your domains</li>
                  <li>Set pricing for your content</li>
                  <li>Track earnings and analytics</li>
                  <li>Receive payments through Stripe</li>
                </ul>
                <p>If you didn't create this account, you can safely ignore this email.</p>
                <p>Best regards,<br>The AIPayPerCrawl Team</p>
              </div>
              <div class="footer">
                <p>AIPayPerCrawl - The marketplace for Pay Per Crawl domains</p>
                <p><a href="${appUrl}">Visit our website</a> | <a href="${appUrl}/support">Get support</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Welcome to AIPayPerCrawl!

Hi ${data.name || 'there'},

Thank you for registering as a publisher with AIPayPerCrawl. To complete your account setup, please verify your email address by visiting this link:

${appUrl}/verify-email?token=${data.verificationToken}&email=${encodeURIComponent(data.email)}

This verification link will expire in 24 hours.

Once verified, you'll be able to:
- Claim and verify your domains
- Set pricing for your content
- Track earnings and analytics
- Receive payments through Stripe

If you didn't create this account, you can safely ignore this email.

Best regards,
The AIPayPerCrawl Team

AIPayPerCrawl - The marketplace for Pay Per Crawl domains
Visit our website: ${appUrl}
        `
      };

    case 'domain_claim_notification':
      return {
        subject: `Domain claim notification: ${data.domain}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Domain Claim Notification</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .code-block { background: #f3f4f6; padding: 15px; border-radius: 6px; font-family: monospace; border-left: 4px solid #3b82f6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Domain Claim Successful</h1>
              </div>
              <div class="content">
                <p>Hi ${data.publisherName || 'there'},</p>
                <p>You have successfully claimed the domain <strong>${data.domain}</strong>. To complete the verification process and start earning from crawl requests, please verify your ownership using one of the methods below:</p>
                
                <h3>DNS Verification (Recommended)</h3>
                <p>Add this TXT record to your domain's DNS settings:</p>
                <div class="code-block">
                  <strong>Record name:</strong> _aipaypercrawl<br>
                  <strong>Record value:</strong> ${data.verificationToken}
                </div>
                
                <h3>HTML File Verification</h3>
                <p>Upload a file to your website with this content:</p>
                <div class="code-block">
                  <strong>File name:</strong> aipaypercrawl-verify-${data.verificationToken}.txt<br>
                  <strong>File content:</strong> ${data.verificationToken}<br>
                  <strong>Upload to:</strong> https://${data.domain}/.well-known/
                </div>
                
                <p style="text-align: center;">
                  <a href="${appUrl}/dashboard?tab=domains" class="button">
                    Complete Verification
                  </a>
                </p>
                
                <p>Once verified, your domain will be available in our marketplace and you'll start receiving revenue from crawl requests.</p>
                
                <p>Best regards,<br>The AIPayPerCrawl Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Domain Claim Successful

Hi ${data.publisherName || 'there'},

You have successfully claimed the domain ${data.domain}. To complete the verification process, please verify your ownership using one of these methods:

DNS Verification (Recommended):
- Record name: _aipaypercrawl
- Record value: ${data.verificationToken}

HTML File Verification:
- File name: aipaypercrawl-verify-${data.verificationToken}.txt
- File content: ${data.verificationToken}
- Upload to: https://${data.domain}/.well-known/

Complete verification at: ${appUrl}/dashboard?tab=domains

Once verified, your domain will be available in our marketplace and you'll start receiving revenue from crawl requests.

Best regards,
The AIPayPerCrawl Team
        `
      };

    case 'payment_received':
      return {
        subject: `Payment received: $${data.amount} ${data.currency}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Received</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .amount { font-size: 2em; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
              .details { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Payment Received!</h1>
              </div>
              <div class="content">
                <p>Hi ${data.publisherName || 'there'},</p>
                <p>Great news! You've received a payment for crawl requests on your domains.</p>
                
                <div class="amount">$${data.amount} ${data.currency}</div>
                
                <div class="details">
                  <h3>Payment Details:</h3>
                  <ul>
                    <li><strong>Amount:</strong> $${data.amount} ${data.currency}</li>
                    <li><strong>Domains:</strong> ${data.domains ? data.domains.join(', ') : 'Multiple'}</li>
                    <li><strong>Requests:</strong> ${data.requestCount || 'N/A'}</li>
                    <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
                  </ul>
                </div>
                
                <p>This payment has been processed and will appear in your connected Stripe account within 2-3 business days.</p>
                
                <p>Thank you for being part of the AIPayPerCrawl marketplace!</p>
                
                <p>Best regards,<br>The AIPayPerCrawl Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Payment Received!

Hi ${data.publisherName || 'there'},

Great news! You've received a payment for crawl requests on your domains.

Amount: $${data.amount} ${data.currency}

Payment Details:
- Amount: $${data.amount} ${data.currency}
- Domains: ${data.domains ? data.domains.join(', ') : 'Multiple'}
- Requests: ${data.requestCount || 'N/A'}
- Date: ${new Date().toLocaleDateString()}

This payment has been processed and will appear in your connected Stripe account within 2-3 business days.

Thank you for being part of the AIPayPerCrawl marketplace!

Best regards,
The AIPayPerCrawl Team
        `
      };

    default:
      return null;
  }
} 
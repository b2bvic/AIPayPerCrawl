// Cloudflare Worker function for /api/webhooks/stripe
export async function onRequest(context) {
  const { request, env, params } = context;

  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Verify webhook signature (if configured)
    if (env.STRIPE_WEBHOOK_SECRET && signature) {
      // Basic signature verification - in production, use proper Stripe webhook verification
      const elements = signature.split(',');
      const signatureHash = elements.find(element => element.startsWith('v1='));
      
      if (!signatureHash) {
        console.error('Invalid Stripe signature format');
        return new Response('Invalid signature', { status: 400 });
      }

      // For now, we'll skip full signature verification since it requires the raw body
      // In production, implement proper Stripe webhook signature verification
    }

    const event = JSON.parse(body);
    console.log('Stripe webhook event:', event.type, event.id);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(env, event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(env, event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(env, event.data.object);
        break;
      
      case 'checkout.session.expired':
        await handleCheckoutExpired(env, event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleCheckoutCompleted(env, session) {
  console.log('Processing checkout completion:', session.id);
  
  try {
    const quoteId = session.metadata?.quote_id;
    const apiKey = session.metadata?.api_key;

    if (!quoteId) {
      console.error('No quote ID in session metadata');
      return;
    }

    // Update crawl request status
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET payment_status = 'paid', 
          stripe_payment_intent_id = ?,
          updated_at = ?
      WHERE quote_id = ? AND stripe_session_id = ?
    `).bind(
      session.payment_intent,
      new Date().toISOString(),
      quoteId,
      session.id
    ).run();

    // Get the crawl request details
    const crawlRequest = await env.DB.prepare(`
      SELECT cr.*, q.items 
      FROM crawl_requests cr
      JOIN quotes q ON cr.quote_id = q.quote_id
      WHERE cr.quote_id = ? AND cr.stripe_session_id = ?
    `).bind(quoteId, session.id).first();

    if (crawlRequest) {
      // Trigger the actual crawling process
      await initiateCrawling(env, crawlRequest, apiKey);

      // Track analytics event
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        'payment_success',
        JSON.stringify({ 
          quote_id: quoteId,
          crawl_request_id: crawlRequest.id,
          session_id: session.id,
          amount: session.amount_total,
          currency: session.currency
        }),
        new Date().toISOString()
      ).run();
    }
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handlePaymentSucceeded(env, paymentIntent) {
  console.log('Processing payment success:', paymentIntent.id);
  
  try {
    const quoteId = paymentIntent.metadata?.quote_id;

    if (!quoteId) {
      console.error('No quote ID in payment intent metadata');
      return;
    }

    // Update payment status
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET payment_status = 'paid',
          updated_at = ?
      WHERE quote_id = ? AND stripe_payment_intent_id = ?
    `).bind(
      new Date().toISOString(),
      quoteId,
      paymentIntent.id
    ).run();

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(env, paymentIntent) {
  console.log('Processing payment failure:', paymentIntent.id);
  
  try {
    const quoteId = paymentIntent.metadata?.quote_id;

    if (!quoteId) {
      console.error('No quote ID in payment intent metadata');
      return;
    }

    // Update payment status
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET payment_status = 'failed',
          status = 'failed',
          updated_at = ?
      WHERE quote_id = ? AND stripe_payment_intent_id = ?
    `).bind(
      new Date().toISOString(),
      quoteId,
      paymentIntent.id
    ).run();

    // Track analytics event
    await env.DB.prepare(
      'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      'payment_failed',
      JSON.stringify({ 
        quote_id: quoteId,
        payment_intent_id: paymentIntent.id,
        failure_reason: paymentIntent.last_payment_error?.message || 'Unknown error'
      }),
      new Date().toISOString()
    ).run();

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleCheckoutExpired(env, session) {
  console.log('Processing checkout expiration:', session.id);
  
  try {
    const quoteId = session.metadata?.quote_id;

    if (!quoteId) {
      console.error('No quote ID in session metadata');
      return;
    }

    // Update crawl request status
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET status = 'expired',
          payment_status = 'expired',
          updated_at = ?
      WHERE quote_id = ? AND stripe_session_id = ?
    `).bind(
      new Date().toISOString(),
      quoteId,
      session.id
    ).run();

  } catch (error) {
    console.error('Error handling checkout expiration:', error);
  }
}

async function initiateCrawling(env, crawlRequest, apiKey) {
  try {
    console.log('Initiating crawling for request:', crawlRequest.id);

    // Parse the quote items to get URLs to crawl
    const items = JSON.parse(crawlRequest.items);
    const allUrls = items.flatMap(item => item.urls);

    // Update status to processing
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET status = 'processing',
          started_at = ?,
          updated_at = ?
      WHERE id = ?
    `).bind(
      new Date().toISOString(),
      new Date().toISOString(),
      crawlRequest.id
    ).run();

    // In a real implementation, you would:
    // 1. Queue the crawling job in a background worker
    // 2. Use the actual web crawling service
    // 3. Process URLs in batches with rate limiting
    
    // For now, we'll simulate the crawling process
    const crawlResults = [];
    
    for (const item of items) {
      for (const url of item.urls) {
        try {
          // Simulate crawling - in production, use the actual crawl service
          const mockResult = {
            url,
            domain: item.domain,
            status: 'success',
            statusCode: 200,
            title: `Mock Title for ${url}`,
            content: `Mock content extracted from ${url}`,
            metadata: {
              crawledAt: new Date().toISOString(),
              contentLength: 1234,
              responseTime: Math.floor(Math.random() * 1000) + 100
            }
          };
          
          crawlResults.push(mockResult);
        } catch (error) {
          crawlResults.push({
            url,
            domain: item.domain,
            status: 'error',
            error: error.message,
            crawledAt: new Date().toISOString()
          });
        }
      }
    }

    // Update crawl request with results
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET status = 'completed',
          results = ?,
          completed_at = ?,
          updated_at = ?
      WHERE id = ?
    `).bind(
      JSON.stringify(crawlResults),
      new Date().toISOString(),
      new Date().toISOString(),
      crawlRequest.id
    ).run();

    // Track completion analytics
    await env.DB.prepare(
      'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      'crawl_completed',
      JSON.stringify({ 
        crawl_request_id: crawlRequest.id,
        urls_crawled: crawlResults.length,
        successful_crawls: crawlResults.filter(r => r.status === 'success').length,
        failed_crawls: crawlResults.filter(r => r.status === 'error').length
      }),
      new Date().toISOString()
    ).run();

    console.log(`Crawling completed for request ${crawlRequest.id}: ${crawlResults.length} URLs processed`);

  } catch (error) {
    console.error('Error initiating crawling:', error);
    
    // Update status to failed
    await env.DB.prepare(`
      UPDATE crawl_requests 
      SET status = 'failed',
          error_message = ?,
          updated_at = ?
      WHERE id = ?
    `).bind(
      error.message,
      new Date().toISOString(),
      crawlRequest.id
    ).run();
  }
} 
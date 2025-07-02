// Cloudflare Worker function for /api/checkout
export async function onRequest(context) {
  const { request, env, params } = context;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify API key
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { quoteId, returnUrl, cancelUrl } = body;

      // Validate request
      if (!quoteId) {
        return new Response(
          JSON.stringify({ error: 'Quote ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Retrieve quote from database
      const quote = await env.DB.prepare('SELECT * FROM quotes WHERE quote_id = ?')
        .bind(quoteId)
        .first();

      if (!quote || new Date(quote.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Quote not found or expired' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const items = JSON.parse(quote.items);
      let totalAmount = Math.round(quote.total_cost * 100); // Convert to cents
      
      // Stripe requires minimum 50 cents for USD
      if (totalAmount < 50) {
        totalAmount = 50; // Set minimum to $0.50
      }

      // Create Stripe checkout session
      const stripeKey = env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        return new Response(
          JSON.stringify({ error: 'Payment processing not configured' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create line items for Stripe
      const lineItems = items.map(item => ({
        price_data: {
          currency: quote.currency,
          product_data: {
            name: `Web Crawling - ${item.domain}`,
            description: `Crawl 1 URL from ${item.domain}`,
            metadata: {
              domain: item.domain,
              url: item.url
            }
          },
          unit_amount: Math.max(1, Math.round(item.pricePerRequest * 100)), // Convert to cents, minimum 1 cent
        },
        quantity: 1,
      }));

      // Create Stripe checkout session
      const checkoutSession = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'payment',
          'success_url': returnUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
          'cancel_url': cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
          'metadata[quote_id]': quoteId,
          'metadata[api_key]': apiKey,
          'line_items[0][price_data][currency]': quote.currency,
          'line_items[0][price_data][product_data][name]': `Web Crawling Quote ${quoteId}`,
          'line_items[0][price_data][product_data][description]': `Crawl ${items.length} URL(s) from ${items.length} domain(s)`,
          'line_items[0][price_data][unit_amount]': totalAmount,
          'line_items[0][quantity]': '1',
          'payment_intent_data[metadata][quote_id]': quoteId,
          'payment_intent_data[metadata][api_key]': apiKey,
        }),
      });

      if (!checkoutSession.ok) {
        const error = await checkoutSession.json();
        console.error('Stripe checkout error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create checkout session',
            stripeError: error,
            debug: {
              totalAmount,
              currency: quote.currency,
              itemsCount: items.length
            }
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const session = await checkoutSession.json();

      // Create crawl request record
      const crawlRequestId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO crawl_requests 
        (id, quote_id, stripe_session_id, status, payment_status, total_cost, currency, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crawlRequestId,
        quoteId,
        session.id,
        'pending',
        'pending',
        quote.total_cost,
        quote.currency,
        new Date().toISOString()
      ).run();

      // Track analytics event
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        'checkout_created',
        JSON.stringify({ 
          quote_id: quoteId, 
          crawl_request_id: crawlRequestId,
          session_id: session.id,
          amount: totalAmount 
        }),
        new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({
        sessionId: session.id,
        checkoutUrl: session.url,
        crawlRequestId,
        quoteId,
        totalAmount: quote.total_cost,
        currency: quote.currency,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET method - retrieve checkout session status
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const sessionId = url.searchParams.get('sessionId');
      const crawlRequestId = url.searchParams.get('crawlRequestId');

      if (!sessionId && !crawlRequestId) {
        return new Response(
          JSON.stringify({ error: 'Session ID or Crawl Request ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let crawlRequest;
      if (crawlRequestId) {
        crawlRequest = await env.DB.prepare('SELECT * FROM crawl_requests WHERE id = ?')
          .bind(crawlRequestId)
          .first();
      } else {
        crawlRequest = await env.DB.prepare('SELECT * FROM crawl_requests WHERE stripe_session_id = ?')
          .bind(sessionId)
          .first();
      }

      if (!crawlRequest) {
        return new Response(
          JSON.stringify({ error: 'Crawl request not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If we have Stripe configured, get the session status
      let sessionStatus = null;
      if (env.STRIPE_SECRET_KEY && crawlRequest.stripe_session_id) {
        const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${crawlRequest.stripe_session_id}`, {
          headers: {
            'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          },
        });

        if (stripeResponse.ok) {
          sessionStatus = await stripeResponse.json();
        }
      }

      return new Response(JSON.stringify({
        crawlRequestId: crawlRequest.id,
        quoteId: crawlRequest.quote_id,
        status: crawlRequest.status,
        paymentStatus: crawlRequest.payment_status,
        totalCost: crawlRequest.total_cost,
        currency: crawlRequest.currency,
        createdAt: crawlRequest.created_at,
        completedAt: crawlRequest.completed_at,
        results: crawlRequest.results ? JSON.parse(crawlRequest.results) : null,
        stripeSession: sessionStatus ? {
          id: sessionStatus.id,
          paymentStatus: sessionStatus.payment_status,
          customerEmail: sessionStatus.customer_details?.email,
          amountTotal: sessionStatus.amount_total,
          currency: sessionStatus.currency
        } : null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error retrieving checkout status:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
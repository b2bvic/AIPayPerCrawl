// Cloudflare Worker function for /api/crawl
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
      const { quoteId, apiKey: bodyApiKey } = body;

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
      const crawlResults = [];

      // Process each URL in the quote
      for (const item of items) {
        if (!item.available) {
          crawlResults.push({
            url: item.url,
            success: false,
            error: item.error || 'Domain not available for crawling'
          });
          continue;
        }

        try {
          // Create crawl request record
          const crawlId = `crawl_${crypto.randomUUID()}`;
          await env.DB.prepare(
            'INSERT INTO crawl_requests (id, domain_id, url, price, currency, status) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(crawlId, item.domain, item.url, item.pricePerRequest, item.currency, 'processing').run();

          // Import crawl service dynamically
          const { crawlUrl } = await import('../../src/lib/webAgent/crawlService.ts');
          
          // Perform actual crawl
          const crawlResponse = await crawlUrl({
            url: item.url,
            options: {
              includeHtml: false, // Save bandwidth
              includeText: true,
              includeMetadata: true,
              includeLinks: false,
              includeImages: false,
              timeout: 30000,
            }
          });
          
          const crawlData = {
            url: item.url,
            content: crawlResponse.text || '',
            timestamp: crawlResponse.crawledAt,
            metadata: crawlResponse.metadata,
            performance: crawlResponse.performance,
          };

          // Update crawl request status
          await env.DB.prepare(
            'UPDATE crawl_requests SET status = ?, response_time_ms = ? WHERE id = ?'
          ).bind('completed', 250, crawlId).run();

          crawlResults.push({
            url: item.url,
            success: true,
            crawlId,
            data: crawlData,
            cost: item.pricePerRequest,
            currency: item.currency
          });
        } catch (error) {
          crawlResults.push({
            url: item.url,
            success: false,
            error: error.message
          });
        }
      }

      return new Response(JSON.stringify({
        quoteId,
        results: crawlResults,
        totalCost: quote.total_cost,
        currency: quote.currency,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error processing crawl request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (request.method === 'GET') {
    // Get crawl status
    const url = new URL(request.url);
    const crawlId = url.searchParams.get('crawlId');

    if (!crawlId) {
      return new Response(
        JSON.stringify({ error: 'Crawl ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const crawl = await env.DB.prepare('SELECT * FROM crawl_requests WHERE id = ?')
        .bind(crawlId)
        .first();

      if (!crawl) {
        return new Response(
          JSON.stringify({ error: 'Crawl request not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({
        crawlId: crawl.id,
        url: crawl.url,
        status: crawl.status,
        price: crawl.price,
        currency: crawl.currency,
        responseTimeMs: crawl.response_time_ms,
        createdAt: crawl.created_at,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error retrieving crawl status:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
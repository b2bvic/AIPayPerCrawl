// Cloudflare Worker function for /api/quote
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

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { urls, callbackUrl, metadata } = body;

      // Validate request
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return new Response(
          JSON.stringify({ error: 'URLs array is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const quoteId = generateQuoteId();
      const items = [];
      let totalCost = 0;

      // Get traffic data for all domains in batch for efficiency
      const allDomains = [];
      const urlDomainMap = {};
      
      for (const url of urls) {
        try {
          const domain = new URL(url).hostname;
          allDomains.push(domain);
          urlDomainMap[url] = domain;
        } catch (error) {
          urlDomainMap[url] = null;
        }
      }

      // Fetch traffic data for all domains at once
      let trafficDataMap = {};
      if (allDomains.length > 0) {
        try {
          const apiBaseUrl = env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('host')}`;
          const trafficResponse = await fetch(`${apiBaseUrl}/api/traffic`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domains: allDomains })
          });
          
          if (trafficResponse.ok) {
            const trafficResult = await trafficResponse.json();
            if (trafficResult.success) {
              trafficDataMap = trafficResult.data.domains;
            }
          }
        } catch (error) {
          console.warn('Failed to fetch traffic data for pricing:', error);
        }
      }

      // Process each URL with enhanced pricing
      for (const url of urls) {
        try {
          const domain = urlDomainMap[url];
          
          if (!domain) {
            items.push({
              url,
              domain: '',
              pricePerRequest: 0,
              currency: 'USD',
              available: false,
              error: 'Invalid URL'
            });
            continue;
          }
          
          // Query D1 database for domain data
          const stmt = env.DB.prepare('SELECT * FROM domains WHERE domain = ?');
          const domainData = await stmt.bind(domain).first();

          if (!domainData || !domainData.pay_per_crawl_enabled) {
            items.push({
              url,
              domain,
              pricePerRequest: 0,
              currency: 'USD',
              available: false,
              error: 'Domain not found in Pay Per Crawl directory'
            });
            continue;
          }

          // Get traffic data for this domain
          const trafficData = trafficDataMap[domain];
          const estimatedTraffic = trafficData?.estimated_monthly_visits;
          const trafficConfidence = trafficData?.confidence || 'unknown';

          // Calculate dynamic pricing based on traffic and market conditions
          let dynamicPrice = domainData.price_per_request;
          
          if (estimatedTraffic) {
            // Adjust price based on traffic (higher traffic = higher value)
            const trafficMultiplier = Math.log10(Math.max(estimatedTraffic, 1000)) / 6; // Gentler scaling
            const confidenceAdjustment = {
              'high': 1.0,
              'medium': 0.95,
              'low': 0.85,
              'estimated': 0.8,
              'unknown': 0.9
            }[trafficConfidence] || 0.9;
            
            dynamicPrice = Math.max(
              domainData.price_per_request * 0.5, // Never go below 50% of base price
              domainData.price_per_request * trafficMultiplier * confidenceAdjustment
            );
          }

          // Apply market demand adjustment (simulated for now)
          const demandMultiplier = 0.9 + (Math.random() * 0.2); // 0.9 - 1.1 range
          dynamicPrice *= demandMultiplier;

          // Round to 6 decimal places
          dynamicPrice = Number(dynamicPrice.toFixed(6));

          items.push({
            url,
            domain,
            pricePerRequest: dynamicPrice,
            currency: domainData.currency || 'USD',
            available: true,
            trafficData: trafficData ? {
              estimatedMonthlyVisits: estimatedTraffic,
              confidence: trafficConfidence,
              dataSource: trafficData.data_source
            } : undefined,
            pricingFactors: {
              basePrice: domainData.price_per_request,
              trafficAdjustment: estimatedTraffic ? (dynamicPrice / domainData.price_per_request).toFixed(3) : 'N/A',
              demandAdjustment: demandMultiplier.toFixed(3)
            }
          });

          totalCost += dynamicPrice;
        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);
          items.push({
            url,
            domain: urlDomainMap[url] || '',
            pricePerRequest: 0,
            currency: 'USD',
            available: false,
            error: 'Processing error'
          });
        }
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const createdAt = new Date().toISOString();

      // Store quote in D1
      await env.DB.prepare(
        'INSERT INTO quotes (quote_id, total_cost, currency, items, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(quoteId, totalCost, 'USD', JSON.stringify(items), expiresAt, createdAt).run();

      const response = {
        quoteId,
        totalCost: Number(totalCost.toFixed(6)),
        currency: 'USD',
        items,
        expiresAt,
        createdAt,
      };

      // Add payment URL if there are available items
      const availableItems = items.filter(item => item.available);
      if (availableItems.length > 0 && totalCost > 0) {
        response.paymentUrl = `${env.NEXT_PUBLIC_APP_URL}/api/checkout?quoteId=${quoteId}`;
      }

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error generating quote:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const quoteId = url.searchParams.get('quoteId');

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: 'Quote ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const quote = await env.DB.prepare('SELECT * FROM quotes WHERE quote_id = ?')
        .bind(quoteId)
        .first();

      if (!quote) {
        return new Response(
          JSON.stringify({ error: 'Quote not found or expired' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({
        quoteId: quote.quote_id,
        totalCost: quote.total_cost,
        currency: quote.currency,
        items: JSON.parse(quote.items),
        expiresAt: quote.expires_at,
        createdAt: quote.created_at,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error retrieving quote:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

function generateQuoteId() {
  return `quote_${crypto.randomUUID()}`;
} 
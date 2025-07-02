// Cloudflare Worker function for /api/probe
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

  // POST method - probe domains for 402 responses
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { domains, timeout = 10000, concurrency = 10 } = body;

      // Validate request
      if (!domains || !Array.isArray(domains) || domains.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Domains array is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (domains.length > 100) {
        return new Response(
          JSON.stringify({ error: 'Maximum 100 domains per request' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Import probe service dynamically
      const { batchProbeFor402 } = await import('../../src/lib/webAgent/payPerCrawlProbe.ts');
      
      // Perform batch probing
      const probeResults = await batchProbeFor402({
        domains,
        timeout,
        concurrency,
      });

      // Store discovered Pay Per Crawl domains in database
      const discoveredDomains = probeResults.filter(probe => probe.hasPayPerCrawl);
      
      for (const probe of discoveredDomains) {
        try {
          // Check if domain already exists
          const existingDomain = await env.DB.prepare(
            'SELECT id FROM domains WHERE domain = ?'
          ).bind(probe.domain).first();

          if (!existingDomain) {
            // Insert new domain
            await env.DB.prepare(`
              INSERT INTO domains 
              (id, domain, pay_per_crawl_enabled, price_per_request, currency, 
               cloudflare_enabled, last_checked, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              crypto.randomUUID(),
              probe.domain,
              true,
              probe.pricePerRequest || 0.01,
              probe.currency || 'USD',
              probe.isCloudflare,
              probe.probedAt,
              probe.probedAt,
              probe.probedAt
            ).run();
          } else {
            // Update existing domain
            await env.DB.prepare(`
              UPDATE domains 
              SET pay_per_crawl_enabled = ?, 
                  price_per_request = ?, 
                  currency = ?,
                  cloudflare_enabled = ?,
                  last_checked = ?,
                  updated_at = ?
              WHERE domain = ?
            `).bind(
              true,
              probe.pricePerRequest || 0.01,
              probe.currency || 'USD',
              probe.isCloudflare,
              probe.probedAt,
              probe.probedAt,
              probe.domain
            ).run();
          }

          // Log discovery event
          await env.DB.prepare(
            'INSERT INTO analytics_events (id, event_type, metadata, timestamp) VALUES (?, ?, ?, ?)'
          ).bind(
            crypto.randomUUID(),
            'domain_discovered',
            JSON.stringify({
              domain: probe.domain,
              price: probe.pricePerRequest,
              currency: probe.currency,
              status: probe.status,
              responseTime: probe.responseTime
            }),
            probe.probedAt
          ).run();
        } catch (dbError) {
          console.error('Error storing domain:', dbError);
        }
      }

      const summary = {
        totalProbed: probeResults.length,
        payPerCrawlFound: discoveredDomains.length,
        cloudflareDetected: probeResults.filter(p => p.isCloudflare).length,
        averageResponseTime: Math.round(
          probeResults.reduce((sum, p) => sum + p.responseTime, 0) / probeResults.length
        ),
        errors: probeResults.filter(p => p.error).length
      };

      return new Response(JSON.stringify({
        success: true,
        summary,
        results: probeResults,
        discovered: discoveredDomains,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error processing probe request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET method - probe single domain or get probe status
  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const domain = url.searchParams.get('domain');
      const getDiscovered = url.searchParams.get('discovered') === 'true';

      if (getDiscovered) {
        // Return recently discovered Pay Per Crawl domains
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        const recentDomains = await env.DB.prepare(`
          SELECT domain, price_per_request, currency, last_checked, 
                 cloudflare_enabled, created_at
          FROM domains 
          WHERE pay_per_crawl_enabled = true 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(limit, offset).all();

        const totalCount = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM domains WHERE pay_per_crawl_enabled = true'
        ).first();

        return new Response(JSON.stringify({
          success: true,
          domains: recentDomains.results || [],
          pagination: {
            total: totalCount?.count || 0,
            limit,
            offset,
            hasMore: (totalCount?.count || 0) > offset + limit
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!domain) {
        return new Response(
          JSON.stringify({ error: 'Domain parameter is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Import probe service dynamically
      const { probeDomainFor402 } = await import('../../src/lib/webAgent/payPerCrawlProbe.ts');
      
      // Probe single domain
      const probeResult = await probeDomainFor402(domain);

      // Store result if Pay Per Crawl is detected
      if (probeResult.hasPayPerCrawl) {
        try {
          const existingDomain = await env.DB.prepare(
            'SELECT id FROM domains WHERE domain = ?'
          ).bind(probeResult.domain).first();

          if (!existingDomain) {
            await env.DB.prepare(`
              INSERT INTO domains 
              (id, domain, pay_per_crawl_enabled, price_per_request, currency, 
               cloudflare_enabled, last_checked, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              crypto.randomUUID(),
              probeResult.domain,
              true,
              probeResult.pricePerRequest || 0.01,
              probeResult.currency || 'USD',
              probeResult.isCloudflare,
              probeResult.probedAt,
              probeResult.probedAt,
              probeResult.probedAt
            ).run();
          }
        } catch (dbError) {
          console.error('Error storing single domain probe:', dbError);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        result: probeResult,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error processing single probe request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
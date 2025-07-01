// Cloudflare Worker function for /api/analytics
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
      const { eventType, domainId, metadata } = body;

      // Validate event type
      const validEventTypes = ['page_view', 'quote_created', 'crawl_requested', 'crawl_completed', 'payment_success', 'error'];
      if (!eventType || !validEventTypes.includes(eventType)) {
        return new Response(
          JSON.stringify({ error: 'Invalid event type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create analytics event
      const eventId = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      // Store event in database
      await env.DB.prepare(
        'INSERT INTO analytics_events (id, event_type, domain_id, metadata, timestamp) VALUES (?, ?, ?, ?, ?)'
      ).bind(eventId, eventType, domainId || null, JSON.stringify(metadata || {}), timestamp).run();

      return new Response(JSON.stringify({
        eventId,
        eventType,
        timestamp,
        success: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const domainId = url.searchParams.get('domainId');
      const publisherId = url.searchParams.get('publisherId');
      const eventType = url.searchParams.get('eventType');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      // Build query
      let query = 'SELECT * FROM analytics_events WHERE 1=1';
      const params = [];

      if (domainId) {
        query += ' AND domain_id = ?';
        params.push(domainId);
      }

      if (publisherId) {
        query += ' AND publisher_id = ?';
        params.push(publisherId);
      }

      if (eventType) {
        query += ' AND event_type = ?';
        params.push(eventType);
      }

      if (startDate) {
        query += ' AND timestamp >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND timestamp <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      // Execute query
      const stmt = env.DB.prepare(query);
      const results = await stmt.bind(...params).all();

      // Get aggregated stats if requested
      const includeStats = url.searchParams.get('includeStats') === 'true';
      let stats = null;

      if (includeStats) {
        // Get total crawl requests and revenue
        const crawlStats = await env.DB.prepare(
          'SELECT COUNT(*) as total_requests, SUM(price) as total_revenue FROM crawl_requests WHERE status = ?'
        ).bind('completed').first();

        // Get domain count
        const domainStats = await env.DB.prepare(
          'SELECT COUNT(*) as total_domains FROM domains WHERE pay_per_crawl_enabled = ?'
        ).bind(true).first();

        stats = {
          totalRequests: crawlStats?.total_requests || 0,
          totalRevenue: crawlStats?.total_revenue || 0,
          totalDomains: domainStats?.total_domains || 0,
          period: {
            start: startDate || 'all-time',
            end: endDate || 'now'
          }
        };
      }

      return new Response(JSON.stringify({
        events: results.results || [],
        pagination: {
          limit,
          offset,
          hasMore: results.results?.length === limit
        },
        stats
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
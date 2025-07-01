// Cloudflare Worker function for /api/domains
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

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || '';
      const minRank = parseInt(url.searchParams.get('minRank') || '0');
      const maxRank = parseInt(url.searchParams.get('maxRank') || '1000000');
      const enabled = url.searchParams.get('enabled');

      // Build query
      let query = 'SELECT * FROM domains WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND domain LIKE ?';
        params.push(`%${search}%`);
      }

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (minRank > 0) {
        query += ' AND rank >= ?';
        params.push(minRank);
      }

      if (maxRank < 1000000) {
        query += ' AND rank <= ?';
        params.push(maxRank);
      }

      if (enabled !== null) {
        query += ' AND pay_per_crawl_enabled = ?';
        params.push(enabled === 'true');
      }

      // Add pagination
      query += ' ORDER BY rank ASC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      // Execute query
      const stmt = env.DB.prepare(query);
      const results = await stmt.bind(...params).all();

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM domains WHERE 1=1';
      const countParams = params.slice(0, -2); // Remove limit and offset
      
      if (search) countQuery += ' AND domain LIKE ?';
      if (category) countQuery += ' AND category = ?';
      if (minRank > 0) countQuery += ' AND rank >= ?';
      if (maxRank < 1000000) countQuery += ' AND rank <= ?';
      if (enabled !== null) countQuery += ' AND pay_per_crawl_enabled = ?';

      const countStmt = env.DB.prepare(countQuery);
      const countResult = await countStmt.bind(...countParams).first();

      return new Response(JSON.stringify({
        domains: results.results || [],
        total: countResult?.total || 0,
        limit,
        offset,
        hasMore: offset + limit < (countResult?.total || 0)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching domains:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { domain, pricePerRequest, category } = body;

      // Validate
      if (!domain) {
        return new Response(
          JSON.stringify({ error: 'Domain is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if domain exists
      const existing = await env.DB.prepare('SELECT id FROM domains WHERE domain = ?')
        .bind(domain)
        .first();

      if (existing) {
        // Update existing domain
        await env.DB.prepare(
          'UPDATE domains SET price_per_request = ?, category = ?, pay_per_crawl_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE domain = ?'
        ).bind(pricePerRequest || 0.001, category || null, true, domain).run();
      } else {
        // Insert new domain
        await env.DB.prepare(
          'INSERT INTO domains (domain, price_per_request, category, pay_per_crawl_enabled) VALUES (?, ?, ?, ?)'
        ).bind(domain, pricePerRequest || 0.001, category || null, true).run();
      }

      return new Response(JSON.stringify({ success: true, domain }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating/updating domain:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
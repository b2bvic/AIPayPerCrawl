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
      const vertical = url.searchParams.get('vertical') || '';
      const category = url.searchParams.get('category') || vertical; // Support both vertical and category
      const minRank = parseInt(url.searchParams.get('minRank') || '0');
      const maxRank = parseInt(url.searchParams.get('maxRank') || '1000000');
      const enabled = url.searchParams.get('enabled');
      const sortBy = url.searchParams.get('sortBy') || 'rank';
      const sortOrder = url.searchParams.get('sortOrder') || 'asc';

      // Build query with enhanced filtering
      let query = `SELECT 
        id,
        domain,
        is_cloudflare as isCloudflare,
        has_pay_per_crawl as hasPayPerCrawl,
        price_per_request as pricePerRequest,
        currency,
        status,
        traffic,
        vertical,
        category,
        cpm,
        claim_status as claimStatus,
        created_at as createdAt,
        updated_at as updatedAt,
        rank
      FROM domains WHERE 1=1`;
      const params = [];

      // Search filter
      if (search) {
        query += ' AND (domain LIKE ? OR vertical LIKE ? OR category LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Vertical/Category filter
      if (vertical || category) {
        query += ' AND (vertical = ? OR category = ?)';
        const filterValue = vertical || category;
        params.push(filterValue, filterValue);
      }

      // Rank filters
      if (minRank > 0) {
        query += ' AND rank >= ?';
        params.push(minRank);
      }

      if (maxRank < 1000000) {
        query += ' AND rank <= ?';
        params.push(maxRank);
      }

      // Enabled filter
      if (enabled !== null) {
        query += ' AND pay_per_crawl_enabled = ?';
        params.push(enabled === 'true');
      }

      // Default to only enabled domains for pricing page
      if (enabled === null) {
        query += ' AND pay_per_crawl_enabled = ?';
        params.push(true);
      }

      // Sorting with proper field mapping
      const sortMapping = {
        'domain': 'domain',
        'price': 'price_per_request',
        'cpm': 'cpm',
        'traffic': 'traffic',
        'vertical': 'vertical',
        'rank': 'rank'
      };

      const sortField = sortMapping[sortBy] || 'rank';
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      
      // Handle NULL values in sorting
      if (sortField === 'cpm' || sortField === 'traffic') {
        query += ` ORDER BY ${sortField} IS NULL, ${sortField} ${sortDirection}`;
      } else {
        query += ` ORDER BY ${sortField} ${sortDirection}`;
      }

      // Add pagination
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      // Execute query
      const stmt = env.DB.prepare(query);
      const results = await stmt.bind(...params).all();

      // Get total count with same filters
      let countQuery = 'SELECT COUNT(*) as total FROM domains WHERE 1=1';
      const countParams = [];

      if (search) {
        countQuery += ' AND (domain LIKE ? OR vertical LIKE ? OR category LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (vertical || category) {
        countQuery += ' AND (vertical = ? OR category = ?)';
        const filterValue = vertical || category;
        countParams.push(filterValue, filterValue);
      }

      if (minRank > 0) {
        countQuery += ' AND rank >= ?';
        countParams.push(minRank);
      }

      if (maxRank < 1000000) {
        countQuery += ' AND rank <= ?';
        countParams.push(maxRank);
      }

      if (enabled !== null) {
        countQuery += ' AND pay_per_crawl_enabled = ?';
        countParams.push(enabled === 'true');
      } else {
        countQuery += ' AND pay_per_crawl_enabled = ?';
        countParams.push(true);
      }

      const countStmt = env.DB.prepare(countQuery);
      const countResult = await countStmt.bind(...countParams).first();

      // Get available filters for the response
      const verticalQuery = 'SELECT DISTINCT vertical FROM domains WHERE vertical IS NOT NULL AND pay_per_crawl_enabled = ? ORDER BY vertical';
      const verticalStmt = env.DB.prepare(verticalQuery);
      const verticalResults = await verticalStmt.bind(true).all();
      const availableVerticals = verticalResults.results?.map(r => r.vertical) || [];

      // Get category stats
      const categoryQuery = `
        SELECT 
          vertical,
          COUNT(*) as count,
          AVG(price_per_request) as avgPrice,
          AVG(cpm) as avgCPM,
          AVG(traffic) as avgTraffic
        FROM domains 
        WHERE vertical IS NOT NULL AND pay_per_crawl_enabled = ?
        GROUP BY vertical
        ORDER BY count DESC
      `;
      const categoryStmt = env.DB.prepare(categoryQuery);
      const categoryResults = await categoryStmt.bind(true).all();

      return new Response(JSON.stringify({
        domains: results.results || [],
        pagination: {
          total: countResult?.total || 0,
          limit,
          offset,
          hasMore: offset + limit < (countResult?.total || 0)
        },
        filters: {
          verticals: availableVerticals,
          categoryStats: categoryResults.results || []
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching domains:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { domain, pricePerRequest, category, vertical, traffic, cpm } = body;

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
        // Update existing domain with enhanced fields
        await env.DB.prepare(`
          UPDATE domains SET 
            price_per_request = ?, 
            category = ?, 
            vertical = ?,
            traffic = ?,
            cpm = ?,
            pay_per_crawl_enabled = ?, 
            updated_at = CURRENT_TIMESTAMP 
          WHERE domain = ?
        `).bind(
          pricePerRequest || 0.001, 
          category || null, 
          vertical || category || null,
          traffic || null,
          cpm || null,
          true, 
          domain
        ).run();
      } else {
        // Insert new domain with enhanced fields
        await env.DB.prepare(`
          INSERT INTO domains (
            domain, 
            price_per_request, 
            category, 
            vertical,
            traffic,
            cpm,
            pay_per_crawl_enabled
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          domain, 
          pricePerRequest || 0.001, 
          category || null, 
          vertical || category || null,
          traffic || null,
          cpm || null,
          true
        ).run();
      }

      return new Response(JSON.stringify({ success: true, domain }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating/updating domain:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
} 
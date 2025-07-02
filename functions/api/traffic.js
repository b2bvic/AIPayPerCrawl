// Traffic Data API - Integrates with multiple traffic data sources
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { domains } = await request.json();
    
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Domains array is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (domains.length > 100) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Maximum 100 domains per request'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trafficData = await getTrafficData(domains, env);
    
    // Store in analytics
    await env.KV_CACHE.put(
      `analytics:traffic_lookup:${Date.now()}`,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        domains: domains.length,
        sources_used: trafficData.sources_used
      }),
      { expirationTtl: 86400 } // 24 hours
    );
    
    return new Response(JSON.stringify({
      success: true,
      data: trafficData
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Traffic API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getTrafficData(domains, env) {
  const results = {};
  const sources_used = [];
  
  // 1. Try Tranco List (Free, updated daily)
  const trancoData = await getTrancoData(domains, env);
  if (trancoData.success) {
    sources_used.push('tranco');
    Object.assign(results, trancoData.data);
  }
  
  // 2. Try SimilarWeb API (Premium)
  if (env.SIMILARWEB_API_KEY) {
    const similarWebData = await getSimilarWebData(domains, env);
    if (similarWebData.success) {
      sources_used.push('similarweb');
      // Merge with higher priority
      Object.assign(results, similarWebData.data);
    }
  }
  
  // 3. Try Alexa API (if available)
  if (env.ALEXA_API_KEY) {
    const alexaData = await getAlexaData(domains, env);
    if (alexaData.success) {
      sources_used.push('alexa');
      Object.assign(results, alexaData.data);
    }
  }
  
  // 4. Fill in missing data with estimates
  for (const domain of domains) {
    if (!results[domain]) {
      results[domain] = generateTrafficEstimate(domain);
    }
  }
  
  return {
    domains: results,
    sources_used,
    updated_at: new Date().toISOString()
  };
}

// Tranco List Integration (Free)
async function getTrancoData(domains, env) {
  try {
    // Check cache first
    const cacheKey = 'tranco:list:' + new Date().toISOString().split('T')[0];
    let trancoList = await env.KV_CACHE.get(cacheKey);
    
    if (!trancoList) {
      // Fetch latest Tranco list
      const response = await fetch('https://tranco-list.eu/download_daily/2024-01-01/1000000', {
        headers: {
          'User-Agent': 'AIPayPerCrawl-TrafficAnalyzer/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Tranco API error: ${response.status}`);
      }
      
      const csvData = await response.text();
      trancoList = parseTrancoCSV(csvData);
      
      // Cache for 24 hours
      await env.KV_CACHE.put(cacheKey, JSON.stringify(trancoList), {
        expirationTtl: 86400
      });
    } else {
      trancoList = JSON.parse(trancoList);
    }
    
    const results = {};
    for (const domain of domains) {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
      const ranking = trancoList[cleanDomain];
      
      if (ranking) {
        results[domain] = {
          global_rank: ranking,
          estimated_monthly_visits: estimateVisitsFromRank(ranking),
          data_source: 'tranco',
          confidence: 'medium'
        };
      }
    }
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('Tranco API error:', error);
    return { success: false, error: error.message };
  }
}

// SimilarWeb API Integration (Premium)
async function getSimilarWebData(domains, env) {
  try {
    const results = {};
    
    for (const domain of domains) {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      const response = await fetch(`https://api.similarweb.com/v1/similar-rank/${cleanDomain}/rank`, {
        headers: {
          'Authorization': `Bearer ${env.SIMILARWEB_API_KEY}`,
          'User-Agent': 'AIPayPerCrawl-TrafficAnalyzer/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        results[domain] = {
          global_rank: data.similar_rank?.rank,
          estimated_monthly_visits: data.estimated_monthly_visits,
          category: data.category,
          country_rank: data.country_rank,
          data_source: 'similarweb',
          confidence: 'high'
        };
      }
    }
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('SimilarWeb API error:', error);
    return { success: false, error: error.message };
  }
}

// Alexa API Integration (if available)
async function getAlexaData(domains, env) {
  try {
    const results = {};
    
    for (const domain of domains) {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      // Alexa API is deprecated, but keeping structure for other providers
      const response = await fetch(`https://data.alexa.com/data?cli=10&url=${cleanDomain}`, {
        headers: {
          'Authorization': `Bearer ${env.ALEXA_API_KEY}`,
          'User-Agent': 'AIPayPerCrawl-TrafficAnalyzer/1.0'
        }
      });
      
      if (response.ok) {
        const xmlData = await response.text();
        const rank = parseAlexaXML(xmlData);
        
        if (rank) {
          results[domain] = {
            global_rank: rank,
            estimated_monthly_visits: estimateVisitsFromRank(rank),
            data_source: 'alexa',
            confidence: 'medium'
          };
        }
      }
    }
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('Alexa API error:', error);
    return { success: false, error: error.message };
  }
}

// Helper Functions
function parseTrancoCSV(csvData) {
  const lines = csvData.split('\n');
  const ranking = {};
  
  for (const line of lines) {
    if (line.trim()) {
      const [rank, domain] = line.split(',');
      if (rank && domain) {
        ranking[domain.trim()] = parseInt(rank);
      }
    }
  }
  
  return ranking;
}

function parseAlexaXML(xmlData) {
  // Simple XML parsing for Alexa rank
  const match = xmlData.match(/<REACH[^>]*RANK="(\d+)"/);
  return match ? parseInt(match[1]) : null;
}

function estimateVisitsFromRank(rank) {
  // Traffic estimation algorithm based on global rank
  if (rank <= 100) return Math.floor(50000000 - (rank * 200000));
  if (rank <= 1000) return Math.floor(10000000 - (rank * 5000));
  if (rank <= 10000) return Math.floor(2000000 - (rank * 150));
  if (rank <= 100000) return Math.floor(500000 - (rank * 4));
  if (rank <= 1000000) return Math.floor(100000 - (rank * 0.08));
  return Math.floor(10000 - (rank * 0.005));
}

function generateTrafficEstimate(domain) {
  // Generate basic estimate based on domain characteristics
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const tld = cleanDomain.split('.').pop();
  const domainLength = cleanDomain.length;
  
  let baseTraffic = 5000; // Base estimate
  
  // Adjust based on TLD
  const popularTLDs = ['com', 'org', 'net', 'edu', 'gov'];
  if (popularTLDs.includes(tld)) {
    baseTraffic *= 2;
  }
  
  // Adjust based on domain length (shorter = potentially more valuable)
  if (domainLength < 8) {
    baseTraffic *= 1.5;
  } else if (domainLength > 15) {
    baseTraffic *= 0.7;
  }
  
  // Add randomization to avoid patterns
  const randomMultiplier = 0.5 + Math.random();
  baseTraffic = Math.floor(baseTraffic * randomMultiplier);
  
  return {
    global_rank: Math.floor(Math.random() * 1000000) + 100000,
    estimated_monthly_visits: baseTraffic,
    data_source: 'estimated',
    confidence: 'low'
  };
}

// GET endpoint for individual domain lookup
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const domain = url.searchParams.get('domain');
  
  if (!domain) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Domain parameter is required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const trafficData = await getTrafficData([domain], env);
    
    return new Response(JSON.stringify({
      success: true,
      data: trafficData.domains[domain] || null,
      sources_used: trafficData.sources_used
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Traffic GET API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
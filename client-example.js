/**
 * AIPayPerCrawl Client Library Example
 * This shows how to integrate with the AIPayPerCrawl API
 */

class AIPayPerCrawlClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'https://aipaypercrawl.com/api';
    this.apiKey = config.apiKey || '';
    this.timeout = config.timeout || 30000;
  }

  // Helper method for API calls
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...(options.headers || {})
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get available domains
  async getDomains(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/domains${queryString ? `?${queryString}` : ''}`);
  }

  // Create a quote for crawling URLs
  async createQuote(urls, options = {}) {
    return this.request('/quote', {
      method: 'POST',
      body: JSON.stringify({
        urls,
        callbackUrl: options.callbackUrl,
        metadata: options.metadata
      })
    });
  }

  // Get quote details
  async getQuote(quoteId) {
    return this.request(`/quote?quoteId=${quoteId}`);
  }

  // Execute a crawl based on a quote
  async executeCrawl(quoteId) {
    return this.request('/crawl', {
      method: 'POST',
      body: JSON.stringify({ quoteId })
    });
  }

  // Get crawl status
  async getCrawlStatus(crawlId) {
    return this.request(`/crawl?crawlId=${crawlId}`);
  }

  // Track an analytics event
  async trackEvent(eventType, metadata = {}) {
    return this.request('/analytics', {
      method: 'POST',
      body: JSON.stringify({ eventType, metadata })
    });
  }

  // Get analytics data
  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics${queryString ? `?${queryString}` : ''}`);
  }

  // Convenience method: Quote and crawl in one call
  async crawlUrls(urls, options = {}) {
    // Step 1: Create quote
    const quote = await this.createQuote(urls, options);
    
    if (quote.totalCost === 0) {
      throw new Error('No crawlable URLs found');
    }

    // Step 2: Execute crawl
    const crawlResult = await this.executeCrawl(quote.quoteId);
    
    return {
      quote,
      crawlResult
    };
  }
}

// Example usage
async function example() {
  // Initialize client
  const client = new AIPayPerCrawlClient({
    baseUrl: 'http://localhost:8788/api', // or 'https://your-domain.com/api'
    apiKey: 'your-api-key-here'
  });

  try {
    // Example 1: Get available domains
    console.log('📋 Fetching available domains...');
    const domains = await client.getDomains({
      limit: 10,
      search: 'news',
      minTraffic: 10000
    });
    console.log(`Found ${domains.domains.length} domains`);

    // Example 2: Create a quote
    console.log('\n💰 Creating quote...');
    const quote = await client.createQuote([
      'https://example.com/page1',
      'https://news-site.com/article',
      'https://ecommerce-store.com/product'
    ], {
      metadata: { campaign: 'test-crawl' }
    });
    console.log(`Quote ID: ${quote.quoteId}`);
    console.log(`Total cost: $${quote.totalCost}`);
    console.log(`Available URLs: ${quote.items.filter(i => i.available).length}/${quote.items.length}`);

    // Example 3: Execute crawl
    if (quote.totalCost > 0) {
      console.log('\n🕷️  Executing crawl...');
      const crawlResult = await client.executeCrawl(quote.quoteId);
      console.log(`Crawled ${crawlResult.results.length} URLs`);
      
      // Check individual results
      crawlResult.results.forEach(result => {
        if (result.success) {
          console.log(`✅ ${result.url} - Crawled successfully`);
        } else {
          console.log(`❌ ${result.url} - Failed: ${result.error}`);
        }
      });
    }

    // Example 4: Track analytics
    console.log('\n📊 Tracking event...');
    await client.trackEvent('api_test_completed', {
      urls_count: quote.items.length,
      success: true
    });

    // Example 5: Use convenience method
    console.log('\n🚀 Using convenience method...');
    const result = await client.crawlUrls([
      'https://example.com/another-page'
    ]);
    console.log('Crawl completed:', result.crawlResult.results[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Export for use in other projects
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIPayPerCrawlClient;
}

// Run example if called directly
if (require.main === module) {
  example();
} 
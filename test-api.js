#!/usr/bin/env node

/**
 * Test script for AIPayPerCrawl API endpoints
 * Usage: node test-api.js <environment>
 * Where environment is either 'local' or 'production'
 */

const environment = process.argv[2] || 'local';
const BASE_URL = process.env.BASE_URL || (environment === 'local' 
  ? 'http://localhost:8788/api' 
  : 'https://a9b6413a.aipaypercrawl.pages.dev/api');

const API_KEY = 'test-api-key-123'; // Replace with your actual API key

// Test data
const testUrls = [
  'https://example.com/page1',
  'https://news-site.com/article',
  'https://ecommerce-store.com/product'
];

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test functions
async function testDomains() {
  console.log('\n🔍 Testing Domains API...');
  
  const response = await apiCall('/domains?limit=10');
  
  if (response.ok) {
    console.log(`✅ Domains API working - Found ${response.data.domains?.length || 0} domains`);
    if (response.data.domains?.length > 0) {
      console.log('   Sample domain:', response.data.domains[0].domain);
    }
  } else {
    console.log('❌ Domains API failed:', response.data.error || response.error);
  }
  
  return response.ok;
}

async function testQuote() {
  console.log('\n💰 Testing Quote API...');
  
  const response = await apiCall('/quote', 'POST', {
    urls: testUrls,
    metadata: { source: 'test-script' }
  });
  
  if (response.ok) {
    console.log(`✅ Quote API working - Quote ID: ${response.data.quoteId}`);
    console.log(`   Total cost: $${response.data.totalCost} ${response.data.currency}`);
    console.log(`   Available URLs: ${response.data.items.filter(i => i.available).length}/${response.data.items.length}`);
    
    // Store quote ID for next test
    return response.data.quoteId;
  } else {
    console.log('❌ Quote API failed:', response.data.error || response.error);
    return null;
  }
}

async function testCrawl(quoteId) {
  if (!quoteId) {
    console.log('\n🕷️  Skipping Crawl API test (no quote ID)');
    return false;
  }
  
  console.log('\n🕷️  Testing Crawl API...');
  
  const response = await apiCall('/crawl', 'POST', {
    quoteId: quoteId
  });
  
  if (response.ok) {
    console.log(`✅ Crawl API working - Processed ${response.data.results.length} URLs`);
    const successful = response.data.results.filter(r => r.success).length;
    console.log(`   Successful crawls: ${successful}/${response.data.results.length}`);
    
    // Get the first successful crawl ID for status test
    const crawlId = response.data.results.find(r => r.success)?.crawlId;
    if (crawlId) {
      await testCrawlStatus(crawlId);
    }
  } else {
    console.log('❌ Crawl API failed:', response.data.error || response.error);
  }
  
  return response.ok;
}

async function testCrawlStatus(crawlId) {
  console.log('\n📊 Testing Crawl Status API...');
  
  const response = await apiCall(`/crawl?crawlId=${crawlId}`);
  
  if (response.ok) {
    console.log(`✅ Crawl Status API working - Status: ${response.data.status}`);
  } else {
    console.log('❌ Crawl Status API failed:', response.data.error || response.error);
  }
  
  return response.ok;
}

async function testCheckout() {
  console.log('\n💳 Testing Checkout API...');
  
  // First get a quote
  const quoteResponse = await apiCall('/quote', 'POST', {
    urls: testUrls.slice(0, 2) // Use first 2 URLs for testing
  });
  
  if (!quoteResponse.ok) {
    console.log('❌ Checkout test failed - Could not create quote:', quoteResponse.data?.error || quoteResponse.error);
    return false;
  }
  
  const quoteId = quoteResponse.data.quoteId;
  console.log(`   Created quote: ${quoteId}`);
  
  // Test creating checkout session (will fail without Stripe keys, but should return proper error)
  const checkoutResponse = await apiCall('/checkout', 'POST', {
    quoteId,
    returnUrl: 'https://example.com/success',
    cancelUrl: 'https://example.com/cancel'
  });
  
  if (checkoutResponse.ok) {
    console.log(`✅ Checkout session created - Session ID: ${checkoutResponse.data.sessionId}`);
    console.log(`   Checkout URL: ${checkoutResponse.data.checkoutUrl}`);
    console.log(`   Total amount: ${checkoutResponse.data.totalAmount} ${checkoutResponse.data.currency}`);
    return true;
  } else if (checkoutResponse.status === 503 && checkoutResponse.data?.error === 'Payment processing not configured') {
    console.log('⚠️  Checkout API working but Stripe not configured (expected for testing)');
    return true;
  } else {
    console.log('❌ Checkout failed:', checkoutResponse.data?.error || checkoutResponse.error);
    return false;
  }
}

async function testEmail() {
  console.log('\n📧 Testing Email API...');
  
  // Test sending a verification email
  const emailResponse = await apiCall('/email/send', 'POST', {
    type: 'publisher_verification',
    to: 'test@example.com',
    data: {
      name: 'Test User',
      email: 'test@example.com',
      verificationToken: 'test-token-123'
    }
  });
  
  if (emailResponse.ok) {
    console.log(`✅ Email API working - Email ID: ${emailResponse.data.emailId}`);
    console.log(`   Message: ${emailResponse.data.message}`);
    return true;
  } else if (emailResponse.data?.message === 'Email service not configured (development mode)') {
    console.log('⚠️  Email API working but service not configured (expected for testing)');
    return true;
  } else {
    console.log('❌ Email API failed:', emailResponse.data?.error || emailResponse.error);
    return false;
  }
}

async function testTraffic() {
  console.log('\n📊 Testing Traffic Data API...');
  
  // Test single domain lookup
  const singleResponse = await apiCall('/traffic?domain=example.com');
  
  if (singleResponse.ok) {
    const data = singleResponse.data.data;
    console.log(`✅ Single domain lookup working`);
    console.log(`   Domain: example.com`);
    console.log(`   Traffic: ${data?.estimated_monthly_visits?.toLocaleString() || 'N/A'} monthly visits`);
    console.log(`   Global rank: ${data?.global_rank?.toLocaleString() || 'N/A'}`);
    console.log(`   Data source: ${data?.data_source || 'N/A'}`);
    console.log(`   Confidence: ${data?.confidence || 'N/A'}`);
  } else {
    console.log('❌ Single domain traffic lookup failed:', singleResponse.data?.error || singleResponse.error);
  }
  
  // Test batch domain lookup
  const testDomains = ['example.com', 'github.com', 'stackoverflow.com'];
  const batchResponse = await apiCall('/traffic', 'POST', {
    domains: testDomains
  });
  
  if (batchResponse.ok) {
    const data = batchResponse.data.data;
    console.log(`✅ Batch domain lookup working`);
    console.log(`   Processed ${testDomains.length} domains`);
    console.log(`   Sources used: ${data.sources_used?.join(', ') || 'none'}`);
    
    // Show sample data
    for (const domain of testDomains) {
      const domainData = data.domains[domain];
      if (domainData) {
        console.log(`   ${domain}: ${domainData.estimated_monthly_visits?.toLocaleString() || 'N/A'} visits (${domainData.confidence})`);
      }
    }
    
    return true;
  } else {
    console.log('❌ Batch domain traffic lookup failed:', batchResponse.data?.error || batchResponse.error);
    return false;
  }
}

async function testAnalytics() {
  console.log('\n📈 Testing Analytics API...');
  
  // Test posting an event
  const postResponse = await apiCall('/analytics', 'POST', {
    eventType: 'page_view',
    metadata: { page: '/test', source: 'test-script' }
  });
  
  if (postResponse.ok) {
    console.log(`✅ Analytics POST working - Event ID: ${postResponse.data.eventId}`);
  } else {
    console.log('❌ Analytics POST failed:', postResponse.data.error || postResponse.error);
  }
  
  // Test getting analytics
  const getResponse = await apiCall('/analytics?includeStats=true&limit=5');
  
  if (getResponse.ok) {
    console.log(`✅ Analytics GET working - Found ${getResponse.data.events.length} events`);
    if (getResponse.data.stats) {
      console.log(`   Total requests: ${getResponse.data.stats.totalRequests}`);
      console.log(`   Total revenue: $${getResponse.data.stats.totalRevenue}`);
      console.log(`   Total domains: ${getResponse.data.stats.totalDomains}`);
    }
  } else {
    console.log('❌ Analytics GET failed:', getResponse.data.error || getResponse.error);
  }
  
  return postResponse.ok && getResponse.ok;
}

// Main test runner
async function runTests() {
  console.log(`🧪 Testing AIPayPerCrawl APIs on ${environment}...`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   API Key: ${API_KEY.slice(0, 10)}...`);
  
  const results = {
    domains: await testDomains(),
    traffic: await testTraffic(),
    quote: null,
    checkout: await testCheckout(),
    email: await testEmail(),
    crawl: false,
    analytics: await testAnalytics()
  };
  
  // Quote test returns the quote ID
  const quoteId = await testQuote();
  results.quote = !!quoteId;
  
  // Crawl test needs the quote ID
  results.crawl = await testCrawl(quoteId);
  
  // Summary
  console.log('\n📋 Test Summary:');
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    console.log(`   ${result ? '✅' : '❌'} ${test.charAt(0).toUpperCase() + test.slice(1)}`);
  });
  
  console.log(`\n${passed === total ? '🎉' : '⚠️ '} ${passed}/${total} tests passed`);
  
  if (passed < total) {
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
}); 
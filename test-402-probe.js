#!/usr/bin/env node

// Test script for Pay Per Crawl 402 probing functionality
const API_BASE_URL = 'https://aipaypercrawl.com/api';
// const API_BASE_URL = 'http://localhost:8788/api'; // For local testing

async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'test-key-12345', // Add your API key here
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: result,
      error: response.ok ? null : result.error || 'Unknown error'
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message
    };
  }
}

async function testSingleDomainProbe() {
  console.log('\n🔍 Testing Single Domain Probe...');
  
  // Test with a known domain that might have Pay Per Crawl
  const testDomain = 'businessinsider.com';
  
  const response = await apiCall(`/probe?domain=${testDomain}`);
  
  if (response.ok) {
    const { result } = response.data;
    console.log(`✅ Single probe successful for ${testDomain}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Response Time: ${result.responseTime}ms`);
    console.log(`   Cloudflare: ${result.isCloudflare ? 'Yes' : 'No'}`);
    console.log(`   Pay Per Crawl: ${result.hasPayPerCrawl ? 'Yes' : 'No'}`);
    
    if (result.hasPayPerCrawl) {
      console.log(`   🎯 FOUND Pay Per Crawl!`);
      console.log(`   Price: ${result.pricePerRequest} ${result.currency}`);
      console.log(`   Headers:`, result.headers);
    }
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  } else {
    console.log('❌ Single probe failed:', response.error);
  }
  
  return response.ok;
}

async function testBatchDomainProbe() {
  console.log('\n🔍 Testing Batch Domain Probe...');
  
  // Test with a mix of domains that might have Pay Per Crawl
  const testDomains = [
    'businessinsider.com',
    'cnn.com',
    'bbc.com',
    'reuters.com',
    'nytimes.com',
    'wsj.com',
    'bloomberg.com',
    'techcrunch.com',
    'theverge.com',
    'medium.com'
  ];
  
  const response = await apiCall('/probe', 'POST', {
    domains: testDomains,
    timeout: 10000,
    concurrency: 5
  });
  
  if (response.ok) {
    const { summary, discovered, results } = response.data;
    console.log(`✅ Batch probe successful`);
    console.log(`   Total Probed: ${summary.totalProbed}`);
    console.log(`   Pay Per Crawl Found: ${summary.payPerCrawlFound}`);
    console.log(`   Cloudflare Detected: ${summary.cloudflareDetected}`);
    console.log(`   Average Response Time: ${summary.averageResponseTime}ms`);
    console.log(`   Errors: ${summary.errors}`);
    
    if (discovered.length > 0) {
      console.log('\n🎯 DISCOVERED Pay Per Crawl domains:');
      discovered.forEach(domain => {
        console.log(`   - ${domain.domain}: ${domain.pricePerRequest} ${domain.currency}`);
      });
    }
    
    // Show detailed results for first few domains
    console.log('\n📊 Sample Results:');
    results.slice(0, 3).forEach(result => {
      console.log(`   ${result.domain}: ${result.status} (${result.responseTime}ms) ${result.hasPayPerCrawl ? '💰' : '🚫'}`);
    });
  } else {
    console.log('❌ Batch probe failed:', response.error);
  }
  
  return response.ok;
}

async function testDiscoveredDomains() {
  console.log('\n📋 Testing Discovered Domains List...');
  
  const response = await apiCall('/probe?discovered=true&limit=10');
  
  if (response.ok) {
    const { domains, pagination } = response.data;
    console.log(`✅ Retrieved discovered domains`);
    console.log(`   Total Pay Per Crawl domains: ${pagination.total}`);
    console.log(`   Showing: ${domains.length} domains`);
    
    if (domains.length > 0) {
      console.log('\n💰 Recently Discovered Pay Per Crawl Domains:');
      domains.forEach(domain => {
        console.log(`   - ${domain.domain}: ${domain.price_per_request} ${domain.currency} (${domain.cloudflare_enabled ? 'Cloudflare' : 'Other'})`);
      });
    } else {
      console.log('   No Pay Per Crawl domains discovered yet');
    }
  } else {
    console.log('❌ Failed to get discovered domains:', response.error);
  }
  
  return response.ok;
}

async function demonstratePayPerCrawlDiscovery() {
  console.log('🚀 AI Pay Per Crawl - 402 Discovery Test');
  console.log('=====================================');
  console.log('This script demonstrates the core 402 HEAD request functionality');
  console.log('that discovers domains with Pay Per Crawl enabled.\n');
  
  const results = [];
  
  // Test single domain probe
  results.push(await testSingleDomainProbe());
  
  // Test batch domain probe
  results.push(await testBatchDomainProbe());
  
  // Test discovered domains list
  results.push(await testDiscoveredDomains());
  
  // Summary
  const successful = results.filter(Boolean).length;
  console.log('\n📈 Test Summary');
  console.log('===============');
  console.log(`Tests passed: ${successful}/${results.length}`);
  
  if (successful === results.length) {
    console.log('🎉 All 402 probe tests passed!');
    console.log('\n🎯 Your Pay Per Crawl discovery engine is working!');
    console.log('Next steps:');
    console.log('- Set up continuous probing of top 10K domains');
    console.log('- Integrate with BuiltWith or Tranco for domain lists');
    console.log('- Add webhook notifications for new discoveries');
    console.log('- Build the frontend discovery dashboard');
  } else {
    console.log('⚠️  Some tests failed. Check the API endpoints and database.');
  }
}

// Run the demonstration
demonstratePayPerCrawlDiscovery().catch(console.error); 
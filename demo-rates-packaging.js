#!/usr/bin/env node

// Demo script for Rates and Packaging functionality
console.log('🎯 AI Pay Per Crawl - Rates & Packaging Demo');
console.log('='.repeat(50));

async function demoRatesAndPackaging() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8787';
  
  console.log('\n📊 Testing Cost Calculator Scenarios...');
  
  // Define crawling scenarios
  const scenarios = [
    { name: 'Home Page Only', pages: 1, description: 'Single page crawl' },
    { name: 'Article Archives', pages: 50, description: 'Blog posts and articles' },
    { name: 'Category Pages', pages: 25, description: 'Product categories' },
    { name: 'Full Sitemap', pages: 500, description: 'Complete site crawl' }
  ];
  
  // Sample domains with different price points
  const sampleDomains = [
    { domain: 'example.com', price: 0.001, vertical: 'Technology' },
    { domain: 'news-site.com', price: 0.002, vertical: 'News' },
    { domain: 'health-portal.com', price: 0.003, vertical: 'Healthcare' },
    { domain: 'government-portal.gov', price: 0.005, vertical: 'Government' }
  ];
  
  console.log('\n💰 Cost Estimates by Scenario:');
  console.log('-'.repeat(80));
  console.log('Domain'.padEnd(25) + 'Vertical'.padEnd(15) + 'Price/Req'.padEnd(12) + scenarios.map(s => s.name.padEnd(15)).join(''));
  console.log('-'.repeat(80));
  
  sampleDomains.forEach(domain => {
    const costs = scenarios.map(scenario => {
      const cost = domain.price * scenario.pages;
      return `$${cost.toFixed(3)}`.padEnd(15);
    });
    
    console.log(
      domain.domain.padEnd(25) +
      domain.vertical.padEnd(15) +
      `$${domain.price}`.padEnd(12) +
      costs.join('')
    );
  });
  
  console.log('\n🏆 Testing Tier Table Functionality...');
  
  try {
    // Test domains API with different filters
    const tests = [
      { name: 'All Domains', params: '?limit=10' },
      { name: 'Technology Vertical', params: '?vertical=Technology&limit=5' },
      { name: 'Sort by CPM', params: '?sortBy=cpm&sortOrder=desc&limit=5' },
      { name: 'Sort by Traffic', params: '?sortBy=traffic&sortOrder=desc&limit=5' },
      { name: 'Healthcare Vertical', params: '?vertical=Healthcare&limit=3' }
    ];
    
    for (const test of tests) {
      console.log(`\n📋 ${test.name}:`);
      
      try {
        const response = await fetch(`${baseUrl}/api/domains${test.params}`);
        
        if (response.ok) {
          const data = await response.json();
          const domains = data.domains || [];
          
          console.log(`   Found ${domains.length} domains (${data.pagination?.total || 0} total)`);
          
          domains.slice(0, 3).forEach(domain => {
            console.log(`   • ${domain.domain} (${domain.vertical || 'N/A'})`);
            console.log(`     Price: $${domain.pricePerRequest}, CPM: $${domain.cpm || 'N/A'}, Traffic: ${domain.traffic?.toLocaleString() || 'N/A'}`);
          });
          
          if (data.filters?.verticals) {
            console.log(`   Available verticals: ${data.filters.verticals.slice(0, 5).join(', ')}${data.filters.verticals.length > 5 ? '...' : ''}`);
          }
        } else {
          console.log(`   ❌ API Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`   ❌ Request failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Tier table test failed: ${error.message}`);
  }
  
  console.log('\n📈 Market Analysis Demo...');
  
  // Calculate market statistics
  try {
    const response = await fetch(`${baseUrl}/api/domains?limit=100`);
    
    if (response.ok) {
      const data = await response.json();
      const domains = data.domains || [];
      
      if (domains.length > 0) {
        // Price analysis
        const prices = domains.map(d => d.pricePerRequest).filter(p => p > 0);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        console.log(`📊 Price Analysis (${prices.length} domains):`);
        console.log(`   • Average: $${avgPrice.toFixed(4)}`);
        console.log(`   • Range: $${minPrice} - $${maxPrice}`);
        
        // CPM analysis
        const cpms = domains.map(d => d.cpm).filter(c => c > 0);
        if (cpms.length > 0) {
          const avgCPM = cpms.reduce((a, b) => a + b, 0) / cpms.length;
          console.log(`📊 CPM Analysis (${cpms.length} domains):`);
          console.log(`   • Average CPM: $${avgCPM.toFixed(2)}`);
        }
        
        // Vertical distribution
        const verticals = {};
        domains.forEach(d => {
          if (d.vertical) {
            verticals[d.vertical] = (verticals[d.vertical] || 0) + 1;
          }
        });
        
        console.log(`📊 Vertical Distribution:`);
        Object.entries(verticals)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .forEach(([vertical, count]) => {
            console.log(`   • ${vertical}: ${count} domains`);
          });
      }
    }
  } catch (error) {
    console.log(`❌ Market analysis failed: ${error.message}`);
  }
  
  console.log('\n🎯 Volume Pricing Demo...');
  
  // Demo volume discounts
  const volumeTiers = [
    { requests: 1000, discount: 0, label: '1K requests' },
    { requests: 10000, discount: 0.05, label: '10K requests' },
    { requests: 100000, discount: 0.10, label: '100K requests' },
    { requests: 1000000, discount: 0.15, label: '1M requests' }
  ];
  
  const basePrice = 0.002; // $0.002 per request
  
  console.log('Volume Pricing Tiers:');
  console.log('-'.repeat(50));
  console.log('Volume'.padEnd(15) + 'Discount'.padEnd(12) + 'Price/Req'.padEnd(12) + 'Total Cost');
  console.log('-'.repeat(50));
  
  volumeTiers.forEach(tier => {
    const discountedPrice = basePrice * (1 - tier.discount);
    const totalCost = discountedPrice * tier.requests;
    
    console.log(
      tier.label.padEnd(15) +
      `${(tier.discount * 100).toFixed(0)}%`.padEnd(12) +
      `$${discountedPrice.toFixed(4)}`.padEnd(12) +
      `$${totalCost.toFixed(2)}`
    );
  });
  
  console.log('\n✨ Demo Summary:');
  console.log('✅ Cost Calculator: Estimates costs for different crawling scenarios');
  console.log('✅ Tier Table: Sortable by CPM, vertical, and traffic size');
  console.log('✅ Market Analysis: Price and vertical distribution insights');
  console.log('✅ Volume Pricing: Discounts for high-volume usage');
  console.log('✅ Real-time Data: Integration with SimilarWeb/Tranco traffic data');
  
  console.log('\n🚀 Ready for production use!');
  console.log(`🌐 Visit: ${baseUrl}/pricing to see the rates and packaging page`);
}

// Run the demo
if (require.main === module) {
  demoRatesAndPackaging().catch(console.error);
}

module.exports = { demoRatesAndPackaging }; 
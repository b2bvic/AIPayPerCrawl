#!/usr/bin/env node

// Script to populate test domains in the database with enhanced data for tier table
const testDomains = [
  {
    domain: 'example.com',
    rank: 1000,
    category: 'Technology',
    vertical: 'Technology',
    monthly_visits: 50000000,
    traffic: 50000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.001,
    cpm: 1.0,
    currency: 'USD'
  },
  {
    domain: 'news-site.com',
    rank: 5000,
    category: 'News',
    vertical: 'News',
    monthly_visits: 10000000,
    traffic: 10000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.002,
    cpm: 2.0,
    currency: 'USD'
  },
  {
    domain: 'ecommerce-store.com',
    rank: 10000,
    category: 'E-commerce',
    vertical: 'E-commerce',
    monthly_visits: 5000000,
    traffic: 5000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0015,
    cpm: 1.5,
    currency: 'USD'
  },
  {
    domain: 'tech-blog.com',
    rank: 15000,
    category: 'Technology',
    vertical: 'Technology',
    monthly_visits: 2000000,
    traffic: 2000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0008,
    cpm: 0.8,
    currency: 'USD'
  },
  {
    domain: 'business-news.com',
    rank: 8000,
    category: 'Business',
    vertical: 'Finance',
    monthly_visits: 8000000,
    traffic: 8000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0018,
    cpm: 1.8,
    currency: 'USD'
  },
  {
    domain: 'health-portal.com',
    rank: 12000,
    category: 'Healthcare',
    vertical: 'Healthcare',
    monthly_visits: 3000000,
    traffic: 3000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.003,
    cpm: 3.0,
    currency: 'USD'
  },
  {
    domain: 'education-hub.com',
    rank: 18000,
    category: 'Education',
    vertical: 'Education',
    monthly_visits: 1500000,
    traffic: 1500000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0012,
    cpm: 1.2,
    currency: 'USD'
  },
  {
    domain: 'finance-tracker.com',
    rank: 6000,
    category: 'Finance',
    vertical: 'Finance',
    monthly_visits: 12000000,
    traffic: 12000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0025,
    cpm: 2.5,
    currency: 'USD'
  },
  {
    domain: 'travel-guide.com',
    rank: 20000,
    category: 'Travel',
    vertical: 'Travel',
    monthly_visits: 800000,
    traffic: 800000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0014,
    cpm: 1.4,
    currency: 'USD'
  },
  {
    domain: 'gaming-news.com',
    rank: 25000,
    category: 'Gaming',
    vertical: 'Entertainment',
    monthly_visits: 600000,
    traffic: 600000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0009,
    cpm: 0.9,
    currency: 'USD'
  },
  {
    domain: 'legal-advice.com',
    rank: 30000,
    category: 'Legal',
    vertical: 'Legal',
    monthly_visits: 400000,
    traffic: 400000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.004,
    cpm: 4.0,
    currency: 'USD'
  },
  {
    domain: 'real-estate-pro.com',
    rank: 22000,
    category: 'Real Estate',
    vertical: 'Real Estate',
    monthly_visits: 700000,
    traffic: 700000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0022,
    cpm: 2.2,
    currency: 'USD'
  },
  {
    domain: 'auto-review.com',
    rank: 28000,
    category: 'Automotive',
    vertical: 'Automotive',
    monthly_visits: 500000,
    traffic: 500000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0016,
    cpm: 1.6,
    currency: 'USD'
  },
  {
    domain: 'food-recipes.com',
    rank: 35000,
    category: 'Food',
    vertical: 'Food',
    monthly_visits: 300000,
    traffic: 300000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0011,
    cpm: 1.1,
    currency: 'USD'
  },
  {
    domain: 'fashion-trends.com',
    rank: 40000,
    category: 'Fashion',
    vertical: 'Fashion',
    monthly_visits: 250000,
    traffic: 250000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0013,
    cpm: 1.3,
    currency: 'USD'
  },
  {
    domain: 'sports-central.com',
    rank: 16000,
    category: 'Sports',
    vertical: 'Sports',
    monthly_visits: 1800000,
    traffic: 1800000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0010,
    cpm: 1.0,
    currency: 'USD'
  },
  {
    domain: 'government-portal.gov',
    rank: 2000,
    category: 'Government',
    vertical: 'Government',
    monthly_visits: 20000000,
    traffic: 20000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.005,
    cpm: 5.0,
    currency: 'USD'
  },
  {
    domain: 'startup-blog.com',
    rank: 45000,
    category: 'Technology',
    vertical: 'Technology',
    monthly_visits: 200000,
    traffic: 200000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0007,
    cpm: 0.7,
    currency: 'USD'
  },
  {
    domain: 'crypto-news.com',
    rank: 32000,
    category: 'Finance',
    vertical: 'Finance',
    monthly_visits: 350000,
    traffic: 350000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0030,
    cpm: 3.0,
    currency: 'USD'
  },
  {
    domain: 'medical-journal.com',
    rank: 14000,
    category: 'Healthcare',
    vertical: 'Healthcare',
    monthly_visits: 2500000,
    traffic: 2500000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0035,
    cpm: 3.5,
    currency: 'USD'
  }
];

console.log('🌱 Setting up enhanced test domains for tier table...');
console.log(`📊 Adding ${testDomains.length} domains with traffic and CPM data`);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDomains };
}

// Log sample data for verification
console.log('\n📋 Sample domains:');
testDomains.slice(0, 5).forEach(domain => {
  console.log(`  • ${domain.domain} (${domain.vertical})`);
  console.log(`    Price: $${domain.price_per_request}, CPM: $${domain.cpm}, Traffic: ${domain.traffic.toLocaleString()}`);
});

console.log('\n🎯 Vertical distribution:');
const verticalCounts = {};
testDomains.forEach(domain => {
  verticalCounts[domain.vertical] = (verticalCounts[domain.vertical] || 0) + 1;
});

Object.entries(verticalCounts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([vertical, count]) => {
    console.log(`  • ${vertical}: ${count} domains`);
  });

console.log('\n💰 Price range:');
const prices = testDomains.map(d => d.price_per_request).sort((a, b) => a - b);
console.log(`  • Min: $${prices[0]}`);
console.log(`  • Max: $${prices[prices.length - 1]}`);
console.log(`  • Avg: $${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(4)}`);

console.log('\n📈 CPM range:');
const cpms = testDomains.map(d => d.cpm).sort((a, b) => a - b);
console.log(`  • Min: $${cpms[0]}`);
console.log(`  • Max: $${cpms[cpms.length - 1]}`);
console.log(`  • Avg: $${(cpms.reduce((a, b) => a + b, 0) / cpms.length).toFixed(2)}`);

console.log('\n🚀 Ready to use with tier table and cost calculator!'); 
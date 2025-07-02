#!/usr/bin/env node

// Script to populate test domains in the database
const testDomains = [
  {
    domain: 'example.com',
    rank: 1000,
    category: 'Technology',
    monthly_visits: 50000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.001,
    currency: 'USD'
  },
  {
    domain: 'news-site.com',
    rank: 5000,
    category: 'News',
    monthly_visits: 10000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.002,
    currency: 'USD'
  },
  {
    domain: 'ecommerce-store.com',
    rank: 10000,
    category: 'E-commerce',
    monthly_visits: 5000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0015,
    currency: 'USD'
  },
  {
    domain: 'tech-blog.com',
    rank: 15000,
    category: 'Technology',
    monthly_visits: 2000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0008,
    currency: 'USD'
  },
  {
    domain: 'business-news.com',
    rank: 8000,
    category: 'Business',
    monthly_visits: 8000000,
    pay_per_crawl_enabled: true,
    price_per_request: 0.0018,
    currency: 'USD'
  }
];

console.log('🌱 Setting up test domains...');
console.log('');

// Generate SQL INSERT statements
const insertStatements = testDomains.map(domain => {
  const id = `domain_${Math.random().toString(36).substr(2, 9)}`;
  return `INSERT OR REPLACE INTO domains (
    id, domain, rank, category, monthly_visits, 
    pay_per_crawl_enabled, price_per_request, currency,
    created_at, updated_at
  ) VALUES (
    '${id}',
    '${domain.domain}',
    ${domain.rank},
    '${domain.category}',
    ${domain.monthly_visits},
    ${domain.pay_per_crawl_enabled ? 1 : 0},
    ${domain.price_per_request},
    '${domain.currency}',
    datetime('now'),
    datetime('now')
  );`;
});

const sqlScript = `
-- Test domains for AIPayPerCrawl
${insertStatements.join('\n\n')}

-- Verify the data
SELECT COUNT(*) as total_domains FROM domains WHERE pay_per_crawl_enabled = 1;
SELECT domain, price_per_request, monthly_visits FROM domains WHERE pay_per_crawl_enabled = 1 ORDER BY rank;
`;

console.log('📝 Generated SQL script:');
console.log('');
console.log(sqlScript);
console.log('');

console.log('🚀 To apply this to your database, run:');
console.log('');
console.log('# For local development:');
console.log('npx wrangler d1 execute aipaypercrawl-db --local --command="' + insertStatements.join(' ') + '"');
console.log('');
console.log('# For production:');
console.log('npx wrangler d1 execute aipaypercrawl-db --command="' + insertStatements.join(' ') + '"');
console.log('');

// Also save to file
require('fs').writeFileSync('test-domains.sql', sqlScript);
console.log('💾 SQL script saved to test-domains.sql'); 
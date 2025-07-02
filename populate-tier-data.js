#!/usr/bin/env node

// Script to populate the database with enhanced tier table data
const { testDomains } = require('./setup-test-domains.js');

async function populateDatabase() {
  console.log('🚀 Populating database with tier table data...');
  
  try {
    // Use the domains API to populate data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8787';
    
    for (const domain of testDomains) {
      try {
        console.log(`📝 Adding ${domain.domain}...`);
        
        const response = await fetch(`${baseUrl}/api/domains`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: domain.domain,
            pricePerRequest: domain.price_per_request,
            category: domain.category,
            vertical: domain.vertical,
            traffic: domain.traffic,
            cpm: domain.cpm
          })
        });
        
        if (response.ok) {
          console.log(`✅ ${domain.domain} added successfully`);
        } else {
          const error = await response.text();
          console.log(`❌ Failed to add ${domain.domain}: ${error}`);
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ Error adding ${domain.domain}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Database population complete!');
    console.log(`📊 Added ${testDomains.length} domains with enhanced data`);
    
    // Verify the data
    console.log('\n🔍 Verifying data...');
    const verifyResponse = await fetch(`${baseUrl}/api/domains?limit=5`);
    
    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      console.log(`✅ Found ${data.pagination?.total || 0} total domains`);
      console.log(`📋 Available verticals: ${data.filters?.verticals?.join(', ') || 'none'}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to populate database:', error);
    process.exit(1);
  }
}

// Generate SQL for direct database insertion (alternative method)
function generateSQL() {
  console.log('\n📝 Generating SQL statements...');
  
  const insertStatements = testDomains.map(domain => {
    const id = `domain_${Math.random().toString(36).substr(2, 9)}`;
    return `INSERT OR REPLACE INTO domains (
      id, domain, rank, category, vertical, traffic, cpm,
      pay_per_crawl_enabled, price_per_request, currency,
      is_cloudflare, has_pay_per_crawl, status, claim_status,
      created_at, updated_at
    ) VALUES (
      '${id}',
      '${domain.domain}',
      ${domain.rank},
      '${domain.category}',
      '${domain.vertical}',
      ${domain.traffic},
      ${domain.cpm},
      ${domain.pay_per_crawl_enabled ? 1 : 0},
      ${domain.price_per_request},
      '${domain.currency}',
      1,
      1,
      'active',
      'unclaimed',
      datetime('now'),
      datetime('now')
    );`;
  });
  
  const sqlScript = `
-- Enhanced test domains for AIPayPerCrawl Tier Table
-- Generated on ${new Date().toISOString()}

${insertStatements.join('\n\n')}

-- Verify the data
SELECT COUNT(*) as total_domains FROM domains WHERE pay_per_crawl_enabled = 1;
SELECT vertical, COUNT(*) as count, AVG(cpm) as avg_cpm 
FROM domains 
WHERE pay_per_crawl_enabled = 1 
GROUP BY vertical 
ORDER BY count DESC;

-- Show sample data
SELECT domain, vertical, price_per_request, cpm, traffic 
FROM domains 
WHERE pay_per_crawl_enabled = 1 
ORDER BY cpm DESC 
LIMIT 10;
`;
  
  // Save to file
  require('fs').writeFileSync('tier-table-data.sql', sqlScript);
  console.log('💾 SQL script saved to tier-table-data.sql');
  
  console.log('\n🚀 To apply this to your database, run:');
  console.log('');
  console.log('# For local development:');
  console.log('npx wrangler d1 execute aipaypercrawl-db --local --file=tier-table-data.sql');
  console.log('');
  console.log('# For production:');
  console.log('npx wrangler d1 execute aipaypercrawl-db --file=tier-table-data.sql');
  
  return sqlScript;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--sql-only')) {
    generateSQL();
  } else {
    populateDatabase().catch(console.error);
  }
}

module.exports = { populateDatabase, generateSQL }; 
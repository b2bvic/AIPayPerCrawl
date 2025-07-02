-- Enhanced test domains for AIPayPerCrawl Tier Table
-- Generated with correct schema mapping

INSERT OR REPLACE INTO domains (
  id, domain, rank, category, vertical, traffic, cpm,
  pay_per_crawl_enabled, price_per_request, currency,
  is_cloudflare, has_pay_per_crawl, status, claim_status,
  created_at, updated_at
) VALUES 
('domain_example1', 'example.com', 1000, 'Technology', 'Technology', 50000000, 1.0, 1, 0.001, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_news1', 'news-site.com', 5000, 'News', 'News', 10000000, 2.0, 1, 0.002, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_ecom1', 'ecommerce-store.com', 10000, 'E-commerce', 'E-commerce', 5000000, 1.5, 1, 0.0015, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_tech1', 'tech-blog.com', 15000, 'Technology', 'Technology', 2000000, 0.8, 1, 0.0008, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_biz1', 'business-news.com', 8000, 'Business', 'Finance', 8000000, 1.8, 1, 0.0018, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_health1', 'health-portal.com', 12000, 'Healthcare', 'Healthcare', 3000000, 3.0, 1, 0.003, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_edu1', 'education-hub.com', 18000, 'Education', 'Education', 1500000, 1.2, 1, 0.0012, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_fin1', 'finance-tracker.com', 6000, 'Finance', 'Finance', 12000000, 2.5, 1, 0.0025, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_travel1', 'travel-guide.com', 20000, 'Travel', 'Travel', 800000, 1.4, 1, 0.0014, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_game1', 'gaming-news.com', 25000, 'Gaming', 'Entertainment', 600000, 0.9, 1, 0.0009, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_legal1', 'legal-advice.com', 30000, 'Legal', 'Legal', 400000, 4.0, 1, 0.004, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_real1', 'real-estate-pro.com', 22000, 'Real Estate', 'Real Estate', 700000, 2.2, 1, 0.0022, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_auto1', 'auto-review.com', 28000, 'Automotive', 'Automotive', 500000, 1.6, 1, 0.0016, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_food1', 'food-recipes.com', 35000, 'Food', 'Food', 300000, 1.1, 1, 0.0011, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_fashion1', 'fashion-trends.com', 40000, 'Fashion', 'Fashion', 250000, 1.3, 1, 0.0013, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_sports1', 'sports-central.com', 16000, 'Sports', 'Sports', 1800000, 1.0, 1, 0.0010, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_gov1', 'government-portal.gov', 2000, 'Government', 'Government', 20000000, 5.0, 1, 0.005, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_startup1', 'startup-blog.com', 45000, 'Technology', 'Technology', 200000, 0.7, 1, 0.0007, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_crypto1', 'crypto-news.com', 32000, 'Finance', 'Finance', 350000, 3.0, 1, 0.0030, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now')),
('domain_medical1', 'medical-journal.com', 14000, 'Healthcare', 'Healthcare', 2500000, 3.5, 1, 0.0035, 'USD', 1, 1, 'active', 'unclaimed', datetime('now'), datetime('now'));

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
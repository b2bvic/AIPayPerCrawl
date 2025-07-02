
-- Test domains for AIPayPerCrawl
INSERT OR REPLACE INTO domains (
    id, domain, rank, category, monthly_visits, 
    pay_per_crawl_enabled, price_per_request, currency,
    created_at, updated_at
  ) VALUES (
    'domain_x3wyeapj4',
    'example.com',
    1000,
    'Technology',
    50000000,
    1,
    0.001,
    'USD',
    datetime('now'),
    datetime('now')
  );

INSERT OR REPLACE INTO domains (
    id, domain, rank, category, monthly_visits, 
    pay_per_crawl_enabled, price_per_request, currency,
    created_at, updated_at
  ) VALUES (
    'domain_tvmcrsznd',
    'news-site.com',
    5000,
    'News',
    10000000,
    1,
    0.002,
    'USD',
    datetime('now'),
    datetime('now')
  );

INSERT OR REPLACE INTO domains (
    id, domain, rank, category, monthly_visits, 
    pay_per_crawl_enabled, price_per_request, currency,
    created_at, updated_at
  ) VALUES (
    'domain_86vznfvyt',
    'ecommerce-store.com',
    10000,
    'E-commerce',
    5000000,
    1,
    0.0015,
    'USD',
    datetime('now'),
    datetime('now')
  );

INSERT OR REPLACE INTO domains (
    id, domain, rank, category, monthly_visits, 
    pay_per_crawl_enabled, price_per_request, currency,
    created_at, updated_at
  ) VALUES (
    'domain_7d0yyub3p',
    'tech-blog.com',
    15000,
    'Technology',
    2000000,
    1,
    0.0008,
    'USD',
    datetime('now'),
    datetime('now')
  );

INSERT OR REPLACE INTO domains (
    id, domain, rank, category, monthly_visits, 
    pay_per_crawl_enabled, price_per_request, currency,
    created_at, updated_at
  ) VALUES (
    'domain_un51nqxot',
    'business-news.com',
    8000,
    'Business',
    8000000,
    1,
    0.0018,
    'USD',
    datetime('now'),
    datetime('now')
  );

-- Verify the data
SELECT COUNT(*) as total_domains FROM domains WHERE pay_per_crawl_enabled = 1;
SELECT domain, price_per_request, monthly_visits FROM domains WHERE pay_per_crawl_enabled = 1 ORDER BY rank;

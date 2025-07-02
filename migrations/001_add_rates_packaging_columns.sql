-- Migration to add rates and packaging columns to domains table
-- Run this before inserting tier table data

-- Add vertical column for industry categorization
ALTER TABLE domains ADD COLUMN vertical TEXT DEFAULT 'Technology';

-- Add traffic column for monthly visits data
ALTER TABLE domains ADD COLUMN traffic INTEGER DEFAULT 0;

-- Add CPM column for cost per mille pricing
ALTER TABLE domains ADD COLUMN cpm REAL DEFAULT 1.0;

-- Add Cloudflare flag
ALTER TABLE domains ADD COLUMN is_cloudflare BOOLEAN DEFAULT false;

-- Add pay per crawl availability flag
ALTER TABLE domains ADD COLUMN has_pay_per_crawl BOOLEAN DEFAULT false;

-- Add status column for domain status
ALTER TABLE domains ADD COLUMN status TEXT DEFAULT 'active';

-- Update existing domains to have default values
UPDATE domains SET 
  vertical = 'Technology',
  traffic = COALESCE(monthly_visits, 0),
  cpm = 1.0,
  is_cloudflare = false,
  has_pay_per_crawl = pay_per_crawl_enabled,
  status = 'active'
WHERE vertical IS NULL; 
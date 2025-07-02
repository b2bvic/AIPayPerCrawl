-- Migration to add missing columns to domains table
-- Only add columns that don't exist yet

-- Add Cloudflare flag
ALTER TABLE domains ADD COLUMN is_cloudflare BOOLEAN DEFAULT false;

-- Add pay per crawl availability flag  
ALTER TABLE domains ADD COLUMN has_pay_per_crawl BOOLEAN DEFAULT false;

-- Add status column for domain status
ALTER TABLE domains ADD COLUMN status TEXT DEFAULT 'active';

-- Update existing domains to have default values
UPDATE domains SET 
  is_cloudflare = false,
  has_pay_per_crawl = pay_per_crawl_enabled,
  status = 'active'
WHERE is_cloudflare IS NULL; 
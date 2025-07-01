-- Cloudflare D1 Database Schema for AIPayPerCrawl

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain TEXT NOT NULL UNIQUE,
  rank INTEGER,
  tranco_rank INTEGER,
  alexa_rank INTEGER,
  category TEXT,
  monthly_visits INTEGER,
  pay_per_crawl_enabled BOOLEAN DEFAULT false,
  price_per_request REAL DEFAULT 0.001,
  currency TEXT DEFAULT 'USD',
  owner_id TEXT,
  claim_status TEXT DEFAULT 'unclaimed', -- unclaimed, claimed, verified
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Publishers/Users table
CREATE TABLE IF NOT EXISTS publishers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  stripe_account_id TEXT,
  total_revenue REAL DEFAULT 0,
  total_requests INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crawl Requests table
CREATE TABLE IF NOT EXISTS crawl_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain_id TEXT NOT NULL,
  url TEXT NOT NULL,
  requester_id TEXT,
  price REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  quote_id TEXT NOT NULL UNIQUE,
  total_cost REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  items TEXT NOT NULL, -- JSON array
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_domains_rank ON domains(rank);
CREATE INDEX idx_domains_owner ON domains(owner_id);
CREATE INDEX idx_domains_status ON domains(claim_status);
CREATE INDEX idx_requests_domain ON crawl_requests(domain_id);
CREATE INDEX idx_requests_created ON crawl_requests(created_at);
CREATE INDEX idx_quotes_quote_id ON quotes(quote_id); 
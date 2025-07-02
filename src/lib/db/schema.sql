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

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES publishers(id)
);

-- Crawl Requests table
CREATE TABLE IF NOT EXISTS crawl_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  quote_id TEXT NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed, expired
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, expired
  total_cost REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP,
  error_message TEXT,
  results TEXT, -- JSON array of crawl results
  FOREIGN KEY (quote_id) REFERENCES quotes(quote_id)
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

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  event_type TEXT NOT NULL,
  domain_id TEXT,
  publisher_id TEXT,
  request_id TEXT,
  metadata TEXT, -- JSON data
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES domains(id),
  FOREIGN KEY (publisher_id) REFERENCES publishers(id),
  FOREIGN KEY (request_id) REFERENCES crawl_requests(id)
);

-- Domain Claims table for TXT verification workflow
CREATE TABLE IF NOT EXISTS domain_claims (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  organization TEXT,
  reason TEXT,
  requested_price REAL DEFAULT 0.01,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, txt_verification, verified, approved, rejected
  txt_challenge TEXT NOT NULL,
  txt_record_name TEXT NOT NULL,
  txt_record_value TEXT NOT NULL,
  challenge_expires_at TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  verified_at TEXT,
  approved_at TEXT,
  rejected_at TEXT,
  rejection_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_domains_rank ON domains(rank);
CREATE INDEX IF NOT EXISTS idx_domains_owner ON domains(owner_id);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(claim_status);
CREATE INDEX IF NOT EXISTS idx_requests_quote ON crawl_requests(quote_id);
CREATE INDEX IF NOT EXISTS idx_requests_created ON crawl_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_id ON quotes(quote_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);

-- Indexes for domain claims
CREATE INDEX IF NOT EXISTS idx_domain_claims_domain ON domain_claims(domain);
CREATE INDEX IF NOT EXISTS idx_domain_claims_status ON domain_claims(status);
CREATE INDEX IF NOT EXISTS idx_domain_claims_email ON domain_claims(email);
CREATE INDEX IF NOT EXISTS idx_domain_claims_submitted ON domain_claims(submitted_at); 
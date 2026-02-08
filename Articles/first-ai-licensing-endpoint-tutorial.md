---
title:: Building Your First AI Licensing Endpoint in 30 Minutes
description:: Step-by-step tutorial to implement HTTP 402 payment-required responses for AI crawlers. From basic nginx config to production-ready metering.
focus_keyword:: ai licensing endpoint
category:: ai-monetization
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Building Your First AI Licensing Endpoint in 30 Minutes

Blocking AI crawlers via `robots.txt` establishes that your content isn't free. But it doesn't generate revenue. To monetize access, you need an **AI licensing endpoint**—infrastructure that detects crawler requests, validates credentials, meters usage, and returns **HTTP 402 (Payment Required)** when licensing terms aren't met.

This tutorial walks through implementing a production-ready licensing endpoint from scratch. We'll use **nginx** (the most common web server), but the principles apply to **Apache**, **Cloudflare Workers**, or **AWS Lambda@Edge**.

By the end, you'll have a system that:
- Detects AI crawler requests
- Validates API keys or returns 402
- Meters usage per client
- Logs all access for billing

Time required: 30 minutes. Prerequisites: root access to your web server, basic command-line familiarity.

## The Architecture Overview

An AI licensing endpoint sits between the internet and your content. It intercepts every request, inspects the user agent and headers, and decides whether to serve content or demand payment.

**Flow:**
1. AI crawler requests `yoursite.com/article.html`
2. nginx intercepts request before reaching your application
3. Middleware checks for valid API key in `Authorization` header
4. If key is valid and quota remains, serve content
5. If key is invalid or quota depleted, return 402 with licensing endpoint URL
6. Log all requests for billing

**Why this works:** AI crawlers are programmatic. They can handle 402 responses, programmatically fetch credentials, and retry. Human users never see this flow—they access your site normally.

## Step 1: Install nginx (If You Don't Have It)

Most servers run Apache or nginx. We'll use nginx for its simplicity and performance.

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### CentOS/RHEL
```bash
sudo yum install epel-release
sudo yum install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Verify it's running:
```bash
curl http://localhost
```

You should see the nginx welcome page.

## Step 2: Create the Licensing Middleware

We'll use **Lua** (embedded in nginx via **lua-nginx-module**) for request processing. This avoids external dependencies and keeps everything fast.

Install OpenResty (nginx + Lua):
```bash
wget https://openresty.org/package/ubuntu/openresty.gpg.key
sudo apt-key add openresty.gpg.key
sudo add-apt-repository "deb http://openresty.org/package/ubuntu $(lsb_release -sc) main"
sudo apt update
sudo apt install openresty
```

Now we have nginx with Lua support.

## Step 3: Detect AI Crawlers

Create `/etc/nginx/ai-licensing.lua`:

```lua
-- AI Licensing Middleware

local user_agent = ngx.var.http_user_agent or ""

-- List of AI crawlers to meter
local ai_crawlers = {
    "GPTBot",
    "Google-Extended",
    "Claude-Web",
    "CCBot",
    "anthropic-ai",
    "cohere-ai"
}

-- Check if request is from AI crawler
local function is_ai_crawler()
    for _, crawler in ipairs(ai_crawlers) do
        if string.find(user_agent, crawler, 1, true) then
            return true
        end
    end
    return false
end

-- Main logic
if is_ai_crawler() then
    -- Continue to API key validation (next step)
    ngx.log(ngx.INFO, "AI crawler detected: " .. user_agent)
else
    -- Not an AI crawler, serve content normally
    return
end
```

This detects AI crawlers by user agent. Next, we add API key validation.

## Step 4: Validate API Keys

Extend `/etc/nginx/ai-licensing.lua`:

```lua
-- API Key Validation

local auth_header = ngx.var.http_authorization or ""
local api_key = string.match(auth_header, "Bearer%s+(.+)")

-- Check if API key is valid
local function validate_api_key(key)
    -- In production, query Redis or database
    -- For this tutorial, we'll use a simple file-based lookup

    local valid_keys = {
        ["test-key-123"] = { quota = 1000, used = 0 },
        ["openai-key-456"] = { quota = 10000, used = 500 }
    }

    return valid_keys[key]
end

if not api_key then
    -- No API key provided
    ngx.status = ngx.HTTP_PAYMENT_REQUIRED
    ngx.header["Content-Type"] = "application/json"
    ngx.header["WWW-Authenticate"] = 'Bearer realm="AI Content Licensing"'
    ngx.say('{"error": "API key required", "licensing_url": "https://yoursite.com/api-licensing"}')
    return ngx.exit(ngx.HTTP_PAYMENT_REQUIRED)
end

local key_data = validate_api_key(api_key)

if not key_data then
    -- Invalid API key
    ngx.status = ngx.HTTP_FORBIDDEN
    ngx.header["Content-Type"] = "application/json"
    ngx.say('{"error": "Invalid API key"}')
    return ngx.exit(ngx.HTTP_FORBIDDEN)
end

-- Check quota
if key_data.used >= key_data.quota then
    -- Quota exceeded
    ngx.status = ngx.HTTP_PAYMENT_REQUIRED
    ngx.header["Content-Type"] = "application/json"
    ngx.say('{"error": "Quota exceeded", "used": ' .. key_data.used .. ', "quota": ' .. key_data.quota .. '}')
    return ngx.exit(ngx.HTTP_PAYMENT_REQUIRED)
end

-- Valid key with remaining quota, allow access
ngx.log(ngx.INFO, "Valid API key, serving content")
```

This validates API keys and checks quotas. In production, replace the hardcoded `valid_keys` table with **Redis** or database lookups.

## Step 5: Meter Usage

Add usage tracking to `/etc/nginx/ai-licensing.lua`:

```lua
-- Usage Metering

local function increment_usage(key)
    -- In production, increment Redis counter
    -- For tutorial, we'll just log

    ngx.log(ngx.INFO, "Incrementing usage for key: " .. key)

    -- Pseudocode for Redis:
    -- local redis = require "resty.redis"
    -- local red = redis:new()
    -- red:connect("127.0.0.1", 6379)
    -- red:incr("usage:" .. key)
end

-- After validating key and quota, increment usage
increment_usage(api_key)

-- Continue serving content
```

This logs usage. In production, use **Redis** to track real-time usage:

```lua
local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000) -- 1 second

local ok, err = red:connect("127.0.0.1", 6379)
if not ok then
    ngx.log(ngx.ERR, "Failed to connect to Redis: ", err)
    return
end

local count, err = red:incr("usage:" .. api_key)
if not count then
    ngx.log(ngx.ERR, "Failed to increment usage: ", err)
end

-- Check if over quota
local quota = 1000 -- Fetch from Redis or config
if count > quota then
    ngx.status = ngx.HTTP_PAYMENT_REQUIRED
    ngx.say('{"error": "Quota exceeded"}')
    return ngx.exit(ngx.HTTP_PAYMENT_REQUIRED)
end
```

## Step 6: Configure nginx to Use the Middleware

Edit `/etc/nginx/nginx.conf`:

```nginx
http {
    # Load Lua module
    lua_package_path "/etc/nginx/?.lua;;";

    # Shared dict for caching API key validations
    lua_shared_dict api_keys 10m;

    server {
        listen 80;
        server_name yoursite.com;

        # Apply licensing middleware to all requests
        location / {
            access_by_lua_file /etc/nginx/ai-licensing.lua;

            # If middleware allows, serve content
            root /var/www/html;
            index index.html;
        }

        # Exclude admin paths from licensing
        location /wp-admin/ {
            # No middleware, serve normally
            root /var/www/html;
        }
    }
}
```

Reload nginx:
```bash
sudo nginx -t  # Test config
sudo systemctl reload nginx
```

## Step 7: Test the Endpoint

Test with **curl**:

### Test 1: AI Crawler Without API Key
```bash
curl -A "GPTBot/1.0" http://yoursite.com/article.html
```

**Expected response:**
```json
{
  "error": "API key required",
  "licensing_url": "https://yoursite.com/api-licensing"
}
```

**Status code:** 402 Payment Required

### Test 2: AI Crawler With Valid API Key
```bash
curl -A "GPTBot/1.0" -H "Authorization: Bearer test-key-123" http://yoursite.com/article.html
```

**Expected response:** The actual article content

**Status code:** 200 OK

### Test 3: Non-AI User Agent
```bash
curl -A "Mozilla/5.0 (Chrome)" http://yoursite.com/article.html
```

**Expected response:** The actual article content (no licensing check)

**Status code:** 200 OK

## Step 8: Set Up Redis for Production

The tutorial uses hardcoded keys. Production needs **Redis** for real-time usage tracking.

Install Redis:
```bash
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis
```

Install Lua Redis module:
```bash
sudo apt install lua-resty-redis
```

Update the Lua script to use Redis (see Step 5 for code).

## Step 9: Create a Licensing Page

AI companies need a way to purchase API keys. Create `/var/www/html/api-licensing/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>AI Content Licensing</title>
</head>
<body>
    <h1>API Access for AI Training</h1>
    <p>To access our content for AI training, please license via API key.</p>

    <h2>Pricing</h2>
    <ul>
        <li>Basic: $500/month - 100K pages</li>
        <li>Pro: $2,000/month - 500K pages</li>
        <li>Enterprise: Custom pricing</li>
    </ul>

    <h2>How to License</h2>
    <ol>
        <li>Contact licensing@yoursite.com</li>
        <li>We'll provide an API key</li>
        <li>Include key in Authorization header: <code>Bearer YOUR_KEY</code></li>
        <li>Monitor usage via dashboard (link provided after purchase)</li>
    </ol>

    <h2>Technical Documentation</h2>
    <p>Include the API key in every request:</p>
    <code>
    curl -H "Authorization: Bearer YOUR_KEY" https://yoursite.com/content.html
    </code>

    <p>When quota is exceeded, you'll receive HTTP 402 with renewal instructions.</p>
</body>
</html>
```

AI companies encountering 402 responses will follow the `licensing_url` and see this page.

## Step 10: Add Logging for Billing

Track all licensed accesses for billing reports. Add to the Lua script:

```lua
-- Logging for Billing

local function log_access(key, url, user_agent)
    local log_file = io.open("/var/log/nginx/ai-licensing.log", "a")
    local timestamp = os.date("%Y-%m-%d %H:%M:%S")
    local log_entry = string.format("%s | %s | %s | %s\n", timestamp, key, url, user_agent)
    log_file:write(log_entry)
    log_file:close()
end

-- After validating and allowing access
log_access(api_key, ngx.var.request_uri, user_agent)
```

This creates a log file:
```
2026-02-08 10:15:32 | test-key-123 | /article1.html | GPTBot/1.0
2026-02-08 10:15:45 | test-key-123 | /article2.html | GPTBot/1.0
2026-02-08 10:16:02 | openai-key-456 | /archive/2025/post.html | GPTBot/1.0
```

Process this log monthly for billing:
```bash
# Count requests per API key
awk '{print $3}' /var/log/nginx/ai-licensing.log | sort | uniq -c
```

Output:
```
  245 test-key-123
  1523 openai-key-456
```

Bill accordingly: `245 × $0.01 = $2.45` for test-key-123.

## Production Enhancements

The tutorial implementation works but needs hardening for production.

### Enhancement 1: Rate Limiting Per Key

Prevent abuse by limiting requests per second per API key:

```lua
local limit_req = require "resty.limit.req"
local lim, err = limit_req.new("api_keys", 10, 5)  -- 10 req/sec, burst 5

if not lim then
    ngx.log(ngx.ERR, "Failed to instantiate rate limiter: ", err)
    return ngx.exit(500)
end

local key = "rate_limit:" .. api_key
local delay, err = lim:incoming(key, true)

if not delay then
    if err == "rejected" then
        ngx.status = ngx.HTTP_TOO_MANY_REQUESTS
        ngx.say('{"error": "Rate limit exceeded"}')
        return ngx.exit(ngx.HTTP_TOO_MANY_REQUESTS)
    end
end
```

This limits each API key to 10 requests/second.

### Enhancement 2: API Key Rotation

Allow customers to rotate keys for security:

```lua
local function rotate_key(old_key, new_key)
    local redis = require "resty.redis"
    local red = redis:new()
    red:connect("127.0.0.1", 6379)

    -- Copy quota and usage to new key
    local usage = red:get("usage:" .. old_key)
    local quota = red:get("quota:" .. old_key)

    red:set("usage:" .. new_key, usage)
    red:set("quota:" .. new_key, quota)

    -- Delete old key
    red:del("usage:" .. old_key)
    red:del("quota:" .. old_key)
end
```

### Enhancement 3: Webhook Notifications

Alert AI companies when they approach quota limits:

```lua
local function check_quota_threshold(key, used, quota)
    local percentage = (used / quota) * 100

    if percentage >= 80 and not_already_notified(key) then
        -- Send webhook
        local http = require "resty.http"
        local httpc = http.new()

        local res, err = httpc:request_uri("https://ai-company.com/webhook", {
            method = "POST",
            body = '{"api_key": "' .. key .. '", "usage_percent": ' .. percentage .. '}',
            headers = { ["Content-Type"] = "application/json" }
        })

        mark_as_notified(key)
    end
end
```

### Enhancement 4: Dashboard for Customers

Build a simple usage dashboard customers can access:

```html
<!-- /var/www/html/dashboard.html -->
<script>
async function fetchUsage() {
    const apiKey = document.getElementById('api-key').value;
    const response = await fetch(`/api/usage?key=${apiKey}`);
    const data = await response.json();
    document.getElementById('usage').innerText = `${data.used} / ${data.quota} pages`;
}
</script>

<input id="api-key" type="text" placeholder="Enter API Key">
<button onclick="fetchUsage()">Check Usage</button>
<div id="usage"></div>
```

Backend endpoint in nginx:
```lua
-- /api/usage endpoint
location /api/usage {
    content_by_lua_block {
        local args = ngx.req.get_uri_args()
        local key = args.key

        local redis = require "resty.redis"
        local red = redis:new()
        red:connect("127.0.0.1", 6379)

        local used = red:get("usage:" .. key) or 0
        local quota = red:get("quota:" .. key) or 0

        ngx.say('{"used": ' .. used .. ', "quota": ' .. quota .. '}')
    }
}
```

## Alternative: Cloudflare Workers Implementation

If you use **Cloudflare**, you can implement this as a **Worker** instead of nginx:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || ''

  // Check if AI crawler
  const aiCrawlers = ['GPTBot', 'Google-Extended', 'Claude-Web', 'CCBot']
  const isAICrawler = aiCrawlers.some(bot => userAgent.includes(bot))

  if (!isAICrawler) {
    // Not an AI crawler, fetch content normally
    return fetch(request)
  }

  // Check for API key
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'API key required',
      licensing_url: 'https://yoursite.com/api-licensing'
    }), {
      status: 402,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Validate API key (query KV store)
  const keyData = await KEYS.get(apiKey, { type: 'json' })

  if (!keyData || keyData.used >= keyData.quota) {
    return new Response(JSON.stringify({
      error: 'Invalid or exceeded quota'
    }), {
      status: 402,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Increment usage
  keyData.used += 1
  await KEYS.put(apiKey, JSON.stringify(keyData))

  // Fetch and return content
  return fetch(request)
}
```

Deploy via Cloudflare dashboard. This runs at the edge, reducing latency.

## FAQ

**How much does this infrastructure cost?**

Minimal. nginx + Redis on a $5/month VPS (DigitalOcean, Linode) handles 10M requests/month easily. Cloudflare Workers are free up to 100K requests/day.

**Can AI companies bypass this by spoofing user agents?**

Yes, if they hide as regular users. Add behavioral detection (rate patterns, sequential access) to catch spoofers. See the Fail2Ban article for implementation.

**What if an AI company refuses to pay?**

Block them via firewall at IP level. Most AI companies crawl from identifiable IP ranges (OpenAI, Google, Anthropic publish theirs). If they use proxies, they're clearly acting in bad faith—document and pursue legal action.

**How do I handle free trials?**

Issue temporary API keys with 7-day expiration and lower quotas (e.g., 1000 pages). After trial, customers must purchase full licenses. Implement this via Redis TTL:

```lua
red:setex("usage:" .. trial_key, 604800, 0)  -- Expires in 7 days
```

**Should I charge per page or per token?**

Per page is simpler for customers to understand. Per token is more precise (reflects actual data transferred). Start with per-page, offer per-token pricing for enterprise customers who want granular billing.

**How often should quotas reset?**

Monthly is standard (aligns with billing cycles). Implement via Redis expiration or monthly cron job that resets usage counters:

```bash
# Reset all usage counters first day of month
0 0 1 * * redis-cli KEYS "usage:*" | xargs redis-cli DEL
```

**Can I offer unlimited licenses?**

Yes, for enterprise customers. Set quota to a very high number (e.g., 1 billion pages) or skip quota check entirely for specific keys. Flag these keys as "unlimited" in your database.
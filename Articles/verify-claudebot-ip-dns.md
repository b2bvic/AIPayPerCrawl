---
title:: Verify ClaudeBot IP and DNS: Authenticate Anthropic AI Crawler Identity
description:: Technical guide to verifying ClaudeBot crawler authenticity through IP validation, DNS lookup, and preventing User-Agent spoofing attacks.
focus_keyword:: verify claudebot ip dns
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Verify ClaudeBot IP and DNS: Authenticate Anthropic AI Crawler Identity

Publishers implementing selective **AI crawler** policies must verify that requests claiming to be legitimate crawlers actually originate from declared organizations rather than malicious actors spoofing User-Agent strings. **ClaudeBot**, Anthropic's web crawler for training data collection, can be impersonated by anyone setting `User-Agent: ClaudeBot` in HTTP requests—making IP and DNS verification essential for distinguishing authentic Anthropic infrastructure from spoofed attempts to bypass crawler restrictions.

**DNS verification** provides the most reliable authentication method for web crawlers. By performing reverse DNS lookups on request source IPs and validating that resulting hostnames match expected patterns (`*.anthropic.com`), then performing forward DNS resolution confirming hostnames resolve back to original IPs, publishers establish bidirectional verification that's cryptographically impractical to forge without compromising Anthropic's DNS infrastructure.

This verification matters because publishers often implement differentiated policies: allowing verified search crawlers for SEO while blocking AI training crawlers, or permitting licensed AI partners while blocking unauthorized training. Without verification, malicious scrapers easily claim to be Googlebot or ClaudeBot, evading restrictions designed to protect content. Robust authentication ensures technical controls function as intended rather than being trivially circumvented.

## ClaudeBot Identification Basics

Before verifying authenticity, publishers must identify ClaudeBot among thousands of daily crawler requests through User-Agent inspection and behavioral patterns.

**User-Agent strings** for ClaudeBot follow the pattern:

```
Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +https://www.anthropic.com)
```

Key characteristics include:

- **"ClaudeBot"** identifier in the string
- **Version number** (1.0, though this may increment over time)
- **Information URL** pointing to Anthropic's documentation
- **Mozilla compatibility** declaration for web compatibility

Simple detection through string matching:

```python
def is_claudebot(user_agent: str) -> bool:
    return 'claudebot' in user_agent.lower()
```

However, this trivial check accepts any request claiming to be ClaudeBot, including spoofed attempts. Verification requires additional steps.

**Request patterns** provide behavioral signals. Legitimate ClaudeBot typically exhibits:

- **Consistent User-Agent**: Doesn't randomly vary across requests
- **Respect for robots.txt**: Honors disallow directives (when compliant)
- **Reasonable rate limiting**: Doesn't overwhelm servers with excessive requests
- **Standard HTTP compliance**: Follows redirects, respects cache headers

Deviation from these patterns suggests problematic crawlers regardless of claimed identity.

**Public documentation** from Anthropic describes ClaudeBot's purpose and behavior. As of early 2026, Anthropic provides:

- IP ranges for ClaudeBot infrastructure
- robots.txt opt-out instructions
- Contact information for crawler issues
- Policy statements about data collection

Publishers should monitor Anthropic's public documentation for updates to verification methods as infrastructure evolves.

## DNS Verification Process

The gold standard for crawler authentication uses DNS bidirectional verification preventing IP spoofing and User-Agent forgery simultaneously.

**Reverse DNS lookup** (rDNS) maps IP addresses to hostnames. When receiving a request claiming to be ClaudeBot:

1. Extract the source IP address from the request
2. Perform reverse DNS query (PTR record lookup) on the IP
3. Obtain hostname (should be `*.anthropic.com` for legitimate ClaudeBot)
4. Verify hostname matches expected pattern

Python implementation:

```python
import socket

def reverse_dns_lookup(ip: str) -> str:
    try:
        hostname = socket.gethostbyaddr(ip)[0]
        return hostname
    except socket.herror:
        return None
```

Example result for legitimate ClaudeBot: `crawler-123.anthropic.com`

**Forward DNS verification** confirms the hostname resolves back to the original IP:

```python
def forward_dns_lookup(hostname: str) -> list:
    try:
        return socket.gethostbyname_ex(hostname)[2]
    except socket.gaierror:
        return []
```

**Bidirectional verification** combines both lookups:

```python
def verify_claudebot(ip: str, user_agent: str) -> bool:
    # First check User-Agent claims to be ClaudeBot
    if 'claudebot' not in user_agent.lower():
        return False

    # Reverse DNS: IP -> hostname
    hostname = reverse_dns_lookup(ip)
    if not hostname:
        return False

    # Verify hostname matches Anthropic pattern
    if not hostname.endswith('.anthropic.com'):
        return False

    # Forward DNS: hostname -> IPs
    resolved_ips = forward_dns_lookup(hostname)
    if not resolved_ips:
        return False

    # Confirm original IP is in resolved IPs
    return ip in resolved_ips
```

This process is cryptographically secure because attackers can't forge DNS records for domains they don't control. Even if they spoof source IPs (difficult with TCP), reverse DNS lookups would reveal actual domain ownership.

**Caching verification results** improves performance:

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def cached_verify_claudebot(ip: str) -> tuple:
    result = verify_claudebot_internal(ip)
    timestamp = time.time()
    return (result, timestamp)

def verify_with_cache(ip: str, user_agent: str) -> bool:
    if 'claudebot' not in user_agent.lower():
        return False

    result, timestamp = cached_verify_claudebot(ip)

    # Cache valid for 24 hours
    if time.time() - timestamp > 86400:
        cached_verify_claudebot.cache_clear()
        result, _ = cached_verify_claudebot(ip)

    return result
```

Caching avoids repeated DNS lookups for frequently-accessing IPs, reducing latency and DNS query costs.

## IP Range Validation

Anthropic publishes ClaudeBot IP ranges enabling direct IP-based verification without DNS lookups. This method is faster but requires maintaining updated range lists.

**Published IP ranges** (example—check Anthropic documentation for current values):

```
3.144.0.0/16
54.176.0.0/14
18.144.0.0/14
```

**CIDR range checking** validates whether request IPs fall within published ranges:

```python
import ipaddress

CLAUDEBOT_RANGES = [
    ipaddress.ip_network('3.144.0.0/16'),
    ipaddress.ip_network('54.176.0.0/14'),
    ipaddress.ip_network('18.144.0.0/14'),
]

def is_ip_in_claudebot_ranges(ip_str: str) -> bool:
    try:
        ip = ipaddress.ip_address(ip_str)
        return any(ip in network for network in CLAUDEBOT_RANGES)
    except ValueError:
        return False
```

**Automatic range updates** fetch current ranges from Anthropic:

```python
import requests
import json

def fetch_claudebot_ranges() -> list:
    """Fetch current IP ranges from Anthropic (hypothetical endpoint)"""
    try:
        response = requests.get('https://www.anthropic.com/claudebot-ranges.json', timeout=10)
        data = response.json()
        return [ipaddress.ip_network(cidr) for cidr in data['ranges']]
    except Exception as e:
        # Fall back to cached/default ranges
        return CLAUDEBOT_RANGES

# Refresh daily
RANGE_CACHE_DURATION = 86400
last_update = 0
current_ranges = CLAUDEBOT_RANGES

def get_current_ranges():
    global last_update, current_ranges
    if time.time() - last_update > RANGE_CACHE_DURATION:
        current_ranges = fetch_claudebot_ranges()
        last_update = time.time()
    return current_ranges
```

**Combining DNS and IP verification** provides defense-in-depth:

```python
def verify_claudebot_comprehensive(ip: str, user_agent: str) -> bool:
    if 'claudebot' not in user_agent.lower():
        return False

    # Try IP range check first (faster)
    if is_ip_in_claudebot_ranges(ip):
        return True

    # Fall back to DNS verification
    return verify_claudebot_dns(ip)
```

This approach uses fast IP checking when possible, falling back to DNS for IPs outside known ranges (accounting for infrastructure changes).

## Implementation in Web Servers

Integrating ClaudeBot verification into server configurations enables automatic policy enforcement without application-level changes.

**Nginx configuration** using Lua module:

```nginx
http {
    # Load Lua module
    lua_package_path "/etc/nginx/lua/?.lua;;";

    # Define verification function
    init_by_lua_block {
        claudebot_verifier = require "claudebot_verifier"
    }

    server {
        location / {
            access_by_lua_block {
                local user_agent = ngx.var.http_user_agent or ""

                if string.match(user_agent:lower(), "claudebot") then
                    local remote_ip = ngx.var.remote_addr
                    local verified = claudebot_verifier.verify(remote_ip)

                    if not verified then
                        ngx.status = 403
                        ngx.say("ClaudeBot verification failed")
                        return ngx.exit(403)
                    end
                end
            }

            # Serve content if verification passed
            try_files $uri $uri/ =404;
        }
    }
}
```

Create `/etc/nginx/lua/claudebot_verifier.lua`:

```lua
local _M = {}

local function verify_dns(ip)
    -- Call external verification service or implement in Lua
    local handle = io.popen("python3 /usr/local/bin/verify_claudebot.py " .. ip)
    local result = handle:read("*a")
    handle:close()
    return result:match("true") ~= nil
end

function _M.verify(ip)
    return verify_dns(ip)
end

return _M
```

**Apache configuration** using mod_rewrite and external script:

```apache
RewriteEngine On

# Check ClaudeBot User-Agent
RewriteCond %{HTTP_USER_AGENT} ClaudeBot [NC]

# Run verification script
RewriteCond %{REMOTE_ADDR}#%{HTTP_USER_AGENT} !^(.*)#(.*)$
RewriteRule .* - [E=VERIFIED:0]

# External verification
RewriteCond %{ENV:VERIFIED} =0
RewriteMap verify_bot prg:/usr/local/bin/verify-claudebot.sh
RewriteCond ${verify_bot:%{REMOTE_ADDR}} !=ok
RewriteRule .* - [F,L]
```

**Application middleware** for dynamic platforms:

```python
# Flask example
from flask import Flask, request, abort

app = Flask(__name__)

@app.before_request
def verify_crawler():
    user_agent = request.headers.get('User-Agent', '')

    if 'claudebot' in user_agent.lower():
        ip = request.remote_addr
        if not verify_claudebot(ip, user_agent):
            abort(403, description="ClaudeBot verification failed")
```

**CDN edge functions** for Cloudflare Workers:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || ''

  if (userAgent.toLowerCase().includes('claudebot')) {
    const ip = request.headers.get('CF-Connecting-IP')
    const verified = await verifyClaudeBot(ip)

    if (!verified) {
      return new Response('ClaudeBot verification failed', {
        status: 403
      })
    }
  }

  return fetch(request)
}

async function verifyClaudeBot(ip) {
  // Call DNS verification service
  const response = await fetch(`https://verify-api.example.com/check?ip=${ip}&crawler=claudebot`)
  const data = await response.json()
  return data.verified
}
```

## Handling Verification Failures

When verification fails, publishers must decide between blocking, logging, or challenging requests.

**Immediate blocking** provides strongest protection:

```python
if is_claudebot_claimed and not verify_claudebot(ip):
    return Response("Unauthorized crawler", status=403)
```

**Logging and monitoring** tracks spoofing attempts:

```python
if is_claudebot_claimed and not verify_claudebot(ip):
    logger.warning(f"ClaudeBot spoofing attempt from {ip} with UA: {user_agent}")
    metrics.increment('claudebot.spoof_attempts')
    # Either block or allow with monitoring
```

**Progressive challenges** escalate verification:

```python
if is_claudebot_claimed and not verify_claudebot_ip(ip):
    # First failure: try DNS verification
    if not verify_claudebot_dns(ip):
        # Second failure: require CAPTCHA or block
        return challenge_response()
```

**Honeypot responses** serve fake content to unverified crawlers:

```python
if claimed_bot and not verified:
    return serve_honeypot_content()
```

Honeypot content includes unique identifiers enabling detection if spoofed crawler data appears in AI training corpuses.

## Frequently Asked Questions

**How often should DNS verification be performed per IP?**

Cache verification results for 24-48 hours per IP. ClaudeBot infrastructure IPs don't change frequently enough to require per-request verification. Set cache TTLs balancing security (shorter = fresher verification) against performance (longer = fewer DNS queries). Monitor Anthropic announcements for infrastructure changes requiring cache invalidation.

**Can attackers bypass DNS verification by compromising Anthropic's DNS?**

Theoretically yes, but DNS compromise requires attacking Anthropic's registrar or nameservers—extremely difficult and quickly detected. DNS verification is far more secure than User-Agent checking alone. No practical verification method is perfectly secure; DNS bidirectional checking represents current best practice.

**What if ClaudeBot requests come from IPs not in published ranges or reverse DNS fails?**

Three scenarios: (1) Anthropic added new infrastructure not yet documented—temporary false negatives until ranges update, (2) Legitimate ClaudeBot using dynamic IPs or third-party infrastructure—contact Anthropic to clarify, (3) Spoofed crawler—correctly blocked. When uncertain, err toward blocking and monitor for patterns. Contact Anthropic if persistent verification failures suggest documentation gaps.

**Should verification happen on every request or only when robots.txt is violated?**

Verify on every ClaudeBot request for maximum security. Verification overhead (cached DNS lookups) adds milliseconds—negligible compared to content generation time. Only verifying robots.txt violations allows spoofed crawlers to access allowed content, potentially still problematic if publishers want complete control over who accesses what.

**How do I verify ClaudeBot when behind CDNs or load balancers?**

Extract real client IP from X-Forwarded-For or CF-Connecting-IP headers rather than immediate connection IP (which would be CDN/load balancer). Configure trust for these headers carefully—only accept from known infrastructure IPs to prevent header spoofing. Most CDNs provide ways to validate that forwarded IP headers are authentic.

**Does ClaudeBot provide any official verification APIs or services?**

As of early 2026, Anthropic hasn't announced official verification APIs. Publishers perform verification through DNS lookups and published IP ranges. Future official APIs could simplify verification—check Anthropic documentation for updates. Some crawler operators (Google, Bing) provide verification endpoints; similar services from Anthropic would improve ecosystem reliability.

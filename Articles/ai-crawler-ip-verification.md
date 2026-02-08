---
title:: AI Crawler IP Ranges: Verification Methods for GPTBot, ClaudeBot, and More
description:: Complete IP range verification guide for AI crawlers. Validate GPTBot, ClaudeBot, PerplexityBot, and other bots through IP matching, DNS lookup, and ASN analysis.
focus_keyword:: ai crawler ip ranges verification
category:: technical
author:: Victor Valentine Romo
date:: 2026.02.07
---

# AI Crawler IP Ranges: Verification Methods for GPTBot, ClaudeBot, and More

User agent strings lie. Request claims `GPTBot/1.0` but originates from residential ISP in Romania. Another says `ClaudeBot/1.0` from IP range owned by budget hosting provider. **Spoofed identities. Malicious scrapers pretending to be legitimate AI crawlers.**

**Why spoof?** Bypass robots.txt blocks. Evade rate limits. Access paywalled content. Publishers trust GPTBot, might serve content they'd block from unknown scrapers. Bad actors exploit this.

**IP verification exposes spoofing.** AI companies publish official IP ranges for their crawlers. **OpenAI** operates GPTBot from specific Azure data center subnets. **Anthropic** runs ClaudeBot from AWS ranges. **Perplexity** uses Google Cloud IPs. If request claims to be GPTBot but IP isn't in OpenAI's published ranges, **it's fake**.

Verification isn't optional. Publishers blocking "GPTBot" by user agent alone might block legitimate OpenAI while missing the 15 spoofed scrapers using same user agent from unauthorized IPs. Conversely, allowing "GPTBot" without IP verification grants access to imposters.

This guide provides complete IP verification methodology: published range databases, DNS reverse lookup validation, ASN analysis, and automated verification systems that distinguish real AI crawlers from frauds.

## Published IP Ranges by Company

### OpenAI (GPTBot, ChatGPT-User)

**Official documentation:** https://platform.openai.com/docs/gptbot

**GPTBot IP ranges (as of February 2026):**

```
20.15.240.64/28
20.15.240.80/28
20.15.240.96/28
20.15.240.176/28
20.15.241.0/28
20.15.242.128/28
20.15.242.144/28
20.15.242.192/28
40.83.2.64/28
```

**Additional ranges (ChatGPT-User for real-time browsing):**

```
13.64.0.0/11
13.96.0.0/13
20.33.0.0/16
20.34.0.0/15
...
(Broader Azure ranges—consult OpenAI docs for complete list)
```

**Network:** Microsoft Azure (OpenAI infrastructure hosted on Azure)

**ASN:** AS8075 (Microsoft Corporation)

**Verification script:**

```python
import ipaddress

GPTBOT_RANGES = [
    '20.15.240.64/28',
    '20.15.240.80/28',
    '20.15.240.96/28',
    '20.15.240.176/28',
    '20.15.241.0/28',
    '20.15.242.128/28',
    '20.15.242.144/28',
    '20.15.242.192/28',
    '40.83.2.64/28',
]

def is_legitimate_gptbot(ip_address):
    ip = ipaddress.ip_address(ip_address)
    for range_str in GPTBOT_RANGES:
        if ip in ipaddress.ip_network(range_str):
            return True
    return False

# Test
print(is_legitimate_gptbot('20.15.240.75'))  # True
print(is_legitimate_gptbot('192.0.2.1'))     # False
```

**Update frequency:** OpenAI occasionally expands ranges (infrastructure growth). Check official docs quarterly.

### Anthropic (ClaudeBot, Claude-Web)

**Official documentation:** https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web

**ClaudeBot IP ranges:**

```
160.79.104.0/23
160.79.106.0/24
```

**Network:** AWS (Amazon Web Services)

**ASN:** AS16509 (Amazon.com)

**Verification:**

```python
CLAUDEBOT_RANGES = [
    '160.79.104.0/23',
    '160.79.106.0/24',
]

def is_legitimate_claudebot(ip_address):
    ip = ipaddress.ip_address(ip_address)
    for range_str in CLAUDEBOT_RANGES:
        if ip in ipaddress.ip_network(range_str):
            return True
    return False
```

**Additional verification: DNS reverse lookup** (see section below).

**Update:** Anthropic published ranges in 2024. Monitor for expansions as Claude traffic grows.

### Perplexity (PerplexityBot)

**Official IP ranges:** Not comprehensively published (as of Feb 2026).

**Verification method:** DNS reverse lookup (see [verify-claudebot-ip-dns.html](verify-claudebot-ip-dns.html) for methodology).

**Known IPs observed (community-sourced):**

Primarily Google Cloud Platform ranges (AS15169).

**Partial list:**

```
34.117.0.0/16 (GCP us-central1)
35.185.0.0/16 (GCP us-east4)
```

**Recommendation:** Use DNS verification instead of IP ranges for PerplexityBot (more reliable until official ranges published).

### Google (Google-Extended, GoogleOther)

**Google-Extended:** Separate from Googlebot, used for Bard/Gemini training.

**IP ranges:** Same as Googlebot (extensive Google ASNs).

**Primary ASN:** AS15169 (GOOGLE)

**IP blocks (subset):**

```
66.249.64.0/19
66.102.0.0/20
64.233.160.0/19
...
(Hundreds of ranges—see Google's official ASN listings)
```

**Verification:** DNS reverse lookup more practical than maintaining Google's massive IP list.

**Command:**

```bash
host 66.249.64.1
```

**Expected output:**

```
1.64.249.66.in-addr.arpa domain name pointer crawl-66-249-64-1.googlebot.com.
```

Domain `googlebot.com` confirms legitimacy.

### Common Crawl (CCBot)

**No official IP range publication.**

**Verification:** DNS lookup or ASN analysis.

**Observed ASNs:** Various (Common Crawl uses multiple cloud providers).

**Strategy:** Less critical to verify (Common Crawl is non-commercial research project). If blocking CCBot, block by user agent; verification optional.

## Verification Methodologies

### Direct IP Range Matching

**Simplest method:** Check if request IP falls within published ranges.

**Full implementation:**

```python
import ipaddress

# Comprehensive range database
AI_CRAWLER_RANGES = {
    'GPTBot': [
        '20.15.240.64/28',
        '20.15.240.80/28',
        '20.15.240.96/28',
        '20.15.240.176/28',
        '20.15.241.0/28',
        '20.15.242.128/28',
        '20.15.242.144/28',
        '20.15.242.192/28',
        '40.83.2.64/28',
    ],
    'ClaudeBot': [
        '160.79.104.0/23',
        '160.79.106.0/24',
    ],
}

def verify_bot_ip(ip_address, claimed_bot):
    if claimed_bot not in AI_CRAWLER_RANGES:
        return None  # No published ranges for this bot

    ip = ipaddress.ip_address(ip_address)
    for range_str in AI_CRAWLER_RANGES[claimed_bot]:
        if ip in ipaddress.ip_network(range_str):
            return True  # IP verified
    return False  # IP doesn't match published ranges

# Usage in request handler
user_agent = request.headers.get('User-Agent')
ip = request.remote_addr

if 'GPTBot' in user_agent:
    if not verify_bot_ip(ip, 'GPTBot'):
        log_spoofing_attempt(ip, user_agent)
        return "403 Forbidden", 403
```

**Nginx implementation (Cloudflare-style):**

```nginx
# Define GPTBot allowed IPs
geo $gptbot_allowed {
    default 0;
    20.15.240.64/28 1;
    20.15.240.80/28 1;
    20.15.240.96/28 1;
    20.15.240.176/28 1;
    20.15.241.0/28 1;
    20.15.242.128/28 1;
    20.15.242.144/28 1;
    20.15.242.192/28 1;
    40.83.2.64/28 1;
}

# Block GPTBot user agent from non-allowed IPs
location / {
    if ($http_user_agent ~* "GPTBot") {
        set $is_gptbot 1;
    }

    if ($gptbot_allowed = 0) {
        set $is_gptbot "${is_gptbot}0";
    }

    if ($is_gptbot = "10") {
        # GPTBot user agent but IP not in allowed ranges
        return 403;
    }
}
```

**Benefits:** Fast (no DNS lookup latency), precise.

**Drawbacks:** Requires maintaining IP range database, ranges change over time.

### DNS Reverse Lookup Verification

**Method:** Resolve IP to hostname, verify domain matches AI company.

**Process:**

1. Extract IP from request
2. Perform reverse DNS lookup
3. Check if hostname contains expected domain
4. (Optional) Forward DNS verify hostname resolves back to original IP

**Example (OpenAI GPTBot):**

```bash
# Reverse lookup
host 20.15.240.75

# Expected output format
75.240.15.20.in-addr.arpa domain name pointer crawler-20-15-240-75.ptr.openai.com.
```

Domain `openai.com` confirms legitimate GPTBot.

**Python implementation:**

```python
import socket

def verify_bot_by_dns(ip, expected_domain):
    try:
        # Reverse DNS lookup
        hostname = socket.gethostbyaddr(ip)[0]

        # Check if expected domain in hostname
        if expected_domain in hostname:
            # Optional: Forward verify
            forward_ip = socket.gethostbyname(hostname)
            if forward_ip == ip:
                return True
    except socket.herror:
        return False  # DNS lookup failed
    return False

# Usage
if 'GPTBot' in user_agent:
    if not verify_bot_by_dns(request.remote_addr, 'openai.com'):
        block_request()
```

**Anthropic ClaudeBot verification:**

See [verify-claudebot-ip-dns.html](verify-claudebot-ip-dns.html) for ClaudeBot-specific DNS verification.

**Expected hostname patterns:**

- **OpenAI:** `crawler-*.ptr.openai.com`
- **Anthropic:** `*.anthropic.com` or AWS hostnames (less specific)
- **Perplexity:** `*.perplexity.ai`
- **Google:** `*.googlebot.com` or `*.google.com`

**Benefits:** Works when IP ranges not published, harder to spoof (requires DNS control).

**Drawbacks:** Adds latency (DNS lookup per request), some IPs lack reverse DNS.

### ASN (Autonomous System Number) Analysis

**ASN:** Identifies network owner. AI companies use specific ASNs for infrastructure.

**Common AI crawler ASNs:**

| Company | ASN | Owner |
|---------|-----|-------|
| OpenAI | AS8075 | Microsoft (Azure) |
| Anthropic | AS16509 | Amazon (AWS) |
| Google | AS15169 | Google LLC |
| Perplexity | AS15169 | Google (GCP) |

**Verification strategy:**

Even if specific IP ranges unknown, verify ASN matches expected provider.

**Example:** ClaudeBot should originate from AWS (AS16509). If request claims ClaudeBot from AS8075 (Azure), suspicious.

**Lookup ASN for IP:**

```bash
whois -h whois.cymru.com " -v 20.15.240.75"
```

**Output:**

```
AS      | IP               | AS Name
8075    | 20.15.240.75     | MICROSOFT-CORP-MSN-AS-BLOCK
```

**Python with GeoIP database:**

```python
import geoip2.database

reader = geoip2.database.Reader('/path/to/GeoLite2-ASN.mmdb')

def verify_bot_by_asn(ip, expected_asn):
    try:
        response = reader.asn(ip)
        return response.autonomous_system_number == expected_asn
    except:
        return False

# Usage
if 'GPTBot' in user_agent:
    if not verify_bot_by_asn(request.remote_addr, 8075):  # Microsoft ASN
        suspicious_request()
```

**Benefits:** Broad verification (don't need exact IP ranges), stable (ASNs change rarely).

**Drawbacks:** Less precise (entire Azure = AS8075, not just OpenAI).

## Automated Verification Systems

### Middleware-Based Verification

**Insert verification layer into request pipeline.**

**Flask example:**

```python
from flask import Flask, request, abort

app = Flask(__name__)

# Bot verification middleware
@app.before_request
def verify_ai_crawler():
    user_agent = request.headers.get('User-Agent', '')
    ip = request.remote_addr

    # Check if request claims to be AI bot
    for bot_name, bot_patterns in AI_BOTS.items():
        if any(pattern in user_agent for pattern in bot_patterns):
            # Verify IP
            if not verify_bot_ip(ip, bot_name):
                # Log spoofing attempt
                app.logger.warning(f"Spoofed {bot_name} from {ip}")
                # Block request
                abort(403, f"Unauthorized use of {bot_name} user agent")

AI_BOTS = {
    'GPTBot': ['GPTBot', 'ChatGPT-User'],
    'ClaudeBot': ['ClaudeBot', 'Claude-Web', 'anthropic-ai'],
    'PerplexityBot': ['PerplexityBot', 'Perplexity'],
}
```

**Every request** checked. Spoofed bots blocked before reaching application logic.

### Cloudflare Firewall Rules

**Cloudflare Workers can enforce IP verification at edge.**

**Rule structure:**

```
(http.user_agent contains "GPTBot") and
(not ip.src in {20.15.240.64/28 20.15.240.80/28 20.15.240.96/28 20.15.240.176/28 20.15.241.0/28 20.15.242.128/28 20.15.242.144/28 20.15.242.192/28 40.83.2.64/28})
```

**Action:** Block or Challenge

**Effect:** Spoofed GPTBot requests never reach origin server (blocked at CDN edge).

**Benefits:** Zero origin load from spoofed bots, Cloudflare maintains rule (no server config needed).

**Setup:**

1. Cloudflare dashboard → Security → WAF
2. Create Firewall Rule
3. Expression: (above rule)
4. Action: Block
5. Deploy

**For multiple bots:**

```
(
  (http.user_agent contains "GPTBot" and not ip.src in {[GPTBot ranges]})
  or
  (http.user_agent contains "ClaudeBot" and not ip.src in {[ClaudeBot ranges]})
  or
  (http.user_agent contains "PerplexityBot" and not [DNS verification logic])
)
```

**Action:** Block

### Cache-Based Verification

**Problem:** DNS lookup on every request adds latency.

**Solution:** Cache verification results (Redis, Memcached).

**Implementation:**

```python
import redis
import socket

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

def verify_bot_cached(ip, user_agent):
    # Check cache
    cache_key = f"bot_verify:{ip}"
    cached_result = redis_client.get(cache_key)

    if cached_result:
        return cached_result == 'legitimate'

    # Perform verification
    is_legitimate = verify_bot_by_dns(ip, get_expected_domain(user_agent))

    # Cache result (24-hour TTL)
    redis_client.setex(cache_key, 86400, 'legitimate' if is_legitimate else 'spoofed')

    return is_legitimate

def get_expected_domain(user_agent):
    if 'GPTBot' in user_agent:
        return 'openai.com'
    elif 'ClaudeBot' in user_agent:
        return 'anthropic.com'
    elif 'PerplexityBot' in user_agent:
        return 'perplexity.ai'
    return None
```

**First request:** DNS lookup (slow). **Subsequent requests:** Cache hit (fast).

**Cache invalidation:** 24-hour TTL handles IP changes gracefully.

## Handling Verification Failures

### Logging Spoofing Attempts

**Don't just block—collect intelligence.**

**Log structure:**

```python
def log_spoofing_attempt(ip, user_agent, claimed_bot):
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'ip': ip,
        'user_agent': user_agent,
        'claimed_bot': claimed_bot,
        'verification_method': 'ip_range',
        'result': 'failed',
        'action_taken': 'blocked'
    }

    # Log to file
    with open('/var/log/bot-spoofing.log', 'a') as f:
        f.write(json.dumps(log_entry) + '\n')

    # Alert if pattern detected (multiple IPs using same spoofed UA)
    if detect_spoofing_campaign(log_entry):
        send_alert("Coordinated spoofing campaign detected")
```

**Analysis:**

```bash
# Find most spoofed bot identities
jq -r '.claimed_bot' /var/log/bot-spoofing.log | sort | uniq -c | sort -rn
```

**Output:**

```
87 GPTBot
45 ClaudeBot
23 GoogleBot
```

**Insight:** GPTBot most frequently spoofed (attackers assume publishers allow it).

### Graduated Response Strategies

**Don't immediately block on verification failure.** Tiered approach:

**Tier 1: First failure**

- Log attempt
- Allow request (might be legitimate bot from new IP not yet in published ranges)
- Set flag for monitoring

**Tier 2: Second failure (same IP within 24h)**

- Rate limit severely (1 request/minute)
- Challenge with CAPTCHA (if bot can't solve, confirm it's automated)

**Tier 3: Third failure or egregious pattern**

- Block IP for 24 hours
- Alert security team
- Add to permanent blocklist if campaign detected

**Implementation:**

```python
def handle_verification_failure(ip, user_agent):
    # Track failure count (Redis)
    key = f"verify_fail:{ip}"
    failures = redis_client.incr(key)
    redis_client.expire(key, 86400)  # 24-hour window

    if failures == 1:
        # First failure: log and allow
        log_spoofing_attempt(ip, user_agent, 'GPTBot')
        return 'allow'

    elif failures == 2:
        # Second failure: rate limit
        apply_rate_limit(ip, rate='1r/m')
        return 'rate_limit'

    else:
        # Third+ failure: block
        block_ip(ip, duration=86400)
        return 'block'
```

### Reporting to AI Companies

**If spoofing is widespread, notify AI company.**

**OpenAI contact:** Abuse reports to security@openai.com

**Anthropic contact:** support@anthropic.com

**Report content:**

- Evidence (log excerpts showing spoofed user agent + IP verification failure)
- Volume (number of spoofing attempts detected)
- Request (ask if IP ranges have expanded, request clarification)

**AI companies benefit from reports:** Helps them identify unauthorized use of their crawler identities, potential trademark violations, or misconfigured third-party services claiming to be their bots.

## Maintaining IP Range Databases

### Update Frequency

**AI companies expand infrastructure.** IP ranges grow over time.

**Recommended check frequency:**

- **Monthly:** Review official documentation for updates
- **Quarterly:** Full audit of IP database accuracy
- **On alert:** If verification starts failing frequently, check for range changes

**Automated update script:**

```python
import requests

def fetch_latest_gptbot_ranges():
    # OpenAI publishes ranges in JSON format (hypothetical API)
    url = "https://openai.com/api/crawler-ips.json"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        new_ranges = data.get('gptbot_ranges', [])

        # Update local database
        update_ip_database('GPTBot', new_ranges)

# Run weekly via cron
```

**Community resources:**

- GitHub repos tracking AI crawler IPs (community-maintained)
- Publisher forums sharing observed IP changes
- [ai-crawler-directory-2026.html](ai-crawler-directory-2026.html) (periodically updated directory)

### Version Control for IP Databases

**Track changes to IP ranges.**

**Git repository structure:**

```
/ip-ranges/
  gptbot.txt
  claudebot.txt
  perplexitybot.txt
  CHANGELOG.md
```

**Commit when ranges update:**

```bash
git add ip-ranges/gptbot.txt
git commit -m "Update GPTBot ranges: Added 20.15.243.0/28"
git push
```

**Benefits:** Audit trail (know when ranges changed), rollback capability (if update breaks verification), collaboration (team can review changes).

## FAQ

### How often do AI companies update their IP ranges?

**Varies by company.** **OpenAI** (GPTBot) has expanded ranges 3-4 times since launch (2023-2026), roughly quarterly as infrastructure scales. **Anthropic** (ClaudeBot) published initial ranges in 2024, no major updates yet (smaller scale than OpenAI). **Perplexity** hasn't published comprehensive ranges (growing company, IP allocation in flux). **Recommendation:** Check official docs monthly, subscribe to company blogs/changelogs for announcements.

### What if legitimate bot requests come from IPs outside published ranges?

**Happens occasionally.** **Causes:** (1) AI company launched new infrastructure not yet in docs, (2) Bot uses proxy/CDN temporarily (rare), (3) Documentation lag (company updated infrastructure but hasn't published new ranges). **Response:** Don't immediately block on first failure. Use graduated response (see section above). If persistent failures from specific IP, manually investigate (reverse DNS lookup, contact AI company). **Long-term:** Combine IP verification with other signals (behavioral analysis, user agent details) for holistic bot validation.

### Can I rely solely on DNS reverse lookup without IP range verification?

**Yes, if ASN matches and DNS is properly configured.** DNS verification is **more reliable for bots without published IP ranges** (Perplexity, smaller crawlers). **Advantages:** Works when ranges unavailable, harder to spoof (requires DNS control). **Disadvantages:** Adds latency (DNS query per request—mitigate with caching), some IPs lack reverse DNS. **Best practice:** Use DNS lookup as primary method when IP ranges unavailable, cache results aggressively (24h TTL).

### How do I verify bots that use multiple ASNs or cloud providers?

**Check company's infrastructure documentation.** Example: **Google** operates on AS15169 (primary) but also uses AS19425, AS36384, AS36385 (YouTube, Google Fiber, etc.). **OpenAI** primarily AS8075 (Azure) but may expand to other providers. **Approach:** Maintain list of known ASNs per company, accept request if ASN matches any. **Fallback:** DNS verification works across ASN changes (as long as company maintains reverse DNS records). **Risk:** Broad ASN allowlisting reduces precision (entire Azure might be allowed for GPTBot, catches legitimate OpenAI but also other Azure users spoofing UA).

### Should I block requests that fail IP verification or just log them?

**Depends on security posture and false positive tolerance.** **High-security sites (paywalls, premium content):** Block verification failures (protect revenue). **Open sites (public content):** Log failures, rate-limit suspicious traffic, challenge with CAPTCHA (balance security with access). **Enterprise publishers:** Implement graduated response (log first failure, rate-limit second, block third). **Never auto-block on first failure** (legitimate bot from new IP might be caught). **Review logs weekly** to identify patterns—if 95% of failures are malicious, tighten policy. If 30% seem legitimate (new IPs), loosen restrictions.

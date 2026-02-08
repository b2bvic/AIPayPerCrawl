---
title:: Block ByteSpider with Nginx: Stop TikTok's Aggressive AI Crawler
description:: Complete Nginx configuration guide to block ByteDance's ByteSpider crawler. Includes user-agent rules, IP blocking, and behavioral detection for spoofed requests.
focus_keyword:: block bytespider nginx
category:: ai-monetization
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Block ByteSpider with Nginx: Stop TikTok's Aggressive AI Crawler

**ByteSpider** operates as **ByteDance's** web crawler, feeding training data to the **Doubao** large language model and **TikTok** AI features. The crawler stands out for three characteristics: massive volume, routine robots.txt non-compliance, and zero publisher compensation.

Publishers report **ByteSpider** generating 3-5x the request volume of [GPTBot](/articles/gptbot-behavior-analysis.html) while respecting none of the courtesies other AI crawlers observe. It [ignores robots.txt](/articles/bytespider-ignores-robots-txt.html), spoofs user agents, and rotates through IP ranges to evade static blocks.

**Nginx**-based blocking provides the most effective defense. Configuration combines user-agent detection, IP range blocking, rate limiting, and behavioral analysis. No single mechanism stops **ByteSpider** entirely. Layered defenses catch 90-95% of requests.

---

## Why Nginx-Level Blocking Matters for ByteSpider

### robots.txt Alone Fails (ByteSpider Ignores Directives)

The [robots.txt protocol](/articles/robots-txt-ai-crawlers-template.html) depends on voluntary compliance. **ByteSpider** doesn't volunteer.

Publishers document consistent **ByteSpider** crawling after implementing:

```
User-agent: Bytespider
Disallow: /
```

Server logs show request volume unchanged. **ByteSpider** either doesn't check robots.txt or checks and proceeds anyway.

**Compliance comparison:**

| Crawler | robots.txt Compliance Rate | Publisher Reports |
|---------|---------------------------|------------------|
| GPTBot | ~99% | Consistent compliance |
| ClaudeBot | ~99% | Consistent compliance |
| Googlebot | ~99% | Consistent compliance |
| Bytespider | ~5% | Routine violations |

The 5% **ByteSpider** "compliance" represents requests that stopped for other reasons (IP blocks, firewall rules) rather than robots.txt respect.

robots.txt should still be implemented for legal documentation purposes. The directive establishes that you expressly prohibited access. But enforcement requires server-level blocking.

### Server-Level Enforcement Prevents Resource Consumption

**Nginx** blocking stops requests at the web server layer before they reach application code. Benefits:

**Resource protection:**
- No PHP/Python/Ruby execution
- No database queries
- No CMS page generation
- No framework overhead

**Cost savings:**
- Reduced bandwidth consumption
- Lower server CPU utilization
- Decreased memory usage
- Minimal log storage growth

**Performance preservation:**
- Legitimate user requests get full resources
- No crawler-induced slowdowns
- Shared hosting limits preserved

For sites on metered hosting or experiencing **ByteSpider** volumes in thousands of requests daily, server-level blocking directly reduces infrastructure costs.

### Nginx Performance (Minimal Overhead)

**Nginx** processes blocks at the request handling layer with negligible performance impact. The server evaluates user-agent strings and IP ranges before any application code executes.

**Performance characteristics:**
- User-agent string matching: microseconds per request
- IP range checking: microseconds per request
- No database lookups required
- No external service calls
- Minimal memory allocation

Sites serving millions of requests daily can implement comprehensive **ByteSpider** blocking without measurable performance degradation.

---

## Basic Nginx Configuration

### User-Agent Based Blocking

The foundation of **ByteSpider** blocking:

```nginx
map $http_user_agent $block_bytespider {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
}

server {
    listen 80;
    server_name yourdomain.com;

    if ($block_bytespider) {
        return 403;
    }

    # Rest of your configuration
}
```

**Explanation:**
- `map` directive creates variable `$block_bytespider`
- Default value: 0 (don't block)
- If user-agent contains "Bytespider" (case-insensitive): set to 1
- If user-agent contains "bytedance" (case-insensitive): set to 1
- In server block, return 403 Forbidden when variable equals 1

**Reload Nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Match Multiple ByteDance Variants

**ByteSpider** appears with multiple user-agent formats:

```nginx
map $http_user_agent $block_bytespider {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
    ~*ByteSpider 1;
    ~*BYTESPIDER 1;
}
```

The `~*` regex operator provides case-insensitive matching, but multiple entries ensure maximum coverage across variant capitalizations.

### Return 403 vs. 444 (Connection Drop)

Two response strategies:

**403 Forbidden (explicit rejection):**

```nginx
if ($block_bytespider) {
    return 403;
}
```

**Nginx 444 (connection drop without response):**

```nginx
if ($block_bytespider) {
    return 444;
}
```

**Trade-offs:**

| Response | Behavior | Pros | Cons |
|----------|----------|------|------|
| 403 | HTTP error page | Clear signal to legitimate analysis | ByteSpider sees failure |
| 444 | Connection dropped | ByteSpider gets no response | Harder to debug issues |

**Recommendation:** Use 403 during initial implementation for debugging visibility. Switch to 444 after confirming block effectiveness if you want to give **ByteSpider** no feedback.

---

## IP-Based Blocking

### Known ByteDance IP Ranges

**ByteDance** operates from documented IP ranges. Block at network level:

```nginx
geo $bytedance_ip {
    default 0;

    # Known ByteDance ranges
    220.243.135.0/24 1;
    220.243.136.0/24 1;
    111.225.148.0/24 1;
    111.225.149.0/24 1;
    110.249.201.0/24 1;
    110.249.202.0/24 1;
    60.8.123.0/24 1;
    60.8.124.0/24 1;
}

server {
    if ($bytedance_ip) {
        return 403;
    }
}
```

**Geo** directive evaluates client IP against defined ranges. Matches set `$bytedance_ip` to 1.

### ASN-Based Blocking (AS396986, AS138294)

Block entire **ByteDance** Autonomous System Numbers:

**Requires GeoIP2 module** (standard in modern Nginx builds):

```nginx
map $geoip2_data_asn $block_bytedance_asn {
    default 0;
    396986 1;  # ByteDance Inc.
    138294 1;  # ByteDance
}

server {
    if ($block_bytedance_asn) {
        return 403;
    }
}
```

ASN blocking catches all IP ranges associated with **ByteDance**, including new allocations that static IP lists miss.

**Install GeoIP2 if needed:**

```bash
sudo apt-get install libnginx-mod-http-geoip2
# Or
sudo yum install nginx-mod-http-geoip2
```

### Combine User-Agent and IP Blocking

Maximum coverage through layered detection:

```nginx
map $http_user_agent $ua_block {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
}

geo $ip_block {
    default 0;
    220.243.135.0/24 1;
    220.243.136.0/24 1;
    # Additional ranges...
}

map $ua_block$ip_block $block_bytespider_combined {
    default 0;
    ~1 1;  # Block if either UA or IP matches
}

server {
    if ($block_bytespider_combined) {
        return 403;
    }
}
```

This blocks requests matching user-agent **or** IP range criteria. Catches spoofed user-agents (identified by IP) and IP rotation (identified by user-agent).

---

## Advanced Behavioral Detection

### Rate Limiting Suspicious Patterns

**ByteSpider** generates high request volumes. Rate limiting catches aggressive crawling even when user-agent and IP are spoofed:

```nginx
limit_req_zone $binary_remote_addr zone=crawler_limit:10m rate=10r/m;

server {
    location / {
        limit_req zone=crawler_limit burst=20;

        # Rest of location config
    }
}
```

**Configuration:**
- Creates rate limit zone: 10 requests per minute per IP
- Burst allowance: 20 requests (accommodates legitimate traffic spikes)
- Exceeding limits returns 503 (Service Unavailable)

**ByteSpider** hitting hundreds of requests per minute gets throttled. Legitimate users stay under limits.

### Detect Absence of Common Browser Behaviors

Real browsers load CSS, JavaScript, and images. Crawlers request only HTML:

```nginx
map $http_user_agent $suspicious_crawler {
    default 0;
    "~*Mozilla.*Windows.*Chrome" 1;  # Claims to be browser
}

map $request_uri $static_resource {
    default 0;
    ~*\.(css|js|jpg|png|gif|ico)$ 1;
}

log_format crawler_check '$remote_addr - $http_user_agent - Static: $static_resource';
access_log /var/log/nginx/crawler_analysis.log crawler_check;
```

**Analysis process:**
1. Log requests with user-agent and static resource flag
2. Periodically analyze: IPs claiming browser identity but never requesting static resources
3. Add confirmed spoofed IPs to block list

**Weekly analysis script:**

```bash
#!/bin/bash
# Find IPs claiming browser identity but only requesting HTML
awk '/Mozilla.*Chrome/ && /Static: 0/ {print $1}' /var/log/nginx/crawler_analysis.log | sort | uniq -c | sort -nr | head -20
```

IPs appearing thousands of times without static resource requests are likely spoofed **ByteSpider**.

### Challenge-Based Detection

Serve challenge pages to suspected crawlers:

```nginx
map $http_user_agent $maybe_fake_browser {
    default 0;
    ~*Mozilla 1;
}

geo $suspicious_network {
    default 0;
    220.0.0.0/8 1;  # Chinese IP ranges where ByteDance operates
}

server {
    if ($maybe_fake_browser && $suspicious_network) {
        rewrite ^(.*)$ /challenge.html break;
    }
}
```

**Challenge page** (`/challenge.html`):
- Simple JavaScript that redirects to original URL
- Crawlers without JavaScript execution capability can't pass
- Real browsers from Chinese networks proceed normally

**Trade-off:** Adds friction for legitimate Chinese users. Appropriate if your audience is primarily non-Chinese or if **ByteSpider** volume justifies regional challenges.

---

## Configuration Best Practices

### Centralized Configuration File

Maintain **ByteSpider** rules in separate include file:

**/etc/nginx/conf.d/block-bytespider.conf:**

```nginx
# ByteSpider user-agent blocking
map $http_user_agent $block_bytespider_ua {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
}

# ByteDance IP ranges
geo $block_bytespider_ip {
    default 0;
    220.243.135.0/24 1;
    220.243.136.0/24 1;
    111.225.148.0/24 1;
    111.225.149.0/24 1;
    # Additional ranges...
}

# Combined blocking variable
map $block_bytespider_ua$block_bytespider_ip $block_bytespider {
    default 0;
    ~1 1;
}
```

**Main configuration:**

```nginx
include /etc/nginx/conf.d/block-bytespider.conf;

server {
    if ($block_bytespider) {
        return 403;
    }
    # Rest of server config
}
```

Benefits:
- Single source of truth for block rules
- Easy updates without editing main config
- Reusable across multiple server blocks
- Version control friendly

### Testing Before Production Deployment

Test configuration changes before deploying:

```bash
# Test syntax
sudo nginx -t

# If successful, reload
sudo systemctl reload nginx
```

**Nginx** syntax checker catches configuration errors before they cause service interruption.

**Staged deployment:**
1. Deploy to staging/development environment
2. Verify **ByteSpider** requests are blocked
3. Confirm legitimate traffic unaffected
4. Deploy to production

### Logging Blocked Requests

Track block effectiveness:

```nginx
map $http_user_agent $block_bytespider {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
}

server {
    if ($block_bytespider) {
        access_log /var/log/nginx/bytespider_blocked.log combined;
        return 403;
    }
}
```

Dedicated log file captures all blocked **ByteSpider** requests. Weekly analysis reveals:
- Block success rate
- New IP ranges requiring addition to block list
- Spoofing patterns
- Volume trends

---

## Monitoring and Maintenance

### Weekly Log Analysis

Verify blocks remain effective:

```bash
# Count ByteSpider requests (should be low/zero)
grep "Bytespider" /var/log/nginx/access.log | wc -l

# Count blocked requests
wc -l /var/log/nginx/bytespider_blocked.log

# Identify new IP ranges
grep "Bytespider" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr
```

**Alert thresholds:**
- More than 50 **ByteSpider** requests per week reaching content pages: indicates block failure
- New IP ranges not in block list: requires config update
- Sudden volume spikes: investigate new crawler variants

### Update IP Ranges Quarterly

**ByteDance** infrastructure evolves. Quarterly updates prevent block list decay:

**Update process:**
1. Research current **ByteDance** IP allocations (RIPE, ARIN databases)
2. Cross-reference with community-maintained lists
3. Add new ranges to geo block
4. Test configuration
5. Deploy updates

**Community resources:**
- https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker
- Publisher forums discussing **ByteSpider** activity
- Network operator mailing lists

### Alert on Block Failures

Automated alerting for unusual **ByteSpider** activity:

```bash
#!/bin/bash
# Alert if ByteSpider bypasses blocks

LOG="/var/log/nginx/access.log"
THRESHOLD=50
COUNT=$(grep "Bytespider" "$LOG" | grep -v "403" | wc -l)

if [ $COUNT -gt $THRESHOLD ]; then
    echo "ByteSpider block failure: $COUNT successful requests detected" | mail -s "Nginx Alert" admin@yourdomain.com
fi
```

Run via cron daily or weekly.

---

## Performance Impact Assessment

### Nginx Block Overhead

Measure blocking impact:

**Benchmark without blocks:**

```bash
ab -n 1000 -c 10 https://yourdomain.com/
```

**Benchmark with blocks:**

```bash
ab -n 1000 -c 10 https://yourdomain.com/
```

**Expected result:** No measurable difference. **Nginx** user-agent and IP evaluation adds microseconds per request. Application-level processing dominates response time.

**Real-world impact:** Blocking reduces total request volume, improving overall performance by freeing resources for legitimate traffic.

### Monitor Server Resource Utilization

Track CPU and memory before/after implementation:

```bash
# Before
top -b -n 1 | head -20

# After
top -b -n 1 | head -20
```

**Expected outcome:** CPU and memory utilization decrease as **ByteSpider** requests are rejected before resource-intensive processing.

---

## Complete Production Configuration Example

Full-featured **ByteSpider** blocking configuration:

```nginx
# /etc/nginx/conf.d/bytespider-block.conf

# User-agent detection
map $http_user_agent $block_bytespider_ua {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
}

# IP range blocking
geo $block_bytespider_ip {
    default 0;
    220.243.135.0/24 1;
    220.243.136.0/24 1;
    111.225.148.0/24 1;
    111.225.149.0/24 1;
    110.249.201.0/24 1;
    110.249.202.0/24 1;
    60.8.123.0/24 1;
    60.8.124.0/24 1;
}

# Combined blocking logic
map $block_bytespider_ua$block_bytespider_ip $block_bytespider {
    default 0;
    ~1 1;
}

# Rate limiting for aggressive crawlers
limit_req_zone $binary_remote_addr zone=bytespider_limit:10m rate=10r/m;
```

**Main server config:**

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # Include ByteSpider blocks
    include /etc/nginx/conf.d/bytespider-block.conf;

    # Block ByteSpider
    if ($block_bytespider) {
        access_log /var/log/nginx/bytespider_blocked.log combined;
        return 403 "Access denied";
    }

    # Apply rate limiting
    location / {
        limit_req zone=bytespider_limit burst=20 nodelay;

        # Rest of location config
        try_files $uri $uri/ =404;
    }
}
```

This configuration provides:
- User-agent blocking (catches honest **ByteSpider**)
- IP blocking (catches spoofed user-agents)
- Rate limiting (catches IP rotation)
- Dedicated logging (monitoring and analysis)
- Minimal performance overhead

---

## Frequently Asked Questions

### Does Nginx blocking work if ByteSpider spoofs user-agents?

User-agent blocking alone doesn't catch spoofed requests. Layered defense combining user-agent detection **and** IP range blocking catches both honest **ByteSpider** (user-agent) and spoofed **ByteSpider** (IP). Add rate limiting to catch sophisticated spoofing that evades both.

### Will blocking ByteSpider affect my TikTok presence?

No. **ByteSpider** web crawling is separate from **TikTok** social platform features. Blocking **ByteSpider** doesn't affect how your content appears in **TikTok** search, link previews, or social sharing. These use different infrastructure.

### Can I use Nginx blocking if I'm on shared hosting?

Shared hosting typically doesn't provide **Nginx** configuration access. Use [robots.txt](/articles/block-bytespider-robots-txt.html) (minimal effectiveness) or [Cloudflare WAF rules](/articles/cloudflare-bot-management-ai.html) (more effective). If you have VPS or dedicated server with **Nginx**, server-level blocking is optimal.

### How do I verify my Nginx blocks are working?

Check server logs for **ByteSpider** requests: `grep "Bytespider" /var/log/nginx/access.log`. After implementing blocks, you should see only 403 responses or near-zero requests. Monitor weekly to confirm sustained effectiveness.

### Should I return 403 or 444 for blocked requests?

403 Forbidden provides explicit rejection visible in logs and helpful for debugging. 444 (connection drop) gives **ByteSpider** no feedback. Use 403 initially for visibility. Switch to 444 after confirming blocks work if you want to provide zero feedback to crawler.

### Does blocking ByteSpider violate any regulations?

No. Publishers control access to their content. robots.txt protocol is voluntary. You're not required to allow any crawler access. Blocking **ByteSpider** is legal, ethical, and increasingly common among publishers tired of uncompensated extraction.

### How often should I update ByteDance IP ranges?

Quarterly updates balance maintenance overhead with coverage effectiveness. **ByteDance** infrastructure evolves but not constantly. Set calendar reminder to review and update IP ranges every 90 days.

### Can ByteSpider bypass Nginx blocks entirely?

Sophisticated crawlers can rotate IPs, spoof user-agents, and mimic browser behavior. Layered defenses (user-agent + IP + rate limiting + behavioral detection) catch 90-95% of requests. Perfect blocking is impossible against determined adversaries, but comprehensive **Nginx** configuration stops the vast majority of **ByteSpider** activity.

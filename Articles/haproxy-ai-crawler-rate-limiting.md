---
title:: HAProxy AI Crawler Rate Limiting: Advanced Traffic Shaping for Bot Management
description:: Implement sophisticated AI crawler rate limiting with HAProxy using user-agent detection, stick tables, and dynamic rate controls. Production-ready configs included.
focus_keyword:: HAProxy crawler rate limiting
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# HAProxy AI Crawler Rate Limiting: Advanced Traffic Shaping for Bot Management

**HAProxy** provides sophisticated traffic control capabilities that surpass basic robots.txt directives when managing AI crawler access. While robots.txt requests compliance, **HAProxy** enforces limits regardless of crawler cooperation through application-layer filtering, dynamic rate tables, and multi-dimensional throttling strategies. Publishers facing aggressive AI crawler traffic, negotiating licensing agreements with usage caps, or operating under strict bandwidth budgets gain precise control through **HAProxy** configurations that permit desired crawler access while preventing infrastructure overload.

## Why HAProxy for Crawler Management

Web servers like **Nginx** and **Apache** include rate limiting modules, but **HAProxy**'s specialized load balancing and traffic shaping features provide advantages for complex crawler control scenarios. **HAProxy** operates as a reverse proxy sitting between clients and origin servers, inspecting requests before they reach application infrastructure, allowing denial or throttling before expensive backend processing occurs.

Stick tables enable stateful tracking across multiple HAProxy instances in load-balanced deployments. A crawler hitting multiple frontend servers still encounters unified rate limits because stick tables share state. Traditional web server rate limiting operates per-instance, allowing crawlers to bypass limits by distributing requests across servers. **HAProxy** closes this loophole.

Dynamic rate adjustment based on backend health distinguishes **HAProxy** from simpler approaches. If origin servers show elevated error rates or response times, **HAProxy** can automatically tighten crawler rate limits to preserve capacity for human users. When backend health improves, crawler limits relax, maximizing training data delivery within infrastructure constraints.

Multi-criteria filtering combines user-agent detection with IP-based rules, geographic origin, time-of-day patterns, and request characteristics. Block **GPTBot** from specific IP ranges during peak hours while allowing access at 2 AM. Permit **ClaudeBot** to request HTML at 20/minute but restrict PDF downloads to 5/minute. **HAProxy**'s ACL (Access Control List) system enables sophisticated policies robots.txt cannot express.

Logging and metrics integration feeds crawler traffic data into monitoring platforms like **Prometheus**, **Grafana**, or **Datadog**. Track per-crawler request rates, bandwidth consumption, error rates, and throttling events in real-time dashboards. This visibility supports billing under usage-based licensing agreements and provides evidence for copyright enforcement actions.

## Basic User-Agent Rate Limiting Configuration

A fundamental **HAProxy** configuration limiting **GPTBot** requests establishes the pattern for more complex policies:

```haproxy
frontend web_frontend
    bind *:80
    bind *:443 ssl crt /etc/haproxy/certs/site.pem

    # Define GPTBot ACL
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Track GPTBot requests in stick table
    stick-table type string len 64 size 100k expire 60s store http_req_rate(60s)
    http-request track-sc0 req.hdr(User-Agent) if is_gptbot

    # Rate limit: 10 requests per minute
    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(0) gt 10 }

    default_backend web_servers

backend web_servers
    balance roundrobin
    server web1 192.168.1.10:80 check
    server web2 192.168.1.11:80 check
```

This configuration identifies **GPTBot** via `User-Agent` header, tracks requests in a stick table with 60-second expiry, and denies requests exceeding 10 per minute with HTTP 429 status. The stick table stores request rates per unique user-agent string, enabling per-crawler limits.

Key components:

- `acl is_gptbot`: Defines boolean condition matching **GPTBot** in `User-Agent` header (case-insensitive via `-i` flag)
- `stick-table`: Creates in-memory table tracking 100,000 unique user-agent strings with 60-second expiration
- `http-request track-sc0`: Increments counter for matched requests
- `http-request deny`: Blocks requests when tracked rate exceeds threshold (10 req/min)
- `deny_status 429`: Returns "Too Many Requests" status code

Testing this configuration:

```bash
for i in {1..15}; do
  curl -A "GPTBot/1.0" https://example.com/
  sleep 5
done
```

First 10 requests succeed; subsequent requests receive 429 responses until the 60-second window slides forward allowing new requests.

## Multi-Crawler Differentiated Rate Limits

Production environments with multiple AI crawlers require per-crawler limits reflecting licensing agreements, infrastructure capacity, and strategic priorities:

```haproxy
frontend web_frontend
    bind *:443 ssl crt /etc/haproxy/certs/site.pem

    # Define crawler ACLs
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot
    acl is_claudebot hdr_sub(User-Agent) -i ClaudeBot
    acl is_google_extended hdr_sub(User-Agent) -i Google-Extended
    acl is_ccbot hdr_sub(User-Agent) -i CCBot

    # Stick tables for rate tracking
    stick-table type string len 64 size 100k expire 60s store http_req_rate(60s),bytes_out_rate(60s)

    # Track all crawlers
    http-request track-sc0 req.hdr(User-Agent) if is_gptbot or is_claudebot or is_google_extended or is_ccbot

    # Per-crawler rate limits (requests/minute)
    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(0) gt 20 }
    http-request deny deny_status 429 if is_claudebot { sc_http_req_rate(0) gt 15 }
    http-request deny deny_status 429 if is_google_extended { sc_http_req_rate(0) gt 30 }
    http-request deny deny_status 429 if is_ccbot { sc_http_req_rate(0) gt 10 }

    # Bandwidth limits (MB/minute)
    http-request deny deny_status 429 if is_gptbot { sc_bytes_out_rate(0) gt 52428800 }  # 50 MB/min
    http-request deny deny_status 429 if is_claudebot { sc_bytes_out_rate(0) gt 31457280 }  # 30 MB/min

    default_backend web_servers
```

This implements:
- **GPTBot**: 20 requests/minute, 50 MB/minute bandwidth cap
- **ClaudeBot**: 15 requests/minute, 30 MB/minute bandwidth cap
- **Google-Extended**: 30 requests/minute, no bandwidth cap
- **CCBot** (Common Crawl): 10 requests/minute, no bandwidth cap

Bandwidth tracking via `bytes_out_rate` enforces data transfer limits independent of request counts, critical when crawlers request large PDFs or media files. A crawler staying within request limits but downloading 100 MB/minute in large files still hits bandwidth throttles.

## IP-Based Verification and Spoofing Prevention

Crawlers can spoof `User-Agent` headers, claiming to be **GPTBot** while originating from non-OpenAI infrastructure. **HAProxy** can combine user-agent filtering with IP range verification:

```haproxy
frontend web_frontend
    # Define legitimate OpenAI IP ranges
    acl openai_ips src 52.12.0.0/14 54.0.0.0/8 23.20.0.0/14
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Legitimate GPTBot: correct user-agent AND valid IP
    acl legit_gptbot is_gptbot openai_ips

    # Spoofed GPTBot: correct user-agent but invalid IP
    acl spoofed_gptbot is_gptbot !openai_ips

    # Block spoofed crawlers immediately
    http-request deny deny_status 403 if spoofed_gptbot

    # Rate limit legitimate crawlers
    stick-table type string len 64 size 100k expire 60s store http_req_rate(60s)
    http-request track-sc0 req.hdr(User-Agent) if legit_gptbot
    http-request deny deny_status 429 if legit_gptbot { sc_http_req_rate(0) gt 20 }

    default_backend web_servers
```

IP ranges listed above are examples—publishers should maintain current lists from **OpenAI** documentation or observed legitimate crawler IPs. Automate updates:

```bash
#!/bin/bash
# Fetch current OpenAI IP ranges and update HAProxy ACL
curl -s https://openai.com/crawler-ips.json | \
  jq -r '.prefixes[]' > /etc/haproxy/openai_ips.lst

# Reload HAProxy configuration
systemctl reload haproxy
```

This script refreshes IP lists daily via cron, keeping ACL current as **OpenAI** provisions new infrastructure.

## Time-Based Rate Adjustment

Publishers often prefer allowing heavier crawler access during off-peak hours when human traffic is low. **HAProxy** ACLs support time-based rules:

```haproxy
frontend web_frontend
    # Define time periods
    acl peak_hours hdr_sub(Date) -m str -i hour=08,09,10,11,12,13,14,15,16,17,18
    acl off_peak_hours hdr_sub(Date) -m str -i hour=00,01,02,03,04,05,06,19,20,21,22,23

    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    stick-table type string len 64 size 100k expire 60s store http_req_rate(60s)
    http-request track-sc0 req.hdr(User-Agent) if is_gptbot

    # Strict limits during peak hours (8 AM - 6 PM)
    http-request deny deny_status 429 if is_gptbot peak_hours { sc_http_req_rate(0) gt 5 }

    # Relaxed limits during off-peak (6 PM - 8 AM)
    http-request deny deny_status 429 if is_gptbot off_peak_hours { sc_http_req_rate(0) gt 30 }

    default_backend web_servers
```

This throttles **GPTBot** to 5 requests/minute during daytime hours, allowing 30 requests/minute at night. Adjust thresholds based on traffic patterns—analyze logs to identify true peak periods for your audience.

Alternative approach using native time-based ACLs:

```haproxy
frontend web_frontend
    acl is_business_hours hour 8:00-18:00
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Dynamic rate limit based on time
    http-request set-var(txn.rate_limit) int(5) if is_business_hours
    http-request set-var(txn.rate_limit) int(30) if !is_business_hours

    stick-table type string len 64 size 100k expire 60s store http_req_rate(60s)
    http-request track-sc0 req.hdr(User-Agent) if is_gptbot

    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(0),sub(txn.rate_limit) gt 0 }

    default_backend web_servers
```

This sets a transaction variable (`txn.rate_limit`) dynamically based on time, then compares actual rate against the variable. More maintainable than hardcoding thresholds in multiple rules.

## Content-Type and Path-Based Restrictions

AI training benefits from HTML content more than static resources. Publishers can allow HTML access while restricting or blocking images, CSS, JavaScript, and binaries:

```haproxy
frontend web_frontend
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Define content types
    acl html_request path_end -i .html .htm
    acl image_request path_end -i .jpg .jpeg .png .gif .webp
    acl video_request path_end -i .mp4 .avi .mov .webm
    acl doc_request path_end -i .pdf .doc .docx .xls .xlsx
    acl static_request path_end -i .css .js .woff .ttf

    # Block static resources for crawlers
    http-request deny deny_status 403 if is_gptbot static_request

    # Aggressive limits for media
    stick-table type string len 128 size 100k expire 300s store http_req_rate(300s)
    http-request track-sc0 str(gptbot-media),req.hdr(User-Agent),path if is_gptbot image_request or video_request
    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(0) gt 10 } image_request or video_request

    # Moderate limits for documents
    http-request track-sc1 str(gptbot-docs),req.hdr(User-Agent) if is_gptbot doc_request
    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(1) gt 20 } doc_request

    # Permissive limits for HTML
    http-request track-sc2 str(gptbot-html),req.hdr(User-Agent) if is_gptbot html_request
    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(2) gt 50 } html_request

    default_backend web_servers
```

This configuration:
- Blocks CSS/JS/fonts completely (403 Forbidden)
- Limits images/video to 10 requests per 5 minutes
- Limits PDFs/Office docs to 20 requests per 5 minutes
- Permits HTML at 50 requests per 5 minutes

Separate stick table entries (`sc0`, `sc1`, `sc2`) track different content types independently, preventing HTML requests from consuming media quotas.

Path-based restrictions protect premium content sections:

```haproxy
frontend web_frontend
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Content sections
    acl public_content path_beg /blog /articles /public
    acl premium_content path_beg /premium /members /exclusive
    acl licensed_content path_beg /licensed-archive

    # Block premium content entirely
    http-request deny deny_status 403 if is_gptbot premium_content

    # Allow licensed content (may have separate agreement)
    # Apply standard rate limits

    # Permissive public content
    # Apply relaxed rate limits

    default_backend web_servers
```

## Backend Health-Aware Dynamic Rate Limiting

**HAProxy** can adjust crawler limits based on backend server health, preserving capacity for human users during degraded performance:

```haproxy
frontend web_frontend
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Check backend health
    acl backend_healthy nbsrv(web_servers) ge 2
    acl backend_degraded nbsrv(web_servers) eq 1
    acl backend_critical nbsrv(web_servers) lt 1

    # Block crawlers entirely if backend critical
    http-request deny deny_status 503 if is_gptbot backend_critical

    # Tight limits if degraded
    stick-table type string len 64 size 100k expire 60s store http_req_rate(60s)
    http-request track-sc0 req.hdr(User-Agent) if is_gptbot
    http-request deny deny_status 429 if is_gptbot backend_degraded { sc_http_req_rate(0) gt 5 }

    # Normal limits if healthy
    http-request deny deny_status 429 if is_gptbot backend_healthy { sc_http_req_rate(0) gt 20 }

    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    server web1 192.168.1.10:80 check inter 5s
    server web2 192.168.1.11:80 check inter 5s
    server web3 192.168.1.12:80 check inter 5s
```

The `nbsrv()` function returns count of healthy servers in backend pool. Rules adjust crawler limits:
- All servers down: Return 503, block crawlers
- One server up: Limit crawlers to 5 req/min
- Two+ servers up: Allow normal 20 req/min

This prioritizes human traffic during infrastructure issues while resuming crawler access when capacity permits.

## Licensing Agreement Enforcement

Publishers with usage-based licensing agreements requiring precise crawler control implement contract terms through **HAProxy**:

```haproxy
frontend web_frontend
    # OpenAI contract: 50 GB/month, max 20 req/min
    acl is_gptbot hdr_sub(User-Agent) -i GPTBot

    # Track bandwidth (bytes per second, convert to MB/month)
    stick-table type string len 64 size 10k expire 2592000s store bytes_out_rate(2592000s)
    http-request track-sc0 str(gptbot-monthly),req.hdr(User-Agent) if is_gptbot

    # 50 GB = 53687091200 bytes
    http-request deny deny_status 402 if is_gptbot { sc_bytes_out_rate(0) gt 53687091200 }

    # Request rate limit
    stick-table type string len 64 size 10k expire 60s store http_req_rate(60s)
    http-request track-sc1 str(gptbot-rate),req.hdr(User-Agent) if is_gptbot
    http-request deny deny_status 429 if is_gptbot { sc_http_req_rate(1) gt 20 }

    default_backend web_servers
```

The monthly bandwidth cap uses 2,592,000-second (30-day) stick table expiry, tracking cumulative bytes transferred. Once **GPTBot** exceeds 50 GB in rolling 30-day window, requests receive HTTP 402 (Payment Required) status, signaling billing overage.

Logging these enforcement events provides billing documentation:

```haproxy
frontend web_frontend
    # ... rate limiting rules ...

    # Log rate limit denials
    http-request capture req.hdr(User-Agent) len 128
    http-request set-var(txn.rate_exceeded) bool(true) if is_gptbot { sc_http_req_rate(1) gt 20 }
    http-response set-header X-Rate-Limit-Exceeded true if { var(txn.rate_exceeded) }

    log-format "%ci:%cp [%tr] %ft %b/%s %TR/%Tw/%Tc/%Tr/%Ta %ST %B %CC %CS %tsc %ac/%fc/%bc/%sc/%rc %sq/%bq %hr %hs %{+Q}r %[capture.req.hdr(0)] rate_exceeded=%[var(txn.rate_exceeded)]"
```

This custom log format includes rate limit exceeded flag, enabling post-processing scripts to generate monthly usage reports:

```bash
#!/bin/bash
# Generate GPTBot usage report
grep 'GPTBot' /var/log/haproxy.log | \
  awk '{ bytes+=$10 } END { print "Total GPTBot bandwidth: " bytes/1024/1024/1024 " GB" }'

grep 'rate_exceeded=true' /var/log/haproxy.log | \
  awk '{ print $1, $2 }' | \
  uniq -c > gptbot_throttle_events.txt
```

## Monitoring and Observability

**HAProxy** integrates with monitoring systems via stats socket, Prometheus exporter, and syslog:

```haproxy
global
    stats socket /var/run/haproxy.sock mode 660 level admin
    stats timeout 30s

    # Prometheus metrics endpoint
    stats bind-process 1
    stats socket ipv4@127.0.0.1:9101 level admin expose-fd listeners

frontend stats
    bind *:8404
    http-request use-service prometheus-exporter if { path /metrics }
    stats enable
    stats uri /stats
    stats refresh 10s
```

Query stick table contents via stats socket:

```bash
echo "show table web_frontend" | socat stdio /var/run/haproxy.sock
```

This displays current entries in stick tables, showing which crawlers are being tracked and their current request rates.

**Prometheus** queries for crawler metrics:

```promql
# GPTBot requests per second
rate(haproxy_frontend_http_requests_total{user_agent="GPTBot"}[5m])

# GPTBot rate limit denials
rate(haproxy_frontend_denied_requests_total{user_agent="GPTBot",reason="rate_limit"}[5m])

# Crawler bandwidth consumption
rate(haproxy_frontend_bytes_out_total{user_agent="GPTBot"}[1h])
```

Grafana dashboards visualize these metrics, alerting when crawler traffic exceeds expected patterns or licensing agreement thresholds.

## Frequently Asked Questions

### Can HAProxy differentiate crawlers if they use the same IP ranges?

Yes, via user-agent strings. **HAProxy** inspects HTTP headers at application layer, distinguishing **GPTBot** from **ClaudeBot** even if both originate from overlapping cloud provider IP ranges. Combine user-agent ACLs with IP validation to prevent spoofing while enabling granular per-crawler controls.

### Does HAProxy rate limiting work with CDN platforms like Cloudflare?

Yes, but ensure **HAProxy** sees actual crawler IPs via `X-Forwarded-For` or CDN-specific headers. Configure **HAProxy** to trust CDN IP ranges and extract client IPs from forwarded headers. Rate limits then apply to original crawler IPs rather than CDN edge IPs.

### How do I test HAProxy rate limiting without deploying to production?

Use **HAProxy** in a local Docker container with test configuration. Send requests via curl with different user-agents and rates, observing 429 responses when limits are exceeded. Verify stick table contents via stats socket to confirm tracking works as intended before promoting to production.

### Can I implement graduated rate limits that slow crawlers instead of blocking them?

**HAProxy** doesn't support TCP-level slow-down, but you can use tarpit directive to delay response:

```haproxy
http-request tarpit if is_gptbot { sc_http_req_rate(0) gt 20 }
```

This holds the connection open without responding, causing crawler to wait. However, hard denials (429 status) are clearer and allow crawlers to implement backoff.

### How do HAProxy rate limits interact with robots.txt crawl-delay?

Independently. Robots.txt is advisory; crawlers can ignore `Crawl-delay`. **HAProxy** enforces limits regardless of crawler cooperation. Use both: robots.txt requests politeness, **HAProxy** guarantees compliance. If a crawler respects robots.txt delays, it stays within **HAProxy** limits naturally.

## Conclusion

**HAProxy** provides production-grade crawler rate limiting that far exceeds robots.txt capabilities, enabling publishers to enforce licensing agreement terms, protect infrastructure during high-traffic events, and differentiate treatment of various AI crawlers based on business relationships. Combining user-agent detection, IP validation, time-based rules, content-type filtering, and backend-health awareness creates sophisticated policies matching real-world publisher needs. Stick tables, logging, and monitoring integration deliver the observability necessary for usage-based billing and compliance verification. Publishers pursuing [AI crawler monetization](legal-publisher-ai-licensing.html) or managing crawlers alongside human traffic benefit from **HAProxy**'s flexibility, especially in environments where simple robots.txt controls prove insufficient against aggressive or non-compliant crawlers.

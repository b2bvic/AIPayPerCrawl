---
title:: DNS-Level AI Crawler Blocking: Preventing Training Bots at the Network Edge
description:: Implement DNS filtering and edge network controls to block AI crawlers before they reach your origin servers, reducing infrastructure costs and enforcing access policies at scale.
focus_keyword:: DNS-level AI crawler blocking
category:: ai-monetization
author:: Victor Valentine Romo
date:: 2026.02.08
---

# DNS-Level AI Crawler Blocking: Preventing Training Bots at the Network Edge

Web server rate limiting and robots.txt directives operate at the application layer—AI crawlers reach your infrastructure, consume bandwidth, generate logs, and only then encounter access controls. By that point, they've already imposed costs. **DNS-level blocking** intervenes earlier, preventing unwanted bot traffic from ever reaching your servers by returning non-routable responses or blocking resolution entirely for identified crawler IP ranges.

This approach is particularly effective for publishers using **CDN (Content Delivery Network)** infrastructure or managing their own authoritative DNS servers. By filtering AI crawler traffic at the network edge, you eliminate infrastructure costs entirely for blocked requests, reduce log noise, and enforce policies consistently across all properties without per-server configuration.

This guide explains DNS-based blocking mechanisms, implementation strategies for major platforms (**Cloudflare**, **AWS Route53**, **self-hosted DNS**), and the trade-offs between aggressive blocking and preserving licensing negotiation flexibility.

## Understanding DNS Resolution and Traffic Flow

When an AI crawler attempts to access your website, several layers of networking infrastructure come into play before the request reaches your origin servers:

**Standard resolution flow:**

1. **Crawler queries DNS**: GPTBot queries DNS for `example.com`
2. **DNS server responds**: Returns IP address `203.0.113.50`
3. **Crawler connects to IP**: Opens TCP connection to `203.0.113.50:443`
4. **Request reaches server**: Your web server processes the HTTP request

DNS-level blocking intercepts this flow at step 2—manipulating the DNS response to prevent crawlers from ever connecting to your infrastructure.

### DNS Response Manipulation Strategies

**Strategy 1: Return NXDOMAIN**

The DNS server responds with "Non-Existent Domain" error, claiming the domain doesn't exist.

**Effect**: Crawler receives an error before attempting connection. Most crawlers will retry periodically but won't hammer your servers if DNS consistently returns NXDOMAIN.

**Limitation**: This is an aggressive tactic that can appear suspicious (why does a legitimate domain suddenly not exist?). Use only for completely unwanted crawlers, not those you might negotiate with later.

**Strategy 2: Return localhost (127.0.0.1)**

The DNS server returns `127.0.0.1`, redirecting the crawler to its own machine.

**Effect**: Crawler attempts to connect to itself, fails, and typically backs off without further resource consumption on your end.

**Advantage**: Less suspicious than NXDOMAIN—the domain "exists" but happens to resolve to localhost.

**Strategy 3: Return blackhole IP**

The DNS server returns an IP address that routes to nowhere—a reserved non-routable address like `0.0.0.0` or a sinkhole you control.

**Effect**: Crawler connects to a null endpoint. Connection times out or hangs indefinitely.

**Advantage**: You can log connection attempts to the sinkhole for monitoring purposes while imposing maximum cost on the crawler (connection timeouts waste their resources).

**Strategy 4: Selective resolution based on client IP**

The DNS server identifies the requester's IP address and returns different responses based on allow/block lists.

**Effect**: Legitimate users and desired bots (search engines) get real IP addresses. Blocked AI crawlers get localhost or NXDOMAIN.

**Advantage**: Granular control—block specific bots while allowing others.

**Technical requirement**: Requires DNS server that supports client subnet awareness and conditional responses (most modern authoritative DNS servers support this).

## Implementing DNS-Level Blocking on Cloudflare

**Cloudflare** is the most popular edge network provider for mid-to-large publishers, handling DNS resolution and CDN caching. Their firewall rules and DNS policies enable sophisticated bot blocking without touching origin servers.

### Method 1: Cloudflare Firewall Rules

Cloudflare's firewall operates after DNS resolution but before requests reach your origin—technically not DNS-level but "edge-level," achieving similar traffic filtering effects.

**Implementation:**

1. Log into Cloudflare dashboard
2. Navigate to **Security > WAF > Firewall rules**
3. Create rule with these parameters:

**Rule name**: Block AI Training Crawlers

**Expression**:
```
(http.user_agent contains "GPTBot") or
(http.user_agent contains "ClaudeBot") or
(http.user_agent contains "Google-Extended") or
(http.user_agent contains "CCBot") or
(http.user_agent contains "Bytespider")
```

**Action**: Block (or Challenge with CAPTCHA)

**Result**: Crawler receives 403 Forbidden or CAPTCHA challenge without reaching your origin servers.

**Cost savings**: Cloudflare doesn't bill for blocked requests—you pay only for successful requests that reach your origin.

### Method 2: Cloudflare DNS Firewall (Enterprise Feature)

For Enterprise customers, Cloudflare offers DNS-level filtering that blocks resolution entirely.

**Implementation**:

1. Contact Cloudflare support to enable DNS Firewall
2. Upload list of IP ranges associated with unwanted AI crawlers
3. Configure resolution policy: Return NXDOMAIN or custom IP for blocked IPs

**Advantage**: Blocks traffic before any HTTP processing, minimizing edge network load.

**Limitation**: Requires Enterprise plan (typically $200+/month minimum).

### Method 3: Cloudflare Workers for Conditional DNS Responses

For advanced use cases, deploy a **Cloudflare Worker** that intercepts requests and implements custom blocking logic.

**Worker script example**:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || ''
  const clientIP = request.headers.get('CF-Connecting-IP')

  // Block known AI training crawlers
  const blockedBots = [
    'GPTBot', 'ClaudeBot', 'Google-Extended',
    'CCBot', 'Bytespider', 'anthropic-ai'
  ]

  for (const bot of blockedBots) {
    if (userAgent.includes(bot)) {
      return new Response('Access Denied', {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'text/plain',
          'X-Block-Reason': 'AI Training Crawler'
        }
      })
    }
  }

  // If not blocked, fetch from origin
  return fetch(request)
}
```

**Deployment**:

1. Create Worker in Cloudflare dashboard
2. Deploy script above
3. Add Worker route: `*example.com/*`

**Result**: Worker executes before every request, blocking crawlers at the edge with custom logic.

**Cost**: Workers pricing starts at $5/month for 10M requests.

## Implementing DNS-Level Blocking on AWS Route53

**AWS Route53** provides authoritative DNS with granular control over resolution policies. For publishers hosting on AWS infrastructure, Route53 enables sophisticated geo-based and subnet-based routing.

### Method 1: Route53 Geolocation Routing + Blackhole

**Concept**: AI crawlers typically operate from specific cloud provider networks (AWS, GCP, Azure data centers). Use Route53's geolocation routing to return blackhole IPs for requests originating from known crawler IP ranges.

**Implementation**:

1. Create Route53 hosted zone for your domain
2. Create multiple A records for the same hostname with different geolocation policies

**A Record 1 (Default)**:
- **Name**: `www.example.com`
- **Type**: A
- **Value**: `203.0.113.50` (your real server)
- **Routing policy**: Default

**A Record 2 (AI Crawler ASNs)**:
- **Name**: `www.example.com`
- **Type**: A
- **Value**: `127.0.0.1` (localhost blackhole)
- **Routing policy**: Geoproximity or Custom (requires Advanced configuration)

**Limitation**: Route53 doesn't natively support routing based on ASN (Autonomous System Number). You need to approximate using geolocation—route requests from specific AWS regions to blackhole IPs.

### Method 2: Route53 + AWS WAF

More sophisticated: Combine Route53 with **AWS WAF (Web Application Firewall)** for subnet-aware filtering.

**Architecture**:

1. Route53 resolves to **CloudFront distribution**
2. CloudFront uses **AWS WAF** to filter requests by IP, user-agent, or rate limits
3. Only allowed traffic reaches your **ALB (Application Load Balancer)** or **EC2 instances**

**AWS WAF Rule Configuration**:

```json
{
  "Name": "BlockAICrawlers",
  "Priority": 1,
  "Statement": {
    "OrStatement": {
      "Statements": [
        {
          "ByteMatchStatement": {
            "FieldToMatch": { "Type": "HEADER", "Data": "User-Agent" },
            "TextTransformations": [{ "Priority": 0, "Type": "LOWERCASE" }],
            "PositionalConstraint": "CONTAINS",
            "SearchString": "gptbot"
          }
        },
        {
          "ByteMatchStatement": {
            "FieldToMatch": { "Type": "HEADER", "Data": "User-Agent" },
            "SearchString": "claudebot"
          }
        },
        {
          "IPSetReferenceStatement": {
            "Arn": "arn:aws:wafv2:us-east-1:123456789012:regional/ipset/ai-crawler-ips/a1b2c3d4"
          }
        }
      ]
    }
  },
  "Action": { "Block": {} }
}
```

**IP Set**: Maintain an IP Set containing known AI crawler IP ranges (obtain from crawler documentation or community-maintained lists).

**Result**: Requests matching user-agent patterns or IP sets get blocked at the edge before consuming CloudFront bandwidth.

**Cost**: AWS WAF pricing is $5/month per rule + $1 per million requests evaluated. For high-traffic sites, this can become expensive; weigh against bandwidth savings.

## Self-Hosted DNS Blocking with BIND

Publishers running their own authoritative DNS servers (typically via **BIND**, **PowerDNS**, or **Knot DNS**) have maximum control over resolution behavior.

### BIND Configuration for Conditional Responses

**BIND (Berkeley Internet Name Domain)** is the most common open-source DNS server. Configure it to return different responses based on client IP addresses.

**BIND configuration example** (`/etc/bind/named.conf.local`):

```
// Define ACL for AI crawler IP ranges
acl "ai_crawlers" {
    20.171.0.0/16;     // OpenAI GPTBot
    160.79.104.0/23;   // Anthropic ClaudeBot
    23.98.0.0/16;      // Additional ranges
};

// Zone for your domain
zone "example.com" {
    type master;
    file "/etc/bind/zones/db.example.com";

    // Alternate view for AI crawlers
    allow-query { !ai_crawlers; any; };
};

// Separate view returning blackhole for crawlers
view "blocked_crawlers" {
    match-clients { ai_crawlers; };

    zone "example.com" {
        type master;
        file "/etc/bind/zones/db.example.com.blackhole";
    };
};

view "default" {
    match-clients { any; };

    zone "example.com" {
        type master;
        file "/etc/bind/zones/db.example.com";
    };
};
```

**Blackhole zone file** (`/etc/bind/zones/db.example.com.blackhole`):

```
$TTL 300
@   IN  SOA  ns1.example.com. admin.example.com. (
        2026020801 ; Serial
        3600       ; Refresh
        1800       ; Retry
        604800     ; Expire
        300 )      ; Negative Cache TTL

@       IN  NS   ns1.example.com.
@       IN  A    127.0.0.1
www     IN  A    127.0.0.1
*       IN  A    127.0.0.1
```

**Effect**: AI crawlers querying DNS receive `127.0.0.1` for all subdomains. Legitimate users receive real IP addresses from the standard zone file.

**Maintenance burden**: You must keep the `ai_crawlers` ACL updated with current IP ranges—monitor crawler documentation and community sources.

### Response Policy Zones (RPZ) for Dynamic Blocking

**RPZ** is a BIND feature that allows dynamic DNS filtering based on real-time threat feeds.

**Implementation**:

1. Create RPZ zone file listing blocked domains/IPs
2. Configure BIND to apply RPZ policies

**BIND RPZ configuration**:

```
options {
    response-policy {
        zone "rpz.example.com";
    };
};

zone "rpz.example.com" {
    type master;
    file "/etc/bind/zones/db.rpz.example.com";
};
```

**RPZ zone file** (`/etc/bind/zones/db.rpz.example.com`):

```
$TTL 300
@   IN  SOA  ns1.example.com. admin.example.com. (
        2026020801 ; Serial
        3600       ; Refresh
        1800       ; Retry
        604800     ; Expire
        300 )      ; Negative Cache TTL

@       IN  NS   ns1.example.com.

// Block resolution for specific client IPs (crawler ranges)
32.20.171.0.0.rpz-client-ip     CNAME   rpz-drop.
32.160.79.104.0.rpz-client-ip   CNAME   rpz-drop.
```

**Result**: DNS queries from IPs in the specified ranges receive no response (dropped), causing crawler timeouts.

**Advantage**: RPZ zones can be updated dynamically without reloading entire BIND configuration—ideal for responding to new crawler IPs quickly.

## DNS Sinkholing: Honeypot Alternative

Instead of blocking outright, route AI crawler traffic to a **sinkhole server** that logs requests and returns minimal responses without actual content.

**Architecture**:

1. DNS returns sinkhole IP (`192.0.2.1` - documentation range, non-routable)
2. Sinkhole server listens on that IP, logs connections, returns generic 200 OK with minimal HTML
3. Crawler receives "successful" response with no useful content

**Sinkhole server (Nginx)**:

```nginx
server {
    listen 192.0.2.1:80;
    listen 192.0.2.1:443 ssl;

    ssl_certificate /path/to/dummy-cert.pem;
    ssl_certificate_key /path/to/dummy-key.pem;

    access_log /var/log/nginx/sinkhole-access.log;

    location / {
        default_type text/html;
        return 200 '<html><body>Content Unavailable</body></html>';
    }
}
```

**Advantages**:

- **Intelligence gathering**: Log crawler behavior without exposing real content
- **Less aggressive**: Crawler doesn't perceive it's being blocked (no errors), may not escalate evasion tactics
- **Detection**: If crawler persists despite receiving no useful content, confirms it's not a legitimate bot

**Disadvantages**:

- Requires maintaining sinkhole infrastructure
- Doesn't eliminate all costs (minimal server resources consumed)

## Trade-Offs: Aggressive Blocking vs. Licensing Optionality

DNS-level blocking is a strong signal: "We don't want your crawlers here." This creates strategic considerations for licensing negotiations.

### Scenario 1: Complete Block (NXDOMAIN, Localhost)

**Message sent**: "Your bots are unwelcome. We will not provide training data."

**Negotiation position**: Strong if you have high-value, unique content. You're demonstrating willingness to withhold access entirely, forcing the AI company to negotiate licensing terms.

**Risk**: If they don't value your content enough to negotiate, you've eliminated any monetization pathway. Also may poison future relationships—AI companies could retaliate by deprioritizing your content in model outputs or excluding you from partnership opportunities.

### Scenario 2: Rate Limiting (Slow Response, Not Block)

**Message sent**: "Access is allowed but constrained. We're managing infrastructure costs and preserving licensing optionality."

**Negotiation position**: Moderate. You've demonstrated you control access and track usage, but haven't taken adversarial stance. Room for constructive licensing discussions.

**Implementation**: DNS returns real IP, but web server applies aggressive rate limiting via nginx or firewall rules (covered in [crawl-delay directives guide](#)).

### Scenario 3: Tiered Access (Allow Some Bots, Block Others)

**Message sent**: "We differentiate between documented, respectful crawlers and aggressive/undocumented scrapers."

**Negotiation position**: Most flexible. You maintain relationships with major AI companies (OpenAI, Anthropic, Google) while protecting against indiscriminate scraping.

**Implementation**: DNS-level allow-list for known crawler IP ranges, block everything else.

**Recommended strategy for most publishers**: Start with tiered access, escalate to complete blocking only for non-compliant crawlers or if licensing negotiations fail.

## Monitoring DNS-Level Blocking Effectiveness

Implementing blocks is half the battle. Verifying they work and don't inadvertently block legitimate traffic requires monitoring.

### BIND Query Logging

Enable BIND's query log to track blocked resolution attempts:

**BIND configuration**:

```
logging {
    channel query_log {
        file "/var/log/bind/query.log" versions 5 size 10m;
        severity info;
        print-time yes;
        print-category yes;
    };

    category queries { query_log; };
};
```

**Analyzing logs**:

```bash
# Extract queries from AI crawler IPs
grep -E "20\.171\.|160\.79\.104\." /var/log/bind/query.log | \
  awk '{print $1, $2, $3}' | \
  sort | uniq -c

# Output shows how many blocked queries occurred
```

### Cloudflare Analytics

Cloudflare dashboard provides bot traffic analytics:

1. Navigate to **Analytics > Traffic**
2. Filter by **Bot traffic** category
3. Review **Blocked requests** breakdown by user-agent

**Key metrics**:

- **Total blocked requests**: Volume of traffic you're not paying for
- **Bandwidth saved**: Calculate as (blocked requests × avg response size)
- **Top blocked bots**: Identify which crawlers are most aggressive

### Testing DNS Resolution

Verify your DNS blocking works correctly for specific IPs:

**Command-line test**:

```bash
# Test resolution from your IP (should return real IP)
dig @your-dns-server.com example.com +short

# Test resolution as if from GPTBot IP (should return localhost or NXDOMAIN)
dig @your-dns-server.com example.com +subnet=20.171.45.0/24 +short
```

The `+subnet` flag simulates queries from specific client subnets (requires EDNS Client Subnet support).

**Expected results**:

- Your IP: `203.0.113.50` (real server)
- GPTBot IP: `127.0.0.1` (blackhole) or `NXDOMAIN` error

## False Positive Risk Management

DNS-level blocking is blunt. Misconfiguration can block legitimate traffic. Safeguards:

### 1. Exempt Critical Services

Never block IP ranges that might include:

- **Search engine crawlers**: Googlebot, Bingbot (separate from Google-Extended)
- **Monitoring services**: Uptime monitors, your own synthetic testing
- **CDN health checks**: If using a CDN, their health check IPs must resolve correctly

**Implementation**: Maintain allow-list that overrides block-list.

**BIND example**:

```
acl "critical_allow_list" {
    66.249.64.0/19;   // Googlebot
    207.46.0.0/16;    // Bingbot
    // Add your monitoring services
};

view "critical_services" {
    match-clients { critical_allow_list; };
    // Always return real IPs
};
```

### 2. Staged Rollout

Don't deploy DNS blocking globally immediately:

1. **Week 1**: Log only (track what would be blocked)
2. **Week 2**: Block unknown crawlers, allow documented AI bots
3. **Week 3**: Add documented AI bots to block list if desired
4. **Monitor throughout**: Watch for unintended traffic drops

### 3. Escape Hatch

Maintain a bypass mechanism for emergency access restoration:

- **Special header**: `X-DNS-Bypass: secret-key` bypasses blocking
- **Temporary allow-list**: Quickly add IPs if legitimate service gets blocked
- **DNS TTL**: Keep TTL low (300 seconds) during rollout so changes propagate quickly

## Frequently Asked Questions

**Q: Can AI crawlers evade DNS-level blocking by using alternative DNS resolvers?**

Partially. If you block at your authoritative DNS server, crawlers can't evade by using different recursive resolvers—all resolvers ultimately query your authoritative server. However, crawlers could cache previous resolutions or hard-code your IP addresses to bypass DNS entirely. This requires more sophistication but is possible.

**Q: Will DNS blocking hurt my SEO?**

Not if implemented correctly. Ensure you explicitly allow Googlebot, Bingbot, and other search crawler IP ranges. DNS blocking targets specific AI training crawlers, not search engines. If you accidentally block search crawlers, your site will disappear from search results within days—monitor carefully during rollout.

**Q: How do I keep AI crawler IP ranges updated?**

**Option 1**: Subscribe to community-maintained blocklists (GitHub repositories tracking AI crawler IPs). **Option 2**: Automate scraping of AI company documentation pages where they publish IP ranges. **Option 3**: Maintain your own list based on server log analysis (identify IPs with AI crawler user-agents, add to block list).

**Q: Can I use DNS blocking and robots.txt together?**

Yes, they're complementary. **Robots.txt** signals policy ("we prefer you don't crawl"), **DNS blocking** enforces it ("you physically cannot reach our servers"). Start with robots.txt as a courtesy; escalate to DNS blocking if ignored.

**Q: What's the cost difference between DNS blocking and server-side rate limiting?**

**DNS blocking**: Zero per-request cost (blocked requests don't reach your infrastructure). **Server-side rate limiting**: Still consumes bandwidth for connection establishment, SSL handshake, and request processing before being rate-limited. For high-volume crawler traffic, DNS blocking can save hundreds or thousands of dollars monthly in CDN/bandwidth costs.

**Q: Does DNS blocking create legal liability for discriminatory access restrictions?**

Unlikely. Website owners generally have the right to control access to their property. Blocking specific bots is not discriminatory in a legal sense (bots aren't a protected class). However, blocking based on geographic regions could trigger international trade or anti-discrimination concerns in some jurisdictions. Consult counsel if blocking by country/region.

**Q: Can I temporarily block AI crawlers during licensing negotiations as leverage?**

Yes, and this is a common negotiation tactic. Block crawler access, then approach the AI company: "We've implemented access restrictions. We're open to discussing licensing terms that would restore access." This demonstrates you control a resource they want, strengthening your position. However, use carefully—overly aggressive tactics can sour relationships.
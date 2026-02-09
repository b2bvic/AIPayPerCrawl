---
title:: What Is a User-Agent String: Identifying AI Bots Accessing Your Content
description:: User-agent strings identify web clients including AI crawlers. Learn how to detect GPTBot, Claude-Web, and other AI bots via server logs and analytics.
focus_keyword:: what is user agent string
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# What Is a User-Agent String: Identifying AI Bots Accessing Your Content

**A user-agent string** is text identifying the software making HTTP requests to web servers—revealing whether visitors are human browsers, search engine crawlers, or AI training bots. Every web request includes a User-Agent header containing information about client type, version, and operating system. Publishers analyzing user-agent strings distinguish **ChatGPT's GPTBot** from **Google's crawler** from **legitimate users**, enabling targeted access control, usage monitoring, and AI bot monetization strategies.

The HTTP specification requires clients identify themselves via User-Agent headers, though compliance is voluntary—bots can lie or omit identification. Responsible bots including search engines and major AI companies use descriptive identifiers helping publishers understand traffic sources. For publishers implementing pay-per-crawl models or blocking unauthorized AI access, user-agent analysis provides the starting point for identifying which bots consume content and at what volume.

## User-Agent String Structure and Components

User-agent strings follow loosely standardized formats encoding client characteristics.

**General structure**:

```
User-Agent: <product>/<version> <comment>
```

**Real-world examples**:

**Chrome browser** (human user):

```
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

**Googlebot** (search crawler):

```
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```

**GPTBot** (OpenAI training):

```
Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot
```

### Key Components

**Product name**: Primary identifier (Chrome, Googlebot, GPTBot)

**Version**: Software version number

**Comments**: Parenthetical details about operating system, compatibility, rendering engine

**Contact URL**: Link to bot documentation (common for crawlers)

Parsers extract product name to identify client type.

## AI Bot User-Agent Strings (2026 Directory)

Major AI companies operate identifiable crawlers with documented user-agent strings.

### OpenAI

**GPTBot** (training data collection):

```
User-Agent: GPTBot/1.0 (+https://openai.com/gptbot)
```

Shortened form sometimes seen:

```
User-Agent: GPTBot
```

**ChatGPT-User** (ChatGPT browsing feature):

```
Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot
```

### Anthropic

**Claude-Web**:

```
User-Agent: Claude-Web/1.0
```

Or with details:

```
Mozilla/5.0 (compatible; Claude-Web/1.0; +https://www.anthropic.com)
```

### Google

**Google-Extended** (training, distinct from search indexing):

```
User-Agent: Google-Extended
```

Or:

```
Mozilla/5.0 (compatible; Google-Extended)
```

**Standard Googlebot** (search indexing, not training):

```
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```

### Meta

**FacebookBot** (includes AI training):

```
User-Agent: facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
```

Newer Meta AI crawler:

```
User-Agent: Meta-ExternalAgent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)
```

### Apple

**Applebot-Extended** (Apple Intelligence training):

```
User-Agent: Mozilla/5.0 (compatible; Applebot-Extended/0.1; +http://www.apple.com/go/applebot)
```

**Standard Applebot** (search indexing):

```
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)
```

### Perplexity

**PerplexityBot**:

```
User-Agent: PerplexityBot/1.0 (+https://docs.perplexity.ai/docs/perplexity-bot)
```

### Cohere

**cohere-ai**:

```
User-Agent: cohere-ai/1.0
```

### Common Crawl

**CCBot** (dataset used by many AI companies):

```
User-Agent: CCBot/2.0 (https://commoncrawl.org/faq/)
```

### Bytedance

**Bytespider** (TikTok/Bytedance AI):

```
User-Agent: Bytespider
```

### Undisclosed / Unknown Bots

Many AI training operations use generic user-agents or impersonate browsers to evade blocking. These appear as standard Chrome/Firefox/Safari and are harder to distinguish from legitimate users without behavioral analysis.

## Detecting AI Bots via Server Logs

Publishers analyze web server logs to identify AI crawler activity.

### Log File Locations

**Apache**: `/var/log/apache2/access.log` or `/var/log/httpd/access_log`

**Nginx**: `/var/log/nginx/access.log`

**Cloudflare**: Export via dashboard or API

**Hosting platforms**: Check control panel for log access

### Log Entry Structure

Standard Combined Log Format:

```
192.0.2.1 - - [08/Feb/2026:10:15:30 +0000] "GET /article/12345 HTTP/1.1" 200 15234 "-" "GPTBot/1.0"
```

Components:
- IP address: 192.0.2.1
- Timestamp: 08/Feb/2026:10:15:30
- Request: GET /article/12345
- Status: 200 (success)
- Bytes transferred: 15234
- Referrer: - (none)
- User-Agent: GPTBot/1.0

### Filtering AI Bot Traffic

**Grep command** extracting GPTBot requests:

```bash
grep "GPTBot" /var/log/nginx/access.log
```

Multiple bots:

```bash
grep -E "GPTBot|Claude-Web|CCBot|Google-Extended" /var/log/nginx/access.log
```

Count requests per bot:

```bash
grep "GPTBot" /var/log/nginx/access.log | wc -l
```

Output:

```
1523
```

GPTBot made 1,523 requests.

### Analyzing Crawl Patterns

**Requests over time**:

```bash
grep "GPTBot" /var/log/nginx/access.log | awk '{print $4}' | cut -d: -f1-2 | uniq -c
```

Output:

```
 234 [08/Feb/2026:08
 456 [08/Feb/2026:09
 833 [08/Feb/2026:10
```

Shows GPTBot activity increasing through morning.

**Most accessed content**:

```bash
grep "GPTBot" /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10
```

Output:

```
  45 /article/ai-licensing
  32 /article/content-monetization
  28 /article/pay-per-crawl
```

Reveals which content AI bots retrieve most frequently—informing pricing and licensing strategy.

**Data volume consumed**:

```bash
grep "GPTBot" /var/log/nginx/access.log | awk '{sum+=$10} END {print sum/1024/1024 " MB"}'
```

Output:

```
234.5 MB
```

GPTBot transferred 234MB—relevant for bandwidth cost monitoring.

## Implementing User-Agent Blocking

Publishers block AI bots by filtering user-agent strings at web server or CDN level.

### Apache (.htaccess or httpd.conf)

Block GPTBot:

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} GPTBot [NC]
RewriteRule .* - [F,L]
```

Block multiple AI bots:

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (GPTBot|CCBot|Claude-Web|Google-Extended|Bytespider) [NC]
RewriteRule .* - [F,L]
```

**[NC]**: Case-insensitive matching
**[F]**: Forbidden (403 response)
**[L]**: Last rule, stop processing

### Nginx

Block in `nginx.conf` or site config:

```nginx
if ($http_user_agent ~* (GPTBot|CCBot|Claude-Web|Google-Extended)) {
    return 403;
}
```

Or serve specific message:

```nginx
if ($http_user_agent ~* (GPTBot|CCBot)) {
    return 402 "Content access requires licensing. Contact licensing@publisher.com";
}
```

### Cloudflare WAF

Create firewall rule in Cloudflare dashboard:

**Field**: User Agent
**Operator**: contains
**Value**: GPTBot
**Action**: Block

Add multiple rules for different bots or use single rule with regex:

**Expression**:
```
(http.user_agent contains "GPTBot") or (http.user_agent contains "CCBot") or (http.user_agent contains "Claude-Web")
```

**Action**: Block

### Rate Limiting by User-Agent

Instead of blocking entirely, throttle AI bots:

**Nginx** rate limit:

```nginx
limit_req_zone $http_user_agent zone=bot_limit:10m rate=5r/s;

server {
    location / {
        if ($http_user_agent ~* (GPTBot|CCBot)) {
            set $is_bot 1;
        }
        
        limit_req zone=bot_limit burst=10 nodelay;
    }
}
```

Allows 5 requests/second with 10-request burst tolerance—sufficient for indexing but prevents aggressive scraping.

## User-Agent Spoofing and Evasion

User-agent blocking faces limitations since bots can lie about identity.

**Spoofing**: Bots send fake user-agent strings impersonating browsers:

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0
```

Appears as Chrome browser, actually a scraper.

**Detection methods**:

**Behavioral analysis**: Real browsers load CSS, JS, images; scrapers fetch only HTML. Monitor resource loading patterns.

**IP reputation**: Check source IPs against known bot datacenter ranges. Browser users connect from residential ISPs.

**TLS fingerprinting**: Browser TLS handshakes differ from Python requests or curl. Analyze connection characteristics.

**JavaScript challenges**: Serve content only after JS execution. Basic scrapers fail, browsers succeed.

**CAPTCHA**: Require human verification for suspicious traffic.

**Honeypot traps**: Invisible links only bots follow. Legitimate browsers don't see/click them.

Services like **Cloudflare Bot Management**, **DataDome**, and **PerimeterX** combine signals detecting spoofed bots.

## User-Agents and Pay-Per-Crawl Implementation

User-agent analysis enables pay-per-crawl monetization infrastructure (see [what-is-pay-per-crawl](what-is-pay-per-crawl.html)).

**Workflow**:

1. **Detect AI bots** via user-agent strings in server logs
2. **Block unauthorized bots** at web server/CDN
3. **Issue API keys** to licensed AI companies
4. **Whitelist authorized user-agents** or IP ranges
5. **Meter API requests** by user-agent for billing

**Example**: Publisher blocks GPTBot via nginx, then negotiates licensing with OpenAI. OpenAI receives API key, requests include custom user-agent:

```
User-Agent: GPTBot-Licensed/1.0 (key:abc123)
```

Publisher's API recognizes licensed agent, serves content, increments usage counter for billing.

**Differentiated pricing** by user-agent:

```python
pricing = {
    'GPTBot-Licensed': 0.10,      # OpenAI partnership rate
    'Claude-Web-Licensed': 0.05,   # Anthropic volume discount
    'PerplexityBot-Licensed': 0.15 # Premium RAG access
}

user_agent = request.headers.get('User-Agent')
charge = pricing.get(user_agent, 0.20)  # Default rate for unknown

increment_billing(client_id, charge)
```

## FAQ: User-Agent Strings and AI Bots

**Can publishers block all AI bots reliably using user-agent filtering?**

No—responsible bots identify themselves, but malicious scrapers spoof user-agents or omit identification. User-agent blocking catches compliant actors, missing sophisticated evaders. Layer with behavioral analysis, IP filtering, and authentication for comprehensive protection.

**Do AI companies change user-agent strings frequently?**

Major companies maintain stable user-agents—GPTBot, Claude-Web, Google-Extended have remained consistent. However, versioning updates occur (GPTBot/1.0 → GPTBot/1.1). Publishers should use substring matching (`contains "GPTBot"`) rather than exact strings to handle versioning.

**What's the difference between Googlebot and Google-Extended?**

**Googlebot**: Crawls for search indexing, drives referral traffic
**Google-Extended**: Crawls for AI training (Bard/Gemini), no traffic benefit

Publishers should allow Googlebot (preserve SEO), consider blocking Google-Extended (monetize training access).

**Can AI companies bypass user-agent blocks by using residential proxy networks?**

Yes—sophisticated operations route traffic through residential IPs with spoofed browser user-agents, appearing as legitimate users. Detection requires advanced bot management platforms analyzing behavioral signals beyond user-agent strings.

**Should publishers block Common Crawl (CCBot)?**

Depends on strategy:
- **Block**: Prevents many AI companies from accessing free training data (Common Crawl archives used widely)
- **Allow**: Supports research, archival projects, and AI companies lacking direct crawlers

Most publishers monetizing AI access block CCBot to force direct licensing negotiations.

**How do publishers verify bot user-agent authenticity?**

**Reverse DNS lookup**: Check if IP resolves to claimed company domain:

```bash
host 66.249.66.1
```

Output:

```
1.66.249.66.in-addr.arpa domain name pointer crawl-66-249-66-1.googlebot.com.
```

Confirms IP belongs to Google. Fake Googlebots won't pass verification.

**Forward DNS confirmation**: Resolve hostname back to IP confirming match.

## User-Agent Analysis as Revenue Intelligence

User-agent monitoring reveals which AI companies value your content, informing monetization strategy.

**High-volume crawlers** indicate strong content demand—prioritize licensing outreach to those companies.

**Crawl pattern analysis** shows which content AI bots retrieve most, guiding editorial investment toward high-AI-value topics.

**Temporal patterns** reveal crawl frequency changes—spikes might indicate model retraining cycles or RAG system launches.

**Competitive intelligence**: If competitors' content attracts more AI crawler activity, analyze their content strategy for insights.

Publishers implementing pay-per-crawl treat user-agent data as business intelligence—the foundation for pricing, negotiation leverage, and product development in AI content licensing markets.

For technical blocking implementation, see [what-is-robots-txt](what-is-robots-txt.html). For broader monetization frameworks, see [zero-to-pay-per-crawl-walkthrough](zero-to-pay-per-crawl-walkthrough.html).

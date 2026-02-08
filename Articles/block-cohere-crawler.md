---
title:: Block Cohere Crawler: Prevent AI Training Data Extraction
description:: Complete guide to blocking Cohere's cohere-ai crawler using robots.txt, server rules, and CDN configurations. Includes verification and monitoring strategies.
focus_keyword:: block cohere crawler
category:: ai-monetization
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Block Cohere Crawler: Prevent AI Training Data Extraction

**Cohere** operates a web crawler to collect training data for its enterprise-focused large language models. The **cohere-ai** crawler scrapes content from publisher domains without compensation, licensing agreements, or traffic reciprocity.

**Cohere's** business model targets enterprise AI deployments — custom models for corporations, embedding services for search applications, and specialized AI tools for business workflows. Your content trains models that **Cohere** sells to enterprise customers for tens of thousands of dollars annually.

Publishers receive nothing. No licensing fees. No referral traffic. No attribution in AI responses. The extraction is purely one-directional.

Blocking **Cohere's** crawler prevents this free data collection. Configuration is straightforward: robots.txt directives, server-level rules, or CDN blocks all work. **Cohere** respects robots.txt directives more consistently than [ByteSpider](/articles/bytespider-ignores-robots-txt.html) but less reliably than [GPTBot](/articles/gptbot-behavior-analysis.html).

---

## Understanding Cohere's Crawler

### cohere-ai User-Agent

**Cohere's** crawler identifies as:

```
cohere-ai
```

Some requests include extended format:

```
Mozilla/5.0 (compatible; cohere-ai)
```

The minimal user-agent string contrasts with more verbose identifiers from [GPTBot](/articles/gptbot-behavior-analysis.html) or [ClaudeBot](/articles/claudebot-crawler-profile.html). **Cohere** provides basic identification without documentation URLs or contact information in the user-agent string itself.

Documentation exists at **Cohere's** website but isn't linked from the crawler identifier. This makes troubleshooting less convenient than crawlers that embed documentation links.

### Crawl Behavior and Volume

**Cohere's** crawler operates at moderate volume relative to other AI crawlers:

| Publisher Size | Daily Cohere Requests | vs. GPTBot |
|---------------|----------------------|------------|
| Small (under 100K PV) | 10-50 | ~20% |
| Medium (100K-1M PV) | 50-200 | ~25% |
| Large (1M-10M PV) | 200-1,000 | ~20% |
| Enterprise (10M+ PV) | 1,000-5,000 | ~15% |

**Cohere** crawls less aggressively than market leaders, reflecting its enterprise focus rather than consumer-scale deployment. The company prioritizes quality over quantity — targeted crawling of business and technical content rather than broad web scraping.

### No Licensing or Payment Infrastructure

**Cohere** doesn't participate in content licensing marketplaces:
- No [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) integration
- No [RSL protocol](/articles/rsl-protocol-implementation-guide.html) support
- No public publisher licensing deals announced
- No API for negotiating content access terms

The absence of payment infrastructure indicates **Cohere** intends to extract training data without compensation. Enterprise AI companies with revenue-generating products can afford licensing. **Cohere** chooses not to build those systems.

---

## robots.txt Blocking

### Basic Directive

The simplest **Cohere** block:

```
User-agent: cohere-ai
Disallow: /
```

This instructs the crawler to avoid all paths on your domain. **Cohere** checks robots.txt before crawling and honors explicit disallow directives in most cases.

**Compliance rate:** Publisher reports suggest **Cohere** respects robots.txt approximately 85-90% of the time. Better than **ByteSpider** (near-zero compliance) but worse than **GPTBot** (99%+ compliance).

### Complete robots.txt Example

Comprehensive crawler management:

```
# Block Cohere AI training
User-agent: cohere-ai
Disallow: /

# Block other AI crawlers
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Disallow: /admin/
Disallow: /private/
```

This blocks AI training crawlers while preserving search engine access for traffic generation.

### Selective Directory Access

Grant **Cohere** access to commodity content while protecting premium material:

```
User-agent: cohere-ai
Allow: /blog/
Allow: /news/
Disallow: /research/
Disallow: /premium/
Disallow: /data/
Disallow: /
```

Explicit `Allow:` directives override the final `Disallow: /` for specific paths.

**Strategic use case:** Public marketing content benefits from AI distribution. Proprietary research, premium articles, and datasets warrant protection. Selective access captures both objectives.

---

## Server-Level Enforcement

### Nginx Configuration

Enforce blocks at web server layer:

```nginx
map $http_user_agent $block_cohere {
    default 0;
    ~*cohere-ai 1;
    ~*cohere 1;
}

server {
    if ($block_cohere) {
        return 403;
    }

    # Rest of configuration
}
```

This returns 403 Forbidden for **Cohere** crawler requests regardless of robots.txt compliance.

**Reload Nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Apache .htaccess

Block **Cohere** via `.htaccess` file:

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} cohere-ai [NC,OR]
RewriteCond %{HTTP_USER_AGENT} cohere [NC]
RewriteRule .* - [F,L]
```

The `[NC]` flag enables case-insensitive matching. The `[F]` flag returns 403 Forbidden. The `[L]` flag stops processing additional rules.

**Verify syntax:**

```bash
apachectl configtest
```

Changes take effect immediately without server restart.

### WordPress Plugin Method

WordPress users without server access can block via plugins:

**iThemes Security:**
1. Install plugin
2. Navigate to **Security > Settings > User Agents**
3. Add `cohere-ai` to banned list
4. Save configuration

**Wordfence:**
1. Install plugin
2. Navigate to **Firewall > Rate Limiting**
3. Create rule: Block user-agents containing "cohere"
4. Save and deploy

Plugin-based blocking works but adds overhead compared to server-level rules. Prefer server configuration when available.

---

## CDN and Cloud Blocking

### Cloudflare Custom Rules

Block at CDN edge for maximum efficiency:

1. Navigate to **Security > WAF > Custom Rules**
2. Create rule: `(http.user_agent contains "cohere-ai") or (http.user_agent contains "cohere")`
3. Action: Block
4. Deploy globally

**Cloudflare** edge blocking stops requests before they reach origin servers. Zero bandwidth consumed at origin. Zero server resources spent.

### Fastly VCL Configuration

**Fastly** users can block via VCL:

```vcl
if (req.http.User-Agent ~ "(?i)cohere") {
    error 403 "Forbidden";
}
```

The `(?i)` flag enables case-insensitive matching.

### AWS CloudFront

**CloudFront** users configure via Lambda@Edge or CloudFront Functions:

**CloudFront Function:**

```javascript
function handler(event) {
    var request = event.request;
    var userAgent = request.headers['user-agent'].value.toLowerCase();

    if (userAgent.includes('cohere')) {
        return {
            statusCode: 403,
            statusDescription: 'Forbidden'
        };
    }

    return request;
}
```

Deploy to **Viewer Request** event. All **Cohere** requests get blocked at edge locations before reaching origin.

---

## IP-Based Blocking

### Cohere IP Ranges

**Cohere** doesn't publish official IP ranges. Community-maintained lists compiled from publisher logs provide partial coverage:

```
35.203.0.0/16
35.247.0.0/16
34.102.0.0/16
```

These represent **Google Cloud Platform** ranges where **Cohere** operates infrastructure. IP blocking supplements user-agent detection but can't replace it entirely.

**Nginx IP blocking:**

```nginx
geo $cohere_ip {
    default 0;
    35.203.0.0/16 1;
    35.247.0.0/16 1;
    34.102.0.0/16 1;
}

server {
    if ($cohere_ip && $block_cohere) {
        return 403;
    }
}
```

**Caveat:** These ranges host many services beyond **Cohere**. IP-only blocking risks false positives. Combine IP detection with user-agent verification.

### Verify Legitimate Cohere Crawler

Confirm requests claiming **Cohere** identity actually originate from **Cohere**:

```bash
# Reverse DNS lookup
host 35.203.123.45
# Should resolve to google.com or googleapis.com domain

# Forward verification
dig +short <reversed-hostname>
# Should return original IP
```

**Cohere** operates on **GCP**. Legitimate requests resolve to Google infrastructure. Spoofed requests fail verification.

---

## Verification and Monitoring

### Check Server Logs

Verify block effectiveness through log analysis:

**Nginx:**

```bash
grep "cohere" /var/log/nginx/access.log | tail -50
```

**Apache:**

```bash
grep "cohere" /var/log/apache2/access.log | tail -50
```

**Expected result after blocking:** Zero successful (200) responses to content pages. Occasional robots.txt checks are normal. All content requests should show 403 responses.

### Test robots.txt Compliance

Verify **Cohere** honors your robots.txt:

```bash
curl -A "cohere-ai" https://yourdomain.com/test-page
```

If blocking works, this returns 403 (if server-level blocking) or empty response (if robots.txt-only and **Cohere** complies).

If you receive 200 and page content, blocks failed. Investigate:
- robots.txt syntax errors
- Server config not loaded
- CDN rules not deployed

### Monitor Crawl Activity Weekly

Track **Cohere** crawler activity over time:

```bash
#!/bin/bash
# Count Cohere requests last 7 days
grep "cohere" /var/log/nginx/access.log | wc -l
```

**Alert threshold:** More than 10 successful requests per week after implementing blocks suggests compliance failure or new crawler variants.

**Cloudflare Analytics:** Navigate to **Security > Events** and filter for "cohere" in user-agent string. Review request counts and block success rates.

---

## Why Block Cohere Specifically

### Enterprise AI Revenue Without Publisher Compensation

**Cohere** sells enterprise AI products at premium prices. **Command** language models, embedding services, and custom AI deployments generate millions in revenue. Training data extracted from publisher domains enables these products.

Publishers subsidize **Cohere's** enterprise sales. Your content trains models that corporations license for $50,000+ annually. **Cohere** captures that revenue. Publishers receive nothing.

### No Referral Traffic or Attribution

**Cohere's** products don't generate publisher traffic:
- Enterprise AI deployments operate behind corporate firewalls
- Embedding services power internal search — no public referrals
- Custom models serve private applications — no external links

Unlike search engines (which crawl and return traffic), **Cohere** crawls without reciprocal value. The extraction is purely one-way.

### Competitive Harm to Publishers Building AI Products

Publishers developing their own AI capabilities compete for training data. **Cohere** extracting your content for free creates competitive asymmetry:

**Your costs:**
- Infrastructure for content production
- Editorial staff salaries
- Content quality control
- Platform operation and hosting

**Cohere's costs:**
- Zero (they extract your content for free)

**Cohere** then competes with AI products you might build using the content you paid to create. Blocking prevents this competitive disadvantage.

---

## Strategic Considerations

### Enterprise Focus May Justify Differentiated Approach

**Cohere** targets enterprise customers rather than consumers. Some publishers conclude this warrants different treatment than consumer-focused AI companies.

**Arguments for allowing Cohere:**
- Enterprise AI adoption might increase B2B content demand
- Corporate users discovering your content through AI tools could lead to enterprise subscriptions
- **Cohere** might be more amenable to licensing conversations than consumer-focused companies

**Arguments for blocking Cohere:**
- Enterprise revenue makes licensing even more affordable for **Cohere**
- No evidence **Cohere** will voluntarily compensate publishers
- Enterprise AI abstracts content behind corporate walls — even less traffic than consumer AI

Most publishers conclude that enterprise focus strengthens the case for blocking, not weakens it. Enterprise AI companies can afford to license. Their refusal to do so is strategic choice, not financial constraint.

### Cohere May Build Licensing Systems

Some AI companies initially avoided licensing, then built payment systems after publisher pressure. **OpenAI** and **Anthropic** now participate in [licensing marketplaces](/articles/ai-content-licensing-models-comparison.html).

**Cohere** might follow. Publishers blocking now establish that content access requires negotiation. Publishers allowing free access establish precedent **Cohere** may expect to continue.

**Strategic positioning:** Block now, negotiate later. When **Cohere** builds licensing infrastructure, you're positioned to participate from a "content protection" stance rather than appearing to reverse previously granted access.

---

## Frequently Asked Questions

### Does Cohere respect robots.txt directives?

Mostly. Publisher reports indicate **Cohere** compliance rates around 85-90%. Better than **ByteSpider** (routine violations) but less reliable than **GPTBot** (near-perfect compliance). Server-level enforcement provides stronger protection than robots.txt alone.

### Will blocking Cohere affect my search engine rankings?

No. **Cohere** operates a specialized AI training crawler, not a search engine. Blocking **cohere-ai** doesn't affect **Google**, **Bing**, or other search crawlers. Your search rankings remain unchanged.

### Can I monetize Cohere crawler access through Pay-Per-Crawl?

Not currently. **Cohere** doesn't integrate with [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) or [RSL protocol](/articles/rsl-protocol-implementation-guide.html) systems. You can allow or block — monetization isn't an option with existing **Cohere** infrastructure.

### How do I verify blocked Cohere crawler requests?

Check server logs for **Cohere** user-agent strings: `grep "cohere" /var/log/nginx/access.log`. After implementing blocks, you should see only 403 (forbidden) responses or near-zero requests. Weekly monitoring confirms sustained effectiveness.

### What's Cohere's crawler volume compared to GPTBot?

**Cohere** generates approximately 15-25% of **GPTBot's** request volume. The crawler is less aggressive, reflecting **Cohere's** enterprise focus rather than consumer-scale deployment. Lower volume doesn't reduce strategic importance of blocking — enterprise AI products still extract significant value from training data.

### Should I block Cohere if I allow OpenAI or Anthropic?

If you license to **OpenAI** or **Anthropic** through [Pay-Per-Crawl systems](/articles/cloudflare-pay-per-crawl-setup.html), those crawlers compensate your content access. **Cohere** doesn't participate in payment systems. Consistent strategy: allow crawlers that pay, block crawlers that don't.

### Does blocking affect Cohere's embedding or search products?

Blocking prevents **Cohere** from training models on your content. If enterprises use **Cohere** embedding services to power internal search, those services won't surface your content unless their corporate users access it directly (not through **Cohere** crawling). Your content remains available to direct human access and compensating crawlers.

### Can Cohere bypass blocks by spoofing user-agents?

Theoretically possible but less common for established AI companies than for aggressive crawlers like **ByteSpider**. **Cohere** operates as a venture-backed enterprise AI company with reputation to maintain. Systematic robots.txt violations or user-agent spoofing creates legal and reputational risk they're unlikely to accept. Blocking through user-agent detection is generally effective for **Cohere**.

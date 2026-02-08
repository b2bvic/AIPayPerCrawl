title:: robots.txt for AI Crawlers: Complete Template and Configuration Guide
description:: Copy-paste robots.txt templates for managing AI crawlers. Block all, block selectively, or set up monetization-ready configurations with full explanations.
focus_keyword:: robots.txt ai crawlers template
category:: implementation
author:: Victor Valentine Romo
date:: 2026.02.07

# robots.txt for AI Crawlers: Complete Template and Configuration Guide

Your robots.txt file is the first conversation between your server and every AI crawler. It's also the weakest enforcement mechanism — a polite request that compliant crawlers honor and non-compliant ones ignore entirely. Understanding what robots.txt can and cannot do for AI crawler management separates effective publisher strategies from wishful thinking.

This guide provides copy-paste templates for every common AI crawler configuration. Use them as starting points, then layer [server-level enforcement](/articles/server-level-ai-bot-blocking.html) on top for crawlers that don't comply.

---

## The Reality of robots.txt for AI Crawlers

### What robots.txt Does

robots.txt is a voluntary protocol. When a crawler requests your site, it first fetches `/robots.txt` to check for directives. Compliant crawlers follow these directives. Non-compliant crawlers ignore them.

For AI crawlers, robots.txt compliance breaks into tiers:

| Tier | Crawlers | Compliance |
|------|----------|------------|
| Very High | [ClaudeBot](/articles/claudebot-crawler-profile.html), **Googlebot**, **Applebot** | Near 100% compliance |
| High | [GPTBot](/articles/gptbot-crawler-profile.html), **Amazonbot**, **CCBot** | Reliable compliance |
| Low | [PerplexityBot](/articles/perplexitybot-crawler-profile.html) | Disputed compliance |
| None | [Bytespider](/articles/bytespider-crawler-profile.html) | Ignores robots.txt |

For Tier 1 and 2 crawlers — the majority of monetizable AI traffic — robots.txt works. For Tier 3 and 4, you need [server-level blocking](/articles/nginx-ai-crawler-blocking.html) or [CDN rules](/articles/cloudflare-pay-per-crawl-setup.html).

### What robots.txt Cannot Do

- **Enforce compliance** — It's a suggestion, not a firewall
- **Remove existing data** — Content already crawled remains in training datasets
- **Differentiate content tiers** — Limited path-based granularity
- **Authenticate requests** — Cannot verify a crawler's identity
- **Set pricing** — robots.txt has no pricing fields ([RSL](/articles/rsl-protocol-implementation-guide.html) handles this)

robots.txt is necessary. It's not sufficient. Every template below should be paired with server-level enforcement for non-compliant crawlers.

---

## Template 1: Block All AI Crawlers

The nuclear option. Blocks every known AI training and search crawler.

```
# ============================================
# AI CRAWLER BLOCK — ALL AGENTS
# Updated: 2026.02
# ============================================

# OpenAI
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

# Anthropic
User-agent: ClaudeBot
Disallow: /

User-agent: ClaudeBot-User
Disallow: /

# Google AI Training
User-agent: Google-Extended
Disallow: /

# ByteDance
User-agent: Bytespider
Disallow: /

# Meta
User-agent: Meta-ExternalAgent
Disallow: /

# Amazon
User-agent: Amazonbot
Disallow: /

# Apple AI Training
User-agent: Applebot-Extended
Disallow: /

# Common Crawl (feeds all AI companies)
User-agent: CCBot
Disallow: /

# Perplexity
User-agent: PerplexityBot
Disallow: /

# Cohere
User-agent: cohere-ai
Disallow: /

# You.com
User-agent: YouBot
Disallow: /

# Mistral
User-agent: MistralBot
Disallow: /

# AI21
User-agent: AI2Bot
Disallow: /

# DeepSeek
User-agent: Deepseekbot
Disallow: /

# Diffbot
User-agent: Diffbot
Disallow: /

# Huawei Petal
User-agent: PetalBot
Disallow: /

# ============================================
# KEEP SEARCH ENGINES ALLOWED
# ============================================
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Yandex
Allow: /

# Default
User-agent: *
Allow: /
```

**When to use this template:** You want zero AI companies accessing your content for free and plan to negotiate licensing individually or activate [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) later.

**Limitation:** [Bytespider](/articles/bytespider-crawler-profile.html) ignores this. Add [server-level blocks](/articles/block-bytespider-nginx.html) for enforcement.

---

## Template 2: Block Training, Allow Search Retrieval

The [dual strategy](/articles/ai-search-vs-training-crawlers.html). Blocks permanent training data collection while allowing real-time search retrieval (which provides some attribution).

```
# ============================================
# AI TRAINING BLOCK — SEARCH ALLOWED
# Updated: 2026.02
# ============================================

# Block training crawlers
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: MistralBot
Disallow: /

User-agent: Deepseekbot
Disallow: /

User-agent: Diffbot
Disallow: /

# Allow search/retrieval crawlers
User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Keep traditional search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /
```

**When to use this template:** You want brand visibility in AI search results while preventing free model training.

---

## Template 3: Selective Access by Content Section

Allow AI crawlers to access commodity content while protecting premium sections.

```
# ============================================
# SELECTIVE AI ACCESS — PATH-BASED
# Updated: 2026.02
# ============================================

# OpenAI — allow blog, block premium
User-agent: GPTBot
Allow: /blog/
Allow: /news/
Disallow: /research/
Disallow: /premium/
Disallow: /subscriber-only/
Disallow: /data/
Crawl-delay: 10

# Anthropic — same pattern
User-agent: ClaudeBot
Allow: /blog/
Allow: /news/
Disallow: /research/
Disallow: /premium/
Disallow: /subscriber-only/
Disallow: /data/
Crawl-delay: 10

# Google AI — block all training
User-agent: Google-Extended
Disallow: /

# Bytespider — block everything (won't comply anyway)
User-agent: Bytespider
Disallow: /

# Meta — block all
User-agent: Meta-ExternalAgent
Disallow: /

# Common Crawl — block all (multiplier effect)
User-agent: CCBot
Disallow: /

# All others — block by default
User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

# Traditional search — full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /
```

**When to use this template:** You have clearly defined content tiers. Blog posts can feed AI, but research reports and premium content remain protected.

**Pair with:** [RSL protocol](/articles/rsl-protocol-implementation-guide.html) for path-specific pricing on allowed sections.

---

## Template 4: Monetization-Ready Configuration

Designed for publishers activating [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html). Allows compliant crawlers while blocking non-payers.

```
# ============================================
# PAY-PER-CRAWL READY
# Updated: 2026.02
# Pricing managed via Cloudflare + RSL
# ============================================

# Monetizable crawlers — allow with rate limiting
User-agent: GPTBot
Allow: /
Crawl-delay: 5

User-agent: ClaudeBot
Allow: /
Crawl-delay: 5

User-agent: Google-Extended
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot-User
Allow: /

# Non-monetizable crawlers — block
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: Deepseekbot
Disallow: /

# Traditional search — full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /
```

**When to use this template:** You've activated Pay-Per-Crawl and want to allow crawlers that pay while blocking those that don't.

**Pair with:** Cloudflare Pay-Per-Crawl configuration and an [RSL file](/articles/rsl-protocol-implementation-guide.html) that specifies your pricing terms.

---

## Implementation Best Practices

### File Location and Format

robots.txt must live at your domain root: `https://yourdomain.com/robots.txt`

Critical formatting rules:
- Each `User-agent` directive starts a new block
- `Disallow: /` blocks the entire site for that agent
- `Allow: /path/` permits access to a specific directory
- `Crawl-delay: N` requests N seconds between requests
- Blank lines separate directive blocks
- Lines starting with `#` are comments

### Common Mistakes

**Mistake 1: Blocking Googlebot instead of Google-Extended**

```
# WRONG — breaks search indexing
User-agent: Googlebot
Disallow: /

# RIGHT — blocks AI training only
User-agent: Google-Extended
Disallow: /
```

**Mistake 2: Blocking facebookexternalhit instead of Meta-ExternalAgent**

```
# WRONG — breaks Facebook link previews
User-agent: facebookexternalhit
Disallow: /

# RIGHT — blocks AI training only
User-agent: Meta-ExternalAgent
Disallow: /
```

**Mistake 3: Blocking Applebot instead of Applebot-Extended**

```
# WRONG — breaks Siri and Spotlight
User-agent: Applebot
Disallow: /

# RIGHT — blocks AI training only
User-agent: Applebot-Extended
Disallow: /
```

**Mistake 4: Relying solely on robots.txt for Bytespider**

```
# This will be ignored
User-agent: Bytespider
Disallow: /

# Add server-level enforcement
# See: nginx-ai-crawler-blocking guide
```

### Testing Your robots.txt

After deploying changes:

1. **Google robots.txt Tester** — Available in Google Search Console
2. **Manual verification** — Fetch your robots.txt and confirm formatting
3. **Server log monitoring** — Watch for continued requests from blocked crawlers after 48 hours
4. **Crawler-specific tools** — OpenAI and Anthropic provide robots.txt checking documentation

### Update Frequency

Review and update your robots.txt quarterly. New AI crawlers emerge regularly. The [user-agent reference table](/articles/ai-crawler-user-agent-strings.html) tracks new entries.

---

## robots.txt Limitations: Why You Need More

### The Enforcement Gap

robots.txt asks nicely. Compliant crawlers comply. Non-compliant crawlers don't. For comprehensive AI crawler management, layer enforcement:

1. **robots.txt** — First line. Catches compliant crawlers. Establishes legal documentation of your terms.
2. **[Server-level blocking](/articles/server-level-ai-bot-blocking.html)** — Second line. Nginx/Apache rules that return 403 for matching user agents.
3. **[CDN-level rules](/articles/cloudflare-pay-per-crawl-setup.html)** — Third line. Cloudflare/Akamai rules that block at the edge before requests reach your origin.
4. **[IP/ASN blocking](/articles/block-bytespider-nginx.html)** — Fourth line. Catches crawlers that spoof user agents.
5. **[Behavioral detection](/articles/ai-crawler-detection-methods.html)** — Fifth line. Catches sophisticated crawlers that spoof both user agents and IPs.

Each layer catches crawlers the previous layer missed. Together, they provide 90-95% coverage. The guide on [why robots.txt is not enough](/articles/robots-txt-not-enough-ai-crawlers.html) covers this in depth.

---

## Frequently Asked Questions

### How quickly do AI crawlers respect robots.txt changes?

[ClaudeBot](/articles/claudebot-crawler-profile.html): 12-24 hours. [GPTBot](/articles/gptbot-crawler-profile.html): 24-48 hours. [CCBot](/articles/ccbot-common-crawl-profile.html): Up to 30 days (monthly crawl cycles). [Bytespider](/articles/bytespider-crawler-profile.html): Never (non-compliant). Most compliant crawlers reflect changes within 48 hours.

### Does blocking AI crawlers in robots.txt affect my SEO?

No. AI crawlers are separate from search engine crawlers. Blocking **GPTBot**, **ClaudeBot**, or **CCBot** does not affect your **Google**, **Bing**, or other search engine rankings. Only blocking **Googlebot**, **Bingbot**, or equivalent search crawlers affects SEO.

### Should I include a Crawl-delay directive?

For crawlers you allow access to, `Crawl-delay` reduces server load. A value of 5-10 seconds is reasonable. Note: **Googlebot** does not honor `Crawl-delay` — use Google Search Console's crawl rate settings instead. Most AI crawlers honor the directive.

### Can I use wildcards in robots.txt paths?

Limited support. The `*` wildcard matches any sequence of characters in a path. The `$` anchor matches the end of a URL. Example: `Disallow: /*.pdf$` blocks all PDF files. Not all crawlers support wildcards — test with your specific configuration.

### How do I verify my robots.txt is working?

Monitor server logs for continued requests from blocked crawlers after 48 hours. If a crawler you blocked in robots.txt continues to access your content, the crawler is non-compliant and requires [server-level enforcement](/articles/server-level-ai-bot-blocking.html).

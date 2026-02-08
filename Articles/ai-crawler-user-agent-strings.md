title:: AI Crawler User Agent Strings: Complete Reference Table
description:: Complete reference table of every known AI crawler user agent string. Includes GPTBot, ClaudeBot, Bytespider, Google-Extended, and 30+ other AI bot identifiers.
focus_keyword:: ai crawler user agent strings list
category:: crawlers
author:: Victor Valentine Romo
date:: 2026.02.07

# AI Crawler User Agent Strings: Complete Reference Table

Every AI crawler identifies itself through a user-agent string in HTTP request headers. These strings are the first line of identification — the label that tells your server who's knocking. Without an accurate, current reference of AI crawler user-agent strings, you're blind to which AI companies are extracting your content and how much they're taking.

This reference table covers every documented AI crawler user-agent string as of early 2026. It serves as the foundation for [server-level blocking](/articles/server-level-ai-bot-blocking.html), [analytics dashboards](/articles/detect-ai-crawlers-server-logs.html), and [monetization configurations](/articles/cloudflare-pay-per-crawl-setup.html). Bookmark it. Your robots.txt and Nginx configurations depend on it.

---

## Major AI Training Crawlers

These crawlers collect content for permanent incorporation into AI model training datasets.

### OpenAI Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `GPTBot/1.0 (+https://openai.com/gptbot)` | Model training and pre-indexing | High | Yes (Pay-Per-Crawl) |
| `ChatGPT-User` | Real-time browsing for ChatGPT | High | Limited |
| `OAI-SearchBot/1.0` | SearchGPT web retrieval | High | Emerging |

**GPTBot** is the primary training crawler. **ChatGPT-User** is the real-time retrieval agent. **OAI-SearchBot** serves **OpenAI**'s search product. Each requires separate robots.txt directives for independent control.

Full profile: [GPTBot Crawler Profile](/articles/gptbot-crawler-profile.html)

### Anthropic Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `ClaudeBot/1.0 (+https://anthropic.com/claudebot)` | Model training data | Very high | Yes (Pay-Per-Crawl) |
| `ClaudeBot-User/1.0 (+https://anthropic.com/claudebot)` | Real-time retrieval | Very high | Limited |

**ClaudeBot** demonstrates the highest compliance rate among major AI crawlers. Separate directives for **ClaudeBot** and **ClaudeBot-User** enable independent control of training vs. retrieval.

Full profile: [ClaudeBot Crawler Profile](/articles/claudebot-crawler-profile.html)

### Google Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `Googlebot` (standard) | Search indexing | Very high | N/A (search) |
| `Google-Extended` | AI training (Gemini) | High | Licensing deals |

**Google-Extended** is a permission token, not a separate crawler. It shares infrastructure with **Googlebot**. Blocking **Google-Extended** prevents AI training use without affecting search indexing.

Full profile: [Google-Extended Crawler Profile](/articles/google-extended-crawler-profile.html)

### ByteDance Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `Bytespider` | AI training (Doubao, TikTok) | Very low | No |
| `Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)` | Same (extended format) | Very low | No |

**Bytespider** frequently spoofs its user-agent string, appearing as standard browsers. User-agent detection alone is insufficient — combine with [IP/ASN blocking](/articles/block-bytespider-nginx.html).

Full profile: [Bytespider Crawler Profile](/articles/bytespider-crawler-profile.html)

### Meta Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `Meta-ExternalAgent/1.0 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)` | AI training (LLaMA) | Moderate-high | Limited |
| `facebookexternalhit/1.1` | Social sharing previews | N/A | N/A (keep allowed) |
| `Facebot` | Social features | N/A | N/A (keep allowed) |

Block **Meta-ExternalAgent** for AI training opt-out. Do NOT block **facebookexternalhit** or **Facebot** — these handle link previews on Facebook and Instagram.

Full profile: [Meta AI Crawler Profile](/articles/meta-ai-crawler-profile.html)

### Amazon Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `Amazonbot/0.1 (https://developer.amazon.com/support/amazonbot)` | AI training (Alexa, Rufus, Q) | High | Limited |

Full profile: [Amazonbot Crawler Profile](/articles/amazonbot-crawler-profile.html)

### Apple Crawlers

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `Applebot-Extended` | AI training (Apple Intelligence) | High | Limited |
| `Applebot/0.1 (+http://www.apple.com/go/applebot)` | Siri/Spotlight (keep allowed) | Very high | N/A |

Block **Applebot-Extended** for AI training opt-out. Keep **Applebot** allowed for Siri knowledge features.

Full profile: [Applebot-Extended Crawler Profile](/articles/applebot-extended-crawler-profile.html)

### Common Crawl

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `CCBot/2.0 (https://commoncrawl.org/faq/)` | Open training datasets | High | No (nonprofit) |

Blocking **CCBot** denies training data to dozens of AI companies simultaneously. The highest-leverage single block.

Full profile: [CCBot Profile](/articles/ccbot-common-crawl-profile.html)

---

## AI Search and Retrieval Crawlers

These crawlers fetch content for real-time query answering rather than permanent model training.

### Perplexity

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `PerplexityBot` | AI search retrieval | Disputed | Limited |

**PerplexityBot** has faced [scraping controversies](/articles/perplexity-scraping-controversy.html) over robots.txt compliance and content attribution.

### Cohere

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `cohere-ai` | Enterprise AI retrieval | Moderate | Limited |

**Cohere** operates primarily in enterprise RAG deployments.

### You.com

| User-Agent String | Purpose | Compliance | Monetizable |
|-------------------|---------|------------|-------------|
| `YouBot` | AI search | Moderate | No |

---

## Emerging and Specialized AI Crawlers

### Mistral

| User-Agent String | Purpose | Compliance |
|-------------------|---------|------------|
| `MistralBot` | Model training | Moderate |

### AI21 Labs

| User-Agent String | Purpose | Compliance |
|-------------------|---------|------------|
| `AI2Bot` | Research and training | High |

### Hugging Face

| User-Agent String | Purpose | Compliance |
|-------------------|---------|------------|
| `HuggingFaceBot` | Model training datasets | Moderate |

### DeepSeek

| User-Agent String | Purpose | Compliance |
|-------------------|---------|------------|
| `Deepseekbot` | Model training | Low-Moderate |

### Baidu (ERNIE)

| User-Agent String | Purpose | Compliance |
|-------------------|---------|------------|
| `Baiduspider` | Search + AI training | Moderate |

Note: **Baiduspider** serves both traditional search and AI training for **Baidu**'s ERNIE models. Blocking it may affect your visibility in Baidu search (relevant for Chinese audience).

### Others

| User-Agent String | Operator | Purpose |
|-------------------|----------|---------|
| `Diffbot` | Diffbot | Knowledge graph construction |
| `Webzio-Extended` | Webz.io | Data feeds for AI companies |
| `Scrapy` | Various | Generic scraping framework (not specific to one company) |
| `DataForSeoBot` | DataForSEO | SEO data + AI features |
| `SemrushBot` | Semrush | SEO data + AI features |
| `AhrefsBot` | Ahrefs | SEO data + AI features |
| `PetalBot` | Huawei | Search + AI (Petal Search) |
| `ImagesiftBot` | Imagesift | Image training data |

---

## Detection Patterns for Server Configuration

### Nginx Map for All Known AI Crawlers

```nginx
map $http_user_agent $is_ai_crawler {
    default 0;
    ~*GPTBot 1;
    ~*ChatGPT-User 1;
    ~*OAI-SearchBot 1;
    ~*ClaudeBot 1;
    ~*Bytespider 1;
    ~*bytedance 1;
    ~*Google-Extended 1;
    ~*Meta-ExternalAgent 1;
    ~*Amazonbot 1;
    ~*Applebot-Extended 1;
    ~*CCBot 1;
    ~*PerplexityBot 1;
    ~*cohere-ai 1;
    ~*YouBot 1;
    ~*MistralBot 1;
    ~*AI2Bot 1;
    ~*Deepseekbot 1;
    ~*Diffbot 1;
    ~*PetalBot 1;
    ~*ImagesiftBot 1;
}
```

Use `$is_ai_crawler` in conditional blocks for blanket AI crawler management.

### Separate Training vs. Search Classification

```nginx
# Training crawlers
map $http_user_agent $is_ai_training_crawler {
    default 0;
    ~*GPTBot 1;
    ~*ClaudeBot/1 1;
    ~*Google-Extended 1;
    ~*Meta-ExternalAgent 1;
    ~*Bytespider 1;
    ~*bytedance 1;
    ~*CCBot 1;
    ~*Amazonbot 1;
    ~*Applebot-Extended 1;
    ~*MistralBot 1;
    ~*Deepseekbot 1;
}

# Search/retrieval crawlers
map $http_user_agent $is_ai_search_crawler {
    default 0;
    ~*ChatGPT-User 1;
    ~*ClaudeBot-User 1;
    ~*PerplexityBot 1;
    ~*cohere-ai 1;
    ~*YouBot 1;
    ~*OAI-SearchBot 1;
}
```

This enables the [dual strategy](/articles/ai-search-vs-training-crawlers.html): block training, allow search.

### Apache .htaccess Pattern

```apache
# Block all known AI training crawlers
RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot/1|Google-Extended|Meta-ExternalAgent|Bytespider|bytedance|CCBot|Amazonbot|Applebot-Extended|MistralBot|Deepseekbot) [NC]
RewriteRule .* - [F,L]
```

---

## Keeping This List Current

### Why User-Agent Lists Decay

AI crawler user-agent strings change. New AI companies emerge. Existing companies deploy new crawlers. User-agent formats evolve. A list accurate in January 2026 will have gaps by June 2026.

Sources for updates:

1. **Cloudflare Radar** — Publishes bot traffic data including new user agents
2. **Dark Visitors** (darkvisitors.com) — Community-maintained AI crawler database
3. **Server log analysis** — Your own logs reveal crawlers not yet publicly documented
4. **AI company documentation** — Official crawler pages from OpenAI, Anthropic, Google, etc.
5. **Publisher forums and trade publications** — Early reports of new crawler activity

### Monthly Audit Process

1. Review access logs for unrecognized user agents with high request volumes
2. Cross-reference new agents against known AI company IP ranges
3. Check behavioral patterns (systematic crawling vs. legitimate browser behavior)
4. Update Nginx maps, robots.txt, and CDN rules with new entries
5. Remove deprecated entries (crawlers that no longer operate)

The [AI crawler audit walkthrough](/articles/ai-crawler-audit-walkthrough.html) provides the complete step-by-step process.

---

## Spoofing and Verification

### The Trust Problem

User-agent strings are self-reported. Any HTTP client can claim any identity. A scraper can set its user-agent to `Googlebot` and your server would see a request apparently from **Google**. This makes user-agent matching necessary but insufficient.

### Verification Methods by Crawler

| Crawler | Verification Method |
|---------|-------------------|
| **GPTBot** | IP range check (20.15.240.x ranges) |
| **ClaudeBot** | IP range check (160.79.104.0/23) |
| **Googlebot** | Reverse DNS (*.googlebot.com) |
| **Applebot** | Reverse DNS (*.applebot.apple.com) |
| **Bingbot** | Reverse DNS (*.search.msn.com) |
| **Bytespider** | ASN check (AS396986, AS138294) |
| Most others | No official verification method |

For crawlers without official IP ranges, behavioral analysis provides secondary verification. Legitimate AI crawlers exhibit consistent patterns — systematic access, regular intervals, coverage of content sections. Spoofed crawlers often show erratic patterns — random pages, irregular timing, combined with other suspicious activity.

The [IP verification guide](/articles/ai-crawler-ip-verification.html) covers verification methods in detail.

---

## Frequently Asked Questions

### How often do AI crawler user-agent strings change?

Rarely for major crawlers. **GPTBot**, **ClaudeBot**, and **CCBot** have maintained stable user-agent strings since launch. New versions or format changes are typically documented by the operating company. The bigger risk is entirely new crawlers appearing from new AI companies — these require log monitoring to detect.

### Should I block all AI crawlers listed here?

Not necessarily. The [publisher decision framework](/articles/publisher-ai-crawler-decision-framework.html) helps determine which crawlers to block, which to monetize, and which to allow. Blanket blocking forfeits all AI licensing revenue. Selective blocking and monetization maximize both protection and revenue.

### What if a crawler doesn't identify itself with any known user-agent?

Unidentified crawlers require behavioral detection. High request volumes, systematic access patterns, absence of CSS/JS/image requests, and requests from data center IP ranges (rather than residential or mobile) suggest bot activity. [Server log analysis](/articles/detect-ai-crawlers-server-logs.html) and [CDN bot management](/articles/cloudflare-bot-management-ai.html) tools help identify these unlabeled crawlers.

### Can I use this list for Cloudflare firewall rules?

Yes. Create a Cloudflare WAF custom rule matching user-agent strings from this table. The rule can block, challenge, or log matching requests. For Pay-Per-Crawl publishers, Cloudflare's built-in AI crawler detection handles identification automatically — but manual rules provide backup coverage for crawlers not yet in Cloudflare's database.

### Where can I find real-time updates to this list?

Monitor darkvisitors.com for community-maintained updates, Cloudflare Radar for bot traffic trends, and individual AI company documentation pages for official changes. Your own server logs are the most authoritative source — they show exactly which user agents are hitting your specific domain.

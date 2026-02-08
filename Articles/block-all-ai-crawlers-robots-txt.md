title:: How to Block All AI Crawlers With robots.txt: Copy-Paste Template
description:: Copy-paste robots.txt template that blocks every known AI crawler while preserving search engine access. Updated for 2026 with 20+ AI bot identifiers.
focus_keyword:: block all ai crawlers robots.txt
category:: implementation
author:: Victor Valentine Romo
date:: 2026.02.07

# How to Block All AI Crawlers With robots.txt: Copy-Paste Template

You want every AI crawler off your site. No training. No retrieval. No scraping. This is the template that accomplishes that — a copy-paste robots.txt configuration that blocks every documented AI crawler while preserving search engine indexing, social media previews, and standard web functionality.

The template below represents the state of AI crawlers as of early 2026. It includes 20+ distinct user-agent tokens covering **OpenAI**, **Anthropic**, **Google** AI, **Meta**, **ByteDance**, **Amazon**, **Apple**, **Common Crawl**, **Perplexity**, **Cohere**, **Mistral**, **DeepSeek**, and more. Miss one and that company continues scraping while the rest respect your block.

---

## The Complete Block Template

Copy this entire block into your `/robots.txt` file. Replace your existing AI crawler directives (if any) with this comprehensive list.

```
# ================================================================
# BLOCK ALL AI CRAWLERS
# Last updated: 2026.02
# Source: aipaypercrawl.com/articles/block-all-ai-crawlers-robots-txt
# ================================================================
#
# This template blocks every known AI training and retrieval
# crawler while preserving search engine access.
#
# IMPORTANT: robots.txt is voluntary. Compliant crawlers honor
# these directives. Non-compliant crawlers (Bytespider) require
# server-level enforcement in addition to this file.
#
# Full enforcement guide: aipaypercrawl.com/articles/server-level-ai-bot-blocking
# ================================================================

# --- OpenAI ---
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

# --- Anthropic ---
User-agent: ClaudeBot
Disallow: /

User-agent: ClaudeBot-User
Disallow: /

# --- Google AI Training ---
User-agent: Google-Extended
Disallow: /

# --- ByteDance ---
User-agent: Bytespider
Disallow: /

# --- Meta / Facebook ---
User-agent: Meta-ExternalAgent
Disallow: /

# --- Amazon ---
User-agent: Amazonbot
Disallow: /

# --- Apple AI Training ---
User-agent: Applebot-Extended
Disallow: /

# --- Common Crawl (feeds all AI companies) ---
User-agent: CCBot
Disallow: /

# --- Perplexity ---
User-agent: PerplexityBot
Disallow: /

# --- Cohere ---
User-agent: cohere-ai
Disallow: /

# --- You.com ---
User-agent: YouBot
Disallow: /

# --- Mistral ---
User-agent: MistralBot
Disallow: /

# --- AI21 Labs ---
User-agent: AI2Bot
Disallow: /

# --- DeepSeek ---
User-agent: Deepseekbot
Disallow: /

# --- Diffbot ---
User-agent: Diffbot
Disallow: /

# --- Huawei / Petal ---
User-agent: PetalBot
Disallow: /

# --- Webz.io ---
User-agent: Webzio-Extended
Disallow: /

# --- Imagesift ---
User-agent: ImagesiftBot
Disallow: /

# ================================================================
# PRESERVE SEARCH ENGINES — DO NOT MODIFY
# ================================================================

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: YandexBot
Allow: /

# ================================================================
# PRESERVE SOCIAL MEDIA PREVIEWS — DO NOT MODIFY
# ================================================================

User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Pinterestbot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# ================================================================
# DEFAULT — Allow everything else
# ================================================================
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

**Replace `yourdomain.com`** with your actual domain in the Sitemap line.

---

## What This Template Blocks

### AI Training Crawlers (Permanent Value Extraction)

| Crawler | Company | Status |
|---------|---------|--------|
| **GPTBot** | **OpenAI** | Blocked |
| **ClaudeBot** | **Anthropic** | Blocked |
| **Google-Extended** | **Google** | Blocked |
| **Meta-ExternalAgent** | **Meta** | Blocked |
| **Bytespider** | **ByteDance** | Blocked (needs server enforcement) |
| **CCBot** | **Common Crawl** | Blocked |
| **Amazonbot** | **Amazon** | Blocked |
| **Applebot-Extended** | **Apple** | Blocked |
| **MistralBot** | **Mistral** | Blocked |
| **Deepseekbot** | **DeepSeek** | Blocked |
| **Diffbot** | **Diffbot** | Blocked |

### AI Search Crawlers (Real-Time Retrieval)

| Crawler | Company | Status |
|---------|---------|--------|
| **ChatGPT-User** | **OpenAI** | Blocked |
| **ClaudeBot-User** | **Anthropic** | Blocked |
| **OAI-SearchBot** | **OpenAI** | Blocked |
| **PerplexityBot** | **Perplexity** | Blocked |
| **cohere-ai** | **Cohere** | Blocked |
| **YouBot** | **You.com** | Blocked |

### What Remains Allowed

| Service | Crawler | Function |
|---------|---------|----------|
| **Google Search** | Googlebot | Organic search indexing |
| **Bing Search** | Bingbot | Organic search indexing |
| **Yahoo Search** | Slurp | Organic search indexing |
| **DuckDuckGo** | DuckDuckBot | Privacy search indexing |
| **Siri / Spotlight** | Applebot | Apple search features |
| **Yandex** | YandexBot | Russian search indexing |
| **Facebook** | facebookexternalhit | Link previews |
| **Twitter/X** | Twitterbot | Card previews |
| **LinkedIn** | LinkedInBot | Link previews |
| **Pinterest** | Pinterestbot | Pin previews |
| **Slack** | Slackbot | URL unfurling |
| **WhatsApp** | WhatsApp | Link previews |
| **Telegram** | TelegramBot | Link previews |

Search engines continue indexing and ranking your content. Social platforms continue generating link previews. Only AI training and retrieval crawlers are blocked.

---

## Deployment Steps

### Step 1: Backup Existing robots.txt

Before replacing your robots.txt, save the current version:

```bash
cp /path/to/public/robots.txt /path/to/public/robots.txt.backup
```

### Step 2: Deploy the Template

Replace the content of your robots.txt with the template above. Update the `Sitemap:` line with your actual sitemap URL.

### Step 3: Verify Deployment

```bash
curl -s https://yourdomain.com/robots.txt | head -40
```

Confirm the file is accessible and correctly formatted.

### Step 4: Add Server-Level Enforcement

robots.txt alone won't stop [Bytespider](/articles/bytespider-crawler-profile.html) and other non-compliant crawlers. Add server-level rules:

**Nginx** (add to your server block):

```nginx
map $http_user_agent $is_ai_crawler {
    default 0;
    ~*GPTBot 1;
    ~*ChatGPT-User 1;
    ~*ClaudeBot 1;
    ~*Bytespider 1;
    ~*bytedance 1;
    ~*Meta-ExternalAgent 1;
    ~*Amazonbot 1;
    ~*CCBot 1;
    ~*PerplexityBot 1;
    ~*Deepseekbot 1;
    ~*Diffbot 1;
}

if ($is_ai_crawler) {
    return 403;
}
```

**Apache** (add to `.htaccess`):

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (GPTBot|ChatGPT-User|ClaudeBot|Bytespider|bytedance|Meta-ExternalAgent|Amazonbot|CCBot|PerplexityBot|Deepseekbot|Diffbot) [NC]
RewriteRule .* - [F,L]
```

Full server configuration guides: [Nginx](/articles/nginx-ai-crawler-blocking.html) | [Apache](/articles/apache-htaccess-bot-management.html)

### Step 5: Monitor Compliance

After 48 hours, check server logs for continued AI crawler requests:

```bash
grep -E "GPTBot|ClaudeBot|Bytespider|CCBot|Meta-ExternalAgent|Amazonbot|PerplexityBot" /var/log/nginx/access.log | tail -20
```

Compliant crawlers should stop within 24-48 hours. Remaining requests indicate non-compliance — address with server-level blocking.

---

## When to Use This Template (And When Not To)

### Use This Template When

- You want no AI company accessing your content for free
- You plan to negotiate licensing deals from a position of complete access denial
- You're protecting proprietary content, research, or premium material
- You want to establish a baseline block before selectively enabling access for paying crawlers

### Don't Use This Template When

- You've already activated [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) and want paying crawlers to access your content
- You want brand visibility through AI search results (block training but allow search — use the [selective template](/articles/robots-txt-ai-crawlers-template.html))
- Your content is commodity-level and unlikely to attract licensing revenue

### Transitioning to Monetization

This template is a starting point, not a permanent state. The progression:

1. **Deploy full block** (this template) — establish your position
2. **Activate [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html)** — set up Cloudflare's monetization layer
3. **Selectively re-enable** compliant crawlers — [GPTBot](/articles/gptbot-crawler-profile.html) and [ClaudeBot](/articles/claudebot-crawler-profile.html) first
4. **Monitor and adjust** — track revenue, adjust pricing, expand or contract access

---

## Frequently Asked Questions

### Will this template break anything on my site?

No. Search engines, social platforms, and standard web browsers are all explicitly allowed. Only AI-specific crawlers are blocked. Visitors see no difference. Search rankings are unaffected. Social sharing previews continue to work.

### How often should I update this template?

Review quarterly. New AI crawlers emerge regularly. The [user-agent reference table](/articles/ai-crawler-user-agent-strings.html) tracks new additions. Missing a new crawler means that company scrapes freely while others respect your block.

### Does this work on WordPress?

Yes. Edit your robots.txt file directly or use a WordPress SEO plugin (Yoast, Rank Math, All in One SEO) to add the directives. The [WordPress AI crawler plugin guide](/articles/wordpress-ai-crawler-plugin.html) covers WordPress-specific implementation.

### What about crawlers not on this list?

Unidentified crawlers require behavioral detection rather than user-agent matching. [Server log analysis](/articles/detect-ai-crawlers-server-logs.html) identifies suspicious patterns from unlabeled bots. [CDN bot management](/articles/cloudflare-bot-management-ai.html) provides automated detection.

### Should I also block at the server level if robots.txt is deployed?

Yes. robots.txt provides compliant-crawler coverage and legal documentation of your access terms. Server-level blocking provides enforcement against non-compliant crawlers. Both layers serve different purposes. Deploy both.

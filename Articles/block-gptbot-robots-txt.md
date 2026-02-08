title:: How to Block GPTBot With robots.txt: OpenAI Crawler Disallow Guide
description:: Step-by-step guide to blocking OpenAI's GPTBot with robots.txt. Covers GPTBot and ChatGPT-User separately, selective blocking by path, and verification methods.
focus_keyword:: block gptbot robots.txt
category:: implementation
author:: Victor Valentine Romo
date:: 2026.02.07

# How to Block GPTBot With robots.txt: OpenAI Crawler Disallow Guide

**OpenAI** operates the most commercially active AI crawler on the web. [GPTBot](/articles/gptbot-crawler-profile.html) feeds training data into **GPT-4**, **GPT-5**, **ChatGPT**, and every product in **OpenAI**'s portfolio. If you're not being compensated for this access, blocking **GPTBot** is the first step toward either negotiating licensing terms or activating [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) monetization.

This guide covers every **GPTBot** blocking configuration — from total denial to selective path-based access to the parallel decision about **ChatGPT-User**. Each configuration includes copy-paste directives, verification steps, and the strategic context for when that particular setup makes sense.

---

## Quick Block: Total GPTBot Denial

If you want **OpenAI** completely off your site — no training, no browsing, no retrieval — add these directives to your robots.txt:

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: OAI-SearchBot
Disallow: /
```

Three agents blocked:

1. **GPTBot** — Training data collection and pre-indexing
2. **ChatGPT-User** — Real-time content retrieval for ChatGPT browsing
3. **OAI-SearchBot** — SearchGPT web retrieval

All three are **OpenAI** products with different functions. Blocking all three ensures zero **OpenAI** access to your content.

---

## Understanding OpenAI's Three Crawlers

Before configuring your block, understand what each agent does and what blocking it prevents.

### GPTBot

**User-agent:** `GPTBot/1.0 (+https://openai.com/gptbot)`

**Purpose:** Systematic crawling for model training and knowledge base indexing. **GPTBot** visits your site on a regular schedule, collecting content that enters **OpenAI**'s training pipeline. This is the crawler responsible for your content permanently entering model weights.

**Blocking prevents:** Your content from being used in future GPT model training. Content already in existing models is not affected — you cannot un-train a model.

### ChatGPT-User

**User-agent:** `ChatGPT-User`

**Purpose:** On-demand retrieval when **ChatGPT** users browse the web during conversations. This crawler fetches specific pages in real time to answer user questions with current information.

**Blocking prevents:** Your content from appearing in **ChatGPT** web browsing responses. Users asking ChatGPT about topics your site covers will not see your content cited or summarized.

### OAI-SearchBot

**User-agent:** `OAI-SearchBot/1.0`

**Purpose:** Web retrieval for **SearchGPT**, **OpenAI**'s dedicated search product.

**Blocking prevents:** Your content from appearing in SearchGPT results.

---

## Configuration Options

### Option A: Block All OpenAI Access

Block everything from **OpenAI**. No training, no browsing, no search.

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: OAI-SearchBot
Disallow: /
```

**Best for:** Publishers who want zero unpaid **OpenAI** access. Creates maximum leverage for future licensing negotiations.

### Option B: Block Training, Allow Browsing

Prevent model training while allowing **ChatGPT** to cite your content in real-time conversations.

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /
```

**Best for:** Publishers who value the brand visibility and referral traffic from **ChatGPT** citations but don't want content permanently entering training datasets.

**Trade-off:** **ChatGPT** can still summarize and present your content to users. The difference is whether that content was pre-trained into the model (permanent) or retrieved in real time (ephemeral).

### Option C: Block Training, Allow Browsing With Rate Limit

Same as Option B but with server resource protection.

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Allow: /
Crawl-delay: 10

User-agent: OAI-SearchBot
Allow: /
Crawl-delay: 10
```

**Best for:** Publishers on resource-constrained hosting who want to allow browsing without unlimited request volume.

### Option D: Selective Path-Based Access

Allow **GPTBot** to access some content while blocking premium sections.

```
User-agent: GPTBot
Allow: /blog/
Allow: /articles/
Disallow: /research/
Disallow: /premium/
Disallow: /data/
Disallow: /subscriber-only/
Crawl-delay: 10

User-agent: ChatGPT-User
Allow: /
```

**Best for:** Publishers with clearly defined content tiers. Free blog content can train **OpenAI**'s models (or generate Pay-Per-Crawl revenue), while premium content stays protected.

**Pair with:** [RSL protocol](/articles/rsl-protocol-implementation-guide.html) to set different pricing on allowed vs. restricted paths.

### Option E: Monetization-Ready (Pay-Per-Crawl)

Allow **GPTBot** full access with Cloudflare's payment layer enforcing per-crawl charges.

```
User-agent: GPTBot
Allow: /
Crawl-delay: 5

User-agent: ChatGPT-User
Allow: /
```

**Best for:** Publishers who've activated [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html). **GPTBot** accesses your content and **OpenAI** pays your published rate for each page request.

---

## Verification

### Confirming robots.txt Is Accessible

```bash
curl -s https://yourdomain.com/robots.txt | grep -A2 "GPTBot"
```

Expected output for a full block:
```
User-agent: GPTBot
Disallow: /
```

### Monitoring Server Logs

After deploying the block, monitor for compliance:

```bash
# Check for GPTBot requests in the last 48 hours
grep "GPTBot" /var/log/nginx/access.log | tail -20
```

**GPTBot** typically stops within 24-48 hours of a robots.txt block. If requests continue past 48 hours, verify:

1. Your robots.txt is accessible (not blocked by authentication or redirects)
2. The directive syntax is correct
3. The requests are genuinely from **GPTBot** (not spoofed — verify against [published IP ranges](/articles/openai-crawler-ip-ranges.html))

### IP Verification

Confirm requests come from legitimate **OpenAI** infrastructure:

```bash
# GPTBot's published IP ranges
# 20.15.240.64/28
# 20.15.240.80/28
# 20.15.240.96/28
# 20.15.240.176/28

# Check if a requesting IP falls in these ranges
dig -x 20.15.240.65
```

Requests from IPs outside these ranges claiming to be **GPTBot** are spoofed and should be blocked at the server level regardless of robots.txt.

---

## Server-Level Enforcement

robots.txt catches honest **GPTBot** requests. For defense-in-depth, add server rules:

**Nginx:**

```nginx
map $http_user_agent $is_openai_crawler {
    default 0;
    ~*GPTBot 1;
    ~*ChatGPT-User 1;
    ~*OAI-SearchBot 1;
}

if ($is_openai_crawler) {
    return 403;
}
```

**Apache:**

```apache
RewriteCond %{HTTP_USER_AGENT} (GPTBot|ChatGPT-User|OAI-SearchBot) [NC]
RewriteRule .* - [F,L]
```

These rules enforce immediately, without waiting for **GPTBot** to re-check robots.txt. They also catch requests that might bypass robots.txt (though **GPTBot** is highly compliant).

---

## The Strategic Context

### Why Block GPTBot?

**Revenue leverage.** **OpenAI** is the AI company most willing to pay for content. They've signed deals worth hundreds of millions with publishers. Blocking **GPTBot** creates the conditions for monetization — either through [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) (automated marketplace) or direct licensing (negotiated agreement).

Allowing **GPTBot** to crawl freely means **OpenAI** gets your content for free while paying competitors hundreds of millions for theirs.

### GPTBot Revenue Potential

For publishers running Pay-Per-Crawl, **GPTBot** generates 30-50% of total AI licensing revenue. It's the single largest revenue contributor among individual AI crawlers because of high volume, consistent compliance, and reliable payment behavior.

| Publisher Size | Estimated Monthly GPTBot Revenue |
|---------------|--------------------------------|
| 100K pageviews | $10-30 |
| 500K pageviews | $50-150 |
| 1M pageviews | $150-400 |
| 5M pageviews | $500-1,500 |
| 10M+ pageviews | $1,500-5,000+ |

These estimates assume standard marketplace pricing ($0.005-0.010/crawl). Your actual revenue depends on content type, pricing, and crawl volume.

### The Progression

1. **Today:** Deploy this block — stop free access
2. **This week:** Set up [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) and [RSL](/articles/rsl-protocol-implementation-guide.html) pricing
3. **Next step:** Update robots.txt to allow **GPTBot** with monetization active
4. **Ongoing:** Monitor revenue, adjust pricing, optimize content for [crawler targeting](/articles/gptbot-crawler-profile.html)

---

## Frequently Asked Questions

### Does blocking GPTBot remove my content from ChatGPT?

Blocking **GPTBot** prevents future content from entering training datasets. Content already trained into existing models remains encoded in the model weights indefinitely. To prevent real-time citations in **ChatGPT** conversations, also block **ChatGPT-User**.

### How fast does GPTBot comply with robots.txt?

24-48 hours in most cases. **GPTBot** checks robots.txt periodically before crawl sessions. Changes are typically respected within 1-2 days. For immediate enforcement, combine with [server-level blocking](/articles/nginx-ai-crawler-blocking.html).

### Will blocking GPTBot affect my Google rankings?

No. **GPTBot** is **OpenAI**'s crawler, entirely separate from **Googlebot**. Blocking **GPTBot** has zero impact on Google Search indexing, ranking, or any search engine functionality.

### Should I block GPTBot if I want to sell data to OpenAI?

Block first, negotiate second. Blocking establishes that you control access. From that position, you can either activate marketplace monetization (Pay-Per-Crawl) or approach **OpenAI** for a direct licensing deal. Allowing free access first gives away your leverage.

### Can I block GPTBot on specific pages only?

Yes. Use path-based directives in robots.txt (see Option D above). Allow `/blog/` while blocking `/premium/`. **GPTBot** respects per-path directives reliably.

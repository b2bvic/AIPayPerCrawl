title:: Google-Extended Crawler Profile: Separating Search Indexing From AI Training
description:: Complete profile of Google-Extended, the crawler Google uses for AI training. How it differs from Googlebot, blocking strategies, and monetization implications.
focus_keyword:: google-extended crawler
category:: crawlers
author:: Victor Valentine Romo
date:: 2026.02.07

# Google-Extended Crawler Profile: Separating Search Indexing From AI Training

**Google** operates the most consequential split in the AI crawler landscape. **Googlebot** indexes your content for search results and sends you traffic. **Google-Extended** scrapes the same content for **Gemini** training data and sends you nothing. Same company, same infrastructure, two fundamentally different economic relationships with your content.

The split happened in September 2023 when **Google** introduced **Google-Extended** as a separate user-agent token specifically for AI model training. Before this, publishers had no way to permit search indexing while blocking AI training. The new token resolved this — at least in theory. In practice, the relationship between **Googlebot** and **Google-Extended** creates complexities that publishers need to navigate carefully.

Understanding **Google-Extended** matters because **Google** controls search traffic. Unlike [GPTBot](/articles/gptbot-crawler-profile.html) or [ClaudeBot](/articles/claudebot-crawler-profile.html), where blocking has no search consequences, decisions about **Google-Extended** exist in the shadow of your dependency on **Google** Search. This makes **Google-Extended** the most strategically complex AI crawler to manage.

---

## Identification and Technical Profile

### User-Agent String

**Google-Extended** does not operate as a separate crawler with its own user-agent string. Instead, it functions as a permission token within the robots.txt framework. The actual crawling is performed by **Googlebot** infrastructure.

When you block **Google-Extended** in robots.txt:

```
User-agent: Google-Extended
Disallow: /
```

You are telling **Google** that its standard crawling infrastructure may not use your content for AI training purposes. **Googlebot** continues to crawl and index your pages for search results. The robots.txt directive signals a usage restriction, not a crawl restriction.

This is architecturally different from blocking [GPTBot](/articles/gptbot-crawler-profile.html) or [Bytespider](/articles/bytespider-crawler-profile.html), where the block prevents the crawler from accessing your pages entirely. With **Google-Extended**, the crawler still visits — it's the downstream use of the data that changes.

### What Google-Extended Controls

**Google** has documented that blocking **Google-Extended** prevents your content from being used for:

- **Gemini** model training (Google's flagship LLM family)
- **Gemini Apps** (formerly Bard) grounding and response generation
- AI-powered features in **Google Search** (AI Overviews, formerly SGE)
- Other generative AI products built on **Google**'s foundation models

Blocking **Google-Extended** does *not* affect:

- **Google Search** organic indexing and ranking
- **Google News** inclusion
- **Google Discover** eligibility
- **Google Ads** crawling and ad serving
- **Google Translate** functionality
- **YouTube** content indexing

### IP Ranges and Infrastructure

**Google-Extended** shares infrastructure with **Googlebot**. It does not operate from separate IP ranges. The IP ranges documented for **Googlebot** verification apply:

```bash
# Verify via Google's published JSON
curl -s https://developers.google.com/search/apis/ipranges/googlebot.json | jq '.prefixes[].ipv4Prefix'
```

Because **Google-Extended** uses the same crawling infrastructure as **Googlebot**, IP-based blocking is not viable without also blocking search indexing. The robots.txt permission layer is the only separation mechanism **Google** provides.

---

## The Googlebot / Google-Extended Relationship

### Shared Infrastructure, Separate Permissions

The architectural decision to make **Google-Extended** a permission layer rather than a separate crawler was deliberate. **Google** avoids duplicating crawl requests — your server sees one crawl from **Googlebot**, and the resulting data either does or does not flow to AI training pipelines depending on your **Google-Extended** directive.

This design has advantages for publishers:

- No additional server load from a separate AI crawler
- No bandwidth consumed by redundant crawl requests
- Clean separation of consent: one directive controls AI training permission

And disadvantages:

- No way to verify whether **Google** actually honors the **Google-Extended** block on the backend
- No separate log entries to audit AI-specific crawling
- No ability to price AI access separately at the server level (since it's the same request)

### The Trust Problem

With [GPTBot](/articles/gptbot-crawler-profile.html), publishers can verify compliance by monitoring server logs. If GPTBot requests stop after a robots.txt block, the block works. With **Google-Extended**, the crawl requests continue (they're **Googlebot** requests). You're trusting **Google** to respect a downstream usage restriction that you cannot independently verify.

**Google** has every incentive to honor this restriction — the legal and reputational costs of violating a published permission protocol would be enormous. But the verification asymmetry exists, and publishers should understand it.

### Implications for Monetization

The shared-infrastructure model complicates [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) monetization. With **GPTBot** and **ClaudeBot**, [Cloudflare](/articles/cloudflare-pay-per-crawl-setup.html) can identify the crawler by user-agent and apply per-crawl pricing. With **Google-Extended**, the crawl request looks identical to a standard **Googlebot** request.

Current monetization options for **Google-Extended** content:

1. **Direct licensing deals** — Negotiate with **Google** directly (only viable for large publishers)
2. **Cloudflare marketplace** — **Google** participates in Pay-Per-Crawl, but implementation details for **Google-Extended** specifically are evolving
3. **Block-and-negotiate** — Block **Google-Extended** via robots.txt, then negotiate licensing terms for re-enabling access

The [Reddit-Google deal](/articles/reddit-google-ai-licensing-deal.html) ($60 million annually) demonstrates that **Google** will pay for content access. The question is whether marketplace mechanisms can capture this value at scale or whether direct deals remain the only path.

---

## Crawl Behavior Analysis

### Volume

Since **Google-Extended** shares **Googlebot** infrastructure, isolating its specific crawl volume is impossible from server logs alone. What publishers observe is total **Googlebot** activity:

| Publisher Size | Typical Daily Googlebot Requests | Estimated AI-Related % |
|---------------|--------------------------------|----------------------|
| Small (under 100K PV) | 500-2,000 | 10-20% |
| Medium (100K-1M PV) | 2,000-10,000 | 15-25% |
| Large (1M-10M PV) | 10,000-50,000 | 20-30% |
| Enterprise (10M+ PV) | 50,000-200,000+ | 25-35% |

The "AI-Related %" column represents informed estimates based on changes in crawl patterns observed after **Google** launched **Gemini** features. Some publishers noted increased **Googlebot** activity on content types aligned with training data preferences (long-form, structured, technical) without corresponding increases in search-related crawling.

### Content Targeting

**Google-Extended** benefits from **Googlebot**'s comprehensive knowledge of web content. Unlike standalone AI crawlers that must discover content independently, **Google-Extended** already has **Google**'s complete index. This means:

- No discovery crawl phase — **Google** already knows what content exists
- Quality signals pre-computed — PageRank, topical authority, and content freshness data inform targeting
- Efficient targeting — Only high-value pages need AI-specific processing

This informational advantage makes **Google-Extended** potentially more selective than [GPTBot](/articles/gptbot-crawler-profile.html) or [ClaudeBot](/articles/claudebot-crawler-profile.html), which must discover and evaluate content quality through their own crawling.

### robots.txt Compliance

**Google** has demonstrated reliable compliance with **Google-Extended** blocks. Publishers who added the directive reported:

- No content appearing in **Gemini** outputs attributable to post-block crawling
- No observable changes in search ranking (the concern that blocking **Google-Extended** might affect search proved unfounded)
- Compliance within 24-48 hours of robots.txt updates

The compliance record aligns with **Google**'s broader robots.txt behavior — **Googlebot** has decades of history respecting publisher directives.

---

## Strategic Considerations

### The Search Leverage Question

The core strategic question with **Google-Extended**: does blocking AI training affect your search performance?

**Google** states explicitly that blocking **Google-Extended** does not affect search ranking. This claim is consistent with publisher observations — no ranking penalties have been documented following **Google-Extended** blocks.

However, the long-term dynamics create uncertainty:

- **AI Overviews** increasingly dominate search results pages. Content excluded from AI training may be excluded from AI-generated search features.
- **Google** could theoretically favor content it can use for AI training in organic rankings, though this would violate stated policy and likely trigger antitrust scrutiny.
- The value of organic search traffic may decline as AI-generated answers reduce click-through rates, making search indexing less valuable as a bargaining chip.

Publishers must weigh these uncertainties against the concrete revenue opportunity from licensing or blocking **Google-Extended** content.

### Block, License, or Allow

Three strategic paths for **Google-Extended**:

**Block (robots.txt Disallow):**
- Prevents AI training use
- Preserves search indexing
- Forgoes licensing revenue from **Google**
- Creates leverage for future licensing negotiations
- Appropriate when: You plan to negotiate directly or don't want content in **Gemini**

**License (Direct deal or marketplace):**
- Monetizes AI training use
- Maintains search indexing
- Captures revenue from content that **Google** values
- Requires either direct negotiation or marketplace infrastructure
- Appropriate when: You have content volume and quality that **Google** will pay for

**Allow (Default — no robots.txt directive):**
- **Google** uses your content for AI training for free
- Standard search indexing continues
- Zero licensing revenue
- Appropriate when: Never, if you're reading this site

The [publisher decision framework](/articles/publisher-ai-crawler-decision-framework.html) provides a structured approach to this choice.

### The Dual-Crawler Strategy

The ideal **Google** configuration for most publishers:

```
# Allow search indexing
User-agent: Googlebot
Allow: /

# Block free AI training
User-agent: Google-Extended
Disallow: /
```

This captures search traffic value while withholding AI training value. The withheld training access becomes a negotiating asset — **Google** can regain it through a licensing deal or marketplace payment.

The [dual strategy guide](/articles/dual-strategy-search-vs-training.html) covers this approach across all crawlers that separate search and training functions.

---

## Google's AI Content Acquisition Strategy

### Beyond Google-Extended

**Google** acquires AI training content through multiple channels:

1. **Google-Extended** — Direct web crawling for AI training
2. **Reddit deal** — [$60M/year licensing agreement](/articles/reddit-google-ai-licensing-deal.html) for user-generated content
3. **YouTube** — Massive corpus of video transcripts and metadata (owned property)
4. **Google Books** — Digitized book corpus (long-standing legal battles largely resolved)
5. **Google Scholar** — Academic paper abstracts and metadata
6. **Partnerships** — Various data licensing agreements with publishers and platforms

**Google-Extended** is one input among many. For publishers, this means blocking **Google-Extended** reduces but doesn't eliminate **Google**'s access to your content. If your content appears in **Common Crawl** datasets, **Google** can potentially access it through that channel even with **Google-Extended** blocked. Comprehensive protection requires blocking [CCBot](/articles/ccbot-common-crawl-profile.html) as well.

### Gemini's Growing Data Appetite

**Google**'s **Gemini** family requires enormous training data volumes. Each successive model — **Gemini 1.0**, **Gemini 1.5**, **Gemini 2.0** — demands expanded and refreshed training data. As **Gemini** powers more **Google** products (Search, Workspace, Cloud, Android), the commercial value of training data increases.

This demand trajectory benefits publishers who withhold **Google-Extended** access. **Google**'s need for quality content grows faster than the available supply of licensed content, creating upward pricing pressure on licensing deals.

---

## Technical Configuration

### robots.txt Implementation

```
# Standard Google-Extended block
User-agent: Google-Extended
Disallow: /
```

For selective access (allow training on some content):

```
User-agent: Google-Extended
Disallow: /premium/
Disallow: /research/
Disallow: /subscriber-only/
Allow: /blog/
Allow: /news/
```

### Verification

Unlike other AI crawlers, you cannot verify **Google-Extended** compliance through server logs because the crawl requests appear as standard **Googlebot** traffic. Verification methods:

1. **Test queries in Gemini** — Search for your content in **Gemini** to see if post-block content appears in responses
2. **Google Search Console** — Monitor for any crawl behavior changes after implementing the block
3. **Temporal analysis** — Content published after your **Google-Extended** block should not appear in **Gemini** training data. Content published before the block may persist.

### Interaction With Other Google Directives

**Google-Extended** interacts with other Google-specific robots.txt tokens:

- **Googlebot** — Controls search crawling. Independent of **Google-Extended**.
- **Googlebot-Image** — Controls image search crawling. Independent.
- **Googlebot-Video** — Controls video search crawling. Independent.
- **Googlebot-News** — Controls Google News crawling. Independent.

Blocking **Google-Extended** while allowing all other **Google** tokens preserves full search functionality while restricting AI training use.

---

## Frequently Asked Questions

### Does blocking Google-Extended hurt my search rankings?

No, according to **Google**'s documentation and publisher observations. Blocking **Google-Extended** prevents AI training use but does not affect **Googlebot** search indexing or ranking. No publisher has documented ranking penalties following a **Google-Extended** block.

### Can I monetize Google-Extended access through Cloudflare Pay-Per-Crawl?

The situation is evolving. Because **Google-Extended** shares infrastructure with **Googlebot**, crawler-level identification at the Cloudflare edge requires different handling than standalone crawlers like **GPTBot**. **Google** does participate in the content licensing marketplace, but the technical implementation for **Google-Extended** specifically continues to develop. Direct licensing remains the most established monetization path for **Google** AI content access.

### What happens to content Google already crawled before I blocked Google-Extended?

Content already in **Google**'s AI training datasets remains there. The **Google-Extended** block prevents future content from entering training datasets and prevents existing content from being re-crawled for AI training refresh cycles. It does not retroactively remove content from existing model weights.

### Should I block Google-Extended if I already block GPTBot and ClaudeBot?

Consistency matters. If your strategy is to withhold AI training access across all providers, blocking **Google-Extended** completes that posture. If your strategy is selective licensing, you might block **Google-Extended** while licensing to [GPTBot](/articles/gptbot-crawler-profile.html) and [ClaudeBot](/articles/claudebot-crawler-profile.html) through marketplace mechanisms, then negotiate separately with **Google** for AI access.

### How does Google-Extended relate to AI Overviews in search?

**Google** has been ambiguous about whether blocking **Google-Extended** excludes your content from AI Overviews (the AI-generated summaries appearing in search results). The distinction between "AI training" and "AI-powered search features" is not clearly delineated in **Google**'s documentation. If AI Overviews are important to your traffic strategy, evaluate this uncertainty before blocking **Google-Extended**.

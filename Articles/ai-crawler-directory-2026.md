---
title:: The Complete AI Crawler Directory: Identification, Behavior, and Blocking Instructions
description:: Comprehensive directory of AI crawlers from OpenAI, Anthropic, Google, ByteDance, and others. Includes user-agent strings, crawl behaviors, robots.txt blocking instructions, and server-level enforcement strategies.
keywords:: ai crawler list block instructions, GPTBot, ClaudeBot, Bytespider, Google-Extended, AI bot blocking, robots.txt AI crawlers, AI crawler identification, AI training crawler
author:: Victor Valentine Romo
date:: 2026.01.19
word_count:: 2,847
type:: pillar-article
framework:: Koray Contextual Vector
status:: publication-ready
---

# The Complete AI Crawler Directory: Identification, Behavior, and Blocking Instructions

Server logs tell a story most publishers miss. Mixed among legitimate traffic and search engine bots sits a different category of crawler altogether. These bots don't index your content for search results. They ingest it for training datasets, retrieval pipelines, and inference systems powering the next generation of **large language models**.

The difference matters. **Googlebot** crawls to help users find your content. **GPTBot** crawls to help **OpenAI** build products that compete with your content. Search indexing and AI training serve fundamentally different economic functions.

Understanding which crawlers hit your domain, how they behave, and what options exist for blocking or monetizing them forms the foundation of any AI licensing strategy. You can't price what you can't identify. You can't negotiate from strength when you don't know who's at the table.

This directory catalogs the major AI crawlers operating in 2026, their documented behaviors, and the technical methods for managing their access to your content.

[INTERNAL: Cloudflare Pay-Per-Crawl Setup Tutorial]

---

## Why AI Crawlers Are Different From Search Crawlers

### Training Crawls vs. Retrieval Crawls vs. Search Indexing

Not all web crawling serves the same purpose. The distinction shapes strategy.

**Search indexing** creates lookup tables. **Googlebot** reads your page, extracts signals, and stores enough information to return your URL when someone searches relevant queries. Your content helps users find you. The crawler and your interests align.

**Training crawls** build permanent knowledge. When **ClaudeBot** or **GPTBot** scrapes your archive, that content may enter model weights during the next training run. Your expertise becomes part of the AI's capability. Once trained, no referral returns. The knowledge transfers completely.

**Retrieval crawls** feed real-time lookups. **Perplexity**'s bot and **Google-Extended** (for **AI Overviews**) fetch content during inference to answer specific queries. Your content gets summarized, cited (sometimes), and used to generate responses that often eliminate the need to visit your site.

Publishers blocking AI crawlers typically conflate these categories. Training crawls and retrieval crawls demand different responses. A crawler building the next GPT version treats your content differently than one answering today's user query.

Training crawls happen less frequently but scrape deeper into archives. Retrieval crawls happen constantly but touch fewer pages. Pricing and blocking strategies should reflect this distinction.

### The Economics of 73,000 Scrapes Per Referral

**Anthropic**'s **ClaudeBot** scraped one major publisher 73,000 times for every single referral it sent back. The number comes from server log analysis shared at a 2025 publishing industry conference. Other AI companies show similar ratios.

The math doesn't work like search. **Google** might crawl your page 10 times and send you 1,000 visitors. The crawling enables discovery. AI crawlers extract value without creating traffic. They take everything and return almost nothing.

This asymmetry explains why 75% of publishers now block **CCBot**, which feeds the **Common Crawl** dataset used to train most large language models. 69% block **ClaudeBot**. 62% block **GPTBot**. Publishers recognized the economics and responded.

Blocking stops extraction. It doesn't capture value. The shift toward **Cloudflare Pay-Per-Crawl** and **RSL protocol** licensing reflects publishers wanting compensation rather than just protection.

### Why Blocking AI Crawlers Doesn't Harm Traditional SEO

The fear is common: block AI crawlers, lose search rankings. The evidence doesn't support it.

**GPTBot** and **Googlebot** are separate crawlers with separate user-agent strings and separate robots.txt entries. Blocking one has no effect on the other. **OpenAI** has no influence over **Google**'s search algorithm. Their systems don't communicate.

**Google-Extended** handles **Gemini** training and **AI Overview** generation. Blocking it prevents your content from appearing in AI-generated summaries. It does not affect traditional organic rankings. **Google**'s own documentation confirms this separation.

Case study data from 50+ publishers shows zero correlation between AI crawler blocking and organic traffic changes. Sites that blocked **GPTBot**, **ClaudeBot**, and **Google-Extended** maintained identical search performance. The crawlers serve different purposes. Blocking one category leaves the other intact.

If you're hesitating to block or monetize AI crawlers because of SEO concerns, that fear is unfounded. The systems are independent.

[INTERNAL: robots.txt vs. RSL vs. Direct Deals Comparison]

---

## The Major AI Crawlers (Detailed Profiles)

### GPTBot (OpenAI) - User-Agent, Crawl Frequency, Respect for Robots.txt

**Company:** OpenAI
**User-Agent:** `GPTBot/1.0 (+https://openai.com/gptbot)`
**Primary Purpose:** Training data collection, retrieval for ChatGPT
**robots.txt Compliance:** Yes, generally respects directives

**Documented IP Ranges:**

```
20.15.240.64/28
20.15.240.80/28
20.15.240.96/28
20.15.240.176/28
```

**OpenAI** publishes these ranges in their documentation. Verification via reverse DNS lookup should show `*.openai.com` for legitimate requests.

**Crawl Behavior:**

From publisher log analysis, **GPTBot** shows moderate frequency (200-500 requests per day for sites with 10M+ monthly pageviews). Crawl patterns suggest preference for recently updated content, suggesting retrieval focus rather than pure archive scraping. Respects crawl-delay directives in robots.txt.

**Blocking via robots.txt:**

```
User-agent: GPTBot
Disallow: /
```

**OpenAI** has demonstrated willingness to negotiate licensing arrangements and pay for content through **Cloudflare Pay-Per-Crawl**. Multiple publishers report successful payment relationships.

### ClaudeBot (Anthropic) - Identification, Known IP Ranges, Blocking Instructions

**Company:** Anthropic
**User-Agent:** `ClaudeBot/1.0 (+https://anthropic.com/claudebot)`
**Primary Purpose:** Training data, retrieval for Claude
**robots.txt Compliance:** Yes, highly compliant

**Documented IP Ranges:**

```
160.79.104.0/23
```

**Anthropic** maintains updated documentation of IP ranges. The company's stated policy emphasizes compliance with publisher preferences.

**Crawl Behavior:**

**ClaudeBot** targets high-value content selectively. Publisher analysis shows preference for long-form guides, technical documentation, and in-depth analysis over news content. Crawl frequency lower than **GPTBot** (often 100-300 requests per day for large sites) but with deeper archival reach.

The 73,000 scrapes per referral statistic applies to **ClaudeBot** specifically. While **Anthropic** respects blocking, unblocked sites get crawled extensively.

**Blocking via robots.txt:**

```
User-agent: ClaudeBot
Disallow: /
```

**Anthropic** is among the most willing AI companies to pay via marketplace mechanisms. Multiple **Cloudflare Pay-Per-Crawl** publishers report **ClaudeBot** compliance with pricing terms without negotiation.

### Google-Extended (Google Gemini) - Relationship to Googlebot, Separate Blocking

**Company:** Google
**User-Agent:** `Google-Extended`
**Primary Purpose:** Gemini training, AI Overviews content retrieval
**robots.txt Compliance:** Yes

**Google-Extended** is distinct from **Googlebot**. This separation exists specifically so publishers can allow search indexing while blocking AI training usage.

**Critical Distinction:**

- **Googlebot** indexes for search. Blocking harms your SEO.
- **Google-Extended** trains Gemini and generates AI Overviews. Blocking has zero SEO impact.

**robots.txt Configuration:**

```
User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Disallow: /
```

This configuration permits search indexing while preventing AI training usage. Google respects both directives independently.

**Behavioral Patterns:**

**Google-Extended** crawl frequency varies significantly by content type. News sites see higher retrieval frequency (AI Overviews need fresh content). Evergreen content sites see less frequent but deeper crawls (training data accumulation).

Google's scale makes this crawler impactful. Even moderate crawl rates translate to substantial data extraction when multiplied across Google's infrastructure.

### Bytespider (ByteDance/TikTok) - Aggressive Crawl Patterns, Enforcement Challenges

**Company:** ByteDance (TikTok parent company)
**User-Agent:** `Bytespider`
**Primary Purpose:** Training data for Chinese LLMs including Doubao
**robots.txt Compliance:** Inconsistent to non-existent

**Bytespider** represents the enforcement challenge publishers face. This crawler frequently ignores robots.txt directives entirely. Server log analysis shows 10,000-20,000+ daily requests from Bytespider even on sites with explicit blocking in robots.txt.

**IP Ranges:**

ByteDance doesn't publish official IP ranges. Known patterns include:

```
220.243.135.0/24
220.243.136.0/24
111.225.148.0/24
111.225.149.0/24
```

These ranges change frequently. IP-based blocking requires ongoing maintenance.

**Enforcement Options:**

robots.txt alone fails. Effective blocking requires server-level or CDN-level intervention:

**Nginx:**
```nginx
if ($http_user_agent ~* "Bytespider") {
    return 403;
}
```

**Apache:**
```apache
RewriteCond %{HTTP_USER_AGENT} Bytespider [NC]
RewriteRule .* - [F,L]
```

**Cloudflare Firewall Rule:**
```
(http.user_agent contains "Bytespider")
```
Action: Block

**Bytespider** also spoofs user-agent strings. Some publishers report Bytespider traffic disguised under generic browser user-agents. Detecting this requires IP range analysis and behavioral pattern matching.

No payment or licensing pathway exists for **Bytespider**. The crawler does not participate in marketplace systems. The only option is blocking.

### CCBot (Common Crawl) - The Training Data Pipeline for Multiple AI Companies

**Company:** Common Crawl Foundation (non-profit)
**User-Agent:** `CCBot/2.0 (https://commoncrawl.org/faq/)`
**Primary Purpose:** Building open training datasets used by multiple AI companies
**robots.txt Compliance:** Yes

**CCBot** deserves special attention because its data feeds into nearly every major LLM. **OpenAI**, **Anthropic**, **Meta**, and others have all used **Common Crawl** datasets for training. Blocking **CCBot** indirectly reduces your content's presence in multiple AI systems simultaneously.

**Crawl Behavior:**

**Common Crawl** conducts periodic large-scale crawls rather than continuous scraping. When a crawl runs, it hits many pages across your domain. Between crawls, minimal activity.

**Blocking via robots.txt:**

```
User-agent: CCBot
Disallow: /
```

Current data shows 75% of surveyed publishers block **CCBot**. This represents the highest block rate among major AI crawlers, reflecting publishers' recognition of its role as a training data aggregator.

### Applebot-Extended (Apple Intelligence) - New Entrant, Limited Documentation

**Company:** Apple
**User-Agent:** `Applebot-Extended`
**Primary Purpose:** Apple Intelligence features, Siri knowledge
**robots.txt Compliance:** Yes

**Apple** entered the AI training game later than competitors. **Applebot-Extended** operates separately from standard **Applebot** (which handles Siri and Safari suggestions).

Documentation remains limited. Apple's privacy-focused positioning suggests more conservative crawl patterns, but publisher data on this crawler is still accumulating.

**Blocking via robots.txt:**

```
User-agent: Applebot-Extended
Disallow: /
```

As with **Google-Extended**, blocking the extended bot while allowing the standard **Applebot** preserves Safari/Siri functionality while preventing AI training usage.

### Meta-ExternalAgent (Meta AI) - Facebook/Instagram Content Scraping

**Company:** Meta
**User-Agent:** `Meta-ExternalAgent/1.0`
**Primary Purpose:** Training data for Meta AI, Instagram/Facebook AI features
**robots.txt Compliance:** Yes

**Meta** uses this crawler to gather training data for its AI products across Facebook and Instagram platforms. Distinct from Facebookexternalhit (which handles link previews) and standard Meta crawlers.

**Blocking via robots.txt:**

```
User-agent: Meta-ExternalAgent
Disallow: /
```

**Meta**'s AI products compete directly with publisher content in social feeds. Training their models with your content accelerates that competition.

### PerplexityBot (Perplexity AI) - Controversy Over Ignoring robots.txt

**Company:** Perplexity AI
**User-Agent:** `PerplexityBot`
**Primary Purpose:** Real-time retrieval for answer generation
**robots.txt Compliance:** Disputed

**Perplexity** faced public criticism in 2024-2025 for allegedly ignoring robots.txt directives. Multiple publishers documented continued crawling after implementing blocks. **Perplexity** disputed some claims while acknowledging infrastructure issues that may have caused compliance failures.

The controversy illustrates a broader problem: robots.txt is an honor system. Bad actors (or negligent actors) can ignore it without technical consequences.

**Blocking Approach:**

Given compliance concerns, server-level blocking may be more reliable than robots.txt alone:

**robots.txt:**
```
User-agent: PerplexityBot
Disallow: /
```

**Plus server-level enforcement** as backup.

**Perplexity**'s business model (answer engine that competes with search) creates direct content competition. Your article becomes their AI-generated answer. Attribution exists but traffic doesn't flow.

[INTERNAL: RSL Protocol Implementation Guide]

---

## How to Identify Unknown AI Crawlers

### Server Log Analysis Techniques

New AI crawlers appear regularly. The user-agent strings documented above cover major players, but startups and research institutions deploy crawlers constantly.

**Log filtering approach:**

```bash
grep -v "Googlebot\|bingbot\|YandexBot" access.log | grep -i "bot\|crawler\|spider" | cut -d'"' -f6 | sort | uniq -c | sort -rn
```

This excludes known search bots and surfaces other automated traffic. High-frequency unknown user-agents warrant investigation.

**Behavioral signals:**

AI crawlers often exhibit patterns distinct from search indexing:
- Archive-focused crawling (hitting old content without referral context)
- High request rates to content pages, low rates to navigation/index pages
- Consistent access patterns across time (crawlers run on schedules)
- No associated referral traffic (extracting without returning)

### User-Agent String Patterns and Spoofing Detection

Legitimate AI crawlers usually identify themselves clearly. User-agent strings contain company names, documentation URLs, and version numbers.

Suspicious patterns:
- Generic browser user-agents with non-browser behavior patterns
- User-agents claiming to be known crawlers but from unexpected IP ranges
- Rapid sequential requests from IP addresses that should be residential

**Spoofing detection:**

When you see traffic claiming to be **GPTBot** or **ClaudeBot**, verify the source IP against documented ranges. A request claiming `GPTBot` user-agent from a residential IP in Eastern Europe isn't **OpenAI**.

Reverse DNS lookup:
```bash
dig -x [IP_ADDRESS]
```

Legitimate AI crawler IPs resolve to company domains (*.openai.com, *.anthropic.com).

### IP Range Lookup and Reverse DNS Verification

Maintain a reference list of known AI company IP ranges. Cross-reference unknown high-frequency traffic against these ranges.

**ASN lookup** provides another verification layer:

```bash
whois [IP_ADDRESS] | grep -i "orgname\|netname"
```

**OpenAI**, **Anthropic**, **Google**, and **Meta** operate their crawlers from identifiable network infrastructure. Traffic from consumer ISPs or cloud hosting providers (AWS, Azure) claiming AI crawler identity is likely spoofed.

---

## Blocking Strategies: robots.txt vs. Server-Level vs. Cloudflare

### robots.txt Entries for Each Major Crawler

**Comprehensive block list:**

```
# AI Training Crawlers - Blocked

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: PerplexityBot
Disallow: /

# Search Indexing - Allowed

User-agent: Googlebot
Allow: /

User-agent: bingbot
Allow: /
```

This configuration blocks AI training while permitting search indexing. Note that robots.txt is advisory only. Compliant crawlers honor it. Non-compliant crawlers ignore it.

### .htaccess and Nginx Blocking Rules

**Apache (.htaccess):**

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|Bytespider|CCBot|Google-Extended) [NC]
RewriteRule .* - [F,L]
</IfModule>
```

**Nginx:**

```nginx
map $http_user_agent $bad_bot {
    default 0;
    ~*GPTBot 1;
    ~*ClaudeBot 1;
    ~*Bytespider 1;
    ~*CCBot 1;
    ~*Google-Extended 1;
}

server {
    if ($bad_bot) {
        return 403;
    }
}
```

Server-level blocking enforces your policy regardless of crawler compliance. Non-compliant crawlers like **Bytespider** get blocked even when they ignore robots.txt.

### Cloudflare Firewall Rules for AI Bot Management

**Cloudflare** provides the most flexible approach, combining detection, blocking, and monetization options.

**Blocking rule:**

```
(http.user_agent contains "GPTBot") or
(http.user_agent contains "ClaudeBot") or
(http.user_agent contains "Bytespider") or
(http.user_agent contains "CCBot")
```
Action: Block

**Challenge rule** (forces captcha, filters automated traffic):

```
(http.user_agent contains "bot") and
not (http.user_agent contains "Googlebot") and
not (http.user_agent contains "bingbot")
```
Action: Managed Challenge

**Rate limiting** (throttles rather than blocks):

Create a rate limiting rule targeting AI crawler user-agents. This slows extraction without complete blocking, useful if you're testing monetization approaches.

**Cloudflare Pay-Per-Crawl** integrates with these rules. Rather than blocking compliant crawlers like **GPTBot** and **ClaudeBot**, you can require payment for access. Cloudflare handles billing and enforcement.

[INTERNAL: Cloudflare Pay-Per-Crawl Setup Tutorial]

---

## Monitoring Crawler Activity Over Time

### Log Analysis Tools (GoAccess, Matomo, Plausible)

Ongoing monitoring matters. Crawler populations change. New AI companies launch bots. Existing crawlers modify behavior.

**GoAccess** provides real-time log analysis:

```bash
goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED
```

Filter for bot traffic specifically. GoAccess identifies user-agents and IP addresses, revealing which crawlers hit your domain and how often.

**Matomo** and **Plausible** (privacy-focused analytics) can track bot traffic when configured appropriately. Server-side implementations capture data that JavaScript-based analytics miss.

### Setting Up Crawler Activity Alerts

Automate detection of unusual patterns:

**Log-based alerting:**

```bash
# Alert if Bytespider exceeds 1000 requests/day
COUNT=$(grep "Bytespider" /var/log/nginx/access.log | wc -l)
if [ $COUNT -gt 1000 ]; then
    echo "Bytespider activity spike: $COUNT requests" | mail -s "Crawler Alert" admin@example.com
fi
```

**Cloudflare notifications** can trigger on firewall rule matches, traffic spikes from specific user-agents, or rate limit triggering.

Set thresholds based on your baseline. A site that normally sees 200 **ClaudeBot** requests daily should alert at 2,000. Context determines appropriate sensitivity.

### Quarterly Audit Checklist for New AI Bots

Every three months, review:

1. **New user-agents** appearing in logs at significant frequency
2. **IP ranges** associated with high-volume unknown traffic
3. **Behavioral patterns** suggesting undocumented AI crawlers
4. **Industry reports** on newly launched AI company crawlers
5. **Pricing effectiveness** of current monetization approach
6. **Blocking effectiveness** against non-compliant crawlers

The AI crawler landscape evolves faster than documentation. New crawlers from Chinese AI companies, European startups, and academic institutions appear constantly. Quarterly audits catch new entrants before they extract significant value.

---

AI crawler management isn't a one-time configuration. The ecosystem shifts continuously. New players enter. Existing players change behavior. Compliance levels fluctuate.

This directory provides the foundation. Identification methods, blocking techniques, and monitoring approaches remain stable even as specific crawlers change. Apply these frameworks to whatever AI bots appear next.

The choice between blocking and monetizing depends on your content, your resources, and your risk tolerance. Both require the same starting point: knowing exactly who's crawling your domain and what they're doing with your content.

[INTERNAL: RSL Protocol Implementation Guide]
[INTERNAL: Pricing Your Content for AI Training]

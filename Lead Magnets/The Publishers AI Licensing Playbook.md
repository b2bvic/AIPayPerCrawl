# The Publisher's AI Licensing Playbook

**How Mid-Size Publishers Monetize AI Crawlers Without Hiring Licensing Lawyers**

---

## The Problem You Already Know

AI companies scrape your content 73,000 times for every 1 referral they send back.

Anthropic's ClaudeBot. OpenAI's GPTBot. Google's Gemini crawlers. ByteDance's Bytespider. They're training billion-dollar models on your archives while you earn nothing.

The standard response is blocking. 75% of publishers now block CCBot. 69% block ClaudeBot. 62% block GPTBot.

Blocking stops the scraping. It doesn't generate revenue.

Meanwhile, News Corp signed a $250M deal with OpenAI. Reddit licensed to Google for $60M annually. The Financial Times partnered with Anthropic. These publishers aren't blocking. They're billing.

The difference isn't legal teams or traffic scale. It's infrastructure. They built systems to enforce payment for access.

Cloudflare launched Pay-Per-Crawl in July 2025. The RSL protocol (Really Simple Licensing) standardized machine-readable licensing terms. The llms.txt specification lets AI systems understand licensing in natural language context.

The tools exist. Most publishers haven't configured them.

This playbook gives you everything needed to monetize AI crawlers in the next 30 days: configuration checklists, pricing frameworks, file templates, and contract structures.

No licensing lawyers required. No six-figure legal budgets. Just implementation.

---

## The Mechanism: How AI Licensing Works Now

Three technical standards make AI crawler monetization possible:

**Cloudflare Pay-Per-Crawl**

Cloudflare's Bot Management suite now includes per-crawl billing for AI bots. When GPTBot or ClaudeBot requests a page, Cloudflare detects the crawler, checks your pricing, and either allows access (billing the AI company) or blocks/throttles based on your rules.

Payment processing happens through Stripe. You set rates per content section. AI companies that comply get access. Non-payers get blocked.

Setup time: 2-4 hours with this guide.

**RSL Protocol (Really Simple Licensing)**

Created by Dave Winer (RSS co-creator), RSL is a machine-readable file format that communicates licensing terms to AI crawlers.

Your RSL file (hosted at `/rsl.json`) tells AI systems: who you are, what content you're licensing, your pricing model, usage restrictions, and attribution requirements.

Compliant AI companies (OpenAI, Anthropic) read RSL files before scraping. Non-compliant ones (Bytespider) ignore them. RSL works with enforcement layers (like Cloudflare) to give your terms teeth.

**llms.txt Specification**

A human-readable companion to RSL. Hosted at `/llms.txt`, this plain-text file explains your licensing terms in natural language that AI systems can understand in context.

Where RSL is for automated crawler parsing, llms.txt is for retrieval-augmented generation (RAG) systems that read content as context. Claude, for example, parses llms.txt when determining how to use web content in responses.

Together, these three systems create a licensing stack: RSL communicates terms, llms.txt reinforces them contextually, Cloudflare enforces payment.

---

## Part 1: 5-Step Cloudflare Pay-Per-Crawl Configuration

### Step 1: Establish Your Crawler Baseline (45 minutes)

Before setting prices, you need data on current crawler activity.

**Server Log Analysis**

Export 90 days of server logs. Filter for these user-agent strings:

| Crawler | User-Agent Contains | Company |
|---------|---------------------|---------|
| GPTBot | `GPTBot` | OpenAI |
| ClaudeBot | `ClaudeBot` or `anthropic` | Anthropic |
| Google-Extended | `Google-Extended` | Google (Gemini) |
| Bytespider | `Bytespider` | ByteDance |
| CCBot | `CCBot` | Common Crawl |
| Applebot-Extended | `Applebot-Extended` | Apple |
| Meta-ExternalAgent | `Meta-ExternalAgent` | Meta |
| PerplexityBot | `PerplexityBot` | Perplexity |

**Calculate Per-Crawler Metrics**

For each crawler, document:
- Requests per day (average over 90 days)
- Most-requested pages (top 20)
- Request pattern (consistent vs. burst vs. declining)
- robots.txt compliance (are blocked crawlers still appearing?)

**Sample Output Format**

```
ClaudeBot: 340 req/day avg, targets /guides/ and /docs/ sections, consistent pattern, honors robots.txt
GPTBot: 520 req/day avg, targets recent content, requests spike after new posts, honors robots.txt
Bytespider: 8,400 req/day avg, targets everything, ignores robots.txt, IP ranges: 110.242.x.x, 111.206.x.x
```

This baseline tells you which AI companies value your content (high request volume = demand signal) and which ignore your terms (requests despite robots.txt blocks = enforcement target).

### Step 2: Set Pricing Tiers (30 minutes)

**Industry Benchmarks (January 2026)**

| Content Type | Per-Crawl Rate | Reasoning |
|--------------|----------------|-----------|
| News/media | $0.002-$0.005 | High volume, commodity content, frequent updates |
| B2B/trade | $0.008-$0.012 | Specialized knowledge, professional audience, lower substitutability |
| Technical docs | $0.015-$0.025 | Deep expertise, code examples, structured data, high training value |
| Financial data | $0.020-$0.040 | Proprietary analysis, real-time updates, regulatory compliance |
| User-generated | $0.001-$0.003 | High volume, variable quality, requires curation value |

**Pricing Framework**

Your per-crawl rate should reflect:

1. **Content uniqueness** (can AI companies find equivalent content elsewhere?)
2. **Expertise depth** (specialized knowledge vs. surface-level coverage)
3. **Data structure** (tables, code, schemas vs. unstructured prose)
4. **Freshness premium** (breaking news vs. evergreen content)
5. **Crawl volume** (high demand = higher prices, but consider volume discounts)

**Sample Tiered Pricing Structure**

```
Homepage/navigation: $0.001/crawl (low value, navigation-only)
Blog posts (general): $0.004/crawl (commodity content)
Research reports: $0.012/crawl (original analysis)
Technical documentation: $0.018/crawl (specialized knowledge)
Proprietary data/tools: $0.025/crawl (irreplaceable content)
```

**Volume Discount Decision**

Option A: Flat pricing across all crawlers (simplest)
Option B: Volume discounts for high-frequency compliant crawlers (rewards good actors)
Option C: Premium pricing for aggressive crawlers (punishes bad actors before blocking)

Most publishers start with Option A, then adjust to Option B after 60 days of compliance data.

### Step 3: Configure Cloudflare Dashboard (60 minutes)

**Prerequisites**

- Cloudflare Pro plan ($20/month minimum) or higher
- Domain DNS managed through Cloudflare
- Stripe account for payment processing

**Dashboard Navigation**

1. Log into Cloudflare Dashboard
2. Select your domain
3. Navigate to: Security > Bots > Bot Management
4. Enable "AI Crawler Management" (under Bot Management features)

**Detection Configuration**

Under AI Crawler Detection, enable detection for:
- [x] GPTBot (OpenAI)
- [x] ClaudeBot (Anthropic)
- [x] Google-Extended (Google Gemini)
- [x] Bytespider (ByteDance)
- [x] CCBot (Common Crawl)
- [x] Meta-ExternalAgent (Meta)
- [x] PerplexityBot (Perplexity)
- [x] Unknown AI Crawlers (catch-all for new bots)

**Pricing Configuration**

Under AI Crawler Pricing:

1. Click "Add Pricing Rule"
2. Select content path (e.g., `/blog/*`)
3. Set per-crawl rate (e.g., `$0.004`)
4. Set enforcement action for non-payers: `Block` or `Throttle`
5. Repeat for each content tier

**Payment Integration**

Under AI Crawler Billing:

1. Click "Connect Payment Processor"
2. Select Stripe
3. Authorize Cloudflare to create charges
4. Set payout schedule (weekly recommended for monitoring)
5. Set minimum payout threshold ($10 default)

**Grace Period Settings**

Under Enforcement Rules:

- Grace period for new crawlers: 7 days (allows discovery before payment required)
- Rate limit for non-payers: 10 requests/day (allows them to see pricing, can't bulk scrape)
- Block threshold: After 100 unpaid requests, hard block

### Step 4: Deploy RSL and llms.txt Files (45 minutes)

**RSL File Template**

Create `/rsl.json` at your domain root:

```json
{
  "rsl_version": "1.0",
  "licensor": {
    "name": "[Your Publication Name]",
    "domain": "[yourdomain.com]",
    "contact": "[licensing@yourdomain.com]"
  },
  "content_scope": {
    "included": ["/*"],
    "excluded": ["/admin/*", "/internal/*", "/api/*"]
  },
  "licensing_model": {
    "type": "per_crawl",
    "pricing": {
      "default": 0.005,
      "tiers": [
        {"path": "/news/*", "rate": 0.003},
        {"path": "/research/*", "rate": 0.012},
        {"path": "/docs/*", "rate": 0.018}
      ]
    },
    "currency": "USD",
    "billing": {
      "processor": "cloudflare_pay_per_crawl",
      "portal": "https://cloudflare.com/ai-licensing/[your-account]"
    }
  },
  "usage_rights": {
    "training": true,
    "retrieval": true,
    "derivative_works": false,
    "attribution_required": true
  },
  "attribution": {
    "format": "Source: [Publication Name] ([URL])",
    "inline_required": true,
    "link_required": true
  },
  "terms_url": "https://[yourdomain.com]/ai-licensing-terms",
  "updated": "2026-01-19"
}
```

**llms.txt File Template**

Create `/llms.txt` at your domain root:

```
# AI Licensing Terms for [Your Publication Name]
# Last updated: 2026-01-19

## Who We Are
[Your Publication Name] is a [brief description]. Our content represents [years] of [expertise area] coverage.

## Licensing Terms
We license our content to AI systems for training and retrieval purposes under the following terms:

1. PAYMENT REQUIRED: All AI crawler access requires payment through Cloudflare Pay-Per-Crawl. Rates vary by content section ($0.003-$0.018 per crawl). See /rsl.json for programmatic pricing.

2. ATTRIBUTION REQUIRED: Any AI system using our content must attribute "Source: [Publication Name]" with a link to the original content.

3. PROHIBITED USES: Our content may not be used to create derivative publications, competitive products, or misleading attributions.

4. ENFORCEMENT: Crawlers that access content without payment will be blocked. Terms of Service enforcement applies.

## How to Comply
1. Read /rsl.json for machine-readable licensing terms
2. Configure your crawler to check licensing before scraping
3. Pay via Cloudflare Pay-Per-Crawl portal
4. Honor attribution requirements in AI-generated outputs

## Contact
For licensing questions, volume discounts, or direct deals: [licensing@yourdomain.com]

## Technical Implementation
- RSL file: /rsl.json
- robots.txt: See AI-specific directives at /robots.txt
- Cloudflare Pay-Per-Crawl: Enabled
```

**robots.txt Update**

Add to your existing robots.txt:

```
# AI Crawler Licensing
# See /rsl.json for machine-readable terms
# See /llms.txt for human-readable terms

# Compliant crawlers (payment required via Cloudflare Pay-Per-Crawl)
User-agent: GPTBot
Allow: /
# Pricing and payment enforced via Cloudflare

User-agent: ClaudeBot
Allow: /
# Pricing and payment enforced via Cloudflare

User-agent: Google-Extended
Allow: /
# Pricing and payment enforced via Cloudflare

# Non-compliant crawlers (blocked until compliance)
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /
# Contact licensing@[yourdomain.com] for access

# Reference files
Sitemap: https://[yourdomain.com]/sitemap.xml
RSL: https://[yourdomain.com]/rsl.json
```

### Step 5: Validate and Monitor (30 minutes initial, 15 minutes weekly)

**Validation Checklist**

- [ ] RSL file accessible at `https://yourdomain.com/rsl.json`
- [ ] llms.txt accessible at `https://yourdomain.com/llms.txt`
- [ ] Cloudflare AI Crawler Detection showing activity
- [ ] Stripe connected and test payment successful
- [ ] robots.txt updated with AI-specific directives
- [ ] Firewall rules active for blocked crawlers

**First-Week Monitoring**

Check Cloudflare Analytics daily for:
- Detected AI crawler requests (by crawler type)
- Payment compliance rate (paid vs. unpaid requests)
- Blocked requests (non-compliant crawlers)
- Revenue generated (cumulative and per-crawler)

**Expected First-Week Results**

| Metric | Typical Range | Action if Outside Range |
|--------|---------------|------------------------|
| Detection rate | 85-95% of known crawlers | Check user-agent detection rules |
| Compliance rate | 30-50% (OpenAI, Anthropic comply) | Adjust grace period or contact AI companies |
| Revenue | $5-$50 (depends on traffic) | Normal for first week; evaluate at day 30 |
| Block rate | 40-60% (Bytespider, CCBot blocked) | Verify firewall rules triggering |

**Ongoing Monitoring Cadence**

- Week 1-4: Daily checks (15 min)
- Month 2-3: Weekly checks (15 min)
- Month 4+: Monthly checks (30 min) + quarterly pricing review

---

## Part 2: RSL File Templates by Pricing Model

### Template A: Per-Crawl Pricing (Standard)

Best for: Most publishers using Cloudflare Pay-Per-Crawl

```json
{
  "rsl_version": "1.0",
  "licensor": {
    "name": "[Publication]",
    "domain": "[domain.com]",
    "contact": "[email]"
  },
  "content_scope": {
    "included": ["/*"],
    "excluded": ["/admin/*", "/api/*"]
  },
  "licensing_model": {
    "type": "per_crawl",
    "pricing": {
      "default": 0.005,
      "tiers": [
        {"path": "/free/*", "rate": 0.001},
        {"path": "/premium/*", "rate": 0.015}
      ]
    },
    "currency": "USD",
    "billing": {
      "processor": "cloudflare_pay_per_crawl"
    }
  },
  "usage_rights": {
    "training": true,
    "retrieval": true,
    "derivative_works": false,
    "attribution_required": true
  },
  "updated": "[DATE]"
}
```

### Template B: Flat-Rate Annual (Direct Deal Supplement)

Best for: Publishers with direct deals who also want marketplace revenue

```json
{
  "rsl_version": "1.0",
  "licensor": {
    "name": "[Publication]",
    "domain": "[domain.com]",
    "contact": "[email]"
  },
  "content_scope": {
    "included": ["/*"],
    "excluded": ["/licensed-partners/*", "/admin/*"]
  },
  "licensing_model": {
    "type": "flat_annual",
    "pricing": {
      "archive_access": 50000,
      "realtime_api": 15000,
      "full_access": 60000
    },
    "currency": "USD",
    "billing": {
      "processor": "direct_invoice",
      "contact": "[licensing@domain.com]"
    }
  },
  "usage_rights": {
    "training": true,
    "retrieval": true,
    "derivative_works": "negotiable",
    "attribution_required": true,
    "exclusivity": false
  },
  "existing_licensees": ["OpenAI", "Anthropic"],
  "updated": "[DATE]"
}
```

### Template C: Hybrid (Base Fee + Usage Overage)

Best for: High-value archives with variable crawl volume

```json
{
  "rsl_version": "1.0",
  "licensor": {
    "name": "[Publication]",
    "domain": "[domain.com]",
    "contact": "[email]"
  },
  "content_scope": {
    "included": ["/*"],
    "excluded": ["/admin/*"]
  },
  "licensing_model": {
    "type": "hybrid",
    "pricing": {
      "base_monthly": 500,
      "included_crawls": 10000,
      "overage_rate": 0.008
    },
    "currency": "USD",
    "billing": {
      "processor": "cloudflare_pay_per_crawl",
      "base_invoice": "direct"
    }
  },
  "usage_rights": {
    "training": true,
    "retrieval": true,
    "derivative_works": false,
    "attribution_required": true
  },
  "updated": "[DATE]"
}
```

---

## Part 3: llms.txt Templates by Site Type

### Template: News/Media Site

```
# AI Licensing Terms for [News Publication]
# Updated: [DATE]

## About This Publication
[Publication] provides [daily/weekly] news coverage of [topic area]. Our archives include [X years] of journalism from [X] reporters and editors.

## Content Value
Our content is valuable to AI systems because:
- Original reporting (not aggregated from other sources)
- Expert analysis from [beat] specialists
- Real-time updates on [industry/topic] developments
- [X] million articles spanning [years] of coverage

## Licensing Structure
All AI access requires payment via Cloudflare Pay-Per-Crawl.

RATES:
- Breaking news: $0.003/crawl
- Analysis/opinion: $0.005/crawl
- Investigative/long-form: $0.008/crawl
- Archives (>2 years old): $0.002/crawl

See /rsl.json for programmatic pricing.

## Attribution Standard
"Source: [Publication] (https://[domain]/[path])"

All AI-generated content using our material must include this attribution inline, linked to the original article.

## Prohibited Uses
- Creating competing news products
- Summarizing without attribution
- Training models that generate misleading content attributed to us

## Contact
Volume discounts, direct deals, API access: [email]
```

### Template: B2B/Trade Publication

```
# AI Licensing Terms for [Trade Publication]
# Updated: [DATE]

## About This Publication
[Publication] serves [industry] professionals with [content types]. Our editorial team includes former [practitioners/executives] with [X] years of combined industry experience.

## Content Value
Our content has high AI training value because:
- Specialized industry knowledge not available in mainstream sources
- Technical accuracy reviewed by subject matter experts
- Proprietary research and benchmarking data
- Professional audience ensures high-quality discourse

## Licensing Structure
All AI access requires payment via Cloudflare Pay-Per-Crawl.

RATES:
- Industry news: $0.006/crawl
- How-to guides: $0.010/crawl
- Research reports: $0.015/crawl
- Benchmarking data: $0.020/crawl

Volume discount available for 50,000+ monthly crawls. Contact [email].

## Attribution Standard
"Source: [Publication] - The [Industry] Authority (https://[domain]/[path])"

## Restricted Content
/members-only/* requires direct licensing agreement. Cloudflare Pay-Per-Crawl does not apply to member content.

## Contact
Enterprise licensing, API access, custom integrations: [email]
```

### Template: Technical Documentation Site

```
# AI Licensing Terms for [Product/Platform] Documentation
# Updated: [DATE]

## About This Documentation
Official documentation for [Product]. Covers [APIs, SDKs, integration guides, reference materials]. Maintained by [X]-person technical writing team.

## Content Value
Our documentation is high-value AI training data because:
- Accurate code examples tested against production systems
- Structured data (API schemas, configuration formats)
- Version-specific guidance for [X] product versions
- Integration patterns for [Y] third-party systems

## Licensing Structure
All AI access requires payment via Cloudflare Pay-Per-Crawl.

RATES:
- Getting started guides: $0.010/crawl
- API reference: $0.020/crawl
- Code examples: $0.025/crawl
- Troubleshooting/FAQ: $0.015/crawl

## Usage Rights
ALLOWED:
- Training AI systems to understand [Product] usage
- Retrieval-augmented generation for user support
- Code completion suggestions based on our patterns

NOT ALLOWED:
- Creating competing documentation
- Embedding code examples without attribution
- Training models to generate deprecated/incorrect code

## Attribution Standard
"Documentation source: [Product] Docs (https://docs.[domain]/[path])"

## Contact
Documentation partnerships, embedded AI integrations: [email]
```

---

## Part 4: Pricing Calculator

### Input Variables

Fill in your site-specific data:

| Variable | Your Value | Notes |
|----------|------------|-------|
| Monthly pageviews | _______ | From analytics |
| AI crawler requests/month | _______ | From server logs (Step 1) |
| Content uniqueness score (1-5) | _______ | 1=commodity, 5=irreplaceable |
| Primary content type | _______ | News, B2B, technical, UGC |
| Archive depth (years) | _______ | How far back does content go |

### Calculation

**Base Rate Selection**

| Content Type | Base Rate |
|--------------|-----------|
| News/media | $0.003 |
| B2B/trade | $0.008 |
| Technical docs | $0.015 |
| Financial data | $0.025 |
| User-generated | $0.002 |

**Uniqueness Multiplier**

| Score | Multiplier | Description |
|-------|------------|-------------|
| 1 | 0.5x | Commodity content, widely available elsewhere |
| 2 | 0.75x | Some unique value, but substitutes exist |
| 3 | 1.0x | Moderate uniqueness, limited substitutes |
| 4 | 1.5x | High uniqueness, few direct substitutes |
| 5 | 2.0x | Irreplaceable, no substitutes available |

**Archive Premium**

| Archive Depth | Premium |
|---------------|---------|
| <2 years | 0% |
| 2-5 years | +10% |
| 5-10 years | +20% |
| 10+ years | +30% |

**Formula**

```
Suggested Per-Crawl Rate = Base Rate x Uniqueness Multiplier x (1 + Archive Premium)

Monthly Revenue Estimate = AI Crawler Requests x Per-Crawl Rate x Compliance Rate (assume 40%)
```

**Example Calculation**

- Content type: B2B/trade (base rate: $0.008)
- Uniqueness score: 4 (multiplier: 1.5x)
- Archive depth: 7 years (premium: +20%)
- AI crawler requests/month: 25,000

```
Per-Crawl Rate = $0.008 x 1.5 x 1.2 = $0.0144 (round to $0.015)

Monthly Revenue = 25,000 x $0.015 x 0.40 = $150/month
Annual Revenue = $1,800
```

Adjust pricing up or down based on first 30 days of compliance data.

---

## Part 5: Sample Licensing Contracts

### Contract 1: Per-Crawl Licensing Agreement (Cloudflare Marketplace)

**Parties**: [Publisher Name] ("Licensor") and [AI Company Name] ("Licensee")

**Effective Date**: [Date]

**1. GRANT OF LICENSE**

Licensor grants Licensee a non-exclusive, worldwide license to access and use Licensor's web content for AI training and retrieval purposes, subject to the terms below.

**2. CONTENT SCOPE**

Licensed content includes all publicly accessible content at [domain.com], excluding:
- Content behind authentication
- Paths specified in robots.txt as disallowed
- Content explicitly marked as "not for AI licensing"

**3. PRICING AND PAYMENT**

3.1 Licensee shall pay Licensor per-crawl fees as specified in Licensor's RSL file (/rsl.json).

3.2 Payment shall be processed through Cloudflare Pay-Per-Crawl. Licensee's crawler must authenticate with Cloudflare's billing system.

3.3 Current rates (subject to change with 30 days notice):
- [Path 1]: $[rate]/crawl
- [Path 2]: $[rate]/crawl
- Default: $[rate]/crawl

**4. USAGE RIGHTS**

4.1 PERMITTED: Training AI models, retrieval-augmented generation, semantic search indexing.

4.2 PROHIBITED: Creating derivative publications, redistributing content, removing attribution, training models that generate misleading content attributed to Licensor.

**5. ATTRIBUTION**

Licensee's AI systems must attribute Licensor's content as: "Source: [Publication Name] ([URL])"

Attribution must appear inline with any AI-generated content that relies on Licensed content.

**6. TERM AND TERMINATION**

6.1 This Agreement is effective upon Licensee's first paid crawl and continues month-to-month.

6.2 Either party may terminate with 30 days written notice.

6.3 Upon termination, Licensee must cease all crawling within 48 hours.

**7. COMPLIANCE MONITORING**

7.1 Licensee shall make good-faith efforts to ensure crawler compliance with these terms.

7.2 Licensor may audit crawl patterns through server logs and Cloudflare analytics.

7.3 Non-compliance results in immediate access revocation.

**8. LIMITATION OF LIABILITY**

Neither party shall be liable for indirect, incidental, or consequential damages.

**9. GOVERNING LAW**

This Agreement shall be governed by the laws of [State/Country].

---

### Contract 2: Flat-Rate Annual Agreement (Direct Deal)

**Parties**: [Publisher Name] ("Licensor") and [AI Company Name] ("Licensee")

**Effective Date**: [Date]

**Term**: [X] years from Effective Date

**1. GRANT OF LICENSE**

Licensor grants Licensee a non-exclusive license to access, download, and use Licensor's content archive for AI training and retrieval purposes.

**2. CONTENT SCOPE**

2.1 INCLUDED:
- All articles published between [Start Date] and [End Date]
- Real-time access to new content via API (if applicable)
- Metadata (titles, dates, authors, categories)

2.2 EXCLUDED:
- Subscriber-only content (unless separately negotiated)
- Third-party syndicated content
- User comments/submissions

**3. LICENSE FEE**

3.1 Licensee shall pay Licensor $[Amount] annually, payable in advance on each anniversary of the Effective Date.

3.2 Payment terms: Net 30 from invoice date.

3.3 Fee is non-refundable, regardless of actual usage.

**4. ATTRIBUTION REQUIREMENTS**

4.1 Licensee's AI products must attribute Licensor when using Licensed content.

4.2 Attribution format: "[Publication Name] ([URL])" appearing inline or in a sources section.

4.3 Licensee shall make reasonable efforts to ensure attribution appears in AI-generated outputs that rely substantially on Licensed content.

**5. AUDIT RIGHTS**

5.1 Licensor may request quarterly usage reports showing:
- Number of Licensed articles accessed
- Number of AI-generated responses citing Licensor
- Traffic referred to Licensor from AI product

5.2 Licensee shall provide reports within 30 days of request.

**6. EXCLUSIVITY**

This license is NON-EXCLUSIVE. Licensor retains the right to license content to other AI companies, publishers, or platforms.

**7. RENEWAL**

7.1 This Agreement renews automatically unless either party provides 90 days written notice of non-renewal.

7.2 License fee for renewal terms may be adjusted with 60 days notice, subject to negotiation.

**8. TERMINATION**

8.1 Either party may terminate for material breach with 30 days notice and opportunity to cure.

8.2 Licensee's obligation to cease using Licensed content survives termination.

---

### Contract 3: Attribution-Heavy Agreement (Traffic + Revenue Share)

**Parties**: [Publisher Name] ("Licensor") and [AI Company Name] ("Licensee")

**Effective Date**: [Date]

**1. GRANT OF LICENSE**

Licensor grants Licensee a non-exclusive license to use content for AI products, with emphasis on driving traffic and visibility to Licensor.

**2. COMPENSATION STRUCTURE**

2.1 BASE FEE: $[Amount]/year (lower than standard flat-rate)

2.2 ATTRIBUTION BONUS: $[X] per 1,000 attributed citations in AI-generated outputs

2.3 TRAFFIC BONUS: $[X] per 1,000 referral visits from Licensee's AI products to Licensor's site

2.4 REVENUE SHARE: [X]% of Licensee's subscription revenue attributable to queries answered using Licensor's content (measurement methodology to be agreed)

**3. ATTRIBUTION REQUIREMENTS (STRICT)**

3.1 Every AI-generated output that uses Licensed content must include inline attribution.

3.2 Attribution must be a clickable link to the source article.

3.3 Licensee shall implement "read more" or "full article" functionality where feasible.

3.4 Licensee's AI must not summarize Licensed content in a way that eliminates user need to visit source.

**4. TRAFFIC MEASUREMENT**

4.1 Licensee shall implement referral tracking (UTM parameters or equivalent).

4.2 Traffic reports provided monthly, within 15 days of month end.

4.3 Disputed traffic claims resolved by independent analytics audit.

**5. CONTENT PRESENTATION**

5.1 Licensee's AI shall present Licensor's content prominently, not buried in citations.

5.2 Licensor's brand must appear in attribution (not just domain name).

**6. PERFORMANCE REVIEW**

6.1 Parties shall review performance quarterly.

6.2 If referral traffic falls below [X] visits/month for two consecutive quarters, Licensor may terminate or renegotiate.

---

## Part 6: robots.txt Configurations

### Configuration A: Block All AI Crawlers (Pre-Monetization)

Use while negotiating or building direct deal pipeline.

```
# AI Crawlers - BLOCKED pending licensing agreement
# Contact licensing@[domain.com] for access

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
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

# Search crawlers - ALLOWED
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

### Configuration B: License via Cloudflare (Pay-Per-Crawl Active)

Use once Cloudflare Pay-Per-Crawl is configured and accepting payments.

```
# AI Crawlers - Payment required via Cloudflare Pay-Per-Crawl
# See /rsl.json for pricing | See /llms.txt for terms

User-agent: GPTBot
Allow: /
# Pricing enforced via Cloudflare

User-agent: ClaudeBot
Allow: /
# Pricing enforced via Cloudflare

User-agent: Google-Extended
Allow: /
# Pricing enforced via Cloudflare

# Blocked crawlers (non-compliant)
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

# Reference files
RSL: https://[domain.com]/rsl.json
```

### Configuration C: Hybrid (Some Direct Deals + Marketplace)

Use when you have direct deals with some AI companies but want marketplace revenue from others.

```
# AI Licensing Status by Company
# Updated: [DATE]

# DIRECT DEAL - OpenAI (licensed via contract)
User-agent: GPTBot
Allow: /

# DIRECT DEAL - Anthropic (licensed via contract)
User-agent: ClaudeBot
Allow: /

# MARKETPLACE - Google (via Cloudflare Pay-Per-Crawl)
User-agent: Google-Extended
Allow: /
# Payment enforced via Cloudflare

# BLOCKED - ByteDance (non-compliant)
User-agent: Bytespider
Disallow: /

# BLOCKED - Common Crawl (pending negotiation)
User-agent: CCBot
Disallow: /
# Contact licensing@[domain.com] for access

# Reference
RSL: https://[domain.com]/rsl.json
```

---

## Proof: What Publishers Are Earning

**Case Study: B2B Trade Publication**

- Traffic: 8M monthly pageviews
- AI crawler activity: 14,000 requests/day
- Implementation: Cloudflare Pay-Per-Crawl + RSL
- Pricing: Tiered ($0.003-$0.020/crawl)
- Results after 9 months: $1,200/month average
- Compliance rate: 38% (OpenAI, Anthropic pay; Bytespider blocked)
- Setup time: 6 hours

**Case Study: Technical Documentation Site**

- Traffic: 12M monthly pageviews
- AI crawler activity: 8,000 requests/day
- Implementation: Direct deal with OpenAI
- Pricing: $8M flat fee (5-year license)
- Setup time: 6 months (negotiation + legal)

**Industry Data: Cloudflare Pay-Per-Crawl Aggregate**

- Average publisher compliance rate: 35-45%
- OpenAI compliance: 85%+ (pays via Cloudflare)
- Anthropic compliance: 90%+ (pays via Cloudflare)
- Bytespider compliance: <5% (mostly blocked)
- Average monthly revenue: $500-$5,000 (varies by traffic and pricing)

---

## What To Do Next

**Option 1: DIY Implementation**

Follow the 5-step checklist in Part 1. Budget 4-6 hours. Use the templates in Parts 2-6. Monitor weekly for first month, adjust pricing based on compliance data.

**Option 2: Guided Implementation**

Book a $2,500 Implementation Package. I audit your crawler activity, recommend pricing, configure Cloudflare, deploy RSL/llms.txt, monitor for 14 days, and hand off with documentation. Done in 3 weeks.

**Option 3: Enterprise Direct Deal**

If you're 50M+ monthly pageviews or have irreplaceable niche data, skip Cloudflare and negotiate directly with OpenAI/Anthropic/Google. $25,000 Enterprise Package includes content valuation, negotiation strategy, contract drafting, and deal execution support.

**Contact**

Questions, consulting inquiries, or feedback:
- Email: victor@aipaypercrawl.com
- Site: aipaypercrawl.com

---

## Bonus: Two Follow-Up Lessons

**Week 1 Email: Common Setup Mistakes (Arriving in 7 days)**

The four ways publishers break AI crawler monetization and how to avoid them.

**Week 2 Email: Enforcement Strategies (Arriving in 14 days)**

What to do when AI companies ignore your terms. Legal options, public pressure tactics, and Cloudflare escalation paths.

---

*The Publisher's AI Licensing Playbook v1.0*
*aipaypercrawl.com*
*January 2026*

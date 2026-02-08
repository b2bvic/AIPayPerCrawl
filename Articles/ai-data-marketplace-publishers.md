---
title:: AI Data Marketplace for Publishers: How to License Content Through Data Exchanges and Aggregation Platforms
description:: Discover how publishers sell training data through AI data marketplaces, aggregation platforms, and collective licensing exchanges to monetize content at scale.
focus_keyword:: AI data marketplace publishers
category:: ai-monetization
author:: Victor Valentine Romo
date:: 2026.02.08
---

# AI Data Marketplace for Publishers: How to License Content Through Data Exchanges and Aggregation Platforms

**AI data marketplaces** aggregate publisher content into licensable datasets, enabling smaller publishers to monetize training data without negotiating individual deals with **OpenAI**, **Anthropic**, or **Google**. Where direct licensing requires scale—**The New York Times** commands multi-million dollar contracts—marketplaces pool thousands of publishers into collective datasets priced for enterprise AI buyers. These exchanges operate as intermediaries, handling licensing terms, revenue distribution, content delivery infrastructure, and compliance, transforming fragmented web content into packaged training corpora.

## The Direct Licensing Barrier

AI companies prioritize large publishers for direct content deals. **OpenAI's** partnerships with **News Corp**, **The Atlantic**, and **Vox Media** reflect this: established brands, millions of monthly pageviews, decades of archives. Small publishers—local news sites, niche blogs, specialty trade publications—lack negotiation leverage.

**Why AI Labs Avoid Small Publisher Deals**

Transaction costs dominate small agreements. Negotiating a $10,000/year licensing contract costs **OpenAI** the same legal overhead as a $10 million deal—attorneys review terms, compliance teams audit content rights, engineers integrate data pipelines. At small scales, deal complexity exceeds deal value.

Content fragmentation compounds this. **GPT-4.5** training might benefit from 50,000 small publisher sites—but negotiating 50,000 individual contracts is operationally infeasible. AI companies default to bulk web scraping via **Common Crawl** rather than licensing countless micro-publishers.

Quality uncertainty further discourages direct deals. Large publishers have brand reputations; AI companies know **NYT** content meets quality bars. Unknown blogs require evaluation—manual review doesn't scale to millions of potential sources.

The market failure: valuable small-publisher content goes unlicensed because transaction costs exceed per-publisher value. Marketplaces solve this by amortizing costs across aggregated inventory.

## How AI Data Marketplaces Work

Marketplaces standardize licensing, aggregate supply, and distribute revenue—applying the **Spotify** model to training data.

**Core Marketplace Functions**

**1. Publisher Onboarding**
Publishers submit content via APIs, RSS feeds, or sitemaps. Marketplaces ingest articles, metadata (author, date, category), and usage rights documentation (confirming publishers own or control licensing rights).

**2. Content Curation and Quality Control**
Marketplaces filter low-quality content—AI-generated slop, scraped material, copyright-infringing text. Curation increases dataset value, justifying premium pricing. Some marketplaces use AI quality scoring; others employ human reviewers.

**3. Licensing to AI Companies**
Marketplaces negotiate bulk deals with **OpenAI**, **Anthropic**, **Google**, **Meta**, and enterprise AI buyers. A single contract licenses millions of articles from thousands of publishers. AI companies pay marketplace operators, who distribute revenue to publishers.

**4. Revenue Distribution**
Payment models vary:
- **Per-article basis**: Each article consumed pays a fixed amount ($0.01-$0.10 depending on length, quality, recency)
- **Pageview-equivalent model**: AI crawler traffic treated like human traffic, paying CPM rates ($1-$5 per 1,000 crawled pages)
- **Content value scoring**: Premium content (investigative journalism, technical guides) earns multiples of baseline rates

**5. Content Delivery Infrastructure**
Marketplaces host datasets or provide APIs enabling AI companies to crawl efficiently. This offloads bandwidth costs from publishers, prevents infrastructure overload, and enables usage tracking.

**6. Compliance and Auditing**
Marketplaces enforce robots.txt equivalents, honor content removal requests (GDPR right to be forgotten), and audit AI company usage—ensuring licensed content isn't redistributed beyond contract terms.

## Existing AI Data Marketplace Platforms

Several platforms emerged 2023-2026 targeting publisher-to-AI licensing.

### Datarade

**Datarade** operates a marketplace connecting data providers (publishers, data brokers, web scrapers) with buyers (AI companies, hedge funds, market researchers). Publishers list datasets—e.g., "50,000 health & wellness articles, 2020-2026"—and buyers purchase access.

**Publisher Process:**
1. Create Datarade account, submit sample content
2. Define dataset parameters (topic, date range, update frequency)
3. Set pricing (one-time fee or subscription)
4. Datarade lists dataset, handles transactions, takes 20-30% commission

**Pros:** Flexible pricing, multi-buyer potential (AI companies, financial firms, research institutions).
**Cons:** Publishers handle curation themselves; limited quality guarantees may reduce buyer interest.

**Best for:** Publishers with niche datasets (legal filings, scientific abstracts, historical archives) where specialization carries premium.

### Narrative.io

**Narrative** aggregates "data streams"—continuous feeds of structured information. Originally focused on advertising data, Narrative expanded to AI training datasets in 2024.

Publishers integrate via API:

```python
import narrative_sdk

client = narrative_sdk.Client(api_key='your_key')
dataset = client.create_dataset(
    name='Tech Industry Analysis',
    description='5,000 articles on SaaS, cloud computing, AI',
    price_per_mb=0.50
)
```

Buyers query datasets via SQL-like interface, paying per query or subscription.

**Revenue Model:** Buyers pay Narrative, Narrative pays publishers based on query volume (data accessed, not just listed).

**Pros:** Real-time monetization—earn revenue as AI companies consume content, not upfront.
**Cons:** Requires technical integration (API setup); low-traffic publishers may earn minimal revenue.

**Best for:** Publishers with frequent content updates, technical capacity for API integration.

### Reworkd.ai Data Marketplace

**Reworkd** (formerly focused on web scraping automation) launched a marketplace in 2025 specifically for AI training data. Publishers submit sitemaps; Reworkd crawls, structures, and packages content.

**Publisher Onboarding:**
1. Submit domain and sitemap URL
2. Reworkd crawls site, extracts articles, classifies by topic
3. Publisher reviews content inventory, confirms licensing rights
4. Reworkd lists dataset to AI buyers (anonymized—buyers see "10,000 finance articles" without knowing specific publishers)

**Revenue Split:** 70% to publishers, 30% to Reworkd.

**Pros:** Minimal publisher effort—Reworkd handles crawling, structuring, anonymization.
**Cons:** Lower revenue share than direct deals; anonymization prevents brand leverage.

**Best for:** Small publishers without legal/engineering resources for direct licensing.

### Bright Data Marketplace

**Bright Data** (formerly Luminati) operates web scraping infrastructure. Their marketplace lets data sellers (including publishers) offer pre-scraped datasets.

Publishers can:
- Upload existing content archives
- Grant Bright Data crawler access to scrape sites
- Define access terms (one-time, subscription, API)

Buyers include AI companies, though Bright Data's primary market is business intelligence and market research.

**Revenue Model:** Negotiated pricing per dataset; Bright Data takes commission.

**Pros:** Established platform with enterprise buyers; strong compliance infrastructure (GDPR, CCPA).
**Cons:** Competes with scraped public data—buyers may prefer cheaper web scraping over publisher-licensed datasets.

**Best for:** Publishers with paywalled or non-public content that scrapers can't access freely.

### Hugging Face Datasets

**Hugging Face** hosts open-source AI datasets. Publishers can upload content under Creative Commons or custom licenses, setting terms for commercial use.

While not a traditional marketplace (most datasets are free), Hugging Face enables:
- Gated datasets (require approval for access)
- Custom licensing terms (e.g., "free for research, $X for commercial use")
- Usage tracking (see which AI models train on your data)

**Revenue Model:** Publishers set license fees; Hugging Face doesn't take commission but doesn't handle payment processing (publishers invoice buyers directly).

**Pros:** Direct connection to AI researchers/companies; transparency (see who uses data).
**Cons:** Payment logistics cumbersome; primarily oriented toward open data.

**Best for:** Academic publishers, research institutions, publishers prioritizing attribution over revenue.

## Building a Private Data Marketplace

Publishers with sufficient scale may bypass third-party marketplaces and operate proprietary licensing platforms—retaining 100% revenue and full control.

### Infrastructure Requirements

**Content Catalog**
Database indexing all licensable content: articles, publication dates, authors, topics, word counts, media assets. Enables buyers to query inventory ("Show me 10,000 articles about renewable energy published 2023-2025").

**Access Control System**
API authentication ensuring only licensed AI companies access content. Implement rate limiting, usage tracking, and overage billing.

**Billing and Metering**
Track content consumption per licensee. If **Anthropic** licenses 1 million articles at $0.05/article, meter actual crawls and bill accordingly.

**Legal and Compliance**
Terms of service, DPAs (data processing agreements), audit rights, content removal mechanisms (GDPR compliance).

### Reference Architecture

```
┌─────────────────┐
│  Publisher CMS  │
└────────┬────────┘
         │
         v
┌─────────────────────────────┐
│  Licensing API Gateway      │
│  - Authentication           │
│  - Rate limiting            │
│  - Usage metering           │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  Content Delivery           │
│  - Structured feeds (JSON)  │
│  - Full-text access         │
│  - Metadata enrichment      │
└─────────────────────────────┘
```

**Sample API Endpoint:**

```bash
# AI company authenticates
curl -H "Authorization: Bearer LICENSE_KEY" \
     https://publisher.com/api/v1/content?category=technology&limit=1000
```

Returns JSON:

```json
{
  "articles": [
    {
      "id": "article-12345",
      "title": "...",
      "body": "...",
      "published": "2025-06-15",
      "author": "Jane Doe",
      "category": "technology"
    }
  ],
  "usage": {
    "consumed": 1000,
    "remaining": 999000,
    "billing_period": "2026-02"
  }
}
```

This enables [API gateway access controls](api-gateway-ai-crawler-access.html) with built-in monetization.

### Operational Challenges

**Buyer Acquisition**
**OpenAI** and **Google** have established data sourcing pipelines. Breaking into their procurement requires direct outreach, proof of content quality, and competitive pricing.

**Technical Integration**
Each AI company prefers different data formats (JSON-LD, Parquet, raw HTML). Supporting multiple formats increases engineering overhead.

**Quality Assurance**
Buyers demand content curation. If 20% of your catalog is low-quality filler, buyers discount pricing or reject deals.

**Competitive Pricing**
AI companies can scrape public web content free (legal gray area but common practice). Licensed content must justify premiums via exclusivity, freshness, or quality.

Publishers without mid-seven-figure annual revenue from licensing likely can't justify private marketplace infrastructure costs—better to join aggregated marketplaces.

## Collective Licensing: Publisher Coalitions

Trade associations and industry groups negotiate collective licensing on behalf of members, pooling negotiation power.

### News Media Alliance

**NMA** represents 2,000+ news publishers. In 2024, NMA negotiated framework agreements with **OpenAI** and **Google**, establishing baseline licensing terms: attribution requirements, audit rights, minimum per-article pricing.

Individual members opt in, using NMA templates to close deals faster than solo negotiation. NMA doesn't take revenue share—members pay membership dues instead.

**Advantages:**
- Legal and negotiation costs shared across members
- Collective leverage (AI companies prefer one negotiation covering many publishers)
- Standardized terms reduce complexity

**Disadvantages:**
- One-size-fits-all terms may not suit specialized publishers
- Requires trust in coalition governance
- Slower decision-making (consensus-building across hundreds of members)

### Local Media Association (LMA)

**LMA** focuses on regional and local news publishers—outlets with high community value but low individual negotiation power. LMA's data licensing initiative aggregates local news archives, offering AI companies comprehensive geographic coverage.

AI companies training on local events, regional dialects, community issues license LMA's collective dataset rather than negotiating city-by-city.

**Revenue Distribution:**
Based on content contribution (articles submitted) and quality scoring. High-engagement local investigative journalism earns premium rates; syndicated wire service content earns baseline.

### Specialty Publisher Networks

Vertical-specific coalitions (legal publishers, medical journals, trade publications) aggregate niche expertise. **LexisNexis**, for example, licenses legal content collectively—individual law firms and bar associations contribute, LexisNexis handles AI company deals.

AI training on legal reasoning, medical diagnostics, or technical standards requires authoritative sources. Collective licensing packages credibility—buyers trust vetted coalitions over random web scrapers.

## Revenue Models in Data Marketplaces

Marketplaces and AI companies negotiate pricing; publishers receive allocated shares. Common models:

### Per-Article Licensing

Flat fee per article consumed. Typical rates (as of 2026):
- **News articles**: $0.02-$0.10/article
- **Long-form content**: $0.25-$1.00/article
- **Technical documentation**: $0.50-$2.00/article (higher value for specialized knowledge)
- **Multimedia content**: Additional fees for images ($0.10), videos ($1.00)

**Calculation Example:**
Publisher contributes 5,000 articles to marketplace. AI company licenses dataset including those articles. If 3,000 get crawled at $0.05 each, publisher earns $150 (minus marketplace commission).

### Subscription Models

AI companies pay recurring fees for ongoing access. Marketplace distributes revenue based on consumption.

**Anthropic** might pay marketplace $500,000/year for access to 100 publishers' content. Marketplace tracks which publishers **ClaudeBot** crawls most, allocating revenue proportionally.

Publisher A (10% of crawls) receives $50,000. Publisher B (0.5% of crawls) receives $2,500.

### Crawl-Traffic CPM

Treat AI crawler requests like ad impressions. Traditional display ads pay $1-$10 CPM; AI training CPM might be $2-$5 CPM.

If **GPTBot** crawls 100,000 pages from your site monthly, revenue at $3 CPM = $300/month.

Marketplaces meter crawler traffic via log analysis, bill AI companies, distribute revenue to publishers.

### Tiered Value Pricing

Premium content earns multiples of baseline rates. Marketplaces score articles by:
- **Word count** (longer = higher value)
- **Engagement metrics** (high social shares, comments)
- **Author credentials** (expert bylines worth more)
- **Freshness** (recent content commands premium over archives)

A 3,000-word investigative article by a Pulitzer winner published this month might earn 10x baseline rate versus a 300-word blog post from an anonymous author from 2015.

## Content Metadata and Enrichment

Raw HTML isn't enough. AI companies buying training data demand structured metadata enabling selective training—e.g., "only train on articles about climate science published after 2020."

Marketplaces add metadata layers increasing dataset value.

### Standard Metadata Fields

- **Title, author, publication date**
- **Category/topic** (via taxonomy like IAB Content Categories)
- **Named entities** (people, organizations, locations mentioned)
- **Sentiment** (positive/negative/neutral tone)
- **Reading level** (Flesch-Kincaid score)
- **Language** (primary and detected languages)
- **Geographic focus** (articles about specific regions)

### Proprietary Enrichment

Some marketplaces differentiate via advanced enrichment:
- **Fact-checking annotations** (claims verified against databases)
- **Bias scoring** (political lean detection)
- **Source credibility** (publisher reputation scores)
- **Update frequency** (how often articles get revised)

These enrichments justify premium pricing. AI companies training **Claude** or **Gemini** on factually verified, low-bias content pay more than for unvetted web scrapes.

### Schema.org Structured Data

Publishers implementing **Schema.org** markup (Article, NewsArticle, Person, Organization schemas) ease marketplace integration. Marketplaces ingest structured data directly without parsing HTML.

Example:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "AI Data Marketplaces Grow 300% in 2025",
  "author": {
    "@type": "Person",
    "name": "Victor Valentine Romo"
  },
  "datePublished": "2026-02-08",
  "articleSection": "Technology",
  "wordCount": 2800
}
</script>
```

This reduces marketplace curation costs, increasing publisher revenue share.

## Choosing the Right Marketplace

Not all marketplaces suit all publishers. Selection criteria:

### Revenue Share

Compare commission structures:
- **Datarade**: 20-30% commission
- **Reworkd**: 30% commission
- **Narrative**: Variable based on query volume
- **Private marketplace**: 0% commission but high operational costs

Calculate breakeven. If Reworkd charges 30% but handles all licensing infrastructure, vs. private marketplace retaining 100% but costing $50,000/year to operate, Reworkd is better unless annual licensing revenue exceeds $167,000 (breakeven point where 70% of $238,000 = $167,000 after paying $71,000 commission).

### Buyer Access

Which AI companies buy from the marketplace?
- If **OpenAI** and **Anthropic** source from Marketplace A but not B, choose A
- Enterprise-focused marketplaces (targeting corporate AI teams) may pay more per article but have smaller buyer pools

### Licensing Terms

What restrictions apply?
- **Exclusivity**: Some marketplaces demand exclusive rights (can't list same content elsewhere)
- **Usage scope**: Training-only vs. inference-time retrieval (RAG systems)
- **Attribution**: Do AI companies cite publishers, driving referral traffic?

Read marketplace agreements carefully. Exclusive deals lock you in; non-exclusive lets you multi-home.

### Content Control

Can you remove content post-licensing?
- GDPR right-to-deletion requires content removal upon request
- If marketplace can't de-index content from AI company pipelines, compliance risk emerges

Ensure marketplaces include content removal provisions in AI company contracts.

### Payment Terms

How often do you get paid?
- Monthly (best for cash flow)
- Quarterly (common)
- Annually (avoid unless upfront advance payment)

Some marketplaces pay only after reaching minimum thresholds ($100, $500). Small publishers may wait months for first payment.

## Legal and Copyright Considerations

Licensing content to AI companies via marketplaces requires confirming you have the rights to do so.

### Works for Hire

Content created by employees typically belongs to the publisher (work-for-hire doctrine). This is licensable without additional permissions.

### Freelance Contributors

Contracts with freelancers must grant licensing rights. If freelancers retain copyright, you may need:
- Additional licensing agreements permitting AI training use
- Retroactive permissions for existing content
- Revenue sharing with authors (if contracts stipulate)

Review contributor agreements before submitting content to marketplaces.

### User-Generated Content

Comments, forum posts, social media content hosted on your platform—complicated ownership. Terms of Service should grant you broad licensing rights:

> "By posting content, you grant Publisher perpetual, worldwide license to use, reproduce, sublicense (including for AI training purposes) your contributions."

Without such clauses, licensing UGC to marketplaces risks legal challenges.

### Third-Party Content

Syndicated articles, wire service content (AP, Reuters), licensed photos—cannot be sub-licensed unless original agreements permit.

Marketplaces require warranties that you have necessary rights. Breach of warranty exposes you to indemnification claims if AI companies get sued for using improperly licensed content.

### Moral Rights and Attribution

Some jurisdictions (Europe, Canada) grant authors moral rights—including right to attribution. If marketplace licenses content without attribution, authors might sue.

[Anthropic's licensing contracts](anthropic-publisher-licensing-strategy.html) include attribution requirements, addressing moral rights concerns. Ensure marketplace agreements preserve attribution or obtain author waivers.

## Optimizing Content for Marketplace Value

Not all content is equal. Structure and enrich content to maximize licensing revenue.

### High-Value Content Types

AI companies pay premiums for:
- **Long-form investigative journalism** (1,500+ words)
- **Technical how-to guides** with step-by-step instructions
- **Primary research** (original surveys, data analysis)
- **Expert commentary** (credentialed author analysis)
- **Evergreen reference material** (definitions, frameworks, historical overviews)

**Low-value content:**
- Short news briefs (under 300 words)
- Aggregated/syndicated content (no original reporting)
- Opinion pieces without substantive argument
- Clickbait, listicles, slideshows

Audit content archives. Submit high-value content to marketplaces; exclude low-value to avoid diluting dataset quality scores.

### Content Freshness

AI companies training on recent data to [prevent model collapse](ai-model-collapse-fresh-data.html) pay more for fresh content. Marketplaces price 2026 articles higher than 2020 archives.

Strategies:
- **Regularly update evergreen content** (refresh statistics, add new sections)
- **Publish continuously** (daily or weekly cadence increases freshness premium)
- **Timestamp updates** (indicate "last updated" dates in metadata)

### Metadata Completeness

The more structured data you provide, the higher the value. Complete:
- Author bios with credentials
- Topic tags (use standard taxonomies like IAB or Wikipedia categories)
- Entity tagging (people, places, organizations mentioned)
- Related article links (helps AI understand content context)

Marketplaces that must manually tag content charge higher commissions or offer lower revenue shares.

### Multimedia Assets

AI models training on multimodal data (text + images, text + video) pay premiums for articles with embedded media.

Ensure:
- Images have alt text and captions (describes content for AI)
- Videos include transcripts
- Infographics have accessible text equivalents

This increases dataset utility for vision-language models like **GPT-4.5 Vision**, **Gemini**, and **Claude**.

## Marketplace Alternatives: Hybrid Models

Publishers needn't choose between direct deals and marketplaces—hybrid strategies maximize revenue.

### Tiered Licensing

- **Tier 1 buyers** (OpenAI, Google, Anthropic): Negotiate direct deals
- **Tier 2 buyers** (smaller AI companies, enterprises): License via marketplaces

This captures premium pricing from large buyers while monetizing long-tail demand via marketplaces.

### Exclusive + Non-Exclusive

- **Recent content** (past 90 days): Exclusive to direct licensing partners
- **Archive content** (older than 90 days): Non-exclusive via marketplaces

AI companies paying for exclusivity get competitive advantage (fresher training data); marketplaces monetize back catalog.

### Category-Based Splits

- **Premium categories** (investigative journalism, expert analysis): Direct deals
- **Commodity categories** (news briefs, event coverage): Marketplaces

Different content types command different margins—optimize channel strategy accordingly.

## Future of AI Data Marketplaces

As AI training data becomes commodified, marketplaces evolve.

### Decentralized Marketplaces

Blockchain-based platforms (e.g., **Ocean Protocol**, **Streamr**) enable peer-to-peer data licensing without intermediaries. Publishers list content on-chain; AI companies purchase directly; smart contracts handle payment distribution.

**Advantages:** Lower fees (no marketplace commission), transparent usage tracking (blockchain records every access).
**Disadvantages:** Technical complexity, limited buyer adoption (most AI companies prefer traditional platforms).

### Real-Time Data Streams

Instead of licensing static datasets, marketplaces offer live feeds—articles published today available to AI companies today. This supports continuous training (AI models updated daily rather than quarterly).

**Narrative.io** and **Reworkd** already offer streaming; expect broader adoption as AI companies prioritize freshness.

### Synthetic Data Marketplaces

Some platforms let publishers sell AI-generated synthetic training data—avoiding copyright issues while providing training value. Publishers train proprietary models on their archives, then sell model-generated synthetic articles.

**Gretel.ai** and **Mostly AI** offer synthetic data generation; licensing synthetic content may emerge as alternative revenue stream.

## Frequently Asked Questions

### How much can small publishers realistically earn from data marketplaces?

Earnings depend on content volume, quality, and niche. A local news site with 5,000 archived articles might earn $500-$2,000/year if licensing at $0.10-$0.40 per article (accounting for partial consumption by AI buyers and marketplace commissions). Niche technical publishers with high-value content (legal, medical, engineering) can earn 5-10x more per article. Most small publishers should treat marketplace revenue as supplementary, not primary income.

### Do I need exclusive rights to license content through marketplaces?

You need sufficient rights to grant AI training licenses. If you own copyright (work-for-hire employee content), that's adequate. For freelance content, review contributor agreements—ideally they grant you broad sublicensing rights. If agreements are silent on AI training, seek legal advice; retroactive permissions may be needed. User-generated content requires Terms of Service granting you licensing rights.

### Can I sell the same content on multiple marketplaces simultaneously?

Depends on marketplace terms. Some require exclusivity (can only list content with them); others allow non-exclusive distribution (you can multi-home). Non-exclusive arrangements let you maximize revenue (sell to all interested buyers) but may fetch lower per-article rates (buyers discount non-exclusive content). Review each marketplace's terms before committing.

### What prevents AI companies from scraping my content for free instead of licensing through marketplaces?

Legally, not much—[AI crawlers frequently ignore robots.txt](ai-crawlers-ignore-robots-txt.html) and courts haven't established clear boundaries on fair use for AI training. However, licensed content offers AI companies advantages: legal certainty (no copyright lawsuit risk), quality guarantees (curated content vs. random web scrapes), structured metadata (easier integration), and freshness (ongoing access to new content). Publishers should treat marketplaces as monetizing *inevitable* access rather than preventing it.

### How do marketplaces handle content removal requests under GDPR or copyright claims?

Reputable marketplaces include content removal workflows in AI company contracts. When you request removal (GDPR right-to-deletion, copyright concern, reputational issue), marketplace notifies AI buyers, who must remove content from training pipelines within specified timeframes (typically 30-90 days). However, content already trained into model weights can't be "unlearned"—removal prevents future training runs but doesn't delete knowledge from existing models. This is an unsolved problem in AI governance.
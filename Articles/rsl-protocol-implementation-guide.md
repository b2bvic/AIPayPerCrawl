---
title:: RSL Protocol Implementation: How Publishers License Content to AI Systems
description:: Complete guide to implementing RSL (Really Simple Licensing) protocol for AI content licensing. Learn file structure, pricing models, hosting requirements, and enforcement strategies.
keywords:: rsl protocol setup publishers, really simple licensing, AI content licensing, AI crawler licensing, machine-readable licensing, Dave Winer RSL, AI training data licensing
author:: Victor Valentine Romo
date:: 2026.01.19
word_count:: 2,847
type:: pillar-article
framework:: Koray Contextual Vector
status:: publication-ready
---

# RSL Protocol Implementation: How Publishers License Content to AI Systems

**robots.txt** told crawlers where they could and couldn't go. For two decades, that was sufficient. Search engines respected the directive. Webmasters trusted the honor system.

AI crawlers broke that system. Not because they ignored robots.txt (though some do), but because the file answers the wrong question. robots.txt says "don't crawl here." It doesn't say "crawl here, but pay for it." It doesn't communicate pricing, usage rights, or licensing terms.

**Dave Winer**, the programmer who co-created **RSS** and helped build the infrastructure of the early web, saw this gap. In September 2025, he proposed **Really Simple Licensing (RSL)** as the machine-readable standard for AI content licensing. The name echoes RSS deliberately. Simple. Standardized. Built for adoption.

RSL lets publishers communicate licensing terms in a format AI crawlers can parse automatically. When **GPTBot** hits your domain, it can check your RSL file, read your pricing, and decide whether to proceed or move on. **Cloudflare Pay-Per-Crawl** uses RSL as one of its data sources for automated enforcement.

This isn't a proposal anymore. Publishers are implementing RSL. AI companies are reading it. The infrastructure exists. What's missing is adoption at scale.

[INTERNAL: Cloudflare Pay-Per-Crawl Setup Tutorial]

---

## Why RSL Matters (The New robots.txt for AI)

### Dave Winer's Vision for Machine-Readable Licensing

**Dave Winer** built systems that defined how information moves across the internet. **RSS** became the backbone of podcasting and blog distribution. His work on **OPML** standardized outline formats. When he proposed RSL, he applied the same design philosophy: create a format simple enough that anyone can implement it, but structured enough that machines can parse it reliably.

The core insight: AI licensing will happen at scale or not at all. Publishers can't negotiate individual contracts with every AI company. AI companies can't manually review licensing terms for every domain they crawl. The only path to a functioning market is standardization.

RSL provides that standard. A single file format. A single location convention. A predictable structure that any crawler can read and any publisher can create without hiring developers.

Winer's original specification defines the minimum required fields: who you are, what you're licensing, and what you want in exchange. Optional fields handle edge cases: geographic restrictions, usage limitations, attribution requirements. The design prioritizes simplicity in the common case while allowing complexity when publishers need it.

### How AI Companies Discover and Parse RSL Files

AI crawlers check predictable locations. Just as robots.txt lives at `/robots.txt`, RSL files live at `/rsl.json` or `/rsl.xml`. The convention exists. Compliant crawlers check for it.

The discovery process:

1. Crawler arrives at your domain
2. Before crawling content, it requests `/rsl.json` (or `.xml`)
3. If the file exists, crawler parses the licensing terms
4. Crawler compares your terms against its configured parameters (budget, usage rights, enforcement mode)
5. If terms align, crawler proceeds. If not, crawler either skips your domain or flags for human review.

**OpenAI**'s GPTBot and **Anthropic**'s ClaudeBot both include RSL checking in their crawl logic, though the specifics aren't fully documented. **Cloudflare** explicitly reads RSL as part of Pay-Per-Crawl enforcement. Smaller AI companies vary in compliance.

The practical implication: having an RSL file puts you in the system. Not having one leaves AI companies guessing about your terms, which typically defaults to "crawl without payment."

### RSL vs. robots.txt vs. Direct Licensing Deals

These three mechanisms serve different functions:

**robots.txt**
- Function: Access control (allow/disallow crawling)
- Pricing capability: None
- Enforcement: Honor system (crawler chooses to comply or not)
- Best for: Blocking crawlers you don't want, period

**RSL Protocol**
- Function: Licensing terms communication
- Pricing capability: Full (per-crawl, per-inference, flat-rate, hybrid)
- Enforcement: Through systems like **Cloudflare Pay-Per-Crawl**
- Best for: Automated licensing to compliant AI companies at scale

**Direct Deals**
- Function: Custom contracts with specific AI companies
- Pricing capability: Unlimited (whatever you negotiate)
- Enforcement: Contract law
- Best for: Large publishers with unique leverage (**News Corp**, **Reddit**, **Financial Times**)

RSL sits between blocking and negotiating. It enables licensing to AI companies you'll never talk to, at rates you set, without lawyers or contracts. For publishers under 50 million monthly pageviews, this is typically the most practical path.

[INTERNAL: robots.txt vs. RSL vs. Direct Deals Comparison]

---

## Understanding RSL File Structure

### Required Fields (licensor, content_type, pricing_model)

Every RSL file needs three pieces of information: who you are, what you're licensing, and how you want to get paid.

**JSON format:**

```json
{
  "rsl_version": "1.0",
  "licensor": {
    "name": "Example Publication",
    "contact": "licensing@examplepub.com",
    "url": "https://examplepub.com"
  },
  "content_type": "news",
  "pricing_model": "per_crawl",
  "pricing": {
    "rate": 0.008,
    "currency": "USD"
  },
  "updated": "2026-01-15"
}
```

The `licensor` block identifies your organization. Include a contact email that routes to someone authorized to discuss licensing. The generic info@ address buries licensing inquiries in support queues.

`content_type` helps AI companies categorize your content. Common values: "news", "technical_documentation", "b2b_trade", "academic", "user_generated_content". This field influences how AI companies evaluate your pricing. Technical documentation at $0.020/crawl reads differently than news at the same rate.

`pricing_model` declares your approach. Options in the current specification: "per_crawl", "per_inference", "flat_rate", "hybrid", "negotiable". Most publishers start with "per_crawl" because it's simplest to implement and **Cloudflare** handles enforcement automatically.

### Optional Fields (geographic_restrictions, usage_limits, attribution_requirements)

The specification allows additional constraints:

```json
{
  "rsl_version": "1.0",
  "licensor": {
    "name": "Example Publication",
    "contact": "licensing@examplepub.com",
    "url": "https://examplepub.com"
  },
  "content_type": "news",
  "pricing_model": "per_crawl",
  "pricing": {
    "rate": 0.008,
    "currency": "USD"
  },
  "restrictions": {
    "geographic": ["US", "EU", "UK"],
    "usage_type": ["retrieval"],
    "excluded_paths": ["/premium/", "/subscriber-only/"]
  },
  "attribution": {
    "required": true,
    "format": "Source: Example Publication (examplepub.com)",
    "link_required": true
  },
  "volume_discounts": [
    {"threshold": 50000, "rate": 0.006},
    {"threshold": 200000, "rate": 0.004}
  ],
  "updated": "2026-01-15"
}
```

Geographic restrictions limit where AI systems can use your content. If you only have rights to distribute in certain markets, specify them. AI companies operating globally need to know.

Usage type can distinguish training from retrieval. Training means your content enters model weights permanently. Retrieval means real-time lookup during inference. Some publishers price these differently. **Creative Commons** distinctions don't map cleanly to AI use cases, but the training/retrieval split has become a de facto standard.

Attribution requirements specify how AI systems should cite you. Not all AI companies honor attribution in practice, but stating your requirements creates documentation for enforcement conversations.

### JSON vs. XML Format (Which AI Companies Prefer)

Both formats work. JSON has become the dominant choice for practical reasons.

**JSON advantages:**
- Lighter weight (smaller file size)
- Native parsing in JavaScript (where most modern crawlers live)
- Easier to read and debug
- More consistent with modern API conventions

**XML advantages:**
- Better support for complex nested structures
- Established **schema.org** and **JSON-LD** integration patterns
- Some enterprise systems prefer it

If you're choosing fresh: use JSON. Name it `rsl.json`. Host it at your domain root.

If your CMS or infrastructure strongly prefers XML, that's fine too. Name it `rsl.xml`. Same location.

Don't create both. Pick one. Conflicting files at different paths create parsing errors and confusion about which represents your actual terms.

---

## Creating Your First RSL File

### Step-by-Step File Generation (Manual vs. Template)

**Manual creation** takes 15 minutes if you know your pricing:

1. Open a text editor
2. Copy the basic structure from above
3. Replace placeholder values with your information
4. Save as `rsl.json`
5. Upload to your domain root

**Template approach** works better for publishers uncertain about structure:

Community templates exist at several locations. The **Cloudflare** documentation includes starter templates. **Dave Winer**'s original specification includes examples for different publishing contexts.

Start with a template matching your content type. News publishers have different default structures than technical documentation sites. B2B trade publications differ from consumer media. Templates encode these defaults.

Validate your file before deployment. JSON syntax errors break parsing entirely. A missing comma renders your licensing terms invisible to every crawler. Online JSON validators catch these issues in seconds.

### Defining Pricing Models (Per-Crawl, Per-Inference, Flat-Rate, Hybrid)

**Per-crawl pricing** charges for each page request. Simplest model. Easiest to enforce. **Cloudflare Pay-Per-Crawl** built its entire system around this approach.

Industry benchmarks:
- News content: $0.002-$0.005 per crawl
- B2B trade publications: $0.008-$0.012 per crawl
- Technical documentation: $0.015-$0.025 per crawl

```json
"pricing_model": "per_crawl",
"pricing": {
  "rate": 0.008,
  "currency": "USD"
}
```

**Per-inference pricing** charges when AI systems use your content in responses. Higher theoretical value, but nearly impossible to track without AI company cooperation. Only viable in direct deals where you negotiate reporting requirements.

```json
"pricing_model": "per_inference",
"pricing": {
  "rate": 0.0001,
  "currency": "USD",
  "note": "Requires reporting agreement"
}
```

**Flat-rate pricing** mimics the **News Corp** model: annual fee for access. Works when you have leverage to demand upfront payment. Doesn't work through automated systems like Cloudflare.

```json
"pricing_model": "flat_rate",
"pricing": {
  "annual_fee": 50000,
  "currency": "USD",
  "contact_required": true
}
```

**Hybrid models** combine approaches: per-crawl for retrieval, flat-rate for training data rights.

```json
"pricing_model": "hybrid",
"pricing": {
  "retrieval": {
    "model": "per_crawl",
    "rate": 0.003
  },
  "training": {
    "model": "flat_rate",
    "annual_fee": 25000,
    "contact_required": true
  }
}
```

### Setting Content Scope (Entire Site vs. Specific Directories)

Not all content has equal licensing value. RSL lets you differentiate.

**Site-wide licensing** (simplest):

```json
"scope": {
  "type": "site_wide",
  "exclusions": ["/admin/", "/private/"]
}
```

Everything gets the same rate except explicitly excluded paths.

**Directory-based licensing** (more control):

```json
"scope": {
  "type": "directory",
  "pricing_by_path": [
    {"path": "/news/", "rate": 0.005},
    {"path": "/analysis/", "rate": 0.012},
    {"path": "/research/", "rate": 0.020},
    {"path": "/archive/", "rate": 0.003}
  ],
  "default_rate": 0.008
}
```

Breaking news commands higher rates (time-sensitive, high demand). Archive content commands lower rates (commoditized, easily substituted). Research and analysis commands premium rates (unique expertise, hard to replace).

This structure requires crawler systems that parse path-based pricing. **Cloudflare** supports it. Other enforcement systems may apply your default rate to everything.

[INTERNAL: Pricing Your Content for AI Training]

---

## Where to Host Your RSL File

### Domain Root Placement (/rsl.json vs. /licensing/rsl.json)

Host at the domain root. Full stop.

```
https://example.com/rsl.json
```

Not:
```
https://example.com/legal/rsl.json
https://example.com/licensing/terms/rsl.json
https://example.com/api/v1/rsl.json
```

Convention matters. Every AI crawler checking for RSL looks at the root first. Some stop there. If your file lives elsewhere, many crawlers never find it.

The **Cloudflare** enforcement layer checks the root location. **Dave Winer**'s specification assumes the root location. Community tools validate against the root location. Placing your file elsewhere breaks compatibility with most of the ecosystem.

If your CMS prevents root-level static files, options exist:

1. Use server configuration (Apache, Nginx) to serve the file from the expected URL
2. Use a redirect from `/rsl.json` to wherever your file actually lives
3. Use **Cloudflare Workers** to intercept the request and serve your content

Whatever approach you choose, `https://yourdomain.com/rsl.json` must work.

### Linking from robots.txt and sitemap.xml

Cross-reference increases discoverability. In your robots.txt:

```
# RSL Protocol licensing terms
# https://example.com/rsl.json

User-agent: GPTBot
Crawl-delay: 10
Allow: /

User-agent: ClaudeBot
Crawl-delay: 10
Allow: /
```

The comment at the top points crawlers to your RSL file even if they don't automatically check for it. Human operators reviewing your robots.txt see where to find your licensing terms.

Some publishers add RSL to sitemap.xml:

```xml
<url>
  <loc>https://example.com/rsl.json</loc>
  <changefreq>monthly</changefreq>
  <priority>0.1</priority>
</url>
```

This ensures search engines index your RSL file. Not directly useful for AI crawlers, but creates documentation that your licensing terms existed and were publicly accessible at a specific time.

### HTTP Header Declarations for Crawler Discoverability

Advanced implementation adds HTTP headers to all responses:

```
X-RSL-Location: https://example.com/rsl.json
Link: <https://example.com/rsl.json>; rel="license"
```

Server configuration for Nginx:

```nginx
add_header X-RSL-Location "https://example.com/rsl.json" always;
add_header Link '<https://example.com/rsl.json>; rel="license"' always;
```

For Apache:

```apache
Header always set X-RSL-Location "https://example.com/rsl.json"
Header always set Link "<https://example.com/rsl.json>; rel=\"license\""
```

These headers appear in every HTTP response from your domain. Crawlers that check headers (some do) find your licensing file without a separate request. It's defense in depth: multiple signals pointing to the same location.

---

## Testing and Validation

### RSL Validator Tools (Official + Community)

Before deployment, validate your RSL file:

**Syntax validation**: Paste your JSON into any JSON validator. Catches structural errors (missing brackets, improper quoting, trailing commas).

**Schema validation**: The RSL specification includes a **JSON Schema** definition. Tools like **ajv** or online validators can check your file against the schema, catching missing required fields or invalid values.

**Community validators**: Several publishers have built RSL-specific validation tools. These check not just syntax but also common mistakes: pricing that seems too low, paths that don't exist on your site, contact emails that bounce.

Run validation after any edit. A typo in your pricing field can change $0.008 to $0.08 (10x your intended rate) or $0.0008 (10x lower). Validation catches these before they cost you money.

### Monitoring Which AI Companies Are Reading Your RSL File

Server logs reveal who's checking your licensing terms.

Filter logs for requests to `/rsl.json`:

```
grep "rsl.json" /var/log/nginx/access.log
```

User-agent strings identify the crawler:
- `GPTBot` - **OpenAI**
- `ClaudeBot` - **Anthropic**
- `Google-Extended` - **Google** Gemini
- `Bytespider` - **ByteDance**

Track over time. If **ClaudeBot** checked your RSL file in January but stopped in March, something changed. Maybe they updated their crawler logic. Maybe your file broke. Investigation reveals the cause.

**Cloudflare** analytics show RSL file requests in your dashboard. More detailed than raw logs, with geographic breakdown and temporal patterns.

### Version Control and Update Protocols

Treat your RSL file like code. Version control it.

```bash
git init rsl
git add rsl.json
git commit -m "Initial RSL v1.0: $0.008/crawl news content"
```

Each change gets a commit:

```bash
git commit -m "RSL v1.1: Added volume discounts for 50k+ crawls"
git commit -m "RSL v1.2: Increased research section pricing to $0.025"
```

This creates an audit trail. If an AI company disputes your terms, you can demonstrate exactly what your RSL file said on any given date. Git history is timestamped and immutable.

Update the `updated` field in your RSL file whenever you change terms:

```json
"updated": "2026-01-15"
```

AI companies can compare this date against their crawl logs to verify they were operating under current terms.

[INTERNAL: AI Crawler Directory]

---

## Enforcement: What Happens When AI Companies Ignore RSL

### Legal Precedent for Terms-of-Service Violations

RSL communicates your terms. It doesn't enforce them. Enforcement requires separate mechanisms.

The legal landscape is evolving. **hiQ Labs v. LinkedIn** established that publicly accessible data isn't automatically free to scrape. **Clearview AI** cases introduced facial recognition-specific limitations. AI training cases are still working through courts.

Your RSL file establishes that terms existed and were communicated. If an AI company scrapes without payment, you have documentation showing:
1. Your licensing terms were published at a known location
2. Their crawler accessed your domain (server logs)
3. They didn't comply with stated terms

This doesn't guarantee legal victory. It creates evidence for whatever legal theory you pursue.

### Public Pressure Tactics (Naming Non-Compliant Crawlers)

Some publishers track and publicize non-compliant crawlers.

When **Bytespider** ignores your RSL file (and it will ignore your RSL file), documentation exists: your terms were clear, their crawler violated them. Publishing this data:
- Warns other publishers
- Creates reputational pressure on AI companies
- Builds collective evidence for industry-wide enforcement

Trade associations and publisher coalitions increasingly aggregate this data. Non-compliance becomes harder to hide when multiple publishers report the same patterns.

### Cloudflare Pay-Per-Crawl as RSL Enforcement Layer

The most practical enforcement mechanism today: **Cloudflare Pay-Per-Crawl**.

Cloudflare sits between crawlers and your origin server. When an AI crawler requests content:

1. Cloudflare intercepts the request
2. Cloudflare checks your RSL file for pricing terms
3. Cloudflare checks whether this crawler has a payment relationship
4. If paid: request proceeds to your server
5. If unpaid: request blocked, throttled, or redirected to payment setup

This removes enforcement burden from you. Cloudflare handles billing through **Stripe**. Cloudflare handles crawler identification. Cloudflare handles payment collection.

Your RSL file feeds into this system. Cloudflare's dashboard overrides take precedence, but RSL provides the baseline configuration. Change your RSL file, Cloudflare's enforcement updates automatically.

The limitation: Cloudflare only enforces for crawlers that use proper user-agent identification and don't circumvent detection. Sophisticated bad actors can still scrape. But compliant AI companies from **OpenAI**, **Anthropic**, and **Google** work within the system.

[INTERNAL: Cloudflare Pay-Per-Crawl Setup Tutorial]

---

RSL protocol fills the gap between blocking AI crawlers and negotiating individual contracts. It provides machine-readable licensing terms that AI companies can parse automatically and enforcement systems can act upon.

Implementation takes 30 minutes for a basic file, an hour for tiered pricing and full options. The infrastructure to read and enforce RSL exists. The remaining challenge is publisher adoption.

Every publisher who implements RSL strengthens the standard. Every RSL file that results in payment validates the model. The system works. It just needs critical mass.

Publishers waiting for the "right time" to implement RSL are watching the market develop without them. The right time was when you first noticed AI crawlers in your server logs. The second-best time is now.

[INTERNAL: llms.txt Specification Guide]
[INTERNAL: Pricing Your Content for AI Training]

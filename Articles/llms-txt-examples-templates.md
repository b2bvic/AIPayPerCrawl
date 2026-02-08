---
title:: llms.txt Examples and Templates: Implementing the New AI Crawler Standard
description:: Complete llms.txt implementation guide with examples, templates, and best practices. Structure training-friendly content for AI crawler discovery.
focus_keyword:: llms.txt file
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# llms.txt Examples and Templates: Implementing the New AI Crawler Standard

The llms.txt proposal creates standardized format for publishers to provide AI-friendly content summaries, licensing terms, and structured data feeds. Placed at `/llms.txt` (analogous to robots.txt), this file helps AI crawlers discover valuable content, understand licensing terms, and access structured data efficiently. While not yet universally adopted, early implementation positions publishers advantageously in emerging training data markets.

**Basic llms.txt Template**

```
# llms.txt - AI Crawler Information for example.com
# Format version: 1.0
# Last updated: 2026-02-08

## About This Site
Name: Example News Network
Description: Independent journalism covering technology, science, and policy
Content Types: news articles, investigative reporting, analysis
Languages: en, es
Update Frequency: daily

## Licensing
Default License: All Rights Reserved
Contact: licensing@example.com
Licensing Page: https://example.com/ai-licensing
Pricing: Available on request for commercial AI training use

## Structured Data Feeds
Articles API: https://example.com/api/articles
Format: JSON
Authentication: API key required
Documentation: https://example.com/api/docs
Rate Limit: 100 requests/minute

## Content Recommendations
Priority Content: https://example.com/sitemap-articles.xml
Archive Access: https://example.com/archive/ (2015-2023)
Premium Content: https://example.com/premium/ (licensing required)

## Robots Directives
AI Training Crawlers: Allowed with restrictions (see robots.txt)
User-agent: GPTBot: Restricted to /public/ directory
User-agent: ClaudeBot: Full access permitted
User-agent: Google-Extended: Blocked
```

**Publisher With Open Access Model**

```
# llms.txt for openresearch.org

## About
Name: Open Research Publishing
Description: Open access scientific research in biology, chemistry, physics
Content Types: peer-reviewed papers, preprints, datasets
Languages: en
Update Frequency: daily
Total Articles: 45,000+

## Licensing
Default License: CC BY 4.0 (Attribution)
Commercial Use: Permitted with attribution
Derivative Works: Permitted
Contact: info@openresearch.org

## Bulk Access
Database Dump: https://openresearch.org/data/full-export.tar.gz
Update: Monthly (first Monday of each month)
Format: JSON + XML
Size: ~15 GB compressed
Checksum: https://openresearch.org/data/checksums.txt

## API Access
REST API: https://api.openresearch.org/v1/
Rate Limit: 1000 requests/minute (no authentication)
Documentation: https://openresearch.org/api-docs
GraphQL: https://api.openresearch.org/graphql

## Attribution
Required: Yes
Format: "Content from Open Research Publishing (openresearch.org)"
Citation Style: Include DOI when available
```

**News Publisher With Tiered Licensing**

```
# llms.txt for news-daily.com

## About
Name: News Daily
Description: Breaking news, politics, business, technology
Content Types: news articles, opinion, multimedia
Languages: en
Daily Traffic: 5M+ unique visitors

## Licensing Tiers
Public Archive (pre-2022): Free for non-commercial AI training
- Access: https://news-daily.com/archive/
- License: CC BY-NC 4.0

Recent Content (2022-present): Commercial licensing required
- Contact: licensing@news-daily.com
- Pricing: Custom quotes based on usage

Premium Content: Exclusive licensing available
- Includes: Investigative reports, exclusive interviews
- Contact: premium-licensing@news-daily.com

## Crawling Guidelines
Crawl Rate: Maximum 10 requests/second
Preferred Time: 00:00-06:00 UTC (off-peak hours)
User-agent: Must identify clearly (see robots.txt)

## Structured Data
JSON Feed: https://news-daily.com/feed.json (public articles only)
RSS: https://news-daily.com/rss (headlines only)
Full Content API: Available to licensing partners
```

**Technical Documentation Site**

```
# llms.txt for devdocs-hub.io

## About
Name: DevDocs Hub
Description: Programming tutorials, API references, code examples
Content Types: tutorials, documentation, code samples
Languages: en
Technologies: Python, JavaScript, Go, Rust, TypeScript

## Licensing
Code Samples: MIT License
Documentation: CC BY-SA 4.0
Combined Works: Follow individual licenses per section

## Training Recommendations
High-Value Content:
- https://devdocs-hub.io/tutorials/advanced/
- https://devdocs-hub.io/best-practices/
- https://devdocs-hub.io/api-reference/

Code Examples: https://devdocs-hub.io/examples/
Full Text Search: https://devdocs-hub.io/search-api

## Technical Format
Markup: Markdown with front matter
Code Syntax: Highlighted, language-tagged
Metadata: Includes difficulty level, prerequisites, last updated

## Attribution
Preferred: Link to specific tutorial/guide
Format: "Tutorial: [Title] by DevDocs Hub"
Code Attribution: Include comment with source URL
```

**Multimedia Publisher**

```
# llms.txt for media-collective.tv

## About
Name: Media Collective
Description: Documentary films, video journalism, podcasts
Content Types: video, audio, transcripts
Languages: en, es, fr
Library Size: 2,500+ hours of content

## Licensing
Video/Audio Files: All Rights Reserved
Transcripts: Available for AI training (see terms)
Metadata: CC0 Public Domain
Thumbnails: Fair use permitted

## Text Access
Transcripts: https://media-collective.tv/transcripts/
Format: WebVTT and plain text
API: https://api.media-collective.tv/transcripts
Authentication: OAuth 2.0

## Training Restrictions
Video/Audio: Do not train on raw media files
Transcripts: Permitted for language models
Visual Analysis: Contact licensing@media-collective.tv
Voice Synthesis: Explicitly prohibited

## Attribution
Required: Yes
Format: "Transcript from [Title], Media Collective"
Include: Original publication date and speaker names
```

**E-commerce Site**

```
# llms.txt for shop-example.com

## About
Name: Example Shop
Description: Online retailer - electronics, home goods, apparel
Content Types: product descriptions, reviews, buying guides
Languages: en
Products: 50,000+ active listings

## Licensing
Product Descriptions: Proprietary, all rights reserved
User Reviews: Licensed content, usage requires agreement
Buying Guides: Available for training with attribution
Contact: ai-licensing@shop-example.com

## Structured Data
Products API: https://api.shop-example.com/products
Authentication: API key required (request at api@shop-example.com)
Rate Limit: 500 requests/hour
Format: JSON with schema.org markup

## Training Use Cases
Permitted:
- Product comparison and recommendation systems
- Shopping assistance chatbots
- General e-commerce Q&A

Prohibited:
- Price scraping and monitoring
- Competitive intelligence without agreement
- Creating substitute product databases

## Data Quality
Descriptions: Human-written, professionally edited
Reviews: Verified purchase, moderated for quality
Images: High resolution, multiple angles
Specs: Structured, manufacturer-verified
```

**Implementation Best Practices:**

1. **Place file at site root**: `/llms.txt` at top-level domain
2. **Use clear hierarchical structure**: ## headings for sections
3. **Include contact information**: Enable licensing inquiries
4. **Link to robots.txt**: Reference for crawler directives
5. **Provide structured data options**: APIs, sitemaps, bulk exports
6. **Update regularly**: Include last-updated timestamp
7. **Be specific about licensing**: Clear terms prevent disputes
8. **Recommend high-value content**: Guide crawlers to best material

**Frequently Asked Questions:**

**Is llms.txt a standard yet?**
Emerging convention, not yet formalized standard like robots.txt. Early adoption positions publishers favorably as convention solidifies.

**Do AI crawlers actually check llms.txt?**
Major AI companies (OpenAI, Anthropic, Google) have shown interest in structured publisher communication mechanisms. Implementation increases likelihood of crawler cooperation.

**Can llms.txt replace robots.txt?**
No, they serve different purposes. Robots.txt controls crawler access; llms.txt provides information about content and licensing. Use both.

**Should I include pricing in llms.txt?**
Optional. Many publishers include "contact for pricing" to encourage inquiries without public rate disclosure. Transparent pricing may attract more licensing interest.

**How often should I update llms.txt?**
Whenever licensing terms, contact information, or content structure changes significantly. Include last-updated date to help crawlers recognize stale information.

Publishers implementing llms.txt create clear communication channels with AI companies, potentially increasing licensing inquiries, improving crawler targeting of valuable content, and demonstrating proactive engagement with AI training ecosystem rather than reactive blocking.

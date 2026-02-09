---
title:: What Is RSL (Really Simple Licensing): Per-Article AI Licensing via Feeds
description:: Really Simple Licensing extends RSS feeds with machine-readable licensing metadata, letting publishers declare per-article AI permissions and pricing at scale.
focus_keyword:: what is RSL really simple licensing
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# What Is RSL (Really Simple Licensing): Per-Article AI Licensing via Feeds

**Really Simple Licensing (RSL)** is a proposed extension to RSS and Atom feed formats that embeds machine-readable licensing metadata into each feed item, allowing publishers to declare article-by-article permissions, pricing, and attribution requirements for AI training and retrieval use. Instead of site-wide policies via robots.txt or llms.txt files, RSL provides granular per-content licensing—breaking news might allow free training while investigative reports require paid access, all communicated automatically via existing feed infrastructure.

The specification emerged in early 2024 from frustrations with coarse access controls. **robots.txt** applies directory-level rules, **llms.txt** declares site-wide policies, but neither accommodates publishers needing article-specific licensing variations. News organizations wanted free access to commodity reporting while monetizing premium analysis. Technical publishers needed open documentation alongside proprietary research requiring payment.

RSL solves this by extending `<item>` tags in RSS/Atom with licensing fields AI crawlers parse automatically. Publishers already generating feeds for subscribers add licensing metadata to existing workflows—no new infrastructure required. AI companies subscribe to RSL-enabled feeds, receiving content updates with embedded permissions guiding compliant usage.

## How RSL Extends RSS/Atom Feed Formats

Standard RSS items contain title, description, link, and publication date. RSL adds licensing fields at the item level.

**Standard RSS item**:

```xml
<item>
  <title>Understanding Neural Networks</title>
  <link>https://publisher.com/articles/12345</link>
  <description>Introduction to neural network architecture...</description>
  <pubDate>Fri, 08 Feb 2026 09:00:00 GMT</pubDate>
</item>
```

**RSL-enhanced item**:

```xml
<item>
  <title>Understanding Neural Networks</title>
  <link>https://publisher.com/articles/12345</link>
  <description>Introduction to neural network architecture...</description>
  <pubDate>Fri, 08 Feb 2026 09:00:00 GMT</pubDate>
  
  <!-- RSL licensing metadata -->
  <license>
    <url>https://creativecommons.org/licenses/by-nc/4.0/</url>
    <type>CC BY-NC</type>
  </license>
  
  <ai:usage>
    <ai:training>allowed-noncommercial</ai:training>
    <ai:rag>allowed</ai:rag>
    <ai:finetuning>prohibited</ai:finetuning>
  </ai:usage>
  
  <ai:attribution required="true" format="hyperlink" />
  
  <ai:pricing currency="USD" per="retrieval">0.05</ai:pricing>
  
  <ai:contact>licensing@publisher.com</ai:contact>
</item>
```

AI crawlers subscribe to feeds, parse items, and extract licensing metadata governing content use.

## RSL Core Fields and Semantics

RSL defines standard vocabulary for expressing licensing terms.

### License Declaration

**`<license>`**: Points to human- and machine-readable license terms.

```xml
<license>
  <url>https://publisher.com/licenses/ai-commercial</url>
  <type>proprietary</type>
</license>
```

Common types:
- `CC BY`: Creative Commons Attribution
- `CC BY-NC`: Attribution NonCommercial
- `CC BY-ND`: Attribution NoDerivatives
- `proprietary`: Custom terms at specified URL
- `public-domain`: No restrictions

### Usage Permissions

**`<ai:usage>`**: Specifies permitted AI use cases.

```xml
<ai:usage>
  <ai:training>allowed</ai:training>
  <ai:rag>licensed</ai:rag>
  <ai:finetuning>prohibited</ai:finetuning>
</ai:usage>
```

Values:
- `allowed`: Free use permitted
- `allowed-noncommercial`: Academic/research only
- `allowed-attribution`: Free if attributed
- `licensed`: Commercial license required
- `prohibited`: Not permitted under any terms
- `contact`: Negotiate custom terms

### Attribution Requirements

**`<ai:attribution>`**: Defines citation expectations.

```xml
<ai:attribution required="true" format="hyperlink" placement="inline" />
```

Attributes:
- `required`: Boolean, must content be attributed
- `format`: `text`, `hyperlink`, `structured`
- `placement`: `inline`, `footnote`, `bibliography`

### Pricing Information

**`<ai:pricing>`**: Declares commercial terms.

```xml
<ai:pricing currency="USD" per="retrieval">0.05</ai:pricing>
```

Attributes:
- `currency`: ISO currency code
- `per`: Unit (article, retrieval, token, word)

Value: Price per specified unit.

**Tiered pricing**:

```xml
<ai:pricing>
  <tier volume="0-1000" currency="USD" per="retrieval">0.10</tier>
  <tier volume="1001-10000" currency="USD" per="retrieval">0.07</tier>
  <tier volume="10000+" currency="USD" per="retrieval">0.05</tier>
</ai:pricing>
```

### Contact Information

**`<ai:contact>`**: Licensing inquiry endpoint.

```xml
<ai:contact>licensing@publisher.com</ai:contact>
```

Or:

```xml
<ai:contact>
  <email>licensing@publisher.com</email>
  <url>https://publisher.com/ai-licensing</url>
  <phone>+1-555-0100</phone>
</ai:contact>
```

### Temporal Restrictions

**`<ai:embargo>`**: Time-limited usage restrictions.

```xml
<ai:embargo>
  <training until="2026-08-08">prohibited</training>
  <rag until="2026-03-08">licensed</rag>
</ai:embargo>
```

This allows publishers to monetize breaking news exclusively for 30 days before opening to free use.

## RSL Workflow: From Feed to Compliance

The typical RSL implementation flow:

### Publisher Side

1. **Generate content**: Publish articles via CMS
2. **Assign licensing metadata**: Editor or automated rules set per-article license terms
3. **Embed in feed**: RSS generation includes RSL fields
4. **Publish feed**: Standard feed URL contains licensing metadata

**Implementation**: CMS plugins or custom scripts augment existing RSS generation.

WordPress example:

```php
add_filter('rss2_item', function() {
  $license = get_post_meta(get_the_ID(), 'ai_license', true);
  echo '<ai:training>' . esc_xml($license['training']) . '</ai:training>';
  echo '<ai:pricing currency="USD" per="retrieval">' . esc_xml($license['price']) . '</ai:pricing>';
});
```

### AI Company Side

1. **Subscribe to feeds**: Monitor publishers' RSS/Atom feeds
2. **Parse items**: Extract licensing metadata from each article
3. **Classify content**: Sort by permissions (free, licensed, prohibited)
4. **Route appropriately**:
   - `allowed`: Include in training corpus or RAG index
   - `licensed`: Contact publisher for commercial terms
   - `prohibited`: Exclude from datasets
5. **Track usage**: Log which content accessed under what terms
6. **Generate citations**: Honor attribution requirements in model outputs

**Implementation**: Extend existing feed readers with RSL parsers.

Python example:

```python
import feedparser

feed = feedparser.parse('https://publisher.com/feed')

for item in feed.entries:
    if 'ai_training' in item:
        if item.ai_training == 'allowed':
            corpus.add(item.content)
        elif item.ai_training == 'licensed':
            licensing_queue.add(item, publisher_contact=item.ai_contact)
        elif item.ai_training == 'prohibited':
            pass  # Skip
```

## Advantages Over Site-Wide Licensing

RSL's per-article granularity enables business models impossible with robots.txt or llms.txt.

**Dynamic pricing**: Charge premiums for high-value content while offering commodity articles freely.

Example:
- Breaking news investigation: `<ai:pricing>0.50</ai:pricing>`
- Weather update: `<ai:pricing>0.01</ai:pricing>`
- Archived content (>1 year): `<ai:pricing>0.00</ai:pricing>`

**Temporal control**: Embargo premium content for exclusivity windows.

```xml
<ai:embargo>
  <rag until="2026-02-15">prohibited</rag>
</ai:embargo>
```

After embargo, content becomes available—automated without manual intervention.

**Differentiated permissions**: Allow training but restrict retrieval, or vice versa.

```xml
<ai:usage>
  <ai:training>allowed</ai:training>
  <ai:rag>licensed</ai:rag>
</ai:usage>
```

AI companies can train models freely using article patterns but must pay for real-time RAG queries.

**Content-type segmentation**: Different licensing for multimedia.

```xml
<item>
  <title>Economic Analysis with Interactive Charts</title>
  <ai:usage>
    <ai:training-text>allowed</ai:training-text>
    <ai:training-images>licensed</ai:training-images>
  </ai:usage>
</item>
```

Text accessible freely, charts require payment.

## RSL vs. llms.txt and robots.txt

Publishers often ask which standard to implement. The answer: all three, serving different purposes.

### Comparison Matrix

| Feature | robots.txt | llms.txt | RSL |
|---------|------------|----------|-----|
| **Scope** | Site/directory | Site-wide | Per-article |
| **Granularity** | Coarse | Medium | Fine |
| **Complexity** | Simple | Moderate | High |
| **Dynamic pricing** | No | No | Yes |
| **Temporal control** | No | No | Yes |
| **Existing infrastructure** | Universal | New | Extends RSS |
| **AI adoption** | High | Growing | Emerging |

### Recommended Implementation Strategy

**Layer all three**:

1. **robots.txt**: Block unauthorized bots, allow licensed crawlers
2. **llms.txt**: Declare default site-wide policies and contact info
3. **RSL**: Provide granular per-article licensing in feeds

```
robots.txt: Block GPTBot by default
llms.txt: "Training: Licensed, Contact: licensing@pub.com"
RSL feed: Article A free, Article B $0.50, Article C embargoed
```

AI companies check all three:
- robots.txt determines if they can access site
- llms.txt provides site-wide defaults and contact
- RSL overrides defaults with article-specific terms

## Technical Implementation Challenges

RSL adoption faces obstacles publishers and AI companies must navigate.

**Feed generation complexity**: Adding licensing metadata to every article requires CMS modifications or plugins. Small publishers lack technical resources.

**Solution**: CMS plugin marketplace providing RSL extensions for WordPress, Drupal, Ghost.

**Metadata consistency**: Licensing terms must align with website policies. Conflicting signals (robots.txt blocks, RSL allows) create confusion.

**Solution**: Automated validation tools checking RSL feed against robots.txt and llms.txt, flagging inconsistencies.

**AI company support**: RSL only works if AI crawlers actually parse and respect metadata. Early specification with limited adoption provides weak enforcement.

**Solution**: Industry coalitions pressuring major AI companies (OpenAI, Anthropic, Google) to support RSL in crawler pipelines.

**Pricing complexity**: Per-article pricing creates billing nightmares when AI companies retrieve thousands of articles monthly with varied rates.

**Solution**: Aggregated platforms (LicenseServer.ai, ContentAPI.io) handling metering and billing, abstracting complexity.

**Historical content**: Existing archives lack RSL metadata. Retroactively tagging thousands of articles is labor-intensive.

**Solution**: Default site-wide policies via llms.txt apply to untagged content, RSL overrides for newly published items.

## RSL and Pay-Per-Crawl Integration

RSL complements pay-per-crawl revenue models by automating pricing signals (see [what-is-pay-per-crawl](what-is-pay-per-crawl.html)).

**Workflow**:

1. Publisher embeds `<ai:pricing>0.05</ai:pricing>` in RSS item
2. AI company subscribes to feed, parses pricing
3. AI company contacts publisher licensing endpoint
4. Publisher provisions API access with per-retrieval billing matching RSS pricing
5. AI company integrates API, each article fetch costs $0.05
6. Usage metrics from API feed billing system

RSL pricing fields establish rates upfront, reducing negotiation friction. AI companies see transparent costs before contacting publishers.

**Volume-based pricing** via RSL tiers:

```xml
<ai:pricing>
  <tier volume="0-1000">0.10</tier>
  <tier volume="1001-10000">0.07</tier>
  <tier volume="10000+">0.05</tier>
</ai:pricing>
```

API implementations honor tiers automatically—when AI company crosses 1,000 retrievals monthly, per-article cost drops to $0.07.

## Industry Adoption and Standardization Status

As of early 2026, RSL remains **proposed specification** without formal standardization or universal adoption.

**Supporting organizations**:
- **News Media Alliance**: Advocating for publisher-friendly AI licensing standards
- **Digital Content Next**: Publishing coalition experimenting with RSL pilots
- **Certain CMS vendors**: Developing RSL plugins speculatively

**AI company commitments**: Limited public support. Major labs acknowledge RSL but haven't committed to crawler integration.

**Competing standards**: Multiple proposals exist (RSL variants, proprietary formats), fragmenting adoption. Industry consolidation needed for widespread success.

**Regulatory interest**: EU copyright reforms and US legislative proposals (COPIED Act) might mandate machine-readable licensing, potentially accelerating RSL adoption.

## FAQ: Really Simple Licensing

**Is RSL legally binding?**

No—like robots.txt and llms.txt, RSL signals intent but doesn't create contracts. However, clear documented licensing terms strengthen infringement claims if AI companies violate policies. Pair RSL with terms of service referencing feed licensing metadata for enforceability.

**Can publishers mix free and paid content in the same feed?**

Yes, that's RSL's core value proposition. Each `<item>` declares independent licensing terms. Publishers might publish unified feeds with mixed licensing or segment feeds (free.rss, premium.rss) for AI company convenience.

**How do AI companies handle conflicting licensing information?**

Best practice: most restrictive rule wins. If robots.txt blocks, llms.txt licenses, and RSL allows freely—robots.txt block takes precedence. Publishers should ensure consistency across standards.

**What if article licensing changes after initial feed publication?**

Update the feed item with revised licensing. AI companies subscribing to feeds receive updates. For already-accessed content, licensing changes might not apply retroactively unless agreements specify otherwise.

**Does RSL work with paywalled content?**

RSL metadata can appear in feed items regardless of paywall status. However, AI companies accessing full text still need authentication or licensing arrangements. RSL signals licensing intent, technical barriers enforce access control.

**Can RSL replace contracts for major AI licensing deals?**

No—high-value partnerships require legal agreements addressing liability, indemnification, termination, and complex terms RSL can't express. RSL automates commodity licensing for small transactions, contracts govern strategic partnerships.

## RSL as Granular Licensing Infrastructure

RSL represents the logical evolution from coarse site-wide policies toward precise content-level licensing. Publishers gain flexibility charging premiums for investigative journalism while offering routine reporting freely—attracting AI visibility for commodity content while monetizing differentiated value.

The specification's success depends on AI company adoption. Without crawler support, RSL becomes metadata without effect. Publishers should implement RSL optimistically while maintaining robots.txt and llms.txt fallbacks.

For publishers building comprehensive AI monetization strategies, RSL completes the licensing signal stack:
- **robots.txt**: Site access control
- **llms.txt**: Default policies and contact
- **RSL**: Granular article licensing
- **API authentication**: Technical enforcement

Combined, these standards provide both automated licensing for compliant actors and legal documentation for enforcement against violators.

As AI content licensing matures, machine-readable standards like RSL will dominate—enabling internet-scale licensing transactions without legal departments negotiating every access grant. The publishers implementing RSL infrastructure early position themselves for this scaled future.

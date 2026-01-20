---
title:: llms.txt Specification: The Human-Readable Licensing Standard for AI Systems
description:: Complete guide to implementing llms.txt for AI content licensing. Learn file structure, placement, and how AI systems parse human-readable licensing terms.
keywords:: llms.txt specification guide, llms.txt implementation, AI content licensing, AI crawler licensing, human-readable licensing, AI training data licensing
author:: Victor Valentine Romo
date:: 2026.01.19
word_count:: 2,847
type:: pillar-article
framework:: Koray Contextual Vector
status:: publication-ready
---

# llms.txt Specification: The Human-Readable Licensing Standard for AI Systems

The AI licensing landscape has a communication problem. Machine-readable protocols like **RSL** (Really Simple Licensing) work for automated systems, but they fail when human judgment enters the picture. An **OpenAI** engineer reviewing licensing terms doesn't want to parse JSON. An **Anthropic** compliance officer checking whether their crawler respects publisher wishes doesn't want to decode XML schemas.

**llms.txt** solves this by being readable. Plain text. Natural language. A document that both AI systems and humans can interpret without tooling.

This isn't a replacement for RSL or **robots.txt**. It's a complement. RSL tells machines what to do. llms.txt tells humans (and increasingly, AI systems themselves) what the rules are in language they can process contextually.

Publishers who implement llms.txt create a single source of truth for their licensing terms that works across every audience: AI crawlers, AI company compliance teams, legal departments, and the LLMs themselves when they encounter the file during retrieval operations.

[INTERNAL: RSL Protocol Implementation Guide]

---

## What llms.txt Is (And How It Differs From RSL)

### Human-Readable vs. Machine-Readable Licensing

RSL protocol uses structured data formats. JSON looks like this:

```json
{
  "licensor": "Example Publisher",
  "content_type": "news",
  "pricing_model": "per_crawl",
  "rate": 0.005
}
```

Machines parse it efficiently. Humans squint at curly braces and wonder if that comma should be there.

llms.txt uses prose:

```
This site is operated by Example Publisher.

We license our content to AI companies for training and retrieval purposes.

Per-crawl rate: $0.005 for news content.
Contact licensing@example.com to establish a billing relationship.
```

Both communicate the same information. llms.txt does it in a format that requires no technical training to understand. A CEO can read it. A journalist can read it. A lawyer can read it without asking engineering to translate.

The format matters because AI licensing isn't purely a technical problem. It's a business negotiation. When **OpenAI**'s partnerships team reviews your site, they're not running parsers against your RSL file. They're reading your licensing terms to understand what you want.

### Why Plain Text Matters for AI Context Understanding

Modern LLMs process text through context windows. When **Claude** or **GPT-4** encounters your llms.txt file during a retrieval operation, it doesn't need special parsing logic. It reads the text the same way it reads any document.

This creates an interesting dynamic: AI systems can understand and potentially respect licensing terms expressed in natural language, even without explicit programming to parse a specific file format.

**Anthropic**'s Claude implementation reportedly checks for llms.txt files and incorporates the content into its context when deciding how to handle retrieved information. The mechanism isn't publicized in detail, but the implication is clear: plain text licensing terms can influence AI behavior during inference, not just crawling.

RSL handles the crawling phase. llms.txt potentially influences what happens after content is already in the AI's context window.

### llms.txt as Complementary to (Not Replacement for) RSL

The two files serve different functions in the licensing stack:

**RSL Protocol**
- Target: AI crawler systems
- Format: JSON or XML
- Function: Automated decision-making during crawl operations
- Enforcement: **Cloudflare Pay-Per-Crawl** and similar systems can read RSL and enforce terms automatically

**llms.txt**
- Target: Humans reviewing licensing, AI systems during retrieval/inference
- Format: Plain text, Markdown optional
- Function: Communication of terms, contextual understanding
- Enforcement: Relies on AI company compliance teams and the AI systems' own processing

A publisher running both files has coverage across the full lifecycle. RSL handles what happens when **GPTBot** requests a page. llms.txt handles what happens when a human at **OpenAI** reviews whether their crawler's behavior aligns with your terms, and what happens when GPT-4 retrieves your content and needs to understand usage constraints.

[INTERNAL: robots.txt vs. RSL vs. Direct Deals Comparison]

---

## File Structure and Required Elements

### Header Section (Site Name, Licensing Contact, Update Date)

Every llms.txt file starts with identification. Who owns this content? How do AI companies reach you? When did you last update these terms?

```
# llms.txt for ExamplePublication.com
# Last updated: 2026-01-15
# Licensing contact: ai-licensing@examplepublication.com
```

The hash marks aren't required but improve readability. Some publishers use Markdown formatting throughout; others stick to plain text. AI systems process both.

The update date matters for audit trails. If an AI company claims they crawled before your licensing terms changed, the date establishes when your current terms took effect.

Licensing contact should route to someone authorized to negotiate. A general info@ address buries licensing requests in customer support queues. A dedicated address (ai-licensing@, partnerships@, legal@) signals that you treat this seriously.

### Licensing Terms in Natural Language

This section states your rules. Write it the way you'd explain it to a business partner.

```
ExamplePublication.com publishes business journalism covering
the technology sector.

Our content is protected by copyright. AI companies may access
our content for training or retrieval purposes under the following
terms:

1. Per-crawl licensing: $0.008 per page crawled for training purposes.
2. Retrieval licensing: $0.003 per page retrieved for real-time
   AI responses.
3. Payment must be established before crawling begins. Contact
   our licensing team to set up billing via Stripe.
4. Crawlers that access our content without payment will be
   blocked and reported.
```

Specificity matters. "We charge for AI access" is vague. "$0.008 per crawl for training, $0.003 for retrieval" is actionable. AI companies can evaluate whether your rates fit their budget. Their compliance teams can verify whether their systems meet your terms.

Avoid legal jargon unless your legal team insists. The goal is clarity, not intimidation. Terms that read like an EULA get skipped. Terms that read like a business proposal get considered.

### Content Scope Definitions (What's Included, What's Excluded)

Not all content has equal licensing value. Your archive from 2015 might be less valuable than this week's reporting. Technical documentation might warrant different pricing than opinion columns.

```
Content scope:

INCLUDED in licensing terms:
- All articles published in /news/, /analysis/, and /research/
- Archived content from 2020 to present
- Data tables, charts, and embedded visualizations

EXCLUDED from licensing terms (not available for AI training):
- Subscriber-only content behind /premium/
- Wire service content (AP, Reuters) that we redistribute under
  separate license
- User-submitted comments
- Content published before 2020 (contact us for archive licensing)
```

This clarity prevents disputes. If **ClaudeBot** crawls your premium content and you blocked AI access to that section, your llms.txt establishes that those terms existed and were communicated.

The exclusions matter as much as inclusions. Syndicating **AP** content doesn't give you the right to license it to AI companies. User comments may have different copyright status than editorial content. Old archives might have different value propositions than current reporting.

### Pricing and Payment Instructions

Be explicit about the transaction mechanics.

```
Pricing:

Standard per-crawl rates:
- News content (/news/): $0.005 per crawl
- Analysis content (/analysis/): $0.010 per crawl
- Research reports (/research/): $0.020 per crawl

Volume discounts available for crawlers exceeding 50,000
requests per month. Contact licensing team to negotiate.

Payment:

We use Cloudflare Pay-Per-Crawl for automated billing.
Compliant crawlers will be prompted to establish payment
via Stripe upon first request.

For direct licensing arrangements (flat annual fee,
enterprise access), contact ai-licensing@examplepublication.com.

Non-payment enforcement:

Crawlers that access content without payment will be:
1. Throttled to 10 requests per day (first offense)
2. Blocked entirely (repeated violation)
3. Reported to industry blocklists
```

The enforcement section isn't just posturing. It communicates that you monitor crawler behavior and have mechanisms to respond. AI companies that care about compliance will note this. AI companies that ignore terms will ignore this too, but you've established documentation for any future disputes.

[INTERNAL: Pricing Your Content for AI Training]

---

## Creating an Effective llms.txt File

### Tone and Clarity (Writing for AI Interpretation)

Write llms.txt as if you're explaining your licensing to two audiences simultaneously: a competent business professional and a large language model.

Both benefit from:
- Short sentences over compound structures
- Concrete numbers over vague ranges
- Explicit statements over implied meanings
- Consistent terminology throughout

Avoid:
- Hedging ("We may charge" vs. "We charge")
- Conditional language that creates ambiguity ("Depending on circumstances" vs. specific conditions)
- Undefined terms ("Premium content" without specifying what qualifies)

Example of weak language:
```
We generally expect AI companies to pay for access to our
valuable content, though we're open to discussing various
arrangements depending on the nature of the usage.
```

Example of strong language:
```
AI companies must pay $0.008 per page crawled. We offer
volume discounts for monthly crawl counts exceeding 50,000
pages. Contact licensing@example.com before crawling begins.
```

The weak version communicates nothing actionable. The strong version tells AI companies exactly what you expect and how to proceed.

### Specificity Requirements (Vague Terms AI Systems Ignore)

Research from publishers who've implemented llms.txt suggests that vague terms get treated as non-binding suggestions. Specific terms get treated as requirements.

**Anthropic**'s crawler documentation doesn't explicitly address llms.txt parsing, but behavior patterns suggest their system responds differently to:

- "Please attribute properly" (often ignored)
- "Attribution required: Cite as 'Source: ExamplePublication.com' with direct link" (more frequently honored)

The pattern holds across pricing, scope, and contact instructions. Specificity signals seriousness. Vagueness signals that terms are negotiable or optional.

Publishers testing llms.txt implementations report higher compliance rates when their files include:
- Exact dollar amounts, not ranges
- Specific URL paths, not general references to "premium content"
- Named contacts with email addresses, not generic department references
- Numbered lists of terms, not paragraph-form prose

### Examples from Publishers Who've Implemented It

**Trade publication approach:**
```
# llms.txt for ConstructionTechWeekly.com
# Updated: 2026-01-10
# Contact: ai@constructiontechweekly.com

This publication covers technology in the construction
industry. Content includes news, product reviews, and
technical guides.

AI LICENSING TERMS

Training data: $0.012 per page
Retrieval access: $0.006 per page
Archive access (pre-2024): $0.004 per page

Payment via Cloudflare Pay-Per-Crawl required.

Content under /sponsored/ is excluded from licensing
(advertiser-owned).

We honor requests from compliant AI companies within
24 hours.
```

**News organization approach:**
```
# llms.txt - DailyNewsExample.com
# Version 3.1 | Updated 2026-01-08
# Partnership inquiries: partnerships@dailynewsexample.com

DailyNewsExample.com publishes breaking news,
investigative journalism, and editorial content.

CURRENT LICENSING STATUS: ACTIVE

We license content to AI systems under the following
structure:

Tier 1 (Breaking news, <24 hours old): $0.015/crawl
Tier 2 (News, 1-30 days old): $0.008/crawl
Tier 3 (Archive, >30 days old): $0.003/crawl

RETRIEVAL PRICING: 50% of crawl rates listed above

We have active agreements with:
- OpenAI (GPTBot)
- Anthropic (ClaudeBot)

Crawlers not listed above must contact partnerships@
before accessing content.
```

Both examples demonstrate clarity, specificity, and actionable information. The trade publication focuses on simplicity. The news organization adds tiered pricing and signals existing relationships with major AI companies.

[INTERNAL: Cloudflare Pay-Per-Crawl Setup Tutorial]

---

## Placement and Discoverability

### Hosting at /llms.txt (Domain Root)

Convention matters. AI systems and human reviewers look for llms.txt at the domain root:

```
https://example.com/llms.txt
```

Not in a subdirectory. Not with a different filename. Not embedded in another document.

**Cloudflare**'s crawler detection system checks the root location. **Anthropic**'s ClaudeBot documentation references the root location. Community standards assume the root location.

A file at `/legal/llms.txt` or `/licensing/terms.txt` exists, but it's not where anyone looks. You lose discoverability by being creative with placement.

Technical implementation: Create a static text file and serve it from your domain root. Most CMS platforms allow static file uploads. If your CMS restricts root-level files, work with your hosting provider or serve it through a redirect from the expected location.

### Linking from robots.txt and humans.txt

Cross-reference increases discoverability. In your robots.txt:

```
# AI licensing terms available at:
# https://example.com/llms.txt
# https://example.com/rsl.json

User-agent: GPTBot
Crawl-delay: 10
```

This puts your licensing file in the same place crawlers already check. **GPTBot**, **ClaudeBot**, and other AI crawlers read robots.txt as part of their standard operation. Adding a comment pointing to llms.txt increases the chance their operators notice it.

**humans.txt** is a less common standard, but some publishers maintain it. If you have one:

```
/* HUMANS.TXT */

/* LICENSING */
AI licensing terms: https://example.com/llms.txt
Machine-readable: https://example.com/rsl.json
```

The more places you reference your licensing terms, the harder they are to miss.

### HTTP Header Signals for Crawler Detection

Advanced implementations can add HTTP headers that signal licensing file location:

```
X-AI-Licensing: https://example.com/llms.txt
X-RSL-Location: https://example.com/rsl.json
```

This requires server configuration (**Apache**, **Nginx**, or **Cloudflare** Workers), but it ensures the licensing location appears in every HTTP response, not just specific file requests.

Compliance-oriented AI companies have started checking for these headers. The practice isn't universal yet, but it positions you ahead of the curve.

---

## How AI Systems Actually Use llms.txt

### Claude's llms.txt Parsing Behavior (Anthropic's Implementation)

**Anthropic** hasn't published detailed documentation on how **Claude** handles llms.txt during inference. Observed behavior suggests:

1. When Claude retrieves content from a domain, it may check for llms.txt at the root
2. If found, the content enters Claude's context window alongside the retrieved material
3. Claude's responses may incorporate awareness of licensing terms (e.g., declining to reproduce content if terms restrict it)

This isn't guaranteed behavior. It's pattern-matched from publisher reports and limited testing. **Anthropic**'s approach may change, and they haven't committed to any specific llms.txt handling in public documentation.

The implication for publishers: writing clear llms.txt terms gives you a chance at influencing how Claude handles your content post-retrieval. Unclear terms likely get deprioritized or ignored in the model's reasoning.

### OpenAI's Response to llms.txt (Current Status)

**OpenAI**'s official position on llms.txt is undefined. They haven't endorsed or rejected the standard.

**GPTBot** respects robots.txt directives. **ChatGPT** retrieval behavior during browsing sessions is less documented. Publishers report mixed results with llms.txt influencing **ChatGPT**'s handling of retrieved content.

What's clear: OpenAI's partnerships team reads licensing documentation when evaluating publishers for direct deals. Having clear llms.txt terms doesn't guarantee a deal, but it demonstrates professionalism and reduces friction in negotiations.

### Retrieval-Augmented Generation (RAG) Systems and Licensing Awareness

RAG systems retrieve external content and inject it into LLM prompts. This architecture is common in enterprise AI deployments, **Perplexity**, and similar products.

llms.txt becomes relevant when RAG systems:
1. Retrieve content from your domain
2. Check for licensing terms before including content in responses
3. Potentially filter or modify responses based on stated terms

Most RAG implementations don't check llms.txt today. The standard is new. But as AI licensing matures, expect more systems to incorporate licensing awareness into their retrieval pipelines.

Publishers implementing llms.txt now establish their terms before this becomes standard practice. When RAG systems do start checking licensing files, your terms are already in place.

[INTERNAL: AI Crawler Directory]

---

## Updating and Versioning

### When to Update Your llms.txt File

Update your llms.txt when:

1. **Pricing changes**: Any adjustment to per-crawl rates, volume discounts, or tiered pricing
2. **Scope changes**: New content sections added to or removed from licensing
3. **Contact changes**: New licensing email, team restructure, new partnerships
4. **Policy changes**: Enforcement approach shifts, new AI company agreements, new exclusions

Don't update for trivial changes. Frequent updates without substance reduce credibility. AI companies and their compliance teams notice if your version number increments weekly without meaningful changes.

### Changelog Best Practices

Maintain a changelog section within your llms.txt or as a companion file:

```
# CHANGELOG

2026-01-15: Updated retrieval pricing from $0.004 to $0.006
2025-11-20: Added /research/ section to licensed content
2025-09-01: Initial llms.txt publication
```

This creates an audit trail. If disputes arise about when terms changed, your changelog provides documentation. AI companies can verify that their crawler behavior aligned with the terms that existed when they crawled.

### Archiving Previous Versions for Audit Trails

Save dated copies of each llms.txt version:

```
/archive/llms-txt-2025-09-01.txt
/archive/llms-txt-2025-11-20.txt
/archive/llms-txt-2026-01-15.txt
```

Don't link to these from your active llms.txt (that would confuse crawlers about which version is current). But maintain them internally. If legal questions arise, you can demonstrate the exact terms in effect at any given time.

Some publishers version control their llms.txt in Git alongside their codebase. Every change creates a commit with timestamp and author. This level of documentation is overkill for most publishers but valuable for those anticipating significant licensing negotiations or potential disputes.

---

The llms.txt specification fills a gap in the AI licensing stack. RSL handles machine-to-machine communication. robots.txt handles crawler directives. llms.txt handles everything that requires human interpretation or AI contextual understanding.

Publishers who implement it create documentation that serves multiple audiences: the AI systems that might read it during retrieval, the compliance teams at AI companies reviewing licensing terms, and their own legal teams preparing for negotiations or disputes.

The file takes 30 minutes to write. The benefits compound as AI licensing matures and more systems incorporate llms.txt awareness into their operations.

[INTERNAL: RSL Protocol Implementation Guide]
[INTERNAL: Cloudflare Pay-Per-Crawl Setup Tutorial]

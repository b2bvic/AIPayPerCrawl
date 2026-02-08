---
title:: Robots.txt Directives for AI Crawlers: Complete Configuration Guide for GPTBot, Claude-Web, and Google-Extended
description:: Comprehensive guide to robots.txt directives for blocking or allowing AI crawlers including GPTBot, Claude-Web, Google-Extended, and Applebot-Extended.
focus_keyword:: robots.txt directives ai crawlers
category:: Technical Implementation
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Robots.txt Directives for AI Crawlers: Complete Configuration Guide for GPTBot, Claude-Web, and Google-Extended

Publishers control AI crawler access through **robots.txt directives** that specify which bots can access which content. Unlike blanket blocks that stop all crawlers, targeted directives enable granular control: allow **Googlebot** for search indexing while blocking **GPTBot** from AI training, or permit crawling on public articles while restricting access to proprietary documentation. Configuration precision determines whether publishers preserve search visibility while protecting content from unauthorized AI training.

## Robots.txt Fundamentals for AI Crawler Control

**Robots.txt** is a plain text file placed in a website's root directory (`https://example.com/robots.txt`) that provides crawling instructions to automated clients. The file uses a simple syntax: **User-agent** declares which crawler the rules apply to, **Disallow** specifies restricted paths, and **Allow** creates exceptions.

Basic structure:

```
User-agent: [crawler name]
Disallow: [path]
Allow: [path]
```

AI crawlers introduced since 2023 include specific user agent identifiers that enable targeted blocking without affecting search engine crawlers essential for organic traffic.

## Major AI Crawler User Agents

Each AI company operates crawlers with distinct user agent strings. Accurate identification ensures directives target the intended crawler.

### OpenAI - GPTBot

**User agent:** `GPTBot`

Introduced August 2023, GPTBot gathers training data for OpenAI's models including GPT-4 and beyond. The crawler respects robots.txt and provides a feedback mechanism at `https://platform.openai.com/gptbot-feedback` for publishers experiencing issues.

**To block GPTBot entirely:**

```
User-agent: GPTBot
Disallow: /
```

**To allow GPTBot on a specific directory:**

```
User-agent: GPTBot
Allow: /public/
Disallow: /
```

This configuration blocks GPTBot from the entire site except `/public/`.

### Anthropic - Claude-Web

**User agent:** `Claude-Web`

**Anthropic** introduced Claude-Web in late 2023 for training Claude models. The crawler operates similarly to GPTBot, respecting robots.txt and offering publisher support.

**To block Claude-Web:**

```
User-agent: Claude-Web
Disallow: /
```

**To allow only blog content:**

```
User-agent: Claude-Web
Allow: /blog/
Disallow: /
```

### Google - Google-Extended

**User agent:** `Google-Extended`

Launched September 2023, **Google-Extended** is distinct from **Googlebot**. While Googlebot powers Google Search, Google-Extended gathers data for **Bard** (now Gemini) and other AI products. Blocking Google-Extended does not impact search rankings.

**To block Google-Extended while preserving Googlebot:**

```
User-agent: Google-Extended
Disallow: /

User-agent: Googlebot
Allow: /
```

This preserves search indexing while preventing AI training data collection.

### Apple - Applebot-Extended

**User agent:** `Applebot-Extended`

Announced December 2024, Apple's AI training crawler supports **Apple Intelligence** features. Like Google-Extended, it's separate from Apple's general web crawler.

**To block Applebot-Extended:**

```
User-agent: Applebot-Extended
Disallow: /
```

### Cohere - cohere-ai

**User agent:** `cohere-ai`

**Cohere** operates crawlers for training its command and embedding models. Compliance rates are lower than tier-1 companies but blocking remains effective.

```
User-agent: cohere-ai
Disallow: /
```

### Meta - FacebookBot

**User agent:** `FacebookBot`

Meta uses FacebookBot for AI training in addition to social media scraping. Blocking FacebookBot prevents content from training Meta's LLaMA models but may impact Facebook link previews.

```
User-agent: FacebookBot
Disallow: /
```

### Perplexity - PerplexityBot

**User agent:** `PerplexityBot`

**Perplexity AI** introduced a named crawler in 2024 following criticism about undeclared scraping. The crawler feeds Perplexity's real-time answer engine.

```
User-agent: PerplexityBot
Disallow: /
```

### Common Crawl - CCBot

**User agent:** `CCBot`

Common Crawl archives the web for research purposes. Its data feeds numerous AI training pipelines, making it an indirect AI crawler.

```
User-agent: CCBot
Disallow: /
```

Blocking CCBot prevents your content from entering the Common Crawl archive, which AI companies license for training data.

## Comprehensive Multi-Crawler Block Configuration

Publishers who want to block all major AI crawlers while preserving search engine access can combine directives:

```
# Block AI training crawlers
User-agent: GPTBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: CCBot
Disallow: /

# Allow search engine crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
```

This configuration creates a clear separation: AI training crawlers are blocked, traditional search crawlers retain full access.

## Granular Path-Based Controls

Robots.txt supports path-level restrictions, enabling publishers to monetize premium content while keeping general content accessible to AI models.

### Protecting Premium Content

If your site hosts free blog posts and paid courses, allow AI crawlers on blog content while blocking course materials:

```
User-agent: GPTBot
Allow: /blog/
Disallow: /courses/
Disallow: /members/
```

This makes your blog discoverable by AI models (potentially driving awareness) while protecting paid content from unauthorized training use.

### Excluding User-Generated Content

AI training on forums or comments sections creates legal risk if users haven't consented to their content being used for AI. Block these directories:

```
User-agent: GPTBot
Disallow: /forum/
Disallow: /comments/

User-agent: Claude-Web
Disallow: /forum/
Disallow: /comments/
```

### API Documentation and Code Blocks

Technical publishers often produce API documentation and code examples. These are high-value to AI models training on code. Block selectively:

```
User-agent: GPTBot
Allow: /docs/quickstart/
Disallow: /docs/api/
Disallow: /code-examples/
```

This allows GPTBot to access introductory documentation (marketing benefit) while restricting detailed API references and code samples (licensing opportunity).

## Crawl-Delay Directives for AI Crawlers

**Crawl-delay** limits request frequency. While not universally supported, major crawlers including GPTBot and Claude-Web honor it.

```
User-agent: GPTBot
Crawl-delay: 10
```

This restricts GPTBot to one request every 10 seconds. Crawl-delay doesn't stop access—it slows it down, reducing server load and creating operational friction that may prompt AI companies to negotiate licensing for faster access.

### Strategic Use of Crawl-Delay

Instead of blocking AI crawlers entirely, apply aggressive crawl-delays:

```
User-agent: GPTBot
Crawl-delay: 60

User-agent: Claude-Web
Crawl-delay: 60
```

At one request per minute, crawling a 10,000-page site takes nearly seven days. This makes scraping operationally expensive while keeping the door open for licensing discussions.

## Sitemap Restrictions for AI Crawlers

**Sitemap.xml** files tell crawlers which pages exist. Excluding AI crawlers from sitemap directives forces them to discover pages organically (slower, more resource-intensive).

In robots.txt:

```
User-agent: *
Sitemap: https://example.com/sitemap.xml

User-agent: GPTBot
Sitemap: none
```

This provides a sitemap to standard crawlers but denies it to GPTBot, increasing crawling difficulty.

## Wildcard Blocking for Unknown AI Crawlers

Many AI crawlers don't declare themselves. Wildcard rules create default-deny policies:

```
User-agent: *
Disallow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

This blocks everything by default, then explicitly allows known search crawlers. Any undeclared crawler is automatically blocked. However, this approach also blocks benign bots like accessibility tools and uptime monitors.

## Testing Robots.txt Configuration

Robots.txt syntax errors can inadvertently block all crawlers or fail to block AI crawlers. Test configurations using:

### Google's Robots.txt Tester

**Google Search Console** includes a robots.txt tester that validates syntax and checks whether specific URLs are blocked for Googlebot and Google-Extended.

1. Navigate to **Search Console > Crawl > robots.txt Tester**
2. Edit your robots.txt
3. Test URLs against different user agents

### Technical Validation Tools

**Robots.txt validator** tools check syntax and simulate crawler behavior. Use:

- **Ryte Robots.txt Validator**: https://en.ryte.com/free-tools/robots-txt/
- **Merkle Robots.txt Validator**: https://technicalseo.com/tools/robots-txt/

### Log Analysis Post-Implementation

After deploying robots.txt changes, monitor server logs to confirm AI crawlers respect directives. If GPTBot traffic doesn't drop after implementing a block, either:

1. Syntax errors prevent the block from taking effect
2. Cached DNS results delay recognition of updated robots.txt
3. The crawler is non-compliant

Crawlers typically re-fetch robots.txt every 24 hours. Allow 48 hours before concluding non-compliance.

## Common Robots.txt Mistakes That Fail to Block AI Crawlers

### Incorrect User Agent Capitalization

Robots.txt is case-sensitive for user agents. Writing `gptbot` instead of `GPTBot` causes the directive to fail.

**Incorrect:**

```
User-agent: gptbot
Disallow: /
```

**Correct:**

```
User-agent: GPTBot
Disallow: /
```

### Trailing Slashes in Disallow Paths

Trailing slashes matter. `/docs/` blocks only the directory itself; `/docs` blocks all paths starting with `/docs`.

**To block an entire directory and subdirectories:**

```
User-agent: GPTBot
Disallow: /docs
```

**To block only the directory index:**

```
User-agent: GPTBot
Disallow: /docs/
```

Most use cases require blocking the entire directory tree, so omit the trailing slash.

### Multiple Disallow Directives Per User-Agent

Each user agent block should group all directives together. Repeating the user agent creates confusion and may cause parsers to ignore later rules.

**Incorrect:**

```
User-agent: GPTBot
Disallow: /admin/

User-agent: GPTBot
Disallow: /private/
```

**Correct:**

```
User-agent: GPTBot
Disallow: /admin/
Disallow: /private/
```

### Forgetting Allow Exceptions

When blocking a crawler globally but allowing specific paths, the Allow directive must precede the Disallow.

**Correct Order:**

```
User-agent: GPTBot
Allow: /blog/
Disallow: /
```

**Incorrect Order:**

```
User-agent: GPTBot
Disallow: /
Allow: /blog/
```

The incorrect order blocks everything because the Disallow / is evaluated first.

## Robots.txt vs. Meta Robots Tags

**Robots.txt** controls crawler access to pages. **Meta robots tags** control how crawlers handle individual pages after accessing them.

For AI crawlers, meta tags provide page-level granularity:

```html
<meta name="robots" content="noai, noimageai">
```

This emerging standard (proposed by **Spawning.ai**) signals that a page shouldn't be used for AI training. Compliance is voluntary and adoption is nascent, but combining robots.txt with meta tags creates layered protection.

## Server-Level Enforcement Beyond Robots.txt

Robots.txt relies on voluntary compliance. Non-compliant crawlers ignore it. Server configuration enforces blocks:

**Apache .htaccess:**

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} GPTBot [NC,OR]
RewriteCond %{HTTP_USER_AGENT} Claude-Web [NC]
RewriteRule .* - [F,L]
```

**Nginx:**

```nginx
if ($http_user_agent ~* (GPTBot|Claude-Web|Google-Extended)) {
    return 403;
}
```

This converts robots.txt suggestions into hard blocks. Non-compliant crawlers receive 403 errors instead of content.

## Licensing Exemptions via Robots.txt

Publishers who license content to AI companies can create exemption paths:

```
User-agent: GPTBot
Allow: /licensed-content/
Disallow: /
```

Then, licensing agreements grant access only to specific directories. This separates monetized content (accessible) from protected content (blocked).

## Frequently Asked Questions

**Does blocking GPTBot hurt my search rankings?**
No. GPTBot is separate from Googlebot. Blocking GPTBot has zero impact on Google Search indexing or rankings.

**Can I block some AI crawlers but allow others?**
Yes. Each crawler is controlled independently. You can allow GPTBot while blocking Claude-Web, or vice versa.

**What if I block all AI crawlers—can I change my mind later?**
Yes. Updating robots.txt to remove blocks allows crawlers to resume access. However, AI companies may have already trained on competitors' content during your block period.

**How quickly do AI crawlers recognize updated robots.txt?**
Most crawlers re-fetch robots.txt every 24 hours. Allow 48 hours for changes to take effect.

**Do AI crawlers respect Allow exceptions within global Disallow rules?**
Yes. GPTBot, Claude-Web, and Google-Extended support Allow directives that create exceptions to broader Disallow rules.

**Can I block AI crawlers on specific pages rather than entire directories?**
Robots.txt works at the path level, not individual files. To block specific pages, use directory-level restrictions or implement server-side blocks based on URL patterns.

**What if an AI crawler ignores my robots.txt?**
Implement server-level blocks via Apache/Nginx configuration to enforce restrictions regardless of crawler compliance. Document violations for potential legal action.

Publishers who implement precise robots.txt directives control which AI companies access their content, creating leverage for licensing negotiations while preserving search visibility and organic traffic.

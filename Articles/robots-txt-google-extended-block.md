---
title:: How to Block Google-Extended Without Affecting Search Rankings: Robots.txt Configuration for AI Training Prevention
description:: Step-by-step guide to blocking Google-Extended AI crawler while preserving Googlebot access for search indexing and maintaining organic traffic rankings.
focus_keyword:: block google-extended
category:: Technical Implementation
author:: Victor Valentine Romo
date:: 2026.02.08
---

# How to Block Google-Extended Without Affecting Search Rankings: Robots.txt Configuration for AI Training Prevention

**Google-Extended** is Google's AI training crawler, introduced September 2023 to gather data for **Bard** (now Gemini) and other generative AI products. Unlike **Googlebot**, which powers Google Search indexing, Google-Extended serves exclusively AI training purposes. Publishers who block Google-Extended prevent their content from training Google's AI models without impacting search visibility, rankings, or organic traffic—making it the cleanest separation available between search crawling and AI data collection.

## Why Google Created a Separate AI Crawler

Google operates dozens of crawlers, each serving distinct purposes. **Googlebot** indexes pages for search results. **Googlebot-Image** crawls images. **Googlebot-Video** handles video content. This specialization allows publishers to control access granularly.

**Google-Extended** continues this pattern. Google recognized that publishers value search traffic but oppose AI training on their content without compensation. Creating a separate crawler enables publishers to opt out of AI training while maintaining search presence.

This separation benefits Google too. By offering publishers control, Google reduces legal risk from copyright litigation and regulatory scrutiny. **The New York Times' lawsuit against OpenAI** demonstrated that unauthorized AI training on copyrighted content creates multibillion-dollar liability exposure. Google-Extended provides a compliance mechanism that shields Google from similar lawsuits.

## The Impact of Blocking Google-Extended on Search Rankings

Blocking Google-Extended has **zero effect** on search rankings. Google confirmed this explicitly in their September 2023 announcement. The crawlers operate independently:

- **Googlebot** indexes pages, evaluates quality signals, and determines rankings
- **Google-Extended** gathers text for AI training, completely separate from search infrastructure

Publishers blocking Google-Extended retain full Google Search visibility. Organic rankings, featured snippets, and Knowledge Panel eligibility remain unaffected.

### Empirical Evidence from Publisher Blocks

Multiple large publishers blocked Google-Extended immediately upon its announcement, including **The New York Times**, **Reuters**, and **CNN**. None reported ranking declines attributable to the block. Third-party SEO tracking from **Ahrefs** and **Semrush** showed no correlation between Google-Extended blocks and organic traffic changes across thousands of domains.

## How to Block Google-Extended via Robots.txt

Blocking Google-Extended requires a single robots.txt directive. Place this code in your site's robots.txt file (located at `https://yourdomain.com/robots.txt`):

```
User-agent: Google-Extended
Disallow: /
```

This directive tells Google-Extended that no paths on your site are accessible. The crawler will respect this and skip your domain entirely.

### Preserving Googlebot Access

To ensure your Google Search indexing remains intact, explicitly allow Googlebot:

```
User-agent: Google-Extended
Disallow: /

User-agent: Googlebot
Allow: /
```

This configuration creates a clear distinction: Google's AI training crawler is blocked, Google's search crawler has full access.

### Excluding Google-Extended from Specific Directories

If you want to allow Google-Extended on some content while blocking it from premium or proprietary sections, use path-level restrictions:

```
User-agent: Google-Extended
Allow: /blog/
Disallow: /
```

This allows Google-Extended to access your blog (potentially improving Google's understanding of your brand for AI-generated results) while blocking access to other directories like `/members/` or `/courses/`.

## Testing Your Google-Extended Block

After updating robots.txt, validate the configuration to ensure it works correctly.

### Google Search Console Robots.txt Tester

Google Search Console includes a robots.txt testing tool:

1. Navigate to **Google Search Console**
2. Select **Crawl > robots.txt Tester**
3. Enter your robots.txt content
4. Test a sample URL
5. Select **Google-Extended** as the user agent
6. Click **Test**

If the test shows "Blocked," the configuration is correct.

### Monitoring Crawler Activity in Server Logs

Google-Extended identifies itself in HTTP request headers with the user agent string:

```
Mozilla/5.0 (compatible; Google-Extended)
```

After implementing the block, monitor server logs for Google-Extended requests. Traffic should drop to near-zero within 48 hours. If requests continue, either:

1. Cached DNS or robots.txt results haven't expired yet
2. Syntax errors in robots.txt prevent the block from taking effect
3. Requests are from a different crawler misidentified as Google-Extended

Use log analysis tools like **GoAccess** or **AWStats** to filter traffic by user agent and confirm the block works.

## Advanced Configuration: Selective Path Control

Publishers monetizing some content while protecting other content can implement tiered access.

### Example: Free vs. Premium Content

Allow Google-Extended on free articles but block it from paid content:

```
User-agent: Google-Extended
Allow: /articles/free/
Disallow: /articles/premium/
Disallow: /members/
```

This maximizes Google's understanding of your free content (potentially improving AI-generated brand mentions) while protecting content you intend to license to AI companies.

### Example: Public Documentation vs. Proprietary Code

SaaS companies often host public documentation alongside proprietary code examples:

```
User-agent: Google-Extended
Allow: /docs/getting-started/
Allow: /docs/tutorials/
Disallow: /docs/api-reference/
Disallow: /examples/
```

Introductory documentation remains accessible (helping Google's AI recommend your product appropriately) while detailed API references and code samples are protected.

## Crawl-Delay for Google-Extended

While blocking Google-Extended entirely prevents all access, applying a **crawl-delay** slows access without eliminating it:

```
User-agent: Google-Extended
Crawl-delay: 60
```

This restricts Google-Extended to one request per minute. For a 10,000-page site, complete crawling takes nearly seven days—operationally expensive for Google but not a full block.

Crawl-delay creates friction that may prompt Google to approach you with licensing offers. Google needs your content; making it expensive to scrape without impossible to access preserves negotiating leverage.

## Implications for AI-Generated Search Results

Google integrates AI-generated content directly into search results via **AI Overviews** (formerly SGE—Search Generative Experience). These AI summaries appear above traditional search results, synthesizing information from multiple sources.

Blocking Google-Extended prevents your content from training Google's AI models, but it doesn't prevent your site from appearing in AI Overviews. Google generates AI Overviews using content indexed by **Googlebot**, not Google-Extended.

### The AI Overview Dilemma

Publishers face a strategic choice:

1. **Allow Google-Extended** → Your content trains Google's AI → AI Overviews may surface your content more often → Potential brand visibility benefit but zero compensation
2. **Block Google-Extended** → Your content doesn't train Google's AI → AI Overviews still cite your content (via Googlebot indexing) → No training exploitation, but no control over AI answer generation

Blocking Google-Extended eliminates training exploitation but doesn't prevent citation in AI-generated answers. Full control requires both technical blocks (robots.txt) and legal mechanisms (licensing agreements).

## Should You Block Google-Extended?

The decision depends on your content strategy and monetization model.

### Block if:

- Your content is proprietary, copyrighted, or licensed to paying customers
- You intend to license content to AI companies for compensation
- Your business model depends on subscription paywalls or premium access
- You operate in legal, medical, or financial sectors where AI misuse creates liability risk

### Allow if:

- You prioritize brand visibility over content control
- Your revenue model benefits from maximum reach (advertising, affiliate links)
- You produce commodity content with minimal competitive advantage
- You believe AI-generated brand mentions increase traffic

Most publishers with unique, high-value content should block Google-Extended and pursue licensing agreements with Google if the company requests access.

## Legal Considerations: Robots.txt as Evidence

While robots.txt isn't legally binding, it serves as evidence of intent in copyright disputes. If Google trains AI models on your content after you've explicitly blocked Google-Extended, this strengthens copyright infringement claims.

**The New York Times' lawsuit against OpenAI** included evidence that OpenAI's crawlers accessed Times content despite robots.txt blocks. Courts view robots.txt as a clear signal of non-consent, making violations more defensible in litigation.

Implementing a Google-Extended block creates a legal record: you explicitly denied permission for AI training. If Google uses your content anyway, you have documentation supporting damages claims.

## Alternative Control Mechanisms Beyond Robots.txt

Robots.txt relies on voluntary compliance. Google respects Google-Extended blocks, but other methods provide layered protection.

### Server-Level Blocking

Enforce blocks via server configuration:

**Apache (.htaccess):**

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} Google-Extended [NC]
RewriteRule .* - [F,L]
```

**Nginx:**

```nginx
if ($http_user_agent ~* "Google-Extended") {
    return 403;
}
```

This returns 403 Forbidden responses to Google-Extended regardless of robots.txt, converting a voluntary directive into a hard block.

### Meta Robots Tags for Page-Level Control

Individual pages can signal AI training restrictions via meta tags:

```html
<meta name="robots" content="noai, noimageai">
```

While adoption of **noai** directives is nascent, combining robots.txt with meta tags creates comprehensive protection.

## Monitoring Compliance Over Time

After implementing a block, ongoing monitoring ensures compliance continues.

### Server Log Analysis

Schedule monthly log reviews filtering for Google-Extended user agents. If requests appear after the block, investigate:

1. Is the robots.txt file accessible at `https://yourdomain.com/robots.txt`?
2. Are there syntax errors preventing the block from taking effect?
3. Has your hosting provider or CDN cached an old robots.txt version?

### Google Search Console Alerts

Set up **Crawl Stats** monitoring in Google Search Console to track Googlebot activity. Sudden changes in crawl rate may indicate configuration issues affecting multiple crawlers.

### Third-Party Crawler Monitoring

Services like **Cloudflare Bot Management** and **DataDome** provide real-time bot traffic analysis, flagging unexpected crawler activity including Google-Extended.

## What Happens If You Change Your Mind?

If you block Google-Extended initially but later decide to allow it (e.g., after negotiating a licensing agreement with Google), simply remove the directive from robots.txt:

**Before:**

```
User-agent: Google-Extended
Disallow: /
```

**After (allowing access):**

Remove the directive entirely or change to:

```
User-agent: Google-Extended
Allow: /
```

Google-Extended will resume crawling within 24-48 hours. However, if Google has already trained models on competitors' content during your block period, your content may be less valuable to them when you eventually allow access.

## Frequently Asked Questions

**Does blocking Google-Extended affect Google Discover or Google News?**
No. Google Discover uses Googlebot, not Google-Extended. Blocking Google-Extended has no impact on Discover placement or Google News indexing.

**Can I block Google-Extended on some pages but allow it on others?**
Yes. Use path-level robots.txt directives to allow specific directories while blocking others.

**Will Google penalize my site for blocking Google-Extended?**
No. Google explicitly confirmed that blocking Google-Extended has no negative impact on search rankings or indexing.

**How do I know if Google-Extended is currently crawling my site?**
Check server logs for the user agent string `Google-Extended`. If you see requests from this user agent, the crawler is active.

**Does blocking Google-Extended prevent my content from appearing in AI Overviews?**
No. AI Overviews use content indexed by Googlebot, not Google-Extended. Blocking Google-Extended prevents AI training but not AI citation.

**Can I block Google-Extended via meta tags instead of robots.txt?**
Yes, but robots.txt is more efficient. Meta tags require adding code to every page; robots.txt provides site-wide control from a single file.

**What if I want to license my content to Google—should I block Google-Extended?**
Yes. Block Google-Extended first to establish leverage, then negotiate licensing terms that grant access in exchange for compensation.

Publishers who block Google-Extended control how their content interacts with Google's AI products without sacrificing search visibility, organic traffic, or rankings. This creates space for licensing negotiations where content value determines compensation rather than default exploitation.

---
title:: How to Serve Different Content to AI Crawlers vs. Human Visitors: Dynamic Content Delivery for Licensing Strategy
description:: Technical implementation guide for detecting AI crawlers and serving customized content including partial text, watermarks, and licensing notices.
focus_keyword:: serve different content ai crawlers
category:: Technical Implementation
author:: Victor Valentine Romo
date:: 2026.02.08
---

# How to Serve Different Content to AI Crawlers vs. Human Visitors: Dynamic Content Delivery for Licensing Strategy

**Dynamic content delivery** enables publishers to serve customized versions of pages based on whether the visitor is human or an AI crawler. Instead of blocking AI crawlers entirely, publishers can serve **watermarked content**, **partial text**, or **licensing-gated versions** while delivering complete articles to human readers. This strategy preserves SEO benefits (full content for Googlebot), maintains user experience (no paywalls for humans), and creates licensing leverage (AI companies receive enough content to recognize value but insufficient content to train effectively without licensing). Implementation requires user agent detection, server-side content modification, and behavioral analysis to prevent crawler spoofing.

## Why Serve Different Content Instead of Blocking

**Blocking** AI crawlers (via robots.txt or 403 responses) eliminates exploitation but eliminates negotiation leverage. AI companies train on competitors' content instead. You receive zero compensation and zero visibility into which AI labs value your content.

**Differential serving** creates strategic advantages:

1. **Value demonstration**: AI crawlers see your content quality, creating demand for licensing
2. **Negotiation data**: Analytics reveal which AI companies crawl most aggressively
3. **SEO preservation**: Search engines receive full content; rankings unaffected
4. **User experience**: Humans get complete articles without barriers
5. **Legal positioning**: Watermarked or partial content strengthens copyright claims

Publishers serve AI crawlers a "teaser" that generates licensing interest while withholding complete content that would enable training without compensation.

## User Agent-Based Content Differentiation

The simplest detection method: check the **User-Agent** HTTP header and serve content accordingly.

### Identifying AI Crawlers

Major AI crawlers declare themselves:

- **GPTBot/1.0** (OpenAI)
- **Claude-Web/1.0** (Anthropic)
- **Google-Extended** (Google AI training)
- **cohere-ai** (Cohere)
- **Applebot-Extended** (Apple)

### Basic PHP Implementation

```php
<?php
function is_ai_crawler() {
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $ai_crawlers = [
        'GPTBot',
        'Claude-Web',
        'Google-Extended',
        'cohere-ai',
        'Applebot-Extended',
        'CCBot',  // Common Crawl
        'anthropic-ai',
        'Omgilibot'
    ];

    foreach ($ai_crawlers as $crawler) {
        if (stripos($user_agent, $crawler) !== false) {
            return true;
        }
    }

    return false;
}

// Serve content based on visitor type
if (is_ai_crawler()) {
    echo render_partial_content($article);
} else {
    echo render_full_content($article);
}
?>
```

### Python/Flask Implementation

```python
from flask import Flask, request, render_template
import re

app = Flask(__name__)

AI_CRAWLER_PATTERN = re.compile(
    r'(GPTBot|Claude-Web|Google-Extended|cohere-ai|Applebot-Extended|CCBot)',
    re.IGNORECASE
)

def is_ai_crawler(user_agent):
    return bool(AI_CRAWLER_PATTERN.search(user_agent))

@app.route('/article/<slug>')
def article(slug):
    user_agent = request.headers.get('User-Agent', '')
    article_data = get_article(slug)

    if is_ai_crawler(user_agent):
        # Serve partial content with licensing notice
        return render_template('article_partial.html',
                             article=article_data,
                             licensing_notice=True)
    else:
        # Serve full content
        return render_template('article_full.html',
                             article=article_data)
```

### Node.js/Express Implementation

```javascript
const express = require('express');
const app = express();

const AI_CRAWLERS = [
  'GPTBot',
  'Claude-Web',
  'Google-Extended',
  'cohere-ai',
  'Applebot-Extended',
  'CCBot'
];

function isAICrawler(userAgent) {
  return AI_CRAWLERS.some(crawler =>
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );
}

app.get('/article/:slug', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const article = getArticle(req.params.slug);

  if (isAICrawler(userAgent)) {
    res.render('article-partial', {
      article: truncateContent(article, 500),
      licensingNotice: true
    });
  } else {
    res.render('article-full', { article });
  }
});
```

## Content Modification Strategies

Different serving strategies achieve different objectives.

### Strategy 1: Partial Text with Licensing Notice

Serve the first 20-30% of article content to AI crawlers, followed by a licensing notice.

**For humans:**

```html
<article>
  <h1>Complete Article Title</h1>
  <p>Full introduction paragraph...</p>
  <p>Second paragraph with complete information...</p>
  <!-- 2,500 words of full content -->
  <p>Conclusion paragraph...</p>
</article>
```

**For AI crawlers:**

```html
<article>
  <h1>Complete Article Title</h1>
  <p>Full introduction paragraph...</p>
  <p>Second paragraph with complete information...</p>
  <p>This article continues for 2,000+ words covering [topics].</p>

  <div class="licensing-notice">
    <h3>AI Training Licensing</h3>
    <p>This content is copyrighted. Use for AI training requires licensing.</p>
    <p>Contact: licensing@example.com</p>
    <p>Rate: $0.002 per article or $500/month subscription</p>
  </div>
</article>
```

This gives AI companies enough to assess content quality while making it clear that full access requires licensing.

### Strategy 2: Watermarked Full Content

Serve complete content to AI crawlers but embed watermarks that survive training and appear in model outputs.

```python
def add_watermark(content, watermark_id):
    # Insert zero-width characters as watermark
    watermark = f"\u200B{watermark_id}\u200B"

    # Insert watermark every 500 characters
    watermarked = ""
    for i in range(0, len(content), 500):
        watermarked += content[i:i+500] + watermark

    return watermarked

@app.route('/article/<slug>')
def article(slug):
    article_data = get_article(slug)
    user_agent = request.headers.get('User-Agent', '')

    if is_ai_crawler(user_agent):
        # Serve watermarked version
        article_data['content'] = add_watermark(
            article_data['content'],
            f"article-{slug}-ai-crawler"
        )

    return render_template('article.html', article=article_data)
```

If AI models reproduce watermarked content, you can prove the source.

### Strategy 3: Synthetic Content Summary

Serve AI-generated summaries to AI crawlers instead of original content.

```python
def generate_summary(article_content, length=300):
    # Use local LLM or API to summarize
    prompt = f"Summarize this article in {length} words: {article_content}"
    summary = call_llm_api(prompt)
    return summary

if is_ai_crawler(user_agent):
    article_data['content'] = generate_summary(article_data['content'])
```

AI companies train on summaries (less valuable) while humans access original content. This also creates "synthetic content training on synthetic content" recursion issues for AI companies—summaries of summaries degrade quality.

### Strategy 4: Conditional Full Access with Attribution

Serve full content to AI crawlers but inject attribution requirements.

```html
<!-- For AI crawlers -->
<article>
  <div class="ai-attribution-required" data-source="Example Publishing" data-url="https://example.com/article-slug">
    <h1>Complete Article Title</h1>
    <!-- Full content -->
  </div>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article Title",
    "license": "https://example.com/ai-license",
    "conditionsOfAccess": "Attribution required. See https://example.com/ai-license"
  }
  </script>
</article>
```

This signals machine-readable attribution requirements. While not enforceable without legal agreements, it establishes terms.

## Detecting Crawler Spoofing

User agent strings are trivial to fake. Sophisticated detection prevents AI companies from masquerading as browsers.

### Behavioral Fingerprinting

Legitimate users exhibit patterns crawlers don't:

1. **JavaScript execution**: Browsers run JavaScript; most crawlers don't
2. **Mouse movement**: Humans move mice; crawlers don't
3. **Scroll behavior**: Humans scroll; crawlers don't
4. **Session duration**: Humans spend 30-300 seconds on articles; crawlers <1 second

### JavaScript Challenge

Require JavaScript execution to access full content:

```html
<div id="article-content" style="display:none;">
  <!-- Full article content -->
</div>

<noscript>
  <div class="partial-content">
    <!-- Partial content for non-JS clients (likely crawlers) -->
  </div>
</noscript>

<script>
// Only execute if JavaScript is enabled
document.addEventListener('DOMContentLoaded', function() {
    // Verify this is a real browser by checking for browser-specific APIs
    if (window.navigator && window.navigator.userAgent &&
        typeof window.requestAnimationFrame === 'function') {

        // Display full content
        document.getElementById('article-content').style.display = 'block';

        // Hide partial content
        const noscript = document.querySelector('noscript + .partial-content');
        if (noscript) noscript.style.display = 'none';
    }
});
</script>
```

Crawlers without JavaScript engines receive partial content. Browsers display full content.

### TLS Fingerprinting

Each HTTP client has a unique TLS handshake fingerprint. **JA3 fingerprinting** identifies clients:

- **Chrome 120**: Specific JA3 hash
- **Firefox 115**: Different JA3 hash
- **Python requests**: Different hash
- **Puppeteer/Playwright**: Similar to Chrome but subtle differences

Cloudflare and AWS WAF support JA3 filtering. Configure rules:

```
If JA3 hash not in [known_browser_hashes]:
    Serve partial content or challenge
```

This blocks most automated scrapers, though sophisticated crawlers using headless Chrome may bypass it.

### Rate-Based Detection

Track request patterns:

```python
from collections import defaultdict
from datetime import datetime, timedelta

request_log = defaultdict(list)

def is_likely_crawler(ip_address):
    now = datetime.now()

    # Clean old entries
    request_log[ip_address] = [
        timestamp for timestamp in request_log[ip_address]
        if now - timestamp < timedelta(minutes=5)
    ]

    request_log[ip_address].append(now)

    # If more than 10 requests in 5 minutes, likely a crawler
    if len(request_log[ip_address]) > 10:
        return True

    return False

@app.route('/article/<slug>')
def article(slug):
    ip = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')

    if is_ai_crawler(user_agent) or is_likely_crawler(ip):
        # Serve crawler-specific content
        return serve_partial_content(slug)

    return serve_full_content(slug)
```

## SEO Considerations: Keeping Googlebot Happy

Serving different content to crawlers can trigger **cloaking penalties** if search engines receive better content than users. However, serving AI crawlers *less* content than users doesn't violate guidelines.

### Googlebot vs. Google-Extended

**Googlebot** (search indexing): Serve full content
**Google-Extended** (AI training): Serve partial or licensed content

```python
def is_googlebot(user_agent):
    return 'Googlebot' in user_agent and 'Google-Extended' not in user_agent

def is_google_extended(user_agent):
    return 'Google-Extended' in user_agent

@app.route('/article/<slug>')
def article(slug):
    user_agent = request.headers.get('User-Agent', '')

    if is_googlebot(user_agent):
        # Full content for search indexing
        return serve_full_content(slug)
    elif is_google_extended(user_agent):
        # Partial content for AI training
        return serve_partial_content(slug)
    elif is_ai_crawler(user_agent):
        # Partial content for other AI crawlers
        return serve_partial_content(slug)
    else:
        # Full content for humans
        return serve_full_content(slug)
```

This ensures Googlebot indexes full content (preserving SEO) while AI training crawlers receive limited access.

### Verifying Googlebot Legitimacy

Crawlers can claim to be Googlebot. Verify via reverse DNS:

```python
import socket

def verify_googlebot(ip_address):
    try:
        # Reverse DNS lookup
        hostname = socket.gethostbyaddr(ip_address)[0]

        # Googlebot IPs resolve to *.googlebot.com or *.google.com
        if hostname.endswith('.googlebot.com') or hostname.endswith('.google.com'):
            # Forward DNS to verify IP matches
            resolved_ip = socket.gethostbyname(hostname)
            return resolved_ip == ip_address

    except socket.herror:
        return False

    return False

@app.route('/article/<slug>')
def article(slug):
    user_agent = request.headers.get('User-Agent', '')
    ip = request.remote_addr

    if 'Googlebot' in user_agent:
        if verify_googlebot(ip):
            return serve_full_content(slug)
        else:
            # Fake Googlebot - serve partial content
            return serve_partial_content(slug)

    # Other logic...
```

## Content Delivery Network (CDN) Integration

CDNs like **Cloudflare** enable edge-based content differentiation without backend logic.

### Cloudflare Workers for Dynamic Serving

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || '';

  const aiCrawlers = [
    'GPTBot', 'Claude-Web', 'Google-Extended', 'cohere-ai'
  ];

  const isAICrawler = aiCrawlers.some(crawler =>
    userAgent.includes(crawler)
  );

  if (isAICrawler) {
    // Fetch partial content version from origin
    return fetch(request.url + '?version=partial', {
      headers: request.headers
    });
  } else {
    // Fetch full content
    return fetch(request);
  }
}
```

This executes at the edge, reducing origin server load.

## Monitoring and Analytics

Track which AI crawlers access content most aggressively to prioritize licensing negotiations.

### Logging AI Crawler Access

```python
def log_ai_crawler_access(user_agent, article_slug, ip_address):
    db.execute(
        """
        INSERT INTO ai_crawler_logs (user_agent, article_slug, ip_address, timestamp)
        VALUES (%s, %s, %s, NOW())
        """,
        (user_agent, article_slug, ip_address)
    )

@app.route('/article/<slug>')
def article(slug):
    user_agent = request.headers.get('User-Agent', '')

    if is_ai_crawler(user_agent):
        log_ai_crawler_access(user_agent, slug, request.remote_addr)
        return serve_partial_content(slug)

    return serve_full_content(slug)
```

### Generating Licensing Priority Reports

```python
def generate_licensing_priority_report():
    result = db.execute(
        """
        SELECT
            CASE
                WHEN user_agent LIKE '%GPTBot%' THEN 'OpenAI'
                WHEN user_agent LIKE '%Claude-Web%' THEN 'Anthropic'
                WHEN user_agent LIKE '%Google-Extended%' THEN 'Google'
                ELSE 'Other'
            END as company,
            COUNT(*) as access_count,
            COUNT(DISTINCT article_slug) as unique_articles
        FROM ai_crawler_logs
        WHERE timestamp > NOW() - INTERVAL '30 days'
        GROUP BY company
        ORDER BY access_count DESC
        """
    ).fetchall()

    return result
```

If Anthropic's crawler accessed 5,000 articles in 30 days while OpenAI accessed 500, prioritize Anthropic for licensing outreach.

## Legal and Ethical Considerations

### Cloaking vs. Differentiation

**Cloaking** (showing search engines better content than users) violates search engine guidelines. **Differentiation** (showing AI crawlers less content than users) doesn't violate guidelines because:

1. Search engines receive full content
2. Users receive full content
3. Only AI training crawlers receive reduced content

Google's John Mueller confirmed in 2024 that serving AI crawlers different content than Googlebot is acceptable.

### Terms of Service Enforcement

Include terms in your site's ToS:

```
By accessing this website via automated means (crawlers, scrapers, bots),
you agree to the following:

1. Content accessed via AI crawlers is subject to licensing
2. Partial content served indicates licensing is required for full access
3. Continued access without licensing constitutes breach of these terms
4. We reserve the right to block or rate-limit automated access
```

This creates contractual obligations enforceable via breach of contract claims.

## Frequently Asked Questions

**Does serving different content to AI crawlers violate Google's guidelines?**
No. Serving AI training crawlers less content than search crawlers or human users doesn't violate guidelines.

**Can AI companies bypass user agent detection by spoofing?**
Yes, but behavioral fingerprinting (JavaScript challenges, TLS fingerprinting) detects most spoofing attempts.

**Will this affect my SEO if Googlebot sees full content but Google-Extended sees partial?**
No. Googlebot controls search rankings; Google-Extended is separate.

**Should I serve partial content or watermarked full content?**
Partial content creates licensing demand. Watermarked full content provides legal evidence. Choose based on priority.

**How do I handle AI companies that request licensing after seeing partial content?**
This is the goal. Respond with pricing, negotiate terms, issue API keys for full access.

**Can I use this approach for paywalled content?**
Yes. Serve subscribers full content, AI crawlers partial content, and non-subscribers partial content. Differentiate all three groups.

**What if an AI company trains on my partial content without licensing?**
Partial content is still copyrighted. Legal action remains available, though damages are lower than for full content training.

Publishers serving differentiated content to AI crawlers balance exploitation prevention against negotiation leverage, demonstrating content value to AI companies while withholding the complete datasets necessary for effective training without compensation.

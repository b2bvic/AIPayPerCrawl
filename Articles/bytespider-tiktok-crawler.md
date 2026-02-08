title:: Bytespider: ByteDance's Aggressive AI Crawler and How to Stop It
description:: Analysis of ByteDance's Bytespider crawler. The most aggressive AI bot on the web ignores robots.txt, spoofs user agents, and refuses all licensing. Blocking strategies inside.
focus_keyword:: bytespider tiktok crawler
category:: crawlers
author:: Victor Valentine Romo
date:: 2026.02.07

# Bytespider: ByteDance's Aggressive AI Crawler and How to Stop It

Every AI crawler discussion eventually arrives at **Bytespider**. Not because **ByteDance**'s crawler is the most commercially significant — that distinction belongs to [GPTBot](/articles/gptbot-behavior-analysis.html). Not because it's the most technically sophisticated. **Bytespider** dominates the conversation because it is the most aggressive, most non-compliant, and most frustrating AI crawler publishers face.

**Bytespider** ignores robots.txt. It spoofs user agents. It operates from rotating IP ranges that resist static block lists. It doesn't participate in marketplace licensing. It doesn't negotiate content deals. It scrapes everything it can reach and feeds the data to **ByteDance**'s suite of AI products, including models powering **TikTok** features and the **Doubao** large language model.

While [ClaudeBot](/articles/claudebot-behavior-analysis.html) represents the ideal — compliant, predictable, willing to pay — **Bytespider** represents the adversary. Understanding its behavior and deploying effective countermeasures forms the defensive baseline of any AI crawler management strategy.

---

## Identification

### User-Agent String

When **Bytespider** identifies itself honestly:

```
Bytespider
```

Some requests include additional detail:

```
Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)
```

The user-agent string is notably sparse compared to [GPTBot](/articles/gptbot-behavior-analysis.html) or [ClaudeBot](/articles/claudebot-behavior-analysis.html), which include documentation URLs and version numbers. **Bytespider**'s minimal identification reflects its minimal concern with publisher relations.

### The Spoofing Problem

**Bytespider** frequently operates under false user-agent strings. Publisher reports document requests from **ByteDance** IP ranges claiming to be:

- Standard Chrome browser: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`
- Standard Firefox: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0`
- Generic unidentified bot: Various custom strings

When a "browser" sends 500 requests per second to your server without loading CSS, JavaScript, or images — that's not a browser. It's a crawler hiding behind a browser's identity.

User-agent-based blocking catches honest **Bytespider** requests. It misses the spoofed ones entirely. Effective defense requires IP-based and behavioral detection.

### Known IP Ranges

**ByteDance** doesn't publish official IP ranges for **Bytespider**. Community-maintained lists, compiled through publisher log analysis, include:

```
220.243.135.0/24
220.243.136.0/24
111.225.148.0/24
111.225.149.0/24
110.249.201.0/24
110.249.202.0/24
60.8.123.0/24
60.8.124.0/24
```

These ranges are known to shift. **ByteDance** operates from data centers in China with allocated IP blocks that change periodically as infrastructure evolves.

ASN-level identification provides broader coverage:

```
AS396986 (ByteDance Inc.)
AS138294 (ByteDance)
```

Blocking at the ASN level catches all IP ranges associated with **ByteDance**, including new allocations. CDN-level solutions (**Cloudflare**, **Akamai**) support ASN-based rules.

---

## Crawl Behavior

### Volume: The Highest of Any AI Crawler

**Bytespider** routinely generates the highest raw request volume among AI crawlers on publisher domains:

| Publisher Size | Typical Daily Bytespider Requests | vs. GPTBot |
|---------------|----------------------------------|------------|
| Small (under 100K PV) | 100-500 | 2-3x GPTBot |
| Medium (100K-1M PV) | 1,000-5,000 | 3-5x GPTBot |
| Large (1M-10M PV) | 5,000-20,000 | 3-4x GPTBot |
| Enterprise (10M+ PV) | 20,000-100,000+ | 3-5x GPTBot |

On some publisher domains, **Bytespider** accounts for 40-50% of all bot traffic. The volume is not merely proportional to site size — it's aggressive relative to other crawlers of similar purpose.

### Indiscriminate Targeting

Unlike [ClaudeBot](/articles/claudebot-behavior-analysis.html) (which selects high-quality pages) or [GPTBot](/articles/gptbot-behavior-analysis.html) (which prioritizes recent content), **Bytespider** scrapes broadly:

- Homepage, section fronts, individual articles — everything
- Archived content dating back years
- Category pages, tag archives, author pages
- Sitemaps and RSS feeds
- Static assets in some cases (though less systematically)

The pattern suggests a data-harvesting operation optimized for volume rather than signal quality. **ByteDance** appears to prioritize corpus size over content curation, possibly for pre-training phases where diverse data matters more than per-page quality.

### Disregard for robots.txt

The defining characteristic. Publisher after publisher documents continued **Bytespider** scraping after implementing explicit robots.txt blocks:

```
User-agent: Bytespider
Disallow: /
```

Server logs show **Bytespider** requests continuing at unchanged rates after this directive is published. The crawler either doesn't check robots.txt or checks and ignores it.

No major publisher has reported **Bytespider** respecting robots.txt directives. This contrasts sharply with **GPTBot** (consistently compliant) and **ClaudeBot** (near-perfect compliance).

### No Licensing or Payment Infrastructure

**Bytespider** does not participate in:
- [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html)
- [RSL protocol](/articles/rsl-protocol-implementation-guide.html) licensing
- Direct licensing negotiations
- Any known content payment mechanism

**ByteDance** has not signed public content licensing deals comparable to [News Corp-OpenAI](/articles/news-corp-openai-licensing-deal.html) or [Reddit-Google](/articles/reddit-google-ai-licensing-deal.html). The company's posture toward publisher content licensing remains opaque.

The conclusion: **Bytespider** cannot be monetized. It can only be blocked.

---

## Blocking Strategies

### Layer 1: robots.txt (Symbolic Only)

Add the directive for documentation and legal purposes, even though **Bytespider** ignores it:

```
User-agent: Bytespider
Disallow: /
```

The robots.txt entry establishes that you expressly prohibited **Bytespider** access. If [legal action](/articles/copyright-law-ai-training-data.html) becomes viable, this documentation proves your terms were published. It doesn't prevent scraping, but it creates evidentiary value.

### Layer 2: Server-Level Blocking

**Nginx:**

```nginx
map $http_user_agent $is_bytespider {
    default 0;
    ~*Bytespider 1;
    ~*bytedance 1;
}

server {
    if ($is_bytespider) {
        return 403;
    }
}
```

[Full Nginx configuration guide](/articles/nginx-ai-crawler-blocking.html)

**Apache .htaccess:**

```apache
RewriteCond %{HTTP_USER_AGENT} (Bytespider|bytedance) [NC]
RewriteRule .* - [F,L]
```

[Full Apache configuration guide](/articles/apache-htaccess-bot-management.html)

These rules catch honest **Bytespider** requests. They don't catch spoofed requests. Layer 3 addresses that gap.

### Layer 3: IP Range Blocking

Block known **ByteDance** infrastructure regardless of user-agent claims:

**Nginx:**

```nginx
deny 220.243.135.0/24;
deny 220.243.136.0/24;
deny 111.225.148.0/24;
deny 111.225.149.0/24;
deny 110.249.201.0/24;
deny 110.249.202.0/24;
deny 60.8.123.0/24;
deny 60.8.124.0/24;
```

**Cloudflare Firewall Rule:**

```
(ip.geoip.asnum eq 396986) or (ip.geoip.asnum eq 138294)
```
Action: Block

The ASN-based rule catches all ByteDance IP ranges, including new allocations that static IP lists miss. [CDN-level management](/articles/cdn-level-crawler-management.html) provides the most comprehensive coverage for IP-based blocking.

### Layer 4: Behavioral Detection

For **Bytespider** traffic that spoofs both user-agent and operates from non-ByteDance IP ranges (increasingly common):

**Rate-based detection:**
- Flag IP addresses making 100+ requests per minute without corresponding CSS/JS/image requests
- Flag IP addresses with uniform request timing (bot signature)
- Flag IP addresses accessing pages in sitemap order without following links

**TLS fingerprint detection:**
- **Cloudflare** Business and Enterprise plans identify client libraries by TLS handshake characteristics
- **Bytespider** using Python `requests` or Go `net/http` produces distinct TLS fingerprints from genuine browsers
- **Akamai Bot Manager** provides similar detection

**Challenge-based detection:**
- JavaScript challenges filter clients that can't execute browser-side code
- CAPTCHAs block automated clients entirely
- **Cloudflare** Managed Challenge provides the lowest-friction implementation

### Layer 5: CDN Edge Blocking

For maximum coverage, deploy blocking at the CDN edge:

**Cloudflare:**
1. Navigate to **Security > WAF > Custom Rules**
2. Create rule: `(http.user_agent contains "Bytespider") or (http.user_agent contains "bytedance") or (ip.geoip.asnum eq 396986)`
3. Action: Block
4. Deploy

**Fastly, Akamai, Bunny CDN:** See [CDN-level crawler management guide](/articles/cdn-level-crawler-management.html).

CDN edge blocking stops requests before they reach your origin server. Zero bandwidth consumed. Zero server resources spent. The blocked request is handled at whatever edge node is closest to **ByteDance**'s data center.

---

## The Bytespider Enforcement Problem

### Why Traditional Controls Fail

**Bytespider** represents the enforcement gap in web crawling:

1. **robots.txt** — Voluntary protocol. **Bytespider** doesn't volunteer.
2. **User-agent blocking** — Requires honest identification. **Bytespider** lies.
3. **IP blocking** — Requires stable infrastructure. **ByteDance** rotates ranges.
4. **Rate limiting** — Requires distinguishable traffic patterns. Sophisticated spoofers mimic human behavior.

No single enforcement mechanism stops a determined, well-resourced adversary. Defense in depth — layering all available mechanisms — is the only viable strategy. Each layer catches some fraction of **Bytespider** traffic. Collectively, they block 90-95%. The remaining 5-10% represents the cost of operating on the open web.

### Legal Remedies

Technical blocking addresses the symptom. Legal action addresses the cause. **ByteDance**'s disregard for robots.txt and publisher licensing terms creates potential legal exposure:

- **Computer Fraud and Abuse Act (CFAA)** — Unauthorized access to computer systems. robots.txt as explicit terms of access may trigger CFAA claims, though case law is unsettled.
- **Copyright infringement** — Using copyrighted content for AI training without permission. Multiple [active lawsuits](/articles/publisher-class-actions-ai.html) test this theory.
- **Trespass to chattels** — Consuming server resources without authorization. Established precedent exists from anti-spam cases.
- **International enforcement** — **ByteDance** operates from China, complicating enforcement of Western legal judgments.

No publisher has successfully litigated against **ByteDance** specifically for **Bytespider** scraping as of early 2026. The legal path exists but remains untested for this specific adversary.

### Industry Coalition Approaches

Individual publishers lack leverage against a company of **ByteDance**'s scale. Collective action changes the dynamic:

- **Trade associations** documenting **Bytespider** non-compliance across member publications
- **Coordinated blocking** across publisher coalitions to degrade **ByteDance**'s data quality
- **Regulatory lobbying** for AI training data legislation that creates enforceable obligations
- **Public pressure campaigns** highlighting the gap between **ByteDance**'s conduct and Western competitors' compliance

The industry response to **Bytespider** is as much political and legal as it is technical.

---

## Monitoring Bytespider Activity

### Detection Metrics

Track in your [analytics dashboard](/articles/ai-crawler-analytics-dashboard.html):

- **Daily Bytespider request volume** (by user-agent identification)
- **Requests from ByteDance ASNs** (catches spoofed requests)
- **Block success rate** — What percentage of identified Bytespider requests receive 403?
- **Leakage detection** — Any 200 responses to ByteDance infrastructure?
- **New IP ranges** — ByteDance addresses not in your current block list

### Alert Configuration

**Critical alert:** Any 200 (served) response to ByteDance IP ranges or Bytespider user-agent. This indicates a block failure — content is being scraped despite your controls.

**Warning alert:** Bytespider request volume exceeds 2x the 30-day average. Sudden spikes may indicate new scraping campaigns.

**Info alert:** New IP ranges appearing in ByteDance ASN blocks. Maintain awareness of infrastructure changes for block list updates.

### Monthly Block List Updates

**ByteDance** infrastructure evolves. Monthly reviews prevent block list decay:

1. Download current ByteDance ASN allocations from RIPE/ARIN databases
2. Compare against your current block list
3. Add new ranges
4. Remove deprecated ranges (if confirmed no longer active)
5. Test that blocking still works after updates

Automated approaches: use Cloudflare's ASN-based blocking (auto-updates as ASN allocations change) rather than maintaining static IP lists.

---

## The Cost of Bytespider to Publishers

### Bandwidth and Resource Consumption

**Bytespider**'s aggressive volume translates directly into infrastructure costs:

**Bandwidth calculation for a mid-sized publisher:**
- Daily **Bytespider** requests: 5,000
- Average page size: 150KB
- Daily bandwidth consumed: 750MB
- Monthly bandwidth consumed: ~22GB
- At CDN pricing of $0.04/GB: $0.88/month
- At origin bandwidth pricing of $0.10/GB: $2.20/month

For a single publisher, the cost is modest. Across thousands of publishers, **ByteDance** consumes tens of terabytes monthly — bandwidth the publishers pay for while **ByteDance** profits from the extracted content.

**Server resource impact:**
- PHP/application processing for each request (if not blocked at server level)
- Database queries if the CMS generates pages dynamically
- Memory allocation per concurrent request
- Log storage for thousands of daily entries

Publishers on shared hosting with resource limits report **Bytespider** contributing to throttling and performance degradation. On metered hosting, the crawler's activity appears on invoices.

### Competitive Harm

**ByteDance**'s AI products — particularly **Doubao** (used by hundreds of millions in China) and **TikTok** AI features — compete with publisher content in their respective markets. Content scraped from English-language publishers may train models that generate competing content in any language.

The competitive harm is difficult to quantify but structurally significant. Every page **Bytespider** scrapes potentially contributes to AI products that reduce the unique value of the original content. Unlike [GPTBot](/articles/gptbot-behavior-analysis.html) or [ClaudeBot](/articles/claudebot-behavior-analysis.html), where licensing creates a mutually beneficial exchange, **Bytespider**'s extraction is purely extractive.

### The Cumulative Publisher Impact

Aggregating across the publishing industry:

- **Bytespider** scrapes millions of domains daily
- Combined bandwidth consumption likely exceeds petabytes monthly
- Zero compensation flows to any publisher
- Content feeds AI products generating billions in revenue for **ByteDance**

The asymmetry defines why **Bytespider** dominates AI crawler discussions: maximum extraction, zero compensation, minimal compliance, limited legal recourse.

---

## Bytespider's Role in the Broader AI Ecosystem

### ByteDance's AI Ambitions

**ByteDance** isn't merely a social media company. Their AI investments span:

- **Doubao** — Large language model (China's most-used AI chatbot as of late 2025)
- **TikTok AI features** — Content recommendation, generation, and search powered by AI models
- **Coze** — AI bot development platform
- **Research labs** — Active AI research producing papers at major conferences

**Bytespider** feeds this ecosystem. Your scraped content potentially trains models used by hundreds of millions of **TikTok** users and Chinese AI consumers. The scale of downstream value extraction is enormous — and entirely uncompensated.

### The Geopolitical Dimension

**ByteDance** operates from China under Chinese law. Western [copyright frameworks](/articles/copyright-law-ai-training-data.html) may not apply or may be unenforceable. This creates an asymmetry: Western AI companies (**OpenAI**, **Anthropic**, **Google**) operate under legal regimes that incentivize licensing compliance. **ByteDance** operates under a regime with different intellectual property enforcement priorities.

This asymmetry explains why **Bytespider** behaves differently from Western crawlers. The legal consequences that constrain **GPTBot** and **ClaudeBot** don't apply in the same way to **Bytespider**. Technical enforcement — not legal enforcement — is the primary defense.

---

## Frequently Asked Questions

### Can I monetize Bytespider through Pay-Per-Crawl?

No. **Bytespider** does not participate in [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html), the [RSL protocol](/articles/rsl-protocol-implementation-guide.html), or any known licensing marketplace. **ByteDance** has not established content payment relationships with Western marketplace infrastructure. The only option for **Bytespider** is blocking.

### How effective is blocking Bytespider?

Layered blocking (robots.txt + user-agent + IP range + ASN + behavioral) catches an estimated 90-95% of **Bytespider** traffic. Sophisticated spoofing evades some detection. CDN-level behavioral analysis (**Cloudflare** Bot Management, **Akamai** Bot Manager) improves detection rates but can't achieve 100% against a well-resourced adversary.

### Does blocking Bytespider affect my TikTok presence?

No. **Bytespider** (web scraping for AI training) is separate from TikTok's content crawlers for social media features. Blocking **Bytespider** doesn't affect how your content appears in TikTok search, link previews, or social sharing. These use different infrastructure.

### Why is Bytespider so much more aggressive than other AI crawlers?

Likely a combination of factors: less regulatory pressure on data collection practices, aggressive AI development timelines, and a different cultural approach to web data commons. Western AI companies face public backlash, regulatory scrutiny, and legal action that moderate their crawling behavior. **ByteDance** faces less of this pressure in its primary market.

### Should I block all traffic from China to stop Bytespider?

Geographic blocking is overly broad. Legitimate users, search engine crawlers, and business partners from China get caught in the crossfire. Block **ByteDance** specifically through ASN-based rules rather than country-level blocks. If you genuinely have no Chinese audience or business interest, geographic blocking becomes more defensible — but evaluate the trade-offs carefully.

### How does Bytespider compare to CCBot in terms of blocking priority?

Both should be blocked, but for different reasons. **Bytespider** scrapes aggressively and ignores all compliance mechanisms — it's a direct infrastructure burden. **CCBot** (Common Crawl) is technically compliant with robots.txt but feeds training data to multiple AI companies including **OpenAI**, **Anthropic**, **Meta**, and others. Blocking **CCBot** is a force multiplier — one block reduces your content's presence across multiple AI models. Blocking **Bytespider** is a direct defense against the most aggressive single crawler. Implement both.

### Are there other Chinese AI crawlers beyond Bytespider I should worry about?

Yes. The Chinese AI ecosystem includes crawlers from **Baidu** (for ERNIE models), **Alibaba** (for Qwen models), **Tencent** (for Hunyuan models), and various smaller players. Many operate from Chinese IP ranges and may not identify themselves with recognizable user-agent strings. Behavioral detection — identifying automated access patterns from Chinese infrastructure — catches these crawlers even when they don't self-identify. [CDN-level behavioral analysis](/articles/cdn-level-crawler-management.html) provides the best coverage for identifying unlabeled crawlers from any origin.

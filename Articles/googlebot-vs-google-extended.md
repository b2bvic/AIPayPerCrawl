---
title:: Googlebot vs Google-Extended: Technical Differences and Control Strategies
description:: Googlebot indexes for search while Google-Extended trains AI models. Learn the technical differences, IP ranges, user-agents, and robots.txt strategies for each.
focus_keyword:: Googlebot vs Google-Extended
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Googlebot vs Google-Extended: Technical Differences and Control Strategies

**Googlebot** and **Google-Extended** serve fundamentally different purposes within Google's infrastructure—one indexes content for search results, the other ingests data for AI model training. Publishers who treat them identically miss opportunities to monetize AI training while preserving search visibility, or inadvertently block search indexing when intending only to restrict AI access. The technical distinctions between these crawlers dictate control strategies, from robots.txt configuration to licensing negotiations and bandwidth allocation.

## Purpose and Operational Context

**Googlebot** crawls the web to populate Google's search index, discovering new pages, updating existing entries, and checking for site changes. Search indexing creates an immediate value exchange: Google drives referral traffic back to publishers through search results, ads, and features like Featured Snippets. Publishers tolerate—even encourage—**Googlebot** access because it delivers visitor acquisition, a measurable ROI that justifies hosting and bandwidth costs.

**Google-Extended** trains generative AI models like **Gemini**, processing content to extract patterns, relationships, and knowledge that enable language generation. Unlike search indexing, AI training produces no referral traffic. Once a model ingests content, it generates responses directly to user queries rather than linking back to sources. This asymmetry broke the traditional search bargain, prompting Google to create a separate crawler publishers could block without sacrificing search visibility.

The timing matters. **Google-Extended** launched in September 2023, but **Gemini** (formerly **Bard**) training began earlier using data crawled by **Googlebot**. Publishers blocking **Google-Extended** today don't "unlearn" content already incorporated into model weights from pre-2023 crawling. This creates a retroactive licensing challenge—AI companies trained on content before publishers had technical means to opt out.

Google's decision to separate crawlers acknowledged publisher concerns but also established a precedent: AI training constitutes a distinct use case requiring opt-in (or at minimum opt-out) controls. This architectural choice validated publisher arguments that training differs from search, supporting demands for separate licensing terms and compensation structures.

## User-Agent Strings and Identification

**Googlebot** uses two primary user-agent strings for desktop and mobile crawling:

Desktop: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`

Mobile: `Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`

The URL `http://www.google.com/bot.html` provides documentation on **Googlebot** behavior. Crawlers append this to signal legitimacy—scrapers spoofing user-agents often omit the documentation URL or use incorrect formats.

**Google-Extended** user-agent:

`Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Google-Extended) Chrome/W.X.Y.Z Safari/537.36`

The `Google-Extended` identifier appears prominently, distinguishing it from search crawlers. Robots.txt rules target this exact string for AI-specific controls. Server logs filtering for `Google-Extended` isolate AI training requests from search indexing traffic.

Additional Google crawler variants include **Googlebot-Image**, **Googlebot-Video**, **Googlebot-News**, and **AdsBot-Google**, each with identifying strings. These typically respect **Googlebot** rules in robots.txt unless you create specific directives for each variant. **Google-Extended** operates independently—blocking it doesn't affect these specialized search crawlers.

User-agent verification prevents spoofing. Any client can send a false user-agent string claiming to be **Googlebot** or **Google-Extended**. Reverse DNS lookup confirms legitimacy: legitimate Google crawlers resolve to hostnames ending in `googlebot.com` or `google.com`, and forward DNS lookups on those hostnames return the same IP. This double-verification eliminates spoofed requests.

Automation for user-agent verification:

```bash
IP="66.249.66.1"
HOST=$(host $IP | grep -oP '(?<=pointer ).*(?=\.)')
VERIFY=$(host $HOST | grep -oP '(?<=address ).*')
if [ "$IP" == "$VERIFY" ]; then
  echo "Legitimate Google crawler"
else
  echo "Spoofed user-agent"
fi
```

This script extracts the hostname via reverse DNS, then checks if forward DNS returns the original IP. Mismatches indicate spoofing attempts, which you can block with firewall rules independent of robots.txt compliance.

## IP Ranges and Network Infrastructure

Google documents official crawler IP ranges, but both **Googlebot** and **Google-Extended** share the same IP pools. Google's documentation states: "Google-Extended uses the same IP addresses as Googlebot." This overlap prevents IP-based blocking for crawler differentiation—you must rely on user-agent strings rather than network-layer filters.

Google publishes IP ranges in JSON format via `https://developers.google.com/search/apis/ipranges/googlebot.json`, containing IPv4 and IPv6 prefixes. Download and parse this list to allowlist Google crawlers at firewall level, blocking all other traffic claiming to be Google. However, this allowlist permits both **Googlebot** and **Google-Extended**, requiring application-layer filtering (user-agent inspection) for finer control.

Cloudflare, AWS, and other cloud providers host these IP ranges, as Google crawls from distributed infrastructure rather than centralized data centers. An IP appearing in the official Google ranges might originate from an AWS region in Virginia, GCP zone in Belgium, or third-party hosting provider. This distribution complicates geographic filtering—you cannot simply block specific countries or cloud providers without affecting legitimate crawlers.

Shared IP infrastructure means that firewalls, CDNs, or load balancers cannot distinguish **Googlebot** from **Google-Extended** without inspecting HTTP headers. Tools like **HAProxy**, **Nginx**, or **Cloudflare Workers** examine user-agent strings at the application layer, applying different rate limits, access controls, or logging rules per crawler type despite identical source IPs.

Dynamic IP allocation within Google's ranges creates challenges for static IP allowlists. Google rotates crawler IPs frequently, requiring periodic updates to firewall rules. Automating this with scripts that fetch the official JSON, diff against current rules, and apply changes prevents stale configurations from blocking legitimate crawlers after Google's IP assignments shift.

## Robots.txt Configuration for Selective Access

Blocking **Google-Extended** while allowing **Googlebot** requires explicit user-agent blocks in robots.txt:

```
User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Disallow: /
```

This configuration permits full search indexing while preventing all AI training access. The order doesn't matter—robots.txt parsers match the most specific user-agent applicable to each crawler. **Google-Extended** reads the second block and honors the `Disallow: /` directive.

Selective content licensing needs finer rules:

```
User-agent: Google-Extended
Disallow: /
Allow: /public-archive/
Allow: /*.pdf$
Disallow: /members/
```

This allows **Google-Extended** access only to `/public-archive/` subdirectories and PDF files, while explicitly blocking `/members/` areas and everything else by default. Use this pattern when licensing specific content types or sections to Google for AI training under negotiated agreements.

Path-specific rules control different site sections:

```
User-agent: Googlebot
Crawl-delay: 1
Disallow: /admin/
Disallow: /private/

User-agent: Google-Extended
Disallow: /
Allow: /articles/
Allow: /whitepapers/
```

**Googlebot** can index most content except admin and private sections, with 1-second crawl delay. **Google-Extended** accesses only articles and whitepapers—perhaps these are licensed to Google while other content remains restricted.

Wildcard patterns simplify complex rules:

```
User-agent: Google-Extended
Disallow: /*?*
Disallow: /*.json$
Disallow: /*/api/
Allow: /content/
```

This blocks all URLs with query parameters, JSON files, and any path containing `/api/`, while allowing `/content/` subdirectory. Wildcards reduce robots.txt verbosity when you need to block patterns rather than enumerate every specific path.

Testing robots.txt before deployment prevents accidental overblocking. Google Search Console includes a robots.txt tester under Index > robots.txt, where you can specify user-agent and test URL to see if rules permit or block access. Test several representative URLs for both **Googlebot** and **Google-Extended** to verify intended behavior.

## Crawl Behavior and Request Patterns

**Googlebot** prioritizes fresh content and site updates, increasing crawl frequency for sites that publish regularly. It follows links to discover new pages, respects sitemaps submitted via Search Console, and adjusts rate based on server response times—slowing down if requests cause errors or timeouts. Typical **Googlebot** behavior generates 10K-100K requests daily for medium-sized sites, varying with content volume and update frequency.

**Google-Extended** exhibits different patterns. Training runs occur episodically rather than continuously—intense crawling for days or weeks followed by dormant periods. When active, request volumes may spike 10x above **Googlebot** baseline as the crawler systematically ingests site content. Publishers report surges preceding new **Gemini** model launches, suggesting training runs correlate with development cycles.

Request distribution differs. **Googlebot** concentrates on HTML pages and follows user-facing navigation structures—menus, internal links, pagination. **Google-Extended** may request static resources like images, PDFs, or downloadable files more aggressively if training on multimodal datasets. Comparing file type distributions in server logs reveals whether a crawler focuses on text content or comprehensive media ingestion.

Crawl depth patterns diverge. Search indexing prioritizes pages within 3-4 clicks from homepage, as deeper pages receive less search authority. AI training doesn't respect this hierarchy—**Google-Extended** might crawl entire archives, including old blog posts, documentation versions, or unlisted pages, if those contain useful training data. Sites with extensive historical content see disproportionate AI crawler interest compared to search crawler activity.

Respect for rate limits varies by context. **Googlebot** dynamically adjusts to server capacity, backing off when error rates increase. **Google-Extended** likely follows similar logic but might tolerate higher error rates during training runs if content acquisition deadlines matter more than crawler politeness. Publishers enforcing strict rate limits via [HAProxy](haproxy-ai-crawler-rate-limiting.html) or CDN rules ensure both crawlers respect boundaries regardless of their internal logic.

## Performance and Bandwidth Impact

**Googlebot** typically generates modest bandwidth consumption relative to site traffic—often 2-5% of total bytes transferred. For a site serving 1 TB monthly to human visitors, **Googlebot** might consume 20-50 GB. This overhead remains acceptable when search referrals justify the cost through visitor acquisition and ad revenue.

**Google-Extended** bandwidth profiles skew higher during active training periods. Publishers blocking images and multimedia via robots.txt for **Google-Extended** while allowing **Googlebot** full access report 60-70% bandwidth reduction for AI crawlers compared to search crawlers. This suggests training runs pull heavier content—perhaps full-resolution images, videos, or large PDFs—unless explicitly restricted.

Compression reduces crawler bandwidth for both types. Enable gzip or Brotli compression for crawler responses, cutting text content transfer by 70-80%. Most crawlers send `Accept-Encoding: gzip` headers, signaling support for compressed responses. Server configurations for Apache, Nginx, and CDN platforms enable compression with minimal CPU overhead, translating directly to bandwidth savings.

Caching strategies affect crawler costs differently. **Googlebot** respects cache headers (Cache-Control, ETag) and revalidates cached content efficiently. **Google-Extended** behavior on caching remains less documented, but training runs likely ignore cache headers, requesting full content regardless of freshness indicators. This means crawler bandwidth reductions from caching primarily benefit **Googlebot**, not necessarily AI training crawlers.

Bandwidth accounting matters for pricing decisions. If you charge AI companies for training data access, measure actual bytes transferred to **Google-Extended** via server logs, not estimated content sizes. Compressed transfer sizes determine bandwidth costs and should determine billing rates. Use log analysis tools like [GoAccess](goaccess-ai-crawler-analysis.html) to generate precise monthly bandwidth reports per crawler type.

## Licensing and Access Control Integration

Publishers licensing content to Google for AI training need technical implementations aligning with contract terms. If an agreement permits **Google-Extended** access to specific content types, translate that into robots.txt rules:

```
# Per licensing agreement dated 2024-01-15
User-agent: Google-Extended
Disallow: /
Allow: /licensed-content/2020/
Allow: /licensed-content/2021/
Allow: /licensed-content/2022/
# License excludes 2023-forward content
Disallow: /licensed-content/2023/
Disallow: /licensed-content/2024/
```

Comments in robots.txt reference agreements, creating audit trails. This documents the technical enforcement of contractual restrictions, useful if disputes arise about scope of licensed access.

Usage-based licensing requires precise tracking. If Google pays per-page or per-GB transferred, server logs must capture **Google-Extended** activity separately from other crawlers. Export logs to databases or analytics platforms with queries calculating monthly totals:

```sql
SELECT COUNT(*) AS pages_accessed,
       SUM(bytes_sent)/1024/1024/1024 AS gb_transferred
FROM access_logs
WHERE user_agent LIKE '%Google-Extended%'
  AND status = 200
  AND timestamp BETWEEN '2024-01-01' AND '2024-01-31';
```

This SQL quantifies pages successfully accessed (200 status) and gigabytes transferred by **Google-Extended** in January 2024, providing invoice backup.

Rate limit contracts cap requests per minute, hour, or day. Enforce these with server-side controls rather than trusting crawler politeness. Nginx example:

```nginx
limit_req_zone $http_user_agent zone=google_extended:10m rate=10r/m;

server {
  location / {
    if ($http_user_agent ~* "Google-Extended") {
      limit_req zone=google_extended burst=20;
    }
  }
}
```

This limits **Google-Extended** to 10 requests per minute with burst allowance of 20 requests. Requests exceeding the limit receive 429 Too Many Requests responses, enforcing contractual rate caps regardless of crawler behavior.

Attribution requirements in licensing deals might require special handling. If contracts mandate that **Gemini** cites your content when used in responses, robots.txt cannot enforce this—it controls crawling, not model output behavior. Monitoring **Gemini** responses for proper attribution requires separate tools querying the model and checking for citations, beyond what crawler access controls provide.

## Monitoring and Compliance Verification

Confirming that robots.txt directives actually affect crawler behavior requires ongoing verification. Server log analysis after implementing blocks should show zero or near-zero **Google-Extended** requests for disallowed paths. Continued access despite directives indicates either:

1. Crawler non-compliance (ignoring robots.txt)
2. Cached content still in training pipelines
3. Syntax errors in robots.txt rules
4. User-agent spoofing by non-Google scrapers

Reverse DNS verification on IPs requesting blocked content determines whether requests genuinely come from Google or scrapers impersonating **Google-Extended**. Legitimate Google IPs resolve to Google-owned hostnames; others reveal their true origin.

Google Search Console's robots.txt testing tool provides Google's official interpretation of your rules. Test blocked and allowed URLs for **Google-Extended** user-agent, confirming that Google's parser matches your intent. Discrepancies between Search Console tests and server log behavior suggest caching delays—Google may take 24-48 hours to refresh robots.txt and adjust crawler behavior.

Automated monitoring scripts alert on compliance violations:

```python
import re
from collections import Counter

# Parse server logs
with open('/var/log/nginx/access.log') as f:
    lines = f.readlines()

# Extract Google-Extended requests to blocked paths
violations = [line for line in lines
              if 'Google-Extended' in line
              and re.search(r'GET /private/', line)]

if len(violations) > 100:
    send_alert(f"{len(violations)} robots.txt violations detected")
```

This Python snippet flags when **Google-Extended** requests exceed threshold for paths explicitly blocked in robots.txt, triggering alerts for investigation.

Cross-reference crawler access with licensing periods. If your Google AI training license expires June 30 and logs show **Google-Extended** continuing to access licensed paths in July, you have evidence of contract breach. Maintain timestamped robots.txt versions and log archives covering entire contract periods for dispute resolution.

## Strategic Considerations for Mixed Access

Most publishers want search visibility while controlling AI training, making selective access the default strategy. Allow **Googlebot** broadly to maximize search rankings and referral traffic. Restrict **Google-Extended** to monetize AI training through licensing agreements or block it entirely to protest compensation terms.

Exceptions exist. Publishers in highly competitive search niches might block both **Googlebot** and **Google-Extended** for specific high-value content, forcing users to visit directly rather than satisfying intent through search results or AI summaries. Paywalled content follows this model—robots.txt blocks crawlers from member areas to preserve subscription value.

Content types also drive differentiation. A legal database might allow **Googlebot** to index case summaries for search traffic while blocking **Google-Extended** from full case text to protect premium content value. A medical publisher could permit AI training on general health information while restricting pharmaceutical research to licensed access only.

Temporal strategies matter too. License historical archives (2000-2020) to Google for AI training while reserving recent content (2021-forward) for separate negotiations at higher rates. Implement this via date-based path structures and robots.txt rules matching those paths.

Geographic considerations apply when your audience concentrates in regions where Google faces regulatory constraints. If most traffic comes from the EU, where GDPR and CDSM Directive strengthen publisher rights, you negotiate from a position of legal advantage. Leverage this by blocking **Google-Extended** globally, forcing Google to meet your terms to access training data from any jurisdiction.

## Frequently Asked Questions

### Do Googlebot and Google-Extended share IP addresses?

Yes, both crawlers use the same IP ranges. Google's official documentation states they share infrastructure. You cannot differentiate them with IP-based firewall rules—user-agent string inspection at the application layer is required.

### If I block Google-Extended, does that affect my search rankings?

No, **Google-Extended** serves AI training purposes only, separate from search indexing. Blocking it doesn't impact how **Googlebot** crawls your site or how Google ranks pages in search results. However, future AI-mediated search features might use **Google-Extended** data, introducing indirect effects.

### Can Google-Extended access content that Googlebot cannot?

Only if you configure robots.txt that way. By default, both respect the same restrictions unless you create explicit user-agent rules. Publishers typically allow broader access to **Googlebot** for search while restricting **Google-Extended** to specific sections or blocking it entirely.

### How quickly does Google honor robots.txt changes for these crawlers?

Google re-fetches robots.txt periodically, typically within 24 hours but sometimes longer. Crawler behavior updates after the next fetch. Expect 1-3 days between deploying robots.txt changes and seeing crawlers fully comply in server logs.

### What happens if I allow Google-Extended but block Googlebot?

**Google-Extended** can train on your content, but search results won't show your pages since **Googlebot** cannot index them. This makes no strategic sense for most publishers—you'd surrender AI training data while forgoing search traffic. Consider this only if you monetize AI licensing at rates that dwarf search referral value.

## Conclusion

**Googlebot** and **Google-Extended** represent Google's acknowledgment that search indexing and AI training constitute distinct use cases deserving separate governance. Publishers gain granular control through robots.txt user-agent rules, allowing strategic decisions about which crawler types access which content. The shared IP infrastructure forces reliance on user-agent strings rather than network filtering, requiring application-layer controls and careful verification. Most publishers adopt mixed strategies—broad **Googlebot** access for search visibility paired with restricted **Google-Extended** access to monetize AI training. This balance preserves referral traffic while creating licensing leverage, though [monitoring compliance](google-search-console-ai-crawler.html) remains critical to ensure technical implementations match strategic intent and contractual terms.

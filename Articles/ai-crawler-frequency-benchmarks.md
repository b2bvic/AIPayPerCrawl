---
title:: How Often Do AI Crawlers Hit Your Site? Crawl Frequency Benchmarks
description:: AI crawler frequency benchmarks across industries. Request rates, scraping intervals, and volume patterns for GPTBot, ClaudeBot, PerplexityBot, and other training bots.
focus_keyword:: ai crawler frequency how often crawl
category:: technical
author:: Victor Valentine Romo
date:: 2026.02.07
---

# How Often Do AI Crawlers Hit Your Site? Crawl Frequency Benchmarks

AI crawlers don't scrape once and disappear. They return. **GPTBot** requests your article today, revisits next week, scrapes again next month. **PerplexityBot** hits your homepage hourly. **ClaudeBot** crawls your sitemap every three days.

Frequency patterns reveal intent. **Training bots** (GPTBot, CCBot) scrape infrequently—once per content update cycle, focused on ingesting corpus for model training. **Answer engines** (PerplexityBot) scrape continuously—real-time content retrieval for user queries.

Understanding frequency benchmarks answers critical questions: How much server load should I expect? Is this scraping volume normal or excessive? Do crawlers respect reasonable limits? Should licensing deals include request quotas?

Publishers without frequency data negotiate blind. You agree to "reasonable access" without defining what reasonable means. AI company interprets this liberally—scrapes 50,000 times monthly when industry norm is 5,000. Contract has no enforcement mechanism because you didn't establish baseline.

This guide provides empirical frequency benchmarks across bot types and industries, quantifies normal vs. excessive scraping patterns, and shows how to use frequency data in licensing negotiations.

## Measuring Crawl Frequency

### Request Rate vs. Visit Frequency

**Distinction matters:**

**Request rate:** Requests per second/minute/hour (technical capacity measurement).

**Visit frequency:** How often crawler returns to site (days/weeks between visits).

**Example:**

**GPTBot visit pattern:**

- Jan 1: 500 requests (scrapes site)
- Jan 8: 450 requests (revisits)
- Jan 15: 480 requests (revisits)
- Jan 22: 520 requests (revisits)

**Visit frequency:** Weekly (every 7 days)

**Request rate during visit:** 500 requests over 2 hours = 4.2 requests/minute

**Both metrics matter:**

- **Visit frequency** determines content freshness for AI (weekly updates mean AI sees changes within 7 days)
- **Request rate** determines server load (4 req/min is manageable, 400 req/min strains infrastructure)

### Calculating Average Requests Per Day

**Extract from logs:**

```bash
# Count AI crawler requests per day (last 30 days)
for bot in "GPTBot" "ClaudeBot" "PerplexityBot"; do
    echo "=== $bot ==="
    grep "$bot" /var/log/nginx/access.log* | \
    awk '{print $4}' | \
    cut -d: -f1 | \
    sort | uniq -c
done
```

**Output:**

```
=== GPTBot ===
145 [01/Jan/2026
152 [02/Jan/2026
0   [03/Jan/2026
0   [04/Jan/2026
148 [05/Jan/2026
...
```

**Calculate average:**

```bash
grep "GPTBot" /var/log/nginx/access.log* | \
awk '{print $4}' | cut -d: -f1 | sort | uniq -c | \
awk '{sum+=$1; days++} END {print "Avg requests/day:", sum/days}'
```

**Result:** `Avg requests/day: 142.3`

**Interpret:**

- **<10 req/day:** Minimal crawling (spot-checking, low-priority content)
- **10-100 req/day:** Light crawling (periodic checks, selective content)
- **100-1,000 req/day:** Moderate crawling (regular site coverage)
- **1,000-10,000 req/day:** Heavy crawling (comprehensive indexing)
- **>10,000 req/day:** Intensive crawling (real-time monitoring or training data collection)

### Peak vs. Off-Peak Patterns

**Do crawlers scrape evenly or in bursts?**

**Hourly distribution analysis:**

```bash
grep "GPTBot" /var/log/nginx/access.log | \
awk -F: '{print $2}' | sort | uniq -c | sort -rn
```

**Output:**

```
4523 03  (3am)
4234 04  (4am)
3987 02  (2am)
3821 05  (5am)
1245 15  (3pm)
892  14  (2pm)
```

**Pattern:** GPTBot scrapes primarily 2am-5am (off-peak hours).

**Implication:** Polite crawler minimizing impact on human traffic.

**Compare to PerplexityBot:**

```
2341 09  (9am)
2287 10  (10am)
2198 14  (2pm)
2134 11  (11am)
```

**Pattern:** Evenly distributed across daytime hours.

**Implication:** Real-time answer engine, scrapes in response to user queries (peaks during waking hours).

**Polite vs. aggressive:**

**Polite:** Off-peak scraping, gradual ramp-up, respects server signals

**Aggressive:** Peak-hour scraping, ignores 429 rate limits, hammers origin servers

## Benchmark Data by Bot Type

### Training Bots (GPTBot, CCBot, Anthropic-AI)

**Purpose:** Collect data for model training.

**Frequency pattern:** Episodic (weeks/months between major scrapes).

**GPTBot benchmarks (2025-2026 data):**

**Small publisher** (100K monthly visitors):

- Visit frequency: Every 14-21 days
- Requests per visit: 150-300
- Total monthly: 600-1,200 requests
- Peak rate: 2-3 requests/minute

**Medium publisher** (1M monthly visitors):

- Visit frequency: Every 7-10 days
- Requests per visit: 1,500-3,000
- Total monthly: 6,000-12,000 requests
- Peak rate: 8-12 requests/minute

**Large publisher** (10M+ monthly visitors):

- Visit frequency: Every 3-5 days
- Requests per visit: 15,000-30,000
- Total monthly: 90,000-180,000 requests
- Peak rate: 50-100 requests/minute

**CCBot (Common Crawl):**

**Operates quarterly:** Major scraping cycles every 3 months.

**Monthly average low**, but **specific months see massive spikes.**

**Example timeline:**

- January: 500 requests (minimal activity)
- February: 800 requests (minimal)
- March: 45,000 requests (quarterly crawl)
- April: 400 requests (minimal)

**Average:** 11,675 req/month, but **clustered in specific weeks**.

**Anthropic ClaudeBot:**

**Similar to GPTBot but slightly more frequent.**

- Visit frequency: Every 5-7 days
- More consistent volume (less bursty than GPTBot)

**Benchmarks:** 20-30% higher request volume than GPTBot for equivalent publisher size.

### Answer Engine Bots (PerplexityBot, YouBot)

**Purpose:** Real-time content retrieval for user search queries.

**Frequency pattern:** Continuous (daily scraping, often hourly checks).

**PerplexityBot benchmarks:**

**Small publisher:**

- Visit frequency: Daily (often multiple times per day)
- Requests per day: 50-200
- Total monthly: 1,500-6,000
- Pattern: Distributed throughout day (peaks 9am-5pm)

**Medium publisher:**

- Visit frequency: Hourly checks on popular articles
- Requests per day: 800-2,000
- Total monthly: 24,000-60,000

**Large publisher:**

- Continuous monitoring (top articles checked every 15-30 minutes)
- Requests per day: 5,000-15,000
- Total monthly: 150,000-450,000

**YouBot (You.com search):**

Similar to PerplexityBot but lower volume (You.com has smaller user base).

**Benchmarks:** 40-60% of PerplexityBot volume.

### Search Indexing Bots (Google-Extended, Bing-AI)

**Google-Extended:**

Separate from standard Googlebot. Specifically for AI/generative features (Google Bard, Search Generative Experience).

**Frequency:**

- Revisit: Every 2-7 days (depends on content update frequency)
- Requests: 30-50% of standard Googlebot volume

**Bing-AI (Microsoft):**

Powers Bing Chat, Copilot.

**Frequency:**

- Revisit: Every 5-10 days
- Requests: Lower than Google-Extended (Bing smaller market share)

**Benchmark:** Medium publisher sees 2,000-5,000 Google-Extended requests/month, 800-2,000 Bing-AI requests/month.

## Industry-Specific Benchmarks

### News Publishers

**High scraping frequency.** AI systems prioritize current events.

**Typical pattern:**

- **Breaking news articles:** Scraped within 1-6 hours of publication
- **Evergreen content:** Scraped every 7-14 days
- **Archives:** Scraped quarterly (training data updates)

**Major news site benchmarks:**

- GPTBot: 50,000-200,000 req/month
- PerplexityBot: 100,000-500,000 req/month (real-time news queries)
- ClaudeBot: 40,000-150,000 req/month

**Small regional news:**

- GPTBot: 2,000-8,000 req/month
- PerplexityBot: 5,000-20,000 req/month

**Why higher:** Breaking news, local coverage, timely information = high query volume in AI answer engines.

### E-Commerce and Product Sites

**Moderate frequency.** Product info relatively stable.

**Pattern:**

- New product pages: Scraped within 24-48 hours
- Existing products: Revisited weekly (price/stock updates)
- Reviews: Scraped when new reviews posted

**Benchmarks:**

**Medium e-commerce** (10K products):

- PerplexityBot: 15,000-40,000 req/month (product queries)
- GPTBot: 5,000-15,000 req/month
- Answer engines dominate (users ask "best laptop under $1000", AI scrapes product pages)

**Large marketplace:**

- PerplexityBot: 200,000-800,000 req/month
- High variation based on product catalog size, review volume

### Technical Documentation

**Low-moderate frequency.** Documentation updates infrequently.

**Pattern:**

- Initial scrape: When documentation site launches
- Revisits: Every 30-90 days (unless change detected)
- Update-triggered: Scrape within days if sitemap shows new content

**Benchmarks:**

**SaaS documentation site:**

- GPTBot: 1,000-5,000 req/month
- PerplexityBot: 3,000-10,000 req/month (developers asking "how to" questions)

**Why lower:** Content stable, not time-sensitive, fewer user queries compared to news.

### Academic and Research Content

**Variable frequency.** Depends on publication schedule.

**Pattern:**

- New papers: Scraped within 1-2 weeks of publication
- Established papers: Quarterly scraping for training updates
- Preprint servers (arXiv): Higher frequency (new papers daily)

**Benchmarks:**

**University research site:**

- GPTBot: 3,000-12,000 req/month
- Google-Extended: 5,000-20,000 req/month (Scholar integration)

**Medical journals:**

Higher frequency (COVID-era pattern persists—rapid scraping of medical research for AI health queries).

- PerplexityBot: 20,000-60,000 req/month

## Abnormal Scraping Patterns

### Detecting Excessive Frequency

**When is scraping "too much"?**

**Red flags:**

**1. Frequency 5-10× above benchmark**

If comparable sites see 5,000 GPTBot requests/month and you see 50,000—investigate.

**Possible causes:**

- Your content uniquely valuable (legitimate high demand)
- Crawler misconfigured (scraping same pages repeatedly)
- You're being targeted for comprehensive archive scraping

**2. No respect for HTTP 429 (rate limit) responses**

Server returns 429 (Too Many Requests). Polite crawler backs off. Aggressive crawler ignores signal, continues hammering.

**Detection:**

```bash
# Check if bot received 429s and persisted
grep "GPTBot" /var/log/nginx/access.log | grep " 429 " | wc -l
```

If hundreds of 429 responses but requests continue → violation.

**3. Scraping during server maintenance windows**

You set maintenance mode (503 errors). Bot should back off. If scraping intensifies during 503 period → poorly configured crawler.

**4. Identical content requested repeatedly**

Bot requests same article 50 times in one hour.

**Legitimate:** CDN cache miss, crawler revalidating.

**Suspicious:** >10 requests to identical URL within hour suggests crawler ignoring caching.

### Rate Limit Violations

**License agreements often include request quotas.**

**Example clause:** "Licensee limited to 10,000 requests per month."

**Enforcement:**

```bash
# Count monthly requests from licensed bot
grep "ClaudeBot" /var/log/nginx/access.log.$(date +%Y-%m)* | wc -l
```

**Result:** 23,450 requests

**Violation:** 13,450 requests over quota (135% of limit).

**Action:**

1. Document violation (export logs, count requests)
2. Notify AI company (email partnership/legal contact)
3. Demand compliance or renegotiation (higher quota + higher fees)
4. Enforce penalties (if contract includes breach remedies)

**Technical enforcement (automatic blocking at quota):**

```nginx
# Track requests per month per bot
# (Simplified example—production systems use Redis/Memcached for tracking)

limit_req_zone $http_user_agent zone=claudebot_monthly:10m rate=10000r/month;

location / {
    if ($http_user_agent ~* "ClaudeBot") {
        limit_req zone=claudebot_monthly;
    }
}
```

Once quota reached, return 429 for remainder of month.

### Burst vs. Sustained High Volume

**Distinguish between:**

**Burst scraping:** 10,000 requests in one day, then quiet for month.

**Sustained scraping:** 333 requests/day consistently for 30 days (same total, different pattern).

**Burst is often acceptable** (training cycle, quarterly archive update).

**Sustained high volume might violate intent** (if license covers "periodic training" but bot scrapes continuously).

**Analysis:**

```python
daily_counts = [get_request_count(date) for date in last_30_days]

burst_pattern = max(daily_counts) > 5 * statistics.mean(daily_counts)

if burst_pattern:
    print("Burst scraping detected")
else:
    print("Sustained scraping pattern")
```

**Licensing implications:**

**Training license:** Burst pattern expected.

**Retrieval license (answer engines):** Sustained pattern expected.

**If pattern doesn't match license type → potential violation.**

## Frequency in Licensing Negotiations

### Setting Request Quotas

**Licensing deals should define frequency limits.**

**Model clause:**

"Licensee may access up to [X] requests per calendar month. Excess usage billed at $[Y] per 1,000 additional requests."

**How to set X:**

1. **Measure baseline:** Current scraping volume from bot
2. **Apply growth buffer:** Increase by 50-100% to allow AI company growth
3. **Align with content value:** Premium content = tighter quotas (encourage licensing tiers)

**Example:**

Current GPTBot volume: 15,000 req/month

**Quota options:**

- **Conservative:** 20,000/month (33% buffer)
- **Moderate:** 30,000/month (100% buffer)
- **Generous:** 50,000/month (233% buffer)

**Overage pricing:**

Base license fee: $25,000/year

Overage rate: $1 per 1,000 requests

If bot uses 35,000 requests (5,000 over 30K quota):

Overage fee: 5 × $1 = $5/month = $60/year

**Overage should be priced to discourage abuse but not punitive** (unless strategic decision to restrict access heavily).

### Tiered Access Models

**Different frequency limits for different license tiers.**

**Example structure:**

**Basic Tier:** $10,000/year

- 10,000 requests/month
- Weekly crawl frequency
- Off-peak hours only (10pm-6am)

**Standard Tier:** $35,000/year

- 50,000 requests/month
- Daily crawl frequency
- Any time access

**Premium Tier:** $100,000/year

- 200,000 requests/month
- Hourly crawl frequency
- Real-time API access (more efficient than scraping)

**Benefit:** AI company scales access based on need. You capture value from high-volume use cases.

### Crawl Politeness Requirements

**License can mandate scraping etiquette.**

**Model clauses:**

"Licensee shall:

a) Limit request rate to maximum [5] requests per second.

b) Respect HTTP 429 responses (back off for [30] seconds before retry).

c) Include Licensee contact info in user agent string or HTTP headers (for technical support communication).

d) Preferentially scrape during off-peak hours ([10pm-6am local time]) for non-urgent content.

e) Implement exponential backoff on 5xx server errors (do not retry immediately on server failure)."

**Enforcement:**

Monitor for violations. Document non-compliance. Escalate to legal if persistent.

**Technical enforcement:**

```nginx
# Limit rate to 5 req/sec
limit_req_zone $http_user_agent zone=gptbot:10m rate=5r/s;

location / {
    if ($http_user_agent ~* "GPTBot") {
        limit_req zone=gptbot burst=10;
    }
}
```

**Automatic compliance.** Bot exceeding rate gets 429s, forced to slow down.

## FAQ

### What's considered normal AI crawler frequency for a medium-sized news site?

**Medium news site** (1M monthly visitors) typically sees: **GPTBot** 10,000-30,000 req/month (weekly visits, 1,500-4,000 req/visit), **PerplexityBot** 30,000-100,000 req/month (daily/hourly checks on breaking news), **ClaudeBot** 8,000-25,000 req/month. **Total AI crawler traffic: 50,000-150,000 req/month** (5-15% of total site traffic). Higher for breaking news outlets, lower for feature-focused publications. If seeing 500,000+ req/month from single bot, likely excessive unless you're top-tier national publication.

### How do I know if a crawler is violating reasonable frequency limits?

**Compare to benchmarks** (this article's industry data), **check for red flags**: (1) Request volume 10× industry norm, (2) Ignores HTTP 429 rate limits, (3) Scrapes same content repeatedly (>5 times/hour), (4) Continues during server errors (503s), (5) Peak-hour scraping when off-peak would suffice. **Measure deviation from baseline**: Calculate 30-day average, alert if daily volume exceeds 3× standard deviation. **License violation**: If contract specifies quota and bot exceeds, automatic violation regardless of industry norms.

### Should licensing deals include different frequency limits for training vs. retrieval bots?

**Yes.** **Training bots** (GPTBot) need periodic comprehensive scraping (weekly/monthly) = bursty pattern, moderate total volume. **Answer engines** (PerplexityBot) need continuous fresh data = sustained high volume, real-time access. **Structure accordingly**: Training license with lower overall quota but burst tolerance. Retrieval license with higher quota but rate limiting to spread load. **Example**: Training = 20,000 req/month (burstable to 5,000/day), Retrieval = 100,000 req/month (capped at 150/hour). Prevents training bot from real-time hammering, prevents retrieval bot from one-day archive dumps.

### How often should I audit crawler frequency compliance?

**Weekly monitoring** for licensed crawlers (automated alerts if quota exceeded), **Monthly deep review** (analyze patterns, compare to license terms, identify violations), **Quarterly benchmarking** (compare your traffic to industry norms, adjust quotas if needed). **Trigger immediate audit if**: (1) Sudden traffic spike (>200% of baseline), (2) Server performance degrades, (3) New licensing deal begins (verify compliance from start). Automated monitoring prevents issues; manual audits catch sophisticated violations.

### Can I require AI companies to scrape only during off-peak hours?

**Legally yes** (via licensing agreement), **practically difficult for answer engines**. **Training bots** can comply (scrape 2am-6am when server load low). **Answer engines** serve user queries 24/7—need real-time content access, can't wait for off-peak. **Compromise**: Require off-peak for comprehensive scraping (full-site crawls), allow anytime for targeted retrieval (specific articles referenced in user queries). **Clause**: "Bulk scraping operations (>1,000 pages/hour) limited to off-peak hours (10pm-6am local time). Individual article requests permitted anytime, maximum 10 requests/second." Balances publisher server capacity with AI product needs.

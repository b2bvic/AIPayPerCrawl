title:: How to Block ClaudeBot With robots.txt: Anthropic Crawler Disallow Guide
description:: Step-by-step guide to blocking Anthropic's ClaudeBot with robots.txt. Covers ClaudeBot and ClaudeBot-User, selective path blocking, and Pay-Per-Crawl transition.
focus_keyword:: block claudebot robots.txt
category:: implementation
author:: Victor Valentine Romo
date:: 2026.02.07

# How to Block ClaudeBot With robots.txt: Anthropic Crawler Disallow Guide

**ClaudeBot** has the best compliance record of any major AI crawler. When you tell it to stop, it stops. Within 12-24 hours. Consistently. This makes blocking [ClaudeBot](/articles/claudebot-crawler-profile.html) straightforward from a technical standpoint — but less straightforward from a strategic standpoint, because **Anthropic** is also the most cooperative payer in the AI licensing ecosystem.

Blocking the crawler most willing to pay you requires clear strategic reasoning. This guide covers the technical configuration and the strategic framework so you can deploy the right block for your situation.

---

## Quick Block: Total ClaudeBot Denial

```
User-agent: ClaudeBot
Disallow: /

User-agent: ClaudeBot-User
Disallow: /
```

Two agents:

1. **ClaudeBot** — Background crawling for training data and knowledge indexing
2. **ClaudeBot-User** — Real-time retrieval when Claude users reference web content

Blocking both stops all **Anthropic** access to your content. This is the appropriate starting point if you haven't yet set up monetization infrastructure.

---

## Anthropic's Two Crawlers

### ClaudeBot

**User-agent:** `ClaudeBot/1.0 (+https://anthropic.com/claudebot)`

**Function:** Systematic crawling for model training. **ClaudeBot** visits your site periodically, collecting content for **Claude**'s training pipeline. Content enters model weights permanently.

**Compliance:** Near 100%. The most compliant major AI crawler. Changes to robots.txt reflected within 12-24 hours — faster than any competitor.

**IP range:** `160.79.104.0/23` — compact, easily verified.

### ClaudeBot-User

**User-agent:** `ClaudeBot-User/1.0 (+https://anthropic.com/claudebot)`

**Function:** On-demand retrieval when **Claude** users browse the web or reference content. Fetches specific pages to answer real-time queries.

**Compliance:** Same high standard as **ClaudeBot**.

---

## Configuration Options

### Option A: Block All Anthropic Access

No training. No retrieval. Zero Anthropic access.

```
User-agent: ClaudeBot
Disallow: /

User-agent: ClaudeBot-User
Disallow: /
```

**When to use:** Pre-monetization baseline. Block everything, then selectively re-enable once [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) is active.

### Option B: Block Training, Allow Retrieval

Prevent model training while letting **Claude** cite your content in real-time conversations.

```
User-agent: ClaudeBot
Disallow: /

User-agent: ClaudeBot-User
Allow: /
```

**When to use:** You want brand visibility through **Claude** citations but don't want content permanently in training datasets. **ClaudeBot-User** retrieval provides some attribution value.

### Option C: Selective Path Access

Allow **ClaudeBot** to train on public content, block premium sections.

```
User-agent: ClaudeBot
Allow: /blog/
Allow: /articles/
Allow: /guides/
Disallow: /research/
Disallow: /premium/
Disallow: /data/
Disallow: /members/
Crawl-delay: 10

User-agent: ClaudeBot-User
Allow: /
```

**When to use:** Content tiering strategy. Free content enters **Claude**'s training (or generates Pay-Per-Crawl revenue). Premium content stays protected.

**ClaudeBot** respects per-path directives with near-perfect reliability. If it honors any directive well, it's path-specific access controls.

### Option D: Full Access With Rate Limiting

Allow all access but control server impact.

```
User-agent: ClaudeBot
Allow: /
Crawl-delay: 10

User-agent: ClaudeBot-User
Allow: /
```

**When to use:** Pay-Per-Crawl is active. You want **Anthropic** crawling and paying at your published rates. The `Crawl-delay` prevents server overload without blocking revenue-generating requests.

### Option E: Monetization-Optimized

Maximum revenue configuration with [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html).

```
User-agent: ClaudeBot
Allow: /
Crawl-delay: 5

User-agent: ClaudeBot-User
Allow: /
```

**Why this works:** **ClaudeBot** is the most friction-free payer. It detects your pricing, establishes **Stripe** payment within 7-10 days, and pays consistently without disputes. The monetization infrastructure was practically designed for **ClaudeBot**'s behavior.

---

## Verification

### Compliance Timeline

**ClaudeBot** compliance after robots.txt changes:

| Action | Expected Timeline |
|--------|------------------|
| robots.txt deployed | Immediate |
| ClaudeBot detects change | 12-24 hours |
| Crawling stops | Within 24 hours |
| Log verification possible | 24-48 hours |

The 12-24 hour window is faster than [GPTBot](/articles/block-gptbot-robots-txt.html) (24-48 hours) and dramatically faster than [CCBot](/articles/ccbot-common-crawl-profile.html) (up to 30 days).

### Log Monitoring

```bash
# Check for ClaudeBot requests post-block
grep "ClaudeBot" /var/log/nginx/access.log | awk '{print $4}' | sort | tail -20
```

Requests should cease within 24 hours. If they continue, verify:

1. robots.txt is accessible (test: `curl https://yourdomain.com/robots.txt`)
2. The directive appears in the file (no caching issues)
3. Requests originate from legitimate **ClaudeBot** (IP range `160.79.104.0/23`)

### IP Verification

```bash
# Verify ClaudeBot IP authenticity
# Legitimate range: 160.79.104.0/23

# Reverse DNS check
dig -x 160.79.104.10
# Should resolve to Anthropic infrastructure
```

Any "ClaudeBot" request from outside `160.79.104.0/23` is spoofed. Block spoofed requests at the server level.

---

## Server-Level Enforcement

**ClaudeBot**'s reliability makes server-level enforcement less critical than for other crawlers. But defense-in-depth principles apply:

**Nginx:**

```nginx
map $http_user_agent $is_claudebot {
    default 0;
    ~*ClaudeBot 1;
}

# Optional: verify IP authenticity
geo $claudebot_ip_valid {
    default 0;
    160.79.104.0/23 1;
}

# Block ClaudeBot (if desired)
if ($is_claudebot) {
    return 403;
}
```

**Apache:**

```apache
RewriteCond %{HTTP_USER_AGENT} ClaudeBot [NC]
RewriteRule .* - [F,L]
```

For publishers transitioning to Pay-Per-Crawl, replace the block with logging:

```nginx
# Log rather than block (monetization mode)
access_log /var/log/nginx/claudebot.log combined if=$is_claudebot;
```

---

## The Strategic Decision

### Why Blocking ClaudeBot Is Different

Most AI crawler blocking decisions are straightforward: block the crawler, deny free access, pursue monetization later. **ClaudeBot** complicates this because:

1. **Highest compliance** — It actually respects your directives
2. **Most reliable payer** — Establishes payment within 7-10 days of encountering pricing
3. **Quality-focused crawling** — Targets your best content (validating its value)
4. **Lower volume than GPTBot** — Less server impact per dollar of revenue

Blocking **ClaudeBot** is blocking your most cooperative potential revenue source. The strategic question isn't whether to block permanently — it's how quickly you can transition from blocking to monetizing.

### Revenue Potential

**ClaudeBot** typically generates 15-25% of total AI licensing revenue for Pay-Per-Crawl publishers:

| Publisher Size | Estimated Monthly ClaudeBot Revenue |
|---------------|-----------------------------------|
| 100K pageviews | $5-15 |
| 500K pageviews | $25-75 |
| 1M pageviews | $75-200 |
| 5M pageviews | $250-750 |
| 10M+ pageviews | $750-2,500+ |

Combined with [GPTBot](/articles/block-gptbot-robots-txt.html) revenue (30-50% of total), these two crawlers alone drive 45-75% of AI licensing income for most publishers.

### The Recommended Progression

1. **Block now** — Deploy this guide's directives. Establish your access control position.
2. **Activate Pay-Per-Crawl** — Set up [Cloudflare](/articles/cloudflare-pay-per-crawl-setup.html) and [RSL](/articles/rsl-protocol-implementation-guide.html) pricing.
3. **Re-enable ClaudeBot** — Update robots.txt to allow access with monetization active.
4. **Monitor revenue** — Track **ClaudeBot** contribution in your analytics.
5. **Optimize pricing** — **ClaudeBot** is the best signal for pricing sensitivity. If volume drops after a rate increase, you've exceeded the market. If it holds, push higher.

---

## Frequently Asked Questions

### Does blocking ClaudeBot affect Claude's ability to discuss my content?

Blocking **ClaudeBot** prevents future content from entering **Claude**'s training data. Content already in the model persists. Blocking **ClaudeBot-User** prevents real-time retrieval. To block both training and retrieval, include both user-agent directives.

### How does ClaudeBot compare to GPTBot for monetization?

**ClaudeBot** pays more reliably but at lower volume. **GPTBot** generates more total revenue due to higher crawl volume. Both pay marketplace rates without negotiation. For maximum revenue, monetize both. The [GPTBot blocking guide](/articles/block-gptbot-robots-txt.html) covers the complementary configuration.

### Can I contact Anthropic about licensing instead of using Pay-Per-Crawl?

Yes. **Anthropic** accepts direct licensing inquiries from publishers with significant or unique content. Their crawler documentation includes contact information. Direct deals may yield better terms for large publishers than marketplace rates. For most publishers, Pay-Per-Crawl provides adequate monetization without negotiation overhead.

### Is ClaudeBot-User worth allowing even if I block ClaudeBot?

Potentially. **ClaudeBot-User** provides real-time citation of your content in **Claude** conversations. These citations include source attribution and may drive referral traffic. The volume is low (ephemeral, query-driven) and the server impact minimal. Allowing **ClaudeBot-User** while blocking **ClaudeBot** is a reasonable middle ground during the transition to full monetization.

### What happens if I raise my per-crawl rate too high for ClaudeBot?

**ClaudeBot** is the best market signal for pricing. If your rate exceeds what **Anthropic** budgets for your content category, crawl volume decreases. You'll see fewer requests, lower revenue per period. If volume holds after an increase, the market supports your rate. Use **ClaudeBot** as your pricing barometer — it responds the most predictably to rate changes.

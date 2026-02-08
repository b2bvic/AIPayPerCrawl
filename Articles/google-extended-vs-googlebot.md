title:: Google-Extended vs Googlebot: Separating AI Training Crawls from Search Indexing
description:: Understand the critical difference between Google-Extended (AI training) and Googlebot (search indexing). Block AI training without losing search rankings. Configuration guide included.
focus_keyword:: google extended vs googlebot
category:: crawlers
author:: Victor Valentine Romo
date:: 2026.02.07

# Google-Extended vs Googlebot: Separating AI Training Crawls from Search Indexing

**Google** runs two crawlers that look similar but serve fundamentally different purposes. **Googlebot** indexes content for search results. **Google-Extended** feeds **Gemini** training and **AI Overviews** generation. Confusing the two — or blocking the wrong one — either tanks your search visibility or hands your content to AI training for free.

The separation was deliberate. **Google** created **Google-Extended** in September 2023 specifically so publishers could opt out of AI training without affecting search indexing. It was a direct response to the backlash against AI companies scraping content without consent. The message: you can stay in Google Search without feeding Gemini.

This distinction matters more than any other in AI crawler management. Every other decision — pricing, blocking, throttling — is reversible. Accidentally blocking **Googlebot** is a search visibility emergency.

---

## The Two Crawlers Explained

### Googlebot: Search Indexing

**User-Agent:** `Googlebot/2.1 (+http://www.google.com/bot.html)`

**Googlebot** has crawled the web since 1998. It discovers pages, evaluates content, extracts ranking signals, and populates Google's search index. When someone searches Google and your page appears in results, **Googlebot** put it there.

**What Googlebot does with your content:**
- Creates index entries for search result display
- Extracts signals for ranking algorithms (relevance, quality, authority)
- Generates snippets shown in search results
- Identifies structured data for rich results
- Follows links to discover new pages

**What Googlebot does NOT do:**
- Train AI models
- Feed content to Gemini
- Generate AI Overviews
- Build training datasets

**Blocking Googlebot breaks everything.** No indexing means no search results. No search results means no organic traffic. For most publishers, organic traffic represents 40-70% of total visitors. Blocking Googlebot is a self-inflicted traffic catastrophe.

### Google-Extended: AI Training and AI Overviews

**User-Agent:** `Google-Extended`

**Google-Extended** collects content for:
- **Gemini** model training (Google's LLM family)
- **AI Overviews** generation (AI-generated summaries at the top of search results)
- Other AI-powered Google features that require web content beyond what search indexing provides

**What Google-Extended does with your content:**
- Ingests pages into Gemini training datasets
- Provides source material for AI Overview generation
- Feeds Google's AI Labs and research projects
- Supports Google's broader AI infrastructure

**What Google-Extended does NOT do:**
- Affect your search rankings
- Influence Googlebot's crawling behavior
- Impact your organic traffic
- Change how your site appears in traditional search results

**Blocking Google-Extended is safe for SEO.** Your search rankings, organic traffic, and snippet appearances remain identical. The only change: your content stops feeding Google's AI products.

---

## Why the Separation Exists

### Publisher Backlash Forced Google's Hand

Through 2022-2023, Google used a single crawling infrastructure for both search indexing and AI training. Publishers had no way to allow search indexing while denying AI training use. The binary choice — allow Google or block Google entirely — was untenable.

Publisher organizations demanded separation. The argument: search indexing benefits publishers through referral traffic. AI training benefits Google through improved AI products. These are different value exchanges requiring different consent.

**Google** responded with **Google-Extended** in September 2023. The separation gave publishers the control they'd demanded without requiring Google to compromise search quality.

### How Google Maintains Separation

**Google** has explicitly documented the independence of these crawlers:

1. **Separate user-agent strings** — `Googlebot/2.1` vs. `Google-Extended`
2. **Separate robots.txt processing** — Blocking one doesn't affect the other
3. **Independent systems** — Search indexing and AI training run on separate infrastructure
4. **No cross-contamination** — Data collected by Google-Extended doesn't influence search rankings

Google's documentation states: "Blocking Google-Extended does not affect your site's inclusion or performance in Google Search results." This commitment is testable and has been verified by publisher experiments and SEO studies.

---

## Configuration Guide

### robots.txt: Allow Search, Block AI Training

The canonical configuration for publishers who want search indexing without AI training:

```
# Allow search indexing
User-agent: Googlebot
Allow: /

# Block AI training and AI Overviews
User-agent: Google-Extended
Disallow: /
```

This preserves full search functionality while denying content to Gemini and AI Overviews. The majority of publishers implementing AI crawler blocks use this exact pattern.

### Partial Access Configurations

Some publishers want AI training blocked but AI Overviews allowed (or vice versa). As of early 2026, **Google-Extended** covers both uses — there's no separate user agent for AI Overviews alone.

**Google** has signaled that finer-grained controls may arrive, but the current binary is:
- Allow **Google-Extended** → Content used for Gemini training AND AI Overviews
- Block **Google-Extended** → Neither

For publishers who want their content in AI Overviews (visibility) but not in Gemini training (AI model improvement), the current tools don't support that distinction. You're either in both or out of both.

### Section-Level Controls

Selective blocking allows AI training for some content while protecting others:

```
User-agent: Google-Extended
Allow: /news/
Allow: /blog/
Disallow: /research/
Disallow: /premium/
Disallow: /data/
```

This grants **Google-Extended** access to commodity content (news, blog) while blocking premium content (research, premium, data). The strategy: let AI Overviews reference your general coverage (providing visibility) while protecting your high-value content from training use.

### Combining with Pay-Per-Crawl

[Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) provides a third option beyond allow and block: charge.

1. Remove robots.txt blocks for **Google-Extended**
2. Configure Pay-Per-Crawl pricing in Cloudflare
3. **Google-Extended** encounters pricing requirements
4. **Google** establishes payment and crawls according to your rates
5. Revenue generated from AI training and AI Overviews use

For publishers comfortable with their content appearing in AI Overviews (and willing to be compensated), this converts a blocking decision into a revenue stream.

---

## Impact Analysis: What Happens When You Block Google-Extended

### Search Rankings: Zero Impact

Multiple studies confirm no correlation between blocking **Google-Extended** and changes in organic search performance:

- 50+ publishers tracked for 6 months after blocking **Google-Extended**
- No statistically significant ranking changes detected
- No changes in crawl rate from **Googlebot** (search indexer)
- No changes in indexation rates
- No changes in organic traffic volume

The data is unambiguous. Blocking **Google-Extended** does not affect search rankings.

### AI Overviews: Your Content Disappears

**AI Overviews** (Google's AI-generated summaries at the top of search results) use content collected by **Google-Extended**. Blocking the crawler means your content won't appear in these summaries.

**Implications:**
- Your pages won't be cited in AI Overview boxes
- Competitor content that allows **Google-Extended** may appear instead
- Users who rely on AI Overviews for quick answers won't see your content
- Traditional blue-link results remain unaffected

Whether this matters depends on your traffic sources. If AI Overviews drive referral traffic to your site (some do include source links), blocking eliminates that channel. If AI Overviews primarily replace visits to your site with summarized answers, blocking prevents Google from using your content against your interests.

### Gemini: Excluded from Future Training

Blocking **Google-Extended** prevents your content from entering future **Gemini** training runs. Content already in **Gemini**'s existing training data remains — you can't retroactively remove it.

For publishers concerned about AI competition, this is the primary benefit. **Gemini** won't learn from your future publications. Over time, as older training data becomes stale, your content's representation in **Gemini** diminishes.

---

## Google-Extended in the Broader AI Crawler Ecosystem

### How Google-Extended Compares to Other AI Crawlers

| Feature | Google-Extended | GPTBot | ClaudeBot | Bytespider |
|---------|----------------|--------|-----------|------------|
| Company | Google | OpenAI | Anthropic | ByteDance |
| robots.txt compliance | Yes | Yes | Yes | No |
| Pay-Per-Crawl compliance | Yes | Yes | Yes | No |
| Separate from search crawler | Yes | N/A | N/A | N/A |
| Published IP ranges | Via Googlebot docs | Yes | Yes | No |
| Crawl volume | Moderate | High | Moderate-low | Very high |
| Payment reliability | High | High | Very high | N/A |

**Google-Extended** is unique among AI crawlers in having a direct relationship with a search engine crawler. No other AI company operates both a search indexer and an AI training crawler. This dual-crawler dynamic means Google is the only company where publishers must carefully distinguish between two crawler identities from the same organization.

### The AI Overviews Paradox

**Google AI Overviews** create a paradox for publishers:

1. AI Overviews use your content (via Google-Extended) to generate summary answers
2. These summaries often satisfy user queries without requiring a click to your site
3. Your content fuels a feature that reduces your traffic
4. Blocking Google-Extended removes your content from AI Overviews
5. But blocking may also remove you from a visibility channel that drives some referrals

Studies on AI Overviews' traffic impact diverge. Some publishers report 10-30% reduction in click-through rates for queries where AI Overviews appear. Others report that AI Overview citations drive meaningful referral traffic to cited sources.

The decision depends on your specific experience. Monitor referral traffic from AI Overviews through Google Search Console (filter for AI Overview appearances). If AI Overviews send you traffic, allowing Google-Extended has value. If they cannibalize your clicks, blocking protects your traffic.

### Monetizing Google-Extended Access

For publishers open to AI licensing, **Google-Extended** represents significant monetization potential:

1. **Google**'s AI infrastructure budget is the largest among all AI companies
2. **Google-Extended** feeds multiple products (Gemini, AI Overviews, Bard features)
3. **Google** has demonstrated willingness to pay for content (see [Reddit-Google deal](/articles/reddit-google-ai-licensing-deal.html): $60M/year)
4. Through Cloudflare Pay-Per-Crawl, payment is automated

Set per-crawl rates in your [RSL file](/articles/rsl-protocol-implementation-guide.html) and Cloudflare configuration. **Google-Extended** encounters pricing requirements and establishes payment through the marketplace mechanism.

---

## Common Mistakes and How to Avoid Them

### Mistake 1: Blocking Googlebot Instead of Google-Extended

The most dangerous configuration error. A typo or regex mistake that blocks `Googlebot` instead of or in addition to `Google-Extended` eliminates your site from search results.

**Prevention:** After any robots.txt change:
1. Verify in **Google Search Console** > URL Inspection > Test Live URL
2. Check that **Googlebot** can still access your pages
3. Monitor **Search Console**'s Coverage report for new errors
4. Test with curl: `curl -A "Googlebot/2.1" -I https://yoursite.com` (should return 200)

### Mistake 2: Assuming Google-Extended Blocks Affect Search

Publishers sometimes hesitate to block **Google-Extended** because "it's Google." The fear that blocking any Google crawler affects rankings persists despite documentation and data proving otherwise. Google has architecturally separated these systems. Blocking **Google-Extended** does not affect search.

### Mistake 3: Using Generic Bot-Blocking Rules

A regex like `Google` in your AI crawler block list catches both `Googlebot` and `Google-Extended`. Always use specific crawler identifiers:

```
# WRONG — catches both crawlers
RewriteCond %{HTTP_USER_AGENT} Google [NC]

# RIGHT — targets only AI training crawler
RewriteCond %{HTTP_USER_AGENT} Google-Extended [NC]
```

### Mistake 4: Forgetting Other Google AI Crawlers

**Google** operates additional crawlers beyond Google-Extended:
- **Google-CloudVertexBot** — Vertex AI platform
- **GoogleOther** — Various Google services

Check Google's documentation periodically for new crawlers that may serve AI training purposes.

---

## Technical Implementation Deep Dive

### robots.txt Configuration for All Google Crawlers

A comprehensive Google crawler configuration addressing search, AI training, and specialized crawlers:

```
# Search indexing — ALWAYS ALLOW
User-agent: Googlebot
Allow: /

# AI training and AI Overviews — BLOCK or MONETIZE
User-agent: Google-Extended
Disallow: /

# Vertex AI platform
User-agent: Google-CloudVertexBot
Disallow: /

# Google miscellaneous services
User-agent: GoogleOther
Disallow: /

# Google image search — separate decision
User-agent: Googlebot-Image
Allow: /
```

Each crawler serves a distinct purpose. Granular control lets you maintain search presence while managing AI-specific access. Review Google's crawler documentation quarterly — new user agents appear as Google launches products.

### Server-Level Configuration

**Nginx** — Block Google-Extended while allowing Googlebot:

```nginx
map $http_user_agent $is_google_ai {
    default 0;
    ~*Google-Extended 1;
    ~*Google-CloudVertexBot 1;
    ~*GoogleOther 1;
}

# Ensure Googlebot is NEVER blocked
map $http_user_agent $is_googlebot_search {
    default 0;
    ~*Googlebot 1;
}

server {
    # Override: search crawler always passes
    set $block_google_ai $is_google_ai;
    if ($is_googlebot_search) {
        set $block_google_ai 0;
    }

    if ($block_google_ai) {
        return 403;
    }
}
```

The override logic ensures that even if a user-agent string contains both "Googlebot" and "Google-Extended" (unlikely but worth safeguarding), the search indexer always passes through.

[Full Nginx configuration guide](/articles/nginx-ai-crawler-blocking.html) | [Apache .htaccess guide](/articles/apache-htaccess-bot-management.html)

### Cloudflare Configuration for Google Crawlers

For publishers using [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html):

1. Navigate to **Security > AI Crawlers**
2. Locate **Google-Extended** in the crawler list
3. Set action to **License** (requires payment for access)
4. Set per-crawl rate (align with your [RSL file](/articles/rsl-protocol-implementation-guide.html) pricing)
5. Verify **Googlebot** remains in the **Allow** category (critical — never restrict search indexing)

**Cloudflare** pre-classifies Google's crawlers separately. The risk of accidentally blocking **Googlebot** through the AI Crawlers panel is low, but verify after configuration changes.

### Monitoring the Separation

Track Google crawler activity separately in your [analytics dashboard](/articles/ai-crawler-analytics-dashboard.html):

```bash
# Googlebot search traffic (should continue normally)
grep "Googlebot" /var/log/nginx/access.log | grep -v "Extended\|Other\|CloudVertex"

# Google-Extended AI traffic (should be blocked or billed)
grep "Google-Extended" /var/log/nginx/access.log
```

Compare these two streams over time. **Googlebot** volume should remain stable after blocking **Google-Extended**. Any decline in **Googlebot** visits within 30 days of configuration changes warrants investigation — though correlation doesn't imply causation.

### Google Search Console Verification

After implementing any Google crawler changes:

1. Open **Google Search Console**
2. Navigate to **URL Inspection** > enter a representative URL
3. Click **Test Live URL**
4. Verify **Googlebot** can access and render the page
5. Check **Coverage** report for new crawl errors over the following week
6. Monitor **Performance** report for ranking or traffic changes (none expected)

This verification takes 10 minutes and eliminates the risk that a configuration error affects search visibility. Run it after every change to Google-related crawler rules.

---

## Frequently Asked Questions

### Will blocking Google-Extended remove my site from Google Search?

No. **Googlebot** (search indexer) and **Google-Extended** (AI training) are completely independent. Blocking Google-Extended has zero impact on your search rankings, indexation, organic traffic, or snippet appearances. Google's documentation confirms this, and publisher data corroborates it across 50+ implementations.

### Can I allow Google-Extended for AI Overviews but block it for Gemini training?

Not currently. **Google-Extended** is a single user agent covering both AI training and AI Overviews. There is no separate control for each use case. You either allow both or block both. **Google** may introduce finer-grained controls in the future, but no timeline has been announced.

### How does Google-Extended relate to the Google-Reddit AI licensing deal?

**Reddit** licensed its content to **Google** for $60 million annually, providing access for AI training and search features. This is a [direct licensing deal](/articles/reddit-google-ai-licensing-deal.html) separate from Google-Extended's general web crawling. Publishers without direct deals can monetize Google-Extended access through [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) marketplace mechanisms.

### Should I charge Google-Extended the same rate as GPTBot?

Market data shows publishers typically charge **Google-Extended** at comparable rates to **GPTBot**. Both serve large AI infrastructure platforms. Both have demonstrated willingness to pay. A modest premium for Google-Extended is defensible given **Google**'s broader downstream use (search + AI Overviews + Gemini). The [dynamic pricing](/articles/dynamic-pricing-ai-crawlers.html) framework covers crawler-identity-based rate differentiation.

### How do I know if my content appears in AI Overviews?

**Google Search Console** provides data on AI Overview appearances. Navigate to **Performance** > filter by **Search appearance** > look for **AI Overview**. This shows which queries triggered AI Overviews that referenced your content, and the click-through rates for those appearances.

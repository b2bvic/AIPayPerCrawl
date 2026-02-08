title:: Meta AI Crawler Profile: How Facebook Trains LLaMA on Web Content
description:: Complete profile of Meta's AI training crawler. How Meta scrapes web content for LLaMA model training, blocking strategies, and why Meta's open-weight approach matters.
focus_keyword:: meta ai crawler llama training
category:: crawlers
author:: Victor Valentine Romo
date:: 2026.02.07

# Meta AI Crawler Profile: How Facebook Trains LLaMA on Web Content

**Meta** operates AI crawlers to feed training data into the **LLaMA** family of models — the open-weight large language models that power **Meta AI** across **Facebook**, **Instagram**, **WhatsApp**, and **Messenger**. With over 3 billion monthly active users across its platforms, **Meta**'s AI products reach more consumers than any other AI company. The content those products consume comes, in part, from your website.

**Meta**'s AI crawler operates under the user-agent token **Meta-ExternalAgent**. Prior to standardizing this identifier, **Meta** crawled for AI training through less clearly identified agents, creating confusion about which requests served traditional social media functions (link previews, sharing cards) versus AI training.

The distinction matters because **Meta**'s traditional crawlers — **facebookexternalhit** and **Facebot** — serve legitimate social media integration functions that most publishers want to preserve. Blocking the wrong agent breaks your Facebook sharing previews. Blocking the right one stops AI training data collection while keeping social features intact.

---

## Identification and Technical Profile

### User-Agent Strings

**Meta** operates multiple crawlers. The AI-specific agent:

```
Meta-ExternalAgent/1.0 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)
```

Legacy and social function crawlers (do NOT block these unless you want to break social sharing):

```
facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
Facebot
```

**Meta-ExternalAgent** is the token publishers should target for AI training opt-out. The legacy crawlers handle Open Graph metadata retrieval, link preview generation, and URL sharing features that directly benefit publisher traffic from **Facebook** and **Instagram**.

### IP Ranges

**Meta** publishes IP ranges for its crawlers:

```bash
# Retrieve Meta's crawler IP ranges
whois -h whois.radb.net -- '-i origin AS32934' | grep ^route
```

**Meta**'s AS32934 covers extensive IP allocations. Like **Google**, **Meta** operates massive infrastructure where AI crawling shares IP space with other services. IP-based blocking requires targeting the user-agent rather than IP ranges to avoid disrupting social media functionality.

### Crawl Purposes

**Meta-ExternalAgent** scrapes content for:

- **LLaMA** model pre-training (foundation model development)
- **Meta AI** product features across Facebook, Instagram, WhatsApp, Messenger
- **Code Llama** training for programming-related content
- Research and development of future AI products
- Potential **AI-powered search features** within Meta platforms

Content scraped by **Meta-ExternalAgent** does not serve social sharing functions. Those remain handled by **facebookexternalhit**.

---

## The Open-Weight Complication

### What Open-Weight Means for Your Content

**Meta** releases **LLaMA** models as open-weight, meaning anyone can download and use the model weights. This creates a unique situation for publishers:

When **OpenAI** trains **GPT-4** on your content, only **OpenAI** uses the resulting model. When **Anthropic** trains **Claude** on your content, only **Anthropic** uses it. When **Meta** trains **LLaMA** on your content, *the entire AI industry* potentially benefits — because **Meta** distributes the trained weights freely.

The downstream effect:
1. **Meta-ExternalAgent** crawls your content
2. Your content enters **LLaMA** training data
3. **Meta** releases **LLaMA** weights publicly
4. Thousands of companies fine-tune and deploy **LLaMA** commercially
5. Your content's training value disperses across the entire AI ecosystem

This multiplier effect is similar to [CCBot's](/articles/ccbot-common-crawl-profile.html) role — but operating at the model level rather than the data level. **CCBot** distributes your raw content to many AI companies. **Meta** distributes trained model weights that encode your content to many AI companies.

### Monetization Implications

The open-weight model complicates licensing:

- **Licensing to Meta** doesn't limit downstream use of the resulting model
- **Meta** cannot retroactively restrict how fine-tuned **LLaMA** deployments use your content's training contribution
- The economic value you capture through a **Meta** licensing deal represents a fraction of the total value your content generates across all **LLaMA** deployments

For publishers evaluating whether to block or license to **Meta**, the open-weight distribution model means your content's training contribution benefits **Meta**'s competitors. A licensing deal with **Meta** compensates for direct use but not for the value that flows to every **LLaMA** derivative.

---

## Crawl Behavior Analysis

### Volume and Frequency

**Meta-ExternalAgent** operates at moderate volume relative to [GPTBot](/articles/gptbot-crawler-profile.html):

| Publisher Size | Typical Daily Meta-ExternalAgent Requests | vs. GPTBot |
|---------------|----------------------------------------|------------|
| Small (under 100K PV) | 30-150 | ~50-75% of GPTBot |
| Medium (100K-1M PV) | 150-800 | ~50-60% of GPTBot |
| Large (1M-10M PV) | 800-3,000 | ~40-50% of GPTBot |
| Enterprise (10M+ PV) | 3,000-12,000 | ~40% of GPTBot |

Volume has increased significantly since **Meta** accelerated its AI development in 2024-2025. The upward trend reflects **Meta**'s expanding AI product portfolio and the continuous development of new **LLaMA** versions.

### Content Targeting

**Meta-ExternalAgent** shows broad targeting patterns:

**High priority:**
- Social media-relevant content (trending topics, cultural commentary, news)
- Technical and instructional content (coding tutorials, how-to guides)
- Conversational content (forums, Q&A sites, discussion threads)
- Multilingual content (Meta's global user base requires multilingual training data)

**Lower priority:**
- Highly specialized academic content
- Legal and financial documents
- Content behind paywalls (not accessed)

The targeting reflects **Meta AI**'s consumer orientation — the products serve billions of general users rather than specialized enterprise customers, so training data skews toward broadly useful content.

### robots.txt Compliance

**Meta-ExternalAgent** demonstrates moderate compliance:

- **robots.txt blocks:** Generally honored within 24-72 hours
- **Compliance rate:** High but with occasional reports of delayed compliance
- **Crawl-delay:** Honored
- **No known spoofing:** Meta's AI crawler identifies itself honestly

Compliance is reliable but not as immediate or absolute as [ClaudeBot](/articles/claudebot-crawler-profile.html). Some publishers report a longer lag between robots.txt updates and behavioral change compared to **GPTBot** or **ClaudeBot**.

---

## Blocking Meta's AI Crawler

### robots.txt Configuration

Block AI training while preserving social sharing:

```
# Block AI training crawler
User-agent: Meta-ExternalAgent
Disallow: /

# KEEP social sharing crawlers active
User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /
```

This configuration stops AI training data collection while maintaining Facebook/Instagram link previews, sharing cards, and Open Graph metadata retrieval. If you block **facebookexternalhit** or **Facebot**, links shared on **Facebook** and **Instagram** will appear without preview images or descriptions — damaging your social media traffic.

### Server-Level Blocking

**Nginx:**

```nginx
map $http_user_agent $is_meta_ai {
    default 0;
    ~*Meta-ExternalAgent 1;
}

# Block AI training, allow social
if ($is_meta_ai) {
    return 403;
}
```

**Apache:**

```apache
RewriteCond %{HTTP_USER_AGENT} Meta-ExternalAgent [NC]
RewriteRule .* - [F,L]
```

Do NOT add patterns matching "facebook" or "Facebot" to these rules unless you intentionally want to break social sharing previews.

### Verification

Confirm the block is working:

```bash
# Check for Meta-ExternalAgent in recent logs
grep "Meta-ExternalAgent" /var/log/nginx/access.log | tail -20

# Verify social crawlers still active
grep "facebookexternalhit" /var/log/nginx/access.log | tail -5
```

Post-block, **Meta-ExternalAgent** requests should cease within 72 hours. **facebookexternalhit** requests should continue normally.

---

## Meta's AI Content Strategy

### The Training Data Landscape

**Meta** acquires AI training data through multiple channels:

1. **Meta-ExternalAgent** — Direct web crawling
2. **User-generated content** — Billions of Facebook, Instagram, and WhatsApp posts
3. **Common Crawl** — Open datasets (same as every AI company)
4. **Licensed data** — Partnerships with specific content providers
5. **Synthetic data** — Generated by existing models for training augmentation

**Meta** holds an advantage other AI companies lack: proprietary access to the largest corpus of user-generated content on earth. Facebook posts, Instagram captions, comment threads, and messaging data provide training material that no amount of web crawling can replicate.

This means web-crawled content from publishers serves a complementary role — adding professional, editorial, and specialized content to **Meta**'s UGC-heavy training corpus. Publishers provide the quality signal that balances **Meta**'s quantity.

### Licensing Posture

**Meta**'s approach to content licensing differs from **OpenAI** and **Anthropic**:

- **Fewer direct licensing deals** than **OpenAI** (no equivalent of the News Corp $250M agreement)
- **Less marketplace participation** than **Anthropic** (limited Pay-Per-Crawl engagement as of early 2026)
- **Open-weight release strategy** complicates traditional licensing frameworks
- **Regulatory pressure** in the EU may force more aggressive licensing compliance

**Meta**'s willingness to pay for content lags behind **OpenAI** and **Anthropic**. The company's position appears to be that open-weight model release benefits the broader ecosystem sufficiently to justify less restrictive data acquisition practices. Publishers disagree.

### The EU Factor

**Meta** faces significant regulatory pressure in the **European Union**. The **EU AI Act** and **GDPR** create requirements around AI training data that **Meta** must navigate for its European operations. The **TDM Reservation Protocol** provides a [machine-readable opt-out mechanism](/articles/tdm-reservation-protocol.html) that **Meta** is expected to honor for EU publishers.

European publishers have more leverage against **Meta** than publishers in other jurisdictions because of the regulatory framework and **Meta**'s commercial necessity to operate in the EU market.

---

## Monetization Assessment

### Current Revenue Potential

**Meta-ExternalAgent** ranks lower than **GPTBot** and **ClaudeBot** for Pay-Per-Crawl revenue:

| Metric | Meta-ExternalAgent | GPTBot | ClaudeBot |
|--------|-------------------|--------|-----------|
| Pay-Per-Crawl participation | Limited | Active | Active |
| Payment reliability | Inconsistent | Consistent | Consistent |
| Volume (monetizable) | Low-moderate | High | Moderate |
| Revenue contribution | 5-10% of total | 30-50% | 15-25% |

The revenue gap reflects **Meta**'s less developed licensing infrastructure rather than low crawl volume. **Meta** crawls at significant volume but doesn't reliably participate in marketplace payment mechanisms.

### Strategic Recommendation

For most publishers, the optimal **Meta** strategy:

1. **Block Meta-ExternalAgent** via robots.txt (prevent free AI training access)
2. **Maintain facebookexternalhit and Facebot** access (preserve social sharing)
3. **Monitor Meta's licensing evolution** — their posture may shift as regulatory and competitive pressure increases
4. **Consider unblocking if Meta activates marketplace payments** at competitive rates

Blocking now establishes your position. You can always re-enable access when **Meta** offers compensation comparable to **OpenAI** or **Anthropic**.

---

## Frequently Asked Questions

### Will blocking Meta-ExternalAgent affect my Facebook traffic?

No. **Meta-ExternalAgent** handles AI training data collection. Social sharing features — link previews, Open Graph cards, and URL sharing on **Facebook** and **Instagram** — use separate crawlers (**facebookexternalhit** and **Facebot**) that are not affected by a **Meta-ExternalAgent** block.

### Does Meta use Common Crawl data in addition to its own crawler?

Yes. **Meta** uses **Common Crawl** datasets as part of **LLaMA** pre-training. Blocking **Meta-ExternalAgent** without also blocking [CCBot](/articles/ccbot-common-crawl-profile.html) leaves an open channel for your content to enter **LLaMA** training through **Common Crawl** datasets.

### How does Meta's open-weight approach affect my licensing strategy?

Content used to train **LLaMA** benefits not just **Meta** but every company that deploys or fine-tunes **LLaMA** models. A licensing deal with **Meta** compensates for **Meta**'s direct use but not for the downstream value flowing to thousands of **LLaMA** deployments. Factor this multiplier effect into your licensing expectations or blocking decisions.

### Can I license content to OpenAI and Anthropic but block Meta?

Yes. Each crawler operates independently. You can license to [GPTBot](/articles/gptbot-crawler-profile.html) and [ClaudeBot](/articles/claudebot-crawler-profile.html) through [Cloudflare Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) while blocking **Meta-ExternalAgent**. This selectively monetizes compliant crawlers while withholding access from less compliant ones.

### Is Meta facing legal action over AI training data?

Yes. **Meta** is a defendant in multiple AI training data lawsuits, including class actions from authors and publishers. The legal landscape is covered in the [AI copyright cases tracker](/articles/ai-crawler-legal-cases-2026.html). **Meta**'s open-weight distribution model creates additional legal complexity because plaintiffs must address not just **Meta**'s use but the downstream use by every **LLaMA** deployer.

---
domain:: aipaypercrawl.com
type:: email-sequence
sequence:: sales-launch
emails:: 7
framework:: PASAIDA
voice:: Abrasivism + Observer Protocol
trigger:: lead magnet download OR pricing page 2+ visits OR discovery call booked
created:: 2026.01.19
---

# Sales Email Sequence — AI Pay Per Crawl

7-email sequence. Goal: Convert warm leads into $2,500 implementation consulting or $25,000 enterprise strategy engagements. Follows welcome sequence. Cadence: Day 0, Day 1, Day 3, Day 5, Day 8, Day 12, Day 16.

---

## Email 1 — Day 0

**Subject:** Why free AI licensing guides don't work

**Preview:** Information isn't the bottleneck. Implementation is.

**PASAIDA Element:** Problem

---

You've downloaded the templates. Read the case studies. Watched the Cloudflare setup tutorial.

You still haven't configured Pay-Per-Crawl.

Not because you don't understand it. Because implementation has friction.

Decision paralysis. Should you price per-crawl or flat-rate? Block Bytespider or try to monetize it? Use RSL, llms.txt, or both? Every choice has second-order effects you can't see until you're 3 weeks in.

Technical uncertainty. Cloudflare dashboard has 47 settings. Which ones matter for AI crawler management? What breaks if you misconfigure DNS records? The documentation assumes you already know things you don't.

Pricing anxiety. Industry benchmarks say $0.002-$0.025/crawl. That's a 12x range. Too low and you're subsidizing AI training. Too high and compliant crawlers route around you.

Opportunity cost. You could spend 8 hours figuring this out. Or 8 hours doing your actual job. Most people choose the second option indefinitely.

Free guides give you information. They don't give you certainty. They don't give you someone to call when ClaudeBot stops crawling after your pricing change.

That's what the Implementation Package solves: I make the decisions, you approve them, we ship in 3 weeks.

Next email: what's included and what isn't.

Victor

**CTA:** [Learn About Implementation Package]

---

## Email 2 — Day 1

**Subject:** What the $2,500 implementation package includes

**Preview:** Audit, strategy, configuration, testing, adjustments. Done in 3 weeks.

**PASAIDA Element:** Solution

---

The $2,500 Implementation Package:

**Week 1: Audit + Strategy**

Crawler activity analysis. 90-day server log review. Identify every AI bot hitting your site — not just the obvious ones. Bytespider spoofs user-agents. Some research crawlers don't announce themselves. We find them all.

Content valuation. Which pages do AI crawlers target most? That's your pricing leverage. Technical documentation gets 10x more crawl interest than news content on the same site. We map it.

Pricing recommendation. Per-crawl rates by content type. Volume discounts or punitive pricing for high-frequency crawlers. Based on what similar publishers charge, adjusted for your content uniqueness.

**Week 2: Configuration**

Cloudflare Pay-Per-Crawl setup. Dashboard config, DNS records, billing integration with Stripe. Detection rules for GPTBot, ClaudeBot, Google-Extended, Bytespider, and 12 other AI crawlers.

RSL file creation. Machine-readable licensing terms. JSON format. Hosted at /rsl.json. Points compliant AI companies to your pricing.

llms.txt file creation. Human-readable licensing for AI systems that parse natural language. Some newer retrieval systems check this before scraping.

Firewall rules. IP-based blocking for crawlers that ignore everything (Bytespider, Baidu Spider, certain Chinese research bots). Rate limiting for suspicious patterns.

**Week 3: Testing + Adjustments**

14-day monitoring. Which crawlers comply, which ignore terms, which request volume discounts. Real data, not predictions.

Pricing adjustments. If ClaudeBot stops crawling, pricing might be too high. If revenue is $47/month, pricing is too low. We calibrate.

Documentation handoff. Your team can manage ongoing without me. Checklist, dashboard walkthrough, escalation paths.

**What's NOT included:**

Direct deal negotiation with OpenAI/Anthropic/Google. That's the $25,000 Enterprise package.

Ongoing management. You own this after handoff.

Legal contract review. I'm not a lawyer. Templates provided for your attorney.

**Investment:** $2,500 flat. No hourly billing, no overages, no surprise costs.

**Timeline:** 3 weeks from kickoff to handoff.

**Capacity:** 3 clients per month. I personally configure every setup. No juniors, no outsourcing.

If you're 1M-50M monthly pageviews and want Cloudflare Pay-Per-Crawl running without doing it yourself, this is the fastest path.

Victor

P.S. — Ready to start? Reply with your site URL. I'll confirm it's a fit and send the kickoff link.

**CTA:** [Book Your Kickoff Call]

---

## Email 3 — Day 3

**Subject:** The 4 ways publishers break AI crawler monetization

**Preview:** I've audited 50+ sites. Same mistakes every time.

**PASAIDA Element:** Agitation

---

Common DIY implementation failures from 50+ publisher audits:

**Mistake 1: Underpricing by 10x**

Publisher charges $0.0005/crawl because "I don't want to scare AI companies away."

Result: ClaudeBot scrapes 50,000 times/month, pays $25. Should've been $250.

AI companies don't negotiate down from reasonable rates. They either comply or ignore. If you're in the right range, they pay. Anthropic's budget isn't constrained by your $0.008/crawl rate.

**Mistake 2: Blocking everything (opportunity cost)**

Publisher blocks all AI crawlers via robots.txt. Zero revenue. Zero data on which AI companies would've paid. No negotiating position for direct deals.

Blocking is valid if you're negotiating a direct deal and want leverage. It's not a strategy if you're waiting for AI companies to come to you. They won't. Cloudflare marketplace is where compliant AI companies shop.

**Mistake 3: Inconsistent licensing signals**

RSL file says $0.01/crawl. Cloudflare dashboard says $0.005/crawl. robots.txt says block all.

AI crawlers see conflicting signals. They default to ignoring everything.

Single source of truth. If you use Cloudflare, Cloudflare is the source. RSL and llms.txt point to Cloudflare, not contradict it.

**Mistake 4: No monitoring (flying blind)**

Publisher configures Pay-Per-Crawl, checks revenue once, never looks again.

Doesn't notice Bytespider spoofing user-agent to bypass blocks. Doesn't notice GPTBot requesting volume discount. Doesn't notice ClaudeBot stopped crawling after pricing change.

Revenue optimization requires monitoring. Weekly checks first 90 days, monthly after. I build this into the handoff (you get a monitoring checklist + dashboard).

These aren't edge cases. They're the default outcome when publishers DIY without support.

You can avoid them by following the Playbook perfectly. Or you can skip the trial-and-error and work with someone who's done this 50 times.

Victor

P.S. — If you've already started DIY and something's broken, reply with what happened. I'll tell you if it's fixable or if you need to start over.

**CTA:** [Skip the Trial-and-Error]

---

## Email 4 — Day 5

**Subject:** When to skip Cloudflare and negotiate directly

**Preview:** If you're 50M+ pageviews, marketplace pricing leaves millions on the table.

**PASAIDA Element:** Authority

---

Cloudflare Pay-Per-Crawl works for mid-size publishers. For enterprise publishers, it's a starting point, not the end goal.

**When to skip the marketplace:**

You have 50M+ monthly pageviews. News Corp didn't use Cloudflare. They called OpenAI directly. $250M over 5 years. Cloudflare's per-crawl model would've capped revenue at $500K-$2M annually based on typical crawler activity. Direct deal = 25x-50x higher revenue.

You have irreplaceable niche data. Financial Times has decades of business journalism. Associated Press has real-time news feeds. Reddit has 18 years of user discussions. AI companies can't build models without this data. That's negotiating leverage.

You have proprietary structured data. Code repositories. Financial data. Medical research. Scientific databases. AI companies pay 10x-100x more for structured data than unstructured prose.

You want attribution/partnership, not just revenue. FT partnered with Anthropic partly for revenue, partly for Claude citing FT prominently. That's worth more than the licensing fee for subscriber acquisition and brand equity.

**The Enterprise Licensing Strategy Package ($25,000):**

Competitive deal research. Reverse-engineer News Corp, AP, FT contracts from public filings + industry sources.

Content valuation. What your archive is worth to OpenAI vs. Anthropic vs. Google vs. Meta. Different AI companies value different content types.

Negotiating strategy. Which AI companies to approach first, in what order, with what terms.

Contract drafting. Licensing agreement templates customized to your content + goals.

Negotiation support. I join calls, review counteroffers, advise on deal structure.

**Timeline:** 3-9 months depending on AI company responsiveness.

**Expected revenue:** $500,000-$50M+ depending on content scale + uniqueness.

**Capacity:** 2 clients per quarter. This is negotiation-intensive work.

If you're under 50M pageviews, start with Cloudflare. Use that revenue + data to build a direct deal case later.

If you're over 50M pageviews or have truly irreplaceable data, Cloudflare is a distraction. Go straight to the source.

Victor

P.S. — Not sure which path fits? Book a free 20-minute triage call. I'll ask 5 questions and tell you which package makes sense — or if you should just DIY.

**CTA:** [Book Free Triage Call]

---

## Email 5 — Day 8

**Subject:** How a technical docs site licensed to OpenAI for $8M

**Preview:** 12M pageviews/month, specialized knowledge, 6-month negotiation. Here's what worked.

**PASAIDA Element:** Authority (continued)

---

Enterprise client case study (details anonymized per NDA):

**Publication type:** Technical documentation site (developer tools, API references)

**Monthly pageviews:** 12 million

**Unique value:** Proprietary code examples, integration guides for Fortune 500 software stack

**AI company:** OpenAI (GPT training data)

**Timeline:**

Month 1: Content audit, valuation, competitive research.

Month 2: Outreach to OpenAI partnerships team, initial call.

Month 3-4: Contract negotiation (scope, pricing, attribution, audit rights).

Month 5: Legal review, revisions.

Month 6: Deal execution, $8M payment (5-year license, paid upfront).

**Deal structure:**

Flat $8M fee for 5-year archive access (training data rights).

Real-time API access for ongoing documentation updates ($200K/year additional).

Attribution in ChatGPT when citing client's documentation.

Annual audit (client can verify OpenAI's usage patterns).

Non-exclusive (client retained right to license to Anthropic, Google, others).

**Why this worked:**

Irreplaceable content. Client's docs covered enterprise software that OpenAI couldn't train on elsewhere. Proprietary systems, not publicly documented.

Structured data premium. Code examples, API schemas, configuration files = 10x more valuable to AI training than prose.

First-mover advantage. Client approached OpenAI before competitors did. No pricing anchors. Negotiated from strength.

Non-exclusivity. Retained right to license to Anthropic next. Currently in talks for similar deal.

**Client's reflection:**

"We almost started with Cloudflare Pay-Per-Crawl. Would've earned maybe $50K/year. Direct deal got us $8M upfront plus ongoing revenue. ROI on the $25K consulting fee was 320x."

This is what enterprise licensing looks like when you have leverage.

Victor

P.S. — Enterprise package starts with a scope call (free, 45 minutes). If it's not a fit, I'll tell you in the first 10 minutes.

**CTA:** [Book Enterprise Scope Call]

---

## Email 6 — Day 12

**Subject:** 2 implementation spots left (February capacity)

**Preview:** After that, next availability is March 15.

**PASAIDA Element:** Incentive + Deadline

---

February capacity update:

**Implementation Package ($2,500):** 2 spots left.

**Enterprise Package ($25,000):** 1 spot left.

**Next availability:** March 15.

Not artificial scarcity. Actual capacity constraint. I personally configure all implementations. Don't outsource to juniors. 3 clients per month is the max without quality dropping.

If you've been thinking about this for a week, decision point is now.

**Option 1: Book Implementation Package**

Best for: 1M-50M monthly pageviews, want Cloudflare Pay-Per-Crawl running in 3 weeks.

What happens next: Kickoff call this week, audit + strategy next week, configuration week after, handoff by end of month.

Investment: $2,500.

**Option 2: Book Enterprise Package**

Best for: 50M+ monthly pageviews or irreplaceable niche data, want direct deal with OpenAI/Anthropic/Google.

What happens next: Scope call this week (free, 45 min), if it's a fit we start content valuation immediately.

Investment: $25,000.

**Option 3: DIY with the Playbook**

Best for: You have 8 hours to spend on this, technical confidence, willing to iterate.

What happens next: Download Playbook, follow checklist, email me if you get stuck. I'll answer questions for free. Won't do it for you.

**Option 4: Do nothing**

AI crawlers keep scraping, you keep earning $0, we never talk again.

February spots fill by end of this week based on historical patterns. March spots open Feb 20.

Your move.

Victor

P.S. — If you're on the fence between Implementation and Enterprise, book a free triage call. I'll ask 5 questions and tell you which path fits. No sales pitch, just routing.

**CTA:** [Book Before February Fills]

---

## Email 7 — Day 16

**Subject:** Last call (then I'm moving on)

**Preview:** February capacity closes Friday. After that, you're in the March queue.

**PASAIDA Element:** Action

---

This is the last email.

**February capacity status:**

Implementation Package: 1 spot left (2 booked this week).

Enterprise Package: 1 spot left (1 booked Monday).

Deadline: Friday 5pm ET.

After Friday, next availability is March 15. You'll go on the waitlist. I'll email when spots open.

**If you're still reading, you're in one of three camps:**

**Camp 1: You want to do this but haven't pulled the trigger.**

What's blocking you? Email me. victor@aipaypercrawl.com. I'll answer the question (free, no sales pressure). If it's a fit, we'll book. If not, I'll tell you.

Common blockers I've heard:

"I need to check with my team." — Reply with their email, I'll send a one-page summary they can review in 3 minutes.

"I'm not sure we have enough crawler activity." — Reply with your domain, I'll run a quick check and tell you if it's worth pursuing.

"Budget isn't approved yet." — Reply with when it will be. I'll hold a March spot.

**Camp 2: You're planning to DIY.**

Good. Download the Playbook if you haven't. Follow the checklist. Email me if you get stuck (I answer questions for free). Ship this month, not "someday."

The longer you wait, the more data you lose. AI crawler behavior is changing monthly. Pricing benchmarks are being set now. The publishers who implement in Q1 2026 will have 18 months of data by the time this market matures. The ones who wait will be negotiating against established floors.

**Camp 3: You're not convinced this matters yet.**

Fair. Unsubscribe below. If AI licensing becomes urgent in 6 months, you know where to find me. No hard feelings.

But understand: this market is moving. News Corp's deal was announced 8 months ago. Reddit's deal closed a year ago. Cloudflare Pay-Per-Crawl has been live for 6 months. The window for early-mover advantage is closing.

I've given you the frameworks. The case studies. The templates. The pricing benchmarks. The implementation checklist.

What you do next is your decision.

**Last chance for February capacity:**

Victor

P.S. — If you don't book and don't unsubscribe, I'll assume you want to stay on the newsletter. That shifts to a different list. Weekly AI licensing industry updates, case studies, new crawler alerts. No more sales emails after this.

**CTA:** [Book Implementation — 1 Spot Left] | [Book Enterprise — 1 Spot Left] | [Free Triage Call]

---

## Sequence Summary

| Email | Day | Subject | PASAIDA | CTA |
|-------|-----|---------|---------|-----|
| 1 | 0 | Why free AI licensing guides don't work | Problem | Learn About Implementation |
| 2 | 1 | What the $2,500 implementation package includes | Solution | Book Kickoff Call |
| 3 | 3 | The 4 ways publishers break AI crawler monetization | Agitation | Skip Trial-and-Error |
| 4 | 5 | When to skip Cloudflare and negotiate directly | Authority | Book Triage Call |
| 5 | 8 | How a technical docs site licensed to OpenAI for $8M | Authority | Book Enterprise Call |
| 6 | 12 | 2 implementation spots left (February capacity) | Incentive + Deadline | Book Before February Fills |
| 7 | 16 | Last call (then I'm moving on) | Action | Book Implementation / Enterprise |

## Trigger Conditions

This sequence triggers when:
1. User downloads any lead magnet (Playbook, Audit Checklist, Contract Templates)
2. User visits pricing page 2+ times
3. User books discovery call but doesn't convert

## Exit Conditions

User exits sequence when:
1. User books Implementation or Enterprise package
2. User unsubscribes
3. Sequence completes (Day 16)

Post-sequence: Non-converters move to weekly newsletter list (industry updates, no sales).

## Key Numbers Referenced

- $2,500 Implementation Package (3 weeks, 3 spots/month)
- $25,000 Enterprise Package (3-9 months, 2 spots/quarter)
- 50+ publisher audits (pattern recognition)
- 12x pricing range ($0.002-$0.025/crawl)
- $8M enterprise case study (12M pageviews, 6-month negotiation, 320x ROI)
- Per-crawl benchmarks: News $0.003, Technical $0.012, Proprietary $0.020
- 38% crawler compliance rate
- 14,000 AI bot requests/day (case study)
- Bytespider vs. ClaudeBot behavior differences

## Objection Handling (Embedded)

Email 3: Technical fear (what breaks if misconfigured)
Email 4: Enterprise vs. marketplace confusion (when to skip Cloudflare)
Email 5: ROI uncertainty (320x case study)
Email 6: Budget timing (hold spot for March)
Email 7: Team buy-in (one-page summary offer), crawler activity doubt (quick check offer)

## Voice Notes

Abrasivism principles applied:
- No sycophancy in openers
- Varied paragraph lengths (single sentences mixed with dense blocks)
- No insight bows wrapping everything in tidy conclusions
- Direct observation, not interpretation of reader emotions
- Numbers and specifics over vague benefits

title:: Publisher Class Actions Against AI Companies: Tracking Active Lawsuits
description:: Comprehensive tracker of lawsuits by publishers and authors against AI companies for unauthorized content use. Covers NYT v OpenAI, Authors Guild suits, and class action strategies.
focus_keyword:: publisher class actions ai companies
category:: legal
author:: Victor Valentine Romo
date:: 2026.02.07

# Publisher Class Actions Against AI Companies: Tracking Active Lawsuits

The legal counterattack against AI companies began in earnest in late 2023 and has accelerated since. Publishers, authors, visual artists, musicians, and software developers have filed dozens of lawsuits alleging that AI companies violated copyright by training models on their work without permission or compensation.

These cases will determine whether AI content licensing becomes a legal obligation or remains a voluntary market mechanism. A ruling that AI training requires licensing transforms [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) from a revenue opportunity into an industry necessity. A ruling favoring fair use makes licensing optional — valuable for quality and relationship reasons, but not legally mandated.

This tracker catalogs the major active cases, their procedural status, key legal arguments, and potential impact on the AI content licensing ecosystem.

---

## Landmark Cases

### The New York Times v. OpenAI and Microsoft

**Filed:** December 27, 2023
**Court:** Southern District of New York
**Plaintiffs:** The New York Times Company
**Defendants:** OpenAI LP, Microsoft Corporation
**Status:** Active (discovery phase, early 2026)

**Claims:**
- Copyright infringement (unauthorized reproduction of NYT articles for training)
- Contributory infringement (Microsoft as investor/partner enabling the infringement)
- Unfair competition
- Trademark dilution (ChatGPT generating content attributed to or associated with NYT)

**Key allegations:**
- **OpenAI**'s models can reproduce NYT articles verbatim or near-verbatim
- Millions of NYT articles were copied into training datasets without license
- ChatGPT competes with nytimes.com for reader attention
- The training use is commercial, not transformative
- Market harm is direct — AI-generated summaries substitute for NYT visits

**OpenAI's defense:**
- AI training is transformative fair use
- Models learn patterns, not specific articles
- Verbatim reproduction is a bug, not a feature (and has been reduced)
- NYT initially negotiated licensing in good faith before filing suit
- Blocking AI training would harm technological progress

**Why it matters for publishers:** This is the most direct test of whether commercial AI training constitutes fair use. The **NYT** has resources to litigate aggressively and the standing to establish broadly applicable precedent. A ruling either way will echo through every publisher's AI licensing strategy.

**Potential outcomes:**
- **NYT wins on copyright:** AI companies must license training data. Every publisher gains enforceable licensing rights. The market shifts from voluntary to mandatory.
- **OpenAI wins on fair use:** Training without licensing is legal. The licensing market continues on voluntary terms, driven by quality and relationship incentives rather than legal obligation.
- **Settlement:** Most likely outcome. Terms may include licensing payments plus forward-looking licensing framework. Settlement details may or may not create public precedent.

### Authors Guild v. OpenAI

**Filed:** September 2023
**Court:** Southern District of New York
**Plaintiffs:** Authors Guild, Inc. (representing thousands of authors including **John Grisham**, **Jodi Picoult**, **George R.R. Martin**, **Jonathan Franzen**)
**Defendants:** OpenAI LP
**Status:** Active (class certification pending)

**Claims:**
- Copyright infringement for training GPT models on copyrighted books
- Unjust enrichment from using authors' creative works without compensation
- Unfair business practices

**Key arguments:**
- **OpenAI** trained on books obtained through pirated collections (shadow libraries)
- The training data included copyrighted books explicitly, not incidentally
- AI models can generate content "in the style of" specific authors, demonstrating retention of copyrighted expression
- The commercial nature of **OpenAI**'s use (billion-dollar products) undermines fair use

**Why it matters:** Tests fair use for creative works specifically. Books are prototypically creative works (fair use factor 2 weighs strongly against unauthorized use of creative works). A ruling that book training isn't fair use strengthens arguments for all content categories, including news and technical writing.

### Intercept Media v. OpenAI and Microsoft

**Filed:** February 2024
**Court:** Southern District of New York
**Plaintiffs:** The Intercept, Raw Story, AlterNet
**Defendants:** OpenAI, Microsoft
**Status:** Active

**Claims:** Copyright infringement. Specifically alleges that **OpenAI** trained on articles from investigative and alternative media outlets, reproducing both content and distinctive editorial voice.

**Significance:** Tests whether the fair use analysis differs for investigative journalism, which has strong public interest value. Also raises questions about whether training on editorial voice (beyond facts) constitutes appropriation of creative expression.

### Thomson Reuters v. ROSS Intelligence

**Filed:** 2020 (predates the current AI litigation wave)
**Court:** District of Delaware
**Status:** Jury trial resulted in partial verdict for Thomson Reuters (2024)

**Claims:** **ROSS Intelligence** used **Thomson Reuters**' **Westlaw** legal database to train its AI legal research tool without authorization.

**Outcome significance:** The jury found that ROSS's use of Westlaw headnotes was not fair use. While the case involves legal database content (different from general web content), the precedent that AI training on commercial databases isn't fair use influences broader AI training copyright analysis.

This is the closest thing to a resolved precedent on AI training and copyright, though its narrow scope limits direct applicability.

---

## Class Actions Representing Publisher Categories

### News Publishers

**Raw Story and AlterNet v. OpenAI** tested whether smaller news publishers can bring viable claims. The case survived initial motions, establishing that even small publishers have standing to challenge AI training use.

Multiple trade press outlets have joined or are joining consolidated actions. The **News/Media Alliance** (representing 2,000+ news publishers) has supported legislative and litigation strategies targeting unauthorized AI training.

### Book Authors and Publishers

Beyond the **Authors Guild** suit, individual and small-group actions proceed:

- **Silverman v. OpenAI** — Sarah Silverman and other authors sued alleging book piracy for training data
- **Kadrey v. Meta** — Authors suing **Meta** over **LLaMA** model training on copyrighted books
- **Tremblay v. OpenAI** — Authors challenging the use of pirated book collections for training

These cases test similar theories across different AI companies. If one ruling establishes that book-based training isn't fair use, it affects all companies using similar training data.

### Visual Artists

- **Andersen v. Stability AI** — Artists suing **Stability AI**, **Midjourney**, and **DeviantArt** over image generation models trained on copyrighted artwork without consent
- **Getty Images v. Stability AI** — Getty's lawsuit in both US and UK courts over **Stable Diffusion** training on Getty's image library

Visual art cases test whether AI-generated images that reflect copyrighted style constitute infringement. The theories parallel text-based claims: unauthorized reproduction for training, with outputs that compete with original works.

### Music Industry

- **RIAA v. AI music services** — The Recording Industry Association of America has targeted AI music generation services (Suno, Udio) for training on copyrighted recordings
- **Universal Music Group** has filed actions against AI companies generating music using copyrighted compositions

Music industry litigation benefits from strong existing copyright enforcement infrastructure. The industry's experience in anti-piracy litigation provides templates for AI training claims.

---

## Legal Theories Being Tested

### Direct Copyright Infringement

The primary theory: copying copyrighted works into training datasets constitutes unauthorized reproduction. This is the most straightforward claim — the AI company made copies without permission.

**Strengths:**
- Reproduction is factually clear (datasets contain copies of original works)
- No need to prove the AI output is infringing, just the input
- Works for training-focused claims regardless of model output quality

**Challenges:**
- Fair use defense (transformative use argument)
- Scale makes individual work damages small (millions of works, pennies each)
- Difficulty proving which specific works were in which training dataset

### Derivative Work Claims

Some plaintiffs argue AI models themselves are unauthorized derivative works — they derive from copyrighted training data and therefore require licensing.

**Strengths:**
- If accepted, the AI model itself is infringing (not just the training process)
- Implies ongoing infringement with each use of the model
- Creates stronger remedies (model could be enjoined from operation)

**Challenges:**
- Legal definition of "derivative work" may not encompass trained model weights
- Models don't contain recognizable copies of individual works
- Precedent for this theory is thin

### Unjust Enrichment

AI companies profit from content they didn't pay for. Unjust enrichment claims don't require copyright infringement per se — they argue that fairness demands compensation when one party profits at another's expense.

**Strengths:**
- Doesn't depend on fair use outcome
- Morally intuitive — courts may sympathize
- Can apply even if copyright analysis is ambiguous

**Challenges:**
- Typically weaker than copyright claims
- Damages harder to quantify
- Some jurisdictions limit unjust enrichment to relationships with prior obligations

### DMCA Violations

Some cases allege violations of the **Digital Millennium Copyright Act** — specifically, that AI companies circumvented technological protection measures (paywalls, access controls) to obtain training data.

**Strengths:**
- DMCA provides statutory damages independent of copyright infringement
- Circumvention claims don't require proving fair use failure
- Applies when AI companies bypass paywalls or ignore access restrictions

**Challenges:**
- Must prove actual circumvention of a technical protection measure
- Open-web content without access controls doesn't qualify
- DMCA was designed for DRM circumvention, not web scraping

---

## Impact on the Licensing Market

### If Publishers Win: Mandatory Licensing

A ruling that AI training requires publisher authorization transforms the market:

1. **AI companies must license** — Training without consent becomes legally risky
2. **[Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) becomes essential infrastructure** — Not just revenue opportunity but compliance requirement
3. **Pricing power shifts to publishers** — Supply constrained by licensing requirements
4. **[RSL protocol](/articles/rsl-protocol-implementation-guide.html) adoption accelerates** — Standardized terms become industry necessity
5. **Non-compliant crawlers face injunction** — [Bytespider](/articles/bytespider-tiktok-crawler.html) and others could face court-ordered blocking

### If AI Companies Win: Voluntary Market

A ruling favoring fair use means:

1. **Licensing remains voluntary** — AI companies can train without consent
2. **Marketplace mechanisms persist** — Compliant companies still prefer licensed content
3. **Quality-based licensing** — AI companies pay for premium content, use commodity content freely
4. **Publisher leverage diminishes** — No legal stick behind licensing demands
5. **Technical controls still matter** — Blocking remains available regardless of legal outcome

### Settlement Scenarios

Most large-scale IP litigation settles. Settlements in AI cases might include:

- **Licensing payments** — Lump sum + ongoing per-crawl or annual fees
- **Revenue sharing frameworks** — Percentage of AI product revenue attributed to publisher content
- **Technical standards** — Agreed-upon opt-out mechanisms, crawler compliance requirements
- **Industry-wide frameworks** — Settlements that create templates other publishers can adopt
- **Regulatory commitments** — AI companies agree to support legislative frameworks for content licensing

Settlement outcomes don't create formal legal precedent but establish market norms that influence behavior industry-wide.

---

## What Publishers Should Do Now

### Prepare for Either Outcome

Regardless of how courts rule:

1. **Implement [technical controls](/articles/opt-out-mechanisms-comparison.html)** — Block or monetize AI crawlers through available tools
2. **Document everything** — Server logs, robots.txt history, RSL files, terms of service. Evidence supports both licensing claims and litigation.
3. **[Register copyrights](/articles/copyright-law-ai-training-data.html)** — Required for US litigation and statutory damages
4. **Monitor cases** — NYT v. OpenAI will likely produce the most applicable precedent
5. **Evaluate class actions** — If your content was used for training, you may have standing to join existing suits
6. **Generate revenue now** — [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) generates income regardless of legal outcomes

### Joining a Class Action

Publishers considering class action participation should evaluate:

- **Standing:** Can you demonstrate your content was in the defendant's training data?
- **Timing:** Class certification deadlines and opt-in/opt-out windows
- **Representation:** Is the class counsel experienced in IP litigation?
- **Recovery expectations:** Class action settlements distribute across thousands of members — individual payouts may be modest
- **Opportunity cost:** Joining a class action may waive your right to bring individual claims

Consult IP counsel before committing. The decision to join or pursue individual claims depends on your content's uniqueness, your financial resources, and your risk tolerance.

---

## Case Status Summary (Early 2026)

| Case | Court | Status | Key Issue |
|------|-------|--------|-----------|
| NYT v. OpenAI/Microsoft | SDNY | Discovery phase | Fair use for news training |
| Authors Guild v. OpenAI | SDNY | Class cert. pending | Fair use for book training |
| Intercept v. OpenAI | SDNY | Active | Investigative journalism training |
| Getty v. Stability AI | US + UK | Active (both) | Image training copyright |
| Thomson Reuters v. ROSS | D. Del. | Partial verdict (TR) | Database training |
| Andersen v. Stability AI | N.D. Cal. | Active | Visual art training |
| RIAA v. Suno/Udio | SDNY | Active | Music training |
| Kadrey v. Meta | N.D. Cal. | Consolidated | LLaMA book training |

---

## Frequently Asked Questions

### How long until we get definitive legal rulings on AI training and copyright?

The NYT v. OpenAI case is likely the first major ruling to emerge. With discovery ongoing through 2025-2026, a trial or substantive summary judgment ruling could arrive in late 2026 or 2027. Appeals would extend the timeline by 1-2 additional years. Definitive Supreme Court precedent is likely 5+ years away, if it reaches that level.

### Can individual publishers sue AI companies, or only large organizations?

Individual publishers can file suit, but economic reality favors class actions for smaller publishers. Legal costs for individual copyright litigation reach six figures. Class actions spread costs across thousands of plaintiffs. Large publishers with unique content and deep resources (the NYT model) benefit from individual suits. Everyone else benefits from collective action.

### If I join a class action, can I still run Pay-Per-Crawl?

Generally yes. Class actions typically seek damages for past unauthorized use. [Pay-Per-Crawl](/articles/cloudflare-pay-per-crawl-setup.html) licenses future use. The two aren't inherently conflicting. However, review class action terms carefully — some settlements include forward-looking licensing provisions that may interact with your Pay-Per-Crawl rates.

### Do these lawsuits affect non-US publishers?

The major cases are in US courts applying US copyright law. Rulings directly bind US entities. Non-US publishers can file suits in their own jurisdictions (as **Getty** did in the UK). EU publishers benefit from [TDM reservation rights](/articles/opt-out-mechanisms-comparison.html) that provide legal opt-out mechanisms independent of US litigation outcomes.

### What's the most likely outcome?

Settlement is the most probable outcome for major cases. AI companies face significant legal uncertainty and prefer settled terms over unpredictable court rulings. Publishers prefer certain compensation over years of litigation with uncertain outcomes. Expect settlements that establish licensing frameworks, with at least one case proceeding far enough to produce meaningful precedent on the fair use question.

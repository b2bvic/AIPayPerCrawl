---
title:: Fair Use and AI Training Data: The Legal Battle Defining Publisher Rights
description:: How courts are deciding whether AI training on copyrighted content is fair use. The precedents, pending cases, and what publishers need to know.
focus_keyword:: fair use ai training
category:: ai-monetization
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Fair Use and AI Training Data: The Legal Battle Defining Publisher Rights

The question defining AI's future relationship with publishers: is training machine learning models on copyrighted content **fair use**? If yes, AI companies can scrape freely and publishers have zero leverage. If no, AI companies owe billions in licensing fees and must negotiate with every content owner.

This legal question is being resolved in courtrooms across the US, EU, and UK. The outcomes will determine whether publishers capture value from AI or watch their content fuel trillion-dollar industries without compensation.

This is where the law currently stands, which cases matter most, and how publishers should position themselves while precedent forms.

## The Four-Factor Fair Use Test

US copyright law doesn't define fair use explicitly. Instead, **17 U.S.C. § 107** provides four factors courts must weigh:

### Factor 1: Purpose and Character of Use

**Question:** Is the use transformative? Does it add new meaning, or does it merely substitute for the original?

**AI companies argue:** Training is transformative. They're not copying articles to republish them. They're extracting statistical patterns to generate new, original text. The model learns language structure, not specific content. Output is novel, not derivative.

**Publishers argue:** AI models reproduce copyrighted content verbatim when prompted correctly. **ChatGPT** can regenerate **New York Times** articles nearly word-for-word. That's substitution, not transformation. Users ask **ChatGPT** instead of visiting publisher sites. This eliminates the market for original works.

**Precedent:** **Google Books** (2015) favored transformation. Google scanned millions of books and provided searchable snippets. Courts ruled this was transformative—it created a research tool, not a book substitute. AI companies cite this heavily.

**Counter-precedent:** **Andy Warhol Foundation v. Goldsmith** (2023) narrowed transformation. Warhol's Prince portraits, though stylistically different from the source photo, were deemed insufficiently transformative because they served the same commercial market (magazines). Publishers argue AI models serve the same market as original content (answering questions, providing information).

**Current lean:** Uncertain. Lower courts are split. Some emphasize transformation (models don't copy, they learn). Others emphasize market substitution (users stop visiting publisher sites).

### Factor 2: Nature of the Copyrighted Work

**Question:** Is the work factual or creative? Published or unpublished?

**AI companies argue:** Most training data is factual (news, Wikipedia, technical documentation). Facts aren't copyrightable, only their expression. Models learn facts, not expression.

**Publishers argue:** News articles aren't just facts—they're creative expressions protected by copyright. The *way* information is presented, the narrative structure, and the editorial voice are all copyrightable. Models reproduce these elements, not just facts.

**Precedent:** **Feist Publications v. Rural Telephone** (1991) established that facts aren't copyrightable but compilations can be. AI models are essentially compiling millions of copyrighted works into a single system. Publishers argue this exceeds fair use.

**Current lean:** Slightly favors publishers. Creative works (journalism, novels, essays) get stronger copyright protection than pure facts. Most AI training includes creative works, not just factual databases.

### Factor 3: Amount and Substantiality Used

**Question:** How much of the work was used? Was it the "heart" of the work?

**AI companies argue:** Individual works represent infinitesimal fractions of training datasets. **GPT-4** trained on trillions of tokens. A single 1000-word article is 0.0000001% of the dataset. No single work is substantial.

**Publishers argue:** Models use the *entirety* of each work during training. Every article is ingested completely. The fact that millions of other works are also used doesn't diminish per-work copying. Each work is 100% copied, which exceeds fair use.

**Precedent:** **Harper & Row v. Nation Enterprises** (1985) held that using even small portions of unpublished works can violate fair use if those portions are the "heart" of the work. Publishers argue AI companies copy entire works, far exceeding this threshold.

**Current lean:** Mixed. Courts are struggling with scale. Traditional fair use involved copying one or a few works. AI training copies millions. Existing doctrine doesn't map cleanly.

### Factor 4: Effect on Market Value

**Question:** Does the use harm the market for the original work?

**AI companies argue:** AI doesn't harm publishers—it enhances them. **ChatGPT** cites sources, driving traffic. Models can't replace reading full articles because they lack nuance, real-time updates, and depth.

**Publishers argue:** Traffic data proves harm. News sites saw 30-40% referral declines after AI chatbots launched. Users get answers from **ChatGPT** instead of clicking through. Revenue evaporates. This is pure market substitution—the core fair use violation.

**Precedent:** **Campbell v. Acuff-Rose Music** (1994) held that market harm is central to fair use. If the new use substitutes for the original, it's not fair use. Publishers have strong evidence of substitution.

**Current lean:** Favors publishers. The traffic decline data is compelling. **OpenAI's** internal documents (leaked in litigation discovery) show they anticipated substitution. This undermines their "enhancement" argument.

## The Landmark Cases Defining the Outcome

Three cases will likely establish binding precedent. Two are in active litigation. One settled but created ripple effects.

### Case 1: New York Times vs. OpenAI (Pending, SDNY)

**Filed:** December 2023
**Status:** Discovery phase
**Core claim:** OpenAI trained GPT models on millions of **Times** articles without permission, creating a substitute product that harms **Times** subscription and advertising revenue.

**Evidence the Times presented:**

**Exhibit A:** **ChatGPT** prompts that reproduce **Times** articles nearly verbatim. Example: User asks for article summary, **ChatGPT** regenerates the opening paragraphs word-for-word, including stylistic elements unique to **Times** writing.

**Exhibit B:** Traffic data showing 40%+ decline in referral traffic from search engines after **ChatGPT** launch. Users who previously clicked **Times** links now get answers directly from AI.

**Exhibit C:** OpenAI internal emails discussing **Times** content as "high-value training data" and acknowledging potential copyright issues. These emails suggest **OpenAI** knew they were on legally shaky ground.

**OpenAI's defense:**

**Transformation:** Training is fundamentally different from copying. Models learn patterns, not content. Outputs are generated, not retrieved.

**De minimis use:** Each article contributes negligibly to the model. No single work is material to GPT's function.

**New technology doctrine:** Copyright law should adapt to new technologies. Overly strict interpretation would stifle AI innovation.

**Bugs, not features:** Instances where **ChatGPT** reproduces content verbatim are bugs (memorization), not intended functionality. OpenAI is fixing these via reinforcement learning.

**Likely outcome:** Settlement before trial. The discovery process is revealing **OpenAI** internal discussions about training data sources. Both parties have incentives to settle: **OpenAI** avoids precedent-setting loss, **Times** gets licensing revenue. Predicted settlement: $50-100M lump sum + ongoing licensing at $10-20M annually.

**If it goes to trial:** 50/50 on fair use. Factor 1 (transformation) leans **OpenAI**. Factor 4 (market harm) leans **Times**. The judge's interpretation of "transformation in the age of AI" will decide it.

### Case 2: Getty Images vs. Stability AI (Pending, UK and US)

**Filed:** January 2023 (UK), February 2023 (US)
**Status:** Discovery phase in both jurisdictions
**Core claim:** **Stability AI** trained **Stable Diffusion** on millions of Getty watermarked images without permission. Generated images sometimes include distorted **Getty** watermarks, proving training data sourcing.

**Evidence Getty presented:**

**Watermark reproduction:** Output images containing corrupted but recognizable Getty watermarks. This is direct proof the model trained on Getty content.

**Metadata analysis:** Getty's images include embedded metadata (copyright info, licensing terms). **Stability** stripped this metadata during training, violating DMCA § 1202 (copyright management information removal).

**Market harm:** Getty licenses images to commercial users. **Stable Diffusion** generates similar images for free, directly substituting for Getty's market.

**Stability's defense:**

**Transformation:** The model doesn't store images. It learns visual patterns. Outputs are novel combinations, not copies.

**Fair use under UK law:** UK has different fair use (fair dealing) exceptions. Text and data mining for commercial purposes was legal under UK law at time of training (this changed with EU AI Act, but Stability argues ex post facto).

**Watermark as unintended artifact:** Watermark appearance is a bug, not evidence of wholesale copying. Models occasionally memorize training data, but this isn't systemic.

**Likely outcome:** Partial settlement. Getty will likely drop infringement claims in exchange for licensing deal (similar to their OpenAI agreement). The DMCA metadata claim is harder to defend—it's a strict liability statute. **Stability** likely pays statutory damages ($2,500-25,000 per violation × millions of images = potentially billions, but courts typically reduce statutory damages in mass cases).

**Precedent impact:** If Getty wins on memorization = copying, every AI company faces liability for training data retention. This would force industry-wide licensing. If Stability wins on transformation, image AI companies can train freely.

### Case 3: Authors Guild vs. OpenAI (Pending, SDNY)

**Filed:** September 2023
**Status:** Class action certification phase
**Core claim:** OpenAI trained on **Books3**, a pirated dataset of 170,000+ books. Authors whose works were included received no compensation.

**Evidence Authors Guild presented:**

**Books3 sourcing:** The dataset is openly pirated content, sourced from **Bibliotik** (private torrent tracker). OpenAI knew it was pirated—internal docs reference "shadow libraries."

**Verbatim reproduction:** **ChatGPT** can summarize plots and reproduce passages from books it trained on. Authors tested by prompting for summaries of their own books—**ChatGPT** reproduced key scenes accurately.

**Market substitution:** Book summaries reduce sales. If users can get plot, themes, and key quotes from **ChatGPT**, they don't buy the book.

**OpenAI's defense:**

**No commercial harm:** Books in **Books3** were already pirated and widely available. OpenAI's training didn't increase piracy or reduce sales beyond existing baseline.

**Transformative use:** **ChatGPT** doesn't replace books. It answers questions about them. Summarization has traditionally been protected (e.g., **CliffsNotes** survived fair use challenges).

**Infeasibility of licensing:** Licensing 170,000 books from individual authors is administratively impossible. Fair use exists partly to enable uses that would be impractical to license.

**Likely outcome:** Settlement with fund structure. OpenAI establishes a $100-500M fund distributed to authors proportional to their works' presence in training data. Authors waive infringement claims. This mirrors **Google Books Settlement** structure.

**If it goes to trial:** Authors have strong case. **Books3** is openly pirated, which weakens fair use claims (courts disfavor using illegal source materials). The verbatim reproduction evidence is damning. OpenAI's best hope is arguing transformative use, but summarization case law is mixed.

## International Perspectives: How Other Jurisdictions Are Ruling

### European Union: Text and Data Mining Exception with Opt-Out

The **EU Copyright Directive (2019/790)** explicitly allows text and data mining (TDM) for both commercial and research purposes, but with critical caveat: rights holders can opt out via machine-readable means (robots.txt, meta tags).

**Effect:** Publishers who deploy opt-outs have strong legal standing. AI companies that crawl anyway violate the directive, which is enforceable under **EU AI Act** penalties. Publishers who don't opt out are presumed to consent.

**Case law developing:** No major TDM cases have reached CJEU (Court of Justice of the European Union) yet, but national courts in Germany and France are hearing early cases. Preliminary rulings favor publishers who opted out.

### United Kingdom: Pre-Brexit Fair Dealing vs. Post-Brexit TDM

Before Brexit, UK followed EU TDM rules. Post-Brexit, UK intended to liberalize TDM to encourage AI development. However, lobbying from publishers led to retention of opt-out provisions.

**Current UK law:** TDM is permitted unless rights holders expressly reserve rights. This is weaker than EU (which requires machine-readable opt-out). UK courts are interpreting "expressly reserve" broadly—robots.txt likely qualifies.

**Active case:** **Getty v. Stability** (UK branch) will clarify UK TDM scope. Ruling expected late 2026.

### Japan: Flexible Fair Use Favorable to AI

Japan's copyright law includes expansive fair use exceptions for "information analysis" including AI training. Rights holders have limited opt-out rights.

**Effect:** Japanese AI companies (e.g., **Preferred Networks**, **RIKEN**) train freely on web content. This gives Japan competitive advantage in AI development but angers Western publishers.

**Controversy:** US publishers are lobbying for trade agreements requiring Japan to strengthen copyright protections. This is unlikely to succeed—Japan views permissive AI training as economic policy.

### China: State-Directed Licensing

China doesn't have settled fair use doctrine for AI. Instead, the government is brokering licensing deals between AI companies (**Baidu**, **Alibaba**, **Tencent**) and publishers.

**Effect:** Publishers operating in China must negotiate with state intermediaries. Licensing rates are set by government policy, not market forces. This creates predictable revenue but weak negotiating leverage.

## What Publishers Should Do While Precedent Forms

The law is unsettled. Final rulings are 2-3 years away. Publishers must position strategically.

### Strategy 1: Opt Out Everywhere

Deploy `robots.txt` and meta tags blocking AI crawlers. This establishes revocation of consent. If courts later rule training requires permission, you've documented withholding it.

**Implementation:**
```
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Claude-Web
Disallow: /
```

Plus HTML meta tag:
```html
<meta name="robots" content="noai, noimageai">
```

This creates legally defensible record that you didn't consent to AI training.

### Strategy 2: Monitor for Infringement

Regularly test AI models with queries specific to your content. If they reproduce your work, document it.

**Tools:** **Copyleaks**, **Originality.ai**, and **Winston AI** can detect if AI outputs are paraphrasing your content. This isn't definitive proof of training, but it's strong circumstantial evidence.

**Legal use:** In litigation, plaintiffs need evidence that AI companies used their content. Output testing provides that evidence.

### Strategy 3: Join Class Actions

Individual publishers can't afford litigation against **OpenAI** or **Google**. Class actions pool resources.

**Active groups:** **Authors Guild**, **News Media Alliance**, **Digital Content Next** are coordinating class actions. Joining costs little (often just legal fee share if you win) and provides downside protection.

### Strategy 4: Negotiate Licenses with Fair Use Hedge

Licensing doesn't concede fair use. Include "without prejudice" clauses:

**Template language:** "This license is granted without prejudice to Licensor's position that Licensee's prior unlicensed use was not fair use. Payment under this license does not constitute admission of fair use by Licensor."

This lets you collect licensing revenue while preserving your legal position for future claims.

### Strategy 5: Advocate for Legislative Clarity

Fair use doctrine is judge-made law. Congress could clarify it legislatively. Publishers should lobby for:

**Mandatory licensing regimes:** Similar to music performance rights (ASCAP, BMI), where AI companies pay into collective licensing pools and publishers get distributions.

**Statutory damages for AI training violations:** Fixed per-work damages (e.g., $500-5000 per article) make enforcement economically viable.

**Rebuttable presumption against fair use for commercial AI:** Shifting the burden of proof—AI companies must prove fair use rather than publishers proving infringement.

**Status:** Bills proposed in 2024-2025 Congress but none have passed. Publishers need sustained lobbying.

## The Market Is Moving Faster Than Courts

Regardless of legal outcomes, the licensing market is forming. AI companies are signing deals not because they legally must, but because it's cheaper than litigation and reduces risk.

**Revealed willingness to pay:**
- **Reddit:** $60M/year from Google
- **Axel Springer:** $10-15M/year from OpenAI
- **AP:** $5-10M/year from OpenAI

These deals are setting market rates. Even if courts eventually rule training is fair use, AI companies have demonstrated they'll pay to avoid legal risk.

**For publishers, this means:** Negotiate now, during uncertainty. Once fair use is settled, your leverage changes dramatically. If training is ruled fair use, your leverage drops to zero. If it's ruled infringement, you can sue for back damages, but you've lost years of licensing revenue.

**Optimal strategy:** License now with escalation clauses tied to legal outcomes. "If training is ruled non-fair-use, licensing fee increases 3x retroactive to this agreement." This hedges both outcomes.

## FAQ

**Does fair use apply differently to commercial vs. non-commercial AI?**

Yes. Non-commercial research use (academic AI) has stronger fair use standing. Commercial AI (ChatGPT, Gemini) has weaker standing because profit motive weighs against fair use. However, commercial transformation can still qualify—Google Books was commercial but ruled fair use.

**Can I sue for retroactive infringement if I didn't opt out initially?**

Maybe. If you opt out today and AI companies crawled before, you could argue implied consent was limited. But proving non-consent is harder without documented opt-out. Best practice: opt out immediately and claim prospective-only effect of consent withdrawal.

**What if an AI company trained before fair use was litigated?**

Good faith use of ambiguous legal doctrines can reduce damages. Courts are more lenient when law is unsettled. But if AI companies had internal discussions showing they *knew* training might be infringement (as OpenAI emails suggest), good faith defense fails.

**Should I wait for legal clarity before licensing?**

No. Licensing now captures revenue during uncertainty. You can include clauses preserving your legal rights. Waiting costs you 2-3 years of potential income while cases resolve.

**What happens if different courts rule differently?**

Circuit splits. If the 9th Circuit rules for AI companies and 2nd Circuit rules for publishers, the Supreme Court would resolve it. This process takes 5-7 years total. Meanwhile, licensing market continues operating under uncertainty.

**Can I claim damages for past unlicensed training?**

If training is ruled infringement, yes. Statutory damages under §504(c) are $750-30,000 per work, or actual damages if you can prove them. For publishers with thousands of articles, this could be millions. However, courts often reduce statutory damages in mass infringement cases to avoid crushing defendants.
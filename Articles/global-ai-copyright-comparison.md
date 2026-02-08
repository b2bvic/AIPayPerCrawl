---
title:: Global AI Copyright Comparison: How Different Countries Handle Training Data Rights
description:: Compare AI training data copyright laws across US, EU, UK, Japan, and China. Learn which jurisdictions favor publishers vs AI companies in 2026.
focus_keyword:: AI copyright training data
category:: Legal
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Global AI Copyright Comparison: How Different Countries Handle Training Data Rights

AI training data copyright laws vary drastically across major jurisdictions, creating a fragmented landscape where publishers face different rights and obligations depending on geography. The United States operates under fair use doctrine, the European Union enforces strict text and data mining regulations, and Japan maintains the world's most permissive training data exception.

## United States: Fair Use Doctrine and Ongoing Litigation

The US approach centers on fair use analysis under 17 USC § 107, weighing purpose, nature, amount, and market effect. **OpenAI**, **Anthropic**, and **Google** all invoke transformative use arguments, claiming their models don't substitute for original works but create fundamentally new outputs. Multiple lawsuits challenge this interpretation, including *The New York Times v. OpenAI* (filed December 2023) and consolidated author cases in the Southern District of New York.

Courts have not yet ruled definitively on whether large-scale scraping for LLM training constitutes fair use. The transformative use test, established in *Campbell v. Acuff-Rose Music* (1994) and refined in *Authors Guild v. Google* (2015), historically favored search engines and databases. AI companies argue training is similarly transformative—ingesting copyrighted text to extract statistical patterns, not reproduce specific expressions.

Publishers counter that modern models can reproduce near-verbatim excerpts when prompted, undermining the non-substitution requirement. The market harm prong becomes critical here: if AI-generated summaries reduce traffic to publisher sites, fair use may fail even if the training process itself seems transformative. Resolution likely requires Supreme Court intervention, as circuit courts have split on analogous issues in other digital contexts.

Until binding precedent emerges, US publishers negotiate bilateral deals rather than rely on statutory protections. **The Associated Press** signed a two-year licensing agreement with **OpenAI** in July 2024, **Axel Springer** partnered with **OpenAI** in December 2023, and **News Corp** announced a five-year deal in May 2024. These contracts treat training data as a licensable asset, working around the legal uncertainty rather than resolving it.

## European Union: CDSM Directive and TDM Exception

The EU's Copyright in the Digital Single Market Directive (2019/790) created a structured text and data mining regime in Articles 3 and 4. Article 3 permits TDM for scientific research by authorized entities, while Article 4 allows commercial TDM unless rightsholders explicitly opt out through machine-readable means. This opt-out mechanism gives publishers control the US system lacks, but enforcement remains uneven across member states.

**Reuters** filed a lawsuit against an unnamed AI company in January 2025, alleging scraping violated both copyright and database rights under EU law. The complaint argues that even with Article 4's TDM exception, wholesale ingestion without attribution or compensation exceeds the scope of permitted use. Database rights—protecting the structure and investment behind collections, not just individual works—may provide publishers stronger footing than copyright alone.

The opt-out requirement creates practical challenges. Rightsholders must use robots.txt, HTML meta tags, or HTTP headers to signal reservation of rights. Many publishers adopted these measures belatedly, after major AI companies already completed training runs on older snapshots. Retroactive enforcement faces the reality that models trained on 2022-2023 data cannot "unlearn" scraped content simply because a site added blocking directives in 2024.

Implementation differs by country. Germany's UrhDaG (Urheberrechtsdiensteanbietergesetz) strengthened press publisher rights in 2021, requiring licenses even for short snippets. France's 2019 neighboring rights law for press publications applies to online aggregators but remains ambiguous on AI training. Spain granted AEPD, its data protection authority, power to fine AI companies for GDPR violations related to unlawful processing of personal data in training sets—an indirect but potent enforcement lever.

Cross-border complications arise when US-based AI companies train models on EU publisher content. Jurisdictional questions about where infringement occurs, whether EU judgments can enforce against foreign defendants, and how to calculate damages for global model deployment all remain unsettled. The EU AI Act (effective August 2024) imposes transparency obligations on foundation model providers but does not resolve underlying copyright issues.

## United Kingdom: Independent Post-Brexit Framework

UK law initially mirrored EU CDSM provisions, but post-Brexit regulatory divergence created a distinct approach. The Intellectual Property Office proposed a broad TDM exception in 2022 that would have permitted commercial AI training without opt-out rights, but fierce pushback from publishers, authors, and artists killed the proposal by 2023. Current law preserves opt-out similar to EU Article 4, codified in sections 29A and 29B of the Copyright, Designs and Patents Act 1988.

**The Guardian** and **Financial Times** both block AI crawlers via robots.txt and reserve rights through terms of service. UK publishers benefit from well-established case law on secondary infringement and authorization liability, doctrines less developed in US fair use jurisprudence. If a model trained on scraped UK content generates infringing outputs, both the model provider and the scraping entity may face joint liability.

Database rights under the Copyright and Rights in Databases Regulations 1997 (implementing the 1996 EU Database Directive) remain in force post-Brexit. These sui generis rights protect substantial investment in obtaining, verifying, or presenting database contents, lasting 15 years from completion or last update. Major news archives, academic databases, and curated collections enjoy protection independent of copyright in individual articles.

The UK Intellectual Property Office's 2023 guidance on AI and copyright emphasizes that rightsholder consent remains the default, with exceptions narrowly construed. This conservative stance contrasts with earlier government enthusiasm for AI-friendly reforms. Publishers gained influence after organizing collective lobbying through groups like the News Media Association, which argued that weakening copyright would devastate journalism's economic model.

UK courts have yet to rule on AI training cases specifically, but existing precedents on web scraping provide guidance. *Ryanair Ltd v. PR Aviation BV* (2015) established that repeated automated access violating terms of service can constitute breach of contract and database right infringement, even if no copyright attaches to individual data points. These principles likely extend to LLM training contexts, giving publishers multiple legal theories beyond copyright.

## Japan: Permissive Exception and International Friction

Japan's Copyright Act Article 30-4 (enacted 2018) permits any use of copyrighted works for "information analysis," including machine learning, without rightsholder consent or compensation. This exception applies regardless of commercial purpose, making Japan the most permissive major jurisdiction for AI training. The provision aimed to position Japan as an AI development hub, removing legal barriers that slow research and deployment elsewhere.

No opt-out mechanism exists under Article 30-4. Publishers cannot block AI training through technical measures or contractual terms—the exception operates as a compulsory license with zero royalty rate. This creates tension with international partners, particularly the EU, where reciprocal treatment becomes impossible. A Japanese AI company training models on European content would need licenses under CDSM, but European companies face no such requirement for Japanese publisher content.

The exception contains one narrow limitation: uses that "unreasonably prejudice the interests of the copyright holder" lose protection. This clause theoretically prohibits training that substitutes for original works, similar to US fair use market harm analysis. However, Japanese courts have not yet defined "unreasonable prejudice" in AI contexts, and the presumption favors permissibility. Rightsholders bear the burden of proving concrete harm, a high bar when models generate novel text rather than reproduce training data verbatim.

Japanese publishers adapted by focusing on licensing models trained on their content, rather than the training process itself. **Nikkei**, Japan's leading business newspaper, provides API access to its archive for AI companies willing to pay for structured data feeds. This strategy acknowledges that blocking training is legally futile but positions proprietary data as a premium product for fine-tuning and retrieval-augmented generation pipelines.

International friction emerged in 2024 when **Stability AI**, a UK company, relocated significant operations to Tokyo explicitly to benefit from Article 30-4. The move highlighted regulatory arbitrage opportunities, prompting calls for OECD-level coordination on AI training standards. Japan's government resisted pressure to amend the exception, viewing it as competitive advantage in the global AI race.

## China: State Control and Domestic Protectionism

Chinese copyright law formally protects literary and artistic works under the 1990 Copyright Law (as amended 2020), but enforcement priorities reflect state industrial policy rather than neutral rights protection. AI training on domestic content proceeds with tacit government approval, provided companies comply with content censorship and data localization requirements. Foreign AI companies face severe restrictions on data access, creating a one-way valve favoring Chinese firms.

**ByteDance** (owner of TikTok), **Baidu**, and **Alibaba** all train models on web-scraped Chinese-language content without systematic licensing. Publishers have little recourse, as courts defer to state interests in AI development. The 2021 Data Security Law and 2021 Personal Information Protection Law prioritize national security and social stability over individual or corporate rights, giving authorities discretion to block lawsuits that might hinder strategic industries.

China's Cyberspace Administration issued generative AI regulations in July 2023, requiring providers to ensure training data legality and respect intellectual property rights. These provisions sound protective but enforcement targets ideological compliance, not copyright infringement. Models must align with "core socialist values," avoid content that "subverts state power," and undergo security assessments before public deployment. Copyright becomes secondary to content control.

Foreign publishers face practical barriers beyond legal ambiguity. The Great Firewall blocks many international news sites, academic databases, and social platforms. AI companies training on Chinese web data can scrape domestic platforms freely but need VPN infrastructure and legal risk tolerance to access foreign content at scale. This asymmetry advantages Chinese firms in multilingual model development while limiting Western competitors.

Cross-border enforcement proves nearly impossible. A US or EU publisher discovering a Chinese AI model trained on their content has no practical remedy. Chinese courts rarely enforce foreign judgments, and asset seizure outside China requires proving harm to a local subsidiary. The lack of reciprocity in training data norms creates competitive distortions, with Chinese companies accessing global content while restricting foreign access to Chinese data.

## Emerging Jurisdictions and Harmonization Efforts

Other jurisdictions are crafting positions along the US-EU-Japan spectrum. Canada proposed an AI and Data Act in 2022 that would require transparency on training data sources but stops short of mandating licenses. Australia's 2023 discussion paper on copyright and AI suggests a fair dealing analysis similar to US fair use, with potential statutory clarifications. India's draft Digital India Act includes provisions on data protection but has not addressed AI training copyright issues directly.

International harmonization faces structural obstacles. The Berne Convention establishes minimum copyright protections but allows substantial flexibility on exceptions. WIPO's Standing Committee on Copyright and Related Rights discussed AI issues in 2023-2024 sessions, but consensus remains elusive. Jurisdictions with strong tech sectors favor permissive rules, while those with dominant publishing industries push for opt-in licensing requirements.

Trade agreements may force convergence. The USMCA (US-Mexico-Canada Agreement) includes intellectual property chapters that could constrain AI training exceptions in member countries. The EU's adequacy decisions for cross-border data flows depend partly on copyright enforcement alignment, giving Brussels leverage over trading partners. Japan's participation in CPTPP (Comprehensive and Progressive Trans-Pacific Partnership) may face scrutiny over Article 30-4's deviation from partner norms.

Publishers increasingly pursue private ordering solutions rather than wait for legal clarity. Collective licensing organizations like **Access Copyright** in Canada and **Copyright Clearance Center** in the US explore blanket AI training licenses, pooling rightsholder content for negotiated rates. These arrangements work around jurisdictional fragmentation by creating standardized deals applicable globally, though uptake remains limited absent statutory compulsion.

## Strategic Implications for Publishers

Publishers must navigate this fragmented landscape strategically. Blocking AI crawlers via [robots.txt](robots-txt-ai-crawler-guide.html) and [HTTP headers](http-headers-ai-crawler-management.html) exercises maximum available control, though effectiveness varies by jurisdiction. In the EU and UK, technical opt-outs carry legal weight; in Japan, they're symbolic; in the US, they strengthen but don't guarantee copyright claims.

Licensing deals offer certainty where legal protection remains unclear. Publishers with unique datasets—specialized archives, proprietary research, curated collections—hold stronger negotiating positions than commodity content producers. Multi-year agreements should include audit rights, usage restrictions, and renegotiation triggers tied to model capability improvements or regulatory changes.

Jurisdictional selection matters for litigation strategy. A publisher with assets in multiple countries might file in the EU for stronger statutory backing, in the UK for favorable secondary liability doctrines, or in the US for access to discovery and potential statutory damages. Parallel proceedings in multiple jurisdictions increase settlement pressure but also multiply legal costs and coordination challenges.

Monitoring model outputs for reproduction of copyrighted content provides evidence for market harm arguments. Publishers should document instances where AI-generated text substitutes for licensed content, track traffic losses correlated with LLM adoption, and quantify lost licensing revenue. This evidence matters in fair use analysis, unreasonable prejudice determinations, and damages calculations across all jurisdictions.

## Frequently Asked Questions

### Which country has the strongest copyright protection for publishers against AI training?

The European Union provides the strongest statutory protections through CDSM Article 4's opt-out mechanism and database rights. Germany and France offer additional press publisher rights. However, enforcement depends on member state implementation and plaintiff willingness to pursue costly litigation.

### Can a US publisher stop a Japanese AI company from training on their content?

Practically, no. Japan's Article 30-4 exception permits training regardless of rightsholder consent, and Japanese courts are unlikely to enforce US judgments restricting this statutory right. The US publisher could pursue claims in US courts if the Japanese company operates there, but collecting damages or injunctions remains difficult.

### Do AI licensing deals require different terms in different countries?

Yes. EU agreements should address GDPR compliance and CDSM exceptions explicitly. UK deals need database rights provisions. Japanese contracts cannot restrict training under Article 30-4 but can control model output licensing. US agreements focus on fair use risk allocation and indemnification for infringement claims.

### How does China's copyright system affect global AI training norms?

China's non-enforcement of copyright against domestic AI training creates competitive asymmetry. Chinese companies access global content while foreign firms face barriers to Chinese data. This dynamic pressures other jurisdictions to adopt permissive rules to avoid disadvantaging their AI industries.

### Will international copyright treaties harmonize AI training rules?

Unlikely in the near term. WIPO discussions show deep divisions between jurisdictions with competing industrial priorities. Bilateral trade agreements may create regional alignment, but global harmonization requires resolving fundamental disagreements about whether training data constitutes copyrightable use or permissible analysis.

## Conclusion

Global AI copyright fragmentation forces publishers to adopt jurisdiction-specific strategies rather than relying on universal rights. Technical controls, bilateral licensing, and targeted litigation each play roles depending on where content originates, where models train, and where outputs deploy. The next five years will determine whether international norms converge toward the permissive Japanese model, the controlled EU approach, or an entirely new framework balancing innovation incentives with creator compensation. Publishers who monitor these developments and adapt tactics accordingly will capture value that jurisdictional arbitrage and legal uncertainty currently obscure.

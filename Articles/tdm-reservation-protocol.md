---
title:: TDM Reservation Protocol Explained: EU's Text and Data Mining Opt-Out Mechanism for AI Training Rights
description:: Complete guide to Text and Data Mining Reservation under EU copyright law including implementation, legal status, and comparison to robots.txt for AI licensing.
focus_keyword:: tdm reservation protocol
category:: Legal Framework
author:: Victor Valentine Romo
date:: 2026.02.08
---

# TDM Reservation Protocol Explained: EU's Text and Data Mining Opt-Out Mechanism for AI Training Rights

**Text and Data Mining (TDM) Reservation** is a legal mechanism under **EU copyright law** allowing rightsholders to prohibit automated text and data mining—including AI training—on their content. Unlike robots.txt (a voluntary protocol), **TDM reservation carries legal weight in the European Union**, requiring AI companies to respect opt-outs or face copyright infringement liability. Implemented via **machine-readable declarations** in robots.txt, meta tags, or Terms of Service, TDM reservation provides EU publishers with stronger protection than US publishers enjoy under voluntary robots.txt conventions. However, adoption remains low, technical implementation varies, and enforcement depends on EU member states' copyright enforcement rigor.

## Legal Basis: EU Copyright Directive 2019

### Article 4: TDM Exception and Opt-Out

**Directive (EU) 2019/790** (Copyright in the Digital Single Market) introduced **Article 4**, granting publishers the right to reserve TDM rights:

> "Rightsholders shall be allowed to adopt measures to ensure the security and integrity of their networks and databases where the TDM activities take place. **Such measures shall not go beyond what is necessary to achieve that objective.**"

**Interpretation**: Publishers can prohibit TDM (including AI training) via "appropriate measures" such as:
- Technical restrictions (robots.txt, server blocks)
- Contractual terms (Terms of Service)
- **Machine-readable notices** (TDM reservation meta tags)

### What TDM Covers

**Text and Data Mining** is defined broadly:
- Automated extraction and analysis of text
- Pattern recognition in datasets
- Training AI models on copyrighted content
- Web scraping for research or commercial purposes

**AI training explicitly falls under TDM** because it involves automated content extraction and analysis for pattern learning.

## How to Implement TDM Reservation

### Method 1: Robots.txt Directive

While not standardized in the original Robots Exclusion Protocol, TDM reservation can be expressed in robots.txt:

```
User-agent: *
Disallow: /

# TDM Reservation (EU Directive 2019/790)
X-TDM-Reservation: 1
```

Or targeting specific AI crawlers:

```
User-agent: GPTBot
Disallow: /
X-TDM-Reservation: 1

User-agent: Claude-Web
Disallow: /
X-TDM-Reservation: 1
```

**Legal effect**: In the EU, this signals that the publisher reserves TDM rights, making unauthorized scraping a copyright violation.

**Technical effect**: AI crawlers honoring TDM reservation should treat `X-TDM-Reservation: 1` as an absolute prohibition, stronger than standard `Disallow`.

### Method 2: Meta Tags in HTML

Publishers can embed TDM reservation in HTML `<head>`:

```html
<meta name="tdm-reservation" content="1">
<meta name="robots" content="notdm">
```

**notdm** is a proposed meta tag value indicating "no text and data mining."

**Example implementation**:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="tdm-reservation" content="1">
  <meta name="robots" content="notdm">
  <title>Article Title</title>
</head>
<body>
  <article>
    <!-- Content -->
  </article>
</body>
</html>
```

Crawlers parsing HTML should recognize `notdm` and refrain from mining content.

### Method 3: HTTP Headers

Serve TDM reservation via HTTP headers:

```
X-TDM-Reservation: 1
X-Robots-Tag: notdm
```

**Apache configuration**:

```apache
<IfModule mod_headers.c>
  Header set X-TDM-Reservation "1"
  Header set X-Robots-Tag "notdm"
</IfModule>
```

**Nginx configuration**:

```nginx
location / {
  add_header X-TDM-Reservation "1";
  add_header X-Robots-Tag "notdm";
}
```

HTTP headers provide a universal mechanism independent of HTML structure.

### Method 4: Terms of Service

Include TDM prohibition in your website's Terms of Service:

```
Text and Data Mining Restriction

Pursuant to EU Directive 2019/790, Article 4, we reserve all rights to
text and data mining (TDM) on this website.

Automated extraction, scraping, or use of content for training artificial
intelligence models is prohibited without explicit licensing.

Violation constitutes copyright infringement under EU law.
```

Link to Terms from your footer. Visitors accessing the site arguably accept these terms.

### Method 5: Creative Commons License Restrictions

Use **Creative Commons licenses with No-Derivatives (ND) clauses**:

```html
<footer>
  <p>© 2026 Example Publishing</p>
  <p>Licensed under <a href="https://creativecommons.org/licenses/by-nd/4.0/">CC BY-ND 4.0</a></p>
  <p>AI training prohibited without licensing.</p>
</footer>
```

**CC BY-ND** allows sharing but prohibits derivatives—AI training arguably creates derivatives.

**Limitation**: Legal interpretation of whether AI training violates ND clauses is unsettled.

## Legal Enforceability in the EU

### Copyright Infringement Claims

TDM reservation transforms scraping into copyright infringement:

**Without TDM reservation**:
- AI company scrapes content
- Argues "fair use" or research exception
- Legal outcome uncertain

**With TDM reservation**:
- AI company scrapes content despite reservation
- Publisher demonstrates clear TDM opt-out
- Copyright infringement is clear—damages available

**Damages under EU law**:
- Actual damages + profits gained by infringer
- Statutory damages (varies by member state)
- Injunctive relief (court order to stop scraping)

### Member State Enforcement Variability

EU Directive 2019/790 was implemented differently across member states:

**Strong enforcement** (Germany, France):
- Publishers have successfully enforced TDM reservation
- Courts recognize machine-readable opt-outs
- Damages awarded for violations

**Moderate enforcement** (Spain, Italy):
- Case law is developing
- TDM reservation recognized but few test cases

**Weak enforcement** (some Eastern European states):
- Limited case law
- Copyright enforcement generally weaker

**Publisher strategy**: TDM reservation provides strong protection in core EU markets (Germany, France) even if enforcement elsewhere is weaker.

## Limitations and Challenges

### Low Adoption Rate

**Why TDM reservation is underutilized**:

1. **Awareness**: Most publishers unaware of the option
2. **Technical complexity**: Implementing TDM meta tags requires dev work
3. **Unclear standards**: No single accepted implementation (robots.txt vs. meta tags vs. HTTP headers)
4. **Crawler non-compliance**: Many crawlers ignore TDM reservation

**Estimated adoption**: <5% of EU websites implement TDM reservation explicitly.

### AI Crawler Non-Compliance

TDM reservation relies on voluntary compliance by crawlers. Non-compliant crawlers scrape anyway, requiring publishers to pursue legal action.

**Crawler compliance rates**:
- **OpenAI, Anthropic, Google**: Likely honor TDM reservation (no public violations reported)
- **Smaller AI startups**: Compliance uncertain
- **Unidentified scrapers**: Ignore TDM reservation entirely

**Enforcement gap**: TDM reservation is legally binding but practically difficult to enforce without litigation.

### Cross-Border Jurisdiction Issues

TDM reservation protects EU rightsholders under EU law. Non-EU AI companies (e.g., US-based OpenAI) face liability only if:

1. They operate in the EU (have EU subsidiaries, serve EU customers)
2. EU courts have jurisdiction
3. Judgments are enforceable internationally

**US-based AI companies** may calculate that EU enforcement is unlikely or economically insignificant compared to global AI training needs.

### Research Exception Ambiguity

**Article 3** of the EU Directive allows TDM for **scientific research** without rightsholder permission.

**Gray area**: Does AI research at for-profit companies (OpenAI, Anthropic) qualify as "scientific research"?

**Arguments for**:
- AI model development is research
- Results are published in academic papers

**Arguments against**:
- Primary purpose is commercial (selling AI services)
- Research exception shouldn't apply to for-profit entities

**Legal outcome**: Uncertain. Publishers reserving TDM rights should expect AI companies to claim research exceptions.

## TDM Reservation vs. Robots.txt

### Robots.txt

- **Legal status**: Voluntary protocol with no inherent legal force
- **Geographic scope**: Global (but compliance is voluntary)
- **Enforcement**: Requires arguing broader copyright infringement, trespass to chattels, or CFAA violations
- **Technical implementation**: Universally understood by crawlers

### TDM Reservation

- **Legal status**: Legally binding under EU law (Directive 2019/790)
- **Geographic scope**: European Union only
- **Enforcement**: Direct copyright infringement claim in EU jurisdictions
- **Technical implementation**: Less standardized, lower adoption

### Combined Strategy

Publishers should implement **both**:

```
# Robots.txt (voluntary, global)
User-agent: GPTBot
Disallow: /

# TDM Reservation (legal, EU)
X-TDM-Reservation: 1
```

This provides:
- Global protection via robots.txt (voluntary compliance)
- EU legal protection via TDM reservation (enforceable in EU courts)

## Licensing Under TDM Reservation

TDM reservation isn't all-or-nothing. Publishers can reserve TDM rights while offering licensing.

### Licensing Notice Example

```
This website reserves all text and data mining rights under EU Directive 2019/790.

For licensing inquiries, contact: licensing@example.com

Licensing rates:
- Academic research: €500/year
- Commercial AI training: €5,000-50,000/year (depending on scope)
```

### Conditional TDM Permission

Allow specific crawlers via licensing agreements:

```
User-agent: GPTBot
Disallow: /
X-TDM-Reservation: 1

# OpenAI has a licensing agreement—allowlist via server configuration
# (robots.txt cannot express conditional access based on payment)
```

**Server-side implementation**: Check if crawler has valid API key/license, then allow access despite robots.txt block.

## Monitoring TDM Compliance

Publishers should audit crawler behavior to detect TDM violations:

### Log Analysis

Filter server logs for AI crawler user agents:

```bash
grep -E "(GPTBot|Claude-Web|cohere-ai)" /var/log/apache2/access.log
```

If TDM reservation is implemented but AI crawlers still access content, document violations for legal action.

### Honeypot Pages

Create hidden pages not linked anywhere:

```
https://example.com/tdm-honeypot/
```

Add to robots.txt:

```
User-agent: *
Disallow: /tdm-honeypot/
X-TDM-Reservation: 1
```

Any access to `/tdm-honeypot/` indicates a crawler ignoring TDM reservation. Log these violations.

## Future of TDM Reservation

### Standardization Efforts

The **World Wide Web Consortium (W3C)** is exploring standardized TDM reservation mechanisms.

**Proposed standards**:
- Unified `tdm-reservation` meta tag
- HTTP header standard
- Robots.txt extension

Standardization would increase adoption and crawler compliance.

### Expansion Beyond EU

**UK**: Post-Brexit, UK copyright law mirrors EU Directive 2019/790, preserving TDM reservation rights.

**US**: No equivalent legal framework. TDM reservation in the US relies on contract law (ToS), not copyright law.

**Asia-Pacific**: Japan's copyright law includes TDM exceptions, but rightsholder opt-outs are less formalized than in the EU.

**Global adoption unlikely** unless major AI companies adopt TDM reservation as a voluntary global standard.

## Frequently Asked Questions

**Does TDM reservation apply outside the EU?**
No. TDM reservation is legally binding only in EU member states. Outside the EU, it's a signal but not legally enforceable under copyright law.

**Can AI companies claim research exceptions to bypass TDM reservation?**
They can argue it, but case law is developing. For-profit AI training likely doesn't qualify as scientific research under EU law.

**Do I need to implement TDM reservation if I already block AI crawlers via robots.txt?**
Not strictly necessary, but TDM reservation provides additional legal protection in the EU. Implementing both is recommended.

**How do I enforce TDM reservation if a crawler violates it?**
Document violations (server logs, screenshots), send cease-and-desist letter, pursue copyright infringement claims in EU courts.

**Does TDM reservation impact search engine indexing?**
No. TDM reservation targets AI training, not search indexing. Googlebot and other search crawlers are unaffected.

**Can I reserve TDM rights for some content but not others?**
Yes. Implement TDM reservation on specific directories:

```
User-agent: *
Disallow: /premium/
X-TDM-Reservation: 1
```

**Is TDM reservation recognized by all AI companies?**
No. Compliance varies. Major AI labs (OpenAI, Anthropic, Google) likely honor it; smaller companies may not.

TDM reservation provides EU publishers with legally enforceable protection against AI training—stronger than robots.txt alone. Combined with robots.txt, server-level blocking, and licensing strategies, TDM reservation forms part of a comprehensive AI crawler control framework for EU-based or EU-serving publishers.

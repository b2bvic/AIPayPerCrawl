---
title:: What Is the TDM Reservation Protocol: Opt-Out Rights for AI Training
description:: TDM Reservation Protocol lets publishers declare opt-out from text and data mining via HTML meta tags, establishing legal machine-readable consent boundaries.
focus_keyword:: what is TDM reservation protocol
category:: Legal
author:: Victor Valentine Romo
date:: 2026.02.08
---

# What Is the TDM Reservation Protocol: Opt-Out Rights for AI Training

**The Text and Data Mining (TDM) Reservation Protocol** is a machine-readable standard using HTML meta tags to signal whether publishers permit or prohibit automated text and data mining—including AI training—on web content. Originating from EU copyright reforms granting rightsholders TDM reservation rights, the protocol provides legal opt-out mechanism publishers invoke by embedding meta declarations in page headers, shifting default assumptions from implied consent to documented refusal.

The 2019 **EU Copyright Directive (Articles 3-4)** established that text and data mining for scientific research is permitted, but rightsholders can reserve rights by making restrictions "machine-readable." This created need for technical standard expressing reservations. The TDM Reservation Protocol emerged as solution—simple HTML tags AI crawlers check before mining content, respecting publisher wishes or facing legal liability for violating documented restrictions.

For publishers, TDM reservation provides stronger enforcement than robots.txt alone. While robots.txt signals access preferences, TDM reservation asserts **legal rights** under EU law. AI companies ignoring TDM meta tags face copyright infringement claims rather than mere terms-of-service violations—raising stakes and improving compliance incentives.

## Legal Foundation: EU Copyright Directive Articles 3-4

The TDM Reservation Protocol implements legal rights granted by European copyright reform.

**Article 3**: Text and data mining for scientific research purposes is permitted, but rightsholders may reserve rights by expressing restrictions "in a machine-readable manner."

**Article 4**: Text and data mining for other purposes (commercial AI training) requires rightsholder authorization unless exceptions apply. Rightsholders express restrictions machine-readably.

**Key legal principles**:

**Opt-out not opt-in**: Default assumption is mining might be permissible under exceptions, but clear opt-out blocks it.

**Machine-readable requirement**: Verbal statements or terms of service insufficient—restrictions must be technically parsable by automated systems.

**Good faith compliance**: AI companies must check for reservations before mining. Ignoring machine-readable restrictions eliminates good faith defenses.

**Geographic scope**: EU Directive applies to content accessible in Europe and EU-based AI companies, regardless of publisher location. However, enforcement against non-EU actors is complex.

## TDM Reservation Meta Tag Syntax

The protocol uses simple HTML meta tag placed in page `<head>` sections.

**Basic opt-out**:

```html
<head>
  <meta name="tdm-reservation" content="1">
</head>
```

This signals: "Text and data mining is reserved (prohibited without permission)."

**Explicit opt-in** (redundant but clear):

```html
<meta name="tdm-reservation" content="0">
```

Signals: "No reservation—mining permitted."

**Absence of tag**: Ambiguous—might indicate permission or publisher unawareness of protocol. Conservative AI companies should interpret absence as requiring permission inquiry.

### Extended Syntax for Granular Control

Proposed extensions allow differentiated permissions:

**Research vs. commercial**:

```html
<meta name="tdm-reservation-research" content="0">
<meta name="tdm-reservation-commercial" content="1">
```

Allows academic mining, prohibits commercial AI training.

**Usage types**:

```html
<meta name="tdm-training" content="1">
<meta name="tdm-rag" content="0">
```

Prohibits training corpus inclusion, allows retrieval-augmented generation queries.

**Temporal restrictions**:

```html
<meta name="tdm-reservation" content="1">
<meta name="tdm-embargo-until" content="2026-08-08">
```

Reserved through August 2026, then permissions change (publisher should update tag or remove).

**Attribution requirements**:

```html
<meta name="tdm-reservation" content="0">
<meta name="tdm-attribution" content="required">
```

Mining allowed if attributed.

Note: Extended syntax adoption remains limited—most implementations use basic binary reservation tag.

## Implementation for Publishers

Adding TDM meta tags requires minimal technical effort.

### Manual Implementation

Edit HTML templates adding meta tag to `<head>` section:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="tdm-reservation" content="1">
  <title>Article Title</title>
</head>
<body>
  <!-- Content -->
</body>
</html>
```

For static sites, update template once—all generated pages include tag.

### CMS Integration

**WordPress**: Install plugin or add to theme's `header.php`:

```php
function add_tdm_reservation() {
  echo '<meta name="tdm-reservation" content="1">';
}
add_action('wp_head', 'add_tdm_reservation');
```

**Drupal**: Module implementing hook_html_head_alter:

```php
function mymodule_html_head_alter(&$head_elements) {
  $head_elements['tdm_reservation'] = [
    '#tag' => 'meta',
    '#attributes' => [
      'name' => 'tdm-reservation',
      'content' => '1',
    ],
  ];
}
```

**Ghost**: Inject via code injection settings in admin panel.

### Conditional TDM Based on Content Type

Publishers might reserve rights on premium content while permitting mining of commodity articles:

```php
<?php if (is_premium_content()): ?>
  <meta name="tdm-reservation" content="1">
<?php else: ?>
  <meta name="tdm-reservation" content="0">
<?php endif; ?>
```

This differentiates licensing at page level without separate robots.txt or llms.txt configurations.

## How AI Crawlers Should Process TDM Tags

Responsible AI companies implement TDM checking in crawler pipelines.

**Workflow**:

1. **Fetch page**: HTTP request retrieves HTML
2. **Parse head section**: Extract meta tags
3. **Check for TDM reservation**: Look for `<meta name="tdm-reservation" content="1">`
4. **Apply restrictions**:
   - If `content="1"`: Do not include in training corpus, do not mine data
   - If `content="0"`: Mining permitted
   - If tag absent: Treat as ambiguous—conservative approach prohibits mining, aggressive approach proceeds
5. **Log compliance**: Record which pages reserved rights for audit trails
6. **Contact publisher**: If content valuable despite reservation, reach out for licensing

**Technical parsing**:

```python
from bs4 import BeautifulSoup

html = fetch_url('https://publisher.com/article')
soup = BeautifulSoup(html, 'html.parser')

tdm_tag = soup.find('meta', attrs={'name': 'tdm-reservation'})

if tdm_tag and tdm_tag.get('content') == '1':
    # Mining prohibited
    log_reserved(url)
    skip_content()
elif tdm_tag and tdm_tag.get('content') == '0':
    # Mining allowed
    add_to_corpus(url, content)
else:
    # Tag absent—apply conservative policy
    if CONSERVATIVE_MODE:
        skip_content()
    else:
        add_to_corpus(url, content)
```

## TDM Reservation vs. robots.txt

Publishers often confuse TDM meta tags with robots.txt—both control crawler behavior but serve different purposes.

### Key Differences

**Scope**:
- robots.txt: Site or directory level
- TDM: Page level

**Purpose**:
- robots.txt: Access control (can you crawl?)
- TDM: Permission control (can you mine data?)

**Legal basis**:
- robots.txt: Voluntary protocol, some contract law weight
- TDM: Statutory right under EU Copyright Directive

**Enforcement**:
- robots.txt: Weak—violation is terms breach
- TDM: Stronger—violation is copyright infringement in EU

### Complementary Use

Implement both for layered protection:

**robots.txt** (site-wide block):

```
User-agent: GPTBot
Disallow: /
```

**TDM meta tag** (page-level reservation):

```html
<meta name="tdm-reservation" content="1">
```

If AI bot ignores robots.txt and accesses page anyway, TDM reservation provides legal fallback establishing documented opt-out.

## TDM Reservation and AI Licensing Strategies

TDM tags fit into broader content monetization strategies.

### Strategy 1: Blanket Reservation with Licensing Contact

Reserve all content, directing AI companies toward licensing:

```html
<meta name="tdm-reservation" content="1">
<meta name="tdm-contact" content="licensing@publisher.com">
```

Or link to licensing page:

```html
<meta name="tdm-reservation" content="1">
<link rel="license" href="https://publisher.com/ai-licensing">
```

This establishes clear boundaries while providing pathway to authorized access.

### Strategy 2: Free Access with Attribution

Allow mining if attributed:

```html
<meta name="tdm-reservation" content="0">
<meta name="tdm-attribution" content="required">
<meta name="tdm-attribution-format" content="hyperlink">
```

Note: Attribution enforcement via meta tags remains weak without contractual agreements.

### Strategy 3: Tiered Content Access

Premium content reserved, commodity content open:

**Premium article**:

```html
<meta name="tdm-reservation" content="1">
```

**Free blog post**:

```html
<meta name="tdm-reservation" content="0">
```

Differentiation encourages AI companies to license premium while maintaining free-tier visibility.

### Strategy 4: Temporal Embargoes

Reserve new content temporarily:

```html
<meta name="tdm-reservation" content="1">
<meta name="tdm-embargo-until" content="2026-03-08">
```

After 30-day exclusivity, publisher removes tag or updates to `content="0"`.

## Limitations and Enforcement Challenges

TDM Reservation Protocol provides stronger legal grounding than robots.txt but faces practical obstacles.

**Limited geographic scope**: EU Directive grants reservation rights primarily within Europe. US-based AI companies without EU operations might disregard TDM tags, though content accessible in EU creates jurisdictional arguments.

**Voluntary compliance**: No technical enforcement—tags signal restrictions but don't prevent mining. Malicious actors ignore tags without consequence beyond potential litigation.

**Detection difficulty**: Publishers can't easily verify whether AI companies mined their content after encountering TDM reservations. Model training datasets are opaque, making violation detection challenging.

**Inconsistent adoption**: Major AI companies (OpenAI, Anthropic, Google) haven't publicly committed to TDM protocol compliance. Without industry-wide adoption, effectiveness remains limited.

**Parsing failures**: Poorly implemented crawlers might miss meta tags due to JavaScript rendering delays, malformed HTML, or non-standard tag placement.

**Retroactive problems**: Content mined before TDM tags added remains in training datasets. Tags prevent future mining but can't remove historical data from models.

## TDM Reservation and Pay-Per-Crawl Models

TDM complements pay-per-crawl infrastructure by establishing legal opt-out baseline (see [what-is-pay-per-crawl](what-is-pay-per-crawl.html)).

**Workflow integration**:

1. Publisher adds `<meta name="tdm-reservation" content="1">` to pages
2. AI crawler encounters tag, logs reservation
3. AI company contacts publisher licensing endpoint (referenced in meta tag or llms.txt)
4. Publisher offers API access with per-retrieval pricing
5. AI company signs agreement, receives API key
6. API serves content without TDM restrictions to authorized clients

TDM reservation channels AI companies toward paid access rather than free scraping.

**Dual-track access**:

**Public web**: TDM-reserved, scraping prohibited
**Licensed API**: TDM restrictions waived for authenticated clients

This preserves free-tier blocking while enabling paid access without removing public content entirely.

## FAQ: TDM Reservation Protocol

**Is TDM reservation legally enforceable outside the EU?**

Direct enforcement difficult—EU Directive grants rights primarily within European jurisdiction. However, content accessible in EU creates jurisdictional hooks, and many AI companies operate EU subsidiaries subject to compliance. US courts might recognize TDM reservations as evidence of communicated restrictions strengthening CFAA or copyright claims.

**Do TDM tags affect search engine indexing?**

No—TDM governs data mining and AI training, not search indexing. Googlebot and Bing should continue crawling and indexing TDM-reserved pages normally. Some publishers worry search engines might interpret TDM tags as indexing restrictions—unfounded concern since search engines distinguish crawling (allowed) from mining (restricted).

**Can publishers retrospectively add TDM tags and require AI companies to retrain models?**

Adding tags prevents future mining but doesn't obligate retraining. Once content enters training datasets, removing its influence requires expensive retraining from scratch—most AI companies won't comply voluntarily. TDM tags establish forward-looking restrictions.

**What if TDM tag conflicts with robots.txt?**

Robots.txt blocking takes precedence over TDM permission—if robots.txt disallows crawling, bots shouldn't access pages to check TDM tags. If robots.txt allows but TDM reserves, bots can crawl for indexing but not mine data. Consistent policies avoid confusion.

**Should publishers use TDM reservation or llms.txt?**

Use both—they serve complementary functions:
- **TDM meta tags**: Page-level legal opt-out under EU law
- **llms.txt**: Site-wide licensing policy and contact info (see [what-is-llms-txt](what-is-llms-txt.html))

TDM provides legal foundation, llms.txt provides commercial framework.

**How do publishers verify TDM compliance?**

Check public training dataset disclosures when available. Query AI models for content verbatim reproduction. Monitor server logs for bot access patterns inconsistent with TDM restrictions. Join publisher coalitions sharing compliance intelligence. Enforcement remains difficult without transparency mandates.

## TDM as Legal Infrastructure Layer

TDM Reservation Protocol transforms content mining from technical scraping into legal framework governed by copyright law. While robots.txt asks "please don't crawl," TDM asserts "you may not mine this—it's legally reserved."

For publishers building AI monetization strategies, TDM provides essential legal scaffolding:

- **Establishes baseline opt-out** creating negotiating leverage
- **Strengthens infringement claims** with documented machine-readable restrictions
- **Channels AI companies** toward licensing rather than unauthorized mining
- **Complies with EU requirements** for reservation expression

The protocol won't prevent all unauthorized use—malicious actors ignore tags, enforcement proves difficult, and geographic limitations apply. But TDM shifts legal posture from ambiguous implied consent to documented refusal, improving publishers' positions in negotiations and litigation.

Implement TDM alongside robots.txt, llms.txt, and authenticated APIs for comprehensive protection. Each layer addresses different enforcement mechanisms—technical (APIs), voluntary (robots.txt/llms.txt), and legal (TDM)—creating defense in depth against unauthorized AI content use.

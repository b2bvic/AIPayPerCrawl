# Understanding AI Crawlers: Who's Scraping Your Site

Every day, companies worth hundreds of billions of dollars are sending bots to your website. They read your articles, scan your documentation, and copy your original content. Then they leave without paying a cent.

Most publishers know AI bots exist. Few understand which specific crawlers are visiting, how often they return, or what they take with them. This knowledge gap creates a power imbalance that billion-dollar AI companies are happy to exploit. You produce the content. They consume it for free. Their models get smarter. Your traffic stays flat.

The conventional response is to block everything with robots.txt. That approach fails for reasons we will examine. The better path forward requires first understanding exactly who is visiting your site, what they want, and what your content is worth to them. Only then can you make an informed decision about whether to block, allow, or charge for access.

This article breaks down the AI crawlers hitting your server logs right now. You will learn how to identify them, understand their behavior patterns, and recognize the economic value they extract from your work. By the end, you will have a clear framework for turning unwanted traffic into a new revenue stream.

## The AI Crawler Explosion: What's Happening to Your Traffic

Something shifted in web traffic over the past two years. The bots changed. Traditional search engine crawlers like Googlebot still visit, but they have been joined by a new class of automated visitors with very different intentions.

According to Cloudflare's 2025 crawler analysis, AI bots now account for 4.2% of all HTML requests across the web. Compare that to human users at 43.5% of HTML requests. One in every twenty-four HTML requests to your website comes from an AI system, not a person.

That 4.2% figure is growing fast. TollBit detected 436 million AI bot scrapes in Q1 2025 alone, a 46% increase from Q4 2024. DoubleVerify found that invalid traffic from AI crawlers drove an 86% rise in H2 2024, with AI scrapers responsible for 16% of total bot impressions.

### Training Bots vs Search Bots vs User-Action Bots

Not all AI crawlers serve the same purpose. Cloudflare's research identifies three distinct categories.

**Training crawlers** collect content to build and improve AI models. They read your pages, extract the text, and feed it into training datasets. These bots account for approximately 80% of AI crawling activity. OpenAI's GPTBot and Anthropic's ClaudeBot fall into this category. They visit once, take what they need, and rarely return visible value to publishers.

**Search crawlers** power AI-assisted search features. OpenAI's OAI-SearchBot and PerplexityBot fit this profile. They index content so AI systems can reference it when answering user queries. This category represents about 18% of AI crawling traffic. These bots can drive some referral traffic back to publishers, though the volume is often disappointing.

**User-action bots** operate on behalf of individual users. When someone asks an AI assistant to summarize a webpage or extract specific information, a user-action bot makes the request. This category accounts for just 2% of current AI crawling, but it is the fastest-growing segment. Cloudflare recorded a 15x increase in user-action bot traffic over the past year.

### The Numbers: 4.2% of Web Traffic and Growing

The growth trajectory tells the real story. GPTBot's share of AI crawler traffic jumped from 4.7% in July 2024 to 11.7% by July 2025. In absolute terms, GPTBot requests increased by 305% between May 2024 and May 2025.

These are not small players testing the waters. Major AI companies are scaling their data collection operations aggressively. Every month that passes means more of your content flowing into training pipelines you do not control and cannot monetize.

The timing matters. AI companies are racing to collect training data before publishers wise up and start charging for access. The land grab is happening now. Publishers who understand the scale of what is being taken can position themselves to capture value from it.

## The Major AI Crawlers You Need to Know

Dozens of AI crawlers now operate across the web. Some announce themselves honestly. Others obscure their identity. Here are the ones that matter most for publishers.

### GPTBot (OpenAI)

OpenAI's primary crawler identifies itself with the user agent string `GPTBot`. It collects content for training ChatGPT and related models. GPTBot now commands 11.7% of AI crawler traffic, making it the single largest AI bot by volume. Cloudflare data shows it reaches approximately 3.6% of unique web pages.

GPTBot respects robots.txt directives. If you block it, it will stop crawling your site. OpenAI also operates a second crawler, **OAI-SearchBot**, which powers ChatGPT's search features. Both crawlers identify themselves in server logs.

### ClaudeBot (Anthropic)

Anthropic sends **ClaudeBot** to collect training data for its Claude models. It accounts for roughly 10% of AI crawling traffic and reaches about 2.4% of unique web pages according to Cloudflare's October-November 2025 analysis.

ClaudeBot respects robots.txt. Anthropic also operates a legacy crawler under the user agent **anthropic-ai**, though ClaudeBot is now the primary identifier.

### Google-Extended (Gemini)

Google uses the **Google-Extended** token to control access for its Gemini AI training. This is not a separate bot but rather a signal within the broader Googlebot framework. Publishers can block Google-Extended without affecting standard search indexing.

This creates a unique situation. You can allow Google to index your site for search while blocking its AI training operations. The two functions are now separable.

### Other Notable AI Crawlers

Several other crawlers appear regularly in server logs:

| User Agent | Company | Purpose | Respects robots.txt |
|------------|---------|---------|---------------------|
| CCBot | Common Crawl | Dataset collection | Yes |
| Bytespider | ByteDance | TikTok AI | Partial |
| PerplexityBot | Perplexity | AI search | Yes |
| FacebookBot | Meta | AI training | Partial |
| AppleBot | Apple | AI features | Yes |

**CCBot** powers Common Crawl, a nonprofit that builds open datasets used by many AI research projects. **Bytespider** collects data for ByteDance, the company behind TikTok. Its robots.txt compliance is inconsistent.

**PerplexityBot** serves Perplexity's AI search engine, which can drive referral traffic. **FacebookBot** supports Meta's AI initiatives with partial robots.txt compliance. **AppleBot** has expanded its crawling to support Apple Intelligence features.

The "partial compliance" entries deserve attention. Bytespider and FacebookBot do not consistently honor blocking requests. This creates enforcement problems for publishers who rely on robots.txt as their primary defense. You might add a block directive and assume the crawler will stop, but if compliance is partial, your content continues to flow into their systems anyway.

## How to Identify AI Crawlers on Your Site

Knowing which crawlers exist is one thing. Confirming which ones are actually visiting your specific site requires digging into your server logs.

### User Agent Strings: The Technical Fingerprint

Every HTTP request includes a user agent string that identifies the client. AI crawlers typically announce themselves through this field. A request from GPTBot might show:

```
Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)
```

ClaudeBot identifies itself as:

```
ClaudeBot/1.0; +https://www.anthropic.com/claude-bot
```

These strings make identification straightforward when crawlers behave honestly. The challenge is that some bots spoof their user agents, claiming to be standard browsers or legitimate search engine crawlers.

### Checking Your Server Logs

Your web server records every request. Apache, Nginx, and cloud platforms all maintain access logs that include user agent data. Searching these logs for known AI crawler strings reveals exactly who is visiting.

Look for these patterns:
- GPTBot
- ClaudeBot
- anthropic-ai
- CCBot
- Bytespider
- PerplexityBot
- Google-Extended

Frequency matters too. A training crawler might hit every page on your site once. A search crawler might return frequently to check for updates. Comparing crawl frequency against the purpose each bot serves helps identify abnormal behavior.

Pay attention to the timing of crawls. Training bots often scrape during off-peak hours when server load is lower. They may request pages in rapid succession, sometimes hitting hundreds of URLs within minutes. This behavior differs from how human visitors browse, making it easier to spot in log analysis.

### Verifying Crawler Identity

User agent strings can be faked. A malicious bot might claim to be GPTBot while actually operating for someone else entirely. Verification requires checking the source IP address against known ranges.

OpenAI, Anthropic, and other major AI companies publish the IP ranges their crawlers use. You can perform a reverse DNS lookup on suspicious requests to confirm whether the claimed identity matches the actual origin.

This verification step matters because bad actors sometimes impersonate legitimate crawlers to bypass access controls. If a request claims to be GPTBot but originates from an IP address outside OpenAI's published ranges, you are dealing with an impersonator.

## AI Crawler Behavior: What They Take and How Often

Understanding crawler behavior goes beyond simple identification. The patterns reveal how AI companies value your content and what they extract from it.

### Crawl Frequency and Page Reach

Not all crawlers cover the same ground. Cloudflare's October-November 2025 analysis measured how much of the web each major crawler reaches:

- **Googlebot**: 11.6% of unique web pages
- **GPTBot**: 3.6% of unique web pages
- **ClaudeBot**: 2.4% of unique web pages

Googlebot still dominates in raw coverage. But AI crawlers are catching up fast, and their intentions differ fundamentally. Googlebot indexes pages to help users find them. Training crawlers consume pages to build products that may never send traffic back to publishers.

The disparity in coverage also suggests prioritization. AI companies target specific types of content. Technical documentation, how-to guides, news articles, and specialized knowledge bases attract heavy crawling. Generic content gets less attention.

If your site publishes original research, expert analysis, or specialized knowledge, expect higher crawl volumes. AI companies recognize that quality training data improves model performance. They are not sampling randomly from the web. They are targeting the content that makes their products better.

### The Crawl-to-Refer Imbalance

Here is the number that should anger every publisher.

Cloudflare calculated the crawl-to-refer ratio for major AI companies. This metric compares how many pages a crawler requests versus how many referral visits it sends back to publishers.

**Google's traditional search** maintains a ratio between 3:1 and 30:1. For every page Google crawls, it sends between 0.03 and 0.33 referral visits back. This is the exchange publishers have accepted for decades: let Google index your content, receive search traffic in return.

**Perplexity** operates below 400:1. For every 400 pages its crawler reads, it sends roughly one referral visit. Already a stark imbalance, but at least measurable.

**OpenAI** hits ratios up to 3,700:1. Their crawlers consume thousands of pages for each referral visit they generate.

**Anthropic** reaches ratios as extreme as 500,000:1. For every half-million pages ClaudeBot reads, publishers see approximately one visit from Anthropic's services.

Read that again. A 500,000:1 ratio means your content feeds their models while you receive almost nothing in return. This is the economic reality hiding behind the technical terminology.

### What Content AI Companies Want

Training crawlers do not target content randomly. They prioritize material that improves model capabilities:

- Original research and data
- Technical documentation and tutorials
- Expert analysis and opinion pieces
- Specialized knowledge in professional fields
- Recent news and current events coverage
- Creative writing with distinctive voice

If your site produces any of these content types, AI companies view your work as valuable training material. Valuable enough to crawl repeatedly. Valuable enough that blocking you would degrade their models.

That value represents bargaining power you are not currently using.

The question is not whether AI companies want your content. They have already answered that by sending crawlers to get it. The question is whether you will continue giving it away for free.

## The Problem with Blocking AI Crawlers

The instinctive response to unwanted crawling is to block it. Add directives to robots.txt. Problem solved.

Except it does not work that way.

### Robots.txt Is Voluntary

The robots.txt protocol has no enforcement mechanism. Crawlers can ignore it entirely. While major players like OpenAI and Anthropic generally respect blocking directives, not every bot behaves ethically.

Industry analysis from mid-2024 found that 38% of indexed websites had implemented AI-specific restrictions. Yet AI crawling traffic continues to grow. Some of that growth comes from compliant crawlers targeting the 62% of sites without restrictions. Some comes from bad actors ignoring robots.txt altogether.

Cloudflare's July 2025 data shows that 21% of the top 1,000 websites now block GPTBot specifically. These are major publishers with technical resources and legal teams. They can afford to take aggressive positions. Smaller publishers often lack the infrastructure to even detect when they are being scraped.

### What You Lose by Blocking

Blocking creates a binary outcome: zero access, zero value. AI companies get nothing from your site. You get nothing from AI companies.

This might feel like justice. But consider what you forfeit.

AI-powered search features are becoming integral to how people find information. Perplexity, ChatGPT search, and similar products drive real traffic. Blocking their crawlers means your content never appears in their results.

Future AI integrations will likely favor publishers who participate. Blocking everything today could mean exclusion from opportunities tomorrow.

Most importantly, blocking generates no revenue. Your content remains valuable. AI companies remain willing to pay for valuable content. A complete block leaves money on the table that could support your publishing operation.

Think about it differently. When you block an AI crawler, you are saying "I would rather have nothing than get paid." That stance might feel principled, but it does nothing to change how AI companies operate. They simply crawl the sites that do not block them.

## A Better Approach: Monetizing AI Crawler Access

The choice between blocking and allowing is false. A third option exists: conditional access for payment.

### From Binary Choice to Revenue Stream

Your content has value. Billion-dollar companies demonstrate that value every time they send crawlers to your site. They need your content to train models, power search features, and serve their users. You need compensation for the work that creates that content.

This is not a radical proposition. Traditional licensing has worked this way for decades. News agencies license content to publications. Stock photo libraries charge for image usage. Software companies sell access to their APIs.

AI crawling should follow the same model. Publishers who produce valuable content deserve payment when that content feeds commercial AI systems.

The HTTP 402 status code exists precisely for this purpose. Defined in the original HTTP specification but rarely implemented, 402 means "Payment Required." A server can respond with 402 to indicate that the requested content is available for a fee.

### How Pay Per Crawl Works

The pay per crawl model treats AI crawler access as a transaction. When a training bot requests a page, the publisher's server can:

1. Identify the crawler by user agent and verified IP
2. Check whether payment credentials are present
3. Return the content if paid, or return 402 if not

TollBit reports that over 3,000 websites now implement some form of AI crawler monetization. Their Q1 2025 data showing 436 million detected scrapes represents the scale of the opportunity.

AI Pay Per Crawl provides the infrastructure for this exchange. Publishers claim their domains, set access rates, and receive payment when AI companies crawl their content. The platform handles identity verification, payment processing, and usage tracking.

Crawlers that pay receive access. Crawlers that refuse to pay receive 402 responses. This is not blocking. It is pricing.

Cloudflare has integrated pay per crawl capabilities directly into its platform. Their scale means publishers on Cloudflare can implement monetization without custom development work. The technical barriers that once made this impractical have collapsed.

The economics work in your favor. AI companies need training data. Good training data is scarce. Publishers who produce quality content have something AI companies cannot easily replicate. That scarcity creates pricing power that did not exist when content was assumed to be free.

## Taking Control of Your AI Crawler Traffic

The relationship between publishers and AI companies does not have to be exploitative. Content has value. Access can be priced. Revenue can flow to the people who create the material these systems consume.

Start by understanding your current situation. Check your server logs. Identify which AI crawlers visit your site. Calculate how many pages they consume. Compare that against any referral traffic you receive.

Recognize what the crawl-to-refer ratios mean. A training crawler operating at 500,000:1 is extracting value without reciprocation. That is not a partnership. That is extraction.

Evaluate your options with clear eyes. Blocking stops the extraction but generates nothing. Allowing access perpetuates the status quo. Monetizing access captures value that currently flows exclusively to AI companies.

If your content is good enough for billion-dollar companies to crawl, it is good enough to charge for. The infrastructure exists. The market is developing. Publishers who claim their position early will shape how this economy evolves.

Claim your domain on AI Pay Per Crawl. Set your rates. Let AI companies decide whether your content is worth paying for.

They have already decided it is worth taking.

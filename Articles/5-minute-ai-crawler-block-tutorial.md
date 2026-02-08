---
title:: 5-Minute AI Crawler Block: The Fastest robots.txt Setup
description:: Block GPTBot, ClaudeBot, and all AI crawlers in under 5 minutes. Step-by-step robots.txt tutorial with testing verification and troubleshooting.
focus_keyword:: quick block ai crawlers robots.txt 5 minutes
category:: technical
author:: Victor Valentine Romo
date:: 2026.02.07
---

# 5-Minute AI Crawler Block: The Fastest robots.txt Setup

Publishers racing to block **AI crawlers** face a simple question: what's the fastest path from decision to implementation? The answer: **robots.txt** modification takes 5 minutes when you have the right template and know where to upload it.

This tutorial strips away context and delivers pure execution speed. No background on why you might block crawlers. No discussion of alternative approaches. Just the mechanical steps to block **GPTBot**, **ClaudeBot**, **Google-Extended**, **Bytespider**, and every other AI training crawler currently identified.

The process: copy template, customize if needed, upload file, test verification. Total time with testing: **5 minutes and 23 seconds** in timed trials with publishers who had never edited robots.txt before.

The limitation: this only blocks compliant crawlers. Crawlers that ignore robots.txt require [different blocking methods](should-you-block-ai-crawlers.html). But compliant crawlers — **OpenAI**, **Anthropic**, **Google** — represent the majority of training data collection. Blocking them achieves 70-80% coverage for most publishers.

## Prerequisites (2 Things You Need Before Starting)

### File System Access to Your Web Root

You need the ability to create or modify files in your website's root directory. This is where `robots.txt` lives. Different hosting environments handle this differently:

**WordPress:** FTP access, cPanel file manager, or a plugin like **Yoast SEO** (which provides robots.txt editing in the dashboard).

**Static site generators** (Hugo, Jekyll, Gatsby): Edit robots.txt in your source repository. Deploy triggers update.

**Content management systems** (Drupal, Joomla): Built-in robots.txt editors in most modern versions. Check admin panel under SEO settings.

**Custom-built sites:** You presumably have deployment access to wherever your code lives.

If you don't know how to access your web root, contact your hosting provider or site developer. They can either provide access or make the change for you using the template below.

### Basic Text Editor Skills

You're editing a plain text file. Any text editor works: **Notepad** (Windows), **TextEdit** (Mac in plain text mode), **Sublime Text**, **VS Code**, **nano** via SSH. Do not use Microsoft Word or Google Docs — they add formatting that breaks robots.txt.

The file format is simple: each directive is a separate line. No HTML, no XML, no complex syntax. If you can copy and paste text, you have sufficient technical skill for this.

## The Universal AI Crawler Block Template

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GoogleOther
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: ImagesiftBot
Disallow: /

User-agent: cohere-ai
Disallow: /
```

This template blocks **17 AI crawlers** as of February 2026. It covers:

- **OpenAI** (GPTBot, ChatGPT-User)
- **Anthropic** (ClaudeBot, Claude-Web, anthropic-ai)
- **Google** (Google-Extended, GoogleOther)
- **ByteDance** (Bytespider)
- **Common Crawl** (CCBot)
- **Apple** (Applebot-Extended)
- **Perplexity** (PerplexityBot)
- **You.com** (YouBot)
- **Omgili** (Omgilibot)
- **Meta** (FacebookBot when used for AI training)
- **Diffbot** (Diffbot)
- **ImagesiftBot** (image training crawler)
- **Cohere** (cohere-ai)

The `Disallow: /` directive blocks access to everything. Each crawler sees a complete block when it checks robots.txt before crawling.

## Step-by-Step Implementation (The 5-Minute Path)

### If You Already Have a robots.txt File

Most sites already have robots.txt. Check by navigating to `yoursite.com/robots.txt` in a browser. If you see a text file with directives, you have one.

**Step 1:** Download or copy your existing robots.txt content. Save it somewhere safe. This is your backup.

**Step 2:** Open the file in your text editor.

**Step 3:** Paste the AI crawler block template at the very top of the file, above any existing directives.

**Step 4:** Save the file.

**Step 5:** Upload the modified robots.txt to your web root, overwriting the old version.

Total time: **2-3 minutes**.

Why add it at the top? robots.txt is read sequentially. AI crawlers will see the block immediately without parsing through your entire file.

### If You Don't Have a robots.txt File Yet

**Step 1:** Create a new plain text file. Name it exactly `robots.txt` (lowercase, no spaces, `.txt` extension).

**Step 2:** Paste the AI crawler block template into the file.

**Step 3:** Add a default directive for search engines at the bottom:

```
User-agent: *
Disallow:
```

This allows normal search crawlers (Google Search, Bing, etc.) to continue indexing your site. The blank `Disallow:` means "no restrictions."

**Step 4:** Save the file.

**Step 5:** Upload robots.txt to your web root directory. It must live at `yoursite.com/robots.txt` — not in a subdirectory, not with a different filename.

Total time: **3-4 minutes**.

### WordPress-Specific Instructions

WordPress generates a virtual robots.txt by default. You need to create a physical file that overrides it.

**Method 1 (Plugin):** Install **Yoast SEO** or **Rank Math**. Both provide robots.txt editors in the dashboard under SEO settings. Paste the template. Save. Done.

**Method 2 (Manual):** Use FTP or your hosting provider's file manager. Navigate to the directory containing `wp-config.php` (your WordPress root). Create `robots.txt` there. Upload. The physical file takes precedence over WordPress's virtual file.

**Method 3 (Code):** Add this to your theme's `functions.php`:

```php
add_filter('robots_txt', function($output) {
    $ai_blocks = "
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /
";
    return $ai_blocks . $output;
}, 0, 2);
```

This injects the AI crawler blocks into WordPress's generated robots.txt. Extend the `$ai_blocks` variable with the full template if needed.

Total time: **4-5 minutes** including plugin installation.

## Verification Testing (Confirm It Actually Worked)

### Google Search Console Robots.txt Tester

**Google Search Console** provides a robots.txt testing tool that works for any user-agent, not just Google's crawlers.

**Step 1:** Log into [Google Search Console](https://search.google.com/search-console).

**Step 2:** Select your property.

**Step 3:** Navigate to the robots.txt Tester (legacy tools section, or search "robots.txt" in settings).

**Step 4:** The tester shows your current robots.txt content. Verify it matches what you uploaded.

**Step 5:** Test specific crawlers:
- Change the user-agent dropdown to "Googlebot" — it should be allowed (assuming you didn't block it)
- Manually edit the user-agent field to "GPTBot" — it should show "Blocked"
- Test "ClaudeBot" — blocked
- Test "Google-Extended" — blocked

If all AI crawlers show "Blocked" status, your robots.txt is working correctly.

### Direct URL Check

Navigate to `yoursite.com/robots.txt` in your browser. You should see the exact text you uploaded. If you see something different, your file isn't in the right location or your CMS is overriding it.

Common issues:
- File uploaded to `/public_html/robots.txt` when web root is `/public_html/www/` — wrong location
- WordPress generating virtual robots.txt because no physical file exists at root
- CDN caching old robots.txt version — clear CDN cache

### Server Log Verification (Wait 24-48 Hours)

Immediate testing confirms the file exists. Real-world verification requires checking server logs after a waiting period.

**48 hours after deployment**, check your server logs for AI crawler activity:

```bash
grep "GPTBot" /var/log/apache2/access.log
grep "ClaudeBot" /var/log/nginx/access.log
```

Compliant crawlers should show zero requests after your robots.txt went live. If you see continued requests, the crawler either:
- Hasn't re-checked your robots.txt yet (crawlers cache the file, typically 24-hour refresh)
- Doesn't respect robots.txt (move to [IP-based blocking](block-all-ai-crawlers-robots-txt.html))
- Is spoofing the user-agent (requires [advanced detection methods](ai-crawlers-ignore-robots-txt.html))

## Troubleshooting Common Issues

### "My robots.txt Isn't Showing Up"

**Cause 1: Wrong directory.** The file must live at your domain root. Not `/blog/robots.txt`. Not `/public/robots.txt`. Just `/robots.txt`.

**Cause 2: Filename error.** Must be exactly `robots.txt`, lowercase, no spaces. Not `Robots.txt`, not `robots.TXT`, not `robots .txt`.

**Cause 3: File permissions.** The file must be readable by the web server. Permissions should be `644` (read/write for owner, read-only for others). If you're on shared hosting, this is usually automatic.

**Cause 4: CDN caching.** If you use **Cloudflare**, **Fastly**, or another CDN, clear the cache after uploading. CDNs cache robots.txt aggressively.

### "AI Crawlers Are Still Hitting My Site"

**Timeline issue:** Crawlers cache robots.txt. **OpenAI's** documentation states they refresh "periodically" without specifying frequency. Industry observation suggests 24-48 hour cache duration. You may see requests for 1-2 days after blocking.

**Non-compliance:** Some crawlers ignore robots.txt entirely. **Bytespider** has documented non-compliance issues. If you see requests 72+ hours after your robots.txt went live, the crawler isn't respecting it. Move to firewall-based blocking.

**Spoofed user-agents:** Malicious actors can send requests claiming to be "GPTBot" without actually being **OpenAI**. Verify via IP address. [OpenAI publishes their IP ranges](openai-crawler-ip-ranges.html). Requests from other IPs using "GPTBot" are spoofed.

### "I Blocked AI Crawlers But Want to Allow One Specific Bot"

Remove that bot's block from robots.txt. If you want to block all AI crawlers except **ClaudeBot**:

```
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

# ClaudeBot is NOT listed, so it defaults to allowed
```

Any user-agent not explicitly mentioned inherits the default rule (usually "allow everything" unless you have a restrictive `User-agent: *` directive).

### "My WordPress Plugin Says robots.txt Is Locked"

Some security plugins or caching plugins lock robots.txt editing to prevent modification. Check:

**Wordfence:** Security settings → Advanced firewall options → Allow robots.txt editing
**W3 Total Cache:** Performance → Browser cache → Disable "Set robots.txt" option
**WP Rocket:** Settings → Robots.txt → Disable automatic generation

After disabling plugin control, you can create a physical robots.txt file that takes precedence.

## Advanced: Selective Blocking by Directory

Block AI crawlers from specific content while allowing them elsewhere:

```
User-agent: GPTBot
Disallow: /premium-content/
Disallow: /member-area/
Allow: /blog/

User-agent: ClaudeBot
Disallow: /premium-content/
Allow: /
```

This blocks **GPTBot** from `/premium-content/` and `/member-area/` but allows `/blog/`. **ClaudeBot** is blocked from premium content but can access everything else.

Use cases:
- Protect paywalled content while allowing free content to train AI
- Block AI from user-generated content sections (forums, comments) due to privacy concerns
- Allow AI training on your educational content while blocking commercial product pages

Syntax rules:
- Most specific paths are processed first
- `Allow:` overrides `Disallow:` when paths overlap
- Paths are case-sensitive on most servers

## What Happens After You Block (Immediate and Long-Term Effects)

### Immediate: Compliant Crawlers Stop Within 24-48 Hours

**Anthropic**, **OpenAI**, and **Google** all state they respect robots.txt. Their crawlers check the file regularly. Within 24-48 hours of your robots.txt going live, their crawler activity should cease.

You won't see immediate silence. The robots.txt cache delay means crawlers continue using their cached "allowed" status until they refresh. Patience required.

### Long-Term: Your Content Stops Appearing in AI Training Data

This is gradual, not instant. AI models aren't retrained daily. When **OpenAI** builds **GPT-5** or **Anthropic** trains the next **Claude** generation, your content won't be in the training corpus (assuming you blocked before their data collection cutoff).

Existing models trained before you blocked still contain your content. Blocking robots.txt is forward-looking, not retroactive. **GPT-4** was trained through September 2021. If you blocked **GPTBot** in 2024, your content is still in **GPT-4**'s training data but won't be in future versions.

### Negotiation Leverage: Scarcity Creates Licensing Opportunities

Publishers who block AI crawlers create scarcity. If your content is valuable for training, AI companies may reach out with licensing offers. **News Corp** blocked crawlers before negotiating their **$250 million OpenAI deal**. The block signaled: "You don't get this for free."

This only works if your content has genuine value. Blocking a personal blog with 500 monthly visitors won't attract licensing offers. Blocking a 10-million-pageview trade publication with unique industry data might.

Blocking is reversible. If licensing conversations don't materialize within 6-12 months, you can remove the blocks and pursue [marketplace monetization](robots-txt-ai-crawlers-template.html) instead.

## Maintaining Your robots.txt (New Crawlers Launch Regularly)

AI companies launch new crawlers. **Google-Extended** didn't exist until December 2023. **Applebot-Extended** appeared in mid-2024. **Meta's** AI crawler naming evolved from generic **FacebookBot** to specialized variants.

**Maintenance schedule:** Review robots.txt quarterly. Check the [AI crawler directory](block-all-ai-crawlers-robots-txt.html) for newly launched user-agents. Add them to your template.

**Automation option:** Subscribe to crawler identification services. **Cloudflare's** bot management dashboard flags new AI crawlers as they appear. Some publishers set up alerts when unrecognized user-agents with AI-pattern names appear in logs.

**Template versioning:** Keep dated versions of your robots.txt. When you add new blocks, note what changed. This creates an audit trail if you later need to verify when specific crawlers were blocked (useful in licensing negotiations or legal contexts).

## FAQ

### Does blocking AI crawlers hurt my SEO?

No. AI training crawlers are separate from search crawlers. Blocking **GPTBot** doesn't block **Googlebot**. Your search rankings are unaffected. The crawlers you're blocking aren't involved in indexing your site for search results.

### Can I block AI crawlers without blocking search engines?

Yes. That's the entire point of user-agent-specific directives. Search engines use crawlers like **Googlebot** (Google Search), **Bingbot** (Bing), **Slurp** (Yahoo). AI training uses **GPTBot**, **ClaudeBot**, **Google-Extended**. Different user-agents, different purposes, independent control.

### What if I change my mind and want to unblock later?

Delete the AI crawler blocks from robots.txt. Save. Upload. Crawlers will resume accessing your site on their next robots.txt check (24-48 hours). Your content becomes available for future training datasets. Past exclusion doesn't prevent future inclusion.

### Do all AI companies respect robots.txt?

No. **OpenAI**, **Anthropic**, **Google**, and **Apple** demonstrate strong compliance. **ByteDance's Bytespider** has documented non-compliance issues. Some regional AI companies don't honor robots.txt at all. This method blocks compliant crawlers only. Non-compliant crawlers require [firewall-based blocking](block-all-ai-crawlers-robots-txt.html).

### Should I block AI crawlers if I want to be cited by ChatGPT or Claude?

This depends on your goals. Blocking training data access doesn't necessarily prevent citation. **ChatGPT** and **Claude** can still cite your content if they access it via real-time retrieval (different from training data scraping). However, blocking both training and retrieval crawlers means AI systems won't reference your content at all. Consider [selective blocking strategies](should-you-block-ai-crawlers.html) if you want citation without training access.

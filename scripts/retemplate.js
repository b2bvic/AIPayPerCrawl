#!/usr/bin/env node

/**
 * AI Pay Per Crawl — Retemplate
 *
 * Re-wraps all HTML files in dist/articles/ with the current Protocol template.
 * Extracts <article> content, rebuilds with shared nav/footer/head.
 *
 * Run: node scripts/retemplate.js
 */

const fs = require('fs');
const path = require('path');
const { megaNavHtml, footerHtml, headIncludes, megaNavScript } = require('./shared');

const DIST_ARTICLES = path.join(__dirname, '..', 'dist', 'articles');

function escapeAttr(str) {
  var decoded = str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractFromHtml(html) {
  var titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  var title = titleMatch ? titleMatch[1].replace(/\s*\|.*$/, '').trim() : 'AI Pay Per Crawl';

  var descMatch = html.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/);
  var description = descMatch ? descMatch[1].trim() : '';

  var schemaBlocks = [];
  var schemaRegex = /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g;
  var match;
  while ((match = schemaRegex.exec(html)) !== null) {
    schemaBlocks.push(match[1].trim());
  }

  var articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  var articleContent = articleMatch ? articleMatch[1] : '';

  return { title: title, description: description, schemaBlocks: schemaBlocks, articleContent: articleContent };
}

function buildTemplate(title, description, schemaBlocks, articleContent, slug) {
  var safeTitle = escapeAttr(title);
  var safeDesc = escapeAttr(description);

  var schemaScripts = schemaBlocks.map(function(s) {
    return '    <script type="application/ld+json">\n    ' + s + '\n    </script>';
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} | AI Pay Per Crawl</title>
    <meta name="description" content="${safeDesc}">
    <meta name="author" content="Victor Valentine Romo">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://aipaypercrawl.com/articles/${slug}">
    <meta property="og:site_name" content="AI Pay Per Crawl">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">
    <link rel="canonical" href="https://aipaypercrawl.com/articles/${slug}">
${schemaScripts}
${headIncludes}
</head>
<body>

${megaNavHtml}

  <main class="pt-nav">
    <div class="container--narrow" style="padding-top: var(--sp-8);">
      <div class="breadcrumbs">
        <a href="/">Home</a><span class="breadcrumbs__sep">/</span>
        <a href="/articles.html">Articles</a><span class="breadcrumbs__sep">/</span>
        <span>${safeTitle}</span>
      </div>

      <article class="article-body">
        ${articleContent}
      </article>

      <div class="cta-box" style="margin: var(--sp-16) 0;">
        <h3>Your Content Feeds AI. Get Paid for It.</h3>
        <p>Complete pay-per-crawl implementation. Templates, pricing models, licensing contracts.</p>
        <a href="/setup.html" class="btn btn--primary btn--large">Master the Protocol &mdash; $2,497</a>
      </div>

      <div style="margin-top: var(--sp-8); padding-top: var(--sp-8); border-top: 1px solid var(--border);">
        <a href="/articles.html" style="font-family: var(--font-mono); font-size: 0.875rem; font-weight: 500; color: var(--accent);">&larr; All Articles</a>
      </div>
    </div>
  </main>

${footerHtml}

${megaNavScript}
</body>
</html>`;
}

function retemplate() {
  console.log('Retemplating articles...\n');

  if (!fs.existsSync(DIST_ARTICLES)) {
    console.log('No dist/articles/ directory found. Run build first.');
    return;
  }

  var files = fs.readdirSync(DIST_ARTICLES).filter(function(f) {
    return f.endsWith('.html');
  });

  var total = 0;
  var errors = [];

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var filePath = path.join(DIST_ARTICLES, file);
    var html = fs.readFileSync(filePath, 'utf8');
    var extracted = extractFromHtml(html);

    if (!extracted.articleContent) {
      errors.push(file + ': no <article> tag found');
      continue;
    }

    var slug = file.replace('.html', '');
    var newHtml = buildTemplate(extracted.title, extracted.description, extracted.schemaBlocks, extracted.articleContent, slug);
    fs.writeFileSync(filePath, newHtml);
    total++;
  }

  if (errors.length > 0) {
    console.log('Errors (' + errors.length + '):');
    errors.forEach(function(e) { console.log('  ' + e); });
  }

  console.log('\nRetemplated ' + total + ' articles.');
}

retemplate();

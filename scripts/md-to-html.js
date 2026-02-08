/**
 * AI Pay Per Crawl — Markdown to HTML processor.
 * Parses frontmatter, converts markdown via marked, wraps in Protocol template.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { megaNavHtml, footerHtml, headIncludes, megaNavScript, ENTITY_DOMAINS } = require('./shared');

const SKIP_FILES = ['README.md', '_brief.md', '_content-stack.md'];
const ARTICLES_DIR = path.join(__dirname, '..', 'Articles');
const DIST_DIR = path.join(__dirname, '..', 'dist', 'articles');

function parseFrontmatter(content) {
  const meta = {};
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { meta, body: content };

  const fmBlock = fmMatch[1];
  for (const line of fmBlock.split('\n')) {
    const match = line.match(/^(\w[\w_-]*)::?\s*(.+)$/);
    if (match) {
      meta[match[1].trim()] = match[2].trim();
    }
  }

  const body = content.slice(fmMatch[0].length).trim();
  return { meta, body };
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function calculateReadingTime(content) {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

function buildArticleHTML(title, description, body, slug, date, keywords) {
  const htmlBody = marked(body);
  const readingTime = calculateReadingTime(body);
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(description);

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "@id": "https://victorvalentineromo.com/#person",
      "name": "Victor Valentine Romo",
      "url": "https://victorvalentineromo.com"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://aipaypercrawl.com/#organization",
      "name": "AI Pay Per Crawl",
      "url": "https://aipaypercrawl.com"
    },
    "datePublished": date || "2026-01-19",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://aipaypercrawl.com/articles/${slug}`
    }
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aipaypercrawl.com" },
      { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://aipaypercrawl.com/articles.html" },
      { "@type": "ListItem", "position": 3, "name": title, "item": `https://aipaypercrawl.com/articles/${slug}` }
    ]
  }, null, 2);

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
    <script type="application/ld+json">
${articleSchema}
    </script>
    <script type="application/ld+json">
${breadcrumbSchema}
    </script>
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

      <header style="margin-bottom: var(--sp-12);">
        <span class="label" style="margin-bottom: var(--sp-4); display: block;">Article &middot; ${readingTime} min read</span>
        <h1>${safeTitle}</h1>
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-top: var(--sp-4); max-width: 640px;">${safeDesc}</p>
      </header>

      <article class="article-body">
        ${htmlBody}
      </article>

      <div class="cta-box" style="margin: var(--sp-16) 0;">
        <h3>Your Content Feeds AI. Get Paid for It.</h3>
        <p>Complete pay-per-crawl implementation. Templates, pricing models, licensing contracts. Everything.</p>
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

function processArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('No Articles directory found.');
    return [];
  }

  fs.mkdirSync(DIST_DIR, { recursive: true });

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md') && !SKIP_FILES.includes(f));
  const metadata = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    const slug = meta.slug || slugify(file);
    const title = meta.title || slug.replace(/-/g, ' ');
    const description = meta.description || meta.focus_keyword || '';
    const date = (meta.date || meta.created || '2026.01.19').replace(/\./g, '-');
    const keywords = meta.keywords || meta.focus_keyword || '';

    const html = buildArticleHTML(title, description, body, slug, date, keywords);
    fs.writeFileSync(path.join(DIST_DIR, `${slug}.html`), html);
    console.log(`  Built: articles/${slug}.html`);

    metadata.push({ slug, title, description, date, keywords });
  }

  return metadata;
}

module.exports = { processArticles };

if (require.main === module) {
  const articles = processArticles();
  console.log(`\nProcessed ${articles.length} articles.`);
}

#!/usr/bin/env node

/**
 * AI Pay Per Crawl — Generate articles hub + category index pages.
 *
 * Creates articles.html with all article cards grouped and numbered.
 * Run: node scripts/generate-indexes.js
 */

const fs = require('fs');
const path = require('path');
const { megaNavHtml, footerHtml, headIncludes, megaNavScript } = require('./shared');

const ROOT_DIR = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'Articles');
const SKIP_FILES = ['README.md', '_brief.md', '_content-stack.md'];

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

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md') && !SKIP_FILES.includes(f))
    .map(file => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
      const { meta } = parseFrontmatter(raw);
      const slug = meta.slug || slugify(file);
      const title = meta.title || slug.replace(/-/g, ' ');
      const description = meta.description || meta.focus_keyword || '';
      const date = (meta.date || meta.created || '2026.01.19').replace(/\./g, '-');
      return { slug, title, description, date };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function generateHubPage(articles) {
  const cards = articles.map((a, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `
        <a href="/articles/${a.slug}.html" class="card card--article">
          <div class="card__number">${num}</div>
          <h3 class="card__title">${escapeHtml(a.title)}</h3>
          <p class="card__desc">${escapeHtml(a.description)}</p>
          <span class="card__arrow">Read article &rarr;</span>
        </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articles | AI Pay Per Crawl</title>
    <meta name="description" content="Implementation guides, pricing models, crawler analysis, and licensing infrastructure for AI pay-per-crawl monetization.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://aipaypercrawl.com/articles.html">
    <meta property="og:title" content="Articles | AI Pay Per Crawl">
    <meta property="og:description" content="Implementation guides, pricing models, crawler analysis, and licensing infrastructure.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://aipaypercrawl.com/articles.html">
    <meta property="og:site_name" content="AI Pay Per Crawl">
${headIncludes}
</head>
<body>

${megaNavHtml}

  <main class="pt-nav">
    <div class="section" style="background: var(--surface-alt); padding-top: var(--sp-16);">
      <div class="container">
        <span class="label">Reference</span>
        <h1 style="margin-top: var(--sp-4);">Articles</h1>
        <p style="font-size: 1.125rem; max-width: 600px; margin-top: var(--sp-4);">
          ${articles.length} guides on AI crawler monetization, pay-per-crawl implementation, and content licensing infrastructure.
        </p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="grid grid--2">
${cards}
        </div>
      </div>
    </div>
  </main>

${footerHtml}

${megaNavScript}
</body>
</html>`;
}

function main() {
  console.log('Generating index pages...\n');

  const articles = getArticles();
  const hubHtml = generateHubPage(articles);
  fs.writeFileSync(path.join(ROOT_DIR, 'articles.html'), hubHtml);
  console.log(`  articles.html (${articles.length} articles)`);

  console.log('\nDone.');
}

main();

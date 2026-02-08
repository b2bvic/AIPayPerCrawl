#!/usr/bin/env node

/**
 * AI Pay Per Crawl — Build Script
 *
 * Processes Articles/*.md into dist/, copies root pages, generates sitemap.
 * Pure CSS build (no Tailwind). "The Protocol" design system.
 */

const fs = require('fs');
const path = require('path');
const { processArticles } = require('./md-to-html');
const { megaNavHtml, footerHtml, headIncludes, megaNavScript, ENTITY_DOMAINS } = require('./shared');

const ROOT_DIR = path.join(__dirname, '..');
const DIST = path.join(ROOT_DIR, 'dist');

// Root-level files to copy to dist
const ROOT_FILES = [
  'index.html',
  'setup.html',
  'articles.html',
  'robots.txt',
  'base.css',
  'netlify.toml'
];

// ── Clean dist ────────────────────────────────────────────────────
function clean() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
  console.log('Cleaned dist/');
}

// ── Copy root files ───────────────────────────────────────────────
function copyRootFiles() {
  let copied = 0;
  for (const file of ROOT_FILES) {
    const src = path.join(ROOT_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, file));
      console.log(`  ${file}`);
      copied++;
    } else {
      console.log(`  ${file} (not found, skipping)`);
    }
  }
  return copied;
}

// ── Build article cards for index ─────────────────────────────────
function buildArticleCards(articles) {
  return articles.map((a, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `
          <a href="/articles/${a.slug}.html" class="card card--article">
            <div class="card__number">${num}</div>
            <h3 class="card__title">${a.title}</h3>
            <p class="card__desc">${a.description}</p>
            <span class="card__arrow">Read article &rarr;</span>
          </a>`;
  }).join('\n');
}

// ── Build articles hub ────────────────────────────────────────────
function buildArticlesHub(articles) {
  const cards = buildArticleCards(articles);

  const html = `<!DOCTYPE html>
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
    <div class="section" style="background: var(--surface-alt); padding-top: calc(var(--sp-16));">
      <div class="container">
        <span class="label">Reference</span>
        <h1 style="margin-top: var(--sp-4);">Articles</h1>
        <p style="font-size: 1.125rem; max-width: 600px; margin-top: var(--sp-4);">
          Implementation guides, pricing models, crawler analysis, and licensing infrastructure. Technical depth. Zero fluff.
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

  fs.writeFileSync(path.join(DIST, 'articles.html'), html);
  console.log('Built: articles.html');
}

// ── 404 page ──────────────────────────────────────────────────────
function build404() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 &mdash; Page Not Found | AI Pay Per Crawl</title>
    <meta name="robots" content="noindex">
${headIncludes}
</head>
<body>

${megaNavHtml}

  <main class="pt-nav" style="text-align: center; padding: var(--sp-24) var(--sp-6);">
    <div style="font-family: var(--font-display); font-size: 6rem; font-weight: 700; color: var(--accent); line-height: 1;">404</div>
    <p style="font-size: 1.25rem; color: var(--text-secondary); margin: var(--sp-4) 0 var(--sp-8);">This endpoint returned nothing. Crawlers can't find it either.</p>
    <a href="/" class="btn btn--primary">Back to Home</a>
  </main>

${footerHtml}

${megaNavScript}
</body>
</html>`;

  fs.writeFileSync(path.join(DIST, '404.html'), html);
  console.log('Built: 404.html');
}

// ── Sitemap ───────────────────────────────────────────────────────
function buildSitemap(articles) {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aipaypercrawl.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://aipaypercrawl.com/setup.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://aipaypercrawl.com/articles.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  for (const a of articles) {
    xml += `
  <url>
    <loc>https://aipaypercrawl.com/articles/${a.slug}.html</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  console.log('Built: sitemap.xml');
}

// ── Robots.txt ────────────────────────────────────────────────────
function buildRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: https://aipaypercrawl.com/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), content);
  console.log('Built: robots.txt');
}

// ── Main ──────────────────────────────────────────────────────────
function main() {
  console.log('Building aipaypercrawl.com...\n');

  clean();

  // Copy root files
  console.log('\nRoot files:');
  const rootCount = copyRootFiles();

  // Process markdown articles
  console.log('\nProcessing articles...');
  const articles = processArticles();
  console.log(`${articles.length} articles processed.\n`);

  // Generate hub + utility pages
  buildArticlesHub(articles);
  build404();
  buildSitemap(articles);
  buildRobots();

  const total = rootCount + articles.length + 3;
  console.log(`\nBuild complete. ${total} files in dist/`);
}

main();

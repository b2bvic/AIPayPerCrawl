#!/usr/bin/env node

/**
 * AI Pay Per Crawl — Sitemap Generator
 *
 * Scans dist/ for all HTML files, generates sitemap.xml with priority scoring.
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseUrl: 'https://aipaypercrawl.com',
  distDir: path.resolve(__dirname, '..', 'dist'),
  outputFile: path.resolve(__dirname, '..', 'dist', 'sitemap.xml'),

  excludeFiles: ['404.html'],

  priorities: {
    'index.html': { priority: 1.0, changefreq: 'weekly' },
    'setup.html': { priority: 0.9, changefreq: 'monthly' },
    'articles.html': { priority: 0.9, changefreq: 'weekly' },
    'articles/': { priority: 0.8, changefreq: 'monthly' },
    'default': { priority: 0.5, changefreq: 'monthly' }
  }
};

function getHtmlFiles(dir, fileList) {
  fileList = fileList || [];
  if (!fs.existsSync(dir)) return fileList;

  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    var filePath = path.join(dir, file);
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') && !CONFIG.excludeFiles.includes(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function getPriorityConfig(filePath) {
  var relativePath = path.relative(CONFIG.distDir, filePath);
  var fileName = path.basename(filePath);

  if (CONFIG.priorities[fileName]) {
    return CONFIG.priorities[fileName];
  }

  for (var key in CONFIG.priorities) {
    if (key !== 'default' && relativePath.startsWith(key)) {
      return CONFIG.priorities[key];
    }
  }

  return CONFIG.priorities.default;
}

function filePathToUrl(filePath) {
  var relativePath = path.relative(CONFIG.distDir, filePath);
  var url = relativePath.replace('.html', '');
  if (url === 'index') url = '';
  return CONFIG.baseUrl + '/' + url;
}

function getLastMod(filePath) {
  var stat = fs.statSync(filePath);
  return stat.mtime.toISOString().split('T')[0];
}

function generateSitemap() {
  console.log('Generating sitemap...\n');

  var htmlFiles = getHtmlFiles(CONFIG.distDir);

  htmlFiles.sort(function(a, b) {
    var pA = getPriorityConfig(a).priority;
    var pB = getPriorityConfig(b).priority;
    if (pA !== pB) return pB - pA;
    return a.localeCompare(b);
  });

  var urlEntries = htmlFiles.map(function(filePath) {
    var url = filePathToUrl(filePath);
    var lastmod = getLastMod(filePath);
    var config = getPriorityConfig(filePath);

    return '  <url>\n' +
      '    <loc>' + url + '</loc>\n' +
      '    <lastmod>' + lastmod + '</lastmod>\n' +
      '    <changefreq>' + config.changefreq + '</changefreq>\n' +
      '    <priority>' + config.priority.toFixed(1) + '</priority>\n' +
      '  </url>';
  }).join('\n');

  var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urlEntries + '\n' +
    '</urlset>\n';

  fs.writeFileSync(CONFIG.outputFile, sitemap);
  console.log('Generated: ' + CONFIG.outputFile);
  console.log('Total: ' + htmlFiles.length + ' URLs\n');
}

generateSitemap();

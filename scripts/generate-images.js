// generate-images.js — Build branded article header images (1200x675, 16:9)
// Design: dark gradient, indigo accents, tight layout — AI Pay Per Crawl brand
// Uses satori (HTML-like → SVG) + @resvg/resvg-js (SVG → PNG)

const fs = require('fs');
const path = require('path');
const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');

const ARTICLES_DIR = path.join(__dirname, '..', 'Articles');
const IMAGES_DIR = path.join(__dirname, '..', 'dist', 'images', 'articles');
const FONTS_DIR = path.join(__dirname, '..', 'fonts');
const SKIP_FILES = ['README.md', '_brief.md', '_content-stack.md'];

const B = {
  indigo: '#4f46e5',
  emerald: '#10b981',
  dark1: '#0a0a1a',
  dark2: '#111127',
  dark3: '#08081a',
  muted: '#9ca3af',
};

const displayBold = fs.readFileSync(path.join(FONTS_DIR, 'JetBrainsMono-Bold.ttf'));
const displaySemiBold = fs.readFileSync(path.join(FONTS_DIR, 'JetBrainsMono-SemiBold.ttf'));
const bodyMedium = fs.readFileSync(path.join(FONTS_DIR, 'IBMPlexSans-Medium.ttf'));
const bodyRegular = fs.readFileSync(path.join(FONTS_DIR, 'IBMPlexSans-Regular.ttf'));

function parseFrontmatter(content) {
  const meta = {};
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { meta, body: content };
  for (const line of fmMatch[1].split('\n')) {
    const match = line.match(/^(\w[\w_-]*)\s*::?\s*"?([^"]*)"?\s*$/);
    if (match && match[2].trim()) {
      meta[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body: content.slice(fmMatch[0].length).trim() };
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

function categoryMeta(category) {
  const cat = (category || '').toLowerCase();
  const map = {
    'implementation': { color: B.indigo,  label: 'Implementation' },
    'economics':      { color: '#10b981', label: 'Economics' },
    'intelligence':   { color: '#f59e0b', label: 'Intelligence' },
    'models':         { color: '#ec4899', label: 'Models' },
    'pricing':        { color: '#06b6d4', label: 'Pricing' },
  };
  for (const [key, val] of Object.entries(map)) {
    if (cat.includes(key)) return val;
  }
  return { color: B.indigo, label: category || 'Protocol' };
}

function buildImageTree(title, category) {
  const cm = categoryMeta(category);
  const fontSize = title.length > 70 ? 50 : title.length > 55 ? 56 : title.length > 40 ? 64 : 72;

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(145deg, ${B.dark1} 0%, ${B.dark2} 35%, ${B.dark3} 100%)`,
        fontFamily: 'JetBrainsMono',
        position: 'relative',
      },
      children: [
        // Indigo gradient strip at top
        {
          type: 'div',
          props: {
            style: {
              width: '100%',
              height: '4px',
              background: `linear-gradient(90deg, ${B.indigo} 0%, ${B.emerald} 40%, ${cm.color} 100%)`,
            },
          },
        },

        // Top bar: logo + nav hints
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 50px 0 50px',
            },
            children: [
              // Logo
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '10px' },
                  children: [
                    // APC square
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '32px', height: '32px', background: B.indigo,
                          borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        },
                        children: [{ type: 'div', props: { style: { fontSize: '10px', fontWeight: 700, color: '#fff' }, children: 'APC' } }],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', fontSize: '16px', fontWeight: 700 },
                        children: [
                          { type: 'div', props: { style: { color: '#ffffff' }, children: 'AI' } },
                          { type: 'div', props: { style: { color: B.indigo }, children: 'PayPerCrawl' } },
                        ],
                      },
                    },
                  ],
                },
              },
              // Nav hints
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: '20px', fontFamily: 'IBMPlexSans' },
                  children: ['Implementation', 'Economics', 'Intelligence', 'Models'].map(label => ({
                    type: 'div',
                    props: { style: { fontSize: '12px', fontWeight: 500, color: '#6b7280' }, children: label },
                  })),
                },
              },
            ],
          },
        },

        // Main content — vertically centered
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              padding: '0 50px',
              gap: '16px',
            },
            children: [
              // Category pill
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center' },
                  children: [{
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: `${cm.color}18`, padding: '5px 14px', borderRadius: '999px',
                      },
                      children: [
                        { type: 'div', props: { style: { width: '7px', height: '7px', background: cm.color, borderRadius: '999px' } } },
                        { type: 'div', props: { style: { fontSize: '12px', fontWeight: 600, color: cm.color, fontFamily: 'JetBrainsMono', letterSpacing: '0.03em' }, children: cm.label } },
                      ],
                    },
                  }],
                },
              },
              // Title
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: `${fontSize}px`, fontWeight: 700, color: '#ffffff',
                    lineHeight: 1.15, maxWidth: '950px', letterSpacing: '-0.02em',
                  },
                  children: title,
                },
              },
              // Accent line
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '0px', maxWidth: '400px' },
                  children: [
                    { type: 'div', props: { style: { width: '60px', height: '3px', background: cm.color, borderRadius: '2px' } } },
                    { type: 'div', props: { style: { flex: 1, height: '1px', background: '#374151' } } },
                  ],
                },
              },
            ],
          },
        },

        // Bottom bar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 50px', borderTop: '1px solid #1f2937',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: '14px', fontWeight: 600, color: '#6b7280', fontFamily: 'JetBrainsMono' },
                  children: 'The economics of AI crawling your content.',
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '16px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '12px', color: '#4b5563', fontFamily: 'IBMPlexSans' }, children: 'aipaypercrawl.com' } },
                    {
                      type: 'div',
                      props: {
                        style: {
                          background: B.indigo, color: '#fff', fontSize: '11px', fontWeight: 600,
                          padding: '6px 14px', borderRadius: '6px', fontFamily: 'JetBrainsMono',
                        },
                        children: 'Read Protocol',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generateImage(title, category, slug) {
  const tree = buildImageTree(title, category);
  const svg = await satori(tree, {
    width: 1200, height: 675,
    fonts: [
      { name: 'JetBrainsMono', data: displayBold, weight: 700, style: 'normal' },
      { name: 'JetBrainsMono', data: displaySemiBold, weight: 600, style: 'normal' },
      { name: 'IBMPlexSans', data: bodyMedium, weight: 500, style: 'normal' },
      { name: 'IBMPlexSans', data: bodyRegular, weight: 400, style: 'normal' },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const outPath = path.join(IMAGES_DIR, `${slug}.png`);
  fs.writeFileSync(outPath, resvg.render().asPng());
  return outPath;
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) { console.log('No Articles directory found.'); return; }
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md') && !SKIP_FILES.includes(f));
  console.log(`Generating ${files.length} article header images...`);
  let generated = 0, skipped = 0;
  for (const file of files) {
    const slug = slugify(file);
    const outPath = path.join(IMAGES_DIR, `${slug}.png`);
    if (fs.existsSync(outPath) && !process.argv.includes('--force')) { skipped++; continue; }
    const { meta } = parseFrontmatter(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8'));
    try {
      await generateImage(meta.title || slug.replace(/-/g, ' '), meta.category || '', slug);
      generated++;
      if (generated % 25 === 0) console.log(`  ${generated} generated...`);
    } catch (err) { console.error(`  FAIL: ${slug} — ${err.message}`); }
  }
  console.log(`Done. ${generated} generated, ${skipped} skipped.`);
}

main().catch(console.error);

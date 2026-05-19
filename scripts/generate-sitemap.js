const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SITE_URL = 'https://cook-note.pages.dev';
const SITE_URL = String(process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  }[char]));
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'recipes.js'), 'utf8'), context, {
    filename: path.join(ROOT, 'recipes.js')
  });
  return context.window.RECIPES || {};
}

function recipeUrl(id) {
  return `${SITE_URL}/recette/${encodeURIComponent(id)}`;
}

const recipes = loadRecipes();
const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/techniques`,
  ...Object.keys(recipes)
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
    .map(recipeUrl)
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(url => [
    '  <url>',
    `    <loc>${escapeXml(url)}</loc>`,
    '  </url>'
  ].join('\n')),
  '</urlset>',
  ''
].join('\n');

const robots = [
  'User-agent: *',
  'Disallow: /admin',
  'Disallow: /api/',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  ''
].join('\n');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');
console.log(`Sitemap genere pour ${urls.length} URL(s).`);

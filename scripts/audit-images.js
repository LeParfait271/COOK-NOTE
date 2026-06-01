const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports');
const JSON_REPORT = path.join(REPORT_DIR, 'image-audit.json');
const MD_REPORT = path.join(REPORT_DIR, 'image-audit.md');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  return context.window.RECIPES || {};
}

function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += 2 + length;
  }
  return null;
}

function imageInfo(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) return { exists: false };
  const buffer = fs.readFileSync(absolutePath);
  return {
    exists: true,
    bytes: buffer.length,
    hash: crypto.createHash('sha1').update(buffer).digest('hex'),
    size: jpegSize(buffer)
  };
}

function cardPathFromOptimized(image) {
  return image
    .replace(/^\/assets\/recipe-images-optimized\//, 'assets/recipe-card-images/')
    .replace(/\?.*$/, '')
    .replace(/\.(?:png|jpe?g|webp)$/i, '.jpg');
}

function optimizedPath(image) {
  return image.replace(/^\/+/, '').replace(/\?.*$/, '');
}

function scoreImage(recipe, optimized, card) {
  const issues = [];
  let score = 100;
  if (!optimized.exists) {
    return { score: 0, issues: ['Image optimisee introuvable'] };
  }
  if (!card.exists) {
    score -= 35;
    issues.push('Miniature carte introuvable');
  }
  if (optimized.size) {
    const { width, height } = optimized.size;
    const ratio = width / height;
    if (width < 900 || height < 600) {
      score -= 18;
      issues.push(`Image optimisee petite (${width}x${height})`);
    }
    if (ratio < 1 || ratio > 1.9) {
      score -= 10;
      issues.push(`Cadrage atypique (${ratio.toFixed(2)})`);
    }
  } else {
    score -= 12;
    issues.push('Dimensions JPEG illisibles');
  }
  if (optimized.bytes < 100000 && !/maitre|parent/i.test(recipe.id)) {
    score -= 16;
    issues.push(`Image optimisee tres legere (${Math.round(optimized.bytes / 1024)} Ko)`);
  }
  if (card.exists) {
    if (card.size && (card.size.width < 480 || card.size.height < 320)) {
      score -= 12;
      issues.push(`Miniature petite (${card.size.width}x${card.size.height})`);
    }
    if (card.bytes < 18000) {
      score -= 8;
      issues.push(`Miniature tres legere (${Math.round(card.bytes / 1024)} Ko)`);
    }
  }
  return { score: Math.max(0, score), issues };
}

function run() {
  const recipes = loadRecipes();
  const rows = [];
  const hashes = new Map();
  Object.entries(recipes).forEach(([id, recipe]) => {
    if (!recipe.image || !recipe.image.startsWith('/assets/recipe-images-optimized/')) return;
    const optimizedRelative = optimizedPath(recipe.image);
    const cardRelative = cardPathFromOptimized(recipe.image);
    const optimized = imageInfo(optimizedRelative);
    const card = imageInfo(cardRelative);
    const result = scoreImage({ id, ...recipe }, optimized, card);
    if (optimized.exists) {
      if (!hashes.has(optimized.hash)) hashes.set(optimized.hash, []);
      hashes.get(optimized.hash).push(id);
    }
    rows.push({
      id,
      title: recipe.title,
      score: result.score,
      issues: result.issues,
      optimized: optimizedRelative,
      card: cardRelative,
      optimizedSize: optimized.size,
      optimizedBytes: optimized.bytes || 0,
      cardSize: card.size,
      cardBytes: card.bytes || 0
    });
  });

  hashes.forEach(ids => {
    if (ids.length < 2) return;
    ids.forEach(id => {
      const row = rows.find(item => item.id === id);
      if (!row) return;
      row.score = Math.max(0, row.score - 20);
      row.issues.push(`Image identique partagee avec ${ids.filter(item => item !== id).join(', ')}`);
    });
  });

  rows.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
  const weak = rows.filter(row => row.score < 82);
  const report = {
    generatedAt: new Date().toISOString(),
    total: rows.length,
    weakCount: weak.length,
    rows
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MD_REPORT, [
    '# Audit images Cook Note',
    '',
    `Genere le ${report.generatedAt}.`,
    '',
    `- Images recette auditees : ${report.total}`,
    `- Images a revoir : ${report.weakCount}`,
    '',
    '## Priorite',
    '',
    ...(weak.slice(0, 20).length
      ? weak.slice(0, 20).map(row => [
        `- ${row.title} (${row.id}) : ${row.score}/100`,
        ...row.issues.map(issue => `  - ${issue}`)
      ].join('\n'))
      : ['Aucune image faible detectee.']),
    '',
    '## Top 10 a inspecter visuellement',
    '',
    ...rows.slice(0, 10).map(row => `- ${row.title} (${row.id}) : ${row.score}/100 - ${row.optimized}`)
  ].join('\n'));
  console.log(`Audit images OK: ${rows.length} images, ${weak.length} a revoir.`);
}

run();

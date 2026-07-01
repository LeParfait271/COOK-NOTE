const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '127.0.0.1';
const SITE_URL = String(process.env.SITE_URL || `http://${HOST}:${PORT}`).replace(/\/+$/, '');
const SESSION_COOKIE = 'cook_note_session';
const MAX_JSON_BYTES = 2 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const LOGIN_WINDOW_MS = 1000 * 60 * 15;
const LOGIN_MAX_FAILURES = 8;
const VALID_IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const sessions = new Map();
const loginFailures = new Map();
const PUBLIC_ROOT_FILES = new Set([
  'index.html',
  'recipe.html',
  'manifest.json',
  'style.css',
  'app.js',
  'app-images.js',
  'recipes.js',
  'recipe.js',
  'service-worker.js'
]);
const ADMIN_PUBLIC_FILES = new Set(['admin-login.html', 'admin.css']);
const EDITABLE_RECIPE_FIELDS = new Set([
  'title',
  'categories',
  'seasons',
  'difficulty',
  'yield',
  'ingredients',
  'steps',
  'notes',
  'technical',
  'image',
  'video',
  'tags',
  'master',
  'variants',
  'masterType'
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "font-src 'self' data:"
].join('; ');
const SECURITY_HEADERS = {
  'content-security-policy': CONTENT_SECURITY_POLICY,
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()',
  'cross-origin-opener-policy': 'same-origin'
};

const ADMIN_PASSWORD = loadAdminPassword();

function loadAdminPassword() {
  if (process.env.COOK_NOTE_ADMIN_PASSWORD) return process.env.COOK_NOTE_ADMIN_PASSWORD;
  if (process.env.MC_FOOD_ADMIN_PASSWORD) return process.env.MC_FOOD_ADMIN_PASSWORD;
  const localPath = path.join(ROOT, 'admin.local.json');
  if (fs.existsSync(localPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      if (config.password) return String(config.password);
    } catch (error) {
      console.warn('[admin] admin.local.json invalide:', error.message);
    }
  }
  console.warn('[admin] Aucun mot de passe configure. Admin desactive.');
  return null;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

function sendJson(res, status, payload, headers = {}) {
  send(res, status, JSON.stringify(payload), {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  });
}

function parseCookies(req) {
  const cookies = {};
  String(req.headers.cookie || '').split(';').forEach(part => {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawKey) return;
    cookies[rawKey] = decodeURIComponent(rawValue.join('=') || '');
  });
  return cookies;
}

function isTrustedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    return originUrl.host.toLowerCase() === String(req.headers.host || '').toLowerCase();
  } catch {
    return false;
  }
}

function requireTrustedOrigin(req, res) {
  if (isTrustedOrigin(req)) return true;
  sendJson(res, 403, { error: 'Origine non autorisee' });
  return false;
}

function isAuthed(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  const session = token && sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return false;
  }
  session.lastSeenAt = Date.now();
  return true;
}

function passwordMatches(candidate, expected) {
  const candidateHash = crypto.createHash('sha256').update(String(candidate || '')).digest();
  const expectedHash = crypto.createHash('sha256').update(String(expected || '')).digest();
  return crypto.timingSafeEqual(candidateHash, expectedHash);
}

function clientAddress(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket.remoteAddress || 'local';
}

function loginFailureState(req) {
  const key = clientAddress(req);
  const now = Date.now();
  const state = loginFailures.get(key);
  if (!state || now - state.firstAttemptAt > LOGIN_WINDOW_MS) {
    return { key, count: 0, firstAttemptAt: now };
  }
  return { key, ...state };
}

function loginRetryAfterSeconds(req) {
  const state = loginFailureState(req);
  return Math.max(1, Math.ceil((LOGIN_WINDOW_MS - (Date.now() - state.firstAttemptAt)) / 1000));
}

function isLoginRateLimited(req) {
  return loginFailureState(req).count >= LOGIN_MAX_FAILURES;
}

function recordLoginFailure(req) {
  const state = loginFailureState(req);
  loginFailures.set(state.key, {
    count: state.count + 1,
    firstAttemptAt: state.firstAttemptAt
  });
}

function clearLoginFailures(req) {
  loginFailures.delete(clientAddress(req));
}

function requireAdmin(req, res) {
  if (isAuthed(req)) return true;
  if (req.url.startsWith('/api/')) {
    sendJson(res, 401, { error: 'Authentification requise' });
  } else {
    send(res, 302, '', { location: '/admin-login.html' });
  }
  return false;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('Payload trop volumineux'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const body = await readBody(req, MAX_JSON_BYTES);
  if (!body.length) return {};
  return JSON.parse(body.toString('utf8'));
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const normalized = clean.split(/[\\/]+/).filter(Boolean).join('/');
  const [firstPart] = normalized.split('/');

  if (
    !PUBLIC_ROOT_FILES.has(normalized) &&
    !ADMIN_PUBLIC_FILES.has(normalized) &&
    firstPart !== 'assets'
  ) {
    return null;
  }
  if (normalized.split('/').some(part => part.startsWith('.'))) return null;

  const filePath = path.resolve(ROOT, clean);
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return filePath;
}

function prerenderedRecipePath(urlPath) {
  const match = urlPath.match(/^\/recette\/([^/]+)\/?$/);
  if (!match) return null;
  const id = decodeURIComponent(match[1]);
  if (!/^[a-z0-9_-]+$/.test(id)) return null;
  const filePath = path.join(ROOT, 'dist', 'recette', id, 'index.html');
  return fs.existsSync(filePath) ? filePath : null;
}

function serveFile(req, res, filePath, noStore = false) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    const headers = {
      'content-type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    };
    headers['cache-control'] = staticCacheControl(filePath, noStore);
    send(res, 200, data, headers);
  });
}

function staticCacheControl(filePath, noStore = false) {
  if (noStore) return 'no-store';
  const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');

  if (relative === 'service-worker.js') return 'no-cache';
  if (relative === 'index.html' || relative === 'recipe.html') return 'no-cache';
  if (
    relative === 'app.js' ||
    relative === 'app-images.js' ||
    relative === 'style.css' ||
    relative === 'recipe.js' ||
    relative === 'recipes.js' ||
    relative === 'manifest.json' ||
    /^assets\/catalog-\d+\.js$/.test(relative) ||
    relative === 'assets/image-manifest.js'
  ) {
    return 'public, max-age=300, must-revalidate';
  }
  if (relative.startsWith('assets/')) return 'public, max-age=31536000, immutable';
  return 'no-cache';
}

function readRecipes() {
  const recipesPath = path.join(ROOT, 'recipes.js');
  const code = fs.readFileSync(recipesPath, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: recipesPath });
  if (!context.window.RECIPES || typeof context.window.RECIPES !== 'object') {
    throw new Error('window.RECIPES est introuvable');
  }
  return context.window.RECIPES;
}

function backupRecipes() {
  const backupDir = path.join(ROOT, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(path.join(ROOT, 'recipes.js'), path.join(backupDir, `recipes-${stamp}.js`));
}

function writeRecipes(recipes) {
  backupRecipes();
  const header = [
    '// ============================================================',
    '//  Cook Note - recipes.js',
    '//  Genere par le back-office Cook Note. Modifier via /admin.',
    '// ============================================================',
    '',
    `window.RECIPES = ${JSON.stringify(recipes, null, 2)};`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, 'recipes.js'), header, 'utf8');
}

function sanitizeId(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function normalizeRecipe(recipe) {
  return {
    title: String(recipe.title || '').trim(),
    categories: Array.isArray(recipe.categories) ? recipe.categories.map(String).filter(Boolean) : [],
    seasons: Array.isArray(recipe.seasons) ? recipe.seasons.map(String).filter(Boolean) : [],
    difficulty: String(recipe.difficulty || ''),
    ...(recipe.yield ? { yield: String(recipe.yield).trim() } : {}),
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map(group => ({
          group: String(group.group || '').trim() || 'Base',
          items: Array.isArray(group.items) ? group.items.map(String).map(s => s.trim()).filter(Boolean) : []
        })).filter(group => group.items.length)
      : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps.map(String).map(s => s.trim()).filter(Boolean) : [],
    ...(Array.isArray(recipe.notes) && recipe.notes.length ? { notes: recipe.notes.map(String).map(s => s.trim()).filter(Boolean) } : {}),
    ...(Array.isArray(recipe.technical) && recipe.technical.length ? {
      technical: recipe.technical
        .map(item => ({
          label: String(item.label || item.title || '').trim() || 'Point cle',
          value: String(item.value || item.text || '').trim()
        }))
        .filter(item => item.value)
    } : {}),
    ...(recipe.image ? { image: String(recipe.image).trim() } : {}),
    ...(recipe.video ? { video: String(recipe.video).trim() } : {}),
    ...(Array.isArray(recipe.tags) && recipe.tags.length ? { tags: recipe.tags.map(String).map(s => s.trim()).filter(Boolean) } : {}),
    ...(recipe.master ? { master: sanitizeId(recipe.master) } : {}),
    ...(Array.isArray(recipe.variants) && recipe.variants.length ? {
      variants: recipe.variants
        .map(variant => ({
          id: sanitizeId(variant.id),
          ...(variant.label ? { label: String(variant.label).trim() } : {})
        }))
        .filter(variant => variant.id)
    } : {}),
    ...(recipe.masterType ? { masterType: String(recipe.masterType).trim() } : {})
  };
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, char => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  }[char]));
}

function recipeUrl(id) {
  return `${SITE_URL}/recette/${encodeURIComponent(id)}`;
}

function sendRobots(res) {
  send(res, 200, [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /api/',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    ''
  ].join('\n'), {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'public, max-age=3600'
  });
}

function sendSitemap(res) {
  const recipes = readRecipes();
  const recipeEntries = Object.entries(recipes)
    .filter(([, recipe]) => !(Array.isArray(recipe.variants) && recipe.variants.length))
    .map(([id]) => `  <url><loc>${escapeXml(recipeUrl(id))}</loc></url>`);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${escapeXml(`${SITE_URL}/`)}</loc></url>`,
    ...recipeEntries,
    '</urlset>',
    ''
  ].join('\n');
  send(res, 200, body, {
    'content-type': 'application/xml; charset=utf-8',
    'cache-control': 'public, max-age=3600'
  });
}

function recipeForAdminSave(inputRecipe, existingRecipe = null) {
  const recipe = normalizeRecipe(inputRecipe || {});
  if (!existingRecipe) return recipe;

  for (const [key, value] of Object.entries(existingRecipe)) {
    if (!EDITABLE_RECIPE_FIELDS.has(key)) {
      recipe[key] = value;
    }
  }

  return recipe;
}

function validateRecipe(id, recipe, recipes, mode) {
  const errors = [];
  if (!id || !/^[a-z0-9_-]+$/.test(id)) errors.push('Slug invalide. Utiliser lettres minuscules, chiffres, tirets ou underscores.');
  if (mode === 'create' && recipes[id]) errors.push('Slug deja utilise.');
  if (!recipe.title) errors.push('Titre requis.');
  if (!recipe.categories.length) errors.push('Au moins une categorie requise.');
  if (!recipe.seasons.length) errors.push('Au moins une saison requise.');
  if (!['easy', 'medium', 'hard'].includes(recipe.difficulty)) errors.push('Difficulte invalide.');
  if (!recipe.ingredients.length) errors.push('Au moins un groupe d\'ingredients avec items requis.');
  if (!recipe.steps.length) errors.push('Au moins une etape requise.');
  return errors;
}

function parseMultipart(buffer, boundary) {
  const marker = `--${boundary}`;
  return buffer.toString('binary')
    .split(marker)
    .slice(1, -1)
    .map(rawPart => {
      const part = rawPart.replace(/^\r\n/, '').replace(/\r\n$/, '');
      const separator = part.indexOf('\r\n\r\n');
      if (separator === -1) return null;
      const headerText = part.slice(0, separator);
      const body = part.slice(separator + 4);
      const disposition = /content-disposition:\s*form-data;([^\r\n]+)/i.exec(headerText)?.[1] || '';
      const name = /name="([^"]+)"/.exec(disposition)?.[1] || '';
      const filename = /filename="([^"]*)"/.exec(disposition)?.[1] || '';
      const type = /content-type:\s*([^\r\n]+)/i.exec(headerText)?.[1] || 'application/octet-stream';
      return { name, filename, type, data: Buffer.from(body, 'binary') };
    })
    .filter(Boolean);
}

function startsWithBytes(buffer, bytes) {
  return buffer.length >= bytes.length && bytes.every((byte, index) => buffer[index] === byte);
}

function asciiAt(buffer, start, length) {
  return buffer.subarray(start, start + length).toString('ascii');
}

function isAllowedImagePayload(ext, data) {
  if (ext === '.jpg' || ext === '.jpeg') {
    return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  }
  if (ext === '.png') {
    return startsWithBytes(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (ext === '.webp') {
    return data.length >= 12 && asciiAt(data, 0, 4) === 'RIFF' && asciiAt(data, 8, 4) === 'WEBP';
  }
  return false;
}

async function handleUpload(req, res, url) {
  const contentType = req.headers['content-type'] || '';
  const boundary = /boundary=(.+)$/.exec(contentType)?.[1];
  if (!boundary) {
    sendJson(res, 400, { error: 'Boundary multipart manquant' });
    return;
  }
  const body = await readBody(req, MAX_UPLOAD_BYTES + 1024 * 256);
  const parts = parseMultipart(body, boundary);
  const file = parts.find(part => part.name === 'image' && part.filename);
  if (!file) {
    sendJson(res, 400, { error: 'Image manquante' });
    return;
  }
  if (file.data.length > MAX_UPLOAD_BYTES) {
    sendJson(res, 413, { error: 'Image trop volumineuse (5 MB max)' });
    return;
  }
  const ext = path.extname(file.filename).toLowerCase();
  if (!VALID_IMAGE_EXT.has(ext)) {
    sendJson(res, 400, { error: 'Format refuse. Utiliser jpg, jpeg, png ou webp.' });
    return;
  }
  if (!isAllowedImagePayload(ext, file.data)) {
    sendJson(res, 400, { error: 'Signature image invalide pour cette extension.' });
    return;
  }
  const slug = sanitizeId(url.searchParams.get('slug') || 'recette') || 'recette';
  const uploadDir = path.join(ROOT, 'assets', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });
  const filename = `${slug}-${Date.now()}${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), file.data);
  sendJson(res, 200, { url: `/assets/uploads/${filename}` });
}

async function handleApi(req, res, url) {
  try {
    if (!['GET', 'HEAD'].includes(req.method) && !requireTrustedOrigin(req, res)) return;
    if (!requireAdmin(req, res)) return;

    if (req.method === 'POST' && url.pathname === '/api/admin/logout') {
      const token = parseCookies(req)[SESSION_COOKIE];
      if (token) sessions.delete(token);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/admin/recipes') {
      sendJson(res, 200, { recipes: readRecipes() });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/upload') {
      await handleUpload(req, res, url);
      return;
    }

    const recipeMatch = url.pathname.match(/^\/api\/admin\/recipes(?:\/([^/]+))?$/);
    if (recipeMatch) {
      const recipes = readRecipes();
      if (req.method === 'POST' && !recipeMatch[1]) {
        const body = await readJson(req);
        const id = sanitizeId(body.id);
        const recipe = normalizeRecipe(body.recipe || {});
        const errors = validateRecipe(id, recipe, recipes, 'create');
        if (errors.length) return sendJson(res, 400, { error: errors.join(' ') });
        recipes[id] = recipe;
        writeRecipes(recipes);
        return sendJson(res, 201, { id, recipe });
      }

      const id = sanitizeId(recipeMatch[1]);
      if (!recipes[id]) return sendJson(res, 404, { error: 'Recette introuvable' });

      if (req.method === 'PUT') {
        const body = await readJson(req);
        const recipe = recipeForAdminSave(body.recipe || {}, recipes[id]);
        const errors = validateRecipe(id, recipe, recipes, 'update');
        if (errors.length) return sendJson(res, 400, { error: errors.join(' ') });
        recipes[id] = recipe;
        writeRecipes(recipes);
        return sendJson(res, 200, { id, recipe });
      }

      if (req.method === 'DELETE') {
        delete recipes[id];
        writeRecipes(recipes);
        return sendJson(res, 200, { ok: true });
      }
    }

    sendJson(res, 404, { error: 'Route API inconnue' });
  } catch (error) {
    sendJson(res, error.message.includes('Payload trop') ? 413 : 500, { error: error.message });
  }
}

function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (req.method === 'GET' && url.pathname === '/robots.txt') {
    sendRobots(res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/sitemap.xml') {
    try {
      sendSitemap(res);
    } catch (error) {
      send(res, 500, 'Server error');
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/login') {
    if (!requireTrustedOrigin(req, res)) return;
    readJson(req).then(body => {
      if (!ADMIN_PASSWORD) {
        sendJson(res, 503, { error: 'Admin non configure. Definir COOK_NOTE_ADMIN_PASSWORD.' });
        return;
      }
      if (isLoginRateLimited(req)) {
        sendJson(res, 429, { error: 'Trop de tentatives. Reessayer plus tard.' }, {
          'retry-after': String(loginRetryAfterSeconds(req))
        });
        return;
      }
      if (!passwordMatches(body.password, ADMIN_PASSWORD)) {
        recordLoginFailure(req);
        sendJson(res, 401, { error: 'Mot de passe invalide' });
        return;
      }
      clearLoginFailures(req);
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, { createdAt: Date.now() });
      const secure = req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted ? '; Secure' : '';
      send(res, 200, JSON.stringify({ ok: true }), {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'set-cookie': `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`
      });
    }).catch(error => sendJson(res, 400, { error: error.message }));
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url);
    return;
  }

  if (url.pathname === '/admin' || url.pathname === '/admin/') {
    if (!requireAdmin(req, res)) return;
    serveFile(req, res, path.join(ROOT, 'admin.html'), true);
    return;
  }

  if (['/admin.html', '/admin.js'].includes(url.pathname)) {
    if (!requireAdmin(req, res)) return;
    serveFile(req, res, path.join(ROOT, url.pathname.slice(1)), true);
    return;
  }

  if (url.pathname === '/admin-login.html') {
    serveFile(req, res, path.join(ROOT, 'admin-login.html'), true);
    return;
  }

  const prerenderedRecipe = prerenderedRecipePath(url.pathname);
  if (prerenderedRecipe) {
    serveFile(req, res, prerenderedRecipe, true);
    return;
  }

  if (url.pathname === '/techniques' || url.pathname === '/techniques/' || url.pathname.startsWith('/recette/')) {
    serveFile(req, res, path.join(ROOT, 'index.html'), true);
    return;
  }

  const filePath = safePath(url.pathname);
  if (!filePath) return send(res, 404, 'Not found');
  serveFile(req, res, filePath);
}

const server = http.createServer(route);
server.listen(PORT, HOST, () => {
  console.log(`Cook Note server: http://${HOST}:${PORT}`);
  console.log(`Admin: http://${HOST}:${PORT}/admin`);
});

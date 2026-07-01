const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function fail(message) {
  errors.push(message);
}

function expect(file, fragment) {
  const text = read(file);
  if (!text.includes(fragment)) fail(`${file}: fragment requis absent (${fragment}).`);
}

const headers = read('_headers');
const redirects = read('_redirects');
const server = read('server.js');
const adminHtml = read('admin.html');
const adminLoginHtml = read('admin-login.html');
const adminCss = read('admin.css');
const packageJson = read('package.json');
const rules = read('COOK_NOTE_RULES.md');

[
  "Content-Security-Policy: default-src 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options: nosniff',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()',
  'Cross-Origin-Opener-Policy: same-origin',
  '/service-worker.js',
  'Cache-Control: no-cache',
  '/app-images.js',
  '/assets/recipe-card-images/*',
  'Cache-Control: public, max-age=31536000, immutable',
  '/assets/image-manifest.js',
  'Cache-Control: public, max-age=300, must-revalidate'
].forEach(fragment => {
  if (!headers.includes(fragment)) fail(`_headers: fragment requis absent (${fragment}).`);
});

[
  '/recette/* /index.html 200',
  '/techniques /index.html 200',
  '/techniques/ /index.html 200'
].forEach(fragment => {
  if (!redirects.includes(fragment)) fail(`_redirects: route SPA absente (${fragment}).`);
});

[
  'SECURITY_HEADERS',
  'CONTENT_SECURITY_POLICY',
  'staticCacheControl',
  "relative === 'app-images.js'",
  "'x-content-type-options': 'nosniff'",
  "'referrer-policy': 'strict-origin-when-cross-origin'",
  "headers['cache-control'] = staticCacheControl(filePath, noStore)",
  'isTrustedOrigin',
  'requireTrustedOrigin',
  'Origine non autorisee',
  'LOGIN_MAX_FAILURES',
  'recordLoginFailure',
  'loginRetryAfterSeconds',
  "'retry-after'",
  'isAllowedImagePayload',
  'Signature image invalide'
].forEach(fragment => {
  if (!server.includes(fragment)) fail(`server.js: garde-fou headers absent (${fragment}).`);
});

['fonts.googleapis.com', 'fonts.gstatic.com', 'unpkg.com', 'cdn.jsdelivr.net'].forEach(domain => {
  if (adminHtml.includes(domain)) fail(`admin.html: domaine externe interdit (${domain}).`);
  if (adminLoginHtml.includes(domain)) fail(`admin-login.html: domaine externe interdit (${domain}).`);
});
if (adminCss.includes('font-family: Inter')) {
  fail('admin.css: police externe Inter encore referencee.');
}

expect('package.json', 'scripts/validate-headers.js');
expect('check.ps1', 'scripts\\validate-headers.js');
expect('COOK_NOTE_RULES.md', 'Cloudflare Pages');
expect('COOK_NOTE_RULES.md', '_headers');
expect('COOK_NOTE_RULES.md', '_redirects');

if (!packageJson.includes('validate:headers')) {
  fail('package.json: script validate:headers absent.');
}
if (!rules.includes('Les headers de production')) {
  fail('COOK_NOTE_RULES.md: regle production headers absente.');
}
if (!rules.includes('Origin') || !rules.includes('CSRF')) {
  fail('COOK_NOTE_RULES.md: regle CSRF admin absente.');
}
if (!rules.includes('429') || !rules.includes('Retry-After') || !rules.includes('signature binaire')) {
  fail('COOK_NOTE_RULES.md: regles securite admin recentes absentes.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation headers/routage OK.');

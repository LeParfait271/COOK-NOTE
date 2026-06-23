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
  "headers['cache-control'] = staticCacheControl(filePath, noStore)"
].forEach(fragment => {
  if (!server.includes(fragment)) fail(`server.js: garde-fou headers absent (${fragment}).`);
});

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

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation headers/routage OK.');

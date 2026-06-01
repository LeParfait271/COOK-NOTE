// ============================================================
//  Cook Note - Service Worker PWA v94
//  Cache-first pour assets statiques
//  Network-first pour les pages et fichiers qui changent souvent
// ============================================================

const CACHE_NAME = 'cook-note-v109';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/recipe.html',
  '/app.js?v=109',
  '/assets/catalog-1.js?v=109',
  '/assets/catalog-2.js?v=109',
  '/assets/catalog-3.js?v=109',
  '/assets/catalog-4.js?v=109',
  '/style.css?v=109',
  '/recipe.js',
  '/manifest.json',
  '/assets/vendor/react.production.min.js',
  '/assets/vendor/react-dom.production.min.js',
  '/assets/vendor/confetti.browser.min.js',
  '/assets/vendor/qrcode.min.js',
  '/assets/cook-note-mark.svg',
  '/assets/cook-note.png',
  '/assets/cook-note-white.png',
  '/assets/base-principale-fond-site.jpg',
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url))))
      .then(() => {
        console.log('[SW v79] Assets statiques mis en cache.');
      })
  );
  self.skipWaiting();
});

// Activation - purge des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => {
        console.log('[SW v79] Anciens caches supprimés.');
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorer les requêtes vers des domaines externes.
  // Elles ne doivent pas bloquer l'app hors-ligne
  if (url.origin !== self.location.origin) return;

  // Ne jamais mettre en cache l'admin ni l'API.
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) return;

  // Les pages de l'app : reseau d'abord, index en secours hors-ligne.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  // Ces fichiers changent souvent pendant les mises à jour du carnet :
  // réseau d'abord, cache en secours si l'utilisateur est hors-ligne.
  if (/^\/assets\/catalog-\d+\.js$/.test(url.pathname) || ['/app.js', '/recipes.js', '/recipe.js', '/style.css', '/manifest.json'].includes(url.pathname)) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Pour les assets locaux : cache-first, réseau en fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Ne mettre en cache que les réponses valides et non-opaques
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Fallback hors-ligne : retourner index.html pour la navigation SPA
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          // Pour les autres ressources manquantes, on laisse échouer proprement
        });
    })
  );
});

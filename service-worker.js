// ============================================================
//  Cook Note - Service Worker PWA v32
//  Cache-first pour assets statiques
//  Network-first pour les images externes (Unsplash, CDN)
// ============================================================

const CACHE_NAME = 'cook-note-v32';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/recipe.html',
  '/app.js?v=32',
  '/recipes.js?v=32',
  '/style.css?v=32',
  '/recipe.js',
  '/manifest.json',
  '/assets/cook-note.png',
  '/assets/cook-note-white.png',
  '/assets/base-principale-fond-site.jpg',
  '/assets/recipe-images/parent_accompagnements.png',
  '/assets/recipe-images/parent_apero.png',
  '/assets/recipe-images/parent_base.png',
  '/assets/recipe-images/parent_desserts.png',
  '/assets/recipe-images/parent_entrees.png',
  '/assets/recipe-images/legumes_rotis_spooky.png',
  '/assets/recipe-images/parent_petit_dejeuner.png',
  '/assets/recipe-images/parent_plats.png',
  '/assets/recipe-images/parent_sauces.png',
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url))))
      .then(() => {
        console.log('[SW v32] Assets statiques mis en cache.');
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
        console.log('[SW v32] Anciens caches supprimés.');
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorer les requêtes vers des domaines externes (CDN React, Unsplash, etc.)
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
  if (['/app.js', '/recipes.js', '/recipe.js', '/style.css', '/manifest.json'].includes(url.pathname)) {
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

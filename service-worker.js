// ============================================================
//  Cook Note - Service Worker PWA v320
//  Cache-first pour assets statiques
//  Network-first pour les pages et fichiers qui changent souvent
// ============================================================

const CACHE_NAME = 'cook-note-v320';
const IMAGE_CACHE_NAME = 'cook-note-images-v320';
const IMAGE_CACHE_LIMIT = 140;
const FAST_CHANGING_PATHS = new Set([
  '/app.js',
  '/app-images.js',
  '/app-art-images.js',
  '/theme.js',
  '/i18n.js',
  '/recipes.js',
  '/recipe.js',
  '/style.css',
  '/manifest.json',
  '/assets/image-manifest.js'
]);
const IMMUTABLE_IMAGE_PATHS = [
  '/assets/recipe-card-images/',
  '/assets/recipe-images-optimized/',
  '/assets/day/',
  '/assets/dark/',
  '/assets/base-du-site.png',
  '/assets/base-principale-fond-site.jpg',
  '/assets/cook-note.png',
  '/assets/cook-note-white.png',
  '/assets/cook-note-mark.svg'
];
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/recipe.html',
  '/app.js?v=320-parent-title',
  '/app-images.js?v=320-parent-title',
  '/app-art-images.js?v=320-parent-title',
  '/theme.js?v=320-parent-title',
  '/i18n.js?v=320-parent-title',
  '/assets/catalog-1.js?v=320-parent-title',
  '/assets/image-manifest.js?v=320-parent-title',
  '/style.css?v=320-parent-title',
  '/recipe.js?v=320-parent-title',
  '/manifest.json',
  '/assets/vendor/react.production.min.js',
  '/assets/vendor/react-dom.production.min.js',
  '/assets/cook-note-mark.svg',
  '/assets/cook-note.png',
  '/assets/cook-note-white.png',
  '/assets/base-principale-fond-site.jpg',
  '/assets/day/base-du-site-day.jpg?v=320-parent-title',
  '/assets/day/base-principale-fond-site-day.jpg?v=320-parent-title',
  '/assets/day/category-apero-day.jpg?v=320-parent-title',
  '/assets/day/category-accompagnements-day.jpg?v=320-parent-title',
  '/assets/day/category-bases-day.jpg?v=320-parent-title',
  '/assets/day/category-desserts-day.jpg?v=320-parent-title',
  '/assets/day/category-entrees-day.jpg?v=320-parent-title',
  '/assets/day/category-petit-dejeuner-day.jpg?v=320-parent-title',
  '/assets/day/category-plats-day.jpg?v=320-parent-title',
  '/assets/day/category-sauces-day.jpg?v=320-parent-title',
  '/assets/day/cook-note-day.png?v=320-parent-title',
  '/assets/day/recipe-seafood-day.jpg?v=320-parent-title',
  '/assets/dark/recipe-beurre_ail-dark.jpg?v=320-parent-title',
];

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map(request => cache.delete(request)));
}

function isImmutableImageRequest(url) {
  return IMMUTABLE_IMAGE_PATHS.some(path => url.pathname === path || url.pathname.startsWith(path));
}

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url))))
  );
});

// Activation - purge des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => ![CACHE_NAME, IMAGE_CACHE_NAME].includes(k)).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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

  // Les APK sont des telechargements lourds : ne pas les stocker dans le cache PWA.
  if (url.pathname.startsWith('/downloads/')) return;

  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached && isImmutableImageRequest(url)) return cached;
        const refresh = fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(event.request, response.clone()).then(() => trimCache(IMAGE_CACHE_NAME, IMAGE_CACHE_LIMIT));
          }
          return response;
        }).catch(() => cached);
        return cached || refresh;
      })
    );
    return;
  }

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
  if (/^\/assets\/catalog-\d+\.js$/.test(url.pathname) || FAST_CHANGING_PATHS.has(url.pathname)) {
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

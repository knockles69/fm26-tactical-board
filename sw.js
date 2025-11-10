const CACHE_NAME = 'fm2026-tactical-board-v12-final-clean-fix';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Local assets
  './src/index.tsx',
  './src/App.tsx',
  './src/types.ts',
  './src/constants.ts',
  './src/utils.ts',
  './src/components/icons.tsx',
  './src/components/Tabs.tsx',
  './src/components/PlayerSlot.tsx',
  './src/components/PlayerForm.tsx',
  './src/components/PositionBox.tsx',
  './src/components/SquadListView.tsx',
  './src/components/TacticsMenu.tsx',
  './src/components/FormationLayout.tsx',
  // CDNs
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  // Icons for manifest
  'https://img.icons8.com/color/192/football-2.png',
  'https://img.icons8.com/color/512/football-2.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Failed to cache', err))
  );
});

self.addEventListener('fetch', event => {
  // Let the browser handle non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network, then cache and return
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.log('Fetch failed:', error);
          // Optionally return a custom offline page here
        });
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
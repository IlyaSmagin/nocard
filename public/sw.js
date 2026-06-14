const CACHE_NAME = "cardholder-v1";
const ASSET_CACHE = "cardholder-assets-v1";
const PRECACHE_URLS = [
  "/",
  "/all-cards",
  "/settings",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME && name !== ASSET_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { pathname } = new URL(event.request.url);
  const isHtmlPage = 
    pathname === "/" ||
    pathname === "/all-cards" ||
    pathname === "/settings" ||
    pathname.startsWith("/card/");
  const isAsset = 
    pathname.includes(".") &&
    !pathname.endsWith(".html");

  if (isHtmlPage) {
    // Network-first strategy for HTML pages (ensures fresh content when online)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            // Return offline fallback for missing pages
            return caches.match("/");
          });
        })
    );
  } else if (isAsset) {
    // Cache-first strategy for assets (JS, CSS, images, fonts)
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          // Fetch and cache asset
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              cache.put(event.request, clone);
            }
            return response;
          });
        });
      })
    );
  } else {
    // Stale-while-revalidate for other requests (API, etc.)
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone);
              });
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});

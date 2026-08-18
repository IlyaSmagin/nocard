const CACHE_NAME = "cardholder-v1";
const ASSET_CACHE = "cardholder-assets-v1";
const PRECACHE_URLS = [
  "/",
  "/all-cards",
  "/settings",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
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
  const isAsset = 
    pathname.includes(".") &&
    !pathname.endsWith(".html");

  if (isAsset) {
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
    // Stale-while-revalidate for HTML pages and other requests
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (!cached) return fetch(event.request);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        fetch(event.request, { signal: controller.signal })
          .then((response) => {
            clearTimeout(timeoutId);
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone);
              });
            }
          })
          .catch(() => {});

        return cached;
      })
    );
  }
});

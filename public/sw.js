// Intentionally minimal. This service worker exists only to make the app
// installable — it never intercepts requests, so navigations and RSC payloads
// always go straight to the network. An earlier version cached RSC responses,
// which broke the title detail modal (empty/blurred sheet). On activate it also
// purges any caches those older versions left behind.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// A fetch listener that never calls respondWith keeps the app installable
// without the SW ever touching a request.
self.addEventListener("fetch", () => {});

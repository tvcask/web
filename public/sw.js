// Minimal service worker: makes the app installable and speeds up repeat loads
// of immutable build assets. It deliberately does NOT touch navigations, RSC
// payloads, or API calls — caching those broke the intercepting-route detail
// modal on mobile (the overlay showed but the content payload was stale or
// mismatched, so nothing rendered). Anything dynamic always hits the network.
const CACHE = "tvcask-v2";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const STATIC = /\.(?:css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp)$/;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Only immutable build assets are cache-first. Everything else (documents,
  // RSC payloads, /api) is left for the browser to fetch normally.
  const isStatic = url.pathname.startsWith("/_next/static/") || STATIC.test(url.pathname);
  if (!isStatic) return;

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
    )
  );
});

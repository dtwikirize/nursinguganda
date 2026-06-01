const CACHE_VERSION = "nursing-uganda-v115";
const APP_SHELL = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/main.min.css?v=114",
  "./assets/js/app.min.js?v=114",
  "./assets/images/nursing-uganda-favicon.svg",
  "./assets/images/nursing-uganda-icon.png",
  "./assets/images/nursing-uganda-logo.png",
  "./assets/images/pwa/icon-192x192.png",
  "./assets/images/pwa/icon-512x512.png",
  "./assets/images/pwa/icon-maskable-192x192.png",
  "./assets/images/pwa/icon-maskable-512x512.png",
  "./assets/images/pwa/icon-180x180.png",
  "./assets/data/curriculum.json?v=114",
  "./assets/data/lesson-images-manifest.json"
];

// Lesson images are static assets — cache them with a cache-first strategy.
// On first visit they are fetched and stored; subsequent visits are instant even offline.
const LESSON_IMAGES_PATH = "/assets/images/lesson-images/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("./index.html").then((r) => r || caches.match("./offline.html"))
      )
    );
    return;
  }

  // Cache-first for lesson images: they never change once written, so serve from
  // cache immediately. Fetch + cache on first request only.
  if (url.pathname.startsWith(LESSON_IMAGES_PATH)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for all other assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

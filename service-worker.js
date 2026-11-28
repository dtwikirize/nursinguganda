/* =============================================================================
 * Nursing Uganda — offline service worker
 *
 * Replaces the previous self-destruct stub, which deleted every cache and
 * unregistered itself. The manifest advertised an installable standalone app
 * while every page still required a live connection — the worst case for
 * students reading on ward placements with intermittent or metered data.
 *
 * Strategies
 *   navigation      network-first  → cached page → cached shell → offline page
 *   /assets/app/*   cache-first    (content-hashed, served immutable)
 *   images          cache-first    (capped, LRU-ish trim)
 *   cross-origin    not intercepted (browser HTTP cache handles fonts)
 *   /assets/data/*  stale-while-revalidate
 *   /api/*, /mcp    never cached
 *
 * Bump CACHE_VERSION to retire every old cache in one go.
 * ========================================================================== */

const CACHE_VERSION = "v2";
const PREFIX = "nu";

const SHELL_CACHE = `${PREFIX}-shell-${CACHE_VERSION}`;
const APP_CACHE = `${PREFIX}-app-${CACHE_VERSION}`;
const DATA_CACHE = `${PREFIX}-data-${CACHE_VERSION}`;
const MEDIA_CACHE = `${PREFIX}-media-${CACHE_VERSION}`;
const PAGE_CACHE = `${PREFIX}-pages-${CACHE_VERSION}`;
const EBOOK_CACHE = `${PREFIX}-ebooks-${CACHE_VERSION}`;

// Caches this worker owns. Anything else under the prefix is from an older
// version and gets deleted on activate.
const CURRENT_CACHES = new Set([
  SHELL_CACHE,
  APP_CACHE,
  DATA_CACHE,
  MEDIA_CACHE,
  PAGE_CACHE,
  EBOOK_CACHE
]);

const OFFLINE_URL = "/_offline.html";
const SHELL_URL = "/";

// Kept small on purpose: a student on metered data should not pay for a large
// precache they may never use. Everything else is cached as it is visited.
const PRECACHE_URLS = [OFFLINE_URL, SHELL_URL, "/manifest.webmanifest"];

const MEDIA_LIMIT = 160;
const PAGE_LIMIT = 40;

/* ---------------------------------------------------------------- helpers */

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

/** Hashed build output: /assets/app/index-BxDRtvC9.js — safe to cache forever. */
function isAppAsset(url) {
  return url.pathname.startsWith("/assets/app/");
}

function isDataAsset(url) {
  return url.pathname.startsWith("/assets/data/") && url.pathname.endsWith(".json");
}

function isMediaAsset(url) {
  return /\.(webp|png|jpe?g|svg|gif|avif|ico|woff2?)$/i.test(url.pathname);
}

/** Never cache: auth state, payments, tracking, agent endpoints. */
function isNeverCached(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/mcp" ||
    url.pathname === "/service-worker.js" ||
    url.pathname === "/sw.js"
  );
}

/**
 * Trim a cache to a maximum number of entries, oldest first. `cache.keys()`
 * returns insertion order, so dropping from the front approximates LRU well
 * enough for static media.
 */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)));
}

/** Only 200 same-origin/CORS responses are worth storing. */
function isCacheable(response) {
  return !!response && response.status === 200 && response.type !== "opaqueredirect";
}

/* ------------------------------------------------------------- strategies */

async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
      if (limit) trimCache(cacheName, limit);
    }
    return response;
  } catch (err) {
    // respondWith() has already committed, so a thrown error becomes a hard
    // network failure for the page. Serve anything we have rather than that.
    const stale = await caches.match(request);
    if (stale) return stale;
    throw err;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (isCacheable(response)) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (hit) return hit;

  const fresh = await network;
  if (fresh) return fresh;
  return new Response(JSON.stringify({ offline: true }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}

/**
 * Navigations go to the network first so server-injected route metadata and
 * fresh content win whenever there is a connection. Offline, fall back through
 * the exact page, then the app shell (the SPA can still render cached routes),
 * then the offline notice.
 */
async function handleNavigation(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      cache.put(request, response.clone());
      trimCache(PAGE_CACHE, PAGE_LIMIT);
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    const shell = await caches.match(SHELL_URL);
    if (shell) return shell;

    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

/* ----------------------------------------------------------- SW lifecycle */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individually, so one failure cannot abort the whole install.
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache
            .add(new Request(url, { cache: "reload" }))
            .catch(() => {})
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith(`${PREFIX}-`) && !CURRENT_CACHES.has(k))
          .map((k) => caches.delete(k))
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.disable();
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  // Range requests (PDF/video seeking) must reach the network untouched.
  if (request.headers.has("range")) return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (isSameOrigin(url) && isNeverCached(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Cross-origin (Google Fonts) is left to the browser's own HTTP cache, which
  // already stores it with a long max-age and serves it offline.
  if (!isSameOrigin(url)) return;

  if (isAppAsset(url)) {
    event.respondWith(cacheFirst(request, APP_CACHE));
    return;
  }
  if (isDataAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
    return;
  }
  if (isMediaAsset(url)) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE, MEDIA_LIMIT));
  }
});

/* ------------------------------------------------- page ↔ worker messages */

/**
 * "Save this eBook for offline" from the reader. Pulls the book's own JSON and
 * its figures into a dedicated cache that the trim logic never touches, so a
 * deliberately saved book is not evicted by ordinary browsing.
 */
async function saveEbookOffline(payload) {
  const urls = Array.isArray(payload?.urls) ? payload.urls.filter(Boolean) : [];
  if (!urls.length) return { ok: false, saved: 0, failed: 0 };

  const cache = await caches.open(EBOOK_CACHE);
  let saved = 0;
  let failed = 0;

  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (isCacheable(response)) {
          await cache.put(url, response.clone());
          saved += 1;
        } else {
          failed += 1;
        }
      } catch {
        failed += 1;
      }
    })
  );

  return { ok: failed === 0, saved, failed };
}

async function removeEbookOffline(payload) {
  const urls = Array.isArray(payload?.urls) ? payload.urls.filter(Boolean) : [];
  const cache = await caches.open(EBOOK_CACHE);
  await Promise.all(urls.map((url) => cache.delete(url)));
  return { ok: true };
}

async function isEbookSaved(payload) {
  const urls = Array.isArray(payload?.urls) ? payload.urls.filter(Boolean) : [];
  if (!urls.length) return { saved: false };
  const cache = await caches.open(EBOOK_CACHE);
  const hits = await Promise.all(urls.map((url) => cache.match(url)));
  return { saved: hits.every(Boolean) };
}

self.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};
  const reply = (data) => {
    if (event.ports && event.ports[0]) event.ports[0].postMessage(data);
  };

  if (type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (type === "SAVE_EBOOK") {
    event.waitUntil(saveEbookOffline(payload).then(reply).catch(() => reply({ ok: false })));
    return;
  }
  if (type === "REMOVE_EBOOK") {
    event.waitUntil(removeEbookOffline(payload).then(reply).catch(() => reply({ ok: false })));
    return;
  }
  if (type === "IS_EBOOK_SAVED") {
    event.waitUntil(isEbookSaved(payload).then(reply).catch(() => reply({ saved: false })));
  }
});

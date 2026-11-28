/**
 * "Save for offline" bridge to the service worker.
 *
 * The worker keeps deliberately-saved eBooks in their own cache, which the
 * routine LRU trim never touches — a book a student chose to save should still
 * be there after a week of ordinary browsing.
 */

/** Everything a reader needs to open this eBook with no connection. */
export function ebookOfflineUrls(ebook) {
  if (!ebook?.slug) return [];

  const urls = [
    `/ebooks/${ebook.slug}`,
    "/assets/data/ebooks.json"
  ];

  if (ebook.hasFullBookData) {
    urls.push(`/assets/data/books/${ebook.slug}.json`);
  }
  if (ebook.coverImage) {
    urls.push(ebook.coverImage.startsWith("/") ? ebook.coverImage : `/${ebook.coverImage}`);
  }

  // Chapter figures, so diagrams render offline too.
  (ebook.figures || []).forEach((fig) => {
    const src = fig?.src || fig?.image || fig?.url;
    if (src) urls.push(src.startsWith("/") ? src : `/${src}`);
  });
  (ebook.chapters || []).forEach((ch) => {
    (ch.figures || []).forEach((fig) => {
      const src = fig?.src || fig?.image || fig?.url;
      if (src) urls.push(src.startsWith("/") ? src : `/${src}`);
    });
  });

  return Array.from(new Set(urls));
}

export function offlineSupported() {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator && "caches" in window;
}

/** Ask the active worker a question and wait for its reply. */
function ask(type, payload, timeoutMs = 60000) {
  return new Promise((resolve) => {
    if (!offlineSupported()) {
      resolve(null);
      return;
    }
    navigator.serviceWorker.ready
      .then((registration) => {
        const worker = registration.active;
        if (!worker) {
          resolve(null);
          return;
        }
        const channel = new MessageChannel();
        const timer = setTimeout(() => resolve(null), timeoutMs);
        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          resolve(event.data);
        };
        worker.postMessage({ type, payload }, [channel.port2]);
      })
      .catch(() => resolve(null));
  });
}

export const saveEbookOffline = (urls) => ask("SAVE_EBOOK", { urls });
export const removeEbookOffline = (urls) => ask("REMOVE_EBOOK", { urls }, 15000);
export const isEbookSavedOffline = (urls) => ask("IS_EBOOK_SAVED", { urls }, 15000);

// Generic Offline Ward Pack helpers for Country Hubs, Clinical Tools & Reference Data
export const saveOfflinePack = (urls) => ask("SAVE_EBOOK", { urls });
export const removeOfflinePack = (urls) => ask("REMOVE_EBOOK", { urls }, 15000);
export const isOfflinePackSaved = (urls) => ask("IS_EBOOK_SAVED", { urls }, 15000);

export function getCountryHubOfflineUrls(targetSlug, featuredPlates = []) {
  if (!targetSlug) return [];
  const urls = [
    targetSlug.startsWith("/") ? targetSlug : `/global-nursing/${targetSlug}`,
    "/assets/data/country-study-hubs.json",
    "/assets/data/medical-images.json",
    "/assets/data/canonical-lessons-index.json",
    "/assets/images/brand/nursing-uganda-logo-light.svg",
    "/assets/images/brand/nu-variant-3-192.png"
  ];
  if (targetSlug === "united-kingdom-nmc") urls.push("/nursing-uk");
  if (targetSlug === "united-states-nclex") urls.push("/nursing-usa", "/nclex-rn");
  if (targetSlug === "canada-nnas-nclex" || targetSlug === "canada-nnas-rexpn") urls.push("/nursing-canada");
  if (targetSlug === "australia-ahpra-nmba") urls.push("/nursing-australia");
  if (targetSlug === "kenya-nck") urls.push("/global-nursing/kenya-nck");
  if (targetSlug === "uganda-unmc" || targetSlug === "uganda-unmc-uhpab") urls.push("/global-nursing/uganda-unmc", "/global-nursing/uganda-unmc-uhpab");
  if (targetSlug === "tanzania-tnmc") urls.push("/global-nursing/tanzania-tnmc");
  if (targetSlug === "gulf-dha-moh-scfhs" || targetSlug === "gulf-dha-doh-scfhs") urls.push("/global-nursing/gulf-dha-moh-scfhs", "/global-nursing/gulf-dha-doh-scfhs");

  (featuredPlates || []).forEach((p) => {
    if (p?.src) urls.push(p.src.startsWith("/") ? p.src : `/${p.src}`);
  });

  return Array.from(new Set(urls));
}

const CACHE_NAME = "aventis-app-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./fleet.html",
  "./destinations.html",
  "./experience.html",
  "./about.html",
  "./contact.html",
  "./manifest.webmanifest",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./css/global.css",
  "./css/hero.css",
  "./css/fleet.css",
  "./css/destinations.css",
  "./css/experience.css",
  "./css/about.css",
  "./css/contact.css",
  "./css/modals.css",
  "./js/global.js",
  "./js/video-manager.js",
  "./js/fleet-data.js",
  "./js/destinations.js",
  "./js/contact.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("aventis-app-shell-") && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match("./index.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => cachedResponse || fetch(request))
  );
});

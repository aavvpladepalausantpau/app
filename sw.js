// Service worker mínim: permet instal·lar l'app i guarda només la carcassa (no les dades).
const CACHE = "avsantpau-v2";
const FITXERS = ["/", "/index.html", "/manifest.webmanifest", "/icona-192.png", "/icona-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FITXERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
// Primer xarxa; si no n'hi ha, la còpia guardada. Només per a fitxers del mateix domini.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});

const STATIC_CACHE = "static-v5";
const API_CACHE = "hn-api-v5";
const MAX_API_ENTRIES = 10;

// Archivos necesarios para que la interfaz pueda cargarse sin conexión.
// Los nombres de los assets deben actualizarse cuando cambia el build.
const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/favicon.svg",
  "/assets/index-CQ6EEpAB.js",
  "/assets/index-nqMpL4T3.css",
];

// Durante la instalación se realiza el precache de la interfaz base.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Toma control inmediato de las pestañas abiertas una vez activado.
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Mantiene la caché externa limitada al máximo definido en el enunciado.
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  while (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    keys.shift();
  }
}

// Estrategia Freshness / Network First para la API externa.
// Primero intenta obtener la respuesta desde la red y, si falla,
// utiliza la copia almacenada en caché.
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      await trimCache(API_CACHE, MAX_API_ENTRIES);
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;

    return new Response(
      JSON.stringify({ error: "Sin conexión y sin caché disponible." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Las peticiones a Hacker News usan estrategia Network First.
  if (url.origin === "https://hacker-news.firebaseio.com") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Para navegación interna de la SPA se devuelve el shell de la aplicación.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cachedRoot = await caches.match("/");
        if (cachedRoot) return cachedRoot;

        const cachedIndex = await caches.match("/index.html");
        if (cachedIndex) return cachedIndex;

        try {
          return await fetch(request);
        } catch (error) {
          return caches.match("/offline.html");
        }
      })()
    );
    return;
  }

  // Los recursos estáticos locales usan caché primero y, si no existen,
  // se descargan y almacenan para usos futuros.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
        );
      })
    );
  }
});
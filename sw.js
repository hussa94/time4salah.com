const cacheName = 'time4salahv3';
self.addEventListener("install", e=>{
    e.waitUntil(
        caches.open(cacheName).then(cache =>{
            return cache.addAll([   "./index.html",
                                    "./images/husyn.ico",
                                    "./scripts/script.js",
                                    "./scripts/style.css",
                                    "./scripts/jquery-3.6.0.min.js",
                                    "./scripts/moment.js",
                                    "./scripts/bootstrap.bundle.min.js",
                                    "./scripts/bootstrap.min.css",
                                    "./scripts/d3.v6.min.js",
                                    "./data/202105.csv",
                                    "./data/202106.csv",
                                    "./data/202107.csv",
                                    "./data/202108.csv",
                                    "./data/202109.csv",
                                    "./data/202110.csv",
                                    "./data/202111.csv",
                                    "./data/202112.csv",
                                    "./android-chrome-192x192.png",
                                    "./manifest.json",
                                    "./scripts/text-style.css",
                                    "./images/bg_islamic.jpg"
                                ]);
        })
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
  });
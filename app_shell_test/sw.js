var cacheName = 'shell-content';
var filesToCache = [
  './index.html',
  './css/01.css',
  './js/01.js',
  './js/02.js',
  './img/logo.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
var cacheName = 'shell-content';
var filesToCache = [
  './home.html',
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


// 捕获请求并返回缓存数据
// self.addEventListener('fetch', function(event) {
//   event.respondWith(caches.match(event.request).catch(function() {
//     return fetch(event.request);
//   }).then(function(response) {
//     caches.open(cacheName).then(function(cache) {
//       cache.put(event.request, response);
//     });
//     return response.clone();
//   }).catch(function() {
//     return caches.match('./img/logo.png');
//   }));
// });



// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(cache => {
      // console.log(">>>>>request", event.request);

      return cache.match(event.request).then(res => {
        if (res) {
          console.log('in cache', res);
          return res;
        }

        return fetch(event.request).then(netRes => {
          cache.put(event.request, netRes.clone());
          return netRes;
        });
      }).catch(err => {
        console.log(err);
        throw err;
      });
    })
  );
});


// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
      Promise.all([

          // 更新客户端
          self.clients.claim(),

          // 清理旧版本
          caches.keys().then(function (cacheList) {
              return Promise.all(
                  cacheList.map(function (cacheName) {
                      if (cacheName !== 'my-test-cache-v1') {
                          return caches.delete(cacheName);
                      }
                  })
              );
          })
      ])
  );
});
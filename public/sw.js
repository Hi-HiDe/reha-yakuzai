// オフラインでも使えるようにするサービスワーカー（03 と同じ方式）。
// HTML・JS・CSS は通信できるときは最新を取りに行き（network-first）、画像はキャッシュを優先する（cache-first）。
// 画像を追加・差し替えたときは CACHE の版を上げる。
var CACHE = "yakuzai-nav-v11";
var ASSETS = ["./", "data.js", "figures.js", "figures-cv.js", "figures-dm.js", "figures-cns.js", "figures-pain.js", "figures-onc.js", "figures-abx.js", "app.js", "styles.css", "manifest.webmanifest",
  "icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (/\.(png|svg)$/.test(new URL(req.url).pathname)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res; });
    }));
  } else {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("./"); });
    }));
  }
});

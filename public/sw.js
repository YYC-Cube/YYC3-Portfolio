/**
 * YYC³ Portfolio - PWA Service Worker
 * 缓存策略：Cache First（静态资源）、Network First（页面）、Stale While Revalidate（字体和图片）
 */

const CACHE_NAME = "yyc3-portfolio-v1"

const STATIC_CACHE_URLS = [
  "/",
  "/manifest.json",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS)
    })
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 只处理同源请求
  if (url.origin !== self.location.origin) return

  // 静态资源（JS/CSS/图片）- Cache First
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, res.clone())
          return res
        })
      }))
    )
    return
  }

  // 页面 / 导航 - Network First
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, res.clone())
            return res
          })
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    )
    return
  }

  // 其他请求 - Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, res.clone())
          return res
        })
      })
      return cached || fetchPromise
    })
  )
})
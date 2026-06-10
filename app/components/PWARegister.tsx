"use client"

/**
 * @file components/PWARegister.tsx
 * @description PWA Service Worker 注册组件
 * @author YanYuCloudCube Team
 * @version v1.0.0
 */

import { useEffect } from "react"

export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 静默失败，不影响用户体验
      })
    }
  }, [])

  return null
}
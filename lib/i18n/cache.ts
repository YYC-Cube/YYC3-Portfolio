/**
 * @fileoverview LRU 缓存系统
 * @description 基于 LRU（最近最少使用）算法的缓存实现，支持 TTL 过期
 */

import type { CacheConfig, CacheStats } from "./types"

const DEFAULT_CONFIG = {
  maxSize: 1000,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  enabled: true,
} satisfies Required<CacheConfig>

interface CacheEntry<V> {
  value: V
  expiresAt: number
}

export class LRUCache<V> {
  private cache = new Map<string, CacheEntry<V>>()
  private hits = 0
  private misses = 0
  private evictions = 0
  readonly config: Required<CacheConfig>

  constructor(config?: CacheConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  get(key: string): V | null {
    if (!this.config.enabled) return null

    const entry = this.cache.get(key)
    if (!entry) {
      this.misses++
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.misses++
      return null
    }

    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)
    this.hits++
    return entry.value
  }

  set(key: string, value: V, ttl?: number): void {
    if (!this.config.enabled) return

    // Evict oldest if at capacity
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey)
        this.evictions++
      }
    }

    const expiresAt = Date.now() + (ttl ?? this.config.defaultTTL)
    this.cache.set(key, { value, expiresAt })
  }

  has(key: string): boolean {
    if (!this.config.enabled) return false
    const entry = this.cache.get(key)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
    this.evictions = 0
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total === 0 ? 1 : this.hits / total,
      evictions: this.evictions,
    }
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  values(): V[] {
    return Array.from(this.cache.values()).map((e) => e.value)
  }
}

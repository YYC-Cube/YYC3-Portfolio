/**
 * @fileoverview I18nEngine 核心引擎
 * @description 完整的国际化引擎实现，支持缓存、插件、ICU、命名空间、批量翻译等特性
 */

import type {
  Locale,
  TranslationMap,
  I18nEngineConfig,
  EngineStats,
  Subscriber,
  ErrorContext,
  I18nContext,
} from "./types"
import { LRUCache } from "./cache"
import { PluginManager } from "./plugins"
import { isICUMessage, compileICUMessage } from "./icu"
import { resolveTranslationPath, interpolate as simpleInterpolate } from "./formatter"
import { detectSystemLocale } from "./detector"

export type { Locale, TranslationMap, I18nEngineConfig } from "./types"

export class I18nEngine {
  private locale: Locale
  private fallbackLocale: Locale
  private translations: Map<Locale, TranslationMap> = new Map()
  private subscribers: Set<Subscriber> = new Set()

  readonly cache: LRUCache<string>
  readonly plugins: PluginManager

  private debugMode: boolean
  private errorHandler?: (error: Error, context: ErrorContext) => void
  private missingKeyHandler?: (key: string, locale: Locale) => string

  constructor(config: I18nEngineConfig = {}) {
    this.locale = (config.locale ?? "zh-CN") as Locale
    this.fallbackLocale = (config.fallbackLocale ?? "en") as Locale
    this.debugMode = config.debug ?? false
    this.errorHandler = config.onError
    this.missingKeyHandler = config.missingKeyHandler

    // 初始化缓存系统
    this.cache = new LRUCache<string>({
      enabled: config.cache?.enabled ?? true,
      maxSize: config.cache?.maxSize ?? 1000,
      defaultTTL: config.cache?.ttl ?? 5 * 60 * 1000,
    })

    // 初始化插件系统
    this.plugins = new PluginManager()
  }

  /**
   * 更新配置（保留已有状态）
   */
  configure(config: Partial<I18nEngineConfig>): void {
    if (config.locale) this.locale = config.locale
    if (config.fallbackLocale) this.fallbackLocale = config.fallbackLocale
    if (config.debug !== undefined) this.debugMode = config.debug
    if (config.onError) this.errorHandler = config.onError
    if (config.missingKeyHandler) this.missingKeyHandler = config.missingKeyHandler
  }

  getLocale(): Locale {
    return this.locale
  }

  async setLocale(locale: Locale): Promise<void> {
    if (this.locale === locale) return

    const oldLocale = this.locale
    this.locale = locale

    // 持久化 locale
    this.persistLocale(locale)

    // 通知插件
    this.plugins.notifyLocaleChange(locale, oldLocale)

    // 通知订阅者
    this.notify(locale)

    if (this.debugMode) {
      console.log(`[i18n] Locale changed: ${oldLocale} → ${locale}`)
    }
  }

  registerTranslation(locale: Locale, map: TranslationMap): void {
    this.translations.set(locale, map)
  }

  /**
   * 获取指定语言的翻译映射
   */
  getTranslations(locale: Locale): TranslationMap | undefined {
    return this.translations.get(locale)
  }

  subscribe(sub: Subscriber): () => void {
    this.subscribers.add(sub)
    return () => this.subscribers.delete(sub)
  }

  private notify(locale: Locale): void {
    this.subscribers.forEach((cb) => cb(locale))
  }

  /**
   * 翻译方法（核心方法）
   * 支持缓存、插件钩子、ICU MessageFormat
   */
  t(key: string, params?: Record<string, string | number>): string {
    // 1. 执行 beforeTranslate 插件钩子
    const { key: processedKey, params: processedParams } =
      this.plugins.executeBeforeTranslate(key, params as Record<string, string> | undefined)

    const strParams = processedParams as Record<string, string> | undefined

    // 2. 尝试从缓存读取
    const cacheKey = `${this.locale}:${processedKey}`
    if (params === undefined || Object.keys(params).length === 0) {
      const cached = this.cache.get(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    // 3. 解析翻译
    let result = this.resolveTranslation(processedKey, strParams)

    // 4. 处理缺失键
    if (result === undefined) {
      result = this.handleMissingKey(processedKey)
    }

    // 5. 写入缓存（无参数的翻译）
    if (result !== undefined && (params === undefined || Object.keys(params).length === 0)) {
      this.cache.set(cacheKey, result)
    }

    const finalResult = result ?? processedKey

    // 6. 执行 afterTranslate 插件钩子
    const pluginResult = this.plugins.executeAfterTranslate(
      finalResult,
      processedKey,
      strParams
    )

    return pluginResult
  }

  /**
   * 解析翻译值
   */
  private resolveTranslation(
    key: string,
    params?: Record<string, string>
  ): string | undefined {
    // 优先从当前语言查找
    const currentMap = this.translations.get(this.locale)
    let value = currentMap ? resolveTranslationPath(currentMap, key) : undefined

    // 回退到 fallback 语言
    if (value === undefined && this.fallbackLocale !== this.locale) {
      const fallbackMap = this.translations.get(this.fallbackLocale)
      value = fallbackMap ? resolveTranslationPath(fallbackMap, key) : undefined
    }

    if (value === undefined) return undefined

    // ICU MessageFormat 处理
    if (typeof value === "string" && isICUMessage(value)) {
      try {
        return compileICUMessage(value, params as Record<string, string | number> | undefined)
      } catch (e) {
        this.handleError(
          e instanceof Error ? e : new Error(String(e)),
          { key, locale: this.locale }
        )
        return value
      }
    }

    // 简单插值
    if (typeof value === "string" && params) {
      return simpleInterpolate(value, params)
    }

    return typeof value === "string" ? value : String(value)
  }

  /**
   * 处理缺失键
   */
  private handleMissingKey(key: string): string | undefined {
    const locale = this.locale

    // 1. 检查配置的 missingKeyHandler
    if (this.missingKeyHandler) {
      return this.missingKeyHandler(key, locale)
    }

    // 2. 检查插件系统
    const pluginResult = this.plugins.handleMissingKey(key, locale)
    if (pluginResult !== undefined) {
      return pluginResult
    }

    // 3. 调试模式下输出警告
    if (this.debugMode) {
      console.warn(`[i18n] Missing translation key: "${key}" for locale "${locale}"`)
    }

    return undefined
  }

  /**
   * 错误处理
   */
  private handleError(error: Error, context: ErrorContext): void {
    // 通知插件
    this.plugins.handleError(error, {
      locale: context.locale,
      key: context.key,
    } as I18nContext)

    // 回调配置
    this.errorHandler?.(error, context)

    if (this.debugMode) {
      console.error(`[i18n] Error: ${error.message}`, context)
    }
  }

  /**
   * 批量翻译
   */
  batchTranslate(
    keys: string[],
    params?: Record<string, Record<string, string | number>>
  ): Record<string, string> {
    const result: Record<string, string> = {}
    for (const key of keys) {
      result[key] = this.t(key, params?.[key])
    }
    return result
  }

  /**
   * 创建命名空间翻译器
   */
  createNamespace(prefix: string): {
    t: (key: string, params?: Record<string, string | number>) => string
    batchTranslate: (keys: string[]) => Record<string, string>
    getLocale: () => Locale
  } {
    return {
      t: (key: string, params?: Record<string, string | number>) => {
        return this.t(`${prefix}.${key}`, params)
      },
      batchTranslate: (keys: string[]) => {
        const result: Record<string, string> = {}
        for (const key of keys) {
          result[key] = this.t(`${prefix}.${key}`)
        }
        return result
      },
      getLocale: () => {
        return this.getLocale()
      },
    }
  }

  // ====== Debug & Stats ======

  setDebug(enabled: boolean): void {
    this.debugMode = enabled
  }

  getStats(): EngineStats {
    return {
      locale: this.locale,
      cache: this.cache.getStats(),
      plugins: this.plugins.getRegisteredPlugins(),
      subscriberCount: this.subscribers.size,
      loadedLocales: Array.from(this.translations.keys()),
    }
  }

  destroy(): void {
    this.subscribers.clear()
    this.cache.clear()
    this.plugins.destroyAll()
    this.translations.clear()
  }

  // ====== Persistence ======

  private persistLocale(locale: Locale): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("yyc3-locale", locale)
        document.documentElement.lang = locale
        // 处理 RTL
        if (locale === "ar") {
          document.documentElement.dir = "rtl"
        } else {
          document.documentElement.dir = "ltr"
        }
      } catch {
        // localStorage may be unavailable
      }
    }
  }

  private readStoredLocale(): string | null {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("yyc3-locale")
      } catch {
        return null
      }
    }
    return null
  }

  /**
   * 解析初始语言
   * 优先级：配置 > 存储 > 系统检测 > 默认
   */
  resolveInitialLocale(defaultLocale?: Locale): Locale {
    if (defaultLocale) return defaultLocale

    const stored = this.readStoredLocale()
    const detected = detectSystemLocale(stored)
    return detected.locale
  }

  /**
   * 加载初始语言翻译
   */
  async loadInitialLocale(locale: Locale): Promise<void> {
    this.locale = locale
  }
}

// ====== 全局便捷实例 ======

/**
 * 全局单例 I18nEngine 实例
 */
export const i18n = new I18nEngine()

/**
 * 全局便捷翻译函数
 */
export const t = (key: string, params?: Record<string, string | number>): string =>
  i18n.t(key, params)

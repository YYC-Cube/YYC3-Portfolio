/**
 * @fileoverview 插件系统与内置插件
 * @description 提供可扩展的生命周期钩子系统，以及 ConsoleLogger、MissingKeyReporter、PerformanceTracker 内置插件
 */

import type {
  ConsoleLoggerConfig,
  I18nContext,
  I18nPlugin,
  Locale,
  MissingKeyEntry,
  MissingKeyReporterConfig,
  PerformanceEntry,
  PerformanceMetrics,
  PerformanceTrackerConfig,
} from "./types"

/**
 * 插件管理器
 * 管理插件的注册、注销和生命周期钩子调用
 */
export class PluginManager {
  private plugins: Map<string, I18nPlugin> = new Map()

  /**
   * 注册插件
   */
  register(plugin: I18nPlugin): void {
    this.plugins.set(plugin.name, plugin)
  }

  /**
   * 注销插件
   */
  unregister(name: string): boolean {
    return this.plugins.delete(name)
  }

  /**
   * 获取已注册的插件
   */
  getPlugin(name: string): I18nPlugin | undefined {
    return this.plugins.get(name)
  }

  /**
   * 获取所有已注册的插件名称列表
   */
  getRegisteredPlugins(): string[] {
    return Array.from(this.plugins.keys())
  }

  /**
   * 初始化所有插件
   */
  async initAll(context: I18nContext): Promise<void> {
    for (const plugin of this.plugins.values()) {
      await plugin.init?.(context)
    }
  }

  /**
   * 销毁所有插件
   */
  async destroyAll(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      await plugin.destroy?.()
    }
    this.plugins.clear()
  }

  /**
   * 执行 beforeTranslate 钩子
   */
  executeBeforeTranslate(
    key: string,
    params?: Record<string, string>
  ): { key: string; params?: Record<string, string> } {
    let result: { key: string; params?: Record<string, string> } = {
      key,
      params,
    }
    for (const plugin of this.plugins.values()) {
      const hookResult = plugin.beforeTranslate?.(result.key, result.params)
      if (hookResult) {
        result = hookResult
      }
    }
    return result
  }

  /**
   * 执行 afterTranslate 钩子
   */
  executeAfterTranslate(
    result: string,
    key: string,
    params?: Record<string, string>
  ): string {
    let finalResult = result
    for (const plugin of this.plugins.values()) {
      const hookResult = plugin.afterTranslate?.(finalResult, key, params)
      if (hookResult !== undefined && hookResult !== null) {
        finalResult = hookResult
      }
    }
    return finalResult
  }

  /**
   * 通知所有插件语言变更
   */
  notifyLocaleChange(newLocale: Locale, oldLocale: Locale): void {
    for (const plugin of this.plugins.values()) {
      plugin.onLocaleChange?.(newLocale, oldLocale)
    }
  }

  /**
   * 通知所有插件错误
   */
  handleError(error: Error, context: I18nContext): void {
    for (const plugin of this.plugins.values()) {
      plugin.onError?.(error, context)
    }
  }

  /**
   * 通知所有插件缺失键
   */
  handleMissingKey(key: string, locale: Locale): string | undefined {
    for (const plugin of this.plugins.values()) {
      const result = plugin.onMissingKey?.(key, locale)
      if (result !== undefined) return result
    }
    return undefined
  }
}

// ====== Built-in Plugins ======

const DEFAULT_CONSOLE_COLORS = {
  translate: "#3b82f6",
  missing: "#ef4444",
  localeChange: "#10b981",
  performance: "#f59e0b",
}

/**
 * 创建控制台日志插件
 */
export function createConsoleLogger(
  config?: ConsoleLoggerConfig
): I18nPlugin {
  return {
    name: "console-logger",
    version: "1.0.0",

    beforeTranslate(key: string, params?: Record<string, string>) {
      if (config?.logTranslations) {
        console.log(
          `%c[i18n] translate: ${key}`,
          `color: ${config.colors?.translate ?? DEFAULT_CONSOLE_COLORS.translate}`,
          params ? params : ""
        )
      }
    },

    onLocaleChange(newLocale: Locale, oldLocale: Locale) {
      if (config?.logLocaleChanges) {
        console.log(
          `%c[i18n] locale changed: ${oldLocale} → ${newLocale}`,
          `color: ${config.colors?.localeChange ?? DEFAULT_CONSOLE_COLORS.localeChange}`
        )
      }
    },

    onMissingKey(key: string, locale: Locale) {
      if (config?.logMissingKeys ?? true) {
        console.warn(
          `%c[i18n] missing key: "${key}" for locale "${locale}"`,
          `color: ${config?.colors?.missing ?? DEFAULT_CONSOLE_COLORS.missing}`
        )
      }
    },

    onError(error: Error, context: I18nContext) {
      console.error(
        `%c[i18n] error: ${error.message}`,
        `color: ${DEFAULT_CONSOLE_COLORS.missing}`,
        context
      )
    },
  }
}

/**
 * 缺失键报告器
 */
export class MissingKeyReporter {
  private entries: MissingKeyEntry[] = []
  private config: Required<
    Omit<MissingKeyReporterConfig, "onReport">
  > & { onReport?: (entries: MissingKeyEntry[]) => void }
  private exportTimer?: ReturnType<typeof setInterval>

  constructor(config?: MissingKeyReporterConfig) {
    this.config = {
      maxEntries: 1000,
      autoExport: false,
      exportInterval: 5 * 60 * 1000,
      onReport: undefined,
      ...config,
    }

    if (this.config.autoExport && !this.exportTimer) {
      this.startAutoExport()
    }
  }

  createPlugin(): I18nPlugin {
    return {
      name: "missing-key-reporter",
      version: "1.0.0",

      onMissingKey: (key: string, locale: Locale): string | void => {
        this.record(key, locale)
      },

      destroy: () => {
        this.stopAutoExport()
      },
    }
  }

  private record(key: string, locale: Locale): void {
    if (this.entries.length >= this.config.maxEntries) return

    const existing = this.entries.find(
      (e) => e.key === key && e.locale === locale
    )
    if (existing) {
      existing.count++
    } else {
      this.entries.push({
        key,
        locale,
        timestamp: Date.now(),
        count: 1,
      })
    }

    this.config.onReport?.(this.entries)
  }

  getMissingKeys(): MissingKeyEntry[] {
    return [...this.entries]
  }

  getUniqueMissingCount(): number {
    return this.entries.length
  }

  getTotalMisses(): number {
    return this.entries.reduce((sum, e) => sum + e.count, 0)
  }

  getByLocale(locale: Locale): MissingKeyEntry[] {
    return this.entries.filter((e) => e.locale === locale)
  }

  generateReport(): string {
    if (this.entries.length === 0) return "No missing keys found."

    const lines = [
      `=== Missing Keys Report ===`,
      `Total unique missing keys: ${this.getUniqueMissingCount()}`,
      `Total misses: ${this.getTotalMisses()}`,
      ``,
      `Keys:`,
    ]

    for (const entry of this.entries) {
      lines.push(
        `  [${entry.locale}] "${entry.key}" — ${entry.count} time(s) (first: ${new Date(entry.timestamp).toISOString()})`
      )
    }

    return lines.join("\n")
  }

  exportJSON(): string {
    return JSON.stringify(this.entries, null, 2)
  }

  clear(): void {
    this.entries = []
  }

  private startAutoExport(): void {
    this.exportTimer = setInterval(() => {
      if (this.entries.length > 0) {
        console.log(
          `[i18n] Auto-export missing keys (${this.entries.length} entries):`
        )
        console.log(this.exportJSON())
      }
    }, this.config.exportInterval)
  }

  stopAutoExport(): void {
    if (this.exportTimer) {
      clearInterval(this.exportTimer)
      this.exportTimer = undefined
    }
  }

  destroy(): void {
    this.stopAutoExport()
    this.clear()
  }
}

/**
 * 性能追踪器
 */
export class PerformanceTracker {
  private entries: PerformanceEntry[] = []
  private config: Required<PerformanceTrackerConfig>
  private timingMap = new Map<string, number>()

  constructor(config?: PerformanceTrackerConfig) {
    this.config = {
      slowThreshold: 10,
      maxSlowEntries: 50,
      samplingRate: 1,
      ...config,
    }
  }

  createPlugin(): I18nPlugin {
    return {
      name: "performance-tracker",
      version: "1.0.0",

      beforeTranslate: (key: string) => {
        this.timingMap.set(key, performance.now())
      },

      afterTranslate: (_result: string, key: string) => {
        const startTime = this.timingMap.get(key)
        if (startTime === undefined) return

        const duration = performance.now() - startTime
        this.timingMap.delete(key)

        // Sampling
        if (Math.random() > this.config.samplingRate) return

        const entry: PerformanceEntry = {
          key,
          duration,
          timestamp: Date.now(),
          cached: duration < 0.1, // heuristic: <0.1ms likely cached
        }
        this.entries.push(entry)

        // Track slow translations
        if (duration >= this.config.slowThreshold) {
          this.trackSlowTranslation(entry)
        }

        // Limit entries
        if (this.entries.length > 10000) {
          this.entries = this.entries.slice(-5000)
        }
      },
    }
  }

  private trackSlowTranslation(entry: PerformanceEntry): void {
    console.warn(
      `[i18n] Slow translation: "${entry.key}" took ${entry.duration.toFixed(2)}ms`
    )
  }

  getMetrics(): PerformanceMetrics {
    if (this.entries.length === 0) {
      return {
        totalCalls: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageDuration: 0,
        maxDuration: 0,
        slowTranslations: [],
      }
    }

    const durations = this.entries.map((e) => e.duration)
    const max = Math.max(...durations)
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length
    const cacheHits = this.entries.filter((e) => e.cached).length
    const slow = this.entries
      .filter((e) => e.duration >= this.config.slowThreshold)
      .slice(-this.config.maxSlowEntries)

    return {
      totalCalls: this.entries.length,
      cacheHits,
      cacheMisses: this.entries.length - cacheHits,
      averageDuration: avg,
      maxDuration: max,
      slowTranslations: slow,
    }
  }

  getCacheHitRate(): number {
    if (this.entries.length === 0) return 1
    const hits = this.entries.filter((e) => e.cached).length
    return hits / this.entries.length
  }

  getPercentile(percentile: number): number {
    if (this.entries.length === 0) return 0
    const sorted = [...this.entries].sort(
      (a, b) => a.duration - b.duration
    )
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]?.duration ?? 0
  }

  generateReport(): string {
    const metrics = this.getMetrics()
    return [
      `=== Performance Report ===`,
      `Total calls: ${metrics.totalCalls}`,
      `Cache hit rate: ${(this.getCacheHitRate() * 100).toFixed(1)}%`,
      `Average duration: ${metrics.averageDuration.toFixed(3)}ms`,
      `Max duration: ${metrics.maxDuration.toFixed(3)}ms`,
      `P95: ${this.getPercentile(95).toFixed(3)}ms`,
      `P99: ${this.getPercentile(99).toFixed(3)}ms`,
      ``,
      `Slow translations (>${this.config.slowThreshold}ms): ${metrics.slowTranslations.length}`,
    ].join("\n")
  }

  clear(): void {
    this.entries = []
    this.timingMap.clear()
  }

  exportJSON(): string {
    return JSON.stringify(this.entries, null, 2)
  }
}

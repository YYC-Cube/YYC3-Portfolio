"use client"

import { useI18n } from "./provider"
import type { EngineStats, Locale } from "./types"

/**
 * useTranslation - 获取翻译函数和语言信息
 *
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useTranslation()
 * return <h1>{t('app.title')}</h1>
 * ```
 */
export function useTranslation() {
  const { t, locale, setLocale, batchTranslate, createNamespace, getStats } =
    useI18n()

  return {
    t,
    locale,
    setLocale,
    batchTranslate,
    createNamespace,
    getStats,
  }
}

/**
 * useLocaleSwitcher - 仅获取语言切换功能
 *
 * @example
 * ```tsx
 * const { locale, setLocale } = useLocaleSwitcher()
 * return <button onClick={() => setLocale('en')}>English</button>
 * ```
 */
export function useLocaleSwitcher() {
  const { locale, setLocale } = useI18n()
  return { locale, setLocale }
}

/**
 * useLocale - 获取当前语言信息
 *
 * @example
 * ```tsx
 * const locale = useLocale()
 * return <p>Current: {locale}</p>
 * ```
 */
export function useLocale(): Locale {
  return useI18n().locale
}

/**
 * useScopedTranslation - 创建作用域翻译
 * 等同于命名空间，但更语义化
 *
 * @example
 * ```tsx
 * const { t } = useScopedTranslation('common')
 * return <button>{t('save')}</button>  // 等同于 t('common.save')
 * ```
 */
export function useScopedTranslation(scope: string) {
  const { engine, getStats } = useI18n()
  const ns = engine.createNamespace(scope)

  return {
    t: ns.t,
    batchTranslate: ns.batchTranslate,
    getLocale: ns.getLocale,
    getStats,
  }
}

/**
 * useI18nStats - 获取引擎统计信息
 *
 * @example
 * ```tsx
 * const stats = useI18nStats()
 * return <p>Calls: {stats.cache.hits + stats.cache.misses}</p>
 * ```
 */
export function useI18nStats(): EngineStats {
  return useI18n().getStats()
}

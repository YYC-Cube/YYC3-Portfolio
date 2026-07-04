/**
 * @fileoverview 语言自动检测
 * @description 多源自动检测系统语言，支持环境变量、存储、浏览器语言
 */

import type { Locale, LocaleDetectionResult } from "./types"
import { SUPPORTED_LOCALES } from "./types"

/**
 * 检测是否为中文环境
 */
export function isChineseLocale(locale: Locale): boolean {
  return locale === "zh-CN" || locale === "zh-TW"
}

/**
 * 规范化语言代码
 * @example normalizeLocale('zh_cn') // "zh-CN"
 * @example normalizeLocale('EN-US') // "en"
 */
export function normalizeLocale(locale: string): Locale | null {
  const normalized = locale.replace(/[_-]/g, "-").toLowerCase()

  // Direct match
  const direct = SUPPORTED_LOCALES.find(
    (l) => l.toLowerCase() === normalized
  )
  if (direct) return direct

  // Language-only match (e.g., "en" from "en-US")
  const langPrefix = normalized.split("-")[0]
  const langMatch = SUPPORTED_LOCALES.find(
    (l) => l.toLowerCase().startsWith(langPrefix)
  )
  if (langMatch) return langMatch

  return null
}

/**
 * 多源自动检测系统语言
 * 检测优先级：
 * 1. 环境变量 (NEXT_LOCALE, PUBLIC_LOCALE)
 * 2. LocalStorage 存储值
 * 3. 浏览器/系统语言
 * 4. 默认值 (en)
 */
export function detectSystemLocale(
  storedLocale?: string | null
): LocaleDetectionResult {
  // 1. Check stored locale (from localStorage or cookie)
  if (storedLocale) {
    const normalized = normalizeLocale(storedLocale)
    if (normalized) {
      return { locale: normalized, source: "storage", confidence: 0.9 }
    }
  }

  // 2. Check environment variables
  if (typeof process !== "undefined") {
    const envLocale =
      process.env.NEXT_PUBLIC_LOCALE ??
      process.env.NEXT_LOCALE ??
      process.env.PUBLIC_LOCALE
    if (envLocale) {
      const normalized = normalizeLocale(envLocale)
      if (normalized) {
        return { locale: normalized, source: "env", confidence: 0.85 }
      }
    }
  }

  // 3. Check browser/system language
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language || navigator.languages?.[0]
    if (browserLang) {
      const normalized = normalizeLocale(browserLang)
      if (normalized) {
        return { locale: normalized, source: "system", confidence: 0.7 }
      }
    }
  }

  // 4. Default
  return { locale: "en", source: "default", confidence: 0.3 }
}

/**
 * 将语言代码映射到友好的显示名称
 */
export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "English",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
    ja: "日本語",
    ko: "한국어",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    "pt-BR": "Português (Brasil)",
    ar: "العربية",
  }
  return labels[locale] ?? locale
}

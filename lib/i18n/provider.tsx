"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { I18nEngine, type Locale } from "./engine"
import type { TranslationMap, I18nEngineConfig, EngineStats } from "./types"
import zhCN from "./locales/zh-CN"
import en from "./locales/en"
import zhTW from "./locales/zh-TW"
import ja from "./locales/ja"
import ko from "./locales/ko"
import fr from "./locales/fr"
import de from "./locales/de"
import es from "./locales/es"
import ptBR from "./locales/pt-BR"
import ar from "./locales/ar"

export { type Locale, type TranslationMap, type I18nEngineConfig }

/** 所有内置语言翻译映射 */
const BUILTIN_LOCALES: Record<string, TranslationMap> = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  en,
  ja,
  ko,
  fr,
  de,
  es,
  "pt-BR": ptBR,
  ar,
}

export interface I18nContextValue {
  engine: I18nEngine
  locale: Locale
  setLocale: (locale: Locale) => Promise<void>
  t: (key: string, params?: Record<string, string | number>) => string
  /** 批量翻译 */
  batchTranslate: (
    keys: string[],
    params?: Record<string, Record<string, string | number>>
  ) => Record<string, string>
  /** 创建命名空间 */
  createNamespace: (prefix: string) => {
    t: (key: string, params?: Record<string, string | number>) => string
    batchTranslate: (keys: string[]) => Record<string, string>
    getLocale: () => Locale
  }
  /** 获取引擎统计 */
  getStats: () => EngineStats
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  children: React.ReactNode
  /** 初始语言 */
  defaultLocale?: Locale
  /** 回退语言 */
  fallbackLocale?: Locale
  /** 引擎配置 */
  config?: Omit<I18nEngineConfig, "locale" | "fallbackLocale">
  /** 注册额外 locale */
  extraLocales?: Record<string, TranslationMap>
}

function createEngine(
  locale: Locale,
  fallbackLocale: Locale,
  config?: I18nProviderProps["config"]
) {
  const engine = new I18nEngine({
    locale,
    fallbackLocale: fallbackLocale ?? "zh-CN",
    ...config,
  })

  // 注册内置翻译
  for (const [l, map] of Object.entries(BUILTIN_LOCALES)) {
    engine.registerTranslation(l as Locale, map)
  }

  return engine
}

export function I18nProvider({
  children,
  defaultLocale: initialLocale,
  fallbackLocale,
  config,
  extraLocales,
}: I18nProviderProps) {
  // 初始值统一使用默认 locale，避免 SSR/CSR hydration mismatch
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? "zh-CN"
  )

  const [engine] = useState(() => {
    const eng = createEngine(locale, fallbackLocale ?? "zh-CN", config)
    // 注册额外 locale
    if (extraLocales) {
      for (const [l, map] of Object.entries(extraLocales)) {
        eng.registerTranslation(l as Locale, map)
      }
    }
    return eng
  })

  // 客户端 mount 后从 localStorage 恢复语言偏好
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yyc3-locale") as Locale | null
      if (stored && BUILTIN_LOCALES[stored] && stored !== locale) {
        setLocaleState(stored)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 语言切换时更新 engine
  useEffect(() => {
    if (locale !== engine.getLocale()) {
      engine.setLocale(locale)
    }
    // 持久化
    if (typeof window !== "undefined") {
      localStorage.setItem("yyc3-locale", locale)
      document.documentElement.lang = locale
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    }
  }, [locale, engine])

  const setLocale = useCallback(
    async (l: Locale) => {
      setLocaleState(l)
    },
    []
  )

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      engine.t(key, params),
    [engine]
  )

  const batchTranslate = useCallback(
    (keys: string[], params?: Record<string, Record<string, string | number>>) =>
      engine.batchTranslate(keys, params),
    [engine]
  )

  const createNamespaceFn = useCallback(
    (prefix: string) => engine.createNamespace(prefix),
    [engine]
  )

  const getStats = useCallback(() => engine.getStats(), [engine])

  const value = useMemo<I18nContextValue>(
    () => ({
      engine,
      locale,
      setLocale,
      t,
      batchTranslate,
      createNamespace: createNamespaceFn,
      getStats,
    }),
    [engine, locale, setLocale, t, batchTranslate, createNamespaceFn, getStats]
  )

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

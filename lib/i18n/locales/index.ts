/**
 * @fileoverview 语言包入口 — 提供静态导入和动态加载两种模式
 */

import type { TranslationMap } from "../types"

// 静态导入（适用于必需的核心语言）
export { default as zhCN } from "./zh-CN"
export { default as en } from "./en"

// 动态加载映射表
export const LOCALE_IMPORTS: Record<string, () => Promise<TranslationMap>> = {
  "zh-TW": () => import("./zh-TW").then((m) => m.default),
  ja: () => import("./ja").then((m) => m.default),
  ko: () => import("./ko").then((m) => m.default),
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
  es: () => import("./es").then((m) => m.default),
  "pt-BR": () => import("./pt-BR").then((m) => m.default),
  ar: () => import("./ar").then((m) => m.default),
}

/**
 * 动态加载语言包
 * 适用于懒加载场景，减少初始 bundle 体积
 */
export async function loadLocale(locale: string): Promise<TranslationMap | null> {
  const loader = LOCALE_IMPORTS[locale]
  if (loader) {
    return loader()
  }
  return null
}

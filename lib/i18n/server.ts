/**
 * @fileoverview 服务端 i18n 工具
 * @description 提供 Next.js App Router 服务端组件的 i18n 支持
 *
 * 参考: docs/i18n-core/docs/guide/examples.md — Next.js App Router 集成
 */

import { cookies } from "next/headers"
import { i18n } from "./engine"
import { LOCALE_IMPORTS } from "./locales"
import type { Locale } from "./types"

/**
 * 从 Cookie 获取服务端 locale
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies()
    const locale = cookieStore.get("yyc3-locale")?.value as Locale | undefined
    if (locale && i18n.getTranslations(locale)) {
      return locale
    }
  } catch {
    // cookies() 在构建时可能不可用
  }
  return "zh-CN"
}

/**
 * 获取服务端翻译函数
 * 用于 Server Component
 *
 * @example
 * ```tsx
 * // app/page.tsx (Server Component)
 * import { getTranslations } from "@/lib/i18n/server"
 *
 * export default async function Page() {
 *   const { t } = await getTranslations('hero')
 *   return <h1>{t('title')}</h1>
 * }
 * ```
 */
export async function getTranslations(namespace?: string) {
  const locale = await getServerLocale()

  // 确保当前 locale 已注册
  if (!i18n.getTranslations(locale)) {
    // 尝试动态加载
    const loader = LOCALE_IMPORTS[locale]
    if (loader) {
      const map = await loader()
      if (map) {
        i18n.registerTranslation(locale, map)
      }
    }
    // 确保当前 locale 生效
    if (i18n.getLocale() !== locale) {
      await i18n.setLocale(locale)
    }
  }

  const translate = (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return i18n.t(fullKey, params)
  }

  return { t: translate, locale }
}

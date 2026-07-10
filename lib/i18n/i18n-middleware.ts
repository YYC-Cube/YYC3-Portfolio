/**
 * @fileoverview Next.js i18n Middleware
 * @description 基于 @yyc3/i18n-core 示例实现的服务端语言检测中间件
 */

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { normalizeLocale } from "./detector"
import { SUPPORTED_LOCALES } from "./types"

/**
 * 从请求中提取语言
 * 优先级：URL path > Cookie > Accept-Language > 默认
 */
export function extractLocale(request: NextRequest, defaultLocale = "zh-CN"): string {
  // 1. 从 URL path 检测
  const pathname = request.nextUrl.pathname
  const pathLocale = SUPPORTED_LOCALES.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )
  if (pathLocale) return pathLocale

  // 2. 从 Cookie 检测
  const cookieLocale = request.cookies.get("yyc3-locale")?.value
  if (cookieLocale) {
    const normalized = normalizeLocale(cookieLocale)
    if (normalized) return normalized
  }

  // 3. 从 Accept-Language Header 检测
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const browserLang = acceptLanguage.split(",")[0].trim().split("-")[0]
    const matched = SUPPORTED_LOCALES.find((l) => l.startsWith(browserLang))
    if (matched) return matched
  }

  return defaultLocale
}

/**
 * 创建 i18n 中间件
 * 用于 Next.js App Router
 *
 * 使用方式:
 * ```ts
 * // middleware.ts
 * export { i18nMiddleware as default } from "@/lib/i18n/i18n-middleware"
 * ```
 */
export function i18nMiddleware(request: NextRequest) {
  const locale = extractLocale(request)

  // 设置 Cookie
  const response = NextResponse.next()
  response.cookies.set("yyc3-locale", locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  })

  return response
}

export const i18nMiddlewareConfig = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}

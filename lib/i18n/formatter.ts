/**
 * @fileoverview 翻译格式化工具集
 * @description 提供插值、复数、相对时间等格式化功能
 */

import type { TranslateParams } from "./types"

/**
 * 模板插值
 * @example interpolate('Hello {{name}}', { name: 'World' }) // "Hello World"
 */
export function interpolate(
  template: string,
  params?: TranslateParams
): string {
  if (!params) return template
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key: string) => String(params[key] ?? match)
  )
}

/**
 * 简单复数处理（适用于没有 ICU 的简单场景）
 * 规则：模板中 (s) 在 count !== 1 时替换为 's'，否则替换为空
 * @example pluralize('{{count}} item(s)', 1) // "1 item"
 * @example pluralize('{{count}} item(s)', 5) // "5 items"
 */
export function pluralize(template: string, count: number): string {
  const resolved = interpolate(template, { count: String(count) })
  if (count === 1) {
    return resolved.replace(/\(s\)/g, "")
  }
  return resolved.replace(/\(s\)/g, "s")
}

const RELATIVE_TIME_UNITS = [
  { label: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { label: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { label: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { label: "day", ms: 24 * 60 * 60 * 1000 },
  { label: "hour", ms: 60 * 60 * 1000 },
  { label: "minute", ms: 60 * 1000 },
  { label: "second", ms: 1000 },
] as const

// 中文相对时间映射
const ZH_RELATIVE: Record<string, [string, string]> = {
  year: ["1 年前", "{n} 年前"],
  month: ["1 个月前", "{n} 个月前"],
  week: ["1 周前", "{n} 周前"],
  day: ["1 天前", "{n} 天前"],
  hour: ["1 小时前", "{n} 小时前"],
  minute: ["1 分钟前", "{n} 分钟前"],
  second: ["刚刚", "{n} 秒前"],
}

// 英文相对时间映射
const EN_RELATIVE: Record<string, [string, string]> = {
  year: ["1 year ago", "{n} years ago"],
  month: ["1 month ago", "{n} months ago"],
  week: ["1 week ago", "{n} weeks ago"],
  day: ["1 day ago", "{n} days ago"],
  hour: ["1 hour ago", "{n} hours ago"],
  minute: ["1 minute ago", "{n} minutes ago"],
  second: ["just now", "{n} seconds ago"],
}

/**
 * 格式化相对时间
 * @example formatRelativeTime(Date.now() - 3600000, 'zh-CN') // "1 小时前"
 * @example formatRelativeTime(Date.now() - 86400000, 'en') // "1 day ago"
 */
export function formatRelativeTime(
  timestamp: number,
  locale: string = "zh-CN"
): string {
  const diff = Date.now() - timestamp
  const absDiff = Math.abs(diff)

  for (const unit of RELATIVE_TIME_UNITS) {
    if (absDiff >= unit.ms) {
      const count = Math.floor(absDiff / unit.ms)
      const map = locale.startsWith("zh") ? ZH_RELATIVE : EN_RELATIVE
      const [single, plural] = map[unit.label]
      return count === 1 ? single : plural.replace("{n}", String(count))
    }
  }

  // Default to seconds
  const map = locale.startsWith("zh") ? ZH_RELATIVE : EN_RELATIVE
  return map["second"][0]
}

/**
 * 安全地获取嵌套翻译值
 * @internal
 */
export function resolveTranslationPath(
  map: Record<string, unknown>,
  key: string
): unknown {
  let value: unknown = map
  for (const part of key.split(".")) {
    if (value && typeof value === "object" && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return value
}

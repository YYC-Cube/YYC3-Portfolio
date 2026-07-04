/**
 * @fileoverview RTL（从右到左）语言工具集
 */

import type { RTLLocale, TextDirection, HorizontalAlignment, SpacingProperty } from "./types"

const RTL_LOCALES: RTLLocale[] = ["ar"]

export { RTL_LOCALES }

/** 检测语言是否为 RTL 方向 */
export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as RTLLocale)
}

/** 获取文本方向 */
export function getDirection(locale: string): TextDirection {
  return isRTL(locale) ? "rtl" : "ltr"
}

/** 获取适当的水平对齐方式 */
export function getAlignment(locale: string): HorizontalAlignment {
  return isRTL(locale) ? "right" : "left"
}

/** 获取相反的对齐方式 */
export function getOppositeAlignment(locale: string): HorizontalAlignment {
  return isRTL(locale) ? "left" : "right"
}

/** 翻转间距属性 */
export function flipSpacing(
  locale: string,
  property: SpacingProperty,
  value: string
): Record<string, string> {
  if (!isRTL(locale)) return { [property]: value }
  const flipMap: Record<SpacingProperty, SpacingProperty> = {
    marginLeft: "marginRight",
    marginRight: "marginLeft",
    paddingLeft: "paddingRight",
    paddingRight: "paddingLeft",
  }
  return { [flipMap[property]]: value }
}

/** 镜像水平定位 */
export function mirrorPosition(
  locale: string,
  position: { left?: string; right?: string } | null | undefined
): { left?: string; right?: string } | null | undefined {
  if (!position || !isRTL(locale)) return position
  const { left, right, ...rest } = position
  return { ...rest, left: right, right: left }
}

/** 为 RTL 上下文转换 CSS 类名 */
export function transformClassForRTL(locale: string, className: string): string {
  if (!isRTL(locale)) return className
  return className
    .replace(/\bleft\b/g, "__rtl_temp__")
    .replace(/\bright\b/g, "left")
    .replace(/__rtl_temp__/g, "right")
}

/** 设置文档方向和语言属性 */
export function setupDocumentDirection(locale: string, doc?: Document): void {
  const d = doc ?? (typeof document !== "undefined" ? document : undefined)
  if (!d) return
  d.documentElement.lang = locale
  d.documentElement.dir = getDirection(locale)
}

/** 创建镜像布局配置 */
export function createMirroredLayout<T extends Record<string, string>>(
  locale: string,
  ltrConfig: T
): T {
  if (!isRTL(locale)) return ltrConfig
  const mirrored = { ...ltrConfig }
  const swapKeys = [
    ["left", "right"],
    ["marginLeft", "marginRight"],
    ["paddingLeft", "paddingRight"],
    ["borderLeft", "borderRight"],
  ] as const
  for (const [a, b] of swapKeys) {
    if (a in mirrored && b in mirrored) {
      ;[mirrored[a as keyof T], mirrored[b as keyof T]] = [
        mirrored[b as keyof T],
        mirrored[a as keyof T],
      ]
    }
  }
  return mirrored
}

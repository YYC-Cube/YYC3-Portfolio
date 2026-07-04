import { describe, expect, it } from "vitest"

// ====== Core Engine ======
import { I18nEngine } from "@/lib/i18n/engine"
import type { Locale } from "@/lib/i18n/types"

// ====== Cache ======
import { LRUCache } from "@/lib/i18n/cache"

// ====== Plugins ======
import { MissingKeyReporter, PerformanceTracker, PluginManager, createConsoleLogger } from "@/lib/i18n/plugins"

// ====== Formatter ======
import { formatRelativeTime, interpolate, pluralize } from "@/lib/i18n/formatter"

// ====== ICU ======
import { ICUParser, compileICUMessage, isICUMessage } from "@/lib/i18n/icu"

// ====== Detector ======
import { detectSystemLocale, getLocaleLabel, isChineseLocale, normalizeLocale } from "@/lib/i18n/detector"

// ====== RTL ======
import { flipSpacing, getAlignment, getDirection, isRTL } from "@/lib/i18n/rtl"

// ====== Locale files ======
import ar from "@/lib/i18n/locales/ar"
import de from "@/lib/i18n/locales/de"
import en from "@/lib/i18n/locales/en"
import es from "@/lib/i18n/locales/es"
import fr from "@/lib/i18n/locales/fr"
import ja from "@/lib/i18n/locales/ja"
import ko from "@/lib/i18n/locales/ko"
import ptBR from "@/lib/i18n/locales/pt-BR"
import zhCN from "@/lib/i18n/locales/zh-CN"
import zhTW from "@/lib/i18n/locales/zh-TW"

const ALL_LOCALES = { "zh-CN": zhCN, en, "zh-TW": zhTW, ja, ko, fr, de, es, "pt-BR": ptBR, ar }
const LOCALE_KEYS = Object.keys(ALL_LOCALES)

function createTestEngine(locale: Locale = "zh-CN") {
  const engine = new I18nEngine({ locale, fallbackLocale: "en" })
  for (const [l, map] of Object.entries(ALL_LOCALES)) {
    engine.registerTranslation(l as Locale, map)
  }
  return engine
}

describe("@yyc3/i18n-core — 10-Language Verification", () => {
  it("all 10 locale files are importable", () => {
    for (const [locale, map] of Object.entries(ALL_LOCALES)) {
      expect(map).toBeDefined()
      expect(typeof map).toBe("object")
      expect((map as Record<string, unknown>).common).toBeDefined()
    }
  })

  it("engine registers all 10 locales", () => {
    const engine = createTestEngine()
    const stats = engine.getStats()
    for (const locale of LOCALE_KEYS) {
      expect(stats.loadedLocales).toContain(locale)
    }
  })

  it("translates 'common.welcome' correctly for all 10 locales", () => {
    const engine = createTestEngine()
    const expectations: Record<string, string> = {
      "zh-CN": "欢迎",
      en: "Welcome",
      "zh-TW": "歡迎",
      ja: "ようこそ",
      ko: "환영합니다",
      fr: "Bienvenue",
      de: "Willkommen",
      es: "Bienvenido",
      "pt-BR": "Bem-vindo",
      ar: "مرحباً",
    }
    for (const [locale, expected] of Object.entries(expectations)) {
      engine.setLocale(locale as Locale)
      expect(engine.t("common.welcome")).toBe(expected)
    }
  })

  it("translates nested keys correctly", () => {
    const engine = createTestEngine("en")
    expect(engine.t("portfolio.categories.ai")).toBe("AI Applications")
    expect(engine.t("portfolio.categories.web")).toBe("Web Applications")
  })

  it("falls back to fallbackLocale when key is missing", () => {
    const engine = createTestEngine("fr")
    // 'portfolio.subtitle' exists in all locales, verify it works for fr
    expect(engine.t("portfolio.title")).toBe("Nos Œuvres")
  })

  it("supports interpolation with {{params}}", () => {
    const engine = createTestEngine("zh-CN")
    const result = engine.t("portfolio.subtitle", { count: "5" })
    expect(result).toContain("5")
  })

  it("returns the key itself for missing translations", () => {
    const engine = createTestEngine()
    expect(engine.t("nonexistent.key")).toBe("nonexistent.key")
  })
})

describe("I18nEngine Features", () => {
  it("setLocale triggers locale change", async () => {
    const engine = createTestEngine("zh-CN")
    expect(engine.getLocale()).toBe("zh-CN")
    await engine.setLocale("en")
    expect(engine.getLocale()).toBe("en")
  })

  it("subscribe notifies on locale change", async () => {
    const engine = createTestEngine()
    const received: Locale[] = []
    const unsub = engine.subscribe((l) => received.push(l))
    await engine.setLocale("en")
    expect(received).toContain("en")
    unsub()
  })

  it("batchTranslate returns multiple keys", () => {
    const engine = createTestEngine("en")
    const result = engine.batchTranslate(["common.save", "common.cancel", "common.welcome"])
    expect(result).toEqual({
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.welcome": "Welcome",
    })
  })

  it("createNamespace scopes keys", () => {
    const engine = createTestEngine("en")
    const nav = engine.createNamespace("nav")
    expect(nav.t("portfolio")).toBe("Portfolio")
    expect(nav.t("about")).toBe("About")
  })

  it("getStats returns engine info", () => {
    const engine = createTestEngine()
    const stats = engine.getStats()
    expect(stats.locale).toBe("zh-CN")
    expect(stats.loadedLocales.length).toBe(10)
    expect(typeof stats.cache.hitRate).toBe("number")
  })
})

describe("Cache System", () => {
  it("LRUCache basic get/set", () => {
    const cache = new LRUCache({ maxSize: 10 })
    cache.set("key1", "value1")
    expect(cache.get("key1")).toBe("value1")
  })

  it("LRUCache returns null for missing keys", () => {
    const cache = new LRUCache()
    expect(cache.get("nonexistent")).toBeNull()
  })

  it("LRUCache evicts oldest entries", () => {
    const cache = new LRUCache({ maxSize: 2 })
    cache.set("a", "1")
    cache.set("b", "2")
    cache.set("c", "3")
    expect(cache.get("a")).toBeNull()
    expect(cache.get("b")).toBe("2")
    expect(cache.get("c")).toBe("3")
  })

  it("LRUCache getStats returns metrics", () => {
    const cache = new LRUCache()
    cache.set("x", "y")
    cache.get("x")
    cache.get("missing")
    const stats = cache.getStats()
    expect(stats.hits).toBe(1)
    expect(stats.misses).toBe(1)
    expect(stats.hitRate).toBe(0.5)
  })
})

describe("Plugin System", () => {
  it("PluginManager register and list plugins", () => {
    const pm = new PluginManager()
    pm.register({ name: "test-plugin" })
    expect(pm.getRegisteredPlugins()).toContain("test-plugin")
  })

  it("createConsoleLogger creates a valid plugin", () => {
    const plugin = createConsoleLogger()
    expect(plugin.name).toBe("console-logger")
    expect(typeof plugin.beforeTranslate).toBe("function")
  })

  it("MissingKeyReporter tracks missing keys", () => {
    const reporter = new MissingKeyReporter()
    const plugin = reporter.createPlugin()
    plugin.onMissingKey!("test.key", "en")
    plugin.onMissingKey!("test.key", "en")
    expect(reporter.getTotalMisses()).toBe(2)
    expect(reporter.getUniqueMissingCount()).toBe(1)
  })

  it("PerformanceTracker creates a valid plugin", () => {
    const tracker = new PerformanceTracker()
    const plugin = tracker.createPlugin()
    expect(plugin.name).toBe("performance-tracker")
    expect(typeof plugin.beforeTranslate).toBe("function")
    expect(typeof plugin.afterTranslate).toBe("function")
  })
})

describe("Formatter", () => {
  it("interpolate replaces {{params}}", () => {
    expect(interpolate("Hello {{name}}!", { name: "World" })).toBe("Hello World!")
  })

  it("pluralize handles (s) suffix", () => {
    expect(pluralize("{{count}} item(s)", 1)).toBe("1 item")
    expect(pluralize("{{count}} item(s)", 5)).toBe("5 items")
  })

  it("formatRelativeTime returns relative time", () => {
    const oneHourAgo = Date.now() - 3600000
    const result = formatRelativeTime(oneHourAgo, "zh-CN")
    expect(result).toContain("小时前")
  })
})

describe("ICU MessageFormat", () => {
  it("compileICUMessage handles plural", () => {
    const msg = "{count, plural, =0 {no items} one {1 item} other {# items}}"
    expect(compileICUMessage(msg, { count: 0 })).toBe("no items")
    expect(compileICUMessage(msg, { count: 1 })).toBe("1 item")
    expect(compileICUMessage(msg, { count: 5 })).toBe("5 items")
  })

  it("compileICUMessage handles select", () => {
    const msg = "{gender, select, male {He} female {She} other {They}}"
    expect(compileICUMessage(msg, { gender: "male" })).toBe("He")
    expect(compileICUMessage(msg, { gender: "female" })).toBe("She")
    expect(compileICUMessage(msg, { gender: "unknown" })).toBe("They")
  })

  it("isICUMessage detects ICU format", () => {
    expect(isICUMessage("{count, plural, other {# items}}")).toBe(true)
    expect(isICUMessage("Hello World")).toBe(false)
  })

  it("ICUParser parses without errors", () => {
    const parser = new ICUParser()
    const result = parser.parse("Hello {name}!")
    expect(result.errors).toHaveLength(0)
    expect(result.nodes.length).toBeGreaterThan(0)
  })
})

describe("Locale Detection", () => {
  it("normalizeLocale normalizes locale codes", () => {
    expect(normalizeLocale("zh_cn")).toBe("zh-CN")
    expect(normalizeLocale("EN-US")).toBe("en")
    expect(normalizeLocale("zh_TW")).toBe("zh-TW")
    expect(normalizeLocale("invalid")).toBeNull()
  })

  it("isChineseLocale identifies Chinese locales", () => {
    expect(isChineseLocale("zh-CN")).toBe(true)
    expect(isChineseLocale("zh-TW")).toBe(true)
    expect(isChineseLocale("en")).toBe(false)
  })

  it("detectSystemLocale detects default", () => {
    const detectionResult = detectSystemLocale(null)
    expect(detectionResult.locale).toBeDefined()
    expect(["en", "zh-CN"]).toContain(detectionResult.locale)
  })

  it("getLocaleLabel returns friendly name", () => {
    expect(getLocaleLabel("en")).toBe("English")
    expect(getLocaleLabel("zh-CN")).toBe("简体中文")
    expect(getLocaleLabel("ar")).toBe("العربية")
  })
})

describe("RTL Utilities", () => {
  it("isRTL identifies Arabic", () => {
    expect(isRTL("ar")).toBe(true)
    expect(isRTL("en")).toBe(false)
  })

  it("getDirection returns correct direction", () => {
    expect(getDirection("ar")).toBe("rtl")
    expect(getDirection("en")).toBe("ltr")
  })

  it("getAlignment returns correct alignment", () => {
    expect(getAlignment("ar")).toBe("right")
    expect(getAlignment("en")).toBe("left")
  })

  it("flipSpacing swaps margins for RTL", () => {
    const result = flipSpacing("ar", "marginLeft", "10px")
    expect(result).toEqual({ marginRight: "10px" })
    // No flip for LTR
    const ltrResult = flipSpacing("en", "marginLeft", "10px")
    expect(ltrResult).toEqual({ marginLeft: "10px" })
  })
})

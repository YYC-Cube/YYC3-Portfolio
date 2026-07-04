/**
 * @fileoverview @yyc3/i18n-core 完整类型定义
 * @description 基于 docs/i18n-core 文档规范实现的类型系统
 */

/** 支持的所有语言 */
export type Locale =
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ja"
  | "ko"
  | "fr"
  | "de"
  | "es"
  | "pt-BR"
  | "ar"

/** RTL 语言子集 */
export type RTLLocale = Extract<Locale, "ar">

/** 文本方向 */
export type TextDirection = "ltr" | "rtl" | "auto"

/** 水平对齐方式 */
export type HorizontalAlignment = "left" | "right"

/** 间距属性 */
export type SpacingProperty =
  | "marginLeft"
  | "marginRight"
  | "paddingLeft"
  | "paddingRight"

/** 翻译映射（支持嵌套键） */
export type TranslationMap = {
  [key: string]: string | TranslationMap
}

/** 引擎回调 - 错误处理 */
export interface ErrorContext {
  key: string
  locale: Locale
}

/** 引擎回调 - 缺失键处理 */
export type MissingKeyHandler = (key: string, locale: Locale) => string

/** 语言变更订阅者 */
export type Subscriber = (locale: Locale) => void

/** I18nEngine 配置 */
export interface I18nEngineConfig {
  locale?: Locale
  fallbackLocale?: Locale
  cache?: {
    enabled?: boolean
    maxSize?: number
    ttl?: number
  }
  debug?: boolean
  onError?: (error: Error, context: ErrorContext) => void
  missingKeyHandler?: MissingKeyHandler
}

/** 引擎统计信息 */
export interface EngineStats {
  locale: Locale
  cache: CacheStats
  plugins: string[]
  subscriberCount: number
  loadedLocales: string[]
}

// ====== Cache System ======

export interface CacheConfig {
  maxSize?: number
  defaultTTL?: number
  enabled?: boolean
}

export interface CacheStats {
  size: number
  maxSize: number
  hits: number
  misses: number
  hitRate: number
  evictions: number
}

// ====== Plugin System ======

export interface I18nContext {
  locale: Locale
  key: string
  params?: Record<string, string>
  result?: string
}

export interface I18nPlugin {
  name: string
  version?: string
  init?: (context: I18nContext) => void | Promise<void>
  destroy?: () => void | Promise<void>
  beforeTranslate?: (
    key: string,
    params?: Record<string, string>
  ) => { key: string; params?: Record<string, string> } | void
  afterTranslate?: (
    result: string,
    key: string,
    params?: Record<string, string>
  ) => string | void
  onLocaleChange?: (newLocale: Locale, oldLocale: Locale) => void
  onError?: (error: Error, context: I18nContext) => void
  onMissingKey?: (key: string, locale: Locale) => string | void
}

export interface ConsoleLoggerConfig {
  logTranslations?: boolean
  logMissingKeys?: boolean
  logLocaleChanges?: boolean
  logPerformance?: boolean
  colors?: {
    translate?: string
    missing?: string
    localeChange?: string
    performance?: string
  }
}

export interface MissingKeyEntry {
  key: string
  locale: Locale
  timestamp: number
  count: number
}

export interface MissingKeyReporterConfig {
  maxEntries?: number
  autoExport?: boolean
  exportInterval?: number
  onReport?: (entries: MissingKeyEntry[]) => void
}

export interface PerformanceEntry {
  key: string
  duration: number
  timestamp: number
  cached: boolean
}

export interface PerformanceMetrics {
  totalCalls: number
  cacheHits: number
  cacheMisses: number
  averageDuration: number
  maxDuration: number
  slowTranslations: PerformanceEntry[]
}

export interface PerformanceTrackerConfig {
  slowThreshold?: number
  maxSlowEntries?: number
  samplingRate?: number
}

// ====== ICU MessageFormat ======

export interface ICULiteral {
  type: "literal"
  value: string
}

export interface ICUArgument {
  type: "argument"
  name: string
}

export interface ICUPluralClause {
  selector: string
  content: ICUNode[]
}

export interface ICUPlural {
  type: "plural"
  name: string
  offset: number
  clauses: ICUPluralClause[]
}

export interface ICUSelectClause {
  selector: string
  content: ICUNode[]
}

export interface ICUSelect {
  type: "select"
  name: string
  clauses: ICUSelectClause[]
}

export interface ICUSelectOrdinal {
  type: "selectOrdinal"
  name: string
  clauses: ICUSelectClause[]
}

export interface ICUNumber {
  type: "number"
  name: string
  format?: string
}

export interface ICUDate {
  type: "date"
  name: string
  format?: "short" | "medium" | "long" | "full"
}

export interface ICUTime {
  type: "time"
  name: string
  format?: "short" | "medium" | "long" | "full"
}

export type ICUNode =
  | ICULiteral
  | ICUArgument
  | ICUPlural
  | ICUSelect
  | ICUSelectOrdinal
  | ICUNumber
  | ICUDate
  | ICUTime

export interface ICUParseError {
  message: string
  position: number
}

export interface ICUParseResult {
  nodes: ICUNode[]
  errors: ICUParseError[]
}

// ====== Locale Detection ======

export interface LocaleDetectionResult {
  locale: Locale
  source: "env" | "system" | "storage" | "default"
  confidence: number
}

// ====== Formatter ======

export interface TranslateParams {
  [key: string]: unknown
}

// ====== AI Provider Types ======

export type AIProviderType =
  | "openai"
  | "ollama"
  | "anthropic"
  | "azure"
  | "custom"

export interface AIProviderConfig {
  type: AIProviderType
  apiKey?: string
  baseUrl?: string
  defaultModel?: string
}

export interface TranslationRequest {
  sourceText: string
  sourceLocale: string
  targetLocale: string
  context?: string
  glossary?: Record<string, string>
  style?: "formal" | "informal" | "technical"
}

export interface TranslationResponse {
  translatedText: string
  qualityScore: number
  provider: AIProviderType
  model: string
  cached: boolean
}

export interface AIProvider {
  readonly type: AIProviderType
  readonly isReady: boolean
  initialize(): Promise<void>
  translate(request: TranslationRequest): Promise<TranslationResponse>
  batchTranslate(
    requests: TranslationRequest[]
  ): Promise<TranslationResponse[]>
  validate(): Promise<boolean>
  dispose(): Promise<void>
}

// ====== 内置语言列表 ======
export const SUPPORTED_LOCALES: Locale[] = [
  "en",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt-BR",
  "ar",
]

export const RTL_LOCALES: RTLLocale[] = ["ar"]

export const LOCALE_LABELS: Record<Locale, string> = {
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

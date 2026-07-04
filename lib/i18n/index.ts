// ====== 核心引擎 ======
export { I18nEngine, i18n, t } from "./engine"
export type { Locale, TranslationMap, I18nEngineConfig } from "./types"

// ====== React 集成 ======
export { I18nProvider, useI18n } from "./provider"
export {
  useTranslation,
  useLocaleSwitcher,
  useLocale,
  useScopedTranslation,
  useI18nStats,
} from "./hooks"

// ====== 缓存系统 ======
export { LRUCache } from "./cache"
export type { CacheConfig, CacheStats } from "./types"

// ====== 插件系统 ======
export { PluginManager, createConsoleLogger, MissingKeyReporter, PerformanceTracker } from "./plugins"
export type {
  I18nPlugin,
  I18nContext,
  ConsoleLoggerConfig,
  MissingKeyEntry,
  MissingKeyReporterConfig,
  PerformanceEntry,
  PerformanceMetrics,
  PerformanceTrackerConfig,
} from "./types"

// ====== 格式化工具 ======
export { interpolate, pluralize, formatRelativeTime } from "./formatter"
export type { TranslateParams } from "./types"

// ====== ICU MessageFormat ======
export { ICUParser, ICUCompiler, compileICUMessage, isICUMessage } from "./icu"

// ====== 语言检测 ======
export { detectSystemLocale, normalizeLocale, isChineseLocale, getLocaleLabel } from "./detector"
export type { LocaleDetectionResult } from "./types"

// ====== RTL 工具 ======
export {
  isRTL,
  getDirection,
  getAlignment,
  getOppositeAlignment,
  flipSpacing,
  mirrorPosition,
  transformClassForRTL,
  setupDocumentDirection,
  createMirroredLayout,
} from "./rtl"

// ====== 类型/常量 ======
export {
  SUPPORTED_LOCALES,
  RTL_LOCALES,
  LOCALE_LABELS,
} from "./types"
export type {
  RTLLocale,
  TextDirection,
  HorizontalAlignment,
  SpacingProperty,
  EngineStats,
  Subscriber,
  ErrorContext,
  MissingKeyHandler,
} from "./types"

// ====== ICU 类型 ======
export type {
  ICULiteral,
  ICUArgument,
  ICUPlural,
  ICUPluralClause,
  ICUSelect,
  ICUSelectClause,
  ICUNode,
  ICUParseResult,
  ICUParseError,
} from "./types"

// ====== AI 翻译类型 ======
export type {
  AIProviderType,
  AIProviderConfig,
  AIProvider,
  TranslationRequest,
  TranslationResponse,
} from "./types"

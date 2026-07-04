type AIProviderType = "openai" | "ollama" | "anthropic" | "azure" | "custom";
interface AIProviderConfig {
    type: AIProviderType;
    apiKey?: string;
    baseUrl?: string;
    defaultModel?: string;
}
interface TranslationRequest {
    sourceText: string;
    sourceLocale: string;
    targetLocale: string;
    context?: string;
    glossary?: Record<string, string>;
    style?: "formal" | "informal" | "technical";
}
interface TranslationResponse {
    translatedText: string;
    qualityScore: number;
    provider: AIProviderType;
    model: string;
    cached: boolean;
}
interface AIProvider {
    readonly type: AIProviderType;
    readonly isReady: boolean;
    initialize(): Promise<void>;
    translate(request: TranslationRequest): Promise<TranslationResponse>;
    batchTranslate(requests: TranslationRequest[]): Promise<TranslationResponse[]>;
    validate(): Promise<boolean>;
    dispose(): Promise<void>;
}
interface AIProviderInfo {
    type: AIProviderType;
    displayName: string;
    isAvailable: boolean;
    isLocal: boolean;
    models: string[];
    defaultModel?: string;
}
interface AIProviderManagerConfig {
    preferLocal?: boolean;
    autoDetect?: boolean;
    /** 缓存最大条目数，默认 500 */
    maxCacheSize?: number;
    /** 缓存 TTL（毫秒），默认 30 分钟 */
    cacheTTL?: number;
}
declare class AIProviderManager {
    private config?;
    private providers;
    private activeProvider;
    private cache;
    constructor(config?: AIProviderManagerConfig | undefined);
    register(provider: AIProvider): void;
    autoDetect(): Promise<AIProviderInfo[]>;
    setActive(type: AIProviderType): void;
    translate(request: TranslationRequest): Promise<TranslationResponse>;
    batchTranslate(requests: TranslationRequest[]): Promise<TranslationResponse[]>;
    private getActiveProvider;
    getActiveProviderType(): AIProviderType | null;
    getRegisteredProviders(): AIProviderType[];
    clearCache(): void;
    disposeAll(): Promise<void>;
}

export { type AIProvider, type AIProviderConfig, type AIProviderInfo, AIProviderManager, type AIProviderManagerConfig, type AIProviderType, type TranslationRequest, type TranslationResponse };

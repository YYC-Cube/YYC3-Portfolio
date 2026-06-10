import type { ModelEntry } from "@/app/components/ai-assistant/hooks/useAIConfig"
import { useAIConfig } from "@/app/components/ai-assistant/hooks/useAIConfig"
import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// ---------- helpers ----------

function renderHook<T>(hook: () => T) {
  const result: { current: T } = { current: null as unknown as T }
  function TestComponent() { result.current = hook(); return null }
  render(<TestComponent />)
  return result
}

// ---------- mocks ----------

const mockModels: ModelEntry[] = [
  { id: "llama3.2", name: "Llama 3.2", provider: "ollama", isLocal: true, baseUrl: "http://localhost:11434" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", isLocal: false, baseUrl: "https://api.openai.com" },
]

const mockModelProvider = {
  availableModels: mockModels,
  ollamaLoading: false,
  ollamaUrl: "http://localhost:11434",
  setOllamaUrl: vi.fn(),
  rescan: vi.fn().mockResolvedValue(undefined),
  addModel: vi.fn(),
  removeModel: vi.fn(),
}

let settingsStore: Record<string, string> = {}

vi.mock("@/app/components/ai-assistant/hooks/stubs/useModelProvider", () => ({
  useModelProvider: () => mockModelProvider,
}))

beforeEach(() => {
  settingsStore = {
    aiApiKey: "test-key-123",
    aiModel: "",
    aiTemperature: "0.5",
    aiTopP: "0.8",
    aiMaxTokens: "4096",
    aiBaseUrl: "",
  }
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => {
      if (key === "yyc3_settings") return JSON.stringify(settingsStore)
      return null
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  })
  vi.stubGlobal("fetch", vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ---------- tests ----------

describe("useAIConfig", () => {
  it("返回完整的配置接口", async () => {
    const result = renderHook(() => useAIConfig())
    const config = result.current

    // 核心配置项
    expect(config.apiKey).toBe("test-key-123")
    expect(config.temperature).toBe(0.5)
    expect(config.topP).toBe(0.8)
    expect(config.maxTokens).toBe(4096)
    expect(config.showApiKey).toBe(false)

    // 模型管理接口
    expect(config.availableModels).toBe(mockModels)
    expect(config.ollamaLoading).toBe(false)
    expect(config.ollamaUrl).toBe("http://localhost:11434")
    expect(typeof config.setOllamaUrl).toBe("function")
    expect(typeof config.rescanModels).toBe("function")
    expect(typeof config.addModel).toBe("function")
    expect(typeof config.removeModel).toBe("function")
    expect(typeof config.setShowApiKey).toBe("function")
  })

  it("当没有选择模型时，自动选择第一个可用模型", async () => {
    const result = renderHook(() => useAIConfig())
    await vi.waitFor(() => {
      expect(result.current.selectedModel).toBe("llama3.2")
    })
  })

  it("setApiKey 更新 API Key", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.setApiKey("new-key-456")
    await vi.waitFor(() => expect(result.current.apiKey).toBe("new-key-456"))
  })

  it("setTemperature 更新温度值", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.setTemperature(1.2)
    await vi.waitFor(() => expect(result.current.temperature).toBe(1.2))
  })

  it("setTopP 更新 TopP 值", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.setTopP(0.5)
    await vi.waitFor(() => expect(result.current.topP).toBe(0.5))
  })

  it("setMaxTokens 更新 MaxTokens 值", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.setMaxTokens(8192)
    await vi.waitFor(() => expect(result.current.maxTokens).toBe(8192))
  })

  it("setShowApiKey 切换 API Key 显示状态", async () => {
    const result = renderHook(() => useAIConfig())
    expect(result.current.showApiKey).toBe(false)
    result.current.setShowApiKey(true)
    await vi.waitFor(() => expect(result.current.showApiKey).toBe(true))
  })

  it("setSelectedModel 切换选中的模型", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.setSelectedModel("gpt-4o")
    await vi.waitFor(() => expect(result.current.selectedModel).toBe("gpt-4o"))
  })

  it("setOllamaUrl 代理到 modelProvider", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.setOllamaUrl("http://192.168.1.100:11434")
    expect(mockModelProvider.setOllamaUrl).toHaveBeenCalledWith("http://192.168.1.100:11434")
  })

  it("addModel 代理到 modelProvider", async () => {
    const result = renderHook(() => useAIConfig())
    const newModel = { name: "Test", provider: "openai" as const, isLocal: false }
    result.current.addModel(newModel)
    expect(mockModelProvider.addModel).toHaveBeenCalledWith(newModel)
  })

  it("removeModel 代理到 modelProvider", async () => {
    const result = renderHook(() => useAIConfig())
    result.current.removeModel("llama3.2")
    expect(mockModelProvider.removeModel).toHaveBeenCalledWith("llama3.2")
  })
})

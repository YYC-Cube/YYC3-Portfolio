import { useModelProvider, type ModelEntry } from "@/app/components/ai-assistant/hooks/stubs/useModelProvider";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ---------- helpers ----------

function renderHook<T>(hook: () => T) {
  const result: { current: T } = { current: null as unknown as T }
  function TestComponent() { result.current = hook(); return null }
  render(<TestComponent />)
  return result
}

function tick(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0))
}

// ---------- mocks ----------

const STORAGE_KEY_MODELS = "yyc3_ai_models"
const STORAGE_KEY_URL = "yyc3_ollama_url"
const OLLAMA_DEFAULT_URL = "http://localhost:11434"

let localStorageStore: Record<string, string> = {}

beforeEach(() => {
  localStorageStore = {}
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { localStorageStore[key] = val }),
    removeItem: vi.fn((key: string) => { delete localStorageStore[key] }),
    clear: vi.fn(() => { localStorageStore = {} }),
  })
  vi.stubGlobal("fetch", vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ---------- tests ----------

describe("useModelProvider", () => {
  it("初始化：无存储数据时使用默认模型（Ollama 扫描失败回退）", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("connection refused"))
    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => {
      // 初始加载中
      expect(result.current.ollamaLoading).toBe(false)
    })
    expect(result.current.availableModels.length).toBeGreaterThanOrEqual(2)
    expect(result.current.availableModels.some((m) => m.name === "Qwen-72B")).toBe(true)
    expect(result.current.ollamaUrl).toBe(OLLAMA_DEFAULT_URL)
  })

  it("初始化：从 localStorage 加载已保存模型，忽略扫描失败的本地模型", async () => {
    const savedModels: ModelEntry[] = [
      { id: "gpt-4", name: "GPT-4", provider: "openai", isLocal: false, baseUrl: "https://api.openai.com" },
      { id: "claude-3", name: "Claude-3", provider: "anthropic", isLocal: false },
    ]
    localStorageStore[STORAGE_KEY_MODELS] = JSON.stringify(savedModels)
    vi.mocked(fetch).mockRejectedValue(new Error("connection refused"))

    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))
    expect(result.current.availableModels).toHaveLength(2)
    expect(result.current.availableModels[0].id).toBe("gpt-4")
    expect(result.current.availableModels[1].id).toBe("claude-3")
  })

  it("初始化：Ollama 扫描成功时合并远程模型", async () => {
    const remoteModels: ModelEntry[] = [
      { id: "gpt-4", name: "GPT-4", provider: "openai", isLocal: false },
    ]
    localStorageStore[STORAGE_KEY_MODELS] = JSON.stringify(remoteModels)

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          { name: "llama3.2:latest" },
          { name: "mistral:7b" },
        ],
      }),
    } as Response)

    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))
    // crashed: Ollama 扫描到的 2 个 + 手动添加的 1 个远程
    expect(result.current.availableModels.length).toBeGreaterThanOrEqual(3)
    expect(result.current.availableModels.filter((m) => m.isLocal).length).toBe(2)
    expect(result.current.availableModels.filter((m) => !m.isLocal).length).toBe(1)
  })

  it("addModel: 添加自定义远程模型并持久化", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("connection refused"))
    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))

    result.current.addModel({
      name: "My Custom Model",
      provider: "custom",
      isLocal: false,
      baseUrl: "https://my-api.example.com",
    })

    await vi.waitFor(() => {
      const found = result.current.availableModels.find((m) => m.name === "My Custom Model")
      expect(found).toBeDefined()
      expect(found!.id).toBe("my-custom-model")
      expect(found!.baseUrl).toBe("https://my-api.example.com")
    })

    // 验证持久化
    const stored = JSON.parse(localStorageStore[STORAGE_KEY_MODELS] || "[]")
    expect(stored.some((m: ModelEntry) => m.id === "my-custom-model")).toBe(true)
  })

  it("removeModel: 删除模型并从 localStorage 移除", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("connection refused"))
    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))

    const initialCount = result.current.availableModels.length
    const targetId = result.current.availableModels[0].id

    result.current.removeModel(targetId)
    await vi.waitFor(() => {
      expect(result.current.availableModels).toHaveLength(initialCount - 1)
      expect(result.current.availableModels.find((m) => m.id === targetId)).toBeUndefined()
    })

    // 验证持久化
    const stored = JSON.parse(localStorageStore[STORAGE_KEY_MODELS] || "[]")
    expect(stored.find((m: ModelEntry) => m.id === targetId)).toBeUndefined()
  })

  it("setOllamaUrl: 更新 Ollama 地址并持久化", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("connection refused"))
    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))

    const newUrl = "http://192.168.1.100:11434"
    result.current.setOllamaUrl(newUrl)

    await vi.waitFor(() => {
      expect(result.current.ollamaUrl).toBe(newUrl)
    })
    expect(localStorageStore[STORAGE_KEY_URL]).toBe(newUrl)
  })

  it("rescan: 重新扫描 Ollama 并刷新模型列表", async () => {
    // 第一次初始化——扫描失败
    vi.mocked(fetch).mockRejectedValue(new Error("connection refused"))
    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))
    const beforeCount = result.current.availableModels.length

    // 添加一个远程模型
    result.current.addModel({ name: "Test-Remote", provider: "openai", isLocal: false })
    await vi.waitFor(() => {
      expect(result.current.availableModels.length).toBe(beforeCount + 1)
    })

    // 模拟第二次扫描——成功
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          { name: "llama3.2:latest" },
          { name: "mistral:7b" },
          { name: "codellama:34b" },
        ],
      }),
    } as Response)

    await result.current.rescan()
    await tick()

    // 应有 3 个通过 Ollama 扫描到的 + 1 个远程
    expect(result.current.availableModels.filter((m) => m.isLocal).length).toBe(3)
    expect(result.current.availableModels.filter((m) => !m.isLocal).length).toBe(1)
    expect(result.current.ollamaLoading).toBe(false)
  })

  it("扫描 Ollama 返回空数组时不覆盖已有本地模型", async () => {
    // 先让第一次扫描成功，拿到一批本地模型
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          { name: "llama3.2:latest" },
          { name: "mistral:7b" },
        ],
      }),
    } as Response)

    const result = renderHook(() => useModelProvider())
    await vi.waitFor(() => expect(result.current.ollamaLoading).toBe(false))
    expect(result.current.availableModels.filter((m) => m.isLocal).length).toBe(2)

    // 更新 URL 触发重新初始化，且 Ollama 返回空
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    } as Response)

    result.current.setOllamaUrl("http://other-host:11434")
    await vi.waitFor(() => {
      // 应该保留原本本地模型，不至于丢光
      expect(result.current.availableModels.filter((m) => m.isLocal).length).toBeGreaterThanOrEqual(1)
    })
  })
})

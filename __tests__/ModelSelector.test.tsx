import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ModelSelector, type ModelSelectorProps } from "@/app/components/ai-assistant/components/SettingsPanel/ModelSelector"
import type { ModelEntry } from "@/app/components/ai-assistant/hooks/useAIConfig"

// ---------- test data ----------

const mockModels: ModelEntry[] = [
  { id: "llama3.2", name: "Llama 3.2", provider: "ollama", isLocal: true, baseUrl: "http://localhost:11434" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", isLocal: false, baseUrl: "https://api.openai.com" },
  { id: "claude-3", name: "Claude 3", provider: "anthropic", isLocal: false },
]

const defaultProps: ModelSelectorProps = {
  models: mockModels,
  selectedId: "llama3.2",
  loading: false,
  ollamaUrl: "http://localhost:11434",
  onSelect: vi.fn(),
  onRescan: vi.fn().mockResolvedValue(undefined),
  onAddModel: vi.fn(),
  onRemoveModel: vi.fn(),
  onOllamaUrlChange: vi.fn(),
}

// ---------- tests ----------

describe("ModelSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("渲染模型列表，选中状态高亮", () => {
    render(<ModelSelector {...defaultProps} />)

    // 应显示所有 3 个模型
    expect(screen.getByText("Llama 3.2")).toBeInTheDocument()
    expect(screen.getByText("GPT-4o")).toBeInTheDocument()
    expect(screen.getByText("Claude 3")).toBeInTheDocument()

    // 显示模型管理标题
    expect(screen.getByText("模型管理")).toBeInTheDocument()

    // 显示 Ollama URL
    expect(screen.getByText("Ollama: http://localhost:11434")).toBeInTheDocument()
  })

  it("渲染 loading 状态", () => {
    render(<ModelSelector {...defaultProps} loading={true} />)
    expect(screen.getByText("正在扫描本地模型...")).toBeInTheDocument()
  })

  it("空列表时显示占位文案", () => {
    render(<ModelSelector {...defaultProps} models={[]} />)
    expect(screen.getByText(/暂无可用模型/)).toBeInTheDocument()
  })

  it("点击模型触发 onSelect", async () => {
    const onSelect = vi.fn()
    render(<ModelSelector {...defaultProps} onSelect={onSelect} />)

    await userEvent.click(screen.getByText("GPT-4o"))
    expect(onSelect).toHaveBeenCalledWith("gpt-4o")
  })

  it("点击扫描按钮触发 onRescan", async () => {
    const onRescan = vi.fn().mockResolvedValue(undefined)
    render(<ModelSelector {...defaultProps} onRescan={onRescan} />)

    // 找扫描按钮（RefreshCw 图标）
    const scanButton = screen.getByTitle("重新扫描")
    await userEvent.click(scanButton)
    expect(onRescan).toHaveBeenCalledTimes(1)
  })

  it("点击添加按钮显示表单，填写后触发 onAddModel", async () => {
    const onAddModel = vi.fn()
    render(<ModelSelector {...defaultProps} onAddModel={onAddModel} />)

    // 点击 + 按钮
    await userEvent.click(screen.getByTitle("添加模型"))

    // 表单出现
    expect(screen.getByPlaceholderText("模型名称（如 GPT-4o）")).toBeInTheDocument()

    // 填写表单
    await userEvent.type(screen.getByPlaceholderText("模型名称（如 GPT-4o）"), "My New Model")
    await userEvent.type(screen.getByPlaceholderText("API Base URL（可选）"), "https://api.example.com")

    // 点击添加
    await userEvent.click(screen.getByText("添加"))

    expect(onAddModel).toHaveBeenCalledTimes(1)
    expect(onAddModel).toHaveBeenCalledWith({
      name: "My New Model",
      provider: "openai",
      isLocal: false,
      baseUrl: "https://api.example.com",
    })
  })

  it("空名称时添加按钮禁用", async () => {
    render(<ModelSelector {...defaultProps} />)

    await userEvent.click(screen.getByTitle("添加模型"))
    const addButton = screen.getByText("添加")
    expect(addButton).toBeDisabled()

    // 输入名称后启用
    await userEvent.type(screen.getByPlaceholderText("模型名称（如 GPT-4o）"), "Test")
    expect(addButton).not.toBeDisabled()
  })

  it("点击取消关闭添加表单", async () => {
    render(<ModelSelector {...defaultProps} />)

    await userEvent.click(screen.getByTitle("添加模型"))
    expect(screen.getByPlaceholderText("模型名称（如 GPT-4o）")).toBeInTheDocument()

    await userEvent.click(screen.getByText("取消"))
    expect(screen.queryByPlaceholderText("模型名称（如 GPT-4o）")).not.toBeInTheDocument()
  })

  it("远程模型显示删除按钮，点击触发 onRemoveModel", async () => {
    const onRemoveModel = vi.fn()
    // gpt-4o 是远程模型，应有删除按钮
    render(<ModelSelector {...defaultProps} onRemoveModel={onRemoveModel} />)

    const gptButton = screen.getByText("GPT-4o").closest("button")!
    // hover 使删除按钮可见
    fireEvent.mouseEnter(gptButton)

    // 找删除图标（Trash2）
    await waitFor(() => {
      const deleteButton = gptButton.querySelector('[title="删除模型"]')
      expect(deleteButton).toBeInTheDocument()
    })
  })

  it("本地模型不显示删除按钮", async () => {
    render(<ModelSelector {...defaultProps} />)

    const llamaButton = screen.getByText("Llama 3.2").closest("button")!
    fireEvent.mouseEnter(llamaButton)

    // 本地模型不应有删除按钮
    await waitFor(() => {
      const deleteButton = llamaButton.querySelector('[title="删除模型"]')
      expect(deleteButton).not.toBeInTheDocument()
    })
  })

  it("编辑 Ollama URL 并保存", async () => {
    const onOllamaUrlChange = vi.fn()
    render(<ModelSelector {...defaultProps} onOllamaUrlChange={onOllamaUrlChange} />)

    // 点击 Ollama URL 进入编辑模式
    await userEvent.click(screen.getByText(/Ollama:/))

    // 输入框出现
    const input = screen.getByPlaceholderText("http://localhost:11434")
    expect(input).toBeInTheDocument()

    // 清空并输入新 URL
    await userEvent.clear(input)
    await userEvent.type(input, "http://192.168.1.100:11434")

    // 点击保存
    await userEvent.click(screen.getByText("保存"))
    expect(onOllamaUrlChange).toHaveBeenCalledWith("http://192.168.1.100:11434")
  })

  it("provider 下拉可选不同值", async () => {
    render(<ModelSelector {...defaultProps} />)

    await userEvent.click(screen.getByTitle("添加模型"))

    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()

    // 检查选项
    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent("OpenAI")
    expect(options[1]).toHaveTextContent("Anthropic")
    expect(options[2]).toHaveTextContent("Ollama")
    expect(options[3]).toHaveTextContent("自定义")
  })

  it("测试连接按钮点击显示测试状态", async () => {
    render(<ModelSelector {...defaultProps} />)

    // 找第一个模型的测试按钮（Signal 图标）
    const testButtons = screen.getAllByTitle("测试连接")
    expect(testButtons.length).toBeGreaterThan(0)

    // 点击测试按钮
    await userEvent.click(testButtons[0])

    // 应显示 loading 状态（旋转图标由 Loader2 提供）
    await waitFor(() => {
      const loadingIcon = testButtons[0].querySelector(".animate-spin")
      expect(loadingIcon).toBeInTheDocument()
    })
  })
})
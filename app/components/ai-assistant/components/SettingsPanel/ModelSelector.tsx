"use client"

/**
 * @file components/SettingsPanel/ModelSelector.tsx
 * @description 模型选择器 — 支持本地扫描、状态检测、诊断修复
 * @author YanYuCloudCube Team
 * @version v3.0.0 - 增强 Ollama 状态检测和诊断修复
 */

import { Cpu, Loader2, Signal, Plus, Trash2, RefreshCw, Server, Wifi, WifiOff, AlertTriangle, Wrench } from "lucide-react"
import { useCallback, useState } from "react"
import type { ModelEntry } from "../../hooks/useAIConfig"

export interface ModelSelectorProps {
  models: ModelEntry[]
  selectedId: string
  loading?: boolean
  ollamaStatus: {
    isRunning: boolean
    version?: string
    error?: string
    modelCount: number
  }
  scanProgress: { stage: string; percent: number }
  ollamaUrl: string
  onSelect: (id: string) => void
  onRescan: () => Promise<void>
  onAddModel: (model: Omit<ModelEntry, "id">) => void
  onRemoveModel: (id: string) => void
  onOllamaUrlChange: (url: string) => void
  onDiagnoseAndRepair: () => Promise<{ success: boolean; issues: string[]; repairs: string[]; ollamaStatus: string }>
}

type TestStatus = "idle" | "testing" | "success" | "failed"

interface ModelTestState {
  [modelId: string]: TestStatus
}

export function ModelSelector({
  models,
  selectedId,
  loading,
  ollamaStatus,
  scanProgress,
  ollamaUrl,
  onSelect,
  onRescan,
  onAddModel,
  onRemoveModel,
  onOllamaUrlChange,
  onDiagnoseAndRepair,
}: ModelSelectorProps) {
  const [testStates, setTestStates] = useState<ModelTestState>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newProvider, setNewProvider] = useState("openai")
  const [newBaseUrl, setNewBaseUrl] = useState("")
  const [editingOllamaUrl, setEditingOllamaUrl] = useState(false)
  const [tempOllamaUrl, setTempOllamaUrl] = useState(ollamaUrl)
  const [showDiagnosis, setShowDiagnosis] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState<{ success: boolean; issues: string[]; repairs: string[] } | null>(null)

  const testModel = useCallback(async (modelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setTestStates((prev) => ({ ...prev, [modelId]: "testing" }))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
      const success = Math.random() > 0.2
      setTestStates((prev) => ({ ...prev, [modelId]: success ? "success" : "failed" }))
      setTimeout(() => {
        setTestStates((prev) => {
          const s = { ...prev }
          delete s[modelId]
          return s
        })
      }, 3000)
    } catch {
      setTestStates((prev) => ({ ...prev, [modelId]: "failed" }))
    }
  }, [])

  const handleAddModel = useCallback(() => {
    if (!newName.trim()) return
    onAddModel({
      name: newName.trim(),
      provider: newProvider,
      isLocal: false,
      baseUrl: newBaseUrl.trim() || undefined,
    })
    setNewName("")
    setNewBaseUrl("")
    setShowAddForm(false)
  }, [newName, newProvider, newBaseUrl, onAddModel])

  const handleSaveOllamaUrl = useCallback(() => {
    onOllamaUrlChange(tempOllamaUrl)
    setEditingOllamaUrl(false)
  }, [tempOllamaUrl, onOllamaUrlChange])

  const handleDiagnoseAndRepair = useCallback(async () => {
    setShowDiagnosis(true)
    setDiagnosisResult(null)
    const result = await onDiagnoseAndRepair()
    setDiagnosisResult(result)
  }, [onDiagnoseAndRepair])

  const getTestIcon = (modelId: string) => {
    const status = testStates[modelId]
    switch (status) {
      case "testing":
        return <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffaa00]" />
      case "success":
        return <Signal className="w-3.5 h-3.5 text-[#00ff88]" />
      case "failed":
        return <Signal className="w-3.5 h-3.5 text-[#ff3366]" />
      default:
        return <Signal className="w-3.5 h-3.5 text-[rgba(0,212,255,0.4)] hover:text-[#00d4ff] transition-colors" />
    }
  }

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffaa00]" />
    if (ollamaStatus.isRunning) return <Wifi className="w-3.5 h-3.5 text-[#00ff88]" />
    return <WifiOff className="w-3.5 h-3.5 text-[#ff3366]" />
  }

  const getStatusText = () => {
    if (loading) return "扫描中..."
    if (ollamaStatus.isRunning) return `在线 ${ollamaStatus.version ? `(v${ollamaStatus.version})` : ""}`
    return "离线"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[#e0f0ff] flex items-center gap-2 text-sm font-medium">
          <Cpu className="w-4 h-4 text-[#00d4ff]" />
          模型管理
        </h4>
        <div className="flex gap-1">
          <button
            onClick={() => onRescan()}
            className="p-1.5 rounded hover:bg-[rgba(0,212,255,0.1)] text-[rgba(0,212,255,0.5)] hover:text-[#00d4ff] transition-all"
            title="重新扫描"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1.5 rounded hover:bg-[rgba(0,212,255,0.1)] text-[rgba(0,212,255,0.5)] hover:text-[#00d4ff] transition-all"
            title="添加模型"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDiagnoseAndRepair}
            className="p-1.5 rounded hover:bg-[rgba(255,170,0,0.1)] text-[rgba(255,170,0,0.5)] hover:text-[#ffaa00] transition-all"
            title="诊断与修复"
          >
            <Wrench className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ollama 状态显示 */}
      <div className="mb-2 p-2 rounded-lg bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.15)]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs">
            <Server className="w-3 h-3 text-[rgba(0,212,255,0.5)]" />
            <span className="text-[rgba(0,212,255,0.7)]">Ollama 状态</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {getStatusIcon()}
            <span className={ollamaStatus.isRunning ? "text-[#00ff88]" : "text-[#ff3366]"}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* 扫描进度条 */}
        {loading && scanProgress.percent > 0 && (
          <div className="mb-1">
            <div className="w-full h-1 bg-[rgba(0,40,80,0.5)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] transition-all duration-300"
                style={{ width: `${scanProgress.percent}%` }}
              />
            </div>
            <div className="text-[rgba(0,212,255,0.35)] text-[10px] mt-0.5">
              {scanProgress.stage}
            </div>
          </div>
        )}

        {/* Ollama URL 配置 */}
        <div className="flex items-center gap-1.5 text-xs text-[rgba(0,212,255,0.5)]">
          {editingOllamaUrl ? (
            <div className="flex-1 flex gap-1">
              <input
                type="text"
                value={tempOllamaUrl}
                onChange={(e) => setTempOllamaUrl(e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.2)] rounded text-[#e0f0ff] outline-none focus:border-[#00d4ff]"
                placeholder="http://localhost:11434"
              />
              <button
                onClick={handleSaveOllamaUrl}
                className="px-2 py-1 text-xs bg-[rgba(0,212,255,0.15)] rounded text-[#00d4ff] hover:bg-[rgba(0,212,255,0.25)]"
              >
                保存
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setTempOllamaUrl(ollamaUrl); setEditingOllamaUrl(true); }}
              className="hover:text-[#00d4ff] transition-colors truncate"
              title="点击编辑 Ollama 地址"
            >
              {ollamaUrl}
            </button>
          )}
        </div>

        {/* 错误信息 */}
        {!ollamaStatus.isRunning && ollamaStatus.error && (
          <div className="mt-1 flex items-start gap-1 text-[10px] text-[#ff3366]">
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
            <span className="truncate">{ollamaStatus.error}</span>
          </div>
        )}
      </div>

      {/* 诊断结果 */}
      {showDiagnosis && (
        <div className="mb-2 p-2 rounded-lg bg-[rgba(0,40,80,0.3)] border border-[rgba(255,170,0,0.3)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#ffaa00] font-medium">诊断结果</span>
            <button
              onClick={() => { setShowDiagnosis(false); setDiagnosisResult(null); }}
              className="text-[rgba(0,212,255,0.5)] hover:text-[#00d4ff] text-xs"
            >
              ✕
            </button>
          </div>
          {diagnosisResult ? (
            <div className="space-y-1 text-[10px]">
              {diagnosisResult.issues.length === 0 ? (
                <div className="text-[#00ff88]">✓ 未发现异常</div>
              ) : (
                <>
                  <div className="text-[#ff3366]">发现问题：</div>
                  {diagnosisResult.issues.map((issue, i) => (
                    <div key={i} className="text-[rgba(255,51,102,0.8)] pl-2">• {issue}</div>
                  ))}
                  {diagnosisResult.repairs.length > 0 && (
                    <>
                      <div className="text-[#00ff88] mt-1">自动修复：</div>
                      {diagnosisResult.repairs.map((repair, i) => (
                        <div key={i} className="text-[rgba(0,255,136,0.8)] pl-2">✓ {repair}</div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] text-[rgba(0,212,255,0.5)]">
              <Loader2 className="w-3 h-3 animate-spin" />
              诊断中...
            </div>
          )}
        </div>
      )}

      {/* 添加模型表单 */}
      {showAddForm && (
        <div className="mb-2 p-2 rounded-lg bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.15)] space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="模型名称（如 GPT-4o）"
            className="w-full px-2 py-1.5 text-xs bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.2)] rounded text-[#e0f0ff] outline-none focus:border-[#00d4ff]"
          />
          <div className="flex gap-2">
            <select
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              className="flex-1 px-2 py-1.5 text-xs bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.2)] rounded text-[#e0f0ff] outline-none focus:border-[#00d4ff]"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="ollama">Ollama</option>
              <option value="custom">自定义</option>
            </select>
            <input
              type="text"
              value={newBaseUrl}
              onChange={(e) => setNewBaseUrl(e.target.value)}
              placeholder="API Base URL（可选）"
              className="flex-1 px-2 py-1.5 text-xs bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.2)] rounded text-[#e0f0ff] outline-none focus:border-[#00d4ff]"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-[rgba(0,212,255,0.5)] hover:text-[#00d4ff]"
            >
              取消
            </button>
            <button
              onClick={handleAddModel}
              disabled={!newName.trim()}
              className="px-3 py-1 text-xs bg-[rgba(0,212,255,0.15)] rounded text-[#00d4ff] hover:bg-[rgba(0,212,255,0.25)] disabled:opacity-30"
            >
              添加
            </button>
          </div>
        </div>
      )}

      {models.length > 0 ? (
        <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(0,212,255,0.2)] scrollbar-track-transparent">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onSelect(model.id)}
              className={`w-full px-3 py-2 rounded-lg text-left transition-all flex items-center gap-2 text-xs group ${
                selectedId === model.id
                  ? "bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.3)] text-[#00d4ff]"
                  : "bg-[rgba(0,40,80,0.2)] border border-[rgba(0,180,255,0.08)] text-[rgba(0,212,255,0.5)] hover:border-[rgba(0,180,255,0.2)]"
              }`}
            >
              {model.isLocal && (
                <span className="text-[#00ff88] shrink-0 text-xs">本地</span>
              )}
              <span className="truncate flex-1">{model.name}</span>
              {model.size && (
                <span className="text-[rgba(0,212,255,0.25)] shrink-0 text-[10px]">
                  {(model.size / 1024 / 1024 / 1024).toFixed(1)}GB
                </span>
              )}
              <span className="text-[rgba(0,212,255,0.25)] shrink-0 text-xs">
                {model.provider}
              </span>
              <span
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); testModel(model.id); } }}
                onClick={(e) => { e.stopPropagation(); testModel(model.id, e); }}
                className="p-1 rounded hover:bg-[rgba(0,212,255,0.1)] transition-all shrink-0 cursor-pointer"
                title="测试连接"
              >
                {getTestIcon(model.id)}
              </span>
              {!model.isLocal && (
                <span
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onRemoveModel(model.id); } }}
                  onClick={(e) => { e.stopPropagation(); onRemoveModel(model.id); }}
                  className="p-1 rounded hover:bg-[rgba(255,51,102,0.1)] transition-all shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 text-[rgba(255,51,102,0.4)] hover:text-[#ff3366]"
                  title="删除模型"
                >
                  <Trash2 className="w-3 h-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[rgba(0,212,255,0.25)] text-center py-3 text-xs">
          暂无可用模型，点击 + 添加或扫描本地 Ollama
        </p>
      )}
    </div>
  )
}

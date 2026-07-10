"use client"

/**
 * @file hooks/stubs/useModelProvider.ts
 * @description 模型提供器 — 本地扫描 + 自编辑 + localStorage 持久化
 * @author YanYuCloudCube Team
 * @version v3.0.0 - 清除硬编码，增强 Ollama 检测
 */

import { useState, useEffect, useCallback, useRef } from "react";

export interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  isLocal: boolean;
  baseUrl?: string;
  size?: number;
  modifiedAt?: string;
}

const STORAGE_KEY = "yyc3_ai_models";
const OLLAMA_DEFAULT_URL = "http://localhost:11434";

// 清除硬编码：不再预设默认模型
// 所有模型均通过 Ollama 扫描或用户手动添加

function loadModels(): ModelEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch { /* ignore */ }
  return []; // 返回空数组，不再使用硬编码默认值
}

function saveModels(models: ModelEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  } catch { /* ignore */ }
}

// 增强 Ollama 检测：支持进度回调和详细错误信息
interface OllamaScanResult {
  models: ModelEntry[];
  status: 'online' | 'offline' | 'error';
  error?: string;
  version?: string;
}

async function scanOllamaModels(
  baseUrl: string,
  onProgress?: (stage: string, percent: number) => void
): Promise<OllamaScanResult> {
  // HTTPS 页面禁止发起 HTTP 请求（Mixed Content）
  // 仅在页面本身也是 HTTP 或 localhost 时才扫描
  if (typeof window !== "undefined") {
    const pageUrl = window.location;
    const isHttpsPage = pageUrl.protocol === "https:";
    const isLocalOllamaUrl = baseUrl.startsWith("http://localhost") || baseUrl.startsWith("http://127.0.0.1");
    if (isHttpsPage && isLocalOllamaUrl) {
      return {
        models: [],
        status: 'offline',
        error: 'HTTPS 页面无法连接 HTTP 本地服务，请在本地开发环境使用'
      };
    }
  }

  try {
    onProgress?.('connecting', 10);

    // 1. 检测 Ollama 服务状态
    const versionRes = await fetch(`${baseUrl}/api/version`, {
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);

    if (!versionRes || !versionRes.ok) {
      return {
        models: [],
        status: 'offline',
        error: 'Ollama 服务未启动或无法连接'
      };
    }

    onProgress?.('reading_version', 30);
    const versionData = await versionRes.json().catch(() => ({}));

    onProgress?.('scanning', 50);

    // 2. 获取模型列表
    const res = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      return {
        models: [],
        status: 'error',
        error: `API 请求失败: ${res.status} ${res.statusText}`
      };
    }

    onProgress?.('parsing', 70);
    const data = await res.json();

    onProgress?.('processing', 90);

    const models = (data.models || []).map((m: {
      name: string;
      model?: string;
      size?: number;
      modified_at?: string;
    }) => ({
      id: m.name || m.model,
      name: m.name || m.model,
      provider: "ollama",
      isLocal: true,
      baseUrl,
      size: m.size,
      modifiedAt: m.modified_at,
    }));

    onProgress?.('complete', 100);

    return {
      models,
      status: 'online',
      version: versionData.version
    };
  } catch (error) {
    return {
      models: [],
      status: 'error',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

export interface OllamaStatus {
  isRunning: boolean;
  version?: string;
  error?: string;
  modelCount: number;
}

export function useModelProvider() {
  const [availableModels, setAvailableModels] = useState<ModelEntry[]>([]);
  const [ollamaLoading, setOllamaLoading] = useState(true);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({
    isRunning: false,
    modelCount: 0
  });
  const [scanProgress, setScanProgress] = useState({ stage: '', percent: 0 });
  const [ollamaUrl, setOllamaUrlState] = useState(() => {
    try {
      return localStorage.getItem("yyc3_ollama_url") || OLLAMA_DEFAULT_URL;
    } catch { return OLLAMA_DEFAULT_URL; }
  });

  // 引用用于防止重复初始化
  const initialized = useRef(false);

  // 初始化：加载已保存模型 + 扫描 Ollama
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      setOllamaLoading(true);
      setScanProgress({ stage: 'initializing', percent: 0 });

      // 1. 加载本地保存的模型配置
      const saved = loadModels();
      const remoteModels = saved.filter((m) => !m.isLocal);

      setScanProgress({ stage: 'scanning_ollama', percent: 20 });

      // 2. 扫描 Ollama 本地模型
      const result = await scanOllamaModels(ollamaUrl, (stage, percent) => {
        setScanProgress({ stage, percent });
      });

      // 3. 更新 Ollama 状态
      setOllamaStatus({
        isRunning: result.status === 'online',
        version: result.version,
        error: result.error,
        modelCount: result.models.length
      });

      // 4. 合并模型列表
      if (result.models.length > 0) {
        // Ollama 在线，使用扫描到的模型
        const merged = [...result.models, ...remoteModels];
        setAvailableModels(merged);
        saveModels(merged);
      } else if (saved.some((m) => m.isLocal)) {
        // Ollama 离线，但本地有保存的模型记录
        const localSaved = saved.filter((m) => m.isLocal);
        const mergedWithLocal = [...localSaved, ...remoteModels];
        setAvailableModels(mergedWithLocal);
      } else {
        // 无模型可用
        setAvailableModels(remoteModels);
      }

      setScanProgress({ stage: 'complete', percent: 100 });
      setOllamaLoading(false);
    }

    init();
  }, [ollamaUrl]);

  // 重新扫描 Ollama
  const rescan = useCallback(async () => {
    setOllamaLoading(true);
    setScanProgress({ stage: 'rescanning', percent: 0 });

    const saved = loadModels();
    const remoteModels = saved.filter((m) => !m.isLocal);

    const result = await scanOllamaModels(ollamaUrl, (stage, percent) => {
      setScanProgress({ stage, percent });
    });

    setOllamaStatus({
      isRunning: result.status === 'online',
      version: result.version,
      error: result.error,
      modelCount: result.models.length
    });

    if (result.models.length > 0) {
      const merged = [...result.models, ...remoteModels];
      setAvailableModels(merged);
      saveModels(merged);
    } else {
      setAvailableModels(remoteModels);
    }

    setScanProgress({ stage: 'complete', percent: 100 });
    setOllamaLoading(false);
  }, [ollamaUrl]);

  // 添加自定义模型
  const addModel = useCallback((model: Omit<ModelEntry, "id">) => {
    const id = model.name.toLowerCase().replace(/\s+/g, "-");
    const newModel: ModelEntry = { ...model, id };
    setAvailableModels((prev) => {
      const next = [...prev, newModel];
      saveModels(next);
      return next;
    });
  }, []);

  // 删除模型
  const removeModel = useCallback((id: string) => {
    setAvailableModels((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveModels(next);
      return next;
    });
  }, []);

  // 更新 Ollama URL
  const setOllamaUrl = useCallback((url: string) => {
    setOllamaUrlState(url);
    try {
      localStorage.setItem("yyc3_ollama_url", url);
      // URL 变化时触发重新扫描
      initialized.current = false;
    } catch { /* ignore */ }
  }, []);

  // 一键修复：尝试启动 Ollama 服务（检测常见安装问题）
  const diagnoseAndRepair = useCallback(async () => {
    setScanProgress({ stage: 'diagnosing', percent: 10 });

    const issues: string[] = [];
    const repairs: string[] = [];

    // 1. 检查 URL 格式
    try {
      new URL(ollamaUrl);
    } catch {
      issues.push('Ollama URL 格式无效');
      repairs.push('已重置为默认 URL: http://localhost:11434');
      setOllamaUrl(OLLAMA_DEFAULT_URL);
    }

    setScanProgress({ stage: 'checking_service', percent: 30 });

    // 2. 尝试连接
    const result = await scanOllamaModels(ollamaUrl);

    if (result.status === 'offline') {
      issues.push('Ollama 服务未运行');
      repairs.push('请手动启动 Ollama 服务：在终端执行 ollama serve');
    }

    if (result.status === 'error') {
      issues.push(`Ollama 错误: ${result.error}`);
    }

    setScanProgress({ stage: 'checking_models', percent: 60 });

    // 3. 检查模型文件
    if (result.status === 'online' && result.models.length === 0) {
      issues.push('未检测到任何模型');
      repairs.push('请使用 ollama pull <模型名> 下载模型');
    }

    setScanProgress({ stage: 'repairing', percent: 80 });

    // 4. 清理无效模型记录
    const validModels = availableModels.filter(m => {
      if (m.isLocal && result.status !== 'online') return false;
      return true;
    });

    if (validModels.length !== availableModels.length) {
      repairs.push('已清理无效的本地模型记录');
      setAvailableModels(validModels);
      saveModels(validModels);
    }

    setScanProgress({ stage: 'complete', percent: 100 });

    return {
      success: issues.length === 0,
      issues,
      repairs,
      ollamaStatus: result.status
    };
  }, [ollamaUrl, availableModels, setOllamaUrl]);

  return {
    availableModels,
    ollamaLoading,
    ollamaStatus,
    scanProgress,
    ollamaUrl,
    setOllamaUrl,
    rescan,
    addModel,
    removeModel,
    diagnoseAndRepair,
  };
}

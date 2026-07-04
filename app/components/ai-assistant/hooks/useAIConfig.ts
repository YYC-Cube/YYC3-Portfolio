"use client"

/**
 * @file hooks/useAIConfig.ts
 * @description AI 配置状态管理 Hook（支持本地扫描与自编辑）
 * @author YanYuCloudCube Team
 * @version v3.0.0 - 增强 Ollama 状态检测和诊断修复
 */

import { useCallback, useEffect, useState } from "react";
import { useModelProvider, type ModelEntry, type OllamaStatus } from "./stubs/useModelProvider";
import { useSettingsStore } from "./stubs/useSettingsStore";

export type { ModelEntry } from "./stubs/useModelProvider";

export interface DiagnosisResult {
  success: boolean;
  issues: string[];
  repairs: string[];
  ollamaStatus: 'online' | 'offline' | 'error';
}

export interface UseAIConfigReturn {
  apiKey: string;
  setApiKey: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  availableModels: ModelEntry[];
  ollamaLoading: boolean;
  ollamaStatus: OllamaStatus;
  scanProgress: { stage: string; percent: number };
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  rescanModels: () => Promise<void>;
  addModel: (model: Omit<ModelEntry, "id">) => void;
  removeModel: (id: string) => void;
  diagnoseAndRepair: () => Promise<DiagnosisResult>;
  showApiKey: boolean;
  setShowApiKey: (value: boolean) => void;
}

export function useAIConfig(): UseAIConfigReturn {
  const {
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
  } = useModelProvider();

  const { values: settingsValues, updateValue: updateSettingsValue } = useSettingsStore();
  const [showApiKey, setShowApiKey] = useState(false);

  const apiKey = settingsValues.aiApiKey;
  const setApiKey = useCallback(
    (v: string) => updateSettingsValue("aiApiKey", v),
    [updateSettingsValue]
  );

  const selectedModel = settingsValues.aiModel;
  const setSelectedModel = useCallback(
    (v: string) => updateSettingsValue("aiModel", v),
    [updateSettingsValue]
  );

  const temperature = parseFloat(settingsValues.aiTemperature) || 0.7;
  const setTemperature = useCallback(
    (v: number) => updateSettingsValue("aiTemperature", String(v)),
    [updateSettingsValue]
  );

  const topP = parseFloat(settingsValues.aiTopP) || 0.9;
  const setTopP = useCallback(
    (v: number) => updateSettingsValue("aiTopP", String(v)),
    [updateSettingsValue]
  );

  const maxTokens = parseInt(settingsValues.aiMaxTokens) || 2048;
  const setMaxTokens = useCallback(
    (v: number) => updateSettingsValue("aiMaxTokens", String(v)),
    [updateSettingsValue]
  );

  useEffect(() => {
    if (!selectedModel && availableModels.length > 0) {
      setSelectedModel(availableModels[0].id);
    }
  }, [availableModels, selectedModel, setSelectedModel]);

  return {
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    topP,
    setTopP,
    maxTokens,
    setMaxTokens,
    availableModels,
    ollamaLoading,
    ollamaStatus,
    scanProgress,
    ollamaUrl,
    setOllamaUrl,
    rescanModels: rescan,
    addModel,
    removeModel,
    diagnoseAndRepair,
    showApiKey,
    setShowApiKey,
  };
}

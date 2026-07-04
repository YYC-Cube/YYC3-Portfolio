"use client"

/**
 * @file components/SettingsPanel/index.tsx
 * @description 设置面板容器组件
 * @author YanYuCloudCube Team
 * @version v3.0.0 - 增强 Ollama 状态检测和诊断修复
 */

import { ApiKeyInput, type ApiKeyInputProps } from "./ApiKeyInput";
import { ModelSelector, type ModelSelectorProps } from "./ModelSelector";
import { ParameterSlider } from "./ParameterSlider";
import { AnimationTestPanel } from "./AnimationTestPanel";

export interface SettingsPanelProps {
  apiKey: ApiKeyInputProps["value"];
  showApiKey: boolean;
  onToggleApiKey: () => void;
  onApiKeyChange: ApiKeyInputProps["onChange"];
  models: ModelSelectorProps["models"];
  selectedModel: ModelSelectorProps["selectedId"];
  modelsLoading: ModelSelectorProps["loading"];
  ollamaStatus: ModelSelectorProps["ollamaStatus"];
  scanProgress: ModelSelectorProps["scanProgress"];
  onModelSelect: ModelSelectorProps["onSelect"];
  ollamaUrl: ModelSelectorProps["ollamaUrl"];
  onRescan: ModelSelectorProps["onRescan"];
  onAddModel: ModelSelectorProps["onAddModel"];
  onRemoveModel: ModelSelectorProps["onRemoveModel"];
  onOllamaUrlChange: ModelSelectorProps["onOllamaUrlChange"];
  onDiagnoseAndRepair: ModelSelectorProps["onDiagnoseAndRepair"];
  temperature: number;
  onTemperatureChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number) => void;
  maxTokens: number;
  onMaxTokensChange: (value: number) => void;
}

export function SettingsPanel({
  apiKey,
  showApiKey,
  onToggleApiKey,
  onApiKeyChange,
  models,
  selectedModel,
  modelsLoading,
  ollamaStatus,
  scanProgress,
  onModelSelect,
  ollamaUrl,
  onRescan,
  onAddModel,
  onRemoveModel,
  onOllamaUrlChange,
  onDiagnoseAndRepair,
  temperature,
  onTemperatureChange,
  topP,
  onTopPChange,
  maxTokens,
  onMaxTokensChange,
}: SettingsPanelProps) {
  return (
    <div className="space-y-4 min-h-0">
      <ApiKeyInput
        value={apiKey}
        showValue={showApiKey}
        onToggleShow={onToggleApiKey}
        onChange={onApiKeyChange}
      />
      <ModelSelector
        models={models}
        selectedId={selectedModel}
        loading={modelsLoading}
        ollamaStatus={ollamaStatus}
        scanProgress={scanProgress}
        onSelect={onModelSelect}
        ollamaUrl={ollamaUrl}
        onRescan={onRescan}
        onAddModel={onAddModel}
        onRemoveModel={onRemoveModel}
        onOllamaUrlChange={onOllamaUrlChange}
        onDiagnoseAndRepair={onDiagnoseAndRepair}
      />
      <ParameterSlider
        label="温度 (Temperature)"
        value={temperature}
        min={0}
        max={2}
        step={0.05}
        minLabel="精确 0"
        maxLabel="创意 2.0"
        onChange={onTemperatureChange}
        color="#00d4ff"
      />
      <ParameterSlider
        label="Top-P (核采样)"
        value={topP}
        min={0}
        max={1}
        step={0.05}
        minLabel="集中 0"
        maxLabel="多样 1.0"
        onChange={onTopPChange}
        color="#aa55ff"
      />
      <ParameterSlider
        label="最大 Token 数"
        value={maxTokens}
        min={256}
        max={8192}
        step={256}
        minLabel="256"
        maxLabel="8192"
        onChange={onMaxTokensChange}
        color="#00ff88"
      />

      {/* 动效测试与诊断 */}
      <div className="pt-4 border-t border-[rgba(0,180,255,0.1)]">
        <AnimationTestPanel />
      </div>
    </div>
  );
}

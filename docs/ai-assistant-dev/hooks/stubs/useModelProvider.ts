"use client"

/**
 * @file hooks/stubs/useModelProvider.ts
 * @description useModelProvider stub — 独立运行时的模拟实现
 * @author YanYuCloudCube Team
 * @version v1.0.0
 *
 * 外部项目集成时，替换为真实实现即可：
 *   import { useModelProvider } from "@/hooks/useModelProvider";
 */

import { useState, useEffect } from "react";

const MOCK_MODELS = [
  { id: "qwen-72b", name: "Qwen-72B", provider: "local", isLocal: true },
  { id: "deepseek-v3", name: "DeepSeek-V3", provider: "local", isLocal: true },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", isLocal: false },
  { id: "gpt-4o-mini", name: "GPT-4o-mini", provider: "openai", isLocal: false },
];

export function useModelProvider() {
  const [availableModels, setAvailableModels] = useState<typeof MOCK_MODELS>([]);
  const [ollamaLoading, setOllamaLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAvailableModels(MOCK_MODELS);
      setOllamaLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { availableModels, ollamaLoading };
}
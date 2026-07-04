"use client"

/**
 * @file components/SettingsPanel/AnimationTestPanel.tsx
 * @description 动效进度测试与故障分析面板
 * @author YanYuCloudCube Team
 * @version v1.0.0
 */

import { Activity, AlertTriangle, CheckCircle, XCircle, Wrench, Play, Trash2, RefreshCw } from "lucide-react"
import { useCallback, useState } from "react"
import { useAnimationTest } from "../../hooks/useAnimationTest"

export function AnimationTestPanel() {
  const {
    isRunning,
    progress,
    currentTest,
    results,
    faults,
    startTest,
    repairAll,
    clearResults,
  } = useAnimationTest()

  const [showFaults, setShowFaults] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-[#00ff88]" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#ffaa00]" />
      case 'fail':
        return <XCircle className="w-4 h-4 text-[#ff3366]" />
      default:
        return null
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-[#ffaa00]'
      case 'medium':
        return 'text-[#ff6600]'
      case 'high':
        return 'text-[#ff3366]'
      default:
        return 'text-[rgba(0,212,255,0.5)]'
    }
  }

  const detectedFaultsCount = faults.filter(f => f.detected).length

  return (
    <div className="space-y-3">
      {/* 标题和控制按钮 */}
      <div className="flex items-center justify-between">
        <h4 className="text-[#e0f0ff] flex items-center gap-2 text-sm font-medium">
          <Activity className="w-4 h-4 text-[#00d4ff]" />
          动效测试与诊断
        </h4>
        <div className="flex gap-1">
          <button
            onClick={() => setShowFaults(!showFaults)}
            className="p-1.5 rounded hover:bg-[rgba(255,170,0,0.1)] text-[rgba(255,170,0,0.5)] hover:text-[#ffaa00] transition-all relative"
            title="故障列表"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {detectedFaultsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ff3366] text-[10px] text-white flex items-center justify-center">
                {detectedFaultsCount}
              </span>
            )}
          </button>
          <button
            onClick={clearResults}
            className="p-1.5 rounded hover:bg-[rgba(0,212,255,0.1)] text-[rgba(0,212,255,0.5)] hover:text-[#00d4ff] transition-all"
            title="清空结果"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 测试进度 */}
      {(isRunning || progress > 0) && (
        <div className="p-2 rounded-lg bg-[rgba(0,40,80,0.3)] border border-[rgba(0,180,255,0.15)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[rgba(0,212,255,0.7)]">
              {currentTest || '准备中...'}
            </span>
            <span className="text-xs text-[#00d4ff]">
              {progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[rgba(0,40,80,0.5)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 开始测试按钮 */}
      <button
        onClick={startTest}
        disabled={isRunning}
        className="w-full py-2 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.2)] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
      >
        {isRunning ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            测试中...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            开始动效测试
          </>
        )}
      </button>

      {/* 测试结果 */}
      {results.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-[rgba(0,212,255,0.7)] mb-1">测试结果：</div>
          {results.map((result, index) => (
            <div
              key={index}
              className="p-2 rounded-lg bg-[rgba(0,40,80,0.2)] border border-[rgba(0,180,255,0.08)] flex items-start gap-2"
            >
              {getStatusIcon(result.status)}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#e0f0ff] font-medium">{result.testName}</div>
                <div className="text-[10px] text-[rgba(0,212,255,0.5)] mt-0.5">
                  {result.details}
                </div>
                {result.fps > 0 && (
                  <div className="flex gap-3 mt-1 text-[10px]">
                    <span className="text-[rgba(0,212,255,0.4)]">
                      FPS: <span className="text-[#e0f0ff]">{result.fps}</span>
                    </span>
                    <span className="text-[rgba(0,212,255,0.4)]">
                      丢帧: <span className="text-[#e0f0ff]">{result.frameDrops}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 故障列表 */}
      {showFaults && (
        <div className="p-2 rounded-lg bg-[rgba(0,40,80,0.3)] border border-[rgba(255,170,0,0.3)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#ffaa00] font-medium">故障诊断</span>
            {detectedFaultsCount > 0 && (
              <button
                onClick={repairAll}
                className="px-2 py-1 rounded text-[10px] bg-[rgba(255,170,0,0.15)] text-[#ffaa00] hover:bg-[rgba(255,170,0,0.25)] flex items-center gap-1"
              >
                <Wrench className="w-3 h-3" />
                一键修复
              </button>
            )}
          </div>

          {faults.length === 0 ? (
            <div className="text-[10px] text-[rgba(0,212,255,0.35)] text-center py-2">
              暂无预设故障
            </div>
          ) : (
            <div className="space-y-1">
              {faults.map((fault) => (
                <div
                  key={fault.id}
                  className={`p-1.5 rounded border ${
                    fault.detected
                      ? 'bg-[rgba(255,51,102,0.1)] border-[rgba(255,51,102,0.2)]'
                      : 'bg-[rgba(0,40,80,0.2)] border-[rgba(0,180,255,0.08)]'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    {fault.detected ? (
                      <XCircle className="w-3.5 h-3.5 text-[#ff3366] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-[#00ff88] shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#e0f0ff] font-medium">{fault.name}</span>
                        <span className={`text-[10px] ${getSeverityColor(fault.severity)}`}>
                          ({fault.severity})
                        </span>
                      </div>
                      <div className="text-[10px] text-[rgba(0,212,255,0.5)] mt-0.5">
                        {fault.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 使用说明 */}
      <div className="p-2 rounded-lg bg-[rgba(0,40,80,0.2)] border border-[rgba(0,180,255,0.08)]">
        <div className="text-[10px] text-[rgba(0,212,255,0.5)] space-y-0.5">
          <div className="text-[#e0f0ff] font-medium mb-1">测试项目：</div>
          <div>1. 基础动画性能（FPS、丢帧）</div>
          <div>2. Framer Motion 动画测试</div>
          <div>3. 并发动画压力测试</div>
          <div>4. 内存使用检测</div>
          <div className="mt-1 text-[#e0f0ff] font-medium">预设故障：</div>
          <div>• 动画帧率过低（自动降低复杂度）</div>
          <div>• 动画队列阻塞（自动清空队列）</div>
          <div>• CSS 属性冲突（自动统一优先级）</div>
          <div>• 动画时长异常（自动限制时长）</div>
          <div>• GPU 加速未启用（自动启用）</div>
        </div>
      </div>
    </div>
  )
}

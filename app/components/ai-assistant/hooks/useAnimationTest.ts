"use client"

/**
 * @file hooks/useAnimationTest.ts
 * @description 动效进度测试与性能监控 Hook
 * @author YanYuCloudCube Team
 * @version v1.0.0
 */

import { useState, useCallback, useRef, useEffect } from "react"

export interface AnimationTestResult {
  testName: string
  duration: number
  fps: number
  frameDrops: number
  status: 'pass' | 'warning' | 'fail'
  details: string
}

export interface AnimationFault {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high'
  detected: boolean
  autoRepair: () => void
}

export interface UseAnimationTestReturn {
  isRunning: boolean
  progress: number
  currentTest: string
  results: AnimationTestResult[]
  faults: AnimationFault[]
  startTest: () => Promise<void>
  repairAll: () => void
  clearResults: () => void
}

// 预设常规故障
const PRESET_FAULTS: AnimationFault[] = [
  {
    id: 'fault-1',
    name: '动画帧率过低',
    description: '检测到动画帧率低于 30 FPS，可能导致卡顿',
    severity: 'high',
    detected: false,
    autoRepair: () => {
      // 降低动画复杂度
      document.documentElement.style.setProperty('--animation-complexity', 'low')
      // 禁用部分装饰性动画
      localStorage.setItem('yyc3_animation_level', 'reduced')
    }
  },
  {
    id: 'fault-2',
    name: '动画队列阻塞',
    description: '动画队列中存在未完成的动画，可能导致内存泄漏',
    severity: 'medium',
    detected: false,
    autoRepair: () => {
      // 清空动画队列
      document.getAnimations().forEach(anim => anim.cancel())
    }
  },
  {
    id: 'fault-3',
    name: 'CSS 动画属性冲突',
    description: '检测到多个动画同时修改同一属性，可能导致视觉异常',
    severity: 'medium',
    detected: false,
    autoRepair: () => {
      // 统一动画优先级
      const style = document.createElement('style')
      style.textContent = `
        * { animation-composition: replace !important; }
      `
      document.head.appendChild(style)
      setTimeout(() => style.remove(), 5000)
    }
  },
  {
    id: 'fault-4',
    name: '动画时长异常',
    description: '部分动画时长超过 5 秒，可能影响用户体验',
    severity: 'low',
    detected: false,
    autoRepair: () => {
      // 限制动画时长
      const style = document.createElement('style')
      style.textContent = `
        * { animation-duration: min(2s, var(--duration, 1s)) !important; }
      `
      document.head.appendChild(style)
      setTimeout(() => style.remove(), 10000)
    }
  },
  {
    id: 'fault-5',
    name: 'GPU 加速未启用',
    description: '部分动画未启用 GPU 加速，可能导致性能问题',
    severity: 'low',
    detected: false,
    autoRepair: () => {
      // 强制启用 GPU 加速
      const style = document.createElement('style')
      style.textContent = `
        * { transform: translateZ(0); will-change: transform, opacity; }
      `
      document.head.appendChild(style)
      setTimeout(() => style.remove(), 10000)
    }
  }
]

export function useAnimationTest(): UseAnimationTestReturn {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState('')
  const [results, setResults] = useState<AnimationTestResult[]>([])
  const [faults, setFaults] = useState<AnimationFault[]>(PRESET_FAULTS)
  const animationFrameRef = useRef<number>()

  // 测试 1: 基础动画性能
  const testBasicAnimation = useCallback(async (): Promise<AnimationTestResult> => {
    setCurrentTest('基础动画性能测试')
    setProgress(20)

    return new Promise((resolve) => {
      const startTime = performance.now()
      let frameCount = 0
      let lastTime = startTime
      const durations: number[] = []

      const measureFrame = (time: number) => {
        frameCount++
        const frameDuration = time - lastTime
        durations.push(frameDuration)
        lastTime = time

        if (frameCount < 60) {
          animationFrameRef.current = requestAnimationFrame(measureFrame)
        } else {
          const totalDuration = performance.now() - startTime
          const avgFps = 1000 / (totalDuration / frameCount)
          const frameDrops = durations.filter(d => d > 33).length // 帧间隔 > 33ms 视为丢帧

          resolve({
            testName: '基础动画性能',
            duration: totalDuration,
            fps: Math.round(avgFps),
            frameDrops,
            status: avgFps > 50 ? 'pass' : avgFps > 30 ? 'warning' : 'fail',
            details: `平均帧率: ${Math.round(avgFps)} FPS, 丢帧数: ${frameDrops}`
          })
        }
      }

      animationFrameRef.current = requestAnimationFrame(measureFrame)
    })
  }, [])

  // 测试 2: Framer Motion 动画
  const testFramerMotion = useCallback(async (): Promise<AnimationTestResult> => {
    setCurrentTest('Framer Motion 动画测试')
    setProgress(40)

    await new Promise(resolve => setTimeout(resolve, 500))

    const startTime = performance.now()

    // 模拟 Framer Motion 动画测试
    const testElement = document.createElement('div')
    testElement.style.cssText = 'position:fixed;width:100px;height:100px;background:red;'
    document.body.appendChild(testElement)

    return new Promise((resolve) => {
      let frameCount = 0
      const measureFrame = () => {
        frameCount++
        if (frameCount < 30) {
          animationFrameRef.current = requestAnimationFrame(measureFrame)
        } else {
          const totalDuration = performance.now() - startTime
          document.body.removeChild(testElement)

          resolve({
            testName: 'Framer Motion 动画',
            duration: totalDuration,
            fps: Math.round(1000 / (totalDuration / frameCount)),
            frameDrops: 0,
            status: totalDuration < 1000 ? 'pass' : 'warning',
            details: `30 帧动画耗时: ${Math.round(totalDuration)}ms`
          })
        }
      }

      animationFrameRef.current = requestAnimationFrame(measureFrame)
    })
  }, [])

  // 测试 3: 并发动画
  const testConcurrentAnimations = useCallback(async (): Promise<AnimationTestResult> => {
    setCurrentTest('并发动画测试')
    setProgress(60)

    await new Promise(resolve => setTimeout(resolve, 500))

    const startTime = performance.now()
    const promises: Promise<void>[] = []

    // 创建 10 个并发动画
    for (let i = 0; i < 10; i++) {
      const promise = new Promise<void>((resolve) => {
        const el = document.createElement('div')
        el.style.cssText = `position:fixed;width:50px;height:50px;background:blue;left:${i * 60}px;`
        document.body.appendChild(el)

        const animation = el.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(500px)' }
        ], {
          duration: 1000,
          iterations: 1
        })

        animation.onfinish = () => {
          document.body.removeChild(el)
          resolve()
        }
      })
      promises.push(promise)
    }

    await Promise.all(promises)
    const totalDuration = performance.now() - startTime

    return {
      testName: '并发动画测试',
      duration: totalDuration,
      fps: Math.round(1000 / (totalDuration / 10)),
      frameDrops: 0,
      status: totalDuration < 2000 ? 'pass' : 'warning',
      details: `10 个并发动画总耗时: ${Math.round(totalDuration)}ms`
    }
  }, [])

  // 测试 4: 内存使用
  const testMemoryUsage = useCallback(async (): Promise<AnimationTestResult> => {
    setCurrentTest('内存使用测试')
    setProgress(80)

    await new Promise(resolve => setTimeout(resolve, 500))

    const memory = (performance as any).memory
    const usedJSHeapSize = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0 // MB
    const totalJSHeapSize = memory ? memory.totalJSHeapSize / 1024 / 1024 : 0 // MB

    return {
      testName: '内存使用测试',
      duration: 0,
      fps: 0,
      frameDrops: 0,
      status: usedJSHeapSize < 100 ? 'pass' : usedJSHeapSize < 200 ? 'warning' : 'fail',
      details: memory
        ? `已用: ${usedJSHeapSize.toFixed(2)} MB, 总计: ${totalJSHeapSize.toFixed(2)} MB`
        : '浏览器不支持 memory API'
    }
  }, [])

  // 故障检测
  const detectFaults = useCallback((results: AnimationTestResult[]) => {
    setFaults(prev => {
      return prev.map(fault => {
        switch (fault.id) {
          case 'fault-1':
            return { ...fault, detected: results.some(r => r.fps < 30 && r.fps > 0) }
          case 'fault-2':
            return { ...fault, detected: document.getAnimations().length > 10 }
          case 'fault-3':
            return { ...fault, detected: false } // 需要更复杂的检测逻辑
          case 'fault-4':
            return { ...fault, detected: results.some(r => r.duration > 5000) }
          case 'fault-5':
            return { ...fault, detected: !CSS.supports('transform', 'translateZ(0)') }
          default:
            return fault
        }
      })
    })
  }, [])

  // 开始测试
  const startTest = useCallback(async () => {
    setIsRunning(true)
    setProgress(0)
    setResults([])
    setCurrentTest('')

    try {
      const testResults: AnimationTestResult[] = []

      // 执行各项测试
      testResults.push(await testBasicAnimation())
      testResults.push(await testFramerMotion())
      testResults.push(await testConcurrentAnimations())
      testResults.push(await testMemoryUsage())

      setResults(testResults)
      setProgress(100)
      setCurrentTest('测试完成')

      // 故障检测
      detectFaults(testResults)
    } catch (error) {
      console.error('动画测试失败:', error)
    } finally {
      setIsRunning(false)
    }
  }, [testBasicAnimation, testFramerMotion, testConcurrentAnimations, testMemoryUsage, detectFaults])

  // 一键修复所有故障
  const repairAll = useCallback(() => {
    setFaults(prev => {
      const updated = prev.map(fault => {
        if (fault.detected) {
          fault.autoRepair()
          return { ...fault, detected: false }
        }
        return fault
      })
      return updated
    })
  }, [])

  // 清空测试结果
  const clearResults = useCallback(() => {
    setResults([])
    setProgress(0)
    setCurrentTest('')
  }, [])

  // 清理
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    isRunning,
    progress,
    currentTest,
    results,
    faults,
    startTest,
    repairAll,
    clearResults,
  }
}

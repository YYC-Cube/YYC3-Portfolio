"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"

// 动态导入 Demo 组件（按需加载）
const BrandDesignDemo = dynamic(() => import("./project-demos/BrandDesignDemo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">正在加载演示...</p>
      </div>
    </div>
  ),
})

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: number
    title: string
    description: string
    imageUrl: string
    category: string
    demoUrl?: string  // 项目演示地址（iframe）
    liveUrl?: string   // 项目线上地址
    demoComponent?: string  // 自定义 Demo 组件名称
  } | null
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  if (!project) return null

  // 根据 demoComponent 渲染对应的 Demo 组件
  const renderDemo = () => {
    if (project.demoComponent === "BrandDesignDemo") {
      return <BrandDesignDemo />
    }
    // 可以继续添加其他 Demo 组件...
    
    // 如果没有自定义组件，使用 iframe
    if (project.demoUrl) {
      return (
        <iframe
          src={project.demoUrl}
          className="w-full h-full border-0"
          title={project.title}
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
        />
      )
    }

    // 默认展示图片
    return (
      <div className="relative w-full h-full">
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-contain"
        />
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-6xl h-[90vh] bg-background rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col h-full">
              {/* 项目信息头部 */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">{project.category}</div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{project.title}</h2>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  {/* 演示类型标签 */}
                  <div className="flex gap-2">
                    {project.demoComponent && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        交互演示
                      </span>
                    )}
                    {project.demoUrl && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        在线演示
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 项目演示区域 */}
              <div className="flex-1 relative bg-gray-50">
                {renderDemo()}
              </div>

              {/* 操作按钮 */}
              <div className="p-6 border-t flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    打开完整项目 ↗
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { motion, useInView, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import { useRef, useState } from "react"

const timelineEvents = [
  {
    year: 2021,
    title: "YanYuCloudCube 创立",
    description: "以「五高五标五化五维」理念为骨架，开启智能应用开发之旅。",
    details:
      "YanYuCloudCube 团队成立，确立了以高可用、高性能、高安全、高可扩展、高智能为核心架构原则，构建面向 AI 时代的智能应用开发范式。",
  },
  {
    year: 2022,
    title: "核心框架成型",
    description: "完成全链路开发框架的设计与验证，建立标准化体系。",
    details: "「五标」标准化体系正式落地，覆盖标准化、规范化、自动化、可视化、智能化五大维度，为团队提供从架构设计到落地实施的全链路指导。",
  },
  {
    year: 2023,
    title: "智能化升级",
    description: "深度融合人工智能前沿技术，实现开发流程的智能化转型。",
    details: "将大语言模型、智能代码生成、自动化测试等 AI 能力深度融入开发全流程，实现「五化」转型：流程化、数字化、生态化、工具化、服务化。",
  },
  {
    year: 2024,
    title: "生态体系构建",
    description: "拓展技术生态，打造开放、协作的智能应用开发社区。",
    details: "建立开放的技术生态体系，连接上下游开发者与合作伙伴，构建从需求分析、架构设计、开发实施到运维保障的完整生态闭环。",
  },
  {
    year: 2025,
    title: "全链路闭环交付",
    description: "实现从规划到部署的全链路自动化交付能力。",
    details: "完成从项目启动、架构设计、开发实施、测试审核、交付部署到运维保障的全链路闭环自动化交付，大幅提升交付效率与质量。",
  },
  {
    year: 2026,
    title: "迈向 AI 原生时代",
    description: "全面拥抱 AI 原生开发范式，引领行业智能化变革。",
    details: "以五维评价体系（时间维度、空间维度、属性维度、事件维度、关联维度）为指引，全面实现 AI 原生应用开发，为行业提供可复制、可扩展的智能化解决方案。",
  },
]

const FlowerIcon = ({ progress }: { progress: MotionValue<number> }) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    style={{ scale: progress }}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 8C12 8 14 10 14 12C14 14 12 16 12 16C12 16 10 14 10 12C10 10 12 8 12 8Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </motion.svg>
)

export default function Timeline() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section ref={containerRef} className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">我们的历程</h2>
          <p className="mt-4 text-lg text-muted-foreground">YanYuCloudCube 多年来的发展演变</p>
        </motion.div>

        <div className="relative">
          {/* 垂直时间线 */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"
            style={{ scaleY: scaleX }}
          />

          {/* 花朵图标 */}
          <motion.div
            className="sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-primary"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          >
            <FlowerIcon progress={useTransform(scrollYProgress, [0, 1], [0.5, 1])} />
          </motion.div>

          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={event.year}
              event={event}
              index={index}
              isExpanded={expandedEvent === index}
              onToggle={() => setExpandedEvent(expandedEvent === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineEvent({
  event,
  index,
  isExpanded,
  onToggle,
}: {
  event: (typeof timelineEvents)[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="w-5/12" />
      <div className="z-20">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <div className="w-3 h-3 bg-background rounded-full" />
        </div>
      </div>
      <motion.div
        className="w-5/12 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        <div className="p-4 bg-background rounded-lg shadow-md border border-primary/10">
          <span className="font-bold text-primary">{event.year}</span>
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          <p className="text-muted-foreground">{event.description}</p>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-muted-foreground">{event.details}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

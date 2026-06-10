"use client"

import { motion, useInView, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import { useRef, useState } from "react"

const timelineEvents = [
  {
    year: 2021,
    title: "YYC³ 核心理念奠基",
    description: "确立「五高架构」为团队技术哲学核心。",
    details:
      "YanYuCloudCube 团队正式提出五高架构理念——高可用、高性能、高安全、高扩展、高智能，为面向AI时代的智能应用开发奠定理论基石。",
  },
  {
    year: 2022,
    title: "五标体系构建",
    description: "标准化、规范化、自动化、可视化、智能化体系成型。",
    details: "五标体系全面落地，实现从代码规范到部署流程的全链路标准化管理，显著提升团队研发效能与交付质量。",
  },
  {
    year: 2023,
    title: "五化驱动引擎发布",
    description: "过程化→数字化→生态化→工具化→服务化转型升级。",
    details: "五化驱动模型正式发布，为团队提供从传统开发模式向AI驱动、服务导向的现代化开发范式的完整转型路径。",
  },
  {
    year: 2024,
    title: "五维评估框架上线",
    description: "时间、空间、属性、事件、关联五维全面评估体系。",
    details: "五维评估框架正式投入项目实践，实现了从单一指标评估到多维度、全视角的综合性项目质量评估体系。",
  },
  {
    year: 2025,
    title: "行业认可与技术输出",
    description: "五高五标五化五维体系获得行业广泛认可。",
    details: "YYC³ 核心理念在多个大型项目成功验证，技术博客与开源贡献获得开发者社区广泛关注与认可。",
  },
  {
    year: 2026,
    title: "AI 深度融合",
    description: "全面整合人工智能技术到全链路开发流程。",
    details: "将AI能力深度嵌入从需求分析、架构设计到代码生成、测试部署的全流程，实现了「高智能」架构的全面落地。",
  },
]

const FlowerIcon = ({ progress }: { progress: number | MotionValue<number> }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    style={{ transform: `scale(${progress})` }}
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
  </svg>
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
          <p className="mt-4 text-lg text-muted-foreground">YYC³ 五高五标五化五维体系的发展演变</p>
        </motion.div>

        <div className="relative">
          {/* 垂直时间线 */}
          <motion.div
            className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-primary/20"
            style={{ scaleY: scaleX }}
          />

          {/* 花朵图标 */}
          <motion.div
            className="hidden md:block sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-primary"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          >
            <FlowerIcon progress={useTransform(scrollYProgress, [0, 1], [0.5, 1]) as number} />
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
      className={`mb-8 flex items-center w-full ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="hidden md:block w-5/12" />
      <div className="z-20">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <div className="w-3 h-3 bg-background rounded-full" />
        </div>
      </div>
      <motion.div
        className="flex-1 md:w-5/12 cursor-pointer"
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

"use client"

import { motion, useInView, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import { useRef, useState } from "react"

const timelineEvents = [
  {
    year: 2018,
    title: "Flowers & Saints 成立",
    description: "我们的旅程始于对极简设计和花艺美学的热爱。",
    details:
      "由 Jane Doe 和 John Smith 创立，Flowers & Saints 起源于悉尼 Surry Hills 的一间小工作室，融合了他们对极简设计和植物美学的热爱。",
  },
  {
    year: 2019,
    title: "首次大型展览",
    description: "在悉尼设计节展示数字艺术与花艺装置的独特融合。",
    details: "我们的展览「数字绽放」吸引了超过 10,000 名参观者，因其创新地将科技与自然元素相结合而广受好评。",
  },
  {
    year: 2020,
    title: "线上商店启动",
    description: "将我们的创作带入数字世界，拓展全球影响力。",
    details: "为应对全球变化，我们转向电子商务，向全球观众提供独特设计和虚拟花艺工作坊。",
  },
  {
    year: 2021,
    title: "与顶级品牌合作",
    description: "与领先生活方式品牌合作打造独家系列。",
    details: "我们的合作包括与澳大利亚时装品牌 Zimmermann 推出限量版印花，以及与 Aesop 合作定制香氛系列。",
  },
  {
    year: 2022,
    title: "国际认可",
    description: "荣获享有盛誉的国际花艺设计大奖。",
    details: "我们的「空灵回响」装置作品结合全息投影与鲜花，在切尔西花展上荣获金奖。",
  },
  {
    year: 2023,
    title: "实体店扩张",
    description: "在悉尼市中心开设首家旗舰店。",
    details: "我们的 Bondi Beach 店铺打造沉浸式零售体验，融合数字装置与精选花艺作品及生活方式产品。",
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
          <p className="mt-4 text-lg text-muted-foreground">Flowers & Saints 多年来的发展演变</p>
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

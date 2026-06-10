"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const projects = [
  {
    id: 1,
    title: "极简品牌视觉",
    description: "为科技初创公司打造简洁现代的视觉传达系统",
    imageUrl: "/Project-Screenshot/YYC3-01.png",
    category: "品牌设计",
  },
  {
    id: 2,
    title: "优雅网页体验",
    description: "为奢侈时尚品牌打造精致的线上形象",
    imageUrl: "/Project-Screenshot/YYC3-02.png",
    category: "网页设计",
  },
  {
    id: 3,
    title: "直观移动应用",
    description: "为健康养生公司设计用户友好的应用界面",
    imageUrl: "/Project-Screenshot/YYC3-03.png",
    category: "移动应用",
  },
  {
    id: 4,
    title: "精致数字营销",
    description: "为豪华汽车品牌策划高端营销策略",
    imageUrl: "/Project-Screenshot/YYC3-04.png",
    category: "数字营销",
  },
  {
    id: 5,
    title: "精炼 UI/UX 设计",
    description: "为金融服务平台打造流畅的用户界面",
    imageUrl: "/Project-Screenshot/YYC3-05.png",
    category: "UI/UX",
  },
  {
    id: 6,
    title: "极简产品设计",
    description: "为智能家居设备打造简洁实用的外观",
    imageUrl: "/Project-Screenshot/YYC3-06.png",
    category: "产品设计",
  },
]

const categories = ["全部", ...new Set(projects.map((project) => project.category))]

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("全部")

  const filteredProjects = filter === "全部" ? projects : projects.filter((project) => project.category === filter)

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">我们的作品</h2>
          <p className="mt-4 text-lg text-muted-foreground">展示我们的极简设计与创意解决方案</p>
        </motion.div>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="text-white text-center px-4">{project.description}</p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-primary mb-1">{project.category}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <a
                    href="/#"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    查看项目
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

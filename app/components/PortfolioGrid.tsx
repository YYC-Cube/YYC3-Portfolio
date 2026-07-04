"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useCallback, useState } from "react"
import ProjectModal from "./ProjectModal"
import { Pagination, usePaginationKeyboard } from "@/components/Pagination"

const projects = [
  // ===== AI 应用 =====
  {
    id: 1,
    title: "YYC³ 言语Cloud UI",
    description: "UI 组件库与设计系统，统一的视觉规范与高效的界面开发工具",
    imageUrl: "/Project-Screenshot/YYC3-01.png",
    category: "创意设计",
    demoUrl: "https://design-ui.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-UI-Design-System",
  },
  {
    id: 2,
    title: "言语云量化分析交易系统",
    description: "AI 驱动的金融分析与量化交易系统，智能决策支持平台",
    imageUrl: "/Project-Screenshot/YYC3-02.png",
    category: "金融科技",
    demoUrl: "https://trading.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Financial-Quantitative-Trading-System",
  },
  {
    id: 3,
    title: "YYC³ AI Family Pro",
    description: "AI 驱动的多 Agent 协作平台，专业版 AI 编程助手与智能开发环境",
    imageUrl: "/Project-Screenshot/YYC3-03.png",
    category: "AI应用",
    demoUrl: "https://pro.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-Family-Multi-Agent-Platform-",
  },
  {
    id: 4,
    title: "YYC³ Portal",
    description: "言启象限 · 语枢未来，统一入口与导航平台，智能应用门户",
    imageUrl: "/Project-Screenshot/YYC3-04.png",
    category: "Web应用",
    demoUrl: "https://portal.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Nexus-Portal",
  },
  {
    id: 5,
    title: "智慧社区服务平台",
    description: "Smart City 智慧社区，智能化社区管理与服务，构建未来城市",
    imageUrl: "/Project-Screenshot/YYC3-05.png",
    category: "行业解决方案",
    demoUrl: "https://smart-city.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Smart-City-Platform",
  },
  {
    id: 6,
    title: "YYC³ Learning",
    description: "YanYu Smart Cloud³ Learning Platform - 言枢象限·语启未来，智能化在线学习平台",
    imageUrl: "/Project-Screenshot/YYC3-06.png",
    category: "教育科技",
    demoUrl: "https://learning.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3_Learning-Platform",
  },
  {
    id: 7,
    title: "YYC³ AI 智能开发环境",
    description: "AI-PAI 智能开发环境，集成化 AI 开发工具链，提升开发效率",
    imageUrl: "/Project-Screenshot/YYC3-07.png",
    category: "开发工具",
    demoUrl: "https://ai-pai.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-PAI",
  },
  {
    id: 8,
    title: "YYC³ AI Family",
    description: "YYC3 AI Family - 智能编程助手，AI 驱动的代助手与协作平台",
    imageUrl: "/Project-Screenshot/YYC3-08.png",
    category: "AI应用",
    demoUrl: "https://family-ai.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-Family",
  },
  {
    id: 38,
    title: "Family AI (YanYuCloud)",
    description: "YanYuCloud Family AI - 企业级 AI 编程助手平台，智能代码生成与协作",
    imageUrl: "/Project-Screenshot/YYC3-38.png",
    category: "AI应用",
    demoUrl: "https://family-ai.yyc3.vip/",
    liveUrl: "https://github.com/YanYuCloud/Family-AI",
  },
  {
    id: 9,
    title: "YYC³ AI Family Docs",
    description: "YYC³ AI Family 文档中心，API 文档、使用指南与最佳实践",
    imageUrl: "/Project-Screenshot/YYC3-09.png",
    category: "文档",
    demoUrl: "https://docs.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-Family-Multi-Agent-Platform-",
  },
  {
    id: 10,
    title: "YYC³ AI Code",
    description: "FAmily AI Code - AI 辅助低代码开发平台，将设计直接转化为生产级代码",
    imageUrl: "/Project-Screenshot/YYC3-10.png",
    category: "开发工具",
    demoUrl: "https://code.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-Code-FAmily",
  },
  // ===== 企业应用 =====
  {
    id: 11,
    title: "YYC³ Cloud Intelli-Matrix",
    description: "云智能矩阵平台，企业级智能应用管理与集成解决方案",
    imageUrl: "/Project-Screenshot/YYC3-11.png",
    category: "企业应用",
    demoUrl: "https://matrix.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Cloud-Intelli-Matrix",
  },
  {
    id: 12,
    title: "YYC³ Portfolio",
    description: "YYC³ Portfolio - 言启象限 · 语枢未来，当前项目展示平台",
    imageUrl: "/Project-Screenshot/YYC3-12.png",
    category: "Web应用",
    demoUrl: "https://design.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Portfolio",
  },
  {
    id: 13,
    title: "YYC³ AI Intelligent Calling",
    description: "AI 智能呼叫系统，智能语音交互平台，自动化客户服务",
    imageUrl: "/Project-Screenshot/YYC3-13.png",
    category: "AI应用",
    demoUrl: "https://ai-call.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-Call",
  },
  {
    id: 14,
    title: "YYC³ Brain",
    description: "YYC³ Brain Computer System - 脑机接口系统，智能人机交互平台",
    imageUrl: "/Project-Screenshot/YYC3-14.png",
    category: "AI应用",
    demoUrl: "https://brain.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Brain-Compute-System",
  },
  {
    id: 15,
    title: "YYC³ 简易表格转换器",
    description: "YYC³ · 简易表格转换器，简洁高效的表格数据处理与格式转换工具",
    imageUrl: "/Project-Screenshot/YYC3-15.png",
    category: "工具应用",
    demoUrl: "https://table.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Easy-Table-Converter",
  },
  {
    id: 16,
    title: "YYC³-Med",
    description: "AI-Powered Intelligent Medical System - 智能医疗系统，AI 辅助诊断与治疗",
    imageUrl: "/Project-Screenshot/YYC3-16.png",
    category: "行业解决方案",
    demoUrl: "https://medical.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Medical",
  },
  // ===== Web 应用 =====
  {
    id: 17,
    title: "YYC³ Dynasty Framework",
    description: "YYC³ Dynasty Framework - 企业级开发框架，统一架构设计与最佳实践",
    imageUrl: "/Project-Screenshot/YYC3-17.png",
    category: "开发工具",
    demoUrl: "https://dynasty.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Dynasty-Framework",
  },
  {
    id: 18,
    title: "YYC³ Pivot",
    description: "言启象限 · 语枢智云，数据中心与决策支持平台，智能数据分析",
    imageUrl: "/Project-Screenshot/YYC3-18.png",
    category: "Web应用",
    demoUrl: "https://pivot.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-CloudPivot-Intelli-Matrix",
  },
  {
    id: 19,
    title: "YYC³ Learning Platform",
    description: "AI 驱动的学习平台，个性化学习路径推荐与智能教学辅助",
    imageUrl: "/Project-Screenshot/YYC3-19.png",
    category: "教育科技",
    demoUrl: "https://learning-ai.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Learning-Platform",
  },
  {
    id: 20,
    title: "YYC3 智慧商家管理系统",
    description: "Futuristic 智慧商家，数字化运营与管理，提升商业效率",
    imageUrl: "/Project-Screenshot/YYC3-20.png",
    category: "行业解决方案",
    demoUrl: "https://futuristic.yyc3.top/login/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Futuristic-Dashboard",
  },
  {
    id: 21,
    title: "言语云集成中心",
    description: "YYC³ Nexus - 言语云集成中心，智能应用展示与统一管理系统",
    imageUrl: "/Project-Screenshot/YYC3-21.png",
    category: "Web应用",
    demoUrl: "https://nexus.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Nexus",
  },
  {
    id: 23,
    title: "YYC3 Gallery",
    description: "YYC3 Gallery Photography Template - 摄影作品展示平台，优雅的视觉呈现",
    imageUrl: "/Project-Screenshot/YYC3-23.png",
    category: "数字营销",
    demoUrl: "https://gallery.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Infinite-Gallery",
  },
  {
    id: 24,
    title: "F-KTV POS 系统",
    description: "Club KTV 点歌与收银系统，娱乐行业智能化解决方案",
    imageUrl: "/Project-Screenshot/YYC3-24.png",
    category: "行业解决方案",
    demoUrl: "https://club.yyc3.top/rooms",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Club-Ops",
  },
  {
    id: 25,
    title: "YYC³ 商家管理系统",
    description: "YYC³ QZ Merchant Management - 智慧商家运营平台，数字化商业管理解决方案",
    imageUrl: "/Project-Screenshot/YYC3-25.png",
    category: "行业解决方案",
    demoUrl: "https://admin.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-QZ-Merchant-Management-System",
  },
  // ===== 企业应用（续） =====
  {
    id: 26,
    title: "YYC³ PAI",
    description: "YYC³ PAI - 便携式AI智能平台，轻量级部署与快速集成",
    imageUrl: "/Project-Screenshot/YYC3-26.png",
    category: "AI应用",
    demoUrl: "https://pai.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-PAI",
  },
  {
    id: 27,
    title: "YYC³ NexusAI",
    description: "YYC³ NexusAI - 智能中枢平台，AI 驱动的企业级应用集成与智能决策",
    imageUrl: "/Project-Screenshot/YYC3-27.png",
    category: "企业应用",
    demoUrl: "https://nexus-ai.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Nexus-AI",
  },
  {
    id: 28,
    title: "YYC³ 万象归元",
    description: "YYC³ - 万象归元于云枢，深栈智启新纪元，企业级 SaaS 平台",
    imageUrl: "/Project-Screenshot/YYC3-28.png",
    category: "企业应用",
    demoUrl: "https://saas.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Saas-Landing",
  },
  {
    id: 29,
    title: "MusAI 缪斯智音",
    description: "MusAI 缪斯智音 - AI 音乐创作与智能音效生成平台，创意音乐助手",
    imageUrl: "/Project-Screenshot/YYC3-29.png",
    category: "创意设计",
    demoUrl: "https://d-music.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-D-MusAI",
  },
  {
    id: 30,
    title: "YYC³ Business Management",
    description: "YYC³ Business Management System - 商业管理系统，企业资源规划与流程优化",
    imageUrl: "/Project-Screenshot/YYC3-30.png",
    category: "企业应用",
    demoUrl: "https://management.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Business-Management-System",
  },
  // ===== Web 应用（续） =====
  {
    id: 31,
    title: "YYC³ Financial Dashboard",
    description: "YYC³ Financial Dashboard - 智能财务数据可视化平台，实时数据分析与决策支持",
    imageUrl: "/Project-Screenshot/YYC3-31.png",
    category: "金融科技",
    demoUrl: "https://fd.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Financial-Dashboard",
  },
  {
    id: 32,
    title: "YYC³ AuraFlow",
    description: "YYC³ AuraFlow - AI 驱动的智能应用，流畅的用户体验与智能交互",
    imageUrl: "/Project-Screenshot/YYC3-32.png",
    category: "Web应用",
    demoUrl: "https://aureflow.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Auraflow",
  },
  {
    id: 33,
    title: "YYC³ AI App Intelligence Platform",
    description: "YYC³ AI App Intelligence Platform - 智能应用平台，AI驱动的应用集成与智能决策",
    imageUrl: "/Project-Screenshot/YYC3-33.png",
    category: "AI应用",
    demoUrl: "https://neuxs-ai.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-AI-App-Intelligence-Platform",
  },
  {
    id: 35,
    title: "YYC³ Smart Service Engine",
    description: "YYC³ Smart Service Engine - 智能服务引擎，自动化服务编排与智能决策",
    imageUrl: "/Project-Screenshot/YYC3-35.png",
    category: "AI应用",
    demoUrl: "https://sse.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Smart-Service-Engine",
  },
  {
    id: 36,
    title: "YYC³ Customer Care Center",
    description: "YYC³ Customer Care Center | 言语云客户关怀中心，智能化客户服务与管理",
    imageUrl: "/Project-Screenshot/YYC3-36.png",
    category: "企业应用",
    demoUrl: "https://ccc.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Customer-Care-Center",
  },
  {
    id: 37,
    title: "YYC³ Pulse",
    description: "YYC³ Pulse - 实时数据监控与 analytics 平台，智能运维与性能分析",
    imageUrl: "/Project-Screenshot/YYC3-37.png",
    category: "Web应用",
    demoUrl: "https://pulse.yyc3.top/zh-CN/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Pulse",
  },
  // ===== 补充项目 =====
  {
    id: 40,
    title: "YYC³ Music Player",
    description: "YYC³ Music Player - 智能音乐播放器，AI推荐与个性化播放列表",
    imageUrl: "/Project-Screenshot/YYC3-40.png",
    category: "创意设计",
    demoUrl: "https://music.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Music-Player",
  },
  {
    id: 41,
    title: "YYC³ Music AI",
    description: "YYC³ Music AI - AI音乐创作平台，智能作曲与音频处理",
    imageUrl: "/Project-Screenshot/YYC3-41.png",
    category: "创意设计",
    demoUrl: "https://music-ai.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Music-AI",
  },
  {
    id: 42,
    title: "YYC³ Smart Office",
    description: "YYC³ Smart Office - 智能办公平台，提升企业协作效率与智能决策",
    imageUrl: "/Project-Screenshot/YYC3-42.png",
    category: "企业应用",
    demoUrl: "https://smart-office.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Smart-Office",
  },
  {
    id: 43,
    title: "YYC³ DataNexus",
    description: "YYC³ DataNexus - 数据中枢平台，统一数据管理与智能分析",
    imageUrl: "/Project-Screenshot/YYC3-43.png",
    category: "数据应用",
    demoUrl: "https://data-nexus.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-DataNexus",
  },
  {
    id: 44,
    title: "YYC³ Data Dashboard Design",
    description: "YYC³ Data Dashboard Design - 数据仪表盘设计系统，可视化组件库",
    imageUrl: "/Project-Screenshot/YYC3-44.png",
    category: "创意设计",
    demoUrl: "https://dashboard.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Data-Dashboard-Design",
  },
  {
    id: 45,
    title: "YYC³ Catering Platform",
    description: "YYC³ Catering Platform - 智能餐饮管理平台，数字化餐厅运营解决方案",
    imageUrl: "/Project-Screenshot/YYC3-45.png",
    category: "行业解决方案",
    demoUrl: "https://cater.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Catering-Platform",
  },
  {
    id: 46,
    title: "YYC³ Management",
    description: "YYC³ Management - 企业管理平台，综合管理与决策支持系统",
    imageUrl: "/Project-Screenshot/YYC3-46.png",
    category: "企业应用",
    demoUrl: "https://management.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Management",
  },
  // ===== 补充项目（续）=====
  {
    id: 47,
    title: "YYC³ Short Drama",
    description: "YYC³ Short Drama - 短视频剧情平台，智能推荐与内容创作",
    imageUrl: "/Project-Screenshot/YYC3-47.png",
    category: "创意设计",
    demoUrl: "https://drama.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Short-Drama",
  },
  {
    id: 48,
    title: "YYC³ Customer Care Center (Alt)",
    description: "YYC³ Customer Care Center - 言语云客户关怀中心（备用仓库）",
    imageUrl: "/Project-Screenshot/YYC3-48.png",
    category: "企业应用",
    demoUrl: "https://ccc.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Customer-Care-Cente",
  },
  {
    id: 49,
    title: "YYC³ Intelligent Center",
    description: "YYC³ Intelligent Center - 智能中枢平台，统一智能服务与管理",
    imageUrl: "/Project-Screenshot/YYC3-49.png",
    category: "企业应用",
    demoUrl: "https://nexus.yyc3.vip/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-Intelligent-Center",
  },
  {
    id: 50,
    title: "YYC³ PortAI System",
    description: "YYC³ PortAI System - 便携式AI系统，轻量级AI应用部署",
    imageUrl: "/Project-Screenshot/YYC3-50.png",
    category: "AI应用",
    demoUrl: "https://pai.yyc3.top/",
    liveUrl: "https://github.com/YYC-Cube/YYC3-PortAISys",
  },
]

const categories = ["全部", ...new Set(projects.map((project) => project.category))]

// 分页配置
const PROJECTS_PER_PAGE = 12

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("全部")
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // 过滤项目
  const filteredProjects = filter === "全部" ? projects : projects.filter((project) => project.category === filter)

  // 分页逻辑
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  // 处理分页变化（添加加载动画）
  const handlePageChange = useCallback((page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: "smooth" })
    // 模拟加载延迟（实际项目中可能是数据请求）
    setTimeout(() => setIsLoading(false), 300)
  }, [])

  // 处理过滤变化（重置页码）
  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }, [])

  // 键盘快捷键
  usePaginationKeyboard(currentPage, totalPages, handlePageChange)

  const handleViewProject = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300) // 等待动画完成
  }

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
          <p className="mt-4 text-lg text-muted-foreground">
            展示我们的极简设计与创意解决方案（共 {filteredProjects.length} 个项目）
          </p>
        </motion.div>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 项目网格（添加页面切换动画） */}
        <motion.div
          key={`grid-${filter}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              // 加载骨架屏
              Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-background rounded-3xl shadow-lg overflow-hidden"
                >
                  <div className="h-64 bg-muted animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  </div>
                </motion.div>
              ))
            ) : (
              paginatedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
                >
                <div className="relative h-64 overflow-hidden group cursor-pointer" onClick={() => handleViewProject(project)}>
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="text-center text-white p-4">
                      <p className="text-lg font-semibold mb-2">点击查看详情</p>
                      <p className="text-sm opacity-90">{project.description}</p>
                    </div>
                  </motion.div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-primary mb-1">{project.category}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <button
                    onClick={() => handleViewProject(project)}
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
                  </button>
                </div>
              </motion.div>
            )))}
          </AnimatePresence>
        </motion.div>

        {/* 分页组件 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProjects.length}
            itemsPerPage={PROJECTS_PER_PAGE}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        )}

        {/* 项目统计 */}
        <motion.div
          className="text-center mt-8 text-sm text-muted-foreground"
          key={`stats-${filter}-${currentPage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          显示 {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} 共 {filteredProjects.length} 个项目
        </motion.div>
      </div>

      {/* 项目详情模态框 */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </section>
  )
}

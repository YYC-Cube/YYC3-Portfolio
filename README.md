<div align="center">

<img src="/public/yyc3-Family.png" alt="YYC³ Family" />

# YYC³ Portfolio

### 言启象限 · 语枢未来

**_Words Initiate Quadrants, Language Serves as Core for Future_**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=flat-square)](https://ui.shadcn.com/)
[![pnpm](https://img.shields.io/badge/pnpm-latest-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](./CONTRIBUTING.md)

[![五高架构](https://img.shields.io/badge/五高-高可用%20%7C%20高性能%20%7C%20高安全%20%7C%20高扩展%20%7C%20高智能-blue?style=for-the-badge)](./docs/YYC3-团队核心-五维驱动.md)
[![五标体系](https://img.shields.io/badge/五标-标准化%20%7C%20规范化%20%7C%20自动化%20%7C%20可视化%20%7C%20智能化-teal?style=for-the-badge)](./docs/YYC3-团队规范-开发标准.md)
[![五化转型](https://img.shields.io/badge/五化-流程化%20%7C%20数字化%20%7C%20生态化%20%7C%20工具化%20%7C%20服务化-purple?style=for-the-badge)](./docs/YYC3-团队核心-五维驱动.md)

</div>

---

## 📋 项目概览

YYC³ Portfolio 是由 [YanYuCloudCube Team](mailto:admin@0379.email) 打造的智能应用作品集网站，以「五高五标五化五维」为骨架，展示面向 AI 时代的智能应用开发范式。基于 **Next.js 16 + React 19 + shadcn/ui + Radix UI + Tailwind CSS** 技术栈构建，遵循 YYC³ 团队核心机制。

| 属性 | 值 |
|---|---|
| **项目名称** | `yyc3-portfolio` |
| **框架** | Next.js 16.2.6 (App Router + Turbopack) |
| **UI** | React 19 + shadcn/ui + Radix UI + Tailwind CSS 3.4 |
| **包管理** | pnpm |
| **语言** | TypeScript 5 |
| **开发端口** | 3117 |
| **团队** | YanYuCloudCube Team |
| **许可证** | MIT |

---

## 🏗️ 技术架构

```
yyc3-portfolio/
├── app/                        # Next.js App Router
│   ├── components/             # 页面级组件
│   │   ├── Hero.tsx            # 首屏英雄区域
│   │   ├── Header.tsx          # 全局导航栏
│   │   ├── Footer.tsx          # 全局页脚
│   │   ├── PortfolioGrid.tsx   # 作品网格
│   │   ├── FeatureCarousel.tsx # 特性轮播
│   │   ├── Timeline.tsx        # 时间线
│   │   ├── Marquee.tsx         # 滚动公告
│   │   ├── ContactForm.tsx     # 联系表单
│   │   ├── NewsletterSubscribe.tsx # 订阅组件
│   │   ├── WearYourStory.tsx   # 品牌故事
│   │   ├── ai-assistant/       # AI 智能助手浮窗组件
│   │   │   ├── AIAssistant.tsx # 主组件
│   │   │   ├── components/     # 子组件（ChatPanel/CommandsPanel/PromptsPanel/SettingsPanel）
│   │   │   ├── hooks/          # 自定义 Hooks（useChat/useDraggable/useFloatingPanel/useAIConfig）
│   │   │   ├── constants/      # 命令与提示词配置
│   │   │   ├── assets/         # Logo 组件
│   │   │   └── types.ts        # 类型定义
│   │   └── ...                 # 其他组件
│   ├── globals.css             # 全局样式 + CSS 变量
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 首页入口
├── components/
│   └── ui/                     # shadcn/ui 基础组件库（60+）
├── hooks/                      # 自定义 Hooks
├── lib/
│   └── utils.ts                # 工具函数（cn 等）
├── public/
│   ├── yyc3-dist/              # YYC³ 品牌资源（favicon、PWA icon）
│   ├── yyc3-logo-blue/         # YYC³ Logo 多平台图标资源
│   ├── Project-Screenshot/     # 项目截图（YYC3-00~12.png）
│   ├── yyc3-Family.png         # 团队合影
│   └── ...                     # 静态资源
├── docs/                       # 团队文化与规范文档
├── styles/
│   └── globals.css             # 全局样式备份
├── next.config.mjs             # Next.js 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.17
- **pnpm** >= 8.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev --port 3117
```

访问 [http://localhost:3117](http://localhost:3117) 查看效果。

### 构建生产版本

```bash
pnpm build
pnpm start
```

### 代码检查

```bash
pnpm lint
```

---

## 🎨 核心特性

### 页面模块

| 模块 | 组件 | 功能描述 |
|---|---|---|
| 首屏英雄 | `Hero` | 品牌展示 + 动画入场 + CTA 按钮 |
| 品牌故事 | `WearYourStory` | 品牌理念传达 |
| 特性展示 | `FeatureCarousel` | 核心特性轮播 |
| 作品集 | `PortfolioGrid` | 作品网格布局 |
| 时间线 | `Timeline` | 品牌历程/项目进程 |
| 滚动公告 | `Marquee` | 文字无限滚动 |
| 联系表单 | `ContactForm` | 用户联系表单 |
| 订阅组件 | `NewsletterSubscribe` | 邮件订阅 |
| AI 助手 | `AIAssistant` | 可拖拽浮窗 AI 智能助手（聊天/命令/提示词/设置） |

### 技术亮点

- **Turbopack** — Next.js 16 默认打包器，极速热更新
- **Framer Motion** — 流畅的页面动画与交互
- **shadcn/ui** — 60+ 高质量 UI 组件，基于 Radix UI 原语
- **暗色模式** — 基于 `next-themes` 的系统级主题切换
- **PWA 就绪** — 完整的 Web App Manifest + 多尺寸图标
- **AI 智能助手** — 可拖拽浮窗组件，集成聊天/命令/提示词/配置面板
- **响应式设计** — 全端适配，移动优先

---

## 🧩 组件体系

项目采用 shadcn/ui 组件库，基于 Radix UI 无障碍原语构建，当前包含 **60+ 组件**：

<details>
<summary>📦 完整组件列表</summary>

| 类别 | 组件 |
|---|---|
| **表单** | Button, Checkbox, Input, Label, RadioGroup, Select, Slider, Switch, Textarea, Toggle, ToggleGroup, Form, Field, InputOTP, InputGroup |
| **数据展示** | Table, Badge, Card, Avatar, Progress, Separator, Skeleton, Spinner, Chart, Empty |
| **导航** | Tabs, Pagination, Breadcrumb, NavigationMenu, Menubar, Sidebar |
| **反馈** | Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard, Sonner/Toast, Collapsible |
| **布局** | Accordion, AspectRatio, Resizable, ScrollArea, Carousel |
| **高级** | Command, ContextMenu, DropdownMenu, Calendar, Kbd, Item |
| **工具** | use-mobile, use-toast |

</details>

---

## 🎯 五维驱动体系

本项目严格遵循 YYC³ 团队「五高五标五化五维」核心机制：

### 五高架构

| 维度 | 实践 |
|---|---|
| **高可用** | 主题降级、无障碍访问、错误边界 |
| **高性能** | Turbopack 打包、图片优化、代码分割 |
| **高安全** | 无密钥泄露、CSP 就绪、输入校验 |
| **高扩展** | 模块化组件、可插拔架构、shadcn/ui 生态 |
| **高智能** | AI 智能助手浮窗、智能主题切换、响应式布局、动画编排 |

### 五标体系

| 维度 | 实践 |
|---|---|
| **标准化** | TypeScript 严格模式、ESLint 规范 |
| **规范化** | 统一目录结构、命名约定 |
| **自动化** | Next.js 内置构建流水线 |
| **可视化** | 完整 UI 组件库、主题变量系统 |
| **智能化** | 动态主题、自适应布局 |

> 📖 详细标准参见 [YYC³ 团队核心 - 五维驱动](./docs/YYC3-团队核心-五维驱动.md) 与 [YYC³ 团队规范 - 开发标准](./docs/YYC3-团队规范-开发标准.md)

---

## 🛠️ 开发指南

### 新增页面组件

在 `app/components/` 目录下创建组件文件，遵循 PascalCase 命名：

```tsx
"use client"

import { motion } from "framer-motion"

export default function NewSection() {
  return (
    <section className="py-20 px-4">
      {/* 组件内容 */}
    </section>
  )
}
```

在 `app/page.tsx` 中引入：

```tsx
import NewSection from "./components/NewSection"

export default function Home() {
  return (
    <>
      {/* 现有组件 */}
      <NewSection />
    </>
  )
}
```

### 新增 shadcn/ui 组件

```bash
pnpm dlx shadcn@latest add [component-name]
```

### 样式规范

- 使用 Tailwind CSS 原子类
- CSS 变量定义于 `app/globals.css`
- 遵循 shadcn/ui 的 HSL 颜色系统
- 自定义样式类定义在 `globals.css` 底部

---

## 🚀 部署指南

### GitHub Pages 自动化部署（推荐）

本项目已配置 **GitHub Actions** 实现自动化 CI/CD 流程，每次推送到 `main` 分支将自动构建并部署到 GitHub Pages。

#### ✅ 已配置功能

| 功能 | 状态 | 说明 |
|---|---|---|
| 自动构建 | ✅ | Next.js 静态导出 (`output: 'export'`) |
| 自动部署 | ✅ | 推送至 `main` 分支触发部署 |
| Lint 检查 | ✅ | ESLint 代码质量检查（lint → build → deploy） |
| 自定义域名 | ✅ | `protf.yyc3.top`（已通过 DNS 认证） |
| pnpm 支持 | ✅ | 使用 pnpm 包管理器优化安装速度 |
| 缓存优化 | ✅ | Node.js + pnpm 缓存加速构建 |

#### 🔄 工作流触发条件

```yaml
on:
  push:
    branches: [main]      # 推送到 main 分支自动触发
  workflow_dispatch:       # 支持手动触发
```

#### 📦 构建流程

```
Checkout → Setup pnpm → Setup Node.js 20 → Install → Lint → Build (next build) → Upload Artifact → Deploy
```

#### 🌐 访问地址

- **GitHub Pages**: `https://<username>.github.io/YYC3-Portfolio`
- **自定义域名**: `https://protf.yyc3.top`

### 本地预览生产版本

```bash
pnpm install
pnpm build
# 静态文件输出到 /out 目录
npx serve out -p 4173
```

访问 `http://localhost:4173` 查看生产版本。

### 手动部署（备选方案）

如果需要手动部署，可以：

1. **构建静态文件**：

   ```bash
   pnpm build
   ```

2. **部署到 GitHub Pages**：

   ```bash
   # 安装 gh CLI
   gh auth login

   # 部署 /out 目录
   gh pages deploy ./out --branch gh-pages
   ```

---

## 📁 品牌资源

| 资源 | 路径 | 用途 |
|---|---|---|
| Favicon | `/yyc3-dist/favicon.ico` | 浏览器标签图标 |
| PWA Icons | `/yyc3-dist/yanyu_cloud_*.png` | 多尺寸应用图标（16~512px） |
| PWA Manifest | `/yyc3-dist/manifest.json` | PWA 配置 |
| Logo 资源 | `/yyc3-logo-blue/` | 多平台品牌图标（Android/iOS/Web） |
| 项目截图 | `/Project-Screenshot/YYC3-*.png` | 作品集展示图片（00~12） |
| 团队合影 | `/yyc3-Family.png` | 文档顶图 / Hero 展示 |

---

## 📄 文档索引

| 文档 | 说明 |
|---|---|
| [README.md](./README.md) | 项目总览与开发指南 |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | 部署与运维指南（CI/CD、域名配置） |
| [CHANGELOG.md](./CHANGELOG.md) | 版本变更记录 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献指南 |
| [LICENSE](./LICENSE) | MIT 许可证 |
| [团队核心 - 五维驱动](./docs/YYC3-团队核心-五维驱动.md) | YYC³ 核心机制 |
| [团队规范 - 开发标准](./docs/YYC3-团队规范-开发标准.md) | YYC³ 开发标准 |

---

## 👥 团队

<div align="center">

**YanYuCloudCube Team**

[![Email](https://img.shields.io/badge/Email-admin%400379.email-red?style=flat-square&logo=gmail&logoColor=white)](mailto:admin@0379.email)

_言启千行代码，语枢万物智能_

</div>

---

<div align="center">

**Copyright © 2026 YanYuCloudCube Team. All rights reserved.**

</div>

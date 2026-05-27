# YYC³ Portfolio - 部署与运维指南

## 📋 目录

- [部署架构](#部署架构)
- [GitHub Actions 工作流](#github-actions-工作流)
- [自定义域名配置](#自定义域名配置)
- [本地开发环境](#本地开发环境)
- [生产环境构建](#生产环境构建)
- [故障排查](#故障排查)
- [性能优化建议](#性能优化建议)

---

## 部署架构

### 整体流程图

```
┌─────────────┐    push/main     ┌──────────────────┐
│  Developer  │ ──────────────→ │  GitHub Actions   │
│  (Local)    │                 │  (CI/CD Pipeline) │
└─────────────┘                 └────────┬─────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
            │  Install     │    │   Build      │    │   Deploy     │
            │  Dependencies│    │   (next)     │    │   (Pages)    │
            └──────────────┘    └──────────────┘    └──────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
              pnpm install         next build          Upload /out
              (--frozen-lockfile)  (output: export)    → gh-pages
```

### 技术栈

| 组件 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Next.js | 16.2.6 | React 全栈框架 |
| **UI库** | shadcn/ui + Radix UI | latest | 无障碍组件 |
| **样式** | Tailwind CSS | 3.4.17 | 原子化 CSS |
| **包管理** | pnpm | latest | 高效依赖管理 |
| **CI/CD** | GitHub Actions | - | 自动化部署 |
| **托管** | GitHub Pages | - | 静态站点托管 |
| **域名** | protf.yyc3.top | - | 自定义域名 |

---

## GitHub Actions 工作流

### 文件位置

`.github/workflows/deploy.yml`

### 工作流配置详解

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main                    # 推送到 main 分支触发
  workflow_dispatch:             # 支持手动触发（GitHub 界面）

permissions:                     # 权限声明
  contents: read                 # 读取代码仓库
  pages: write                   # 写入 Pages 部署
  id-token: write                # OIDC Token 认证

concurrency:                     # 并发控制
  group: pages                   # 同一任务组
  cancel-in-progress: false      # 不取消正在运行的部署
```

### 构建阶段 (Build Job)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest       # 运行环境：Ubuntu 最新版
    
    steps:
      # 1. 检出代码
      - name: Checkout
        uses: actions/checkout@v4
      
      # 2. 安装 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest
      
      # 3. 配置 Node.js 环境（带缓存）
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"     # 使用 Node.js 20 LTS
          cache: pnpm           # 缓存 pnpm 依赖
      
      # 4. 安装项目依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      # 5. 构建静态站点
      - name: Build
        run: pnpm build          # 执行 next build → 输出到 /out
      
      # 6. 上传构建产物
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out            # 上传 /out 目录
```

### 部署阶段 (Deploy Job)

```yaml
  deploy:
    environment:
      name: github-pages         # GitHub Pages 环境
      url: ${{ steps.deployment.outputs.page_url }}
    
    runs-on: ubuntu-latest
    needs: build                 # 依赖构建阶段完成
    
    steps:
      # 7. 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 触发方式

#### 方式一：自动触发（推荐）

```bash
git add .
git commit -m "feat: 新功能或修复"
git push origin main
# → 自动触发 GitHub Actions → 构建 → 部署
```

#### 方式二：手动触发

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Deploy to GitHub Pages** 工作流
4. 点击 **Run workflow** 按钮
5. 选择 `main` 分支，点击运行

---

## 自定义域名配置

### 域名信息

| 项目 | 值 |
|------|-----|
| **域名** | `protf.yyc3.top` |
| **类型** | CNAME 记录（子域名） |
| **托管服务** | GitHub Pages |
| **DNS 状态** | ✅ 已验证通过 |

### DNS 配置说明

在域名 DNS 管理面板中添加以下记录：

```
Type:    CNAME
Name:    protf
Value:   <username>.github.io
TTL:     3600 (1小时)
```

> ⚠️ **注意**: 如果使用 Cloudflare 等 CDN 服务，需要：
> - 关闭代理模式（橙色云朵变灰色）
> - 或在 SSL/TLS 设置中选择 **Full (Strict)** 模式

### GitHub Pages 设置

1. 进入仓库 **Settings** → **Pages**
2. 在 **Custom domain** 中输入：`protf.yyc3.top`
3. 确保 **Enforce HTTPS** 已勾选
4. GitHub 会自动添加 `CNAME` 文件到 `/out` 目录

### 验证域名生效

```bash
# 检查 DNS 解析
dig protf.yyc3.top +short

# 检查 HTTPS 证书
curl -I https://protf.yyc3.top

# 检查重定向
curl -I http://protf.yyc3.top
```

---

## 本地开发环境

### 环境要求

| 工具 | 版本要求 | 用途 |
|------|----------|------|
| **Node.js** | >= 18.17 | JavaScript 运行时 |
| **pnpm** | >= 8.0 | 包管理器 |
| **Git** | latest | 版本控制 |

### 快速启动

```bash
# 1. 克隆仓库
git clone https://github.com/YYC-Cube/YYC3-Portfolio.git
cd YYC3-Portfolio

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器（端口 3117）
pnpm dev --port 3117

# 4. 浏览器访问
open http://localhost:3117
```

### 开发命令速查

| 命令 | 说明 |
|------|------|
| `pnpm dev --port 3117` | 启动开发服务器 |
| `pnpm build` | 构建生产版本（输出到 `/out`） |
| `pnpm start` | 启动生产服务器（需先 build） |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm dlx shadcn@latest add <组件>` | 添加 shadcn/ui 组件 |

---

## 生产环境构建

### 构建步骤

```bash
# 1. 清理旧的构建产物（可选）
rm -rf .next out

# 2. 安装生产依赖
pnpm install --production=false

# 3. 执行构建
pnpm build
```

### 构建产物

构建完成后，静态文件将输出到：

```
/out/
├── index.html              # 首页
├── _next/
│   ├── static/             # JS/CSS 资源
│   └── ...
├── yyc3-dist/              # 品牌资源
│   ├── favicon.ico
│   ├── manifest.json
│   └── yanyu_cloud_*.png
├── ...                      # 其他页面和资源
└── CNAME                   # 自定义域名文件（自动生成）
```

### 本地预览构建结果

```bash
# 方式一：使用 serve（推荐）
npx serve out -p 4173

# 方式二：使用 Python
cd out
python3 -m http.server 4173

# 方式三：使用 npx http-server
npx http-server out -p 4173 -c-1
```

访问 `http://localhost:4173` 查看预览。

---

## 故障排查

### 常见问题及解决方案

#### ❌ 问题 1：构建失败 - Module not found

**错误信息**：
```
Module not found: Can't resolve 'xxx'
```

**解决方案**：
```bash
# 清理缓存重新安装
rm -rf node_modules .next
pnpm install
pnpm build
```

#### ❌ 问题 2：TypeScript 类型错误

**错误信息**：
```
Type error: xxx
```

**解决方案**：

当前配置已设置 `ignoreBuildErrors: true`，但仍建议：

```bash
# 运行类型检查
npx tsc --noEmit

# 如果有错误，检查 tsconfig.json 配置
```

#### ❌ 问题 3：GitHub Actions 构建超时

**原因**：依赖安装或构建时间过长

**解决方案**：
1. 检查 `pnpm-lock.yaml` 是否提交到仓库
2. 确保使用 `--frozen-lockfile` 参数
3. 检查是否有大文件未加入 `.gitignore`

#### ❌ 问题 4：自定义域名无法访问

**排查步骤**：

```bash
# 1. 检查 DNS 解析
nslookup protf.yyc3.top

# 2. 检查 GitHub Pages 设置
# Settings → Pages → Custom domain

# 3. 检查 CNAME 文件
cat out/CNAME  # 应包含: protf.yyc3.top

# 4. 检查 HTTPS 证书
openssl s_client -connect protf.yyc3.top:443 -servername protf.yyc3.top
```

#### ❌ 问题 5：图片资源加载失败

**原因**：GitHub Pages 是静态托管，不支持 Next.js Image Optimization API

**解决方案**：

已配置 `images.unoptimized: true`，确保所有图片使用相对路径：

```tsx
// ✅ 正确写法
<Image src="/yyc3-Family.png" alt="YYC³" width={480} height={320} />

// ❌ 错误写法（会调用优化 API）
<Image src="/yyc3-Family.png" alt="YYC³" width={480} height={320} priority />
```

---

## 性能优化建议

### 已实施的优化措施

✅ **静态导出** - 使用 `output: 'export'` 生成纯静态 HTML  
✅ **Turbopack** - Next.js 16 默认打包器，极速构建  
✅ **图片优化** - 关闭 Next.js 图片优化 API（适配 GitHub Pages）  
✅ **pnpm 缓存** - GitHub Actions 缓存依赖加速构建  

### 可选的进一步优化

#### 1. 添加 Bundle 分析

```bash
# 安装分析工具
pnpm add -D @next/bundle-analyzer

# next.config.mjs 添加
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
```

#### 2. 启用压缩

GitHub Pages 自动启用 Gzip/Brotli 压缩，无需额外配置。

#### 3. CDN 加速（可选）

如果需要全球加速，可以在 DNS 层面配置 Cloudflare CDN：

- 将 CNAME 指向 GitHub Pages
- 开启 Cloudflare Proxy
- 配置缓存规则

#### 4. 监控与分析

集成分析工具：

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <Analytics />  // 添加 Vercel Analytics
    </html>
  )
}
```

---

## 安全最佳实践

### ✅ 已实施的安全措施

1. **无密钥泄露** - `.env*` 文件已加入 `.gitignore`
2. **依赖锁定** - 使用 `pnpm-lock.yaml` 锁定版本
3. **HTTPS 强制** - GitHub Pages 自动启用 HTTPS
4. **输入校验** - 表单组件使用 Zod schema 校验
5. **无服务端代码** - 纯静态导出，攻击面最小

### 🔒 安全检查清单

- [x] 无硬编码密钥或 Token
- [x] 依赖版本固定（lockfile）
- [x] CSP 头部配置（如需要）
- [x] XSS 防护（React 自动转义）
- [x] HTTPS 强制跳转
- [ ] 定期更新依赖（建议每月一次）

---

## 维护计划

### 定期维护任务

| 任务 | 频率 | 命令 |
|------|------|------|
| **依赖更新** | 每月 | `pnpm update` |
| **安全审计** | 每周 | `pnpm audit` |
| **构建测试** | 每次 PR | `pnpm build && pnpm lint` |
| **备份** | 自动 | Git 版本控制 |

### 更新依赖流程

```bash
# 1. 查看过期依赖
pnpm outdated

# 2. 更新依赖（交互式）
pnpm update -i

# 3. 测试构建
pnpm build

# 4. 提交更改
git add .
git commit -chore(deps): update dependencies"
git push origin main
# → 自动触发 CI/CD 部署
```

---

## 技术支持

### 获取帮助

- **文档**: [README.md](../README.md)
- **问题反馈**: [GitHub Issues](https://github.com/YYC-Cube/YYC3-Portfolio/issues)
- **讨论区**: [GitHub Discussions](https://github.com/YYC-Cube/YYC3-Portfolio/discussions)
- **邮箱**: admin@0379.email

### 相关资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

<div align="center">

**© 2026 YanYuCloudCube Team**

*言启千行代码，语枢万物智能*

</div>

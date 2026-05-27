# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub Actions CI/CD workflow for automated deployment to GitHub Pages
- Next.js static export configuration (`output: 'export'`) for GitHub Pages compatibility
- Comprehensive deployment guide in README.md with CI/CD documentation
- Custom domain support for `protf.yyc3.top` with DNS verification
- pnpm caching optimization in GitHub Actions for faster builds
- Manual deployment fallback instructions using gh CLI

### Changed

- Updated next.config.mjs to enable static site generation
- Enhanced README.md with complete deployment workflow documentation
- Improved project documentation structure for open-source professionalism

### Technical Details

**CI/CD Pipeline Features:**
- Trigger: Push to `main` branch + manual dispatch
- Runtime: Ubuntu Latest + Node.js 20
- Package Manager: pnpm with frozen lockfile
- Build: Next.js static export to `/out` directory
- Deployment: GitHub Pages via official actions
- Caching: Node.js modules + pnpm store

## [0.1.0] - 2026-05-27

### Added

- Next.js 16 App Router project scaffolding
- React 19 + TypeScript 5 integration
- shadcn/ui component library with 60+ components based on Radix UI
- Tailwind CSS 3.4 styling system with HSL color variables
- Framer Motion page animations and transitions
- Dark/Light theme switching via next-themes
- Hero section with gradient text and animated entry
- Portfolio grid layout component
- Feature carousel component
- Interactive timeline component
- Marquee scrolling announcement component
- Contact form component
- Newsletter subscription component
- Custom cursor component
- Floating action button component
- Full-screen menu component
- PWA manifest with multi-size icons (16px~512px)
- YYC³ brand resource integration (favicon, PWA icons)
- Responsive design with mobile-first approach
- Turbopack bundler configuration
- ESLint code quality configuration

### Changed

- Upgraded Next.js from 14.2.25 to 16.2.6 for React 19 compatibility
- Fixed Tailwind v4 `--spacing()` syntax to v3 compatible value in calendar component
- Replaced external CDN logo references with local YYC³ brand assets
- Updated project metadata to reflect YYC³ branding

### Fixed

- Turbopack panic with Chinese characters in project path via `turbopack.root` config
- CSS parsing error for `var(--spacing(8))` in calendar component
- Next.js 14 / React 19 peer dependency conflict

[0.1.0]: https://github.com/yanyucloudcube/yyc3-portfolio/releases/tag/v0.1.0

# Contributing to YYC³ Portfolio

First off, thank you for considering contributing to YYC³ Portfolio! It's people like you that make YYC³ such a great community.

## 📜 Code of Conduct

This project and everyone participating in it is governed by the YYC³ Team culture of respect, collaboration, and continuous improvement.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues list. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, error logs)
- **Describe the behavior you observed** and what behavior you expected
- **Include your environment details** (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the expected behavior
- **Describe the current behavior** and explain why it needs enhancement

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your PR when applicable
- Follow the TypeScript and Tailwind CSS style guides
- Include meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

## 🎨 Style Guides

### Git Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

footer
```

**Types**: `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore`

**Examples**:
```
feat(hero): add gradient text animation
fix(header): resolve logo alignment on mobile
docs(readme): update installation instructions
```

### TypeScript Style Guide

- Use TypeScript strict mode
- Prefer `interface` for object types, `type` for unions/intersections
- Use named exports for components
- Add `"use client"` directive for client components
- Follow the existing naming conventions in the project

### Component Style Guide

- Use functional components with hooks
- Follow PascalCase naming for component files
- Use Tailwind CSS utility classes for styling
- Leverage shadcn/ui components when possible
- Maintain accessibility (ARIA attributes, semantic HTML)

### CSS/Tailwind Style Guide

- Use Tailwind utility classes as the primary styling method
- Define custom CSS variables in `globals.css`
- Follow the shadcn/ui HSL color system
- Keep responsive design in mind (mobile-first)

## 🔧 Development Setup

### Prerequisites

- Node.js >= 18.17
- pnpm >= 8.0

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/yanyucloudcube/yyc3-portfolio.git
cd yyc3-portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev --port 3117

# Run linter
pnpm lint
```

### Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

## 📋 Project Structure Conventions

```
app/
├── components/         # Page-level components (PascalCase.tsx)
├── globals.css         # Global styles + CSS variables
├── layout.tsx          # Root layout
└── page.tsx            # Home page
components/
└── ui/                 # shadcn/ui base components
hooks/                  # Custom React hooks (camelCase.ts)
lib/                    # Utility functions
public/                 # Static assets
```

## 🏷️ YYC³ Team Standards

This project follows the YYC³ Team development standards:

- **五高架构**: High Availability, Performance, Security, Scalability, Intelligence
- **五标体系**: Standardization, Normalization, Automation, Visualization, Intelligence
- **五化转型**: Process-oriented, Digitalization, Ecologicalization, Tool-oriented, Service-oriented

For detailed standards, refer to:
- [YYC³ 团队核心 - 五维驱动](./docs/YYC3-团队核心-五维驱动.md)
- [YYC³ 团队规范 - 开发标准](./docs/YYC3-团队规范-开发标准.md)

---

Thank you for your contributions! 🎉

*言启千行代码，语枢万物智能*

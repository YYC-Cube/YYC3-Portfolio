import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import type React from "react"
import PortfolioGrid from "@/app/components/PortfolioGrid"

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, string>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string } & Record<string, string>) => <img src={src} alt={alt} {...props} />,
}))

describe("PortfolioGrid", () => {
  it("renders section title and description", () => {
    render(<PortfolioGrid />)
    expect(screen.getByText("我们的作品")).toBeInTheDocument()
    expect(screen.getByText("展示我们的极简设计与创意解决方案")).toBeInTheDocument()
  })

  it("renders all category filter buttons", () => {
    render(<PortfolioGrid />)
    expect(screen.getByRole("button", { name: "全部" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "品牌设计" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "网页设计" })).toBeInTheDocument()
  })

  it("shows all 6 projects by default", () => {
    render(<PortfolioGrid />)
    expect(screen.getByText("极简品牌视觉")).toBeInTheDocument()
    expect(screen.getByText("优雅网页体验")).toBeInTheDocument()
    expect(screen.getByText("直观移动应用")).toBeInTheDocument()
    expect(screen.getByText("精致数字营销")).toBeInTheDocument()
    expect(screen.getByText("精炼 UI/UX 设计")).toBeInTheDocument()
    expect(screen.getByText("极简产品设计")).toBeInTheDocument()
  })

  it("filters projects by category", () => {
    render(<PortfolioGrid />)
    fireEvent.click(screen.getByRole("button", { name: "品牌设计" }))
    expect(screen.getByText("极简品牌视觉")).toBeInTheDocument()
    expect(screen.queryByText("优雅网页体验")).not.toBeInTheDocument()
    expect(screen.queryByText("直观移动应用")).not.toBeInTheDocument()
  })

  it("restores all projects when '全部' is clicked after filtering", () => {
    render(<PortfolioGrid />)
    fireEvent.click(screen.getByRole("button", { name: "品牌设计" }))
    expect(screen.queryByText("优雅网页体验")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "全部" }))
    expect(screen.getByText("极简品牌视觉")).toBeInTheDocument()
    expect(screen.getByText("优雅网页体验")).toBeInTheDocument()
    expect(screen.getByText("直观移动应用")).toBeInTheDocument()
  })
})

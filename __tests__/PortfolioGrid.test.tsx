import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
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

// mock Pagination component to simplify testing
vi.mock("@/components/Pagination", () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => {
    if (totalPages <= 1) return null
    return (
      <div data-testid="pagination">
        <button data-testid="prev-page" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          上一页
        </button>
        <span data-testid="page-info">{currentPage} / {totalPages}</span>
        <button data-testid="next-page" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          下一页
        </button>
      </div>
    )
  },
  usePaginationKeyboard: () => {},
}))

// mock ProjectModal
vi.mock("@/app/components/ProjectModal", () => ({
  default: () => <div data-testid="project-modal" />,
}))

describe("PortfolioGrid", () => {
  it("renders section title and project count", () => {
    render(<PortfolioGrid />)
    expect(screen.getByText("我们的作品")).toBeInTheDocument()
    // 标题区域显示总数
    const descriptions = screen.getAllByText(/展示我们的极简设计与创意解决方案/)
    expect(descriptions.length).toBeGreaterThanOrEqual(1)
  })

  it("renders all category filter buttons", () => {
    render(<PortfolioGrid />)
    const expectedCategories = [
      "全部", "AI应用", "创意设计", "Web应用", "金融科技",
      "教育科技", "行业解决方案", "开发工具", "工具应用",
      "企业应用", "数字营销", "数据应用", "文档",
    ]
    for (const category of expectedCategories) {
      expect(screen.getByRole("button", { name: category })).toBeInTheDocument()
    }
  })

  it("shows first page with 12 projects by default", () => {
    render(<PortfolioGrid />)
    // 第一页项目（索引 0-11）：id 1,2,3,4,5,6,7,8,38,9,10,11
    expect(screen.getByText("YYC³ 言语Cloud UI")).toBeInTheDocument()          // id 1
    expect(screen.getByText("YYC³ AI Family Pro")).toBeInTheDocument()           // id 3
    expect(screen.getByText("Family AI (YanYuCloud)")).toBeInTheDocument()       // id 38
    expect(screen.getByText("YYC³ Cloud Intelli-Matrix")).toBeInTheDocument()    // id 11
    // id 12 (YYC³ Portfolio) 在第 2 页，不应出现在第一页
    expect(screen.queryByText("YYC³ Portfolio")).not.toBeInTheDocument()
  })

  it("renders pagination with 4 pages for 47 projects", () => {
    render(<PortfolioGrid />)
    expect(screen.getByTestId("pagination")).toBeInTheDocument()
    expect(screen.getByTestId("page-info")).toHaveTextContent("1 / 4")
  })

  it("navigates to next page and shows different projects", async () => {
    render(<PortfolioGrid />)
    fireEvent.click(screen.getByTestId("next-page"))
    await waitFor(() => {
      expect(screen.getByTestId("page-info")).toHaveTextContent("2 / 4")
    })
    // 等待骨架屏动画结束（300ms）
    await waitFor(() => {
      expect(screen.getByText("YYC³ Portfolio")).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it("navigates to previous page from page 2", async () => {
    render(<PortfolioGrid />)
    fireEvent.click(screen.getByTestId("next-page"))
    await waitFor(() => {
      expect(screen.getByTestId("page-info")).toHaveTextContent("2 / 4")
    })
    fireEvent.click(screen.getByTestId("prev-page"))
    await waitFor(() => {
      expect(screen.getByTestId("page-info")).toHaveTextContent("1 / 4")
    })
  })

  it("filters projects by category and resets to page 1", async () => {
    render(<PortfolioGrid />)
    // 先切换到第 2 页
    fireEvent.click(screen.getByTestId("next-page"))
    await waitFor(() => {
      expect(screen.getByTestId("page-info")).toHaveTextContent("2 / 4")
    })

    // 点击 "AI应用" 过滤
    fireEvent.click(screen.getByRole("button", { name: "AI应用" }))

    await waitFor(() => {
      // AI应用 有 10 个项目，总页数为 1，Pagination 不渲染
      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument()
      // 同时确认目标项目已渲染
      expect(screen.getByText("YYC³ AI Family Pro")).toBeInTheDocument()
    }, { timeout: 1000 })

    // 确保过滤后的项目存在
    expect(screen.getByText("YYC³ AI Family Pro")).toBeInTheDocument()
  })

  it("hides pagination when filtered to 1 page", async () => {
    render(<PortfolioGrid />)
    fireEvent.click(screen.getByRole("button", { name: "创意设计" }))

    await waitFor(() => {
      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument()
    })
  })

  it("restores all projects when '全部' is clicked after filtering", async () => {
    render(<PortfolioGrid />)
    fireEvent.click(screen.getByRole("button", { name: "创意设计" }))
    await waitFor(() => {
      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: "全部" }))
    await waitFor(() => {
      expect(screen.getByTestId("page-info")).toHaveTextContent("1 / 4")
    })
    expect(screen.getByText("YYC³ 言语Cloud UI")).toBeInTheDocument()
  })

  it("disables previous button on first page", () => {
    render(<PortfolioGrid />)
    expect(screen.getByTestId("prev-page")).toBeDisabled()
  })

  it("disables next button on last page", async () => {
    render(<PortfolioGrid />)
    const nextBtn = screen.getByTestId("next-page")
    for (let i = 1; i < 4; i++) {
      fireEvent.click(nextBtn)
    }
    await waitFor(() => {
      expect(screen.getByTestId("page-info")).toHaveTextContent("4 / 4")
    })
    expect(screen.getByTestId("next-page")).toBeDisabled()
  })
})

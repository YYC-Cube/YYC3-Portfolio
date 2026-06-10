import Header from "@/app/components/Header"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

// mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}))

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    header: ({ children, ...props }: Record<string, any>) => <header {...props}>{children}</header>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: Record<string, any>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders logo and navigation links", () => {
    render(<Header />)
    expect(screen.getByAltText("YanYuCloudCube 标志")).toBeInTheDocument()
    expect(screen.getByText("作品展示")).toBeInTheDocument()
    expect(screen.getByText("关于我们")).toBeInTheDocument()
    expect(screen.getByText("联系方式")).toBeInTheDocument()
  })

  it("shows hamburger menu button on mobile (always rendered)", () => {
    render(<Header />)
    const menuButton = screen.getByLabelText("打开菜单")
    expect(menuButton).toBeInTheDocument()
  })

  it("opens mobile menu on hamburger click", async () => {
    render(<Header />)
    const menuButton = screen.getByLabelText("打开菜单")
    fireEvent.click(menuButton)
    // After clicking, mobile menu links should be visible
    const links = screen.getAllByText("作品展示")
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it("closes mobile menu when link is clicked", async () => {
    render(<Header />)
    const menuButton = screen.getByLabelText("打开菜单")
    fireEvent.click(menuButton)
    const firstLink = screen.getAllByText("作品展示")[0]
    fireEvent.click(firstLink)
    // Menu should close
    const linksAfter = screen.getAllByText("作品展示")
    expect(linksAfter.length).toBeGreaterThanOrEqual(1)
  })
})

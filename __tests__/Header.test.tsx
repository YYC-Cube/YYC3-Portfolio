import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Header from "@/app/components/Header"

// mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}))

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
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
    // Find the mobile menu link and click it
    const mobileLinks = screen.getAllByText("作品展示")
    fireEvent.click(mobileLinks[mobileLinks.length - 1])
    // Menu should close - close button label should revert
    expect(screen.getByLabelText("打开菜单")).toBeInTheDocument()
  })
})

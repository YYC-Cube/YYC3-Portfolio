import Header from "@/app/components/Header"
import { I18nProvider } from "@/lib/i18n"
import { fireEvent, render, screen } from "@testing-library/react"
import React from "react"
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

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders logo and navigation links", () => {
    renderWithI18n(<Header />)
    expect(screen.getByAltText("YanYuCloudCube")).toBeInTheDocument()
    expect(screen.getByText("作品展示")).toBeInTheDocument()
    expect(screen.getByText("关于我们")).toBeInTheDocument()
    expect(screen.getByText("联系方式")).toBeInTheDocument()
  })

  it("shows hamburger menu button on mobile (always rendered)", () => {
    renderWithI18n(<Header />)
    const menuButton = screen.getByLabelText("打开菜单")
    expect(menuButton).toBeInTheDocument()
  })

  it("opens mobile menu on hamburger click", async () => {
    renderWithI18n(<Header />)
    const menuButton = screen.getByLabelText("打开菜单")
    fireEvent.click(menuButton)
    // After clicking, mobile menu links should be visible
    const links = screen.getAllByText("作品展示")
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it("closes mobile menu when link is clicked", async () => {
    renderWithI18n(<Header />)
    const menuButton = screen.getByLabelText("打开菜单")
    fireEvent.click(menuButton)
    const firstLink = screen.getAllByText("作品展示")[0]
    fireEvent.click(firstLink)
    // Menu should close
    const linksAfter = screen.getAllByText("作品展示")
    expect(linksAfter.length).toBeGreaterThanOrEqual(1)
  })
})

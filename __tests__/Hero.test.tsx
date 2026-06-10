import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Hero from "@/app/components/Hero"

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe("Hero", () => {
  it("renders brand name", () => {
    render(<Hero />)
    expect(screen.getByText("YanYuCloudCube")).toBeInTheDocument()
  })

  it("renders description text", () => {
    render(<Hero />)
    expect(screen.getByText(/五高五标五化五维/)).toBeInTheDocument()
  })

  it("renders CTA button", () => {
    render(<Hero />)
    expect(screen.getByText("探索作品")).toBeInTheDocument()
  })

  it("renders hero image with responsive class", () => {
    render(<Hero />)
    const img = screen.getByAltText("YanYuCloudCube 设计理念")
    expect(img).toHaveClass("max-w-[500px]")
  })

  it("has link to docs", () => {
    render(<Hero />)
    expect(screen.getByText("了解更多")).toBeInTheDocument()
  })
})

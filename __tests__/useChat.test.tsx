import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import type React from "react"
import { useChat } from "@/app/components/ai-assistant/hooks/useChat"

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: React.PropsWithChildren<Record<string, string>>) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, string>>) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: React.PropsWithChildren<Record<string, string>>) => <svg {...props}>{children}</svg>,
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, string>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring: (val: unknown) => val,
  useTransform: (val: unknown) => val,
  useInView: () => true,
}))

// Simple renderHook for testing
function renderHook<T>(hook: () => T) {
  const result: { current: T } = { current: null as unknown as T }
  function TestComponent() {
    result.current = hook()
    return null
  }
  render(<TestComponent />)
  return result
}

describe("AI Assistant - useChat hook", () => {
  it("returns initial welcome message", () => {
    const result = renderHook(() => useChat())
    expect(result.current.messages.length).toBeGreaterThan(0)
    expect(result.current.messages[0].role).toBe("assistant")
  })
})

import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { useChat } from "@/app/components/ai-assistant/hooks/useChat"

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: Record<string, unknown>) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: Record<string, unknown>) => <svg {...props}>{children}</svg>,
    button: ({ children, ...props }: Record<string, unknown>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

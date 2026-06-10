import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

describe("PWA Manifest", () => {
  const manifestPath = path.join(__dirname, "../public/manifest.json")
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))

  it("has required PWA fields", () => {
    expect(manifest.name).toBe("YanYuCloudCube")
    expect(manifest.short_name).toBe("YYC³")
    expect(manifest.start_url).toBe("/")
    expect(manifest.display).toBe("standalone")
    expect(manifest.theme_color).toBe("#2563eb")
    expect(manifest.background_color).toBe("#ffffff")
  })

  it("has icons array with multiple sizes", () => {
    expect(manifest.icons.length).toBeGreaterThanOrEqual(4)
  })

  it("includes 512x512 icon with maskable purpose", () => {
    const icon512 = manifest.icons.find(
      (i: any) => i.sizes === "512x512"
    )
    expect(icon512).toBeDefined()
    expect(icon512.purpose).toContain("maskable")
  })

  it("all icon paths are valid", () => {
    for (const icon of manifest.icons) {
      const iconPath = path.join(__dirname, "../public", icon.src.replace(/^\//, ""))
      expect(fs.existsSync(iconPath)).toBe(true)
    }
  })
})

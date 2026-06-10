"use client"

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="全局导航">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">YanYuCloudCube</span>
            <img
              className="h-8 w-auto"
              src="/yyc3-dist/yanyu_cloud_128x128.png"
              alt="YanYuCloudCube 标志"
            />
          </Link>
        </div>
        <div className="flex gap-x-12">
          <Link
            href="https://www.flowersandsaints.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            作品展示
          </Link>
          <Link
            href="https://www.flowersandsaints.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            关于我们
          </Link>
          <Link
            href="https://www.flowersandsaints.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            联系方式
          </Link>
        </div>
        <div className="flex flex-1 justify-end">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  )
}

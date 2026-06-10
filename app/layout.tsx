import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import type React from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://yyc3-portfolio.vercel.app"),
  title: "YYC³ Portfolio — 言启象限 · 语枢未来",
  description: "YYC³（YanYuCloudCube）智能应用链 · 融合极简设计与花艺美学的创意作品集 · 五高五标五化五维核心机制",
  generator: "YYC³ Team",
  icons: {
    icon: "/yyc3-dist/favicon.ico",
    shortcut: "/yyc3-dist/favicon.ico",
    apple: "/yyc3-dist/yanyu_cloud_192x192.png",
  },
  manifest: "/yyc3-dist/manifest.json",
  openGraph: {
    title: "YanYuCloudCube",
    description: "言启千行代码 · 语枢万物智能 — YanYuCloudCube 智能应用开发框架",
    images: ["/yyc3-Family.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

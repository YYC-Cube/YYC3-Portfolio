import { I18nProvider } from "@/lib/i18n/provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { PWARegister } from "./components/PWARegister"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "YanYuCloudCube — 五高五标五化五维智能应用开发范式",
  description: "以「五高五标五化五维」为骨架，构建面向AI时代的智能应用开发范式。融合现代软件工程最佳实践与人工智能前沿技术。",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/yyc3-logo-blue/windows/windows/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/yyc3-logo-blue/windows/windows/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/yyc3-logo-blue/windows/windows/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/yyc3-logo-blue/windows/windows/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/yyc3-logo-blue/windows/windows/icon-256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [
      { url: "/yyc3-logo-blue/ios/AppIcon.appiconset/Icon-App-60x60@2x.png", sizes: "120x120", type: "image/png" },
      { url: "/yyc3-logo-blue/ios/AppIcon.appiconset/Icon-App-76x76@1x.png", sizes: "76x76", type: "image/png" },
      { url: "/yyc3-logo-blue/ios/AppIcon.appiconset/Icon-App-76x76@2x.png", sizes: "152x152", type: "image/png" },
      { url: "/yyc3-logo-blue/ios/AppIcon.appiconset/Icon-App-83.5x83.5@2x.png", sizes: "167x167", type: "image/png" },
      { url: "/yyc3-logo-blue/ios/AppIcon.appiconset/Icon-App-1024x1024@1x.png", sizes: "1024x1024", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "YYC³",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#2563eb",
    "msapplication-TileImage": "/yyc3-logo-blue/windows/windows/icon-256.png",
    "msapplication-config": "none",
    "application-name": "YYC³ Portfolio",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster richColors position="top-right" />
            <PWARegister />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}

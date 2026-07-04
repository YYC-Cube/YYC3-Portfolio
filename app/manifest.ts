import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YanYuCloudCube",
    short_name: "YYC³",
    description: "以「五高五标五化五维」为骨架，构建面向AI时代的智能应用开发范式",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/yyc3-logo-blue/windows/windows/icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/yyc3-logo-blue/windows/windows/icon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/yyc3-logo-blue/windows/windows/icon-64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/yyc3-logo-blue/windows/windows/icon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/yyc3-logo-blue/windows/windows/icon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/yyc3-logo-blue/android/playstore-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}

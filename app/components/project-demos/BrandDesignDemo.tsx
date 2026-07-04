"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function BrandDesignDemo() {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedFont, setSelectedFont] = useState(0)

  const colors = [
    { name: "深海蓝", value: "#1e3a8a", text: "白色" },
    { name: "珊瑚红", value: "#f97316", text: "白色" },
    { name: "森林绿", value: "#16a34a", text: "白色" },
    { name: "紫罗兰", value: "#7c3aed", text: "白色" },
  ]

  const fonts = [
    { name: "现代无衬线", value: "font-sans" },
    { name: "经典衬线", value: "font-serif" },
    { name: "等宽字体", value: "font-mono" },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* 顶部控制栏 */}
      <div className="p-4 bg-white border-b flex items-center justify-between">
        <h3 className="font-semibold text-foreground">品牌视觉设计 - 交互演示</h3>
        <div className="text-sm text-muted-foreground">尝试调整右侧选项，查看实时效果</div>
      </div>

      <div className="flex-1 flex">
        {/* 左侧：控制面板 */}
        <div className="w-64 p-6 bg-white border-r overflow-y-auto">
          <div className="space-y-6">
            {/* 色彩方案 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">色彩方案</label>
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedColor === index ? "border-primary shadow-lg" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 字体选择 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">字体风格</label>
              <div className="space-y-2">
                {fonts.map((font, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFont(index)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedFont === index ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <span className={`text-sm ${font.value}`}>{font.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：实时预览 */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div
            key={`${selectedColor}-${selectedFont}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            {/* 品牌卡片预览 */}
            <div
              className="rounded-3xl p-12 shadow-2xl text-center"
              style={{ backgroundColor: colors[selectedColor].value }}
            >
              <div className={`text-4xl font-bold mb-4 ${fonts[selectedFont]}`} style={{ color: "#ffffff" }}>
                YYC3
              </div>
              <div className={`text-lg mb-6 opacity-90 ${fonts[selectedFont]}`} style={{ color: "#ffffff" }}>
                极简设计与创意解决方案
              </div>
              <div className="flex justify-center gap-4">
                <div className="px-6 py-3 bg-white rounded-full font-medium" style={{ color: colors[selectedColor].value }}>
                  了解更多
                </div>
                <div
                  className="px-6 py-3 border-2 border-white rounded-full font-medium text-white"
                >
                  联系我们
                </div>
              </div>
            </div>

            {/* 色彩信息 */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              当前方案：{colors[selectedColor].name} + {fonts[selectedFont].name}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

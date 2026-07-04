#!/usr/bin/env node
/**
 * 批量截图工具 - 为所有项目自动截图
 * 使用 Puppeteer 访问每个项目的 demoUrl 并截图
 */

import puppeteer, { type Page } from "puppeteer";
import fs from "fs";
import path from "path";

// 项目数据（从 PortfolioGrid.tsx 提取）
const projects = [
  { id: 1, title: "YYC³ 言语Cloud UI", demoUrl: "https://design-ui.yyc3.top/" },
  { id: 2, title: "言语云量化分析交易系统", demoUrl: "https://trading.yyc3.vip/" },
  { id: 3, title: "YYC³ AI Family Pro", demoUrl: "https://pro.yyc3.top/" },
  { id: 4, title: "YYC³ Portal", demoUrl: "https://portal.yyc3.top/" },
  { id: 5, title: "智慧社区服务平台", demoUrl: "https://smart-city.yyc3.top/" },
  { id: 6, title: "YYC³ Learning", demoUrl: "https://learning.yyc3.top/" },
  { id: 7, title: "YYC³ AI 智能开发环境", demoUrl: "https://ai-pai.yyc3.vip/" },
  { id: 8, title: "YYC³ AI Family", demoUrl: "https://family-ai.yyc3.top/" },
  { id: 38, title: "Family AI (YanYuCloud)", demoUrl: "https://family-ai.yyc3.vip/" },
  { id: 9, title: "YYC³ AI Family Docs", demoUrl: "https://docs.yyc3.top/" },
  { id: 10, title: "YYC³ AI Code", demoUrl: "https://code.yyc3.top/" },
  { id: 11, title: "YYC³ Cloud Intelli-Matrix", demoUrl: "https://matrix.yyc3.top/" },
  { id: 12, title: "YYC³ Portfolio", demoUrl: "https://design.yyc3.top/" },
  { id: 13, title: "YYC³ AI Intelligent Calling", demoUrl: "https://ai-call.yyc3.vip/" },
  { id: 14, title: "YYC³ Brain", demoUrl: "https://brain.yyc3.vip/" },
  { id: 15, title: "YYC³ 简易表格转换器", demoUrl: "https://table.yyc3.top/" },
  { id: 16, title: "YYC³-Med", demoUrl: "https://medical.yyc3.vip/" },
  { id: 17, title: "YYC³ Dynasty Framework", demoUrl: "https://dynasty.yyc3.vip/" },
  { id: 18, title: "YYC³ Pivot", demoUrl: "https://pivot.yyc3.top/" },
  { id: 19, title: "YYC³ Learning Platform", demoUrl: "https://learning-ai.yyc3.top/" },
  { id: 20, title: "YYC3 智慧商家管理系统", demoUrl: "https://futuristic.yyc3.top/login/" },
  { id: 21, title: "言语云集成中心", demoUrl: "https://nexus.yyc3.vip/" },
  { id: 22, title: "YYC³ AI Family 智能助手", demoUrl: "https://ai-assis.yyc3.top/" },
  { id: 23, title: "YYC3 Gallery", demoUrl: "https://gallery.yyc3.top/" },
  { id: 24, title: "F-KTV POS 系统", demoUrl: "https://club.yyc3.top/rooms" },
  { id: 25, title: "YYC³-QZ-Merchant-Management", demoUrl: "https://admin.yyc3.top/" },
  { id: 26, title: "YYC³ PAI", demoUrl: "https://pai.yyc3.vip/" },
  { id: 27, title: "YYC³ NexusAI", demoUrl: "https://nexus-ai.yyc3.top/" },
  { id: 28, title: "YYC³ 万象归元", demoUrl: "https://saas.yyc3.vip/" },
  { id: 29, title: "MusAI 缪斯智音", demoUrl: "https://d-music.yyc3.top/" },
  { id: 30, title: "YYC³ Business Management", demoUrl: "https://management.yyc3.top/" },
  { id: 31, title: "YYC³ Financial Dashboard", demoUrl: "https://fd.yyc3.top/" },
  { id: 32, title: "YYC³ AuraFlow", demoUrl: "https://aureflow.yyc3.top/" },
  { id: 33, title: "YYC³ AI App Intelligence Platform", demoUrl: "https://neuxs-ai.yyc3.top/" },
  { id: 34, title: "YYC³ Administration", demoUrl: "https://admin.yyc3.vip/" },
  { id: 35, title: "YYC³ Smart Service Engine", demoUrl: "https://sse.yyc3.top/" },
  { id: 36, title: "YYC³ Customer Care Center", demoUrl: "https://ccc.yyc3.top/" },
  { id: 37, title: "YYC³ Pulse", demoUrl: "https://pulse.yyc3.top/zh-CN/" },
  { id: 39, title: "YYC³ AI System", demoUrl: "https://ai.yyc3.top/" },
  { id: 40, title: "YYC³ Music Player", demoUrl: "https://music.yyc3.top/" },
  { id: 41, title: "YYC³ Music AI", demoUrl: "https://music-ai.yyc3.top/" },
  { id: 42, title: "YYC³ Smart Office", demoUrl: "https://smart-office.yyc3.vip/" },
  { id: 43, title: "YYC³ DataNexus", demoUrl: "https://data-nexus.yyc3.top/" },
  { id: 44, title: "YYC³ Data Dashboard Design", demoUrl: "https://dashboard.yyc3.top/" },
  { id: 45, title: "YYC³ Catering Platform", demoUrl: "https://cater.yyc3.vip/" },
  { id: 46, title: "YYC³ Management", demoUrl: "https://management.yyc3.vip/" },
  { id: 47, title: "YYC³ Short Drama", demoUrl: "https://drama.yyc3.top/" },
  { id: 48, title: "YYC³ Customer Care Center (Alt)", demoUrl: "https://ccc.yyc3.top/" },
  { id: 49, title: "YYC³ Intelligent Center", demoUrl: "https://nexus.yyc3.vip/" },
  { id: 50, title: "YYC³ PortAI System", demoUrl: "https://pai.yyc3.top/" },
];

const SCREENSHOT_DIR = path.join(process.cwd(), "public", "Project-Screenshot");
const VIEWPORT = { width: 1920, height: 1080 };

async function screenshotProject(page: Page, project: typeof projects[0]) {
  const fileName = `YYC3-${project.id.toString().padStart(2, "0")}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);

  // 如果文件已存在则跳过
  if (fs.existsSync(filePath)) {
    console.log(`⏭️ 跳过 ${project.id}/50: ${project.title}（${fileName} 已存在）`);
    return { success: true, project, fileName, skipped: true };
  }

  console.log(`📸 截图 ${project.id}/50: ${project.title}`);
  console.log(`   URL: ${project.demoUrl}`);

  try {
    // 访问页面
    await page.goto(project.demoUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // 等待页面渲染
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 截图
    await page.screenshot({
      path: filePath,
      fullPage: false,
      type: "png",
    });

    console.log(`   ✅ 已保存: ${fileName}`);
    return { success: true, project, fileName };
  } catch (error: any) {
    console.error(`   ❌ 失败: ${error.message}`);
    return { success: false, project, error: error.message };
  }
}

async function main() {
  console.log("🚀 开始批量截图...");
  console.log(`📁 截图目录: ${SCREENSHOT_DIR}`);
  console.log(`📊 项目总数: ${projects.length}\n`);

  // 确保截图目录存在
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    console.log(`✅ 创建目录: ${SCREENSHOT_DIR}\n`);
  }

  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // 批量截图
  const results = [];
  for (const project of projects) {
    const result = await screenshotProject(page, project);
    results.push(result);
  }

  await browser.close();

  // 统计结果
  const successCount = results.filter((r) => r.success && !r.skipped).length;
  const skipCount = results.filter((r) => r.skipped).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log("\n" + "=".repeat(60));
  console.log("📊 截图完成统计:");
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ⏭️ 跳过: ${skipCount}`);
  console.log(`   ❌ 失败: ${failCount}`);
  console.log(`   📁 截图目录: ${SCREENSHOT_DIR}`);
  console.log("=".repeat(60));

  // 输出失败的项目
  if (failCount > 0) {
    console.log("\n❌ 失败项目列表:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`   - [${r.project.id}] ${r.project.title}`);
        console.log(`     URL: ${r.project.demoUrl}`);
        console.log(`     错误: ${r.error}`);
      });
  }

  console.log("\n🎉 批量截图任务完成!");
}

// 执行
main().catch(console.error);

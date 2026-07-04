const fs = require('fs');

// 书签中的项目列表（从 YYC3.html 提取）
const bookmarks = [
  { name: "YYC³ 言语Cloud", url: "https://design-ui.yyc3.top/", subdomain: "design-ui" },
  { name: "言语云量化分析交易系统", url: "https://trading.yyc3.vip/", subdomain: "trading" },
  { name: "YYC³ AI Code", url: "https://ai-family.yyc3.top/", subdomain: "ai-family" },
  { name: "YYC³ Portal", url: "https://portal.yyc3.top/", subdomain: "portal" },
  { name: "智慧社区服务平台", url: "https://smart-city.yyc3.top/", subdomain: "smart-city" },
  { name: "YYC³ Learning", url: "https://learning.yyc3.top/", subdomain: "learning" },
  { name: "YYC³ AI 智能开发环境", url: "https://ai-pai.yyc3.vip/", subdomain: "ai-pai" },
  { name: "Family AI", url: "https://family-ai.yyc3.vip/", subdomain: "family-ai" },
  { name: "YYC³ AI Family Docs", url: "https://docs.yyc3.top/", subdomain: "docs" },
  { name: "FAmily AI Code", url: "https://code.yyc3.top/", subdomain: "code" },
  { name: "YYC³ Cloud Intelli-Matrix", url: "https://matrix.yyc3.top/", subdomain: "matrix" },
  { name: "YYC³ 言语Cloud 设计", url: "https://design.yyc3.top/", subdomain: "design" },
  { name: "YYC³ AI Intelligent Calling", url: "https://ai-call.yyc3.vip/", subdomain: "ai-call" },
  { name: "YYC³ Brain", url: "https://brain.yyc3.vip/", subdomain: "brain" },
  { name: "YYC³ 简易表格转换器", url: "https://table.yyc3.top/", subdomain: "table" },
  { name: "YYC³-Med", url: "https://medical.yyc3.vip/", subdomain: "medical" },
  { name: "YYC³ AI-Family 聊天机器人", url: "https://family-ai.yyc3.top/", subdomain: "family-ai-2" },
  { name: "YYC³ Pivot", url: "https://pivot.yyc3.top/", subdomain: "pivot" },
  { name: "YYC³ Learning Platform", url: "https://learning-ai.yyc3.top/", subdomain: "learning-ai" },
  { name: "YYC3 智慧商家管理系统", url: "https://futuristic.yyc3.top/login/", subdomain: "futuristic" },
  { name: "言语云集成中心", url: "https://nexus.yyc3.vip/", subdomain: "nexus" },
  { name: "YYC³ AI Family", url: "https://ai-assis.yyc3.top/", subdomain: "ai-assis" },
  { name: "YYC3 Gallery", url: "https://gallery.yyc3.top/", subdomain: "gallery" },
  { name: "F-KTV POS 系统", url: "https://club.yyc3.top/rooms", subdomain: "club" },
  { name: "YYC³-QZ-Merchant-Management-System", url: "https://clube.yyc3.top/", subdomain: "clube" },
  { name: "YYC³ Nexus", url: "https://nexus.yyc3.top/", subdomain: "nexus-2" },
  { name: "YYC³ NexusAI", url: "https://nexus-ai.yyc3.top/", subdomain: "nexus-ai" },
  { name: "YYC³ 万象归元", url: "https://saas.yyc3.vip/", subdomain: "saas" },
  { name: "MusAI 缪斯智音", url: "https://d-music.yyc3.top/", subdomain: "d-music" },
  { name: "YYC³ Business Management", url: "https://management.yyc3.top/", subdomain: "management" },
  { name: "YYC³ Portfolio", url: "https://protf.yyc3.top/", subdomain: "protf" },
  { name: "YYC³ AuraFlow", url: "https://aureflow.yyc3.top/", subdomain: "aureflow" },
  { name: "YYC³ Portable Intelligent AI", url: "https://ai.yyc3.top/", subdomain: "ai" },
  { name: "YYC³ Administration", url: "https://admin.yyc3.vip/", subdomain: "admin" },
  { name: "YYC3 AI Family", url: "https://pro.yyc3.top/", subdomain: "pro" },
  { name: "YYC³ Customer Care Center", url: "https://ccc.yyc3.top/", subdomain: "ccc" },
  { name: "YYC³ Pulse", url: "https://pulse.yyc3.top/zh-CN/", subdomain: "pulse" },
];

// GitHub 仓库列表（从 gh repo list 获取）
const repos = [
  "YYC3-Brain-Compute-System",
  "YYC3-Nexus",
  "YYC3_Learning-Platform",
  "YYC3-Cloud-Intelli-Matrix",
  "YYC3-AI-Family-Multi-Agent-Platform-",
  "YYC3-Smart-City-Platform",
  "YYC3-Dynasty-Framework",
  "YYC3-QZ-Merchant-Management-System",
  "YYC3-PAI",
  "YYC3-Portfolio",
  "YYC3-Nexus-Portal",
  "YYC3-Pulse",
  "YYC3-Bot",
  "YYC3-AI-Call",
  "YYC3-CloudPivot-Intelli-Matrix",
  "YYC3-NemoClaw",
  "YYC3-Customer-Care-Cente",
  "YYC3-AI-App-Intelligence-Platform",
  "YYC3-AI-PAI",
  "YYC3-AI-Code-FAmily",
  "YC3-Administration",
  "YYC3-AI-System",
  "YYC3-AI-Family",
  "YYC3-Industrial-Mechanical",
  "YYC3-Studio",
  "YYC3-Learning-Platform",
  "YYC3-Medical",
  "YYC3-Auraflow",
  "YYC3-Financial-Dashboard",
  "YYC3-Business-Management-System",
  "YYC3-Smart-Service-Engine",
  "YYC3-D-MusAI",
  "YYC3-Futuristic-Dashboard",
  "YYC3-Music-Player",
  "YYC3-Music-AI",
  "YYC3-Smart-Office",
  "YYC3-Easy-Table-Converter",
  "YYC3-Saas-Landing",
  "YYC3-Nexus-AI",
  "YYC3-Clube-Management-System",
  "YYC3-Club-Ops",
  "YYC3-AI-Aisistant",
  "YYC3-Financial-Quantitative-Trading-System",
  "YYC3-Infinite-Gallery",
  "YYC3-Short-Drama",
  "YYC3-UI-Design-System",
  "YYC3-AI-Code",
  "YYC3-Intelligent-Center",
  "YYC3-DataNexus",
  "YanYuCloud",
  "YYC3-PortAISys",
  "YYC3-Data-Dashboard-Design",
  "YYC3-NAS-ECS",
  "YYC3-HaiLan-Pro",
  "yyc3-claude-code",
  "YYC3-Customer-Care-Center",
  "YYC3-Catering-Platform",
  "YYC3-KTransformers",
  "YYC3-AI-Agent-Landing-Page",
  "YYC3-MovAISys",
  "yyc3-catering-platform-ui",
  "yyc3-xy-Aiapplicationuiuxdesign",
  "YYC3-Management",
  "yyc-xy-03",
  "yyc3_xiaoyu_ai",
  "yyc3_xy_ai",
  "yyc3-mech",
  "yyc3-xy-gov",
  "yyc3-stack-platform",
  "yyc3-smart-script-manager",
  "YanYuCloudCube",
  "YYC3-AI-Center",
  "yyc3-sharing-E-center",
  "YYC3-Integration-Hub",
  "YYC3-Nexus-Platform",
  "yyc3-service-platform",
  "yyc3-llm",
  "YYC3-Edu-Basic",
];

// 智能匹配函数
function matchProjectToRepo(project, repos) {
  const projectName = project.name.toLowerCase();
  const subdomain = project.subdomain.toLowerCase();
  
  // 匹配规则：
  // 1. 仓库名包含子域名
  // 2. 仓库名包含项目名称关键词
  // 3. 模糊匹配
  
  let matchedRepo = null;
  let maxScore = 0;
  
  for (const repo of repos) {
    const repoName = repo.toLowerCase();
    let score = 0;
    
    // 规则 1: 子域名匹配
    if (repoName.includes(subdomain)) {
      score += 10;
    }
    
    // 规则 2: 关键词匹配
    const keywords = projectName.split(/[\s\-·]+/);
    for (const keyword of keywords) {
      if (keyword.length > 2 && repoName.includes(keyword)) {
        score += 5;
      }
    }
    
    // 规则 3: 特殊映射
    const specialMaps = {
      "ai-family": ["YYC3-AI-Code-FAmily", "YYC3-AI-Family"],
      "ai-call": ["YYC3-AI-Call"],
      "nexus": ["YYC3-Nexus", "YYC3-Nexus-Portal"],
      "portal": ["YYC3-PortAISys", "YYC3-Nexus-Portal"],
      "smart-city": ["YYC3-Smart-City-Platform"],
      "learning": ["YYC3-Learning-Platform", "YYC3_Learning-Platform"],
      "ai-pai": ["YYC3-PAI", "YYC3-AI-PAI"],
      "family-ai": ["YYC3-AI-Family"],
      "code": ["YYC3-AI-Code", "YYC3-AI-Code-FAmily"],
      "matrix": ["YYC3-Cloud-Intelli-Matrix"],
      "design": ["YYC3-UI-Design-System"],
      "design-ui": ["YYC3-UI-Design-System"],
      "brain": ["YYC3-Brain-Compute-System"],
      "table": ["YYC3-Easy-Table-Converter"],
      "medical": ["YYC3-Medical"],
      "pivot": ["YYC3-CloudPivot-Intelli-Matrix"],
      "learning-ai": ["YYC3-Learning-Platform"],
      "futuristic": ["YYC3-Futuristic-Dashboard"],
      "nexus": ["YYC3-Nexus", "YYC3-Nexus-Portal"],
      "ai-assis": ["YYC3-AI-Aisistant", "YYC3-Bot"],
      "gallery": ["YYC3-Infinite-Gallery"],
      "club": ["YYC3-Club-Ops"],
      "clube": ["YYC3-Clube-Management-System"],
      "nexus-ai": ["YYC3-Nexus-AI"],
      "saas": ["YYC3-Saas-Landing"],
      "d-music": ["YYC3-D-MusAI", "YYC3-Music-AI"],
      "management": ["YYC3-Business-Management-System", "YYC3-Management"],
      "protf": ["YYC3-Portfolio"],
      "aureflow": ["YYC3-Auraflow"],
      "ai": ["YYC3-AI-System", "YYC3-AI-App-Intelligence-Platform"],
      "admin": ["YC3-Administration"],
      "pro": ["YYC3-AI-Family", "YYC3-AI-Family-Multi-Agent-Platform-"],
      "ccc": ["YYC3-Customer-Care-Center", "YYC3-Customer-Care-Cente"],
      "pulse": ["YYC3-Pulse"],
      "trading": ["YYC3-Financial-Quantitative-Trading-System", "YYC3-Financial-Dashboard"],
    };
    
    if (specialMaps[subdomain]) {
      for (const candidate of specialMaps[subdomain]) {
        if (repoName.includes(candidate.toLowerCase())) {
          score += 20;
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      matchedRepo = repo;
    }
  }
  
  return {
    project: project,
    repo: matchedRepo,
    score: maxScore,
  };
}

// 执行匹配
const matches = bookmarks.map(bookmark => matchProjectToRepo(bookmark, repos));

// 输出结果
console.log("=== 项目与 GitHub 仓库匹配结果 ===\n");
matches.forEach((match, index) => {
  console.log(`${index + 1}. ${match.project.name}`);
  console.log(`   子域名: ${match.project.subdomain}`);
  console.log(`   匹配仓库: ${match.repo || "未找到匹配"}`);
  console.log(`   匹配分数: ${match.score}`);
  console.log("");
});

// 生成 PortfolioGrid.tsx 所需的项目数据
console.log("\n=== 生成 PortfolioGrid.tsx 项目数据 ===\n");
const projectData = matches.map((match, index) => {
  const repoUrl = match.repo 
    ? `https://github.com/YYC-Cube/${match.repo}`
    : match.project.url; // 如果没有匹配仓库，指向项目主页
  
  return {
    id: index + 1,
    title: match.project.name,
    description: `项目描述`, // 需要手动补充
    imageUrl: `/Project-Screenshot/YYC3-${String(index + 1).padStart(2, '0')}.png`,
    category: "分类", // 需要手动补充
    demoUrl: match.project.url,
    liveUrl: repoUrl,
  };
});

console.log(JSON.stringify(projectData, null, 2));

// 保存到文件
fs.writeFileSync(
  '/Volumes/Max/YYC3-Portfolio/scripts/matched-projects.json',
  JSON.stringify(projectData, null, 2)
);
console.log("\n✅ 匹配结果已保存到 scripts/matched-projects.json");

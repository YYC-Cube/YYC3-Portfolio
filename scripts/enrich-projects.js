const fs = require('fs');

// 读取匹配结果
const matches = JSON.parse(fs.readFileSync('/Volumes/Max/YYC3-Portfolio/scripts/matched-projects.json', 'utf8'));

// 智能生成描述
function generateDescription(project) {
  const title = project.title;
  const subdomain = project.demoUrl.match(/https?:\/\/([^.]+)\./)?.[1] || '';
  
  // 基于关键词的描述模板
  const templates = [
    { keywords: ['AI', '智能', 'Intelligence'], template: 'AI 驱动的{type}，智能化{w purpose}' },
    { keywords: ['Portal', '门户', '入口'], template: '统一入口与导航平台，{purpose}' },
    { keywords: ['Management', '管理', 'Management'], template: '企业级管理系统，{purpose}' },
    { keywords: ['Learning', '学习', '教育'], template: '智能化在线学习平台，{purpose}' },
    { keywords: ['Med', '医疗', 'Medical'], template: 'AI-Powered 医疗系统，{purpose}' },
    { keywords: ['Music', '音乐', 'MusAI'], template: 'AI 音乐创作平台，{purpose}' },
    { keywords: ['Gallery', '画廊', '摄影'], template: '视觉作品展示平台，{purpose}' },
    { keywords: ['Trading', '交易', 'Quantitative'], template: 'AI 驱动的金融分析系统，{purpose}' },
    { keywords: ['City', '社区', 'Smart'], template: '智慧城市解决方案，{purpose}' },
    { keywords: ['Cloud', '云', 'Cloud'], template: '云端智能平台，{purpose}' },
    { keywords: ['Call', '呼叫', 'Calling'], template: '智能呼叫系统，{purpose}' },
    { keywords: ['Brain', '脑', 'Brain'], template: '脑机接口系统，{purpose}' },
    { keywords: ['Table', '表格', 'Converter'], template: '数据处理与转换工具，{purpose}' },
    { keywords: ['KTV', 'POS', 'Club'], template: '行业解决方案，{purpose}' },
    { keywords: ['Merchant', '商家', '商业'], template: '商家管理与运营平台，{purpose}' },
    { keywords: ['Nexus', '集成', 'Integration'], template: '集成中心与智能中枢，{purpose}' },
    { keywords: ['Aura', 'Flow', '流畅'], template: '流畅的用户体验平台，{purpose}' },
    { keywords: ['Pulse', '脉冲', '监控'], template: '实时监控与数据分析平台，{purpose}' },
    { keywords: ['SaaS', '万象', '归元'], template: 'SaaS 平台，{purpose}' },
    { keywords: ['Portfolio', '作品', '展示'], template: '作品展示与项目管理平台，{purpose}' },
  ];
  
  // 默认描述
  let description = '创新型智能应用，{purpose}';
  
  // 尝试匹配模板
  for (const template of templates) {
    if (template.keywords.some(keyword => title.includes(keyword) || subdomain.includes(keyword.toLowerCase()))) {
      description = template.template;
      break;
    }
  }
  
  // 填充模板
  const type = title.includes('AI') ? '智能应用' : '应用';
  const purpose = '提供卓越的用户体验'; // 默认目的
  
  description = description
    .replace('{type}', type)
    .replace('{purpose}', purpose);
  
  return description;
}

// 智能生成分类
function generateCategory(project) {
  const title = project.title;
  const subdomain = project.demoUrl.match(/https?:\/\/([^.]+)\./)?.[1] || '';
  
  // 分类规则
  const rules = [
    { keywords: ['AI', '智能', 'Intelligence', 'Brain', 'Call'], category: 'AI应用' },
    { keywords: ['Portal', '门户'], category: 'Web应用' },
    { keywords: ['Management', '管理', 'Administration'], category: '企业应用' },
    { keywords: ['Learning', '学习', '教育'], category: '教育科技' },
    { keywords: ['Med', '医疗'], category: '行业解决方案' },
    { keywords: ['Music', '音乐', 'MusAI'], category: '创意设计' },
    { keywords: ['Gallery', '画廊', '摄影'], category: '数字营销' },
    { keywords: ['Trading', '交易', 'Financial'], category: '金融科技' },
    { keywords: ['City', '社区', 'Smart'], category: '行业解决方案' },
    { keywords: ['Cloud', '云'], category: '云服务' },
    { keywords: ['Table', '表格', 'Converter'], category: '工具应用' },
    { keywords: ['KTV', 'POS', 'Club'], category: '行业解决方案' },
    { keywords: ['Merchant', '商家'], category: '行业解决方案' },
    { keywords: ['Nexus', '集成'], category: 'Web应用' },
    { keywords: ['Aura', 'Flow'], category: 'Web应用' },
    { keywords: ['Pulse', '监控'], category: 'Web应用' },
    { keywords: ['SaaS', '万象'], category: '企业应用' },
    { keywords: ['Portfolio', '作品'], category: '数字营销' },
    { keywords: ['Code', '代码', '开发'], category: '开发工具' },
    { keywords: ['Design', '设计', 'UI'], category: '创意设计' },
    { keywords: ['Docs', '文档'], category: '文档' },
  ];
  
  // 默认分类
  let category = 'Web应用';
  
  // 尝试匹配规则
  for (const rule of rules) {
    if (rule.keywords.some(keyword => title.includes(keyword) || subdomain.includes(keyword.toLowerCase()))) {
      category = rule.category;
      break;
    }
  }
  
  return category;
}

//  enrich 项目数据
const enrichedProjects = matches.map(project => {
  return {
    ...project,
    description: generateDescription(project),
    category: generateCategory(project),
  };
});

// 输出结果
console.log('=== 智能补充后的项目数据 ===\n');
enrichedProjects.forEach((project, index) => {
  console.log(`${index + 1}. ${project.title}`);
  console.log(`   描述: ${project.description}`);
  console.log(`   分类: ${project.category}`);
  console.log(`   Demo: ${project.demoUrl}`);
  console.log(`   Source: ${project.liveUrl}`);
  console.log('');
});

// 保存到文件
fs.writeFileSync(
  '/Volumes/Max/YYC3-Portfolio/scripts/enriched-projects.json',
  JSON.stringify(enrichedProjects, null, 2)
);
console.log('✅ 补充结果已保存到 scripts/enriched-projects.json');

// 生成 TypeScript 代码片段（简化版）
let tsSnippet = 'const projects = [\n';
enrichedProjects.forEach(p => {
  tsSnippet += `  {\n`;
  tsSnippet += `    id: ${p.id},\n`;
  tsSnippet += `    title: "${p.title}",\n`;
  tsSnippet += `    description: "${p.description}",\n`;
  tsSnippet += `    imageUrl: "${p.imageUrl}",\n`;
  tsSnippet += `    category: "${p.category}",\n`;
  tsSnippet += `    demoUrl: "${p.demoUrl}",\n`;
  tsSnippet += `    liveUrl: "${p.liveUrl}",\n`;
  tsSnippet += `  },\n`;
});
tsSnippet += '];\n';

fs.writeFileSync(
  '/Volumes/Max/YYC3-Portfolio/scripts/projects-snippet.ts',
  tsSnippet
);
console.log('✅ TypeScript 代码片段已保存到 scripts/projects-snippet.ts');

// 生成审查报告
let report = '# YYC³ Portfolio 项目数据审查报告\n\n';
report += '## 项目列表\n\n';
enrichedProjects.forEach((project, index) => {
  report += `### ${index + 1}. ${project.title}\n\n`;
  report += `- **子域名**: ${project.demoUrl.match(/https?:\/\/([^.]+)\./)?.[1] || ''}\n`;
  report += `- **Demo URL**: ${project.demoUrl}\n`;
  report += `- **Source URL**: ${project.liveUrl}\n`;
  report += `- **分类**: ${project.category}\n`;
  report += `- **描述**: ${project.description}\n`;
  report += `- **截图**: ${project.imageUrl}\n\n`;
});

fs.writeFileSync(
  '/Volumes/Max/YYC3-Portfolio/scripts/review-report.md',
  report
);
console.log(`✅ 审查报告已保存到 scripts/review-report.md`);

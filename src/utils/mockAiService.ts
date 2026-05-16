import { AgendaItem, Decision, Material, Meeting, MeetingScene, MinuteChapter, Minutes, PreTodo, Todo } from '../types';
import { generateId } from './storage';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── 素材库：互联网大厂技术评审场景 ──────────────────────────────────
const materialSummaryPool: Record<string, string> = {
  '性能': 'V2 接口 P99 延迟从 320ms 降至 85ms，核心瓶颈在数据库连接池',
  '用户': '用户增长实验组 DAU 提升 12%，但留存率下降 3%，需权衡',
  '搜索': '搜索算法 A/B 测试显示 CTR 提升 8.5%，但结果多样性评分下降',
  '迁移': '云迁移已完成 60%，剩余有状态服务迁移风险较高，建议分批进行',
  '体验': '移动端 LCP 从 4.2s 优化至 1.8s，首屏可交互时间缩短 40%',
  '安全': '上周发现 2 个 P1 漏洞已修复，合规审计下月启动',
  '成本': 'Q2 云资源成本超预算 15%，主要来自 GPU 实例空闲率过高',
  '架构': '微服务拆分已完成 80%，剩余订单服务耦合度较高需重构',
};

// ── analyzeMaterial ──────────────────────────────────────────────────
export async function analyzeMaterial(content: string): Promise<string> {
  await delay(1200 + Math.random() * 800);

  for (const [keyword, summary] of Object.entries(materialSummaryPool)) {
    if (content.includes(keyword)) return summary;
  }

  const fallbacks = [
    `分析了素材内容，发现 ${content.substring(0, 20)}... 相关的关键信息`,
    `从材料中提取到重要数据点，涉及核心业务指标`,
    `识别到潜在风险点和优化机会，建议重点关注`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ── smartParseForm ───────────────────────────────────────────────────
export async function smartParseForm(materials: Material[]) {
  await delay(2000 + Math.random() * 1000);

  const allText = materials.map(m => m.content + ' ' + m.summary).join(' ');

  let title = '技术方案评审会';
  let time = '14:00';
  let participants = ['技术负责人', '产品经理', '架构师', 'QA 负责人'];

  if (allText.includes('性能') || allText.includes('接口')) {
    title = 'V2 接口性能优化方案评审';
    participants = ['后端负责人', 'DBA', 'SRE', '产品经理'];
  } else if (allText.includes('用户') || allText.includes('增长')) {
    title = '用户增长实验数据分析会';
    time = '10:00';
    participants = ['数据分析师', '增长负责人', '产品经理', '运营'];
  } else if (allText.includes('搜索') || allText.includes('算法')) {
    title = '搜索算法 A/B 测试结果评审';
    time = '15:30';
    participants = ['算法工程师', '搜索负责人', '产品经理', '前端负责人'];
  } else if (allText.includes('迁移') || allText.includes('云')) {
    title = '基础设施云迁移风险评估';
    participants = ['运维负责人', '架构师', 'DBA', '安全工程师'];
  } else if (allText.includes('体验') || allText.includes('移动')) {
    title = '移动端体验优化专项评审';
    time = '11:00';
    participants = ['前端负责人', '移动端开发', '设计师', '产品经理'];
  }

  const agenda: AgendaItem[] = [
    { id: generateId(), title: '背景与目标概述', duration: 5, presenter: participants[0], order: 1 },
    { id: generateId(), title: '数据现状分析', duration: 15, presenter: participants[1], order: 2 },
    { id: generateId(), title: '技术方案讨论', duration: 20, presenter: participants[2], order: 3 },
    { id: generateId(), title: '风险与排期评估', duration: 10, presenter: participants[0], order: 4 },
  ];

  return { title, time, participants, agenda };
}

// ── generatePreviewSummary ───────────────────────────────────────────
export async function generatePreviewSummary(meeting: Meeting): Promise<string> {
  await delay(1500 + Math.random() * 500);

  const summaries: string[] = [];

  if (meeting.materials.length > 0) {
    const keyPoints = meeting.materials
      .filter(m => m.enabled !== false)
      .map(m => m.summary)
      .filter(Boolean)
      .slice(0, 2)
      .join('；');
    if (keyPoints) summaries.push(keyPoints);
  }

  if (meeting.agenda.length > 0) {
    const agendaTitles = meeting.agenda.slice(0, 3).map(a => a.title).join('、');
    const total = meeting.agenda.reduce((s, a) => s + a.duration, 0);
    summaries.push(`关键议程：${agendaTitles}，共 ${meeting.agenda.length} 项 ${total} 分钟`);
  }

  if (meeting.background && summaries.length < 2) {
    summaries.push(`会议聚焦${meeting.background.substring(0, 30)}`);
  }

  const result = summaries.join('。');
  return result.length > 120 ? result.substring(0, 117) + '...' : result;
}

// ── generateAgenda（增强版，支持 scene）──────────────────────────────
export async function generateAgenda(background: string, scene?: MeetingScene): Promise<AgendaItem[]> {
  await delay(2000 + Math.random() * 1000);

  const has = (k: string) => background.includes(k);

  // 场景化议程池
  const scenePools: Record<MeetingScene, AgendaItem[][]> = {
    requirement: [
      [
        { id: generateId(), title: '需求背景与目标', duration: 5, presenter: '产品经理', order: 1 },
        { id: generateId(), title: '用户故事与场景梳理', duration: 10, presenter: '产品经理', order: 2 },
        { id: generateId(), title: '技术可行性评估', duration: 15, presenter: '技术负责人', order: 3 },
        { id: generateId(), title: '交互与视觉方案', duration: 10, presenter: '设计师', order: 4 },
        { id: generateId(), title: '排期与优先级确认', duration: 10, presenter: '项目经理', order: 5 },
      ],
    ],
    incident: [
      [
        { id: generateId(), title: '故障时间线回顾', duration: 5, presenter: 'SRE', order: 1 },
        { id: generateId(), title: '影响范围与用户数据', duration: 5, presenter: '数据分析师', order: 2 },
        { id: generateId(), title: '根因分析', duration: 15, presenter: '技术负责人', order: 3 },
        { id: generateId(), title: '修复方案与验证', duration: 10, presenter: '后端负责人', order: 4 },
        { id: generateId(), title: '预防措施与 SOP 完善', duration: 10, presenter: '运维负责人', order: 5 },
      ],
    ],
    sync: [
      [
        { id: generateId(), title: '上周进展同步', duration: 10, presenter: '各负责人', order: 1 },
        { id: generateId(), title: '本周计划与优先级', duration: 10, presenter: '项目经理', order: 2 },
        { id: generateId(), title: '阻塞项与资源协调', duration: 10, presenter: '团队成员', order: 3 },
        { id: generateId(), title: '开放讨论', duration: 10, presenter: '会议主持人', order: 4 },
      ],
    ],
    technical: [
      [
        { id: generateId(), title: '技术架构现状', duration: 10, presenter: '架构师', order: 1 },
        { id: generateId(), title: '方案对比与选型', duration: 20, presenter: '技术负责人', order: 2 },
        { id: generateId(), title: '性能与安全评审', duration: 10, presenter: 'SRE', order: 3 },
        { id: generateId(), title: '实施计划与风险', duration: 10, presenter: '项目经理', order: 4 },
      ],
    ],
    other: [],
  };

  // 优先使用场景议程
  if (scene && scenePools[scene]?.length > 0) {
    return scenePools[scene][0];
  }

  // 按关键词匹配
  const keywordPools: AgendaItem[][] = [
    [
      { id: generateId(), title: '当前性能指标回顾', duration: 10, presenter: 'SRE', order: 1 },
      { id: generateId(), title: '瓶颈分析与根因定位', duration: 15, presenter: '后端负责人', order: 2 },
      { id: generateId(), title: '优化方案技术评审', duration: 20, presenter: '架构师', order: 3 },
      { id: generateId(), title: '压测计划与灰度策略', duration: 10, presenter: 'QA 负责人', order: 4 },
      { id: generateId(), title: '排期与资源协调', duration: 5, presenter: '项目经理', order: 5 },
    ],
    [
      { id: generateId(), title: '实验设计与假设回顾', duration: 5, presenter: '数据分析师', order: 1 },
      { id: generateId(), title: '核心指标数据解读', duration: 15, presenter: '数据分析师', order: 2 },
      { id: generateId(), title: '用户行为路径分析', duration: 10, presenter: '产品经理', order: 3 },
      { id: generateId(), title: '增长策略调整方案', duration: 15, presenter: '增长负责人', order: 4 },
      { id: generateId(), title: '下一轮实验计划', duration: 5, presenter: '增长负责人', order: 5 },
    ],
    [
      { id: generateId(), title: '算法模型迭代说明', duration: 10, presenter: '算法工程师', order: 1 },
      { id: generateId(), title: 'A/B 测试数据报告', duration: 15, presenter: '数据分析师', order: 2 },
      { id: generateId(), title: '搜索质量评估指标', duration: 10, presenter: '搜索负责人', order: 3 },
      { id: generateId(), title: '线上问题与用户体验反馈', duration: 10, presenter: '前端负责人', order: 4 },
      { id: generateId(), title: '下一步迭代方向', duration: 5, presenter: '算法负责人', order: 5 },
      { id: generateId(), title: '资源需求与排期', duration: 5, presenter: '项目经理', order: 6 },
    ],
    [
      { id: generateId(), title: '迁移进度总览', duration: 10, presenter: '运维负责人', order: 1 },
      { id: generateId(), title: '已完成服务运行状况', duration: 10, presenter: 'SRE', order: 2 },
      { id: generateId(), title: '有状态服务迁移方案', duration: 20, presenter: '架构师', order: 3 },
      { id: generateId(), title: '风险评估与回滚预案', duration: 10, presenter: 'DBA', order: 4 },
      { id: generateId(), title: '安全合规检查清单', duration: 5, presenter: '安全工程师', order: 5 },
      { id: generateId(), title: '分批迁移排期', duration: 5, presenter: '项目经理', order: 6 },
    ],
    [
      { id: generateId(), title: '性能指标与竞品对比', duration: 10, presenter: '前端负责人', order: 1 },
      { id: generateId(), title: '用户调研洞察分享', duration: 10, presenter: '设计师', order: 2 },
      { id: generateId(), title: '优化方案技术评审', duration: 15, presenter: '移动端开发', order: 3 },
      { id: generateId(), title: '设计规范与交互方案', duration: 10, presenter: '设计师', order: 4 },
      { id: generateId(), title: '排期与分阶段计划', duration: 5, presenter: '产品经理', order: 5 },
    ],
    [
      { id: generateId(), title: '项目进展汇报', duration: 15, presenter: '项目经理', order: 1 },
      { id: generateId(), title: '技术方案讨论', duration: 20, presenter: '技术负责人', order: 2 },
      { id: generateId(), title: '问题与风险分析', duration: 10, presenter: '团队成员', order: 3 },
      { id: generateId(), title: '下一步行动计划', duration: 10, presenter: '会议主持人', order: 4 },
    ],
  ];

  let idx = keywordPools.length - 1;
  if (has('性能') || has('接口') || has('延迟')) idx = 0;
  else if (has('用户') || has('增长') || has('DAU')) idx = 1;
  else if (has('搜索') || has('算法') || has('A/B')) idx = 2;
  else if (has('迁移') || has('云') || has('基础设施')) idx = 3;
  else if (has('体验') || has('移动') || has('前端')) idx = 4;

  return keywordPools[idx];
}

// ── generatePreTodos ─────────────────────────────────────────────────
export async function generatePreTodos(meeting: Meeting): Promise<PreTodo[]> {
  await delay(1200 + Math.random() * 600);

  const todos: PreTodo[] = [];
  const enabledMaterials = meeting.materials.filter(m => m.enabled !== false);

  if (enabledMaterials.length > 0) {
    todos.push({
      id: generateId(),
      content: `提前阅读 ${enabledMaterials[0].name}，了解核心背景`,
      assignee: meeting.participants[0] || '全员',
      priority: 'high',
    });
  }

  todos.push({
    id: generateId(),
    content: '确认各议程负责人已准备就绪',
    assignee: meeting.participants[0] || '项目经理',
    priority: 'medium',
  });

  todos.push({
    id: generateId(),
    content: '准备会议室设备与会议链接',
    assignee: meeting.participants[meeting.participants.length - 1] || '行政',
    priority: 'low',
  });

  if (meeting.scene === 'incident') {
    todos.unshift({
      id: generateId(),
      content: '收集故障期间的监控数据与日志截图',
      assignee: 'SRE',
      priority: 'high',
    });
  } else if (meeting.scene === 'requirement') {
    todos.unshift({
      id: generateId(),
      content: '准备需求 PRD 文档与原型演示链接',
      assignee: '产品经理',
      priority: 'high',
    });
  }

  return todos;
}

// ── generateMinutes ──────────────────────────────────────────────────
export async function generateMinutes(rawInput: string): Promise<Minutes> {
  await delay(2500 + Math.random() * 1500);

  const chapters: MinuteChapter[] = [
    { id: generateId(), timestamp: '00:00', title: '会议开场与背景同步', summary: '主持人介绍会议目标：评估高并发场景下 API 性能瓶颈，确定优化方案。同步上周故障影响范围：8.7 万笔订单受阻，P99 延迟飙升至 580ms。' },
    { id: generateId(), timestamp: '05:30', title: '性能数据回顾', summary: 'SRE 团队展示监控大盘：数据库连接池利用率持续 >95%，订单查询慢 SQL 占总请求 23%，缓存命中率从 92% 降至 78%。' },
    { id: generateId(), timestamp: '12:00', title: '根因分析', summary: 'DBA 定位核心瓶颈：订单表缺少 (user_id, created_at) 联合索引，导致全表扫描。连接池配置不合理，max_connections=100 无法应对峰值。' },
    { id: generateId(), timestamp: '20:00', title: '方案讨论与分歧', summary: '方案 A：增加索引 + 调整连接池（DBA 提出）；方案 B：引入读写分离 + Redis 缓存层（架构师提出）；方案 C：微服务拆分订单模块（后端负责人提出）。各方对实施周期和风险存在分歧。' },
    { id: generateId(), timestamp: '32:00', title: '决策与排期', summary: '最终采纳方案 A 作为短期方案（1 周内上线），方案 B 作为中期方案（Q3 启动）。方案 C 因改动范围过大被否决，留待后续评估。' },
    { id: generateId(), timestamp: '40:00', title: '后续行动项', summary: '明确各项任务负责人与截止日期：索引优化本周五前完成、连接池调优下周一上线、读写分离方案下周三前出设计文档。' },
  ];

  const decisions: Decision[] = [
    { id: generateId(), conclusion: '短期采用「增加联合索引 + 调整连接池」方案', reason: '改动最小、见效最快，1 周内可上线验证效果', isRejected: false },
    { id: generateId(), conclusion: '中期启动「读写分离 + Redis 缓存层」建设', reason: '从根本上解决读写压力，为后续增长预留空间', isRejected: false },
    { id: generateId(), conclusion: '建立连接池水位监控告警（阈值 80%）', reason: '预防类似故障再次发生，提前预警', isRejected: false },
    { id: generateId(), conclusion: '微服务拆分订单模块', reason: '改动范围过大、实施周期 2-3 个月，短期 ROI 不足', isRejected: true },
  ];

  const content = `## 会议纪要

### 会议要点
${chapters.map(c => `${c.timestamp} **${c.title}**：${c.summary}`).join('\n\n')}

### 关键决策
${decisions.filter(d => !d.isRejected).map(d => `- ${d.conclusion}（${d.reason}）`).join('\n')}
${decisions.filter(d => d.isRejected).map(d => `- ~~${d.conclusion}~~ — 已否决：${d.reason}`).join('\n')}`;

  return {
    id: generateId(),
    meetingId: '',
    rawInput,
    content,
    chapters,
    decisions,
    createdAt: new Date().toISOString(),
  };
}

// ── extractTodos ─────────────────────────────────────────────────────
export async function extractTodos(_minutes: string): Promise<Todo[]> {
  await delay(1500 + Math.random() * 1000);

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  return [
    {
      id: generateId(),
      content: '为订单表增加 (user_id, created_at) 联合索引',
      assignee: 'DBA',
      dueDate: in3Days.toISOString().split('T')[0],
      status: 'in_progress',
      contextSnippet: 'DBA 定位核心瓶颈：订单表缺少联合索引导致全表扫描，占总请求 23%',
    },
    {
      id: generateId(),
      content: '调整数据库连接池 max_connections 至 500',
      assignee: '后端负责人',
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      contextSnippet: '连接池配置不合理，max_connections=100 无法应对峰值，利用率持续 >95%',
    },
    {
      id: generateId(),
      content: '建立连接池水位监控告警（阈值 80%）',
      assignee: 'SRE',
      dueDate: nextWeek.toISOString().split('T')[0],
      status: 'pending',
      contextSnippet: '上周故障根因是连接池耗尽无预警，需建立水位监控机制',
    },
    {
      id: generateId(),
      content: '输出读写分离 + Redis 缓存层设计文档',
      assignee: '架构师',
      dueDate: nextWeek.toISOString().split('T')[0],
      status: 'pending',
      contextSnippet: '中期方案：引入读写分离 + Redis 缓存层，从根本上解决读写压力',
    },
    {
      id: generateId(),
      content: '完成索引优化后的压测验证',
      assignee: 'QA 负责人',
      dueDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      contextSnippet: '索引优化本周五前上线，需在灰度环境完成压测验证效果',
    },
    {
      id: generateId(),
      content: '更新故障应急 SOP 文档',
      assignee: 'SRE',
      dueDate: nextWeek.toISOString().split('T')[0],
      status: 'completed',
      contextSnippet: '会议决定两周内完善故障应急 SOP，预防类似问题',
    },
  ];
}

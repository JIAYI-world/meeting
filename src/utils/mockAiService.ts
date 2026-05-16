import { AgendaItem, Material, Meeting, Minutes, Todo } from '../types';
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

  const agendaCount = meeting.agenda.length;
  const participantCount = meeting.participants.length;

  const summaries: string[] = [];

  if (meeting.materials.length > 0) {
    const keyPoints = meeting.materials
      .map(m => m.summary)
      .filter(Boolean)
      .slice(0, 2)
      .join('；');
    if (keyPoints) summaries.push(keyPoints);
  }

  if (meeting.background) {
    summaries.push(`会议聚焦${meeting.background.substring(0, 30)}`);
  }

  if (summaries.length === 0) {
    summaries.push(
      `本次会议共 ${agendaCount} 项议程，${participantCount} 位参会人参与讨论，预计总时长 ${meeting.agenda.reduce((s, a) => s + a.duration, 0)} 分钟`
    );
  }

  const result = summaries.join('。');
  return result.length > 100 ? result.substring(0, 97) + '...' : result;
}

// ── generateAgenda（增强版）──────────────────────────────────────────
export async function generateAgenda(background: string): Promise<AgendaItem[]> {
  await delay(2000 + Math.random() * 1000);

  const has = (k: string) => background.includes(k);

  const pools: AgendaItem[][] = [
    // 性能/接口
    [
      { id: generateId(), title: '当前性能指标回顾', duration: 10, presenter: 'SRE', order: 1 },
      { id: generateId(), title: '瓶颈分析与根因定位', duration: 15, presenter: '后端负责人', order: 2 },
      { id: generateId(), title: '优化方案技术评审', duration: 20, presenter: '架构师', order: 3 },
      { id: generateId(), title: '压测计划与灰度策略', duration: 10, presenter: 'QA 负责人', order: 4 },
      { id: generateId(), title: '排期与资源协调', duration: 5, presenter: '项目经理', order: 5 },
    ],
    // 用户/增长
    [
      { id: generateId(), title: '实验设计与假设回顾', duration: 5, presenter: '数据分析师', order: 1 },
      { id: generateId(), title: '核心指标数据解读', duration: 15, presenter: '数据分析师', order: 2 },
      { id: generateId(), title: '用户行为路径分析', duration: 10, presenter: '产品经理', order: 3 },
      { id: generateId(), title: '增长策略调整方案', duration: 15, presenter: '增长负责人', order: 4 },
      { id: generateId(), title: '下一轮实验计划', duration: 5, presenter: '增长负责人', order: 5 },
    ],
    // 搜索/算法
    [
      { id: generateId(), title: '算法模型迭代说明', duration: 10, presenter: '算法工程师', order: 1 },
      { id: generateId(), title: 'A/B 测试数据报告', duration: 15, presenter: '数据分析师', order: 2 },
      { id: generateId(), title: '搜索质量评估指标', duration: 10, presenter: '搜索负责人', order: 3 },
      { id: generateId(), title: '线上问题与用户体验反馈', duration: 10, presenter: '前端负责人', order: 4 },
      { id: generateId(), title: '下一步迭代方向', duration: 5, presenter: '算法负责人', order: 5 },
      { id: generateId(), title: '资源需求与排期', duration: 5, presenter: '项目经理', order: 6 },
    ],
    // 迁移/云
    [
      { id: generateId(), title: '迁移进度总览', duration: 10, presenter: '运维负责人', order: 1 },
      { id: generateId(), title: '已完成服务运行状况', duration: 10, presenter: 'SRE', order: 2 },
      { id: generateId(), title: '有状态服务迁移方案', duration: 20, presenter: '架构师', order: 3 },
      { id: generateId(), title: '风险评估与回滚预案', duration: 10, presenter: 'DBA', order: 4 },
      { id: generateId(), title: '安全合规检查清单', duration: 5, presenter: '安全工程师', order: 5 },
      { id: generateId(), title: '分批迁移排期', duration: 5, presenter: '项目经理', order: 6 },
    ],
    // 体验/移动
    [
      { id: generateId(), title: '性能指标与竞品对比', duration: 10, presenter: '前端负责人', order: 1 },
      { id: generateId(), title: '用户调研洞察分享', duration: 10, presenter: '设计师', order: 2 },
      { id: generateId(), title: '优化方案技术评审', duration: 15, presenter: '移动端开发', order: 3 },
      { id: generateId(), title: '设计规范与交互方案', duration: 10, presenter: '设计师', order: 4 },
      { id: generateId(), title: '排期与分阶段计划', duration: 5, presenter: '产品经理', order: 5 },
    ],
    // 默认
    [
      { id: generateId(), title: '项目进展汇报', duration: 15, presenter: '项目经理', order: 1 },
      { id: generateId(), title: '技术方案讨论', duration: 20, presenter: '技术负责人', order: 2 },
      { id: generateId(), title: '问题与风险分析', duration: 10, presenter: '团队成员', order: 3 },
      { id: generateId(), title: '下一步行动计划', duration: 10, presenter: '会议主持人', order: 4 },
    ],
  ];

  let idx = pools.length - 1; // 默认
  if (has('性能') || has('接口') || has('延迟')) idx = 0;
  else if (has('用户') || has('增长') || has('DAU')) idx = 1;
  else if (has('搜索') || has('算法') || has('A/B')) idx = 2;
  else if (has('迁移') || has('云') || has('基础设施')) idx = 3;
  else if (has('体验') || has('移动') || has('前端')) idx = 4;

  return pools[idx];
}

// ── generateMinutes ──────────────────────────────────────────────────
export async function generateMinutes(rawInput: string): Promise<Minutes> {
  await delay(2500 + Math.random() * 1500);

  const content = `## 会议纪要

### 会议要点
1. ${rawInput.substring(0, 80)}...
2. 团队对当前进展表示认可
3. 确定了下一阶段的重点工作

### 关键讨论
- 技术方案已基本确定，需要进一步细化
- 时间节点需要重新评估
- 资源分配需要优化

### 后续行动
- 相关负责人需在本周内提交详细计划
- 下次会议将重点讨论执行细节`;

  const decisions = [
    '确定采用新的技术方案',
    '项目时间线调整为下月底',
    '增加两名开发人员支持',
  ];

  return {
    id: generateId(),
    meetingId: '',
    rawInput,
    content,
    decisions,
    createdAt: new Date().toISOString(),
  };
}

// ── extractTodos ─────────────────────────────────────────────────────
export async function extractTodos(_minutes: string): Promise<Todo[]> {
  await delay(1500 + Math.random() * 1000);

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return [
    {
      id: generateId(),
      content: '完成技术方案文档',
      assignee: '张三',
      dueDate: nextWeek.toISOString().split('T')[0],
      status: 'pending',
    },
    {
      id: generateId(),
      content: '组织代码评审会议',
      assignee: '李四',
      dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in_progress',
    },
    {
      id: generateId(),
      content: '更新项目时间线',
      assignee: '王五',
      dueDate: today.toISOString().split('T')[0],
      status: 'completed',
    },
  ];
}

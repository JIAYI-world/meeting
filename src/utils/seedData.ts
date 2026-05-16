import { Meeting } from '../types';
import { saveMeetings } from './storage';

const seedMeetings: Meeting[] = [
  // ── 1. 技术评审 · preparing · 有素材，未 AI 解析 ──────────────────
  // 点击「AI 智能解析」后，表单会自动填充为：标题=V2 接口性能优化方案评审、参会人=后端负责人/DBA/SRE/产品经理
  {
    id: 'seed_1',
    title: '技术方案评审会',
    date: '2026-05-16',
    time: '14:00',
    location: '飞书会议 8801234',
    participants: [],
    background: '',
    scene: 'other',
    materials: [
      {
        id: 'm1',
        name: '接口性能监控报告',
        type: 'text',
        content: 'V2 接口 P99 延迟从 320ms 升至 580ms，数据库连接池利用率 95%，核心瓶颈在订单查询慢 SQL，建议增加索引并优化连接池配置',
        summary: '',
        isAnalyzing: false,
        enabled: true,
        relevance: 'medium',
        createdAt: '2026-05-15T10:00:00.000Z',
      },
      {
        id: 'm2',
        name: '上周故障复盘',
        type: 'text',
        content: '5月10日 14:00-14:30 订单服务超时，影响用户 2.3 万，根因是慢查询导致连接池耗尽，需紧急优化后端负责人：张三，DBA：李四，SRE：王五',
        summary: '',
        isAnalyzing: false,
        enabled: true,
        relevance: 'medium',
        createdAt: '2026-05-14T09:00:00.000Z',
      },
    ],
    agenda: [],
    minutes: null,
    todos: [],
    preTodos: [],
    previewSummary: '',
    status: 'preparing',
    createdAt: '2026-05-15T08:00:00.000Z',
    updatedAt: '2026-05-15T10:00:00.000Z',
  },

  // ── 2. 故障复盘 · preparing · 有素材，未 AI 解析 ──────────────────
  // 点击「AI 智能解析」后，表单会自动填充为：标题=支付系统故障复盘、场景=故障复盘、参会人=SRE/后端负责人/支付负责人
  {
    id: 'seed_2',
    title: '故障复盘会议',
    date: '2026-05-17',
    time: '16:00',
    location: '飞书会议 9905678',
    participants: [],
    background: '',
    scene: 'other',
    materials: [
      {
        id: 'm9',
        name: '故障时间线',
        type: 'text',
        content: '14:22 告警触发 → 14:25 开始降级 → 14:38 定位根因（Redis 连接池耗尽）→ 14:52 恢复 → 15:10 全量恢复，SRE：赵六，后端负责人：张三',
        summary: '',
        isAnalyzing: false,
        enabled: true,
        relevance: 'medium',
        createdAt: '2026-05-16T10:00:00.000Z',
      },
      {
        id: 'm10',
        name: '影响范围数据',
        type: 'text',
        content: '受影响订单 8.7 万笔，金额约 1200 万元，用户投诉 2300+ 条，客服工单 1500+，支付负责人：孙七',
        summary: '',
        isAnalyzing: false,
        enabled: true,
        relevance: 'medium',
        createdAt: '2026-05-16T11:00:00.000Z',
      },
    ],
    agenda: [],
    minutes: null,
    todos: [],
    preTodos: [],
    previewSummary: '',
    status: 'preparing',
    createdAt: '2026-05-16T08:00:00.000Z',
    updatedAt: '2026-05-16T11:00:00.000Z',
  },

  // ── 3. 技术评审 · preparing · 已 AI 生成（第一版）──────────────────
  // 有议程+摘要+待办，用户可点「重新生成议程」体验优化版
  {
    id: 'seed_3',
    title: '用户增长实验 Q2 数据分析会',
    date: '2026-05-18',
    time: '10:00',
    location: '会议室 A-301',
    participants: ['数据分析师', '增长负责人', '产品经理', '运营负责人'],
    background: 'Q2 新用户注册转化漏斗分析，评估社交裂变实验效果',
    scene: 'technical',
    materials: [
      {
        id: 'm3',
        name: '实验数据看板',
        type: 'text',
        content: '社交裂变实验组 DAU 提升 12%，但 7 日留存率从 45% 降至 42%，获客成本下降 18%',
        summary: '用户增长实验组 DAU 提升 12%，但留存率下降 3%，需权衡',
        isAnalyzing: false,
        enabled: true,
        relevance: 'high',
        createdAt: '2026-05-15T11:00:00.000Z',
      },
      {
        id: 'm3b',
        name: '竞品增长策略',
        type: 'text',
        content: '竞品 A 通过社交裂变获客成本降低 25%，但用户质量偏低；竞品 B 通过内容营销获客成本降低 15%，用户留存率高',
        summary: '竞品社交裂变获客成本低但质量差，内容营销留存更好',
        isAnalyzing: false,
        enabled: true,
        relevance: 'medium',
        createdAt: '2026-05-15T12:00:00.000Z',
      },
    ],
    agenda: [
      { id: 'a3_1', title: '实验数据概览', duration: 10, presenter: '数据分析师', order: 1 },
      { id: 'a3_2', title: '核心指标解读', duration: 15, presenter: '数据分析师', order: 2 },
      { id: 'a3_3', title: '增长策略讨论', duration: 15, presenter: '增长负责人', order: 3 },
      { id: 'a3_4', title: '下一步计划', duration: 5, presenter: '产品经理', order: 4 },
    ],
    minutes: null,
    todos: [],
    preTodos: [
      { id: 'pt3_1', content: '提前查看实验数据看板', assignee: '数据分析师', priority: 'high' },
      { id: 'pt3_2', content: '准备竞品分析材料', assignee: '增长负责人', priority: 'medium' },
    ],
    previewSummary: '用户增长实验组 DAU 提升 12% 但留存率下降 3%，需权衡增长策略。关键议程：实验数据概览、核心指标解读、增长策略讨论，共 4 项 45 分钟',
    status: 'preparing',
    createdAt: '2026-05-15T09:00:00.000Z',
    updatedAt: '2026-05-15T12:00:00.000Z',
  },

  // ── 4. 需求评审 · preparing · 已 AI 生成（第一版）──────────────────
  // 有议程+摘要+待办，用户可点「重新生成议程」体验优化版
  {
    id: 'seed_4',
    title: '移动端体验优化专项评审',
    date: '2026-05-19',
    time: '11:00',
    location: '会议室 B-502',
    participants: ['前端负责人', '移动端开发', '设计师', '产品经理'],
    background: '移动端 LCP 4.2s 需优化至 2s 以内，首屏可交互时间需缩短 40%',
    scene: 'requirement',
    materials: [
      {
        id: 'm7',
        name: '移动端性能报告',
        type: 'text',
        content: '移动端 LCP 从 4.2s 优化至 1.8s，首屏可交互时间缩短 40%，FID 从 280ms 降至 90ms',
        summary: '移动端 LCP 从 4.2s 优化至 1.8s，首屏可交互时间缩短 40%',
        isAnalyzing: false,
        enabled: true,
        relevance: 'high',
        createdAt: '2026-05-16T08:00:00.000Z',
      },
      {
        id: 'm8',
        name: '用户调研报告',
        type: 'text',
        content: '67% 用户反馈页面加载慢，32% 用户因此放弃下单，移动端转化率比 PC 低 15%',
        summary: '67% 用户反馈加载慢，移动端转化率比 PC 低 15%',
        isAnalyzing: false,
        enabled: true,
        relevance: 'high',
        createdAt: '2026-05-16T09:00:00.000Z',
      },
    ],
    agenda: [
      { id: 'a4_1', title: '需求背景与目标', duration: 5, presenter: '产品经理', order: 1 },
      { id: 'a4_2', title: '性能数据与用户调研', duration: 10, presenter: '前端负责人', order: 2 },
      { id: 'a4_3', title: '技术方案讨论', duration: 15, presenter: '移动端开发', order: 3 },
      { id: 'a4_4', title: '排期与优先级', duration: 5, presenter: '产品经理', order: 4 },
    ],
    minutes: null,
    todos: [],
    preTodos: [
      { id: 'pt4_1', content: '提前阅读移动端性能报告', assignee: '前端负责人', priority: 'high' },
      { id: 'pt4_2', content: '准备用户调研数据演示', assignee: '设计师', priority: 'medium' },
    ],
    previewSummary: '移动端 LCP 需从 4.2s 优化至 2s，67% 用户反馈加载慢。关键议程：需求背景与目标、性能数据与用户调研、技术方案讨论，共 4 项 35 分钟',
    status: 'preparing',
    createdAt: '2026-05-16T07:00:00.000Z',
    updatedAt: '2026-05-16T09:00:00.000Z',
  },

  // ── 5. 技术评审 · preparing · 已 AI 生成（详细版 / 重新生成后）─────
  // 更丰富的议程（6项）、更多待办、更详细摘要
  {
    id: 'seed_5',
    title: '搜索算法 A/B 测试结果评审',
    date: '2026-05-20',
    time: '15:30',
    location: '线上会议',
    participants: ['算法工程师', '搜索负责人', '产品经理', '前端负责人', '数据分析师'],
    background: '新版排序算法上线 2 周，评估核心指标变化及用户体验反馈',
    scene: 'technical',
    materials: [
      {
        id: 'm4',
        name: 'A/B 测试报告',
        type: 'text',
        content: '新算法 CTR 提升 8.5%，但搜索结果多样性评分下降 12%，长尾 query 满意度下降',
        summary: '搜索算法 A/B 测试显示 CTR 提升 8.5%，但结果多样性评分下降',
        isAnalyzing: false,
        enabled: true,
        relevance: 'high',
        createdAt: '2026-05-15T12:00:00.000Z',
      },
      {
        id: 'm5',
        name: '用户反馈汇总',
        type: 'text',
        content: '近期搜索相关负面反馈集中在"结果太单一"、"推荐不准确"，占比 23%',
        summary: '搜索负面反馈中"结果太单一"占比 23%，需优化多样性',
        isAnalyzing: false,
        enabled: true,
        relevance: 'medium',
        createdAt: '2026-05-15T13:00:00.000Z',
      },
      {
        id: 'm6',
        name: '技术方案文档',
        type: 'text',
        content: '当前算法基于 BERT 语义匹配 + CTR 预估，多样性损失来自排序过于激进的个性化',
        summary: '多样性损失源于排序过于激进的个性化策略',
        isAnalyzing: false,
        enabled: false,
        relevance: 'low',
        createdAt: '2026-05-15T14:00:00.000Z',
      },
    ],
    agenda: [
      { id: 'a5_1', title: '算法模型迭代说明', duration: 10, presenter: '算法工程师', order: 1 },
      { id: 'a5_2', title: 'A/B 测试数据报告', duration: 15, presenter: '数据分析师', order: 2 },
      { id: 'a5_3', title: '搜索质量评估指标', duration: 10, presenter: '搜索负责人', order: 3 },
      { id: 'a5_4', title: '线上问题与用户体验反馈', duration: 10, presenter: '前端负责人', order: 4 },
      { id: 'a5_5', title: '多样性优化方案讨论', duration: 10, presenter: '算法工程师', order: 5 },
      { id: 'a5_6', title: '下一步迭代方向与排期', duration: 5, presenter: '产品经理', order: 6 },
    ],
    minutes: null,
    todos: [],
    preTodos: [
      { id: 'pt5_1', content: '提前阅读 A/B 测试报告，了解核心指标变化', assignee: '算法工程师', priority: 'high' },
      { id: 'pt5_2', content: '整理用户反馈中的高频问题清单', assignee: '前端负责人', priority: 'high' },
      { id: 'pt5_3', content: '准备搜索质量评估基准数据', assignee: '搜索负责人', priority: 'medium' },
      { id: 'pt5_4', content: '梳理多样性优化可选方案', assignee: '算法工程师', priority: 'medium' },
    ],
    previewSummary: '搜索算法 A/B 测试显示 CTR 提升 8.5%，但结果多样性评分下降 12%；负面反馈中"结果太单一"占比 23%，长尾 query 满意度下降。关键议程：算法模型迭代说明、A/B 测试数据报告、搜索质量评估指标、线上问题与用户体验反馈、多样性优化方案讨论、下一步迭代方向与排期，共 6 项 60 分钟',
    status: 'preparing',
    createdAt: '2026-05-15T10:00:00.000Z',
    updatedAt: '2026-05-15T14:00:00.000Z',
  },

  // ── 6. 故障复盘 · completed · 已结束会议 ──────────────────────────
  // 展示：纪要 + 待办跟踪
  {
    id: 'seed_6',
    title: '支付系统故障复盘',
    date: '2026-05-14',
    time: '16:00',
    location: '飞书会议 9905678',
    participants: ['SRE', '后端负责人', '支付负责人', '安全工程师'],
    background: '5月13日支付服务大面积超时，影响订单 8.7 万笔，需复盘根因并完善预案',
    scene: 'incident',
    materials: [
      {
        id: 'm9b',
        name: '故障时间线',
        type: 'text',
        content: '14:22 告警触发 → 14:25 开始降级 → 14:38 定位根因（Redis 连接池耗尽）→ 14:52 恢复 → 15:10 全量恢复',
        summary: '故障持续约 50 分钟，根因是 Redis 连接池耗尽导致支付链路超时',
        isAnalyzing: false,
        enabled: true,
        relevance: 'high',
        createdAt: '2026-05-14T10:00:00.000Z',
      },
      {
        id: 'm10b',
        name: '影响范围数据',
        type: 'text',
        content: '受影响订单 8.7 万笔，金额约 1200 万元，用户投诉 2300+ 条，客服工单 1500+',
        summary: '影响 8.7 万笔订单约 1200 万元，用户投诉 2300+',
        isAnalyzing: false,
        enabled: true,
        relevance: 'high',
        createdAt: '2026-05-14T11:00:00.000Z',
      },
    ],
    agenda: [
      { id: 'a6_1', title: '故障时间线回顾', duration: 5, presenter: 'SRE', order: 1 },
      { id: 'a6_2', title: '影响范围与用户数据', duration: 5, presenter: '数据分析师', order: 2 },
      { id: 'a6_3', title: '根因分析', duration: 15, presenter: '后端负责人', order: 3 },
      { id: 'a6_4', title: '修复方案与验证', duration: 10, presenter: '支付负责人', order: 4 },
      { id: 'a6_5', title: '预防措施与 SOP 完善', duration: 10, presenter: 'SRE', order: 5 },
    ],
    minutes: {
      id: 'min_6',
      meetingId: 'seed_6',
      rawInput: '支付系统故障复盘',
      content: `## 会议纪要

### 故障概述
5月13日 14:22-15:10 支付系统发生大面积超时故障，持续约 50 分钟。

### 根因分析
Redis 连接池配置不合理（最大连接数 100），在高并发场景下被耗尽，导致支付链路全面超时。

### 影响范围
- 受影响订单：8.7 万笔
- 涉及金额：约 1200 万元
- 用户投诉：2300+ 条

### 修复措施
1. Redis 连接池上限调整为 500
2. 新增连接池水位监控告警
3. 支付链路增加熔断降级机制

### 后续行动
- 本周内完成连接池参数调优上线
- 下周三前完成全链路压测
- 两周内完善故障应急 SOP`,
      decisions: [
        'Redis 连接池上限从 100 调整为 500',
        '支付链路增加熔断降级机制',
        '两周内完善故障应急 SOP',
      ],
      createdAt: '2026-05-14T16:30:00.000Z',
    },
    todos: [
      { id: 't6_1', content: '完成连接池参数调优上线', assignee: '后端负责人', dueDate: '2026-05-17', status: 'completed' },
      { id: 't6_2', content: '完成全链路压测', assignee: 'SRE', dueDate: '2026-05-21', status: 'in_progress' },
      { id: 't6_3', content: '完善故障应急 SOP', assignee: 'SRE', dueDate: '2026-05-28', status: 'pending' },
    ],
    preTodos: [],
    previewSummary: '5月13日支付系统 Redis 连接池耗尽导致 50 分钟故障，影响 8.7 万笔订单约 1200 万元。关键议程：故障时间线回顾、影响范围与用户数据、根因分析，共 5 项 45 分钟',
    status: 'completed',
    createdAt: '2026-05-14T08:00:00.000Z',
    updatedAt: '2026-05-14T16:30:00.000Z',
  },
];

export function seedLocalStorage() {
  saveMeetings(seedMeetings);
}

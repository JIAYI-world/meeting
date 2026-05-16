import React, { useState } from 'react';
import { ContextSnippet } from '../types';

interface ContextTracePanelProps {
  contextSnippet: ContextSnippet;
}

const speakerColors: Record<string, { bg: string; text: string; icon: string }> = {
  'SRE': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔧' },
  '后端负责人': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👨‍💻' },
  'DBA': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🗄️' },
  '架构师': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🏗️' },
  '数据分析师': { bg: 'bg-pink-100', text: 'text-pink-700', icon: '📊' },
  '支付负责人': { bg: 'bg-orange-100', text: 'text-orange-700', icon: '💳' },
  '安全工程师': { bg: 'bg-red-100', text: 'text-red-700', icon: '🔒' },
  '主持人': { bg: 'bg-gray-100', text: 'text-gray-700', icon: '🎤' },
  '产品经理': { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: '📋' },
  '测试负责人': { bg: 'bg-lime-100', text: 'text-lime-700', icon: '🧪' },
};

const getSpeakerStyle = (speaker: string) => {
  // Try exact match first, then partial match
  for (const [key, value] of Object.entries(speakerColors)) {
    if (speaker.includes(key)) return value;
  }
  return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '👤' };
};

const ContextTracePanel: React.FC<ContextTracePanelProps> = ({ contextSnippet }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!contextSnippet || !contextSnippet.text) return null;

  const style = getSpeakerStyle(contextSnippet.speaker);

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
      >
        <span>🔍</span>
        <span>溯源上下文</span>
        <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? '250px' : '0px' }}
      >
        <div className="mt-2 bg-gray-50 rounded-lg border-l-4 border-gray-300 p-3">
          {/* 发言人标签 + 时间戳 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-gray-400">[{contextSnippet.timestamp}]</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
              {style.icon} {contextSnippet.speaker}
            </span>
          </div>
          {/* 引用原话 */}
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
            {contextSnippet.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContextTracePanel;

import React, { useState } from 'react';
import { MinuteChapter } from '../types';
import RawInputDrawer from './RawInputDrawer';

interface SmartChaptersProps {
  chapters: MinuteChapter[];
  rawInput: string;
}

const SmartChapters: React.FC<SmartChaptersProps> = ({ chapters, rawInput }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-1">
      {/* 标题栏 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📑</span>
        <h3 className="font-semibold text-gray-900">智能章节</h3>
        <span className="text-xs text-gray-400 ml-auto">
          共 {chapters.length} 个章节
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-xs text-gray-500 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
        >
          📄 查看完整速记
        </button>
      </div>

      {/* 章节时间线 */}
      <div className="relative pl-6">
        {/* 竖线 */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary-300 via-primary-200 to-transparent" />

        {chapters.map((chapter, index) => {
          const isExpanded = expandedId === chapter.id;

          return (
            <div
              key={chapter.id}
              className="relative mb-4 animate-fade-in"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
            >
              {/* 节点圆点 */}
              <div className="absolute -left-6 top-3 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary-400 shadow-sm z-10" />

              {/* 章节卡片 */}
              <div
                onClick={() => toggle(chapter.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer ${
                  isExpanded
                    ? 'border-primary-200 shadow-md'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded">
                    {chapter.timestamp}
                  </span>
                  <h4 className="font-medium text-gray-900 text-sm">{chapter.title}</h4>
                  {/* 展开指示器 */}
                  <svg
                    className={`w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{chapter.summary}</p>

                {/* 原始对话溯源 — 手风琴展开 */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isExpanded ? '400px' : '0px' }}
                >
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-300">
                      <div className="text-xs font-medium text-gray-500 mb-1.5">
                        🔍 原始对话节选
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-mono">
                        {chapter.rawSnippet}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 完整速记抽屉 */}
      <RawInputDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rawInput={rawInput}
      />
    </div>
  );
};

export default SmartChapters;

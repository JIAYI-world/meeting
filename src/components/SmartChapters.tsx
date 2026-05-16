import React from 'react';
import { MinuteChapter } from '../types';

interface SmartChaptersProps {
  chapters: MinuteChapter[];
}

const SmartChapters: React.FC<SmartChaptersProps> = ({ chapters }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📑</span>
        <h3 className="font-semibold text-gray-900">智能章节</h3>
        <span className="text-xs text-gray-400 ml-auto">
          共 {chapters.length} 个章节
        </span>
      </div>

      <div className="relative pl-6">
        {/* 竖线 */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary-300 via-primary-200 to-transparent" />

        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="relative mb-4 animate-fade-in"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            {/* 节点圆点 */}
            <div className="absolute -left-6 top-3 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary-400 shadow-sm z-10" />

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded">
                  {chapter.timestamp}
                </span>
                <h4 className="font-medium text-gray-900 text-sm">{chapter.title}</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{chapter.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartChapters;

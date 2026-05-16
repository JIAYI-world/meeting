import React from 'react';
import { AgendaItem } from '../types';

interface TimelineViewProps {
  items: AgendaItem[];
}

const TimelineView: React.FC<TimelineViewProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>暂无议程</p>
        <p className="text-sm mt-1">使用 AI 生成会议议程</p>
      </div>
    );
  }

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>📅</span>
          会议议程
        </h3>
        <span className="text-sm text-gray-500">
          共 {items.length} 项 · 预计 {totalDuration} 分钟
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="relative flex items-start">
              <div className="absolute left-4 w-5 h-5 bg-primary-500 rounded-full border-4 border-white shadow-sm z-10"></div>

              <div className="ml-12 flex-1">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500">{item.duration} 分钟</span>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>👤</span>
                      {item.presenter}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;

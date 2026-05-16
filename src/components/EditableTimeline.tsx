import React, { useState } from 'react';
import { AgendaItem } from '../types';

interface EditableTimelineProps {
  items: AgendaItem[];
  onChange: (items: AgendaItem[]) => void;
}

const EditableTimeline: React.FC<EditableTimelineProps> = ({ items, onChange }) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;

    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered.map((item, i) => ({ ...item, order: i + 1 })));
    setDragIdx(null);
  };

  const updateItem = (idx: number, field: keyof AgendaItem, value: string | number) => {
    onChange(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const removeItem = (idx: number) => {
    onChange(
      items
        .filter((_, i) => i !== idx)
        .map((item, i) => ({ ...item, order: i + 1 }))
    );
  };

  const totalDuration = items.reduce((s, a) => s + a.duration, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          <h3 className="font-semibold text-gray-900">议程时间线</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          共 {items.length} 项 · {totalDuration} 分钟
        </span>
      </div>

      <div className="relative">
        {/* 垂直线 */}
        <div className="absolute left-[18px] top-3 bottom-3 w-[2px] bg-primary-200" />

        <div className="space-y-1">
          {items.map((item, idx) => {
            const elapsed = items.slice(0, idx).reduce((s, a) => s + a.duration, 0);
            const startMin = elapsed;
            const endMin = elapsed + item.duration;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`
                  relative flex items-center gap-3 pl-10 py-2 rounded-lg
                  transition-all duration-200
                  hover:bg-gray-50
                  ${dragIdx === idx ? 'opacity-40 shadow-lg bg-primary-50' : ''}
                `}
              >
                {/* 拖拽手柄 */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 cursor-grab active:cursor-grabbing text-xs select-none">
                  ⋮⋮
                </span>

                {/* 时间点 */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono">
                  {String(Math.floor(startMin / 60)).padStart(2, '0')}:
                  {String(startMin % 60).padStart(2, '0')}
                </span>

                {/* 序号圆点 */}
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0 z-10">
                  {idx + 1}
                </div>

                {/* 内容区：可编辑 */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(idx, 'title', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-transparent rounded focus:border-primary-300 focus:bg-white focus:ring-1 focus:ring-primary-200 outline-none transition-colors"
                    placeholder="议程主题"
                  />
                  <input
                    type="number"
                    value={item.duration}
                    onChange={(e) => updateItem(idx, 'duration', parseInt(e.target.value) || 0)}
                    className="w-14 px-1 py-1 text-xs text-center border border-transparent rounded focus:border-primary-300 focus:bg-white focus:ring-1 focus:ring-primary-200 outline-none transition-colors"
                    min="1"
                  />
                  <span className="text-[10px] text-gray-400">分钟</span>
                  <input
                    type="text"
                    value={item.presenter}
                    onChange={(e) => updateItem(idx, 'presenter', e.target.value)}
                    className="w-20 px-1 py-1 text-xs border border-transparent rounded focus:border-primary-300 focus:bg-white focus:ring-1 focus:ring-primary-200 outline-none transition-colors"
                    placeholder="负责人"
                  />
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 text-sm transition-opacity"
                  >
                    ×
                  </button>
                </div>

                {/* 结束时间 */}
                <span className="text-[10px] text-gray-300 font-mono flex-shrink-0">
                  ~
                  {String(Math.floor(endMin / 60)).padStart(2, '0')}:
                  {String(endMin % 60).padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditableTimeline;

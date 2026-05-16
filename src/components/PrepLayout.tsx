import React, { useState } from 'react';

type ViewMode = 'split' | 'focus-left' | 'focus-right';

interface PrepLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const PrepLayout: React.FC<PrepLayoutProps> = ({ left, right }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const leftWidth = viewMode === 'focus-right' ? '0%' : viewMode === 'focus-left' ? '100%' : '50%';
  const rightWidth = viewMode === 'focus-left' ? '0%' : viewMode === 'focus-right' ? '100%' : '50%';
  const isLeftHidden = viewMode === 'focus-right';
  const isRightHidden = viewMode === 'focus-left';

  const buttons = [
    { mode: 'focus-left' as ViewMode, icon: '◀', label: '左栏' },
    { mode: 'split' as ViewMode, icon: '⬌', label: '分栏' },
    { mode: 'focus-right' as ViewMode, icon: '▶', label: '右栏' },
  ];

  return (
    <div className="flex h-full">
      {/* 左栏 */}
      <div
        className="overflow-y-auto transition-all duration-300 ease-in-out space-y-5"
        style={{ width: leftWidth }}
      >
        <div
          className={`transition-all duration-300 ${isLeftHidden ? 'opacity-0 pointer-events-none scale-[0.98]' : 'opacity-100'}`}
        >
          {left}
        </div>
      </div>

      {/* 分割线控制面板 */}
      <div className="w-10 flex-shrink-0 flex flex-col items-center justify-center relative z-10">
        {/* 背景条 */}
        <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

        {/* 按钮组 */}
        <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-1.5 py-2 shadow-sm border border-gray-100">
          {buttons.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              className={`group relative w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                  : 'text-gray-400 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* 右栏 */}
      <div
        className="overflow-y-auto transition-all duration-300 ease-in-out space-y-5"
        style={{ width: rightWidth }}
      >
        <div
          className={`transition-all duration-300 ${isRightHidden ? 'opacity-0 pointer-events-none scale-[0.98]' : 'opacity-100'}`}
        >
          {right}
        </div>
      </div>
    </div>
  );
};

export default PrepLayout;

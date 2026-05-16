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

  return (
    <div className="flex h-full relative">
      {/* 左栏 */}
      <div
        className="overflow-y-auto transition-all duration-300 ease-in-out pr-2 space-y-5"
        style={{ width: leftWidth }}
      >
        <div
          className={`transition-opacity duration-300 ${isLeftHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {left}
        </div>
      </div>

      {/* 分割线 + 控制按钮 */}
      <div className="relative flex-shrink-0 flex flex-col items-center justify-center z-10">
        {/* 竖线 */}
        <div className="w-px h-full bg-gray-200" />

        {/* 控制按钮组 */}
        <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <button
            onClick={() => setViewMode('focus-left')}
            title="聚焦左栏"
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
              viewMode === 'focus-left'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300'
            }`}
          >
            ◀
          </button>
          <button
            onClick={() => setViewMode('split')}
            title="对半分栏"
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
              viewMode === 'split'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300'
            }`}
          >
            ║
          </button>
          <button
            onClick={() => setViewMode('focus-right')}
            title="聚焦右栏"
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
              viewMode === 'focus-right'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300'
            }`}
          >
            ▶
          </button>
        </div>
      </div>

      {/* 右栏 */}
      <div
        className="overflow-y-auto transition-all duration-300 ease-in-out pl-2 space-y-5"
        style={{ width: rightWidth }}
      >
        <div
          className={`transition-opacity duration-300 ${isRightHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {right}
        </div>
      </div>
    </div>
  );
};

export default PrepLayout;

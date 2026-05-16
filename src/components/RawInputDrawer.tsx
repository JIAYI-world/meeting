import React, { useEffect, useState } from 'react';

interface RawInputDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rawInput: string;
}

const RawInputDrawer: React.FC<RawInputDrawerProps> = ({ isOpen, onClose, rawInput }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 遮罩层 */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 抽屉面板 */}
      <div
        className={`absolute right-0 top-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: 'min(40vw, 600px)', minWidth: '400px' }}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h2 className="font-semibold text-gray-900">完整会议速记</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
            {rawInput}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          共 {rawInput.length} 字 · 由 AI 自动转写
        </div>
      </div>
    </div>
  );
};

export default RawInputDrawer;

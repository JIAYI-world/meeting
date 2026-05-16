import React from 'react';

interface PrepLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const PrepLayout: React.FC<PrepLayoutProps> = ({ left, right }) => {
  return (
    <div className="flex gap-6 h-full">
      {/* 左栏 40% — 输入区 */}
      <div className="w-[40%] min-w-[320px] overflow-y-auto pr-2 space-y-5">
        {left}
      </div>

      {/* 右栏 60% — AI 输出区 */}
      <div className="w-[60%] min-w-[400px] overflow-y-auto pl-2 space-y-5">
        {right}
      </div>
    </div>
  );
};

export default PrepLayout;

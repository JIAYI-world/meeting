import React from 'react';

interface AILoadingSpinnerProps {
  text?: string;
}

const AILoadingSpinner: React.FC<AILoadingSpinnerProps> = ({
  text = 'AI 正在处理...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-900">{text}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">请稍候，AI 正在分析内容...</p>
    </div>
  );
};

export default AILoadingSpinner;

import React, { useState } from 'react';

interface AiInputAreaProps {
  placeholder: string;
  onGenerate: (input: string) => void;
  isLoading: boolean;
}

const AiInputArea: React.FC<AiInputAreaProps> = ({
  placeholder,
  onGenerate,
  isLoading,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onGenerate(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✨</span>
        <h3 className="font-semibold text-gray-900">AI 助手</h3>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
        disabled={isLoading}
      />

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-400">
          {input.length} 字 · 按 ⌘+Enter 发送
        </span>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={`btn-primary flex items-center gap-2 ${
            !input.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>AI 生成</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AiInputArea;

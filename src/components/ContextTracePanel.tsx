import React, { useState } from 'react';

interface ContextTracePanelProps {
  contextSnippet: string;
}

const ContextTracePanel: React.FC<ContextTracePanelProps> = ({ contextSnippet }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!contextSnippet) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
      >
        <span>🔍</span>
        <span>溯源上下文</span>
        <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? '200px' : '0px' }}
      >
        <div className="mt-2 pl-3 border-l-2 border-gray-200 text-xs text-gray-500 leading-relaxed">
          {contextSnippet}
        </div>
      </div>
    </div>
  );
};

export default ContextTracePanel;

import React, { useState } from 'react';

interface AgendaHealthBannerProps {
  count: number;
}

const AgendaHealthBanner: React.FC<AgendaHealthBannerProps> = ({ count }) => {
  const [dismissed, setDismissed] = useState(false);

  if (count <= 4 || dismissed) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-medium text-amber-800">
            当前议题较多（{count} 项），建议延长会议时长或拆分为两次会议
          </p>
          <p className="text-sm text-amber-600 mt-1">
            预计总时长 {count * 12} 分钟，超过 1 小时可能影响讨论质量
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 text-xl ml-4"
      >
        ×
      </button>
    </div>
  );
};

export default AgendaHealthBanner;

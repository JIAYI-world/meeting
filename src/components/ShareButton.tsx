import React, { useState } from 'react';
import { Meeting } from '../types';

interface ShareButtonProps {
  meeting: Meeting;
}

const ShareButton: React.FC<ShareButtonProps> = ({ meeting }) => {
  const [copied, setCopied] = useState(false);

  const formatNotice = (): string => {
    const lines: string[] = [];

    lines.push('📋 会议通知');
    lines.push('━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push(`🎯 主题：${meeting.title || '未设置'}`);
    lines.push(`⏰ 时间：${meeting.date} ${meeting.time}`);
    lines.push(`📍 地点：${meeting.location || '未设置'}`);
    lines.push(`👥 参会人：${meeting.participants.join('、') || '未设置'}`);
    lines.push('');

    if (meeting.previewSummary) {
      lines.push('📝 会前预读：');
      lines.push(meeting.previewSummary);
      lines.push('');
    }

    if (meeting.agenda.length > 0) {
      lines.push('📋 议程：');
      meeting.agenda.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.title}（${item.duration} 分钟）— ${item.presenter}`);
      });
      lines.push('');
    }

    const totalDuration = meeting.agenda.reduce((sum, a) => sum + a.duration, 0);
    if (totalDuration > 0) {
      lines.push(`⏱ 预计时长：${totalDuration} 分钟`);
    }

    return lines.join('\n');
  };

  const handleCopy = async () => {
    const text = formatNotice();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        disabled={!meeting.title && meeting.agenda.length === 0}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          !meeting.title && meeting.agenda.length === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {copied ? (
          <>
            <span>✅</span>
            <span>已复制到剪贴板</span>
          </>
        ) : (
          <>
            <span>📋</span>
            <span>复制会议通知</span>
          </>
        )}
      </button>

      {copied && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          会议通知已复制！
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default ShareButton;

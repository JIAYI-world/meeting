import React from 'react';
import { Meeting } from '../types';

interface PreviewCardProps {
  meeting: Meeting;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ meeting }) => {
  const topAgenda = meeting.agenda.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📖</span>
        <h3 className="font-semibold">会前 3 分钟预读</h3>
      </div>

      {meeting.previewSummary && (
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-4">
          <p className="text-sm leading-relaxed">{meeting.previewSummary}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span>🎯</span>
          <span className="opacity-90">{meeting.title || '未设置主题'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏰</span>
          <span className="opacity-90">{meeting.date} {meeting.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span className="opacity-90">{meeting.participants.join('、') || '未设置'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span className="opacity-90">{meeting.location || '未设置'}</span>
        </div>
      </div>

      {topAgenda.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-2">关键议程</p>
          <div className="space-y-2">
            {topAgenda.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
              >
                <span className="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
                <span className="text-sm flex-1">{item.title}</span>
                <span className="text-xs opacity-70">{item.duration}分钟</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewCard;

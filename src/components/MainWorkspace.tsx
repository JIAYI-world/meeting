import React, { useState, useEffect } from 'react';
import AgendaTab from './AgendaTab';
import MinutesTab from './MinutesTab';
import { Meeting, TabType } from '../types';

interface MainWorkspaceProps {
  meeting: Meeting | null;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  meeting,
  onUpdateMeeting,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('agenda');

  // 根据会议状态自动切换默认 Tab
  useEffect(() => {
    if (meeting) {
      setActiveTab(meeting.status === 'completed' ? 'minutes' : 'agenda');
    }
  }, [meeting?.id, meeting?.status]);

  if (!meeting) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-700">选择一个会议</h2>
          <p className="text-gray-500 mt-2">从左侧列表选择会议，或创建新会议</p>
        </div>
      </div>
    );
  }

  const handleEndMeeting = () => {
    onUpdateMeeting({
      ...meeting,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    });
    setActiveTab('minutes');
  };

  const showBlockedMinutes =
    meeting.status === 'preparing' && activeTab === 'minutes';

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
            <p className="text-gray-500 mt-1">
              {meeting.date} {meeting.time} · {meeting.location}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                meeting.status === 'preparing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {meeting.status === 'preparing' ? '筹备中' : '已结束'}
            </span>
            <span className="text-sm text-gray-500">
              {meeting.participants.length} 位参会人
            </span>
          </div>
        </div>

        <div className="flex gap-1 mt-4">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'agenda'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            会前筹备
          </button>
          <button
            onClick={() => setActiveTab('minutes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'minutes'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            会后纪要
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {showBlockedMinutes ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">☕</div>
              <h2 className="text-xl font-semibold text-gray-700">
                会议尚未开始，暂无法提炼纪要
              </h2>
              <p className="text-gray-500 mt-2 mb-6">
                请先完成会前筹备，待会议结束后再记录纪要
              </p>
              <button
                onClick={handleEndMeeting}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                ✅ 标记会议已结束
              </button>
            </div>
          </div>
        ) : activeTab === 'agenda' ? (
          <AgendaTab meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
        ) : (
          <MinutesTab meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
        )}
      </div>
    </div>
  );
};

export default MainWorkspace;

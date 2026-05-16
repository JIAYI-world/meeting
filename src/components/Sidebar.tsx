import React, { useState } from 'react';
import MeetingCard from './MeetingCard';
import CreateMeetingModal from './CreateMeetingModal';
import { Meeting } from '../types';
import { seedLocalStorage } from '../utils/seedData';

interface SidebarProps {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  onSelectMeeting: (meeting: Meeting) => void;
  onCreateMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
  onSeedComplete?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  meetings,
  selectedMeeting,
  onSelectMeeting,
  onCreateMeeting,
  onDeleteMeeting,
  onSeedComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = () => {
    seedLocalStorage();
    setSeeded(true);
    onSeedComplete?.();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          MeetingAI
        </h1>
        <p className="text-sm text-gray-500 mt-1">智能会议助手</p>
      </div>

      <div className="p-4 space-y-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <span>+</span>
          <span>新会议</span>
        </button>
        <button
          onClick={handleSeed}
          className={`w-full text-sm py-2 px-3 rounded-lg border transition-all ${
            seeded
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {seeded ? '✅ 已加载 3 条演示数据' : '📦 加载演示数据'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {meetings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>暂无会议</p>
            <p className="text-sm mt-1">点击上方按钮创建新会议</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              isSelected={selectedMeeting?.id === meeting.id}
              onClick={() => onSelectMeeting(meeting)}
              onDelete={() => onDeleteMeeting(meeting.id)}
            />
          ))
        )}
      </div>

      <CreateMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={onCreateMeeting}
      />
    </div>
  );
};

export default Sidebar;

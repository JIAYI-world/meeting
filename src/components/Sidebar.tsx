import React, { useState, useEffect } from 'react';
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    preparing: true,
    completed: false,
  });

  // 新会议创建后自动展开「待开会议」分组
  useEffect(() => {
    if (meetings.some((m) => m.status === 'preparing')) {
      setExpandedGroups((prev) => ({ ...prev, preparing: true }));
    }
  }, [meetings]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSeed = () => {
    seedLocalStorage();
    setSeeded(true);
    onSeedComplete?.();
  };

  const preparingMeetings = meetings.filter((m) => m.status === 'preparing');
  const completedMeetings = meetings.filter((m) => m.status === 'completed');

  const renderGroup = (
    key: string,
    label: string,
    icon: string,
    items: Meeting[]
  ) => {
    const expanded = expandedGroups[key] !== false;

    return (
      <div key={key} className="mb-2">
        <button
          onClick={() => toggleGroup(key)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <span
              className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            >
              ▶
            </span>
            <span>{icon}</span>
            <span>{label}</span>
          </div>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </button>

        {expanded && items.length > 0 && (
          <div className="space-y-2 mt-1 ml-2">
            {items.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                isSelected={selectedMeeting?.id === meeting.id}
                onClick={() => onSelectMeeting(meeting)}
                onDelete={() => onDeleteMeeting(meeting.id)}
              />
            ))}
          </div>
        )}

        {expanded && items.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3 ml-2">
            暂无{label}
          </p>
        )}
      </div>
    );
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

      <div className="flex-1 overflow-y-auto p-4">
        {meetings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>暂无会议</p>
            <p className="text-sm mt-1">点击上方按钮创建新会议</p>
          </div>
        ) : (
          <>
            {renderGroup('preparing', '待开会议', '📅', preparingMeetings)}
            {renderGroup('completed', '历史会议', '✅', completedMeetings)}
          </>
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

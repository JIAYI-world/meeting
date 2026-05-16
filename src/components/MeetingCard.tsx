import React from 'react';
import { Meeting } from '../types';

interface MeetingCardProps {
  meeting: Meeting;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  isSelected,
  onClick,
  onDelete,
}) => {
  const statusColors = {
    preparing: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    preparing: '准备中',
    ongoing: '进行中',
    completed: '已完成',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{meeting.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        <p>{meeting.date} {meeting.time}</p>
        <p className="mt-1">{meeting.location}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[meeting.status]}`}
        >
          {statusLabels[meeting.status]}
        </span>
        <span className="text-xs text-gray-400">
          {meeting.participants.length} 人参会
        </span>
      </div>
    </div>
  );
};

export default MeetingCard;

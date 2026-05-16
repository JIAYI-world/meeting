import React, { useState } from 'react';
import { Meeting, MeetingScene } from '../types';
import { generateId } from '../utils/storage';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (meeting: Meeting) => void;
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState('');
  const [scene, setScene] = useState<MeetingScene>('other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const meeting: Meeting = {
      id: generateId(),
      title,
      date,
      time,
      location,
      participants: participants.split(',').map(p => p.trim()).filter(p => p),
      background: '',
      scene,
      materials: [],
      agenda: [],
      minutes: null,
      todos: [],
      preTodos: [],
      previewSummary: '',
      rawInput: '',
      transcript: '',
      status: 'preparing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreate(meeting);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00');
    setLocation('');
    setParticipants('');
    setScene('other');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">创建新会议</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会议主题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="输入会议主题"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日期 *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                时间 *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会议室
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
              placeholder="输入会议室名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会议场景
            </label>
            <select
              value={scene}
              onChange={(e) => setScene(e.target.value as MeetingScene)}
              className="input-field"
            >
              <option value="requirement">需求评审</option>
              <option value="incident">故障复盘</option>
              <option value="sync">常规同步</option>
              <option value="technical">技术评审</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              参会人
            </label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="input-field"
              placeholder="用逗号分隔，如：张三, 李四, 王五"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              创建会议
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingModal;

import React, { useState } from 'react';
import { AgendaItem, Material, Meeting, MeetingScene } from '../types';
import { smartParseForm } from '../utils/mockAiService';
import AILoadingSpinner from './AILoadingSpinner';

interface SmartFormProps {
  meeting: Meeting;
  materials: Material[];
  title: string;
  time: string;
  scene: MeetingScene;
  participants: string[];
  agenda: AgendaItem[];
  onTitleChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onSceneChange: (v: MeetingScene) => void;
  onParticipantsChange: (v: string[]) => void;
  onAgendaChange: (v: AgendaItem[]) => void;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const SmartForm: React.FC<SmartFormProps> = ({
  meeting,
  materials,
  title,
  time,
  scene,
  participants,
  agenda,
  onTitleChange,
  onTimeChange,
  onSceneChange,
  onParticipantsChange,
  onAgendaChange,
  onUpdateMeeting,
}) => {
  const [participantInput, setParticipantInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // 统一持久化：更新本地 state + 回写 meeting 对象
  const updateAndPersist = (
    field: 'title' | 'time' | 'scene' | 'participants' | 'agenda',
    value: string | string[] | AgendaItem[] | MeetingScene
  ) => {
    const patch: Partial<Meeting> = { [field]: value, updatedAt: new Date().toISOString() };

    switch (field) {
      case 'title': onTitleChange(value as string); break;
      case 'time': onTimeChange(value as string); break;
      case 'scene': onSceneChange(value as MeetingScene); break;
      case 'participants': onParticipantsChange(value as string[]); break;
      case 'agenda': onAgendaChange(value as AgendaItem[]); break;
    }

    onUpdateMeeting({ ...meeting, ...patch });
  };

  const handleAiParse = async () => {
    if (materials.length === 0) return;
    setIsParsing(true);

    try {
      const result = await smartParseForm(materials);
      const patch = {
        title: result.title,
        time: result.time,
        participants: result.participants,
        agenda: result.agenda,
        updatedAt: new Date().toISOString(),
      };

      onTitleChange(result.title);
      onTimeChange(result.time);
      onParticipantsChange(result.participants);
      onAgendaChange(result.agenda);
      onUpdateMeeting({ ...meeting, ...patch });
    } finally {
      setIsParsing(false);
    }
  };

  const addParticipant = () => {
    const name = participantInput.trim();
    if (name && !participants.includes(name)) {
      updateAndPersist('participants', [...participants, name]);
      setParticipantInput('');
    }
  };

  const removeParticipant = (p: string) => {
    updateAndPersist('participants', participants.filter((x) => x !== p));
  };

  const handleParticipantKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipant();
    }
  };

  const addAgendaItem = () => {
    const newItem: AgendaItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: '',
      duration: 10,
      presenter: '',
      order: agenda.length + 1,
    };
    updateAndPersist('agenda', [...agenda, newItem]);
  };

  const updateAgendaItem = (index: number, field: keyof AgendaItem, value: string | number) => {
    const updated = agenda.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateAndPersist('agenda', updated);
  };

  const removeAgendaItem = (index: number) => {
    const updated = agenda
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i + 1 }));
    updateAndPersist('agenda', updated);
  };

  if (isParsing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <AILoadingSpinner text="正在从语料池智能解析信息..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h3 className="font-semibold text-gray-900">会议信息</h3>
        </div>
        <button
          onClick={handleAiParse}
          disabled={materials.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            materials.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-sm hover:shadow-md'
          }`}
        >
          <span>✨</span>
          <span>AI 智能解析</span>
        </button>
      </div>

      {materials.length === 0 && (
        <p className="text-xs text-gray-400 mb-4">
          请先在语料池中添加素材，AI 将从中提取关键信息自动填充表单
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            会议主题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => updateAndPersist('title', e.target.value)}
            placeholder="输入或由 AI 自动填充"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            会议时间
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => updateAndPersist('time', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            会议场景
          </label>
          <select
            value={scene}
            onChange={(e) => updateAndPersist('scene', e.target.value as MeetingScene)}
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
          <div className="flex flex-wrap gap-2 mb-2">
            {participants.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {p}
                <button
                  onClick={() => removeParticipant(p)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyDown={handleParticipantKeyDown}
              placeholder="输入姓名，按 Enter 添加"
              className="input-field flex-1"
            />
            <button onClick={addParticipant} className="btn-secondary text-sm">
              添加
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              议程列表
            </label>
            <button
              onClick={addAgendaItem}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + 添加议程
            </button>
          </div>

          <div className="space-y-2">
            {agenda.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded min-w-[28px] text-center">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    updateAgendaItem(index, 'title', e.target.value)
                  }
                  placeholder="议程主题"
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <input
                  type="number"
                  value={item.duration}
                  onChange={(e) =>
                    updateAgendaItem(index, 'duration', parseInt(e.target.value) || 0)
                  }
                  className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-primary-500 outline-none"
                  min="1"
                />
                <span className="text-xs text-gray-500">分钟</span>
                <input
                  type="text"
                  value={item.presenter}
                  onChange={(e) =>
                    updateAgendaItem(index, 'presenter', e.target.value)
                  }
                  placeholder="负责人"
                  className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                  onClick={() => removeAgendaItem(index)}
                  className="text-gray-400 hover:text-red-500 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {agenda.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              暂无议程，点击上方「添加议程」或使用 AI 智能解析
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartForm;

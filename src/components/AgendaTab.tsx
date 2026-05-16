import React, { useState, useEffect } from 'react';
import MaterialPool from './MaterialPool';
import SmartForm from './SmartForm';
import AILoadingSpinner from './AILoadingSpinner';
import TimelineView from './TimelineView';
import AgendaHealthBanner from './AgendaHealthBanner';
import PreviewCard from './PreviewCard';
import ShareButton from './ShareButton';
import { AgendaItem, Material, Meeting } from '../types';
import { generateAgenda, generatePreviewSummary } from '../utils/mockAiService';

interface AgendaTabProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const AgendaTab: React.FC<AgendaTabProps> = ({ meeting, onUpdateMeeting }) => {
  const [title, setTitle] = useState(meeting.title);
  const [time, setTime] = useState(meeting.time);
  const [participants, setParticipants] = useState<string[]>(meeting.participants);
  const [agenda, setAgenda] = useState<AgendaItem[]>(meeting.agenda);
  const [isGenerating, setIsGenerating] = useState(false);

  // 切换会议时同步本地状态
  useEffect(() => {
    setTitle(meeting.title);
    setTime(meeting.time);
    setParticipants(meeting.participants);
    setAgenda(meeting.agenda);
    setIsGenerating(false);
  }, [meeting.id, meeting.status]);

  const handleAddMaterial = (material: Material) => {
    onUpdateMeeting({
      ...meeting,
      materials: [...meeting.materials, material],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateMaterial = (updated: Material) => {
    const materials = meeting.materials.map((m) =>
      m.id === updated.id ? updated : m
    );
    onUpdateMeeting({
      ...meeting,
      materials,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleGenerateAgenda = async () => {
    setIsGenerating(true);
    try {
      const materialsText = meeting.materials
        .map((m) => m.content + ' ' + m.summary)
        .join(' ');

      const background = [title, materialsText].filter(Boolean).join(' ');
      const generatedAgenda = await generateAgenda(background || '技术评审会议');

      setAgenda(generatedAgenda);

      const updatedMeeting: Meeting = {
        ...meeting,
        title: title || meeting.title,
        time,
        participants,
        agenda: generatedAgenda,
        background,
        updatedAt: new Date().toISOString(),
      };

      const preview = await generatePreviewSummary({
        ...updatedMeeting,
        agenda: generatedAgenda,
      });
      updatedMeeting.previewSummary = preview;

      onUpdateMeeting(updatedMeeting);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasAgenda = agenda.length > 0;

  return (
    <div className="space-y-6">
      <MaterialPool
        materials={meeting.materials}
        onAddMaterial={handleAddMaterial}
        onUpdateMaterial={handleUpdateMaterial}
      />

      <SmartForm
        meeting={meeting}
        materials={meeting.materials}
        title={title}
        time={time}
        participants={participants}
        agenda={agenda}
        onTitleChange={setTitle}
        onTimeChange={setTime}
        onParticipantsChange={setParticipants}
        onAgendaChange={setAgenda}
        onUpdateMeeting={onUpdateMeeting}
      />

      {!hasAgenda && (
        <button
          onClick={handleGenerateAgenda}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-primary-500 to-blue-500 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:via-primary-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>AI 正在生成...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>AI 生成完整议程</span>
            </>
          )}
        </button>
      )}

      {isGenerating && <AILoadingSpinner text="正在综合分析语料并生成议程..." />}

      {hasAgenda && !isGenerating && (
        <>
          <TimelineView items={agenda} />
          <AgendaHealthBanner count={agenda.length} />

          {meeting.previewSummary && <PreviewCard meeting={meeting} />}

          <ShareButton meeting={meeting} />

          <button
            onClick={() => {
              setAgenda([]);
              setTitle(meeting.title);
              setParticipants(meeting.participants);
              onUpdateMeeting({
                ...meeting,
                agenda: [],
                previewSummary: '',
                updatedAt: new Date().toISOString(),
              });
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            重新生成议程
          </button>
        </>
      )}
    </div>
  );
};

export default AgendaTab;

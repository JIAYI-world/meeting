import React, { useState, useEffect, useRef } from 'react';
import MaterialPool from './MaterialPool';
import SmartForm from './SmartForm';
import AILoadingSpinner from './AILoadingSpinner';
import EditableTimeline from './EditableTimeline';
import AgendaHealthBanner from './AgendaHealthBanner';
import PreviewCard from './PreviewCard';
import ShareButton from './ShareButton';
import PreTodoCard from './PreTodoCard';
import PrepLayout from './PrepLayout';
import FilePreviewModal from './FilePreviewModal';
import { AgendaItem, Material, Meeting, MeetingScene } from '../types';
import { generateAgenda, generatePreviewSummary, generatePreTodos } from '../utils/mockAiService';

interface AgendaTabProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const AgendaTab: React.FC<AgendaTabProps> = ({ meeting, onUpdateMeeting }) => {
  const [title, setTitle] = useState(meeting.title);
  const [time, setTime] = useState(meeting.time);
  const [scene, setScene] = useState<MeetingScene>(meeting.scene || 'other');
  const [participants, setParticipants] = useState<string[]>(meeting.participants);
  const [agenda, setAgenda] = useState<AgendaItem[]>(meeting.agenda);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filePreviewMaterial, setFilePreviewMaterial] = useState<Material | null>(null);
  const meetingRef = useRef(meeting);
  meetingRef.current = meeting;

  useEffect(() => {
    setTitle(meeting.title);
    setTime(meeting.time);
    setScene(meeting.scene || 'other');
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
    const m = meetingRef.current;
    const materials = m.materials.map((mat) =>
      mat.id === updated.id ? updated : mat
    );
    onUpdateMeeting({
      ...m,
      materials,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRemoveMaterial = (id: string) => {
    const m = meetingRef.current;
    const materials = m.materials.filter((mat) => mat.id !== id);
    onUpdateMeeting({
      ...m,
      materials,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleReorderMaterials = (materials: Material[]) => {
    onUpdateMeeting({
      ...meetingRef.current,
      materials,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleGenerateAgenda = async () => {
    setIsGenerating(true);
    try {
      const materialsText = meeting.materials
        .filter((m) => m.enabled !== false)
        .map((m) => m.content + ' ' + m.summary)
        .join(' ');

      const background = [title, materialsText].filter(Boolean).join(' ');
      const generatedAgenda = await generateAgenda(background || '技术评审会议', scene);

      setAgenda(generatedAgenda);

      const updatedMeeting: Meeting = {
        ...meeting,
        title: title || meeting.title,
        time,
        scene,
        participants,
        agenda: generatedAgenda,
        background,
        updatedAt: new Date().toISOString(),
      };

      const [preview, preTodos] = await Promise.all([
        generatePreviewSummary({ ...updatedMeeting, agenda: generatedAgenda }),
        generatePreTodos({ ...updatedMeeting, agenda: generatedAgenda }),
      ]);
      updatedMeeting.previewSummary = preview;
      updatedMeeting.preTodos = preTodos;

      onUpdateMeeting(updatedMeeting);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasAgenda = agenda.length > 0;

  const leftPanel = (
    <>
      <MaterialPool
        materials={meeting.materials}
        onAddMaterial={handleAddMaterial}
        onUpdateMaterial={handleUpdateMaterial}
        onRemoveMaterial={handleRemoveMaterial}
        onReorderMaterials={handleReorderMaterials}
        onViewFile={setFilePreviewMaterial}
      />

      <SmartForm
        meeting={meeting}
        materials={meeting.materials}
        title={title}
        time={time}
        scene={scene}
        participants={participants}
        agenda={agenda}
        onTitleChange={setTitle}
        onTimeChange={setTime}
        onSceneChange={setScene}
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
    </>
  );

  const rightPanel = (
    <>
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <AILoadingSpinner text="正在综合分析语料并生成议程..." />
        </div>
      )}

      {hasAgenda && !isGenerating && (
        <>
          {meeting.previewSummary && <PreviewCard meeting={meeting} />}

          <EditableTimeline items={agenda} onChange={(items) => {
            setAgenda(items);
            onUpdateMeeting({
              ...meeting,
              agenda: items,
              updatedAt: new Date().toISOString(),
            });
          }} />

          <AgendaHealthBanner count={agenda.length} />

          <PreTodoCard todos={meeting.preTodos || []} />

          <ShareButton meeting={meeting} />

          <button
            onClick={handleGenerateAgenda}
            disabled={isGenerating}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isGenerating ? '正在重新生成...' : '🔄 重新生成议程'}
          </button>
        </>
      )}

      {!hasAgenda && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">🎯</span>
          <p className="text-sm">添加素材并点击「AI 生成完整议程」</p>
          <p className="text-xs mt-1">AI 将综合语料自动生成结构化议程</p>
        </div>
      )}
    </>
  );

  return (
    <>
      <PrepLayout left={leftPanel} right={rightPanel} />
      <FilePreviewModal material={filePreviewMaterial} onClose={() => setFilePreviewMaterial(null)} />
    </>
  );
};

export default AgendaTab;

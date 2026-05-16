import React, { useState } from 'react';
import AiInputArea from './AiInputArea';
import AILoadingSpinner from './AILoadingSpinner';
import MinutesEditor from './MinutesEditor';
import KanbanBoard from './KanbanBoard';
import { Meeting } from '../types';
import { generateMinutes, extractTodos } from '../utils/mockAiService';

interface MinutesTabProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const MinutesTab: React.FC<MinutesTabProps> = ({ meeting, onUpdateMeeting }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('正在生成会议纪要...');

  const handleGenerate = async (input: string) => {
    setIsLoading(true);
    setLoadingText('正在生成会议纪要...');

    try {
      const minutes = await generateMinutes(input);
      minutes.meetingId = meeting.id;

      setLoadingText('正在提取待办事项...');
      const todos = await extractTodos(input);

      onUpdateMeeting({
        ...meeting,
        minutes,
        todos,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = (updatedTodo: any) => {
    const updatedTodos = meeting.todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );

    onUpdateMeeting({
      ...meeting,
      todos: updatedTodos,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {meeting.minutes ? (
        <>
          <MinutesEditor minutes={meeting.minutes} />

          {meeting.todos.length > 0 && (
            <KanbanBoard todos={meeting.todos} onUpdateTodo={handleUpdateTodo} />
          )}

          <button
            onClick={() => {
              onUpdateMeeting({
                ...meeting,
                minutes: null,
                todos: [],
                status: 'preparing',
                updatedAt: new Date().toISOString(),
              });
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            重新生成纪要
          </button>
        </>
      ) : isLoading ? (
        <AILoadingSpinner text={loadingText} />
      ) : (
        <AiInputArea
          placeholder="请粘贴会议记录、语音转文字内容或会议要点，AI 将为您生成结构化纪要...

例如：今天的会议讨论了产品上线时间，技术团队说需要两周完成开发，市场团队希望月底前上线。大家同意先完成核心功能，下周进行测试..."
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default MinutesTab;

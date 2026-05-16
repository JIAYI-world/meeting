import React, { useState, useEffect, useRef } from 'react';
import PrepLayout from './PrepLayout';
import SmartChapters from './SmartChapters';
import DecisionLedger from './DecisionLedger';
import KanbanBoard from './KanbanBoard';
import AILoadingSpinner from './AILoadingSpinner';
import { Meeting } from '../types';
import { generateMinutes, extractTodos } from '../utils/mockAiService';

interface MinutesTabProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const MinutesTab: React.FC<MinutesTabProps> = ({ meeting, onUpdateMeeting }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('正在分析会议记录...');
  const [isDispatching, setIsDispatching] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const meetingRef = useRef(meeting);
  meetingRef.current = meeting;

  useEffect(() => {
    setIsLoading(false);
    setIsDispatched(false);
  }, [meeting.id]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setLoadingText('正在分析会议记录...');

    try {
      const minutes = await generateMinutes(inputText);
      const m = meetingRef.current;
      minutes.meetingId = m.id;

      setLoadingText('正在提取待办事项...');
      const todos = await extractTodos(inputText);

      onUpdateMeeting({
        ...m,
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
    const m = meetingRef.current;
    const updatedTodos = m.todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    onUpdateMeeting({
      ...m,
      todos: updatedTodos,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDispatching(false);
    setIsDispatched(true);
    setToast('已成功派发至 Jira');
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegenerate = async () => {
    const rawInput = meeting.minutes?.rawInput;
    if (!rawInput) return;

    setIsLoading(true);
    setLoadingText('正在重新分析会议记录...');

    try {
      const minutes = await generateMinutes(rawInput);
      const m = meetingRef.current;
      minutes.meetingId = m.id;

      setLoadingText('正在重新提取待办事项...');
      const todos = await extractTodos(rawInput);

      onUpdateMeeting({
        ...m,
        minutes,
        todos,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasMinutes = meeting.minutes !== null;

  const leftPanel = isLoading ? (
    <div className="flex items-center justify-center h-full">
      <AILoadingSpinner text={loadingText} />
    </div>
  ) : hasMinutes ? (
    <SmartChapters chapters={meeting.minutes!.chapters} />
  ) : (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          粘贴会议记录
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`请粘贴会议记录、语音转文字内容或会议要点...

例如：
14:00 主持人开场，介绍本次会议目标...
14:05 DBA 报告数据库连接池利用率 95%...
14:15 后端负责人提出增加索引方案...
14:30 架构师建议引入读写分离...
14:45 达成共识：短期采用索引方案...`}
          className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !inputText.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-primary-500 to-blue-500 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:via-primary-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>AI 智能提炼</span>
          </>
        )}
      </button>
    </div>
  );

  const rightPanel = isLoading ? (
    <div className="flex items-center justify-center h-full">
      <AILoadingSpinner text={loadingText} />
    </div>
  ) : hasMinutes ? (
    <div className="space-y-5">
      <DecisionLedger decisions={meeting.minutes!.decisions} />

      {meeting.todos.length > 0 && (
        <KanbanBoard todos={meeting.todos} onUpdateTodo={handleUpdateTodo} />
      )}

      <button
        onClick={handleDispatch}
        disabled={isDispatching || isDispatched}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
          isDispatched
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {isDispatching ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>正在派发...</span>
          </>
        ) : isDispatched ? (
          <>
            <span>✅</span>
            <span>已派发</span>
          </>
        ) : (
          <>
            <span>🔗</span>
            <span>派发至 Jira</span>
          </>
        )}
      </button>

      <button
        onClick={handleRegenerate}
        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
      >
        🔄 重新生成纪要
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <span className="text-5xl mb-4">📝</span>
      <p className="text-sm">在左栏粘贴会议记录，点击「AI 智能提炼」</p>
      <p className="text-xs mt-1">AI 将自动生成结构化纪要、决策记录和待办事项</p>
    </div>
  );

  return (
    <>
      <PrepLayout left={leftPanel} right={rightPanel} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in z-50">
          {toast}
        </div>
      )}
    </>
  );
};

export default MinutesTab;

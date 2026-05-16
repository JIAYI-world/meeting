import React, { useState, useEffect, useRef } from 'react';
import PrepLayout from './PrepLayout';
import SmartChapters from './SmartChapters';
import DecisionLedger from './DecisionLedger';
import KanbanBoard from './KanbanBoard';
import AILoadingSpinner from './AILoadingSpinner';
import { Meeting, Decision } from '../types';
import { generateMinutes, extractTodos } from '../utils/mockAiService';

interface MinutesTabProps {
  meeting: Meeting;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const MinutesTab: React.FC<MinutesTabProps> = ({ meeting, onUpdateMeeting }) => {
  const [transcript, setTranscript] = useState('');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<string>>(new Set());
  const [supplement, setSupplement] = useState('');
  const [showSupplement, setShowSupplement] = useState(false);
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
    setTranscript(meeting.transcript || '');
    // 默认勾选所有 enabled 的素材
    const enabledIds = new Set(
      meeting.materials.filter((m) => m.enabled).map((m) => m.id)
    );
    setSelectedMaterialIds(enabledIds);
    setSupplement('');
    setShowSupplement(false);
  }, [meeting.id]);

  const toggleMaterial = (id: string) => {
    setSelectedMaterialIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    const combinedInput = buildCombinedInput();
    if (!combinedInput.trim()) return;

    setIsLoading(true);
    setLoadingText('正在分析会议记录...');

    try {
      const minutes = await generateMinutes(combinedInput);
      const m = meetingRef.current;
      minutes.meetingId = m.id;

      setLoadingText('正在提取待办事项...');
      const todos = await extractTodos(combinedInput);

      onUpdateMeeting({
        ...m,
        minutes,
        todos,
        rawInput: combinedInput,
        transcript,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buildCombinedInput = () => {
    const parts: string[] = [];

    if (transcript.trim()) {
      parts.push(transcript.trim());
    }

    const selectedMaterials = meeting.materials.filter((m) =>
      selectedMaterialIds.has(m.id)
    );
    if (selectedMaterials.length > 0) {
      const materialText = selectedMaterials
        .map((m) => `【素材：${m.name}】\n${m.content}`)
        .join('\n\n');
      parts.push(materialText);
    }

    if (supplement.trim()) {
      parts.push(`【补充材料】\n${supplement.trim()}`);
    }

    return parts.join('\n\n');
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

  const handleUpdateDecision = (updatedDecision: Decision) => {
    const m = meetingRef.current;
    if (!m.minutes) return;
    const existing = m.minutes.decisions.find((d) => d.id === updatedDecision.id);
    let newDecisions: Decision[];
    if (existing) {
      newDecisions = m.minutes.decisions.map((d) =>
        d.id === updatedDecision.id ? updatedDecision : d
      );
    } else {
      newDecisions = [...m.minutes.decisions, updatedDecision];
    }
    onUpdateMeeting({
      ...m,
      minutes: { ...m.minutes, decisions: newDecisions },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteDecision = (id: string) => {
    const m = meetingRef.current;
    if (!m.minutes) return;
    const newDecisions = m.minutes.decisions.filter((d) => d.id !== id);
    onUpdateMeeting({
      ...m,
      minutes: { ...m.minutes, decisions: newDecisions },
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

  const relevanceColor = (r: 'high' | 'medium' | 'low') => {
    if (r === 'high') return 'bg-red-100 text-red-700';
    if (r === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  const relevanceLabel = (r: 'high' | 'medium' | 'low') => {
    if (r === 'high') return '高相关';
    if (r === 'medium') return '中相关';
    return '低相关';
  };

  const leftPanel = isLoading ? (
    <div className="flex items-center justify-center h-full">
      <AILoadingSpinner text={loadingText} />
    </div>
  ) : hasMinutes ? (
    <SmartChapters chapters={meeting.minutes!.chapters} rawInput={meeting.minutes!.rawInput} />
  ) : (
    <div className="space-y-5">
      {/* 速记编辑区 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
          <span className="text-lg">📝</span>
          会议速记
        </h3>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={`会议速记内容将自动填充于此，您也可以直接编辑...

例如：
14:00 主持人开场，介绍本次会议目标...
14:05 DBA 报告数据库连接池利用率 95%...
14:15 后端负责人提出增加索引方案...
14:30 架构师建议引入读写分离...`}
          className="w-full h-48 p-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-400 mt-1">
          共 {transcript.length} 字
        </p>
      </div>

      {/* 素材选择区 */}
      {meeting.materials.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
            <span className="text-lg">📎</span>
            引用素材
            <span className="text-xs font-normal text-gray-400">
              （已选 {selectedMaterialIds.size}/{meeting.materials.length}）
            </span>
          </h3>
          <div className="space-y-2">
            {meeting.materials.map((material) => {
              const isSelected = selectedMaterialIds.has(material.id);
              return (
                <label
                  key={material.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-300 bg-primary-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMaterial(material.id)}
                    className="mt-0.5 rounded border-gray-300 text-primary-500 focus:ring-primary-300"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {material.name}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${relevanceColor(material.relevance)}`}>
                        {relevanceLabel(material.relevance)}
                      </span>
                    </div>
                    {material.summary && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {material.summary}
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 补充材料 */}
      <div>
        {!showSupplement ? (
          <button
            onClick={() => setShowSupplement(true)}
            className="text-sm text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
          >
            <span>+</span>
            <span>添加补充材料</span>
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <span className="text-lg">📄</span>
                补充材料
              </h3>
              <button
                onClick={() => {
                  setShowSupplement(false);
                  setSupplement('');
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                移除
              </button>
            </div>
            <textarea
              value={supplement}
              onChange={(e) => setSupplement(e.target.value)}
              placeholder="输入额外的补充材料..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !buildCombinedInput().trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-primary-500 to-blue-500 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:via-primary-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>✨</span>
        <span>AI 智能提炼</span>
      </button>
    </div>
  );

  const rightPanel = isLoading ? (
    <div className="flex items-center justify-center h-full">
      <AILoadingSpinner text={loadingText} />
    </div>
  ) : hasMinutes ? (
    <div className="space-y-5">
      <DecisionLedger
        decisions={meeting.minutes!.decisions}
        onUpdateDecision={handleUpdateDecision}
        onDeleteDecision={handleDeleteDecision}
      />

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
      <p className="text-sm">在左栏编辑速记，选择素材，点击「AI 智能提炼」</p>
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

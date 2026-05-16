import React, { useState } from 'react';
import { Decision } from '../types';

interface DecisionLedgerProps {
  decisions: Decision[];
  onUpdateDecision: (decision: Decision) => void;
  onDeleteDecision: (id: string) => void;
}

const DecisionLedger: React.FC<DecisionLedgerProps> = ({
  decisions,
  onUpdateDecision,
  onDeleteDecision,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editConclusion, setEditConclusion] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editRejected, setEditRejected] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const accepted = decisions.filter((d) => !d.isRejected);
  const rejected = decisions.filter((d) => d.isRejected);

  const startEdit = (decision: Decision) => {
    setEditingId(decision.id);
    setEditConclusion(decision.conclusion);
    setEditReason(decision.reason);
    setEditRejected(decision.isRejected);
  };

  const saveEdit = (id: string) => {
    if (!editConclusion.trim()) return;
    onUpdateDecision({
      id,
      conclusion: editConclusion.trim(),
      reason: editReason.trim(),
      isRejected: editRejected,
    });
    setEditingId(null);
  };

  const handleAddNew = () => {
    const newId = `new_${Date.now()}`;
    const newDecision: Decision = {
      id: newId,
      conclusion: '',
      reason: '',
      isRejected: false,
    };
    onUpdateDecision(newDecision);
    setEditingId(newId);
    setEditConclusion('');
    setEditReason('');
    setEditRejected(false);
  };

  const renderDecisionCard = (decision: Decision, index: number, _type: 'accepted' | 'rejected') => {
    const isEditing = editingId === decision.id;
    const isHovered = hoveredId === decision.id;

    const borderColor = decision.isRejected ? 'border-red-300' : 'border-green-400';
    const bgColor = decision.isRejected ? 'bg-red-50/50' : 'bg-green-50/50';
    const icon = decision.isRejected ? '✗' : '✓';
    const iconColor = decision.isRejected ? 'text-red-400' : 'text-green-500';

    return (
      <div
        key={decision.id}
        className={`relative border-l-4 ${borderColor} ${bgColor} rounded-r-lg p-3 animate-fade-in group ${
          isEditing ? 'ring-2 ring-primary-300' : ''
        }`}
        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
        onMouseEnter={() => setHoveredId(decision.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* 操作按钮 — hover 时显示 */}
        {!isEditing && isHovered && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <button
              onClick={() => startEdit(decision)}
              className="w-6 h-6 flex items-center justify-center rounded bg-white shadow-sm border border-gray-200 text-gray-400 hover:text-primary-500 hover:border-primary-300 transition-colors"
              title="编辑"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDeleteDecision(decision.id)}
              className="w-6 h-6 flex items-center justify-center rounded bg-white shadow-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
              title="删除"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {isEditing ? (
          /* 编辑模式 */
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`${iconColor} flex-shrink-0`}>{icon}</span>
              <input
                autoFocus
                value={editConclusion}
                onChange={(e) => setEditConclusion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(decision.id)}
                placeholder="决策结论..."
                className="flex-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-300"
              />
            </div>
            <div className="flex items-start gap-2 ml-5">
              <textarea
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveEdit(decision.id);
                  }
                }}
                placeholder="理由（可选）..."
                rows={2}
                className="flex-1 text-xs text-gray-500 bg-white border border-gray-200 rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-primary-300"
              />
            </div>
            <div className="flex items-center gap-3 ml-5">
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editRejected}
                  onChange={(e) => setEditRejected(e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-300"
                />
                标记为已否决
              </label>
              <button
                onClick={() => saveEdit(decision.id)}
                className="text-xs bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors"
              >
                保存
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          /* 展示模式 */
          <div className="flex items-start gap-2">
            <span className={`${iconColor} mt-0.5 flex-shrink-0`}>{icon}</span>
            <div className="min-w-0">
              <p className={`font-medium text-gray-900 text-sm ${
                decision.isRejected ? 'line-through text-gray-700' : ''
              }`}>
                {decision.conclusion}
              </p>
              {decision.isRejected && (
                <span className="inline-block text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded mt-1">
                  已否决
                </span>
              )}
              <p className="text-gray-500 text-xs mt-1">{decision.reason}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📋</span>
        <h3 className="font-semibold text-gray-900">决策记录</h3>
        <div className="ml-auto flex gap-2">
          {accepted.length > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              ✓ {accepted.length} 项结论
            </span>
          )}
          {rejected.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
              ✗ {rejected.length} 项否决
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {accepted.map((d, i) => renderDecisionCard(d, i, 'accepted'))}
        {rejected.map((d, i) => renderDecisionCard(d, accepted.length + i, 'rejected'))}

        {/* 补充遗漏决策按钮 */}
        <button
          onClick={handleAddNew}
          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-2.5 text-sm text-gray-400 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/30 transition-all"
        >
          + 补充遗漏决策
        </button>
      </div>
    </div>
  );
};

export default DecisionLedger;

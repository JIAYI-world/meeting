import React, { useState } from 'react';
import { Material } from '../types';
import { generateId } from '../utils/storage';
import { analyzeMaterial } from '../utils/mockAiService';

interface MaterialPoolProps {
  materials: Material[];
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial: (material: Material) => void;
}

const MaterialPool: React.FC<MaterialPoolProps> = ({
  materials,
  onAddMaterial,
  onUpdateMaterial,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputName, setInputName] = useState('');

  const handleAdd = async () => {
    if (!inputValue.trim()) return;

    const material: Material = {
      id: generateId(),
      name: inputName.trim() || `素材 ${materials.length + 1}`,
      type: 'text',
      content: inputValue.trim(),
      summary: '',
      isAnalyzing: true,
      createdAt: new Date().toISOString(),
    };

    onAddMaterial(material);
    setInputValue('');
    setInputName('');

    const summary = await analyzeMaterial(material.content);
    onUpdateMaterial({ ...material, summary, isAnalyzing: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAdd();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📚</span>
        <h3 className="font-semibold text-gray-900">语料池</h3>
        <span className="text-sm text-gray-500 ml-auto">
          {materials.length} 条素材
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="素材名称（可选）"
          className="input-field text-sm"
        />
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="粘贴会议相关文档、邮件、聊天记录等内容..."
          className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className={`w-full btn-primary text-sm ${
            !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          + 添加素材
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>添加会议相关文档、邮件、聊天记录等素材</p>
          <p className="mt-1">AI 将自动提炼关键信息</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {materials.map((m) => (
            <div
              key={m.id}
              className="p-3 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    {m.type === 'file' ? '📄' : '📝'}
                  </span>
                  <span className="font-medium text-sm text-gray-900">{m.name}</span>
                </div>
                {m.isAnalyzing && (
                  <span className="text-xs text-primary-500 flex items-center gap-1">
                    <span className="animate-spin">⏳</span> 分析中...
                  </span>
                )}
              </div>

              {m.summary && (
                <p className="mt-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                  {m.summary}
                </p>
              )}

              {!m.summary && !m.isAnalyzing && (
                <p className="mt-2 text-xs text-gray-400 italic">等待分析...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialPool;

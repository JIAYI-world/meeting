import React, { useState } from 'react';
import { Material } from '../types';
import { generateId } from '../utils/storage';
import { analyzeMaterial } from '../utils/mockAiService';
import MaterialCard from './MaterialCard';

interface MaterialPoolProps {
  materials: Material[];
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial: (material: Material) => void;
  onRemoveMaterial: (id: string) => void;
  onReorderMaterials: (materials: Material[]) => void;
  onViewFile?: (material: Material) => void;
}

const TEXT_EXTENSIONS = ['txt', 'md', 'csv', 'json', 'log', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'sh', 'py', 'js', 'ts', 'tsx', 'jsx', 'css', 'html', 'sql'];

function isTextFile(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return TEXT_EXTENSIONS.includes(ext);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const MaterialPool: React.FC<MaterialPoolProps> = ({
  materials,
  onAddMaterial,
  onUpdateMaterial,
  onRemoveMaterial,
  onReorderMaterials,
  onViewFile,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputName, setInputName] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAdd = async () => {
    if (!inputValue.trim()) return;

    const material: Material = {
      id: generateId(),
      name: inputName.trim() || `素材 ${materials.length + 1}`,
      type: 'text',
      content: inputValue.trim(),
      summary: '',
      isAnalyzing: true,
      enabled: true,
      relevance: 'medium',
      createdAt: new Date().toISOString(),
    };

    onAddMaterial(material);
    setInputValue('');
    setInputName('');

    const summary = await analyzeMaterial(material.content);
    onUpdateMaterial({ ...material, summary, isAnalyzing: false });
  };

  const handleToggle = (id: string, enabled: boolean) => {
    const m = materials.find((x) => x.id === id);
    if (m) onUpdateMaterial({ ...m, enabled });
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...materials];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    onReorderMaterials(reordered);
    setDragIdx(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAdd();
    }
  };

  const processFile = async (file: File) => {
    const material: Material = {
      id: generateId(),
      name: file.name,
      type: 'file',
      content: '',
      summary: '',
      isAnalyzing: true,
      enabled: true,
      relevance: 'medium',
      createdAt: new Date().toISOString(),
    };

    if (isTextFile(file.name)) {
      const text = await file.text();
      material.content = text;
    } else {
      material.content = `[文件] ${file.name} (${formatFileSize(file.size)})`;
    }

    onAddMaterial(material);
    const summary = await analyzeMaterial(material.content);
    onUpdateMaterial({ ...material, summary, isAnalyzing: false });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(processFile);
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      Array.from(files).forEach(processFile);
    }
  };

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragOver(true);
  };

  const handleFileDragLeave = () => {
    setIsFileDragOver(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📚</span>
        <h3 className="font-semibold text-gray-900">语料池</h3>
        <span className="text-sm text-gray-500 ml-auto">
          {materials.length} 条素材
        </span>
      </div>

      <div className="space-y-2 mb-4">
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
          className="w-full h-20 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 text-sm"
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

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".txt,.md,.csv,.json,.log,.xml,.yaml,.yml,.toml,.sh,.py,.js,.ts,.tsx,.jsx,.css,.html,.sql,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
        />

        <div
          onDrop={handleFileDrop}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
            isFileDragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          }`}
        >
          <span className="text-2xl">📎</span>
          <p className="text-xs text-gray-500 mt-1">
            点击选择或拖拽文件到此处
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            支持 txt、md、csv、pdf、docx 等格式
          </p>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>添加会议相关文档、邮件、聊天记录等素材</p>
          <p className="mt-1">AI 将自动提炼关键信息</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {materials.map((m, idx) => (
            <MaterialCard
              key={m.id}
              material={m}
              onToggle={handleToggle}
              onRemove={onRemoveMaterial}
              onViewFile={onViewFile}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialPool;

import React, { useState } from 'react';
import { Material } from '../types';

interface MaterialCardProps {
  material: Material;
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
  onViewFile?: (material: Material) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

const relevanceConfig = {
  high: { label: '核心资料', color: 'bg-orange-100 text-orange-700', line: 'border-l-orange-500' },
  medium: { label: '参考材料', color: 'bg-blue-100 text-blue-600', line: 'border-l-blue-400' },
  low: { label: '低相关', color: 'bg-gray-100 text-gray-500', line: 'border-l-gray-300' },
};

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onToggle,
  onRemove,
  onViewFile,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [expanded, setExpanded] = useState(false);
  const rel = relevanceConfig[material.relevance];

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e, material.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, material.id)}
      className={`
        group relative bg-white rounded-xl border border-gray-200
        border-l-[3px] ${rel.line}
        transition-all duration-200
        ${!material.enabled ? 'opacity-50' : ''}
        hover:shadow-md
      `}
    >
      {/* 顶部：拖拽手柄 + 名称 + 契合度 + 开关 */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {onDragStart && (
          <span className="text-gray-300 cursor-grab active:cursor-grabbing text-sm select-none">
            ⋮⋮
          </span>
        )}

        <span className="text-lg flex-shrink-0">
          {material.type === 'file' ? '📄' : '📝'}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">
              {material.name}
            </span>
            {material.isAnalyzing && (
              <span className="text-xs text-purple-500 animate-pulse">分析中…</span>
            )}
          </div>
          {material.summary ? (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {material.summary}
            </p>
          ) : material.content ? (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {material.content.substring(0, 60)}{material.content.length > 60 ? '...' : ''}
            </p>
          ) : null}
        </div>

        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${rel.color}`}>
          {rel.label}
        </span>

        {/* Toggle 开关 */}
        <button
          onClick={() => onToggle(material.id, !material.enabled)}
          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
            material.enabled ? 'bg-primary-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              material.enabled ? 'translate-x-4' : ''
            }`}
          />
        </button>

        <button
          onClick={() => onRemove(material.id)}
          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
        >
          ×
        </button>
      </div>

      {/* 底部交互：查看原文 / 查看文件 */}
      {(material.type === 'text' || material.type === 'file') && material.content && (
        <div className="border-t border-gray-100 px-3 py-1.5">
          <button
            onClick={() => {
              if (material.type === 'file' && onViewFile) {
                onViewFile(material);
              } else {
                setExpanded(!expanded);
              }
            }}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {material.type === 'file' ? '查看文件' : expanded ? '收起原文' : '查看原文'}
            <span className="ml-1">{expanded ? '▲' : '▼'}</span>
          </button>
        </div>
      )}

      {/* 手风琴展开 — 文本素材 */}
      {material.type === 'text' && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? 'max-h-60' : 'max-h-0'
          }`}
        >
          <div className="px-3 pb-3 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
            {material.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;

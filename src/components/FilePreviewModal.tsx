import React, { useEffect } from 'react';
import { Material } from '../types';

interface FilePreviewModalProps {
  material: Material | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ material, onClose }) => {
  useEffect(() => {
    if (!material) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [material, onClose]);

  if (!material) return null;

  const ext = material.name.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, string> = {
    pdf: '📕',
    doc: '📘', docx: '📘',
    xls: '📗', xlsx: '📗',
    ppt: '📙', pptx: '📙',
    md: '📓',
    txt: '📄',
  };
  const icon = iconMap[ext] || '📁';

  const lines = material.content.split('\n').filter(l => l.trim());

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-3xl flex-shrink-0">{icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate" title={material.name}>{material.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {ext.toUpperCase()} 格式 · {material.content.length} 字符
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4">
          {material.summary && (
            <div className="mb-4 p-3 bg-primary-50 rounded-lg">
              <p className="text-xs font-medium text-primary-700 mb-1">AI 摘要</p>
              <p className="text-sm text-gray-700">{material.summary}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">文档大纲</p>
            <ul className="space-y-1">
              {lines.slice(0, 8).map((line, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-300 mt-1">•</span>
                  <span className="truncate">{line.trim()}</span>
                </li>
              ))}
              {lines.length > 8 && (
                <li className="text-xs text-gray-400">
                  …还有 {lines.length - 8} 行内容
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            关闭
          </button>
          <button className="flex-1 btn-primary text-sm">
            下载文件
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;

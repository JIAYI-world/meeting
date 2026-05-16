import React from 'react';
import { Minutes } from '../types';

interface MinutesEditorProps {
  minutes: Minutes;
}

const MinutesEditor: React.FC<MinutesEditorProps> = ({ minutes }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>📄</span>
            会议纪要
          </h3>
          <span className="text-sm text-gray-500">
            生成于 {new Date(minutes.createdAt).toLocaleString('zh-CN')}
          </span>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">{minutes.content}</div>
        </div>
      </div>

      {minutes.decisions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>✅</span>
            会议决策
          </h3>
          <ul className="space-y-2">
            {minutes.decisions.map((decision) => (
              <li key={decision.id} className="flex items-start gap-2">
                <span className={decision.isRejected ? 'text-red-400 mt-1' : 'text-green-500 mt-1'}>
                  {decision.isRejected ? '✗' : '✓'}
                </span>
                <span className={decision.isRejected ? 'text-gray-500 line-through' : 'text-gray-700'}>
                  {decision.conclusion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📝</span>
          原始输入
        </h3>
        <p className="text-gray-500 text-sm whitespace-pre-wrap">{minutes.rawInput}</p>
      </div>
    </div>
  );
};

export default MinutesEditor;

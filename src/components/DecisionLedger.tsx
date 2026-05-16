import React from 'react';
import { Decision } from '../types';

interface DecisionLedgerProps {
  decisions: Decision[];
}

const DecisionLedger: React.FC<DecisionLedgerProps> = ({ decisions }) => {
  const accepted = decisions.filter((d) => !d.isRejected);
  const rejected = decisions.filter((d) => d.isRejected);

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
        {accepted.map((decision, index) => (
          <div
            key={decision.id}
            className="border-l-4 border-green-400 bg-green-50/50 rounded-r-lg p-3 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm">{decision.conclusion}</p>
                <p className="text-gray-500 text-xs mt-1">{decision.reason}</p>
              </div>
            </div>
          </div>
        ))}

        {rejected.map((decision, index) => (
          <div
            key={decision.id}
            className="border-l-4 border-red-300 bg-red-50/50 rounded-r-lg p-3 animate-fade-in"
            style={{ animationDelay: `${(accepted.length + index) * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-700 text-sm line-through">{decision.conclusion}</p>
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded flex-shrink-0">已否决</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">{decision.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionLedger;

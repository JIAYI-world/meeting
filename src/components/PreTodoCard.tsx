import React from 'react';
import { PreTodo } from '../types';

interface PreTodoCardProps {
  todos: PreTodo[];
}

const priorityConfig = {
  high: { emoji: '🔴', label: '高' },
  medium: { emoji: '🟡', label: '中' },
  low: { emoji: '🟢', label: '低' },
};

const PreTodoCard: React.FC<PreTodoCardProps> = ({ todos }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📌</span>
        <h3 className="font-semibold text-gray-900">会前建议</h3>
      </div>

      {todos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          AI 将根据语料自动生成会前建议
        </p>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => {
            const p = priorityConfig[todo.priority];
            return (
              <div
                key={todo.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm mt-0.5">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{todo.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                      {p.label}优先级
                    </span>
                    <span className="text-[10px] text-gray-400">
                      负责人: {todo.assignee}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PreTodoCard;

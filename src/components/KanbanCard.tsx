import React from 'react';
import { Todo } from '../types';

interface KanbanCardProps {
  todo: Todo;
  onUpdateTodo: (todo: Todo) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ todo, onUpdateTodo }) => {
  const statusOptions = [
    { value: 'pending', label: '待办' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
  ];

  const handleStatusChange = (newStatus: Todo['status']) => {
    onUpdateTodo({ ...todo, status: newStatus });
  };

  const isOverdue = new Date(todo.dueDate) < new Date() && todo.status !== 'completed';

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <p className="font-medium text-gray-900 text-sm">{todo.content}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <span>👤</span>
          {todo.assignee}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isOverdue
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {todo.dueDate}
        </span>
      </div>

      <div className="mt-3 flex gap-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value as Todo['status'])}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              todo.status === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KanbanCard;

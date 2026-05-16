import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types';
import ContextTracePanel from './ContextTracePanel';

interface KanbanCardProps {
  todo: Todo;
  onUpdateTodo: (todo: Todo) => void;
  isDragOverlay?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ todo, onUpdateTodo, isDragOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, data: { todo } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

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
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
        isDragOverlay ? 'shadow-2xl scale-105 rotate-2 border-primary-200' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {/* 拖拽手柄 */}
        {!isDragOverlay && (
          <button
            className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 text-sm">{todo.content}</p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span>👤</span>
              {todo.assignee}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                isOverdue
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {todo.dueDate}
            </span>
          </div>

          {/* 上下文溯源 */}
          {!isDragOverlay && <ContextTracePanel contextSnippet={todo.contextSnippet} />}

          {/* 状态切换 */}
          {!isDragOverlay && (
            <div className="mt-2 flex gap-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value as Todo['status'])}
                  className={`text-xs px-2 py-0.5 rounded transition-colors ${
                    todo.status === option.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;

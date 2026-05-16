import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Todo } from '../types';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  todos,
  onUpdateTodo,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${color} rounded-xl p-3 transition-colors duration-200 ${
        isOver ? 'ring-2 ring-primary-300 ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
        <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
          {todos.length}
        </span>
      </div>

      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[60px]">
          {todos.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-xs">
              暂无任务
            </div>
          ) : (
            todos.map((todo) => (
              <KanbanCard key={todo.id} todo={todo} onUpdateTodo={onUpdateTodo} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;

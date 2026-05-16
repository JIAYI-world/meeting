import React from 'react';
import KanbanCard from './KanbanCard';
import { Todo } from '../types';

interface KanbanColumnProps {
  title: string;
  color: string;
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  color,
  todos,
  onUpdateTodo,
}) => {
  return (
    <div className={`${color} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
          {todos.length}
        </span>
      </div>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">
            暂无任务
          </div>
        ) : (
          todos.map((todo) => (
            <KanbanCard key={todo.id} todo={todo} onUpdateTodo={onUpdateTodo} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;

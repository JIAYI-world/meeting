import React from 'react';
import KanbanColumn from './KanbanColumn';
import { Todo } from '../types';

interface KanbanBoardProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, onUpdateTodo }) => {
  const columns = [
    { id: 'pending', title: '待办', color: 'bg-gray-100' },
    { id: 'in_progress', title: '进行中', color: 'bg-blue-100' },
    { id: 'completed', title: '已完成', color: 'bg-green-100' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📋</span>
        <h3 className="font-semibold text-gray-900">待办事项</h3>
        <span className="text-sm text-gray-500 ml-auto">
          共 {todos.length} 项任务
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            color={column.color}
            todos={todos.filter((todo) => todo.status === column.id)}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

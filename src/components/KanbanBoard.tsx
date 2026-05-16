import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { Todo } from '../types';

interface KanbanBoardProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, onUpdateTodo }) => {
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const columns = [
    { id: 'pending', title: '待办', color: 'bg-gray-100' },
    { id: 'in_progress', title: '进行中', color: 'bg-blue-100' },
    { id: 'completed', title: '已完成', color: 'bg-green-100' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = todos.find((t) => t.id === active.id);
    if (todo) setActiveTodo(todo);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the source and destination columns
    const activeTodo = todos.find((t) => t.id === activeId);
    if (!activeTodo) return;

    // Determine destination column
    let destStatus: Todo['status'] | null = null;
    if (overId === 'pending' || overId === 'in_progress' || overId === 'completed') {
      destStatus = overId as Todo['status'];
    } else {
      const overTodo = todos.find((t) => t.id === overId);
      if (overTodo) destStatus = overTodo.status;
    }

    if (destStatus && activeTodo.status !== destStatus) {
      onUpdateTodo({ ...activeTodo, status: destStatus });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📋</span>
        <h3 className="font-semibold text-gray-900">待办事项</h3>
        <span className="text-sm text-gray-500 ml-auto">
          共 {todos.length} 项任务
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              todos={todos.filter((todo) => todo.status === column.id)}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTodo ? (
            <KanbanCard todo={activeTodo} onUpdateTodo={() => {}} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;

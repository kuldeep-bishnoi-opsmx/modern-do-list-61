
import React, { useState } from 'react';
import { useTodos } from './TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos, reorderTodos } = useTodos();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = todos.findIndex(todo => todo.id === draggedItem);
    const targetIndex = todos.findIndex(todo => todo.id === targetId);

    const newTodos = [...todos];
    const [draggedTodo] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedTodo);

    reorderTodos(newTodos);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Separate active and completed todos
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500 text-lg">No tasks yet</p>
        <p className="text-slate-400 text-sm mt-1">Add your first task above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTodos.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-600 mb-3 px-1">
            Active ({activeTodos.length})
          </h2>
          <div className="space-y-2">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isDragging={draggedItem === todo.id}
                onDragStart={(e) => handleDragStart(e, todo.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, todo.id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-400 mb-3 px-1">
            Completed ({completedTodos.length})
          </h2>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isDragging={false}
                onDragStart={() => {}}
                onDragOver={() => {}}
                onDrop={() => {}}
                onDragEnd={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;

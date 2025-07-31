
import React from 'react';

interface TodoItemMainProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    subTasks?: any[];
  };
  editingTask: boolean;
  editText: string;
  hasSubTasks: boolean;
  completedSubTasks: number;
  totalSubTasks: number;
  onToggleTodo: () => void;
  onEditTextChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSaveTaskEdit: () => void;
}

const TodoItemMain: React.FC<TodoItemMainProps> = ({
  todo,
  editingTask,
  editText,
  hasSubTasks,
  completedSubTasks,
  totalSubTasks,
  onToggleTodo,
  onEditTextChange,
  onKeyPress,
  onSaveTaskEdit,
}) => {
  return (
    <>
      {/* Checkbox */}
      <button
        onClick={onToggleTodo}
        disabled={editingTask}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 hover:border-green-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Task Text */}
      <div className="flex-1 min-w-0">
        {editingTask ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={onKeyPress}
            onBlur={onSaveTaskEdit}
            className="w-full bg-transparent border-none outline-none text-slate-800"
            autoFocus
          />
        ) : (
          <span
            className={`transition-all duration-200 break-words ${
              todo.completed
                ? 'text-slate-500 line-through'
                : 'text-slate-800'
            }`}
          >
            {todo.text}
          </span>
        )}
        {hasSubTasks && !editingTask && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-300"
                style={{ width: `${totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {completedSubTasks}/{totalSubTasks}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default TodoItemMain;

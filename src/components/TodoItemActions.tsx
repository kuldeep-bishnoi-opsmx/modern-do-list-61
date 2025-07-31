
import React from 'react';
import { Plus, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';

interface TodoItemActionsProps {
  todoCompleted: boolean;
  editingTask: boolean;
  showAddSubTask: boolean;
  hasSubTasks: boolean;
  showSubTasks: boolean;
  onEditTask: () => void;
  onToggleAddSubTask: () => void;
  onToggleSubTasks: () => void;
  onDeleteTodo: () => void;
}

const TodoItemActions: React.FC<TodoItemActionsProps> = ({
  todoCompleted,
  editingTask,
  showAddSubTask,
  hasSubTasks,
  showSubTasks,
  onEditTask,
  onToggleAddSubTask,
  onToggleSubTasks,
  onDeleteTodo,
}) => {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {/* Edit Task Button */}
      {!todoCompleted && !editingTask && (
        <button
          onClick={onEditTask}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors duration-200"
          title="Edit task"
        >
          <Edit2 size={14} />
        </button>
      )}

      {/* Add SubTask Button */}
      {!todoCompleted && !editingTask && (
        <button
          onClick={onToggleAddSubTask}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            showAddSubTask 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-slate-100 text-slate-400 hover:text-blue-600'
          }`}
          title="Add subtask"
        >
          <Plus size={14} />
        </button>
      )}

      {/* Expand/Collapse Button */}
      {hasSubTasks && !editingTask && (
        <button
          onClick={onToggleSubTasks}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors duration-200"
        >
          {showSubTasks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}

      {/* Delete Button */}
      {!editingTask && (
        <button
          onClick={onDeleteTodo}
          className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TodoItemActions;

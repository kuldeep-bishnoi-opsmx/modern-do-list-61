
import React from 'react';
import { Edit2 } from 'lucide-react';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface SubTaskItemProps {
  subTask: SubTask;
  editingSubTask: string | null;
  editText: string;
  onToggleSubTask: () => void;
  onStartEditing: () => void;
  onDeleteSubTask: () => void;
  onEditTextChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSaveEdit: () => void;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({
  subTask,
  editingSubTask,
  editText,
  onToggleSubTask,
  onStartEditing,
  onDeleteSubTask,
  onEditTextChange,
  onKeyPress,
  onSaveEdit,
}) => {
  const isEditing = editingSubTask === subTask.id;

  return (
    <div className="flex items-center gap-3 group/subtask py-1">
      <button
        onClick={onToggleSubTask}
        disabled={isEditing}
        className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
          subTask.completed
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 hover:border-green-400'
        }`}
      >
        {subTask.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          onKeyDown={onKeyPress}
          onBlur={onSaveEdit}
          className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-sm transition-all duration-200 ${
            subTask.completed
              ? 'text-slate-500 line-through'
              : 'text-slate-700'
          }`}
        >
          {subTask.text}
        </span>
      )}
      
      <div className="flex items-center gap-1 opacity-0 group-hover/subtask:opacity-100 transition-opacity duration-200">
        {!subTask.completed && !isEditing && (
          <button
            onClick={onStartEditing}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={onDeleteSubTask}
          className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SubTaskItem;

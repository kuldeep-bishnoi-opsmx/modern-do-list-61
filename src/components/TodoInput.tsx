
import React, { useState, useRef, useEffect } from 'react';
import { useTodos } from './TodoContext';
import { X } from 'lucide-react';

interface TodoInputProps {
  onCancel: () => void;
  onAdd: () => void;
  parentId?: string;
  placeholder?: string;
}

const TodoInput: React.FC<TodoInputProps> = ({ 
  onCancel, 
  onAdd, 
  parentId, 
  placeholder = "Add a new task..." 
}) => {
  const [inputValue, setInputValue] = useState('');
  const { addTodo, addSubTask } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (parentId) {
        addSubTask(parentId, inputValue);
      } else {
        addTodo(inputValue);
      }
      setInputValue('');
      onAdd();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-base bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 pr-16"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-slate-400 hover:text-slate-600 transition-colors duration-200"
        >
          <X size={14} />
        </button>
        <button
          type="submit"
          className="px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TodoInput;

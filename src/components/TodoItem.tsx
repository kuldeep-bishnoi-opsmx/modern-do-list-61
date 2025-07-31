import React, { useState } from 'react';
import { useTodos } from './TodoContext';
import TodoInput from './TodoInput';
import TodoItemActions from './TodoItemActions';
import TodoItemMain from './TodoItemMain';
import SubTaskList from './SubTaskList';
import { Plus, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subTasks?: SubTask[];
}

interface TodoItemProps {
  todo: Todo;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const { toggleTodo, deleteTodo, toggleSubTask, deleteSubTask, editTodo, editSubTask } = useTodos();
  const [showSubTasks, setShowSubTasks] = useState(true);
  const [showAddSubTask, setShowAddSubTask] = useState(false);
  const [editingTask, setEditingTask] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const hasSubTasks = todo.subTasks && todo.subTasks.length > 0;
  const completedSubTasks = todo.subTasks?.filter(subTask => subTask.completed).length || 0;
  const totalSubTasks = todo.subTasks?.length || 0;

  const startEditingTask = () => {
    setEditingTask(true);
    setEditText(todo.text);
  };

  const saveTaskEdit = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText.trim());
    }
    setEditingTask(false);
    setEditText('');
  };

  const cancelTaskEdit = () => {
    setEditingTask(false);
    setEditText('');
  };

  const startEditingSubTask = (subTaskId: string, currentText: string) => {
    setEditingSubTask(subTaskId);
    setEditText(currentText);
  };

  const saveSubTaskEdit = () => {
    if (editingSubTask && editText.trim()) {
      editSubTask(todo.id, editingSubTask, editText.trim());
    }
    setEditingSubTask(null);
    setEditText('');
  };

  const cancelSubTaskEdit = () => {
    setEditingSubTask(null);
    setEditText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingTask) {
        saveTaskEdit();
      } else if (editingSubTask) {
        saveSubTaskEdit();
      }
    } else if (e.key === 'Escape') {
      if (editingTask) {
        cancelTaskEdit();
      } else if (editingSubTask) {
        cancelSubTaskEdit();
      }
    }
  };

  return (
    <div
      draggable={!todo.completed && !editingTask}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        todo.completed ? 'opacity-75' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          {!todo.completed && !editingTask && (
            <div className="opacity-0 group-hover:opacity-50 transition-opacity duration-200">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          )}

          <TodoItemMain
            todo={todo}
            editingTask={editingTask}
            editText={editText}
            hasSubTasks={hasSubTasks}
            completedSubTasks={completedSubTasks}
            totalSubTasks={totalSubTasks}
            onToggleTodo={() => toggleTodo(todo.id)}
            onEditTextChange={setEditText}
            onKeyPress={handleKeyPress}
            onSaveTaskEdit={saveTaskEdit}
          />

          <TodoItemActions
            todoCompleted={todo.completed}
            editingTask={editingTask}
            showAddSubTask={showAddSubTask}
            hasSubTasks={hasSubTasks}
            showSubTasks={showSubTasks}
            onEditTask={startEditingTask}
            onToggleAddSubTask={() => setShowAddSubTask(!showAddSubTask)}
            onToggleSubTasks={() => setShowSubTasks(!showSubTasks)}
            onDeleteTodo={() => deleteTodo(todo.id)}
          />
        </div>

        {/* Add SubTask Input */}
        {showAddSubTask && (
          <div className="mt-4 pl-8">
            <TodoInput
              parentId={todo.id}
              placeholder="Add a subtask..."
              onCancel={() => setShowAddSubTask(false)}
              onAdd={() => {
                // Keep the add subtask input open for easier multiple additions
              }}
            />
          </div>
        )}

        <SubTaskList
          subTasks={todo.subTasks || []}
          hasSubTasks={hasSubTasks}
          showSubTasks={showSubTasks}
          editingSubTask={editingSubTask}
          editText={editText}
          onToggleSubTask={(subTaskId) => toggleSubTask(todo.id, subTaskId)}
          onDeleteSubTask={(subTaskId) => deleteSubTask(todo.id, subTaskId)}
          onStartEditingSubTask={startEditingSubTask}
          onEditTextChange={setEditText}
          onKeyPress={handleKeyPress}
          onSaveSubTaskEdit={saveSubTaskEdit}
        />
      </div>
    </div>
  );
};

export default TodoItem;


import React from 'react';
import SubTaskItem from './SubTaskItem';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface SubTaskListProps {
  subTasks: SubTask[];
  hasSubTasks: boolean;
  showSubTasks: boolean;
  editingSubTask: string | null;
  editText: string;
  onToggleSubTask: (subTaskId: string) => void;
  onDeleteSubTask: (subTaskId: string) => void;
  onStartEditingSubTask: (subTaskId: string, currentText: string) => void;
  onEditTextChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSaveSubTaskEdit: () => void;
}

const SubTaskList: React.FC<SubTaskListProps> = ({
  subTasks,
  hasSubTasks,
  showSubTasks,
  editingSubTask,
  editText,
  onToggleSubTask,
  onDeleteSubTask,
  onStartEditingSubTask,
  onEditTextChange,
  onKeyPress,
  onSaveSubTaskEdit,
}) => {
  if (!hasSubTasks || !showSubTasks) {
    return null;
  }

  return (
    <div className="mt-4 pl-8 space-y-2">
      {subTasks?.map((subTask) => (
        <SubTaskItem
          key={subTask.id}
          subTask={subTask}
          editingSubTask={editingSubTask}
          editText={editText}
          onToggleSubTask={() => onToggleSubTask(subTask.id)}
          onStartEditing={() => onStartEditingSubTask(subTask.id, subTask.text)}
          onDeleteSubTask={() => onDeleteSubTask(subTask.id)}
          onEditTextChange={onEditTextChange}
          onKeyPress={onKeyPress}
          onSaveEdit={onSaveSubTaskEdit}
        />
      ))}
    </div>
  );
};

export default SubTaskList;

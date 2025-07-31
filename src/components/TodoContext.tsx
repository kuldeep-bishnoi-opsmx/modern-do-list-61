
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLists } from './ListContext';

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

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  reorderTodos: (todos: Todo[]) => void;
  addSubTask: (parentId: string, text: string) => void;
  toggleSubTask: (parentId: string, subTaskId: string) => void;
  deleteSubTask: (parentId: string, subTaskId: string) => void;
  editSubTask: (parentId: string, subTaskId: string, newText: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentListId } = useLists();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadedListId, setLoadedListId] = useState<string | null>(null);

  // Load todos from localStorage when current list changes
  useEffect(() => {
    if (currentListId) {
      console.log('Loading todos for list:', currentListId);
      const storedTodos = localStorage.getItem(`todos_${currentListId}`);
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        console.log('Loaded todos:', parsedTodos);
        setTodos(parsedTodos);
      } else {
        console.log('No stored todos found, setting empty array');
        setTodos([]);
      }
      setLoadedListId(currentListId);
    } else {
      setTodos([]);
      setLoadedListId(null);
    }
  }, [currentListId]);

  // Save todos to localStorage whenever todos change, but only for the loaded list
  useEffect(() => {
    if (loadedListId && todos.length >= 0) {
      console.log('Saving todos for list:', loadedListId, 'todos:', todos);
      localStorage.setItem(`todos_${loadedListId}`, JSON.stringify(todos));
    }
  }, [todos, loadedListId]);

  const addTodo = (text: string) => {
    if (!currentListId) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      subTasks: [],
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          // If marking as completed, mark all subtasks as completed too
          const updatedSubTasks = newCompleted 
            ? todo.subTasks?.map(subTask => ({ ...subTask, completed: true }))
            : todo.subTasks;
          return { ...todo, completed: newCompleted, subTasks: updatedSubTasks };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  };

  const reorderTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  const addSubTask = (parentId: string, text: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === parentId) {
          const newSubTask: SubTask = {
            id: Date.now().toString(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now(),
          };
          return {
            ...todo,
            subTasks: [...(todo.subTasks || []), newSubTask],
          };
        }
        return todo;
      })
    );
  };

  const toggleSubTask = (parentId: string, subTaskId: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === parentId) {
          const updatedSubTasks = todo.subTasks?.map(subTask =>
            subTask.id === subTaskId
              ? { ...subTask, completed: !subTask.completed }
              : subTask
          );
          
          // Check if all subtasks are completed to auto-complete parent
          const allSubTasksCompleted = updatedSubTasks?.every(subTask => subTask.completed) ?? false;
          const hasSubTasks = updatedSubTasks && updatedSubTasks.length > 0;
          
          return {
            ...todo,
            subTasks: updatedSubTasks,
            completed: hasSubTasks ? allSubTasksCompleted : todo.completed,
          };
        }
        return todo;
      })
    );
  };

  const deleteSubTask = (parentId: string, subTaskId: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === parentId) {
          return {
            ...todo,
            subTasks: todo.subTasks?.filter(subTask => subTask.id !== subTaskId),
          };
        }
        return todo;
      })
    );
  };

  const editSubTask = (parentId: string, subTaskId: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === parentId) {
          return {
            ...todo,
            subTasks: todo.subTasks?.map(subTask =>
              subTask.id === subTaskId
                ? { ...subTask, text: newText.trim() }
                : subTask
            ),
          };
        }
        return todo;
      })
    );
  };

  return (
    <TodoContext.Provider value={{ 
      todos, 
      addTodo, 
      toggleTodo, 
      deleteTodo, 
      editTodo,
      reorderTodos,
      addSubTask,
      toggleSubTask,
      deleteSubTask,
      editSubTask
    }}>
      {children}
    </TodoContext.Provider>
  );
};

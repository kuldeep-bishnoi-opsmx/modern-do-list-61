
interface ExportData {
  lists: any[];
  currentListId: string | null;
  todos: Record<string, any[]>;
}

export const exportData = (): string => {
  const data: ExportData = {
    lists: JSON.parse(localStorage.getItem('todoLists') || '[]'),
    currentListId: localStorage.getItem('currentListId'),
    todos: {}
  };

  // Export todos for each list
  data.lists.forEach(list => {
    const todosKey = `todos_${list.id}`;
    const todos = localStorage.getItem(todosKey);
    if (todos) {
      data.todos[todosKey] = JSON.parse(todos);
    }
  });

  return btoa(JSON.stringify(data));
};

export const importData = (encodedData: string): boolean => {
  try {
    const data: ExportData = JSON.parse(atob(encodedData));
    
    // Import lists with priority handling
    if (data.lists && Array.isArray(data.lists)) {
      const listsWithPriority = data.lists.map((list, index) => ({
        ...list,
        priority: list.priority ?? index + 1
      }));
      localStorage.setItem('todoLists', JSON.stringify(listsWithPriority));
    }
    
    // Import current list ID
    if (data.currentListId) {
      localStorage.setItem('currentListId', data.currentListId);
    }
    
    // Import todos for each list
    if (data.todos) {
      Object.entries(data.todos).forEach(([key, todos]) => {
        if (Array.isArray(todos)) {
          localStorage.setItem(key, JSON.stringify(todos));
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

export const generateShareUrl = (encodedData: string): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#import=${encodedData}`;
};

export const parseImportUrl = (): string | null => {
  const hash = window.location.hash;
  if (hash.startsWith('#import=')) {
    return hash.substring(8); // Remove '#import='
  }
  return null;
};

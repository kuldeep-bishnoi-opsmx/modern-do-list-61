
import React, { createContext, useContext, useState, useEffect } from 'react';

interface TodoList {
  id: string;
  name: string;
  createdAt: number;
  priority: number;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  createdAt: number;
  expanded: boolean;
}

interface ListContextType {
  lists: TodoList[];
  folders: Folder[];
  currentListId: string | null;
  currentList: TodoList | null;
  createList: (name: string, folderId?: string) => void;
  deleteList: (id: string) => void;
  setCurrentList: (id: string) => void;
  renameList: (id: string, newName: string) => void;
  moveListUp: (id: string) => void;
  moveListDown: (id: string) => void;
  createFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;
  toggleFolder: (id: string) => void;
  moveListToFolder: (listId: string, folderId?: string) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const useLists = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useLists must be used within a ListProvider');
  }
  return context;
};

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);

  // Helper function to get max priority for a specific folder (or root)
  const getMaxPriorityInFolder = (folderId?: string) => {
    const folderLists = lists.filter(list => list.folderId === folderId);
    return Math.max(...folderLists.map(list => list.priority), 0);
  };

  // Helper function to reorder priorities within a folder
  const reorderPrioritiesInFolder = (folderId?: string) => {
    console.log('🔄 Reordering priorities in folder:', folderId);
    setLists(prev => {
      const folderLists = prev.filter(list => list.folderId === folderId).sort((a, b) => a.priority - b.priority);
      const otherLists = prev.filter(list => list.folderId !== folderId);
      
      const reorderedFolderLists = folderLists.map((list, index) => ({
        ...list,
        priority: index + 1
      }));
      
      console.log('🔄 Reordered folder lists:', reorderedFolderLists.map(l => `${l.name}(#${l.priority})`));
      
      return [...otherLists, ...reorderedFolderLists];
    });
  };

  // Load lists and folders from localStorage on mount
  useEffect(() => {
    console.log('🚀 ListProvider mounting, loading from localStorage');
    const storedLists = localStorage.getItem('todoLists');
    const storedFolders = localStorage.getItem('todoFolders');
    const storedCurrentListId = localStorage.getItem('currentListId');
    
    if (storedFolders) {
      const parsedFolders = JSON.parse(storedFolders);
      console.log('📁 Loaded folders:', parsedFolders.map((f: Folder) => f.name));
      setFolders(parsedFolders);
    }
    
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists);
      // Ensure all lists have priority property and reorder by folder
      const listsWithPriority = parsedLists.map((list: any, index: number) => ({
        ...list,
        priority: list.priority ?? index + 1
      }));
      console.log('📋 Loaded lists:', listsWithPriority.map((l: TodoList) => `${l.name}(#${l.priority})`));
      setLists(listsWithPriority);
      
      if (storedCurrentListId && listsWithPriority.find((list: TodoList) => list.id === storedCurrentListId)) {
        console.log('🎯 Setting current list from storage:', storedCurrentListId);
        setCurrentListId(storedCurrentListId);
      } else if (listsWithPriority.length > 0) {
        console.log('🎯 Setting first list as current:', listsWithPriority[0].id);
        setCurrentListId(listsWithPriority[0].id);
      }
    } else {
      // Create default list if no lists exist
      const defaultList: TodoList = {
        id: 'default',
        name: 'My Tasks',
        createdAt: Date.now(),
        priority: 1,
      };
      console.log('🆕 Creating default list:', defaultList.name);
      setLists([defaultList]);
      setCurrentListId(defaultList.id);
    }
  }, []);

  // Save lists to localStorage whenever lists change
  useEffect(() => {
    if (lists.length > 0) {
      console.log('💾 Saving lists to localStorage:', lists.map(l => `${l.name}(#${l.priority})`));
      localStorage.setItem('todoLists', JSON.stringify(lists));
    }
  }, [lists]);

  // Save folders to localStorage whenever folders change
  useEffect(() => {
    console.log('💾 Saving folders to localStorage:', folders.map(f => f.name));
    localStorage.setItem('todoFolders', JSON.stringify(folders));
  }, [folders]);

  // Save current list ID to localStorage
  useEffect(() => {
    if (currentListId) {
      console.log('💾 Saving current list ID to localStorage:', currentListId);
      localStorage.setItem('currentListId', currentListId);
    }
  }, [currentListId]);

  const createList = (name: string, folderId?: string) => {
    console.log('➕ Creating new list:', name, 'in folder:', folderId);
    const maxPriority = getMaxPriorityInFolder(folderId);
    const newList: TodoList = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: Date.now(),
      priority: maxPriority + 1,
      folderId,
    };
    setLists(prev => [...prev, newList]);
    setCurrentListId(newList.id);
  };

  const deleteList = (id: string) => {
    console.log('🗑️ Attempting to delete list:', id);
    if (lists.length <= 1) {
      console.log('❌ Cannot delete last list');
      return;
    }

    const listToDelete = lists.find(list => list.id === id);
    if (!listToDelete) {
      console.log('❌ List not found:', id);
      return;
    }

    console.log('🗑️ Deleting list:', listToDelete.name, 'from folder:', listToDelete.folderId);
    localStorage.removeItem(`todos_${id}`);

    const newLists = lists.filter(list => list.id !== id);

    if (currentListId === id) {
      console.log('🎯 Deleted list was current, selecting new one');
      if (newLists.length > 0) {
        const folderId = listToDelete.folderId;
        const listsInSameFolder = newLists.filter(l => l.folderId === folderId).sort((a, b) => a.priority - b.priority);
        const nextList = listsInSameFolder.length > 0 ? listsInSameFolder[0] : newLists.sort((a,b) => a.priority-b.priority)[0];
        console.log('🎯 Setting new current list:', nextList.name);
        setCurrentListId(nextList.id);
      } else {
        // This case should not be reached due to the initial guard `lists.length <= 1`
        console.log('🎯 No lists remaining, setting null');
        setCurrentListId(null); 
      }
    }

    // re-order priorities in the affected folder
    const folderId = listToDelete.folderId;
    const folderLists = newLists.filter(list => list.folderId === folderId).sort((a, b) => a.priority - b.priority);
    const otherLists = newLists.filter(list => list.folderId !== folderId);
    
    const reorderedFolderLists = folderLists.map((list, index) => ({
      ...list,
      priority: index + 1
    }));

    console.log('🔄 Final lists after deletion:', [...otherLists, ...reorderedFolderLists].map(l => `${l.name}(#${l.priority})`));
    setLists([...otherLists, ...reorderedFolderLists]);
  };

  const setCurrentList = (id: string) => {
    console.log('🎯 Setting current list:', id);
    // Add a check to prevent unnecessary updates
    if (currentListId !== id) {
      setCurrentListId(id);
    } else {
      console.log('🎯 List already current, skipping update');
    }
  };

  const renameList = (id: string, newName: string) => {
    console.log('✏️ Renaming list:', id, 'to:', newName);
    setLists(prev =>
      prev.map(list =>
        list.id === id ? { ...list, name: newName.trim() } : list
      )
    );
  };

  const moveListUp = (id: string) => {
    console.log('⬆️ Moving list up:', id);
    const list = lists.find(l => l.id === id);
    if (!list) return;
    
    // Get all lists in the same folder, sorted by priority
    const folderLists = lists.filter(l => l.folderId === list.folderId).sort((a, b) => a.priority - b.priority);
    const currentIndex = folderLists.findIndex(l => l.id === id);
    
    if (currentIndex <= 0) return; // Already at the top
    
    // Swap priorities with the list above
    const listAbove = folderLists[currentIndex - 1];
    setLists(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, priority: listAbove.priority };
      }
      if (l.id === listAbove.id) {
        return { ...l, priority: list.priority };
      }
      return l;
    }));
  };

  const moveListDown = (id: string) => {
    console.log('⬇️ Moving list down:', id);
    const list = lists.find(l => l.id === id);
    if (!list) return;
    
    // Get all lists in the same folder, sorted by priority
    const folderLists = lists.filter(l => l.folderId === list.folderId).sort((a, b) => a.priority - b.priority);
    const currentIndex = folderLists.findIndex(l => l.id === id);
    
    if (currentIndex >= folderLists.length - 1) return; // Already at the bottom
    
    // Swap priorities with the list below
    const listBelow = folderLists[currentIndex + 1];
    setLists(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, priority: listBelow.priority };
      }
      if (l.id === listBelow.id) {
        return { ...l, priority: list.priority };
      }
      return l;
    }));
  };

  const createFolder = (name: string) => {
    console.log('📁➕ Creating new folder:', name);
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: Date.now(),
      expanded: true,
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    console.log('📁🗑️ Deleting folder:', id);
    const listsInFolder = lists.filter(list => list.folderId === id);
    console.log('📁🗑️ Lists in folder to delete:', listsInFolder.map(l => l.name));

    // Delete all lists' localStorage data in the folder
    listsInFolder.forEach(list => {
      localStorage.removeItem(`todos_${list.id}`);
    });
    
    const wasCurrentListInFolder = listsInFolder.some(list => list.id === currentListId);
    const allRemainingLists = lists.filter(list => list.folderId !== id);
    console.log('📁🗑️ Remaining lists after folder deletion:', allRemainingLists.map(l => l.name));

    // Remove the folder itself
    setFolders(prev => prev.filter(folder => folder.id !== id));

    if (allRemainingLists.length === 0) {
        console.log('📁🗑️ No lists left, creating default');
        // No lists left in the entire app, create a new default list.
        const defaultList: TodoList = {
            id: 'default-' + Date.now(),
            name: 'My Tasks',
            createdAt: Date.now(),
            priority: 1,
        };
        setLists([defaultList]);
        setCurrentListId(defaultList.id);
    } else {
        setLists(allRemainingLists);
        if (wasCurrentListInFolder) {
            console.log('📁🗑️ Current list was in deleted folder, selecting:', allRemainingLists[0].name);
            // Select the first of the remaining lists as current.
            setCurrentListId(allRemainingLists[0].id);
        }
    }
  };

  const renameFolder = (id: string, newName: string) => {
    console.log('📁✏️ Renaming folder:', id, 'to:', newName);
    setFolders(prev =>
      prev.map(folder =>
        folder.id === id ? { ...folder, name: newName.trim() } : folder
      )
    );
  };

  const toggleFolder = (id: string) => {
    console.log('📁🔄 Toggling folder:', id);
    setFolders(prev =>
      prev.map(folder =>
        folder.id === id ? { ...folder, expanded: !folder.expanded } : folder
      )
    );
  };

  const moveListToFolder = (listId: string, folderId?: string) => {
    console.log('📁➡️ Moving list to folder:', listId, 'to folder:', folderId);
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    const oldFolderId = list.folderId;
    const maxPriority = getMaxPriorityInFolder(folderId);
    
    setLists(prev =>
      prev.map(l =>
        l.id === listId ? { ...l, folderId, priority: maxPriority + 1 } : l
      )
    );
    
    // Reorder priorities in the old folder after a short delay to ensure state is updated
    setTimeout(() => {
      console.log('📁➡️ Reordering old folder after move:', oldFolderId);
      reorderPrioritiesInFolder(oldFolderId);
    }, 10);
  };

  const currentList = lists.find(list => list.id === currentListId) || null;

  return (
    <ListContext.Provider value={{
      lists,
      folders,
      currentListId,
      currentList,
      createList,
      deleteList,
      setCurrentList,
      renameList,
      moveListUp,
      moveListDown,
      createFolder,
      deleteFolder,
      renameFolder,
      toggleFolder,
      moveListToFolder,
    }}>
      {children}
    </ListContext.Provider>
  );
};

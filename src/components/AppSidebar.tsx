
import React, { useState, useMemo } from 'react';
import { useLists } from './ListContext';
import { useTodos } from './TodoContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Sidebar } from './ui/sidebar';
import CreateListDialog from './CreateListDialog';
import CreateFolderDialog from './CreateFolderDialog';
import AppSidebarHeader from './SidebarHeader';
import AppSidebarFooter from './SidebarFooter';
import AppSidebarContent from './AppSidebarContent';

const AppSidebar = () => {
  console.log('🏗️ AppSidebar rendering');
  
  const { lists, folders, currentList, deleteList, renameList, deleteFolder, renameFolder } = useLists();
  const { todos } = useTodos();
  const isMobile = useIsMobile();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Find current folder details
  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null;

  // Handler functions for list operations
  const handleDeleteList = (listId: string) => {
    if (lists.length > 1) {
      deleteList(listId);
    }
  };

  // Handler functions for folder operations
  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);
  };
  
  // Memoize the completion status for all lists to avoid repeated localStorage reads
  const listCompletionData = useMemo(() => {
    const completionMap = new Map();
    
    lists.forEach(list => {
      let listTodos;
      // Use live todos from context for the current list for real-time updates
      if (currentList?.id === list.id) {
        listTodos = todos;
      } else {
        // For other lists, use localStorage for a snapshot to avoid loading all todos
        const storedTodos = localStorage.getItem(`todos_${list.id}`);
        listTodos = storedTodos ? JSON.parse(storedTodos) : [];
      }

      const completedCount = listTodos.filter((todo: any) => todo.completed).length;
      const totalCount = listTodos.length;
      const isCompleted = totalCount > 0 && completedCount === totalCount;
      
      completionMap.set(list.id, {
        isCompleted,
        completedCount,
        totalCount
      });
    });
    
    return completionMap;
  }, [lists, todos, currentList?.id]);

  // Filter lists based on current view and sort by priority
  const filteredLists = useMemo(() => {
    let filtered;
    if (currentFolderId) {
      // Show only lists in the current folder
      filtered = lists.filter(list => list.folderId === currentFolderId);
    } else {
      // Show only root-level lists
      filtered = lists.filter(list => !list.folderId);
    }
    // Sort by priority to maintain proper order
    return filtered.sort((a, b) => a.priority - b.priority);
  }, [lists, currentFolderId]);

  // Separate filtered lists into active and completed
  const { activeLists, completedLists } = useMemo(() => {
    const active: typeof lists = [];
    const completed: typeof lists = [];
    
    filteredLists.forEach(list => {
      const data = listCompletionData.get(list.id);
      const isCompleted = data?.isCompleted || false;
      
      if (isCompleted) {
        completed.push(list);
      } else {
        active.push(list);
      }
    });
    
    return { activeLists: active, completedLists: completed };
  }, [filteredLists, listCompletionData]);

  // Get root-level folders (only shown when not in a folder)
  const rootFolders = useMemo(() => {
    if (currentFolderId) return [];
    return folders;
  }, [folders, currentFolderId]);

  // Updated canMove functions to work with folder-specific ordering
  const canMoveUp = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return false;
    
    const folderLists = lists.filter(l => l.folderId === list.folderId).sort((a, b) => a.priority - b.priority);
    const currentIndex = folderLists.findIndex(l => l.id === listId);
    
    return currentIndex > 0;
  };

  const canMoveDown = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return false;
    
    const folderLists = lists.filter(l => l.folderId === list.folderId).sort((a, b) => a.priority - b.priority);
    const currentIndex = folderLists.findIndex(l => l.id === listId);
    
    return currentIndex < folderLists.length - 1;
  };

  const sidebarProps = {
    isMobile,
    currentFolderId,
    rootFolders,
    activeLists,
    completedLists,
    lists,
    folders,
    listCompletionData,
    currentListId: currentList?.id || null,
    editingItemId,
    setEditingItemId,
    onRenameFolder: renameFolder,
    onDeleteFolder: handleDeleteFolder,
    onRenameList: renameList,
    onDeleteList: handleDeleteList,
    canMoveUp,
    canMoveDown,
    onEnterFolder: setCurrentFolderId,
  };

  if (isMobile) {
    return (
      <div className="flex h-full flex-col bg-white">
        <AppSidebarHeader
          currentFolderId={currentFolderId}
          currentFolder={currentFolder}
          onCreateList={() => setShowCreateDialog(true)}
          onCreateFolder={() => setShowCreateFolderDialog(true)}
          onBackToRoot={() => setCurrentFolderId(null)}
        />
        <AppSidebarContent {...sidebarProps} />
        <AppSidebarFooter />

        <CreateListDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          currentFolderId={currentFolderId}
        />

        <CreateFolderDialog
          open={showCreateFolderDialog}
          onOpenChange={setShowCreateFolderDialog}
        />
      </div>
    );
  }

  return (
    <>
      <Sidebar className="border-r border-slate-200">
        <AppSidebarHeader
          currentFolderId={currentFolderId}
          currentFolder={currentFolder}
          onCreateList={() => setShowCreateDialog(true)}
          onCreateFolder={() => setShowCreateFolderDialog(true)}
          onBackToRoot={() => setCurrentFolderId(null)}
        />
        <AppSidebarContent {...sidebarProps} />
        <AppSidebarFooter />
      </Sidebar>

      <CreateListDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        currentFolderId={currentFolderId}
      />

      <CreateFolderDialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      />
    </>
  );
};

export default AppSidebar;

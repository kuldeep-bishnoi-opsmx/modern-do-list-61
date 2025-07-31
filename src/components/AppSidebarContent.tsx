
import React from 'react';
import { Folder, Archive } from 'lucide-react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from './ui/sidebar';
import ListItem from './ListItem';
import FolderItem from './FolderItem';

interface AppSidebarContentProps {
  isMobile: boolean;
  currentFolderId: string | null;
  rootFolders: any[];
  activeLists: any[];
  completedLists: any[];
  lists: any[];
  folders: any[];
  listCompletionData: Map<string, any>;
  currentListId: string | null;
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameList: (id: string, newName: string) => void;
  onDeleteList: (listId: string) => void;
  canMoveUp: (listId: string) => boolean;
  canMoveDown: (listId: string) => boolean;
  onEnterFolder: (folderId: string) => void;
}

const AppSidebarContent: React.FC<AppSidebarContentProps> = ({
  isMobile,
  currentFolderId,
  rootFolders,
  activeLists,
  completedLists,
  lists,
  folders,
  listCompletionData,
  currentListId,
  editingItemId,
  setEditingItemId,
  onRenameFolder,
  onDeleteFolder,
  onRenameList,
  onDeleteList,
  canMoveUp,
  canMoveDown,
  onEnterFolder,
}) => {

  const folderSectionContent = (
    <ul className="flex w-full min-w-0 flex-col gap-1">
      {rootFolders.map((folder) => {
        const folderLists = lists.filter(list => list.folderId === folder.id);
        return (
          <FolderItem
            key={folder.id}
            folder={folder}
            folderLists={folderLists}
            listCompletionData={listCompletionData}
            folders={folders}
            editingItemId={editingItemId}
            setEditingItemId={setEditingItemId}
            onRename={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            onRenameList={onRenameList}
            onDeleteList={onDeleteList}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            currentListId={currentListId}
            onEnterFolder={onEnterFolder}
          />
        );
      })}
    </ul>
  );

  const listsSectionContent = (listArray: any[]) => (
    <ul className="flex w-full min-w-0 flex-col gap-1">
      {listArray.map((list) => (
        <ListItem
          key={list.id}
          list={list}
          isActive={currentListId === list.id}
          completionData={listCompletionData.get(list.id) || { isCompleted: false, completedCount: 0, totalCount: 0 }}
          canMoveUp={canMoveUp(list.id)}
          canMoveDown={canMoveDown(list.id)}
          currentFolderId={currentFolderId}
          folders={folders}
          editingItemId={editingItemId}
          setEditingItemId={setEditingItemId}
          onRename={onRenameList}
          onDelete={onDeleteList}
        />
      ))}
    </ul>
  );

  const emptyState = activeLists.length === 0 && completedLists.length === 0 && rootFolders.length === 0 && (
    <div className="text-center py-8 text-slate-500">
      <p className="text-sm">
        {currentFolderId ? 'No lists in this folder yet.' : 'No lists or folders yet.'}
      </p>
      <p className="text-xs mt-1">
        Create your first {currentFolderId ? 'list' : 'list or folder'} above.
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <div className="p-2 flex-1 overflow-auto">
        {!currentFolderId && rootFolders.length > 0 && (
          <div className="relative flex w-full min-w-0 flex-col p-2">
            <div className="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
              <Folder className="w-3 h-3" />
              Folders
            </div>
            <div className="w-full text-sm">{folderSectionContent}</div>
          </div>
        )}
        {activeLists.length > 0 && (
          <div className="relative flex w-full min-w-0 flex-col p-2">
            <div className="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-slate-600 mb-2">
              Active Lists
            </div>
            <div className="w-full text-sm">{listsSectionContent(activeLists)}</div>
          </div>
        )}
        {completedLists.length > 0 && (
          <div className="relative flex w-full min-w-0 flex-col p-2">
            <div className="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Archive className="w-3 h-3" />
              Archive
            </div>
            <div className="w-full text-sm">{listsSectionContent(completedLists)}</div>
          </div>
        )}
        {emptyState}
      </div>
    );
  }

  return (
    <SidebarContent className="p-2">
      {!currentFolderId && rootFolders.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-slate-600 mb-2 flex items-center gap-1.5">
            <Folder className="w-3 h-3" />
            Folders
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{folderSectionContent}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
      {activeLists.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-slate-600 mb-2">
            Active Lists
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{listsSectionContent(activeLists)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
      {completedLists.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
            <Archive className="w-3 h-3" />
            Archive
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{listsSectionContent(completedLists)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
      {emptyState}
    </SidebarContent>
  );
};

export default AppSidebarContent;

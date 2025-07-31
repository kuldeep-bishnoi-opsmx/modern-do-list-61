
import React, { useState, useEffect, useRef } from 'react';
import { useLists } from './ListContext';
import { Folder, FolderOpen, ChevronRight, Edit2, Trash2, MoreVertical } from 'lucide-react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from './ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import ListItem from './ListItem';
import { Input } from './ui/input';

interface FolderItemProps {
  folder: any;
  folderLists: any[];
  listCompletionData: Map<string, any>;
  folders: any[];
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
  onRename: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameList: (listId: string, name: string) => void;
  onDeleteList: (listId: string) => void;
  canMoveUp: (listId: string) => boolean;
  canMoveDown: (listId: string) => boolean;
  currentListId: string | null;
  onEnterFolder: (folderId: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  folderLists,
  listCompletionData,
  folders,
  editingItemId,
  setEditingItemId,
  onRename,
  onDeleteFolder,
  onRenameList,
  onDeleteList,
  canMoveUp,
  canMoveDown,
  currentListId,
  onEnterFolder,
}) => {
  const { toggleFolder } = useLists();
  const folderListCount = folderLists.length;
  const [name, setName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editingItemId === folder.id;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setName(folder.name);
  }, [folder.name]);

  const handleSave = () => {
    if (name.trim() && name.trim() !== folder.name) {
      onRename(folder.id, name.trim());
    }
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setName(folder.name);
    setEditingItemId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <SidebarMenuItem>
      <Collapsible 
        open={folder.expanded} 
        onOpenChange={() => { if (!isEditing) toggleFolder(folder.id); }}
      >
        <div className="flex items-center group">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${folder.expanded ? 'rotate-90' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <SidebarMenuButton
            className="flex-1 justify-start group"
            onClick={() => { if (!isEditing) onEnterFolder(folder.id); }}
            disabled={isEditing}
          >
            {folder.expanded ? (
              <FolderOpen className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            {isEditing ? (
              <Input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="h-6 text-sm px-1 flex-1"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-sm text-slate-600 truncate cursor-pencil"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingItemId(folder.id);
                }}
              >
                {folder.name}
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto shrink-0">
              ({folderListCount})
            </span>
          </SidebarMenuButton>
          
          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setEditingItemId(folder.id);
                }}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Rename Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDeleteFolder(folder.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <CollapsibleContent className="ml-6">
          <SidebarMenu>
            {folderLists.sort((a, b) => a.priority - b.priority).map((list) => (
              <ListItem
                key={list.id}
                list={list}
                isActive={currentListId === list.id}
                completionData={listCompletionData.get(list.id) || { isCompleted: false, completedCount: 0, totalCount: 0 }}
                canMoveUp={canMoveUp(list.id)}
                canMoveDown={canMoveDown(list.id)}
                currentFolderId={folder.id}
                folders={folders}
                editingItemId={editingItemId}
                setEditingItemId={setEditingItemId}
                onRename={onRenameList}
                onDelete={onDeleteList}
              />
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default FolderItem;

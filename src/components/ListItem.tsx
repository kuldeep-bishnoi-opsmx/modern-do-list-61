import React, { useState, useEffect, useRef } from 'react';
import { useLists } from './ListContext';
import { CheckCircle, Edit2, Trash2, ArrowUp, ArrowDown, Home, Folder, MoreVertical } from 'lucide-react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Input } from './ui/input';

interface ListItemProps {
  list: any;
  isActive: boolean;
  completionData: {
    isCompleted: boolean;
    completedCount: number;
    totalCount: number;
  };
  canMoveUp: boolean;
  canMoveDown: boolean;
  currentFolderId: string | null;
  folders: any[];
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
  onRename: (listId: string, name: string) => void;
  onDelete: (listId: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  list,
  isActive,
  completionData,
  canMoveUp,
  canMoveDown,
  currentFolderId,
  folders,
  editingItemId,
  setEditingItemId,
  onRename,
  onDelete,
}) => {
  const { setCurrentList, moveListUp, moveListDown, moveListToFolder } = useLists();
  const { isCompleted, completedCount, totalCount } = completionData;
  const [name, setName] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editingItemId === list.id;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setName(list.name);
  }, [list.name]);

  const handleSave = () => {
    if (name.trim() && name.trim() !== list.name) {
      onRename(list.id, name.trim());
    }
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setName(list.name);
    setEditingItemId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <SidebarMenuItem>
      <div className="flex items-center w-full group">
        <SidebarMenuButton
          isActive={isActive && !isEditing}
          onClick={() => {
            if (!isEditing) {
              setCurrentList(list.id);
            }
          }}
          className="flex-1 justify-between"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono">
                #{list.priority}
              </span>
              {isCompleted && totalCount > 0 && (
                <CheckCircle className="w-3 h-3 text-green-600" />
              )}
            </div>
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
                className={`truncate cursor-pencil ${isCompleted && totalCount > 0 ? 'text-green-700' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingItemId(list.id);
                }}
              >
                {list.name}
              </span>
            )}
          </div>
          
          {!isEditing && totalCount > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
              isCompleted 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {completedCount}/{totalCount}
            </span>
          )}
        </SidebarMenuButton>
        
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-1 flex items-center justify-center rounded hover:bg-slate-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                setEditingItemId(list.id);
              }}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!currentFolderId && list.folderId ? (
                <DropdownMenuItem onClick={() => moveListToFolder(list.id, undefined)}>
                  <Home className="w-4 h-4 mr-2" />
                  Move to Root
                </DropdownMenuItem>
              ) : !currentFolderId && !list.folderId && folders.length > 0 ? (
                <>
                  <DropdownMenuItem disabled className="text-slate-500">
                    <Folder className="w-4 h-4 mr-2" />
                    Move to Folder:
                  </DropdownMenuItem>
                  {folders.map((folder) => (
                    <DropdownMenuItem 
                      key={folder.id}
                      onClick={() => moveListToFolder(list.id, folder.id)}
                      className="pl-6"
                    >
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </>
              ) : currentFolderId ? (
                <DropdownMenuItem onClick={() => moveListToFolder(list.id, undefined)}>
                  <Home className="w-4 h-4 mr-2" />
                  Move to Root
                </DropdownMenuItem>
              ) : null}
              {(currentFolderId || folders.length > 0) && <DropdownMenuSeparator />}
              {canMoveUp && (
                <DropdownMenuItem onClick={() => moveListUp(list.id)}>
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Move Up
                </DropdownMenuItem>
              )}
              {canMoveDown && (
                <DropdownMenuItem onClick={() => moveListDown(list.id)}>
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Move Down
                </DropdownMenuItem>
              )}
              {(canMoveUp || canMoveDown) && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => onDelete(list.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </SidebarMenuItem>
  );
};

export default ListItem;

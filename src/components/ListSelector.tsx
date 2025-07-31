
import React, { useState, useEffect, useRef } from 'react';
import { useLists } from './ListContext';
import { ChevronDown, Plus, MoreVertical, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import CreateListDialog from './CreateListDialog';

const ListSelector = () => {
  const { lists, currentList, setCurrentList, deleteList, renameList, moveListUp, moveListDown } = useLists();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentList) {
      setName(currentList.name);
    }
    // If current list changes, exit editing mode
    setIsEditing(false);
  }, [currentList]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDeleteList = (listId: string) => {
    if (lists.length > 1) {
      deleteList(listId);
    }
  };

  const startEditing = () => {
    if (currentList) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (currentList && name.trim()) {
      renameList(currentList.id, name.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const canMoveUp = currentList && lists.findIndex(list => list.id === currentList.id) > 0;
  const canMoveDown = currentList && lists.findIndex(list => list.id === currentList.id) < lists.length - 1;

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditing && currentList ? (
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="flex-1 bg-white border-slate-200 h-10"
            />
          ) : (
            <Select value={currentList?.id} onValueChange={setCurrentList}>
              <SelectTrigger className="flex-1 bg-white border-slate-200 min-w-0">
                <SelectValue placeholder="Select a list">
                  {currentList && (
                    <span className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono">
                        #{currentList.priority}
                      </span>
                      {currentList.name}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    <span className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono">
                        #{list.priority}
                      </span>
                      {list.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white border-slate-200 px-2 h-10 flex-shrink-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white">
                <DropdownMenuItem onClick={startEditing}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canMoveUp && (
                  <DropdownMenuItem onClick={() => currentList && moveListUp(currentList.id)}>
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Move Up
                  </DropdownMenuItem>
                )}
                {canMoveDown && (
                  <DropdownMenuItem onClick={() => currentList && moveListDown(currentList.id)}>
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Move Down
                  </DropdownMenuItem>
                )}
                {(canMoveUp || canMoveDown) && <DropdownMenuSeparator />}
                {lists.length > 1 && currentList && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteList(currentList.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete List
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {!isEditing && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            variant="outline"
            size="sm"
            className="bg-white border-slate-200 flex-shrink-0 h-10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New List</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}
      </div>

      <CreateListDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};

export default ListSelector;

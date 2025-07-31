
import React, { useState } from 'react';
import { useLists } from './ListContext';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolderId?: string | null;
}

const CreateListDialog: React.FC<CreateListDialogProps> = ({ open, onOpenChange, currentFolderId }) => {
  const { createList, folders } = useLists();
  const [listName, setListName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  // Set default folder when dialog opens
  React.useEffect(() => {
    if (open) {
      if (currentFolderId) {
        setSelectedFolder(currentFolderId);
      } else {
        setSelectedFolder('root');
      }
    }
  }, [open, currentFolderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listName.trim()) {
      // Convert "root" back to undefined for the createList function
      const folderId = selectedFolder === 'root' ? undefined : selectedFolder;
      createList(listName.trim(), folderId || undefined);
      setListName('');
      setSelectedFolder('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setListName('');
    setSelectedFolder('');
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                List Name
              </label>
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter list name"
                autoFocus
              />
            </div>
            
            {/* Only show folder selection if we're not already in a folder or if there are other folders to choose from */}
            {(!currentFolderId || folders.length > 1) && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Folder {currentFolderId ? '(Current)' : '(Optional)'}
                </label>
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select a folder or leave empty" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="root">No folder (root level)</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name} {folder.id === currentFolderId ? '(Current)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!listName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListDialog;


import React from 'react';
import { Plus, List, FolderOpen, ChevronLeft, FolderPlus } from 'lucide-react';
import { SidebarHeader } from './ui/sidebar';
import { Button } from './ui/button';

interface SidebarHeaderProps {
  currentFolderId: string | null;
  currentFolder: any;
  onCreateList: () => void;
  onCreateFolder: () => void;
  onBackToRoot: () => void;
}

const AppSidebarHeader: React.FC<SidebarHeaderProps> = ({
  currentFolderId,
  currentFolder,
  onCreateList,
  onCreateFolder,
  onBackToRoot,
}) => {
  return (
    <SidebarHeader className="border-b border-slate-200 p-4">
      <div className="flex items-center gap-2">
        {currentFolderId ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToRoot}
              className="p-1 h-6 w-6"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <FolderOpen className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800 truncate">{currentFolder?.name}</h2>
          </>
        ) : (
          <>
            <List className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800">Lists</h2>
          </>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          onClick={onCreateList}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New List
        </Button>
        {!currentFolderId && (
          <Button
            onClick={onCreateFolder}
            variant="outline"
            size="sm"
            className="bg-white border-slate-200"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;

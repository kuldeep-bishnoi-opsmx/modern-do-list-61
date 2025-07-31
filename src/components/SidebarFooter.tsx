
import React from 'react';
import { SidebarFooter, SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import ExportImportButtons from './ExportImportButtons';

const AppSidebarFooter: React.FC = () => {
  return (
    <SidebarFooter className="border-t border-slate-200 p-4">
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs text-slate-500 mb-2">Data Management</SidebarGroupLabel>
        <div className="flex flex-col gap-2">
          <ExportImportButtons />
        </div>
      </SidebarGroup>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;

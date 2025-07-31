
import React, { useState } from 'react';
import { useTodos } from './TodoContext';
import { useLists } from './ListContext';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { Plus, Menu } from 'lucide-react';
import { SidebarProvider } from './ui/sidebar';
import { useSidebar } from './ui/sidebar';
import { useIsMobile } from '../hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import AppSidebar from './AppSidebar';
import { ThemeToggle } from './ThemeToggle';

const TodoAppContent = () => {
  const { todos } = useTodos();
  const { currentList } = useLists();
  const [showInput, setShowInput] = useState(false);
  const { setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  const handleMouseEnter = () => {
    if (!isMobile) {
      setOpen(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isMobile) {
      // Only hide if mouse is not moving towards the sidebar
      const rect = e.currentTarget.getBoundingClientRect();
      if (e.clientX < rect.left + 20) { // Much smaller buffer zone
        return;
      }
      setOpen(false);
    }
  };

  if (!currentList) {
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="max-w-xl mx-auto pt-6">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-light text-foreground mb-6">Tasks</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <AppSidebar />}
      
      <main className="flex-1 p-3 sm:p-4 relative">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Mobile menu trigger */}
        {isMobile ? (
          <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="fixed top-4 left-4 z-40 p-2 bg-card rounded-lg shadow-md border hover:bg-accent">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <div className="h-full overflow-hidden">
                <div className="h-full flex flex-col">
                  <AppSidebar />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          /* Desktop hover trigger area */
          <div 
            className="fixed top-0 left-0 w-4 h-full z-30"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Visual trigger indicator */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-16 bg-muted/50 hover:bg-muted rounded-r-lg flex items-center justify-center transition-all duration-200 cursor-pointer">
              <Menu className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}
        
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 pt-3 sm:pt-4">
            <h1 className="text-xl sm:text-2xl font-light text-foreground mb-1">
              {currentList.name}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {totalCount === 0 
                ? "No tasks yet. Add one below to get started." 
                : `${completedCount} of ${totalCount} completed`
              }
            </p>
          </div>

          {/* Add Task Button */}
          <div className="flex justify-center mb-4">
            {!showInput && (
              <button
                onClick={() => setShowInput(true)}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 h-9"
              >
                <Plus size={14} />
                Add Task
              </button>
            )}
          </div>

          {/* Todo Input */}
          {showInput && (
            <div className="mb-4">
              <TodoInput 
                onCancel={() => setShowInput(false)} 
                onAdd={() => {
                  // Keep input visible after adding a task
                }} 
              />
            </div>
          )}

          {/* Todo List */}
          <TodoList />

          {/* Footer */}
          {todos.length > 0 && (
            <div className="text-center mt-6 sm:mt-8 text-xs text-muted-foreground">
              Tasks are saved locally in your browser
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TodoApp = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <TodoAppContent />
    </SidebarProvider>
  );
};

export default TodoApp;

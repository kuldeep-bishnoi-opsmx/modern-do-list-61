
import React from 'react';
import { ListProvider } from '../components/ListContext';
import { TodoProvider } from '../components/TodoContext';
import TodoApp from '../components/TodoApp';
import { useAutoImport } from '../hooks/useAutoImport';

const IndexContent = () => {
  useAutoImport();
  return <TodoApp />;
};

const Index = () => {
  return (
    <ListProvider>
      <TodoProvider>
        <IndexContent />
      </TodoProvider>
    </ListProvider>
  );
};

export default Index;

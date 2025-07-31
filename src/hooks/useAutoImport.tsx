
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseImportUrl, importData } from '../utils/dataTransfer';

export const useAutoImport = () => {
  const { toast } = useToast();

  useEffect(() => {
    const encodedData = parseImportUrl();
    
    if (encodedData) {
      // Clear the hash to avoid re-importing
      window.history.replaceState(null, '', window.location.pathname);
      
      try {
        const success = importData(encodedData);
        
        if (success) {
          toast({
            title: "Tasks imported!",
            description: "Your tasks have been successfully imported.",
          });
          // Refresh to load the new data
          setTimeout(() => window.location.reload(), 1000);
        } else {
          throw new Error('Import failed');
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The shared link appears to be invalid.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);
};

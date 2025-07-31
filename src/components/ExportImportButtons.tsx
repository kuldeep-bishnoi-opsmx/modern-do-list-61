
import React, { useState } from 'react';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';
import { exportData, importData, generateShareUrl } from '../utils/dataTransfer';

const ExportImportButtons = () => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportUrl, setExportUrl] = useState('');
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const encodedData = exportData();
      const shareUrl = generateShareUrl(encodedData);
      
      // Check if data is too large for QR code (approximately 2KB limit)
      if (shareUrl.length > 2000) {
        toast({
          title: "Data too large",
          description: "Your data is too large for QR code. Consider using the share link instead.",
          variant: "destructive",
        });
      }
      
      setExportUrl(shareUrl);
      setShowExportDialog(true);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(exportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      toast({
        title: "No data provided",
        description: "Please enter a share link or data to import",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract data from URL if it's a full URL
      let encodedData = importText.trim();
      if (encodedData.includes('#import=')) {
        encodedData = encodedData.split('#import=')[1];
      }

      const success = importData(encodedData);
      
      if (success) {
        toast({
          title: "Import successful!",
          description: "Your data has been imported. Refresh the page to see changes.",
        });
        setShowImportDialog(false);
        setImportText('');
        // Refresh the page to load the new data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid data format. Please check your share link.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="bg-white border-slate-200 flex-1 h-10"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      
      <Button
        onClick={() => setShowImportDialog(true)}
        variant="outline"
        size="sm"
        className="bg-white border-slate-200 flex-1 h-10"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Your Tasks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              Scan this QR code or share the link to transfer your tasks to another device.
            </div>
            
            {exportUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <QRCode value={exportUrl} size={200} />
                </div>
                
                <div className="w-full">
                  <div className="text-xs text-slate-500 mb-2">Share Link:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={exportUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded"
                    />
                    <Button
                      onClick={handleCopyUrl}
                      size="sm"
                      variant="outline"
                      className="px-3"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Tasks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              Paste a share link or scan a QR code to import tasks from another device.
            </div>
            
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste share link here..."
              className="w-full px-3 py-2 border border-slate-200 rounded-md resize-none h-24 text-sm"
            />
            
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportText('');
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button onClick={handleImport} size="sm">
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportImportButtons;

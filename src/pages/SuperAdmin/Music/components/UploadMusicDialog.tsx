import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, X, Music, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadMusicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadMusicDialog({ open, onOpenChange }: UploadMusicDialogProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
    const maxFileSize = 20 * 1024 * 1024; // 20MB

    Array.from(files).forEach(file => {
      // Validate file type and size
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported audio file`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 20MB limit`,
          variant: "destructive",
        });
        return;
      }

      // Add file to progress tracking
      setUploadProgress(prev => [...prev, {
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }]);

      // Simulate upload progress
      simulateFileUpload(file.name);
    });
  };

  const simulateFileUpload = (fileName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => 
          prev.map(p => 
            p.fileName === fileName 
              ? { ...p, progress: 100, status: 'completed' }
              : p
          )
        );
      }
      setUploadProgress(prev => 
        prev.map(p => 
          p.fileName === fileName 
            ? { ...p, progress: Math.min(progress, 100) }
            : p
        )
      );
    }, 500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (fileName: string) => {
    setUploadProgress(prev => prev.filter(p => p.fileName !== fileName));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Music</DialogTitle>
        </DialogHeader>

        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('music-upload-dialog')?.click()}
        >
          <input
            id="music-upload-dialog"
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files!)}
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="text-lg font-medium mb-2">Drag and drop your audio files</div>
          <div className="text-sm text-gray-500 mb-4">or click to browse</div>
          <div className="text-xs text-gray-400">
            Supported formats: MP3, WAV, OGG (up to 20MB)
          </div>
        </div>

        {uploadProgress.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">Upload Progress</div>
            {uploadProgress.map((file) => (
              <div key={file.fileName} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{file.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'completed' ? (
                      <span className="text-xs text-green-600">Completed</span>
                    ) : file.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(file.fileName)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={file.progress} className="h-1" />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
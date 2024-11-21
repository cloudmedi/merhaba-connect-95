import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UploadMusicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export function UploadMusicDialog({ open, onOpenChange }: UploadMusicDialogProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, UploadingFile>>({});
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = async (files: FileList) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported audio file`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 20MB limit`,
          variant: "destructive",
        });
        continue;
      }

      // Add file to progress tracking
      setUploadingFiles(prev => ({
        ...prev,
        [file.name]: {
          file,
          progress: 0,
          status: 'uploading'
        }
      }));

      try {
        console.log('Starting upload for:', file.name);
        
        // Create FormData object
        const formData = new FormData();
        formData.append('file', file);

        // Update progress to show upload started
        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            progress: 10
          }
        }));

        // Call the upload-music edge function
        const { data, error } = await supabase.functions.invoke('upload-music', {
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        });

        console.log('Upload response:', { data, error });

        if (error) {
          throw error;
        }

        // Update progress to show completion
        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            progress: 100,
            status: 'completed'
          }
        }));

        // Invalidate and refetch songs query
        await queryClient.invalidateQueries({ queryKey: ['songs'] });

        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully`,
        });

      } catch (error: any) {
        console.error('Upload error:', error);
        
        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'error',
            error: error.message || 'Failed to upload file'
          }
        }));

        toast({
          title: "Upload failed",
          description: error.message || 'Failed to upload file',
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Music</DialogTitle>
        </DialogHeader>

        <UploadZone
          onFileSelect={handleFileSelect}
          isDragging={isDragging}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        />

        {Object.entries(uploadingFiles).length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">Upload Progress</div>
            {Object.entries(uploadingFiles).map(([fileName, file]) => (
              <UploadProgress
                key={fileName}
                file={{ name: fileName, ...file }}
                onRemove={() => {
                  setUploadingFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[fileName];
                    return newFiles;
                  });
                }}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
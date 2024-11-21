import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";
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

  const handleFileSelect = async (files: FileList) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported audio file`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 20MB limit`,
          variant: "destructive",
        });
        return;
      }

      setUploadingFiles(prev => ({
        ...prev,
        [file.name]: {
          file,
          progress: 0,
          status: 'uploading'
        }
      }));

      uploadFile(file);
    });
  };

  const uploadFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('music')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('songs')
        .insert([{
          title: file.name.replace(/\.[^/.]+$/, ""),
          file_url: publicUrl,
          duration: 0,
        }]);

      if (dbError) throw dbError;

      setUploadingFiles(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'completed',
          progress: 100
        }
      }));

      const updatedFiles = {
        ...uploadingFiles,
        [file.name]: {
          ...uploadingFiles[file.name],
          status: 'completed',
          progress: 100
        }
      };

      // Check if all files are completed
      const allCompleted = Object.values(updatedFiles).every(
        file => file.status === 'completed'
      );

      if (allCompleted) {
        toast({
          title: "Upload successful",
          description: "All files have been uploaded successfully",
        });
        
        // Close the dialog immediately and reset state
        onOpenChange(false);
        setUploadingFiles({});
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadingFiles(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'error',
          error: error.message
        }
      }));

      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFile = (fileName: string) => {
    setUploadingFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileName];
      return newFiles;
    });
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
        />

        {Object.entries(uploadingFiles).length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">Upload Progress</div>
            {Object.entries(uploadingFiles).map(([fileName, file]) => (
              <UploadProgress
                key={fileName}
                file={{ name: fileName, ...file }}
                onRemove={() => removeFile(fileName)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
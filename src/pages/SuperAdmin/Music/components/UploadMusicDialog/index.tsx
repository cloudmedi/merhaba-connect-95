import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadMusicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadMusicDialog({ open, onOpenChange }: UploadMusicDialogProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, UploadingFile>>({});
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = async (files: FileList) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Geçersiz dosya türü",
          description: `${file.name} desteklenen bir ses dosyası değil`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "Dosya çok büyük",
          description: `${file.name} 20MB limitini aşıyor`,
          variant: "destructive",
        });
        continue;
      }

      setUploadingFiles(prev => ({
        ...prev,
        [file.name]: {
          file,
          progress: 0,
          status: 'uploading'
        }
      }));

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/admin/songs/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / (progressEvent.total || file.size)) * 100;
            setUploadingFiles(prev => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                progress
              }
            }));
          }
        });

        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            progress: 100,
            status: 'completed'
          }
        }));

        await queryClient.invalidateQueries({ queryKey: ['songs'] });

        toast({
          title: "Yükleme başarılı",
          description: `${file.name} başarıyla yüklendi`,
        });

      } catch (error: any) {
        console.error('Upload error:', error);
        
        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'error',
            error: error.message || 'Dosya yüklenirken hata oluştu'
          }
        }));

        toast({
          title: "Yükleme başarısız",
          description: error.message || 'Dosya yüklenirken hata oluştu',
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Müzik Yükle</DialogTitle>
        </DialogHeader>

        <UploadZone
          onFileSelect={handleFileSelect}
          isDragging={isDragging}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        />

        {Object.entries(uploadingFiles).length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">Yükleme Durumu</div>
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
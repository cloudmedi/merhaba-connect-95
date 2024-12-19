import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";
import { AlertCircle } from "lucide-react";

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadMusicDialog({ open, onOpenChange }: Props) {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, UploadingFile>>({});
  const [isDragging, setIsDragging] = useState(false);
  const queryClient = useQueryClient();

  const handleFileSelect = async (files: FileList) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    for (const file of Array.from(files)) {
      // Dosya tipi kontrolü
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} desteklenen bir ses dosyası değil`, {
          icon: <AlertCircle className="h-5 w-5" />
        });
        continue;
      }

      // Dosya boyutu kontrolü
      if (file.size > maxSize) {
        toast.error(`${file.name} 100MB limitini aşıyor`, {
          icon: <AlertCircle className="h-5 w-5" />
        });
        continue;
      }

      // Yükleme durumunu başlat
      setUploadingFiles(prev => ({
        ...prev,
        [file.name]: {
          file,
          progress: 0,
          status: 'uploading'
        }
      }));

      try {
        console.log('Uploading file:', file.name);
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/admin/songs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / (progressEvent.total || file.size)) * 100;
            console.log('Upload progress:', progress);
            setUploadingFiles(prev => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                progress
              }
            }));
          }
        });

        console.log('Upload response:', response.data);

        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            progress: 100,
            status: 'completed'
          }
        }));

        await queryClient.invalidateQueries({ queryKey: ['songs'] });

        toast.success(`${file.name} başarıyla yüklendi`);

      } catch (error: any) {
        console.error('Upload error:', error);
        console.error('Error response:', error.response?.data);
        
        const errorMessage = error.response?.data?.error || error.message || 'Dosya yüklenirken hata oluştu';
        
        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'error',
            error: errorMessage
          }
        }));

        toast.error(`${file.name}: ${errorMessage}`, {
          icon: <AlertCircle className="h-5 w-5" />
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
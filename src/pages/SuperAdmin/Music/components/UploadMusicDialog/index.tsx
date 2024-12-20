import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";
import axios from "@/lib/axios";

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
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} desteklenen bir ses dosyası değil`);
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} 100MB limitini aşıyor`);
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

      const formData = new FormData();
      formData.append('file', file);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }

        // Axios ile dosya yükleme isteği
        const uploadResponse = await axios.post('/admin/songs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadingFiles(prev => ({
                ...prev,
                [file.name]: {
                  ...prev[file.name],
                  progress: progress
                }
              }));
            }
          }
        });

        if (uploadResponse.status === 200) {
          setUploadingFiles(prev => ({
            ...prev,
            [file.name]: {
              ...prev[file.name],
              progress: 100,
              status: 'completed'
            }
          }));
          queryClient.invalidateQueries({ queryKey: ['songs'] });
          toast.success(`${file.name} başarıyla yüklendi`);
        } else {
          throw new Error('Yükleme başarısız oldu');
        }

      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'error',
            error: error.message || 'Yükleme sırasında bir hata oluştu'
          }
        }));
        toast.error(`${file.name}: ${error.message || 'Yükleme sırasında bir hata oluştu'}`);
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";

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

        // Create EventSource for progress updates
        const eventSource = new EventSource(
          `${import.meta.env.VITE_API_URL}/admin/songs/upload?token=${token}`
        );

        console.log('EventSource created:', eventSource.url);

        // Handle connection open
        eventSource.onopen = () => {
          console.log('EventSource connection opened');
        };

        // Handle progress updates
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Upload progress event:', data);

            if (data.type === 'progress' && data.fileName === file.name) {
              setUploadingFiles(prev => ({
                ...prev,
                [file.name]: {
                  ...prev[file.name],
                  progress: data.progress
                }
              }));
            }

            if (data.type === 'complete') {
              eventSource.close();
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
            }

            if (data.type === 'error') {
              eventSource.close();
              throw new Error(data.error);
            }
          } catch (error) {
            console.error('Event data parsing error:', error);
            eventSource.close();
            handleUploadError(file.name, 'Event verisi işlenemedi');
          }
        };

        // Handle EventSource errors
        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          eventSource.close();
          handleUploadError(file.name, 'Bağlantı hatası oluştu');
        };

        // Start the actual file upload
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/songs/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

      } catch (error: any) {
        console.error('Upload error:', error);
        handleUploadError(file.name, error.message || 'Yükleme sırasında bir hata oluştu');
      }
    }
  };

  const handleUploadError = (fileName: string, errorMessage: string) => {
    setUploadingFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        status: 'error',
        error: errorMessage
      }
    }));
    toast.error(`${fileName}: ${errorMessage}`);
  };

  // Cleanup function to close EventSource connections when dialog closes
  useEffect(() => {
    if (!open) {
      setUploadingFiles({});
    }
  }, [open]);

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
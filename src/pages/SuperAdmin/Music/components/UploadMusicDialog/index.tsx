import { useState } from "react";
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
        const eventSource = new EventSource(`http://localhost:5000/api/admin/songs/upload?token=${token}`);
        let uploadComplete = false;

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Upload progress:', data);

          if (data.progress !== undefined) {
            setUploadingFiles(prev => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                progress: data.progress
              }
            }));
          }

          if (data.type === 'complete') {
            uploadComplete = true;
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
            uploadComplete = true;
            eventSource.close();
            setUploadingFiles(prev => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                status: 'error',
                error: data.error
              }
            }));
            toast.error(`${file.name}: ${data.error}`);
          }
        };

        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          if (!uploadComplete) {
            eventSource.close();
            setUploadingFiles(prev => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                status: 'error',
                error: 'Bağlantı hatası oluştu'
              }
            }));
            toast.error(`${file.name}: Bağlantı hatası oluştu`);
          }
        };

        // Send the actual file upload request
        const response = await fetch('http://localhost:5000/api/admin/songs/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok && !uploadComplete) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
        toast.error(`${file.name}: ${error.message}`);
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
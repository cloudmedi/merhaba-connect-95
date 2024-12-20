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
        const response = await fetch('/api/admin/songs/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Stream reader not available');

        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('Upload complete');
            break;
          }

          // SSE mesajlarını parse et
          const text = new TextDecoder().decode(value);
          const events = text.split('\n\n').filter(Boolean);

          for (const event of events) {
            if (!event.startsWith('data: ')) continue;
            
            try {
              const data = JSON.parse(event.slice(6));
              console.log('Received SSE data:', data);

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
              }

              if (data.type === 'error') {
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
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
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
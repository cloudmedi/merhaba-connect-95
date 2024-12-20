import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { UploadProgress } from "./UploadProgress";
import { UploadZone } from "./UploadZone";
import { useUploadProgress } from "./hooks/useUploadProgress";
import { useEventSource } from "./hooks/useEventSource";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadMusicDialog({ open, onOpenChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const {
    uploadingFiles,
    handleProgress,
    handleError,
    handleComplete,
    addFile,
    removeFile
  } = useUploadProgress();

  useEventSource({
    token,
    onProgress: handleProgress,
    onError: handleError,
    onComplete: handleComplete
  });

  const handleFileSelect = async (files: FileList) => {
    console.log('File selection started:', Array.from(files).map(f => f.name));
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        handleError(file.name, `${file.name} desteklenen bir ses dosyası değil`);
        continue;
      }

      if (file.size > maxSize) {
        handleError(file.name, `${file.name} 100MB limitini aşıyor`);
        continue;
      }

      console.log('Processing file:', file.name, 'Size:', file.size);
      addFile(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }

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

        queryClient.invalidateQueries({ queryKey: ['songs'] });

      } catch (error: any) {
        console.error('Upload error:', error);
        handleError(file.name, error.message || 'Yükleme sırasında bir hata oluştu');
      }
    }
  };

  useEffect(() => {
    if (!open) {
      console.log('Dialog closed, cleaning up uploadingFiles state');
      Object.keys(uploadingFiles).forEach(removeFile);
    }
  }, [open, uploadingFiles, removeFile]);

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
                onRemove={() => removeFile(fileName)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
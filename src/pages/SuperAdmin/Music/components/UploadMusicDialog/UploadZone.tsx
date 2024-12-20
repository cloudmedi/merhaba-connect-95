import { Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  isDragging?: boolean;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
}

export function UploadZone({ 
  onFileSelect,
  isDragging = false,
  onDragEnter,
  onDragLeave 
}: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(file => {
          if (file.size > 100 * 1024 * 1024) {
            toast.error(`${file.file.name} is too large. Maximum size is 100MB`);
          } else {
            toast.error(`${file.file.name} is not a supported audio file`);
          }
        });
        return;
      }

      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach(file => dataTransfer.items.add(file));
      onFileSelect(dataTransfer.files);
    },
    onDragEnter,
    onDragLeave
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <div className="text-lg font-medium mb-2">Müzik dosyalarını sürükleyin</div>
      <div className="text-sm text-gray-500 mb-4">veya dosya seçmek için tıklayın</div>
      <div className="text-xs text-gray-400">
        Desteklenen formatlar: MP3, WAV, OGG (100MB'a kadar)
      </div>
    </div>
  );
}
import { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileUpload: (files: FileList | null) => void;
  maxFileSize: number;
  maxDuration: number;
  disabled?: boolean;
}

export function DropZone({ onFileUpload, maxFileSize, maxDuration, disabled }: DropZoneProps) {
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current && !disabled) {
      dropzoneRef.current.classList.add('border-primary');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-primary');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-primary');
    }
    onFileUpload(e.dataTransfer.files);
  };

  return (
    <div
      ref={dropzoneRef}
      className={cn(
        "border-2 border-dashed rounded-lg p-4 text-center transition-all",
        disabled 
          ? "bg-gray-50 cursor-not-allowed opacity-50" 
          : "cursor-pointer hover:bg-gray-50"
      )}
      onClick={() => !disabled && document.getElementById('file-upload')?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-500">
        {disabled ? "Upload in progress..." : "Ses dosyalarını sürükleyin veya seçin"}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Maksimum dosya boyutu: {maxFileSize}MB, Süre: {maxDuration / 60} dakika
      </p>
      <input
        id="file-upload"
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => !disabled && onFileUpload(e.target.files)}
        disabled={disabled}
      />
    </div>
  );
}
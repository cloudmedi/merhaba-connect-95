import { Upload } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  isDragging: boolean;
}

export function UploadZone({ onFileSelect, isDragging }: UploadZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFileSelect(e.dataTransfer.files);
  };

  return (
    <div
      className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('music-upload')?.click()}
    >
      <input
        id="music-upload"
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
      />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <div className="text-lg font-medium mb-2">Drag and drop your audio files</div>
      <div className="text-sm text-gray-500 mb-4">or click to browse</div>
      <div className="text-xs text-gray-400">
        Supported formats: MP3, WAV, OGG (up to 20MB)
      </div>
    </div>
  );
}
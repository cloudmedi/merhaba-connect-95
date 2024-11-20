import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FileWithPreview {
  file: File;
  previewUrl: string;
  isPlaying: boolean;
  duration?: number;
}

interface FileUploadPreviewProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFileSize?: number; // in MB
  maxDuration?: number; // in seconds
}

export function FileUploadPreview({ 
  files, 
  onFilesChange, 
  maxFileSize = 10, 
  maxDuration = 300 
}: FileUploadPreviewProps) {
  const [previews, setPreviews] = useState<FileWithPreview[]>([]);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const validateFile = async (file: File): Promise<boolean> => {
    if (!file.type.startsWith('audio/')) {
      toast.error(`${file.name} ses dosyası değil`);
      return false;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`${file.name} çok büyük (max ${maxFileSize}MB)`);
      return false;
    }

    // Check audio duration
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        if (audio.duration > maxDuration) {
          toast.error(`${file.name} çok uzun (max ${maxDuration / 60} dakika)`);
          resolve(false);
        }
        resolve(true);
      };
    });
  };

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const validFiles: File[] = [];
    const newPreviews: FileWithPreview[] = [];

    for (const file of Array.from(uploadedFiles)) {
      if (await validateFile(file)) {
        validFiles.push(file);
        newPreviews.push({
          file,
          previewUrl: URL.createObjectURL(file),
          isPlaying: false
        });
      }
    }

    setPreviews(prev => [...prev, ...newPreviews]);
    onFilesChange([...files, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
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
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-primary');
    }
    handleFileUpload(e.dataTransfer.files);
  };

  const togglePlay = async (index: number) => {
    const preview = previews[index];
    const audio = audioRefs.current[preview.previewUrl];

    if (preview.isPlaying) {
      audio?.pause();
    } else {
      Object.values(audioRefs.current).forEach(a => a.pause());
      setPreviews(prev => prev.map(p => ({ ...p, isPlaying: false })));
      
      await audio?.play();
    }

    setPreviews(prev => prev.map((p, i) => 
      i === index ? { ...p, isPlaying: !p.isPlaying } : p
    ));
  };

  const removeFile = (index: number) => {
    const preview = previews[index];
    URL.revokeObjectURL(preview.previewUrl);
    
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        ref={dropzoneRef}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-all"
        onClick={() => document.getElementById('file-upload')?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Ses dosyalarını sürükleyin veya seçin</p>
        <p className="text-xs text-gray-400 mt-1">
          Maksimum dosya boyutu: {maxFileSize}MB, Süre: {maxDuration / 60} dakika
        </p>
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      <div className="space-y-2">
        {previews.map((preview, index) => (
          <div
            key={preview.previewUrl}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => togglePlay(index)}
              >
                {preview.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div>
                <p className="font-medium text-sm">{preview.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(preview.file.size / 1024 / 1024).toFixed(2)} MB
                  {preview.duration && ` • ${Math.round(preview.duration / 60)}:${String(Math.round(preview.duration % 60)).padStart(2, '0')}`}
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <audio
              ref={el => {
                if (el) audioRefs.current[preview.previewUrl] = el;
              }}
              src={preview.previewUrl}
              onLoadedMetadata={(e) => {
                const audio = e.currentTarget;
                setPreviews(prev => prev.map((p, i) => 
                  i === index ? { ...p, duration: audio.duration } : p
                ));
              }}
              onEnded={() => {
                setPreviews(prev => prev.map((p, i) => 
                  i === index ? { ...p, isPlaying: false } : p
                ));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

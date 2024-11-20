// Since this file is too large, let's split it into smaller components
import { useState, useRef } from "react";
import { FilePreviewList } from "./FilePreviewList";
import { DropZone } from "./DropZone";
import { validateAudioFile } from "../utils/fileValidation";
import { toast } from "sonner";
import { FileWithPreview } from "../types";

interface FileUploadPreviewProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFileSize?: number;
  maxDuration?: number;
}

export function FileUploadPreview({ 
  files, 
  onFilesChange, 
  maxFileSize = 10, 
  maxDuration = 300 
}: FileUploadPreviewProps) {
  const [previews, setPreviews] = useState<FileWithPreview[]>([]);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const validFiles: File[] = [];
    const newPreviews: FileWithPreview[] = [];

    for (const file of Array.from(uploadedFiles)) {
      if (await validateAudioFile(file, maxFileSize, maxDuration)) {
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
      <DropZone
        onFileUpload={handleFileUpload}
        maxFileSize={maxFileSize}
        maxDuration={maxDuration}
      />
      <FilePreviewList
        previews={previews}
        audioRefs={audioRefs}
        onTogglePlay={togglePlay}
        onRemoveFile={removeFile}
      />
    </div>
  );
}
import { useState, useRef } from "react";
import { FilePreviewList } from "./FilePreviewList";
import { DropZone } from "./DropZone";
import { validateAudioFile } from "../utils/fileValidation";
import { toast } from "sonner";
import { FileWithPreview } from "../types";
import api from "@/lib/api";

interface FileUploadPreviewProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFileSize?: number;
  maxDuration?: number;
  announcementId?: string;
}

export function FileUploadPreview({ 
  files, 
  onFilesChange, 
  maxFileSize = 10, 
  maxDuration = 300,
  announcementId 
}: FileUploadPreviewProps) {
  const [previews, setPreviews] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const uploadFile = async (file: File) => {
    if (!announcementId) {
      toast.error("Announcement ID is missing. Please try again.");
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('announcementId', announcementId);

      const { data } = await api.post('/manager/announcements/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success("File uploaded successfully");
      return data.url;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload file");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const validFiles: File[] = [];
    const newPreviews: FileWithPreview[] = [];

    for (const file of Array.from(uploadedFiles)) {
      try {
        if (await validateAudioFile(file, maxFileSize, maxDuration)) {
          const uploadedUrl = await uploadFile(file);
          if (uploadedUrl) {
            validFiles.push(file);
            newPreviews.push({
              file,
              previewUrl: URL.createObjectURL(file),
              isPlaying: false
            });
          }
        }
      } catch (error) {
        console.error('Failed to process file:', error);
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
        disabled={isUploading}
      />
      <FilePreviewList
        previews={previews}
        audioRefs={audioRefs}
        onTogglePlay={togglePlay}
        onRemoveFile={removeFile}
        isUploading={isUploading}
      />
    </div>
  );
}
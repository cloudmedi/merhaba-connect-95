import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";
import { FileWithPreview } from "../types";
import { MutableRefObject } from "react";

interface FilePreviewListProps {
  previews: FileWithPreview[];
  audioRefs: MutableRefObject<{ [key: string]: HTMLAudioElement }>;
  onTogglePlay: (index: number) => void;
  onRemoveFile: (index: number) => void;
  isUploading?: boolean;
}

export function FilePreviewList({
  previews,
  audioRefs,
  onTogglePlay,
  onRemoveFile,
  isUploading = false,
}: FilePreviewListProps) {
  return (
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
              onClick={() => onTogglePlay(index)}
              disabled={isUploading}
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
            onClick={() => onRemoveFile(index)}
            disabled={isUploading}
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
              preview.duration = audio.duration;
            }}
            onEnded={() => {
              preview.isPlaying = false;
            }}
          />
        </div>
      ))}
    </div>
  );
}
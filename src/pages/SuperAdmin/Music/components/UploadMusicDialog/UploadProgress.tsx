import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Music, AlertCircle, CheckCircle2 } from "lucide-react";

interface UploadProgressProps {
  file: {
    name: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
  };
  onRemove: () => void;
}

export function UploadProgress({ file, onRemove }: UploadProgressProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{file.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {file.status === 'completed' && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
          {file.status === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Progress value={file.progress} className="h-1" />
      {file.error && (
        <p className="text-xs text-red-500 mt-1">{file.error}</p>
      )}
    </div>
  );
}
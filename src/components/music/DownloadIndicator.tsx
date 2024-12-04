import { Download, Check, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DownloadIndicatorProps {
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
}

export function DownloadIndicator({ status, progress }: DownloadIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'downloading' && (
        <>
          <Download className="w-4 h-4 text-purple-500 animate-bounce" />
          <Progress value={progress} className="w-24 h-1" />
        </>
      )}
      {status === 'completed' && (
        <Check className="w-4 h-4 text-green-500" />
      )}
      {status === 'error' && (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
}
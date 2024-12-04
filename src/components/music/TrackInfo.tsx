import { Wifi, WifiOff } from "lucide-react";
import { DownloadIndicator } from "./DownloadIndicator";

interface TrackInfoProps {
  artwork: string;
  title: string;
  artist: string;
  isOffline: boolean;
  downloadStatus?: {
    status: 'pending' | 'downloading' | 'completed' | 'error';
    progress: number;
  };
}

export function TrackInfo({
  artwork,
  title,
  artist,
  isOffline,
  downloadStatus
}: TrackInfoProps) {
  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=400&quality=85&format=webp`;
  };

  return (
    <div className="flex items-center gap-4 flex-1 min-w-[180px] max-w-[300px]">
      <div className="relative">
        <img 
          src={getOptimizedImageUrl(artwork)} 
          alt={title}
          className="w-14 h-14 rounded-md object-cover shadow-lg"
        />
        <div className="absolute -top-2 -right-2">
          {isOffline ? (
            <WifiOff className="w-4 h-4 text-red-500" />
          ) : (
            <Wifi className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="text-white font-medium text-sm truncate hover:text-white/90 transition-colors cursor-default">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-white/60 text-xs truncate hover:text-white/70 transition-colors cursor-default">
            {artist}
          </p>
          {downloadStatus && (
            <DownloadIndicator 
              status={downloadStatus.status}
              progress={downloadStatus.progress}
            />
          )}
        </div>
      </div>
    </div>
  );
}
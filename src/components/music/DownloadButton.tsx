import { Button } from "@/components/ui/button";
import { Download, Loader2, Check } from "lucide-react";
import { useOfflineManager } from "@/hooks/useOfflineManager";
import { useState, useEffect } from "react";
import { offlineStorage } from "@/services/offlineStorage";

interface DownloadButtonProps {
  song: {
    id: string;
    title: string;
    artist: string;
    file_url: string;
    artwork_url?: string;
  };
}

export function DownloadButton({ song }: DownloadButtonProps) {
  const { downloadSong, isDownloading } = useOfflineManager();
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    checkIfDownloaded();
  }, [song.id]);

  const checkIfDownloaded = async () => {
    const downloaded = await offlineStorage.getSong(song.id);
    setIsDownloaded(!!downloaded);
  };

  const handleDownload = async () => {
    await downloadSong({
      ...song,
      artwork_url: song.artwork_url || ''
    });
    checkIfDownloaded();
  };

  if (isDownloaded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-green-500"
        disabled
      >
        <Check className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}
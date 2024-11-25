import { getOptimizedImageUrl } from "@/utils/imageUtils";

interface MusicPlayerArtworkProps {
  artwork: string;
  title: string;
  artist?: string;
}

export function MusicPlayerArtwork({ artwork, title, artist }: MusicPlayerArtworkProps) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src={getOptimizedImageUrl(artwork)} 
        alt={title}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="min-w-0">
        <h3 className="text-white text-sm font-medium truncate">
          {title}
        </h3>
        {artist && (
          <p className="text-white/60 text-xs truncate">
            {artist}
          </p>
        )}
      </div>
    </div>
  );
}
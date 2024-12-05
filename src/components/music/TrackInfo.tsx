interface TrackInfoProps {
  title: string;
  artist: string;
  artwork: string;
  onArtworkClick?: () => void;
}

export function TrackInfo({ title, artist, artwork, onArtworkClick }: TrackInfoProps) {
  return (
    <div className="flex items-center gap-4 min-w-[250px] max-w-[300px]">
      <img 
        src={artwork} 
        alt={title}
        onClick={onArtworkClick}
        className="w-14 h-14 rounded-lg object-cover shadow-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-white font-medium text-sm truncate">
          {title}
        </h3>
        <p className="text-white/60 text-xs truncate">
          {artist}
        </p>
      </div>
    </div>
  );
}
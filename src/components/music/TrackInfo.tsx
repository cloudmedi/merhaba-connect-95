interface TrackInfoProps {
  title: string;
  artist: string;
  artwork: string;
}

export function TrackInfo({ title, artist, artwork }: TrackInfoProps) {
  return (
    <div className="flex items-center gap-4 min-w-[250px] max-w-[300px]">
      <img 
        src={artwork} 
        alt={title}
        className="w-14 h-14 rounded-lg object-cover shadow-lg flex-shrink-0"
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
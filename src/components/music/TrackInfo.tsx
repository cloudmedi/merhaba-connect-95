interface TrackInfoProps {
  artwork: string;
  title: string;
  artist: string;
}

export function TrackInfo({ artwork, title, artist }: TrackInfoProps) {
  const defaultArtwork = "/placeholder.svg";

  return (
    <div className="flex items-center gap-4">
      <img
        src={artwork || defaultArtwork}
        alt={title}
        className="w-12 h-12 rounded object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = defaultArtwork;
        }}
      />
      <div className="min-w-0">
        <p className="font-medium text-white truncate">{title}</p>
        <p className="text-sm text-white/60 truncate">{artist}</p>
      </div>
    </div>
  );
}
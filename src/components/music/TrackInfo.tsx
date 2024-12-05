interface TrackInfoProps {
  artwork: string;
  title: string;
  artist: string;
}

export function TrackInfo({ artwork, title, artist }: TrackInfoProps) {
  const defaultArtwork = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

  return (
    <div className="flex items-center space-x-4">
      <img
        src={artwork || defaultArtwork}
        alt={title}
        className="w-12 h-12 rounded object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = defaultArtwork;
        }}
      />
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-white/60">{artist}</p>
      </div>
    </div>
  );
}
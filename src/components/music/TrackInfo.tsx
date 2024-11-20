interface TrackInfoProps {
  artwork: string;
  title: string;
  artist: string;
}

export function TrackInfo({ artwork, title, artist }: TrackInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={artwork || "/placeholder.svg"}
        alt={title}
        className="w-12 h-12 rounded object-cover"
      />
      <div>
        <p className="font-medium text-black">{title}</p>
        <p className="text-sm text-gray-500">{artist}</p>
      </div>
    </div>
  );
}
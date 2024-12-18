import { Play } from "lucide-react";

interface Playlist {
  title: string;
  image: string;
  category: string;
}

interface PlaylistGridProps {
  playlists: Playlist[];
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map((playlist, index) => (
        <div key={index} className="relative group cursor-pointer">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={playlist.image}
              alt={playlist.title}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">{playlist.category}</p>
            <h3 className="font-medium text-gray-900">{playlist.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
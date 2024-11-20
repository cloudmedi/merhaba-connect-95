import { useState } from "react";
import { type Playlist } from "@/data/playlists";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Play } from "lucide-react";

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: Playlist[];
}

export function PlaylistGrid({ title, description, playlists }: PlaylistGridProps) {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={playlist.artwork}
                alt={playlist.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                <button
                  onClick={() => setCurrentPlaylist(playlist)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 transform"
                >
                  <Play className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-base text-gray-900">{playlist.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {playlist.genre}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {playlist.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentPlaylist && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import type { GridPlaylist } from "./types";

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: GridPlaylist[];
  isLoading?: boolean;
}

export function PlaylistGrid({ title, description, playlists, isLoading = false }: PlaylistGridProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <CatalogLoader foregroundColor="#e5e7eb" backgroundColor="#f3f4f6" />
      </div>
    );
  }

  const handlePlaylistClick = (playlist: GridPlaylist) => {
    navigate(`/manager/playlists/${playlist.id}`);
  };

  const defaultArtwork = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

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
            onClick={() => handlePlaylistClick(playlist)}
          >
            <div className="aspect-square relative overflow-hidden cursor-pointer">
              <img
                src={playlist.artwork_url || defaultArtwork}
                alt={playlist.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = defaultArtwork;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
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
    </div>
  );
}
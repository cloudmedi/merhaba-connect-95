import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface Playlist {
  id: string;
  title: string;
  artwork_url?: string;
  genre?: string;
  mood?: string;
}

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: Playlist[];
  isLoading?: boolean;
}

export function PlaylistGrid({ title, description, playlists, isLoading }: PlaylistGridProps) {
  const navigate = useNavigate();
  const defaultArtwork = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";

  const getArtworkUrl = (url?: string) => {
    if (!url) return defaultArtwork;
    if (url.startsWith('http')) return url;
    return `${url}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="group cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => navigate(`/manager/playlists/${playlist.id}`)}
          >
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              <img
                src={getArtworkUrl(playlist.artwork_url)}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = defaultArtwork;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">
                {playlist.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{playlist.genre}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">{playlist.mood}</span>
              </div>
            </div>
          </Card>
        ))}
        {playlists.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No playlists found</p>
          </div>
        )}
      </div>
    </div>
  );
}
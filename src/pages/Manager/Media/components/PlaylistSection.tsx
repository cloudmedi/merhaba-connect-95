import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistCard } from "./PlaylistCard";

interface Playlist {
  id: number;
  title: string;
  tags: string[];
  artwork: string;
}

interface PlaylistSectionProps {
  title: string;
  description?: string;
  playlists: Playlist[];
  onPlaylistClick?: (playlist: Playlist) => void;
}

export function PlaylistSection({ title, description, playlists, onPlaylistClick }: PlaylistSectionProps) {
  return (
    <div className="mb-12">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <ScrollArea className="pb-4">
        <div className="flex gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              tags={playlist.tags}
              artwork={playlist.artwork}
              className="w-[250px] shrink-0"
              onPlay={() => onPlaylistClick?.(playlist)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
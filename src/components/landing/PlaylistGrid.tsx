import { PlaylistPreview } from "./PlaylistPreview";

interface PlaylistGridProps {
  playlists: any[];
  currentPlayingId: string | null;
  isPlaying: boolean;
  onPlay: (playlist: any) => void;
}

export function PlaylistGrid({
  playlists,
  currentPlayingId,
  isPlaying,
  onPlay
}: PlaylistGridProps) {
  if (!playlists || playlists.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Örnek Playlist Koleksiyonu
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          İşletmenizin atmosferini zenginleştirecek profesyonel müzik listeleri
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <PlaylistPreview
            key={playlist.id}
            playlist={playlist}
            currentPlayingId={currentPlayingId}
            isPlaying={isPlaying}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
}
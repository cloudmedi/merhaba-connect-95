import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SongList } from "@/components/playlists/SongList";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "@/components/playlists/push-dialog/PushPlaylistDialog";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import api from "@/lib/api";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      console.log('Fetching playlist with ID:', id);
      const response = await api.get(`/manager/playlists/${id}`);
      console.log('Playlist response:', response.data);
      return response.data;
    }
  });

  const { data: playlistSongs } = useQuery({
    queryKey: ['playlist-songs', id],
    queryFn: async () => {
      console.log('Fetching songs for playlist ID:', id);
      const response = await api.get(`/manager/playlists/${id}/songs`);
      console.log('Playlist songs response:', response.data);
      return response.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return <PlaylistDetailLoader />;
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Playlist not found</h2>
          <button 
            onClick={() => navigate("/manager")}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Back to Media Library
          </button>
        </div>
      </div>
    );
  }

  const handleSongSelect = (song: any) => {
    const index = playlistSongs?.findIndex((s: any) => s.songId._id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePlayClick = () => {
    if (playlistSongs && playlistSongs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  const calculateTotalDuration = () => {
    if (!playlistSongs || playlistSongs.length === 0) return "0 min";
    
    const totalSeconds = playlistSongs.reduce((acc: number, song: any) => {
      return acc + (song.songId.duration || 0);
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  // Şarkı verilerini doğru formata dönüştür
  const formattedSongs = playlistSongs?.map((song: any) => ({
    id: song.songId._id,
    title: song.songId.title,
    artist: song.songId.artist || "Unknown Artist",
    duration: song.songId.duration,
    file_url: song.songId.fileUrl,
    bunny_id: song.songId.bunnyId
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
        <PlaylistHeader
          onBack={() => navigate("/manager")}
          artworkUrl={playlist.artworkUrl}
          name={playlist.name}
          genreName={playlist.genre?.name}
          moodName={playlist.mood?.name}
          songCount={playlistSongs?.length || 0}
          duration={calculateTotalDuration()}
          onPlay={handlePlayClick}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList 
          songs={formattedSongs}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          onCurrentSongIndexChange={setCurrentSongIndex}
          isPlaying={isPlaying}
        />

        {isPlaying && formattedSongs.length > 0 && (
          <MusicPlayer
            playlist={{
              title: playlist.name,
              artwork: playlist.artworkUrl || "/placeholder.svg",
              songs: formattedSongs
            }}
            onClose={() => setIsPlaying(false)}
            initialSongIndex={currentSongIndex}
            onSongChange={setCurrentSongIndex}
            autoPlay={true}
          />
        )}

        <PushPlaylistDialog
          isOpen={isPushDialogOpen}
          onClose={() => setIsPushDialogOpen(false)}
          playlistTitle={playlist.name}
          playlistId={playlist._id}
        />
      </div>
    </div>
  );
}
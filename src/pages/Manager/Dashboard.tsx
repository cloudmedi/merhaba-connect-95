import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { HeroPlaylist } from "@/components/dashboard/HeroPlaylist";
import { usePlaylistSubscription } from "@/hooks/usePlaylistSubscription";
import { MusicPlayer } from "@/components/MusicPlayer";
import { usePlaylistControl } from "@/components/dashboard/hooks/usePlaylistControl";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import api from "@/lib/api";

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    currentPlaylist,
    isPlaying,
    handlePlayPlaylist,
    handlePlayStateChange,
    handleClose
  } = usePlaylistControl();

  usePlaylistSubscription();

  // Hero playlist için ayrı query
  const { data: heroPlaylist, isLoading: isHeroLoading } = useQuery({
    queryKey: ['hero-playlist'],
    queryFn: async () => {
      console.log('Fetching hero playlist...');
      const { data } = await api.get('/manager/playlists/hero');
      console.log('Hero playlist response:', data);
      return data;
    }
  });

  // Normal playlist'ler için query
  const { data: playlists, isLoading: isPlaylistsLoading } = useQuery({
    queryKey: ['manager-playlists', searchQuery],
    queryFn: async () => {
      console.log('Fetching manager playlists...');
      const { data } = await api.get('/manager/playlists');
      console.log('Manager playlists response:', data);
      return data;
    }
  });

  // Playlist'leri grid için uygun formata dönüştür
  const transformedPlaylists = playlists?.map(playlist => ({
    id: playlist._id,
    title: playlist.name,
    artwork_url: playlist.artworkUrl || "/placeholder.svg",
    genre: playlist.genre?.name || "Various",
    mood: playlist.mood?.name || "Various"
  })) || [];

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-64px)]">
      <ResizablePanel defaultSize={100} minSize={30}>
        <div className="h-full p-6">
          {heroPlaylist && (
            <HeroPlaylist 
              playlist={heroPlaylist} 
              isLoading={isHeroLoading}
            />
          )}

          <div className="flex justify-end mb-8">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <PlaylistGrid
            title="All Playlists"
            playlists={transformedPlaylists}
            isLoading={isPlaylistsLoading}
            onPlay={handlePlayPlaylist}
            currentPlayingId={currentPlaylist?.id}
            isPlaying={isPlaying}
          />

          {currentPlaylist && (
            <MusicPlayer
              playlist={{
                title: currentPlaylist.title,
                artwork: currentPlaylist.artwork_url,
                songs: currentPlaylist.songs
              }}
              onClose={handleClose}
              onPlayStateChange={handlePlayStateChange}
              autoPlay={true}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
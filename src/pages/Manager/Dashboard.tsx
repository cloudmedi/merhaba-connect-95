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

  const { data: heroPlaylist, isLoading: isHeroLoading } = useQuery({
    queryKey: ['hero-playlist'],
    queryFn: async () => {
      const { data } = await api.get('/manager/playlists/hero');
      return data;
    }
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['manager-categories', searchQuery],
    queryFn: async () => {
      const { data } = await api.get(`/manager/categories?search=${searchQuery}`);
      return data;
    }
  });

  // Filter categories that have playlists
  const filteredCategories = categories?.filter(category =>
    category.playlists?.length > 0
  ) || [];

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-64px)]">
      <ResizablePanel defaultSize={100} minSize={30}>
        <div className="h-full p-6">
          <HeroPlaylist 
            playlist={heroPlaylist} 
            isLoading={isHeroLoading}
            onPlay={handlePlayPlaylist}
            isPlaying={isPlaying && currentPlaylist?.id === heroPlaylist?.id}
          />

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

          <div className="space-y-12">
            {filteredCategories.map((category) => (
              <PlaylistGrid
                key={category.id}
                title={category.name}
                description={category.description}
                categoryId={category.id}
                playlists={category.playlists.map(playlist => ({
                  id: playlist.id,
                  title: playlist.name,
                  artwork_url: playlist.artwork_url,
                  genre: playlist.genre?.name || "Various",
                  mood: playlist.mood?.name || "Various"
                }))}
                isLoading={isCategoriesLoading}
                onPlay={handlePlayPlaylist}
                currentPlayingId={currentPlaylist?.id}
                isPlaying={isPlaying}
              />
            ))}
          </div>

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
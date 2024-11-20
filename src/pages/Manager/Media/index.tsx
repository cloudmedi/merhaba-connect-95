import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { PlaylistBanner } from "./components/PlaylistBanner";
import { PlaylistSection } from "./components/PlaylistSection";
import { useToast } from "@/components/ui/use-toast";

const mockPlaylists = [
  {
    id: 1,
    title: "Summer Vibes 2024",
    tags: ["Pop", "Energetic"],
    artwork: "/path/to/summer-vibes.jpg"
  },
  {
    id: 2,
    title: "Relaxing Jazz",
    tags: ["Jazz", "Calm"],
    artwork: "/path/to/relaxing-jazz.jpg"
  },
  {
    id: 3,
    title: "Coffee Shop Ambience",
    tags: ["Ambient", "Relaxed"],
    artwork: "/path/to/coffee-shop.jpg"
  }
];

export default function Media() {
  const { toast } = useToast();

  const handlePlaylistClick = (playlist: typeof mockPlaylists[0]) => {
    toast({
      title: "Playing Playlist",
      description: `Now playing: ${playlist.title}`,
    });
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <PlaylistBanner
          title="Chill Beats"
          description="Feel the groove with our latest tracks. Perfect for any relaxing moment."
        />
        <PlaylistSection
          title="Popular Playlists"
          description="Most played this week"
          playlists={mockPlaylists}
          onPlaylistClick={handlePlaylistClick}
        />
      </div>
    </ManagerLayout>
  );
}
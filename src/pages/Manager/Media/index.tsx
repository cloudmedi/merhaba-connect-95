import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistBanner } from "./components/PlaylistBanner";
import { PlaylistSection } from "./components/PlaylistSection";
import { useToast } from "@/components/ui/use-toast";

// Mock data - Replace with actual API data
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
  },
  {
    id: 4,
    title: "Shopping Mall Hits",
    tags: ["Pop", "Upbeat"],
    artwork: "/path/to/shopping-hits.jpg"
  },
  {
    id: 5,
    title: "Dinner Time Classics",
    tags: ["Classical", "Elegant"],
    artwork: "/path/to/dinner-classics.jpg"
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
    <DashboardLayout>
      <div className="space-y-6">
        <PlaylistBanner
          title="Chill Beats"
          description="Feel the groove with tracks like 'Conquer the Storm,' 'My Side,' and 'Magic Ride.' Let the soothing beats take you on a journey through laid-back melodies and chill vibes, perfect for any relaxing moment."
        />

        <PlaylistSection
          title="Cafe Channel"
          description="Time to get cozy"
          playlists={mockPlaylists}
          onPlaylistClick={handlePlaylistClick}
        />

        <PlaylistSection
          title="Popular today"
          description="Time to get cozy"
          playlists={mockPlaylists}
          onPlaylistClick={handlePlaylistClick}
        />

        <PlaylistSection
          title="Trending Playlists"
          description="Time to get cozy"
          playlists={mockPlaylists}
          onPlaylistClick={handlePlaylistClick}
        />
      </div>
    </DashboardLayout>
  );
}
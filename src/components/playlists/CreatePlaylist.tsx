import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistEditor } from "./components/PlaylistEditor";

interface CreatePlaylistProps {
  initialSelectedSongs?: any[];
}

export function CreatePlaylist({ initialSelectedSongs }: CreatePlaylistProps) {
  return (
    <DashboardLayout 
      title="Create New Playlist" 
      description="Create and customize your playlist"
    >
      <PlaylistEditor initialSelectedSongs={initialSelectedSongs} />
    </DashboardLayout>
  );
}
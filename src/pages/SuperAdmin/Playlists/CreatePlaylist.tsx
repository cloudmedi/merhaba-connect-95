import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistEditor } from "./components/PlaylistEditor";

export function CreatePlaylist() {
  return (
    <DashboardLayout 
      title="Create New Playlist" 
      description="Create and customize your playlist"
    >
      <PlaylistEditor />
    </DashboardLayout>
  );
}
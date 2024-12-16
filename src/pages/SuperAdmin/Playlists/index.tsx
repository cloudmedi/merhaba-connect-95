import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistsContent } from "./PlaylistsContent";

export default function Playlists() {
  return (
    <DashboardLayout 
      title="Playlists" 
      description="Manage and organize your music playlists"
    >
      <PlaylistsContent />
    </DashboardLayout>
  );
}
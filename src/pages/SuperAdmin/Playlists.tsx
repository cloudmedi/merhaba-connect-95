import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaylistsContent } from "./Playlists/PlaylistsContent";
import { Routes, Route } from "react-router-dom";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";

export default function Playlists() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout 
            title="Playlists" 
            description="Manage and organize your playlists"
          >
            <PlaylistsContent />
          </DashboardLayout>
        }
      />
      <Route
        path="create"
        element={
          <DashboardLayout 
            title="Create Playlist" 
            description="Create a new playlist"
          >
            <CreatePlaylist />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
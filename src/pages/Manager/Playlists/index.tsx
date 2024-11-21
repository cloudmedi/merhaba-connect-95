import { DashboardLayout } from "@/components/DashboardLayout";

export default function Playlists() {
  return (
    <DashboardLayout title="Playlists" description="Manage your playlists">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        {/* Playlist content will be implemented later */}
        <p>Playlist management coming soon...</p>
      </div>
    </DashboardLayout>
  );
}
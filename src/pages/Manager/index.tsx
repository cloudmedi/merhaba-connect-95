import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ManagerHeader } from "@/components/ManagerHeader";
import ManagerDashboard from "./Dashboard";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";
import { CategoryPlaylists } from "./Playlists/CategoryPlaylists";
import Playlists from "./Playlists";
import Devices from "./Devices";
import Schedule from "./Schedule";
import Announcements from "./Announcements";
import Settings from "./Settings";
import ProfileSettings from "./Settings/Profile";
import { useWebSocketConnection } from "@/hooks/useWebSocketConnection";

export default function Manager() {
  const { user, isLoading } = useAuth();
  useWebSocketConnection();

  // Auth check
  if (!isLoading && !user) {
    return <Navigate to="/manager/login" replace />;
  }

  // Role check
  if (!isLoading && user && user.role !== 'manager') {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col h-screen">
        <ManagerHeader />
        <main className="flex-1 overflow-auto px-4 md:px-8 py-6 max-w-[1400px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/category/:categoryId" element={<CategoryPlaylists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/profile" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
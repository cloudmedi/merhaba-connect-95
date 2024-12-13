import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useManagerAuth";
import Dashboard from "./Dashboard";
import Devices from "./Devices";
import Playlists from "./Playlists";
import Schedule from "./Schedule";
import Settings from "./Settings";
import Announcements from "./Announcements";
import OfflinePlayers from "./OfflinePlayers";
import { ManagerHeader } from "@/components/ManagerHeader";

export default function Manager() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/manager/login" replace />;
  }

  if (user.role !== 'manager') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <ManagerHeader />
      <main className="p-6">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="devices/*" element={<Devices />} />
          <Route path="playlists/*" element={<Playlists />} />
          <Route path="schedule/*" element={<Schedule />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="announcements/*" element={<Announcements />} />
          <Route path="offline-players" element={<OfflinePlayers />} />
        </Routes>
      </main>
    </div>
  );
}
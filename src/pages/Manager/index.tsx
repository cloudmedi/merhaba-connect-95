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
import { DashboardLayout } from "@/components/DashboardLayout";

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
    <div className="min-h-screen bg-[#F8F9FC]">
      <ManagerHeader />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="devices/*" element={
          <DashboardLayout title="Devices">
            <Devices />
          </DashboardLayout>
        } />
        <Route path="playlists/*" element={
          <DashboardLayout title="Playlists">
            <Playlists />
          </DashboardLayout>
        } />
        <Route path="schedule/*" element={
          <DashboardLayout title="Schedule">
            <Schedule />
          </DashboardLayout>
        } />
        <Route path="settings/*" element={
          <DashboardLayout title="Settings">
            <Settings />
          </DashboardLayout>
        } />
        <Route path="announcements/*" element={
          <DashboardLayout title="Announcements">
            <Announcements />
          </DashboardLayout>
        } />
        <Route path="offline-players" element={
          <DashboardLayout title="Offline Players">
            <OfflinePlayers />
          </DashboardLayout>
        } />
      </Routes>
    </div>
  );
}
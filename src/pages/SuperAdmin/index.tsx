import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/SuperAdminAuthContext";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Playlists from "./Playlists";
import Music from "./Music";
import Categories from "./Categories";
import Moods from "./Moods";
import Genres from "./Genres";
import Settings from "./Settings";
import Reports from "./Reports";
import Notifications from "./Notifications";
import Performance from "./Performance";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function SuperAdmin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/super-admin/login" replace />;
  }

  if (user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="playlists/*" element={<Playlists />} />
        <Route path="music" element={<Music />} />
        <Route path="genres" element={<Genres />} />
        <Route path="categories" element={<Categories />} />
        <Route path="moods" element={<Moods />} />
        <Route path="notifications/*" element={<Notifications />} />
        <Route path="settings/*" element={<Settings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="performance" element={<Performance />} />
      </Routes>
    </DashboardLayout>
  );
}
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import Dashboard from "./SuperAdmin/Dashboard";
import Users from "./SuperAdmin/Users";
import Playlists from "./SuperAdmin/Playlists";
import Music from "./SuperAdmin/Music";
import Categories from "./SuperAdmin/Categories";
import Moods from "./SuperAdmin/Moods";
import Genres from "./SuperAdmin/Genres";
import Settings from "./SuperAdmin/Settings";
import Reports from "./SuperAdmin/Reports";
import Notifications from "./SuperAdmin/Notifications";
import Performance from "./SuperAdmin/Performance";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";

export default function SuperAdmin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/super-admin/login" replace />;
  }

  if (user.role !== 'super_admin') {
    console.log('User is not super_admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="playlists" element={<Playlists />} />
      <Route path="playlists/create" element={<CreatePlaylist />} />
      <Route path="music" element={<Music />} />
      <Route path="genres" element={<Genres />} />
      <Route path="categories" element={<Categories />} />
      <Route path="moods" element={<Moods />} />
      <Route path="notifications/*" element={<Notifications />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path="reports" element={<Reports />} />
      <Route path="performance" element={<Performance />} />
    </Routes>
  );
}
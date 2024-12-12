import { Routes, Route } from "react-router-dom";
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
import SuperAdminLogin from "./SuperAdmin/Auth/Login";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function SuperAdmin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (!user && window.location.pathname !== "/super-admin/login") {
    return <Navigate to="/super-admin/login" replace />;
  }

  // Eğer kullanıcı giriş yapmışsa ve login sayfasındaysa, dashboard'a yönlendir
  if (user && window.location.pathname === "/super-admin/login") {
    return <Navigate to="/super-admin" replace />;
  }

  return (
    <Routes>
      <Route path="login" element={<SuperAdminLogin />} />
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
import { Routes, Route, Navigate } from "react-router-dom";
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
import SuperAdminRegister from "./SuperAdmin/Auth/Register";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function SuperAdmin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Eğer kullanıcı giriş yapmamışsa ve auth sayfalarında değilse, login'e yönlendir
  if (!user && !["/super-admin/login", "/super-admin/register"].includes(window.location.pathname)) {
    return <Navigate to="/super-admin/login" replace />;
  }

  // Eğer kullanıcı giriş yapmışsa ve auth sayfalarındaysa, dashboard'a yönlendir
  if (user && ["/super-admin/login", "/super-admin/register"].includes(window.location.pathname)) {
    return <Navigate to="/super-admin" replace />;
  }

  // Auth sayfaları için layout kullanma
  if (["/super-admin/login", "/super-admin/register"].includes(window.location.pathname)) {
    return (
      <Routes>
        <Route path="login" element={<SuperAdminLogin />} />
        <Route path="register" element={<SuperAdminRegister />} />
      </Routes>
    );
  }

  // Diğer tüm sayfalar için DashboardLayout kullan
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="users"
        element={
          <DashboardLayout>
            <Users />
          </DashboardLayout>
        }
      />
      <Route
        path="playlists"
        element={
          <DashboardLayout>
            <Playlists />
          </DashboardLayout>
        }
      />
      <Route
        path="playlists/create"
        element={
          <DashboardLayout>
            <CreatePlaylist />
          </DashboardLayout>
        }
      />
      <Route
        path="music"
        element={
          <DashboardLayout>
            <Music />
          </DashboardLayout>
        }
      />
      <Route
        path="genres"
        element={
          <DashboardLayout>
            <Genres />
          </DashboardLayout>
        }
      />
      <Route
        path="categories"
        element={
          <DashboardLayout>
            <Categories />
          </DashboardLayout>
        }
      />
      <Route
        path="moods"
        element={
          <DashboardLayout>
            <Moods />
          </DashboardLayout>
        }
      />
      <Route
        path="notifications/*"
        element={
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        }
      />
      <Route
        path="settings/*"
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />
      <Route
        path="reports"
        element={
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        }
      />
      <Route
        path="performance"
        element={
          <DashboardLayout>
            <Performance />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
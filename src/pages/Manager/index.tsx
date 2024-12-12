import { Routes, Route, Navigate } from "react-router-dom";
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
import ManagerLogin from "./Auth/Login";
import ManagerRegister from "./Auth/Register";
import { useAuth } from "@/hooks/useAuth";

export default function Manager() {
  const { user, isLoading } = useAuth();
  useWebSocketConnection();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Eğer kullanıcı giriş yapmamışsa ve auth sayfalarında değilse, login'e yönlendir
  if (!user && !window.location.pathname.match(/\/manager\/(login|register)/)) {
    return <Navigate to="/manager/login" replace />;
  }

  // Eğer kullanıcı giriş yapmışsa ve auth sayfalarındaysa, dashboard'a yönlendir
  if (user && window.location.pathname.match(/\/manager\/(login|register)/)) {
    return <Navigate to="/manager" replace />;
  }

  // Auth sayfaları için header'ı gösterme
  if (window.location.pathname.match(/\/manager\/(login|register)/)) {
    return (
      <Routes>
        <Route path="login" element={<ManagerLogin />} />
        <Route path="register" element={<ManagerRegister />} />
      </Routes>
    );
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
import { Routes, Route } from "react-router-dom";
import { ManagerLayout } from "@/layouts/ManagerLayout";
import ManagerDashboard from "./Dashboard";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";
import { CategoryPlaylists } from "./Playlists/CategoryPlaylists";
import Playlists from "./Playlists";
import Devices from "./Devices";
import Schedule from "./Schedule";
import Announcements from "./Announcements";
import Settings from "./Settings";
import ProfileSettings from "./Settings/Profile";

export default function Manager() {
  return (
    <ManagerLayout>
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
    </ManagerLayout>
  );
}
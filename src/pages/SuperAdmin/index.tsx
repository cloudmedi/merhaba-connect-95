import { Routes, Route } from "react-router-dom";
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Music from "./Music";
import Genres from "./Genres";
import Categories from "./Categories";
import Moods from "./Moods";
import Playlists from "./Playlists";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";
import Notifications from "./Notifications";
import Reports from "./Reports";
import Settings from "./Settings";
import Performance from "./Performance";

export default function SuperAdmin() {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users/*" element={<Users />} />
        <Route path="music/*" element={<Music />} />
        <Route path="genres/*" element={<Genres />} />
        <Route path="categories/*" element={<Categories />} />
        <Route path="moods/*" element={<Moods />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlists/:id" element={<PlaylistDetail />} />
        <Route path="notifications/*" element={<Notifications />} />
        <Route path="performance/*" element={<Performance />} />
        <Route path="reports/*" element={<Reports />} />
        <Route path="settings/*" element={<Settings />} />
      </Routes>
    </SuperAdminLayout>
  );
}
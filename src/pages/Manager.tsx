import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Manager/Dashboard";
import Users from "./Manager/Users";
import Music from "./Manager/Music";
import Genres from "./Manager/Genres";
import Categories from "./Manager/Categories";
import Moods from "./Manager/Moods";
import Playlists from "./Manager/Playlists";
import Notifications from "./Manager/Notifications";
import Performance from "./Manager/Performance";
import Reports from "./Manager/Reports";
import Settings from "./Manager/Settings";

export default function Manager() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users/*" element={<Users />} />
      <Route path="music/*" element={<Music />} />
      <Route path="genres/*" element={<Genres />} />
      <Route path="categories/*" element={<Categories />} />
      <Route path="moods/*" element={<Moods />} />
      <Route path="playlists/*" element={<Playlists />} />
      <Route path="notifications/*" element={<Notifications />} />
      <Route path="performance/*" element={<Performance />} />
      <Route path="reports/*" element={<Reports />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}
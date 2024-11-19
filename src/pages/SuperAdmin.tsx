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
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";

export default function SuperAdmin() {
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
    </Routes>
  );
}
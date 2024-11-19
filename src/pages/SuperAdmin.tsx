import { Routes, Route } from "react-router-dom";
import Dashboard from "./SuperAdmin/Dashboard";
import Playlists from "./SuperAdmin/Playlists";
import Genres from "./SuperAdmin/Genres";
import Categories from "./SuperAdmin/Categories";
import Moods from "./SuperAdmin/Moods";
import { CreatePlaylist } from "@/components/playlists/CreatePlaylist";

export default function SuperAdmin() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="playlists" element={<Playlists />} />
      <Route path="playlists/create" element={<CreatePlaylist />} />
      <Route path="genres" element={<Genres />} />
      <Route path="categories" element={<Categories />} />
      <Route path="moods" element={<Moods />} />
    </Routes>
  );
}
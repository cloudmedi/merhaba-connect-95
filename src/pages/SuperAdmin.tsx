import { Routes, Route } from "react-router-dom";
import Dashboard from "./SuperAdmin/Dashboard";
import Playlists from "./SuperAdmin/Playlists";
import Genres from "./SuperAdmin/Genres";
import Categories from "./SuperAdmin/Categories";

export default function SuperAdmin() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="playlists" element={<Playlists />} />
      <Route path="playlists/create" element={<CreatePlaylist />} />
      <Route path="genres" element={<Genres />} />
      <Route path="categories" element={<Categories />} />
    </Routes>
  );
}
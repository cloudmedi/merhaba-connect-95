import { Routes, Route } from "react-router-dom";
import Dashboard from "./SuperAdmin/Dashboard";
import Playlists from "./SuperAdmin/Playlists";

export default function SuperAdmin() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="playlists" element={<Playlists />} />
    </Routes>
  );
}
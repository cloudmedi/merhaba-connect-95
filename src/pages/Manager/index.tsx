import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { DashboardLayout } from "@/components/DashboardLayout";
import Announcements from "./Announcements";
import Devices from "./Devices";
import Playlists from "./Playlists/PlaylistDetail";

export default function Manager() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/devices" element={<Devices />} />
      </Routes>
    </DashboardLayout>
  );
}
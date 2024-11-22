import { Routes, Route } from "react-router-dom";
import { ManagerHeader } from "@/components/ManagerHeader";
import { ManagerNav } from "@/components/ManagerNav";
import ManagerDashboard from "./Dashboard";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";
import Playlists from "./Playlists";
import Devices from "./Devices";
import Schedule from "./Schedule";
import Announcements from "./Announcements";

export default function Manager() {
  return (
    <div className="flex min-h-screen bg-gray-100/40">
      <ManagerNav />
      <div className="flex-1">
        <ManagerHeader />
        <main className="p-8">
          <Routes>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/announcements" element={<Announcements />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
import { Routes, Route } from "react-router-dom";
import { ManagerHeader } from "@/components/ManagerHeader";
import { ManagerNav } from "@/components/ManagerNav";
import ManagerDashboard from "./Dashboard";
import { PlaylistDetail } from "./Playlists/PlaylistDetail";

export default function Manager() {
  return (
    <div className="flex min-h-screen bg-gray-100/40">
      <ManagerNav />
      <div className="flex-1">
        <ManagerHeader />
        <main className="p-8">
          <Routes>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
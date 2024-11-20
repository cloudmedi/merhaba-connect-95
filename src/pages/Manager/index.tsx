import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "./Dashboard";
import { ManagerNav } from "@/components/ManagerNav";
import { PlaylistDetail } from "@/components/playlists/PlaylistDetail";

export default function Manager() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <ManagerNav />
      <main className="flex-1 overflow-auto w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<ManagerDashboard />} />
              <Route path="playlists/:id" element={<PlaylistDetail />} />
              {/* Other routes will be added here */}
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

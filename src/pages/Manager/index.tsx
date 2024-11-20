import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "./Dashboard";
import { ManagerNav } from "@/components/ManagerNav";
import { PlaylistDetail } from "@/components/playlists/PlaylistDetail";
import { ManagerHeader } from "@/components/ManagerHeader";

export default function Manager() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <ManagerNav />
      <div className="flex-1 flex flex-col w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64">
        <ManagerHeader />
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            <Routes>
              <Route index element={<ManagerDashboard />} />
              <Route path="playlists/:id" element={<PlaylistDetail />} />
              {/* Other routes will be added here */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
